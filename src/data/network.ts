type TableName =
  | "yellow_tripdata_2019-01.parquet"
  | "yellow_tripdata_2019-02.parquet"
  | "yellow_tripdata_2019-03.parquet"

export const fetchParquetData = async (
  tableName: TableName
): Promise<Uint8Array> => {
  const response = await fetch(`${tableName}`)
  const buffer = await response.arrayBuffer()

  return new Uint8Array(buffer)
}

export const fetchAvailableParquetData = async (): Promise<string[]> => {
  const response = await fetch("index.json")

  return await response.json()
}
