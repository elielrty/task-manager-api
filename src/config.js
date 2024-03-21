import dotenv from 'dotenv'
import { randomUUID } from 'node:crypto'

dotenv.config()

const randomName = randomUUID().slice(0, 4)

const dbUser = process.env.DB_USER || 'root'
const dbPassword = process.env.DB_PASSWORD || 'example'
const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || '27017'
const dbName = process.env.DB_NAME || `${randomName}-test`

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || '5000',
  jwt: {
    secret: process.env.JWT_SECRET || 'shh',
    expiration: process.env.JWT_EXP || '1h',
    expirationRefresh: process.env.JWT_EXP_REFRESH || '1M', // (M = month)
  },
  auth: {
    api_key: process.env.API_KEY || '',
  },
  mongo: {
    dbURL: `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}`,
    dbName: dbName,
    options: {
      serverSelectionTimeoutMS: 10000,
    },
  },
}
