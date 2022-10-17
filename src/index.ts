import {
  loadDuckdb,
  DuckdbClient,
  fetchParquetData,
  fetchAvailableParquetData,
} from "./data"
import { initEcharts } from "./initEcharts"

const main = async (): Promise<void> => {
  const dbClient = new DuckdbClient(await loadDuckdb())
  const yellowTaxiData = await fetchParquetData(
    "yellow_tripdata_2019-01.parquet"
  )

  const tableNames = await fetchAvailableParquetData()
  const tableName = await tableNames[0]
  await dbClient.insertParquet(tableName, yellowTaxiData)

  const countByPaymentType = await dbClient.query(
    `SELECT payment_type, COUNT(*) FROM '${tableName}' GROUP BY payment_type`
  )

  const myChart = await initEcharts()
  // Draw the chart
  myChart.setOption({
    dataset: {
      dimensions: ["payment_type", "count_star()"],
      source: countByPaymentType,
    },
    title: {
      text: "ECharts Getting Started Example",
    },
    tooltip: {},
    xAxis: {
      type: "category",
    },
    yAxis: {},
    series: [
      {
        type: "bar",
      },
    ],
  })
}

main()
