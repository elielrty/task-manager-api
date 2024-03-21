// import { Request, Response } from 'express'

// import AppError from '../../errors/AppError'
// import { isDefined } from '../../helpers/object-helper'
// import { HttpStatus } from '../../types/global.enums'
// import {
//   findDashboardAttendances,
//   findDashboardGraphicAttendances,
//   findAverageAttendanceTimeGraphAttendances,
//   findGroupByStarsAndCountGraphAttendances,
// } from '../attendances/attendances.dao'
// import {
//   deletePerson,
//   findAndCountPeople,
//   insertPerson,
//   updatePerson,
// } from './people.dao'
// import { mapPeople, changeStatus } from './people.helper'

// const createPerson = async (request: Request, response: Response) => {
//   const { db, messages, body } = request

//   try {
//     const mapped = mapPeople(body)

//     const person = await insertPerson(db, mapped)

//     response.status(HttpStatus.Created).json(person)
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error
//     }

//     throw new AppError(
//       messages.errors.people.POST[500],
//       error,
//       HttpStatus.InternalServerError,
//     )
//   }
// }

// const fetchPerson = async (request: Request, response: Response) => {
//   const { messages, locals } = request

//   try {
//     const { person } = locals

//     response.status(HttpStatus.Ok).json(person)
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error
//     }

//     throw new AppError(
//       messages.errors.people.GET[500],
//       error,
//       HttpStatus.InternalServerError,
//     )
//   }
// }

// const fetchPeople = async (request: Request, response: Response) => {
//   const { db, messages, query } = request

//   try {
//     const { result, count } = await findAndCountPeople(db, query)

//     response.set('x-count', count)

//     response.status(HttpStatus.Ok).json(result)
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error
//     }

//     throw new AppError(
//       messages.errors.people.LIST[500],
//       error,
//       HttpStatus.InternalServerError,
//     )
//   }
// }

// const fetchDashboardPeople = async (request: Request, response: Response) => {
//   const { db, messages, query } = request

//   try {
//     const result = await findDashboardAttendances(db, query)

//     response.status(HttpStatus.Ok).json(result)
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error
//     }

//     throw new AppError(
//       messages.errors.people.DASHBORD[500],
//       error,
//       HttpStatus.InternalServerError,
//     )
//   }
// }

// const fetchAverageAttendanceTimeGraphPeople = async (
//   request: Request,
//   response: Response,
// ) => {
//   const { db, messages, query } = request

//   try {
//     const result = await findAverageAttendanceTimeGraphAttendances(db, query)

//     response.status(HttpStatus.Ok).json(result)
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error
//     }

//     throw new AppError(
//       messages.errors.people.DASHBORD[500],
//       error,
//       HttpStatus.InternalServerError,
//     )
//   }
// }

// const fetchDashboardGraphPeople = async (
//   request: Request,
//   response: Response,
// ) => {
//   const { db, messages, query } = request

//   try {
//     const result = await findDashboardGraphicAttendances(db, query)

//     response.status(HttpStatus.Ok).json(result)
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error
//     }

//     throw new AppError(
//       messages.errors.people.DASHBORD[500],
//       error,
//       HttpStatus.InternalServerError,
//     )
//   }
// }

// const fetchDashboardSatisfactionGraphPeople = async (
//   request: Request,
//   response: Response,
// ) => {
//   const { db, messages, query } = request

//   try {
//     const result = await findGroupByStarsAndCountGraphAttendances(db, query)

//     response.status(HttpStatus.Ok).json(result)
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error
//     }

//     throw new AppError(
//       messages.errors.people.DASHBORD[500],
//       error,
//       HttpStatus.InternalServerError,
//     )
//   }
// }

// const editPerson = async (request: Request, response: Response) => {
//   const { db, messages, params, body } = request

//   try {
//     const { personID } = params

//     if (isDefined(body.status)) {
//       await changeStatus(db, personID, body.status)
//     }

//     const person = await updatePerson(db, personID, body)

//     response.status(HttpStatus.Ok).json(person)
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error
//     }

//     throw new AppError(
//       messages.errors.people.PUT[500],
//       error,
//       HttpStatus.InternalServerError,
//     )
//   }
// }

// const removePerson = async (request: Request, response: Response) => {
//   const {
//     db,
//     messages,
//     locals: {
//       person: { _id },
//     },
//   } = request

//   try {
//     const personID = _id.toString()

//     await deletePerson(db, personID)

//     response.status(HttpStatus.NoContent).end()
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error
//     }

//     throw new AppError(
//       messages.errors.people.DELETE[500],
//       error,
//       HttpStatus.InternalServerError,
//     )
//   }
// }

// export {
//   createPerson,
//   fetchPerson,
//   fetchPeople,
//   editPerson,
//   removePerson,
//   fetchDashboardPeople,
//   fetchDashboardGraphPeople,
//   fetchAverageAttendanceTimeGraphPeople,
//   fetchDashboardSatisfactionGraphPeople,
// }
