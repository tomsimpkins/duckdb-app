import * as duckdb from "@duckdb/duckdb-wasm"

export class DuckdbClient {
  private db: duckdb.AsyncDuckDB
  constructor(db: duckdb.AsyncDuckDB) {
    this.db = db
    db.open({ query: { castBigIntToDouble: true } })
  }

  async describeTables(): Promise<string[]> {
    const conn = await this.db.connect()
    const tables = (await conn.query(`SHOW TABLES`)).toArray()

    return tables.map(({ name }) => name)
  }

  async describeColumns(table: string) {
    const conn = await this.db.connect()
    const columns = (
      await conn.query(`DESCRIBE SELECT * FROM '${table}'`)
    ).toArray()

    return columns.map(({ column_name, column_type }) => {
      return {
        name: column_name,
        type: column_type,
        databaseType: column_type,
      }
    })
  }

  async insertParquet(name: string, buffer: Uint8Array): Promise<any> {
    await this.db.registerFileBuffer(name, new Uint8Array(buffer))

    const conn = await this.db.connect()
    await conn.query(
      `CREATE VIEW '${name}' AS SELECT * FROM parquet_scan('${name}')`
    )
    await conn.close()
  }

  async insertJSON(name: string, json: any) {
    await this.db.registerFileText(name, JSON.stringify(json))

    const conn = await this.db.connect()
    await conn.insertJSONFromPath(name, { name })
    await conn.close()
  }

  async updateWithJSONDelta(targetTable: string, json: any) {
    await this.insertJSON(targetTable + "_mutation", json) // add the json
    const conn = await this.db.connect()
  }

  async query(query: string, params?: any[]) {
    const conn = await this.db.connect()

    let result
    if (params) {
      const stmt = await conn.prepare(query)
      result = await stmt.query(...params)
    } else {
      result = await conn.query(query)
    }
    await conn.close()

    const rowified = result.toArray().map(Object.fromEntries)
    console.log(result)

    return rowified
  }
}
