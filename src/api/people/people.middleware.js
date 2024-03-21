// import { celebrate, Joi, Segments } from 'celebrate'
// import { NextFunction, Request, Response } from 'express'

// import AppError from '../../errors/AppError'
// import { isDefined, isNullOrUndefined } from '../../helpers/object-helper'
// import {
//   objectId,
//   paginationBaseSchema,
// } from '../../helpers/validations-helper'
// import { findGoogleWorkspaceEmail } from '../../services/google'
// import { HttpStatus } from '../../types/global.enums'
// import { findAndCountDesks } from '../desks/desks.dao'
// import {
//   findPersonByID,
//   findPersonByEmail,
//   findPeopleByIDs,
// } from './people.dao'
// import { checkPersonAssociationWithDesks } from './people.helper'
// import { types, Languages } from './people.types'

// const paramsBaseSchema = {
//   personID: objectId(Joi).required(),
// }

// const validateCreatePersonSchema = celebrate({
//   [Segments.BODY]: {
//     email: Joi.string().email().required(),
//     language: Joi.string()
//       .valid(...Object.values(Languages))
//       .optional(),
//     type: Joi.string()
//       .valid(...Object.values(types))
//       .required(),
//   },
// })

// const validateFetchPeopleSchema = celebrate({
//   [Segments.QUERY]: {
//     ...paginationBaseSchema,
//     email: Joi.string().email().optional(),
//     name: Joi.string().optional(),
//     language: Joi.string()
//       .valid(...Object.values(Languages))
//       .optional(),
//     phone: Joi.string().optional(),
//     cpf: Joi.string().optional(),
//     type: Joi.string()
//       .valid(...Object.values(types))
//       .optional(),
//     status: Joi.string().optional(),
//   },
// })

// const validateFetchPersonSchema = celebrate({
//   [Segments.PARAMS]: paramsBaseSchema,
// })

// const validateEditPersonSchema = celebrate({
//   [Segments.PARAMS]: paramsBaseSchema,
//   [Segments.BODY]: {
//     type: Joi.string()
//       .valid(...Object.values(types))
//       .optional(),
//     language: Joi.string()
//       .valid(...Object.values(Languages))
//       .optional(),
//     status: Joi.string().optional(),
//   },
// })

// const validateFetchDashboardPeopleSchema = celebrate({
//   [Segments.QUERY]: {
//     comarcaID: objectId(Joi).optional(),
//     varaID: objectId(Joi).optional(),
//     deskID: objectId(Joi).optional(),
//     personID: objectId(Joi).optional(),
//     startDate: Joi.date().optional(),
//     endDate: Joi.date().optional(),
//   },
// })

// const validateFetchDashboardGraphPeopleSchema = celebrate({
//   [Segments.QUERY]: {
//     comarcaID: objectId(Joi).optional(),
//     varaID: objectId(Joi).optional(),
//     deskID: objectId(Joi).optional(),
//     personID: objectId(Joi).optional(),
//     startDate: Joi.date().optional(),
//     endDate: Joi.date().optional(),
//   },
// })

// const validateRemovePersonSchema = celebrate({
//   [Segments.PARAMS]: paramsBaseSchema,
// })

// const validateUniquePerson = async (
//   request: Request,
//   _: Response,
//   next: NextFunction,
// ) => {
//   const {
//     db,
//     messages,
//     body: { email },
//   } = request

//   const checkPersonByEmail = await findPersonByEmail(db, email)

//   if (isDefined(checkPersonByEmail)) {
//     throw new AppError(messages.errors.people[409], null, HttpStatus.Conflict)
//   }

//   return next()
// }

// const validatePersonExistence = async (
//   request: Request,
//   _: Response,
//   next: NextFunction,
// ) => {
//   const { db, messages, query, params, body } = request

//   const personID = params.personID || query.personID || body.personID

//   if (isNullOrUndefined(personID)) {
//     return next()
//   }

//   const person = await findPersonByID(db, personID)

//   if (isNullOrUndefined(person)) {
//     throw new AppError(messages.errors.people[404], null, HttpStatus.NotFound)
//   }

//   request.locals.person = person

//   return next()
// }

// const validatePeopleExistence = async (
//   request: Request,
//   _: Response,
//   next: NextFunction,
// ) => {
//   const { db, messages, body } = request

//   const { peopleIDs } = body

