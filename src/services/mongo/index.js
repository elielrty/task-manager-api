import { MongoClient } from 'mongodb'
import { loggerError } from '../logger/index.js'

const connect = async ({ host, options }) => {
  try {
    return await new MongoClient(host, options).connect()
  } catch (error) {
    loggerError.error(
      `Failed to connect to the database. ${error.stack}`,
      error,
    )

    throw error
  }
}

export { connect }
