import { findCompanyByKey } from '../api/company/company.dao.js'
import { findPersonByID } from '../api/people/people.dao.js'
import { verifyToken } from '../api/tokens/tokens.helper.js'
import config from '../config.js'
import AppError from '../errors/AppError.js'
import { getMessages } from '../services/i18n/index.js'
import { HttpStatus } from '../types/global.enums.js'

const extractHeaders = request => {
  const { headers } = request

  return {
    ...(!!headers.authorization && {
      authorization: headers.authorization.toString(),
    }),
    ...(!!headers['x-api-key'] && {
      xApiKey: headers['x-api-key'].toString(),
    }),
  }
}

const extractAuthorizationTokenData = token => {
  if (!token) {
    return null
  }

  const { personID } = verifyToken(token)
  return { personID }
}

const extractPersonData = async (request, _, next) => {
  const messages = getMessages()
  try {
    const { authorization, xApiKey } = extractHeaders(request)

    const tenantsDB = await request.locals.mongo.db(config.mongo.dbName)

    const company = await findCompanyByKey(tenantsDB, xApiKey)
    if (!company) {
      throw new AppError(
        messages.errors.company[404],
        null,
        HttpStatus.Unauthorized,
      )
    }

    request.company = company
    request.messages = messages
    request.tenantsDB = tenantsDB

    const { tenant } = company
    const db = await request.app.locals.mongo.db(tenant)
    request.db = db

    const tokenData = extractAuthorizationTokenData(authorization)
    if (!tokenData) {
      throw new AppError(
        messages.errors.tokens[401],
        null,
        HttpStatus.Unauthorized,
      )
    }

    const { personID } = tokenData
    const person = await findPersonByID(db, personID)

    if (!person) {
      throw new AppError(
        messages.errors.people[404],
        null,
        HttpStatus.Unauthorized,
      )
    }

    request.messages = getMessages(person.language)
    request.person = person

    return next()
  } catch (error) {
    // @TODO: Temporário enquanto verificamos os problemas de muitos 401
    console.log(`🔴 [extractPersonData] - ${error.message}`)

    if (error instanceof AppError) {
      throw error
    }

    throw new AppError(messages.errors[401], error, HttpStatus.Unauthorized)
  }
}

export { extractPersonData }