//   if (isNullOrUndefined(peopleIDs)) {
//     return next()
//   }

//   // isEmpty
//   if (Array.isArray(peopleIDs) && peopleIDs.length === 0) {
//     request.locals.people = []
//     return next()
//   }

//   const people = await findPeopleByIDs(db, peopleIDs)

//   if (isNullOrUndefined(people) || people.length !== peopleIDs.length) {
//     throw new AppError(messages.errors.people[404], null, HttpStatus.NotFound)
//   }

//   request.locals.people = people

//   return next()
// }

// const validateRequesterExistence = async (
//   request: Request,
//   _: Response,
//   next: NextFunction,
// ) => {
//   const { db, messages, body } = request

//   if (isNullOrUndefined(body.requester)) {
//     return next()
//   }

//   if (isNullOrUndefined(body.requester._id)) {
//     return next()
//   }

//   const person = await findPersonByID(db, body.requester._id)

//   if (isNullOrUndefined(person)) {
//     throw new AppError(messages.errors.people[404], null, HttpStatus.NotFound)
//   }

//   request.locals.person = person

//   return next()
// }

// const checkPersonWorkspaceByEmail = async (
//   request: Request,
//   _: Response,
//   next: NextFunction,
// ) => {
//   const { body, messages } = request

//   const { email } = body

//   const person = await findGoogleWorkspaceEmail(email)

//   if (isNullOrUndefined(person)) {
//     throw new AppError(messages.errors.google[404], null, HttpStatus.NotFound)
//   }

//   request.locals.person = person

//   return next()
// }

// const checkPersonIsAdmin = async (
//   request: Request,
//   _: Response,
//   next: NextFunction,
// ) => {
//   const { person, messages } = request

//   if (isNullOrUndefined(person.type)) {
//     throw new AppError(messages.errors[403], null, HttpStatus.Forbidden)
//   }

//   return next()
// }

// const checkPersonIsOwner = async (
//   request: Request,
//   _: Response,
//   next: NextFunction,
// ) => {
//   const { person, messages, body, query, params } = request

//   if (!person) {
//     return next()
//   }

//   const isAdmin = isDefined(person.type)
//   if (isAdmin) {
//     return next()
//   }

//   const authenticatedID = person._id.toString()
//   const ownerID =
//     params.personID ||
//     query.personID ||
//     body.personID ||
//     body.requester?.personID ||
//     body.requester?._id

//   if (!ownerID) {
//     return next()
//   }

//   if (authenticatedID !== ownerID) {
//     throw new AppError(messages.errors.people[403], null, HttpStatus.Forbidden)
//   }

//   return next()
// }

// const checkPersonIsOwnerDashboard = async (
//   request: Request,
//   _: Response,
//   next: NextFunction,
// ) => {
//   const { person, messages, body, query, params } = request

//   if (isDefined(person.type) && person.type !== types.Attendant) {
//     return next()
//   }

//   const authenticatedID = person._id.toString()
//   const ownerID =
//     params.personID ||
//     query.personID ||
//     body.personID ||
//     body.requester?.personID ||
//     body.requester?._id

//   if (!ownerID || authenticatedID !== ownerID) {
//     throw new AppError(messages.errors.people[403], null, HttpStatus.Forbidden)
//   }

//   return next()
// }

// const checkDeskAssociationExistence = async (
//   request: Request,
//   _: Response,
//   next: NextFunction,
// ) => {
//   const { db, messages, params, query } = request

//   const { result: desks } = await findAndCountDesks(db, query)

//   const associationExists = checkPersonAssociationWithDesks(
//     desks,
//     params.personID,
//   )

//   if (associationExists) {
//     throw new AppError(messages.errors.people[409], null, HttpStatus.Conflict)
//   }

//   return next()
// }

// export {
//   validateCreatePersonSchema,
//   validateFetchPeopleSchema,
//   validateFetchPersonSchema,
//   validateEditPersonSchema,
//   validateRemovePersonSchema,
//   validateUniquePerson,
//   validatePersonExistence,
//   validatePeopleExistence,
//   validateRequesterExistence,
//   checkPersonWorkspaceByEmail,
//   checkPersonIsAdmin,
//   checkPersonIsOwner,
//   checkDeskAssociationExistence,
//   checkPersonIsOwnerDashboard,
//   validateFetchDashboardPeopleSchema,
//   validateFetchDashboardGraphPeopleSchema,
// }
