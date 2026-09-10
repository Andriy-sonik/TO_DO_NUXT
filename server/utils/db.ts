import type { Db } from 'mongodb'
import { MongoClient } from 'mongodb'

let client: MongoClient | null = null
let database: Db | null = null

export async function useDatabase() {
  if (database) {
    return database
  }

  const config = useRuntimeConfig()

  if (!config.mongodbUri) {
    throw createError({
      statusCode: 500,
      statusMessage: 'MongoDB URI is not configured',
    })
  }

  client = await MongoClient.connect(config.mongodbUri)
  database = client.db(config.mongodbDbName)

  return database
}
