import got from "got"
import fs from "fs/promises"

const CLOUDFRONT_BUCKET_DIRECTORY =
  "https://d37ci6vzurychx.cloudfront.net/trip-data/"

const STATIC_DIRECTORY = "./static/"

const yellowTripDataFiles = [
  "yellow_tripdata_2019-01.parquet",
  "yellow_tripdata_2019-02.parquet",
  "yellow_tripdata_2019-03.parquet",
]

const execute = async () => {
  await fs.rm(STATIC_DIRECTORY, { recursive: true, force: true })
  await fs.mkdir(STATIC_DIRECTORY)

  const executeSingle = async (name) => {
    const buffer = (await got.get(`${CLOUDFRONT_BUCKET_DIRECTORY}${name}`))
      .rawBody

    await fs.writeFile(`${STATIC_DIRECTORY}${name}`, buffer)
  }

  await Promise.all(yellowTripDataFiles.map(executeSingle))

  await fs.writeFile(
    `${STATIC_DIRECTORY}index.json`,
    JSON.stringify(yellowTripDataFiles),
    { encoding: "utf-8" }
  )
}

execute()
