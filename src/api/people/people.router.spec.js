// import { admin_directory_v1 } from 'googleapis'
// import { Db } from 'mongodb'
// import request from 'supertest'

// import {
//   insertMockData,
//   dropMockData,
//   extractDBs,
//   connection,
//   defineDefaultAuthorizationData,
// } from '../../../test/utils'
// import app from '../../app'
// import * as helper from '../../helpers/object-helper'
// import * as services from '../../services/google'
// import * as dao from './people.dao'

// let AuthorizationData
// let Databases: { db: Db; tenantsDB: Db }

// beforeAll(async () => {
//   app.locals.mongo = await connection()
//   Databases = extractDBs(app.locals.mongo)
//   await insertMockData(Databases)
//   AuthorizationData = await defineDefaultAuthorizationData(Databases.db)
// })

// afterAll(async () => {
//   await dropMockData(Databases)
//   await app.locals.mongo.close(true)
// })

// describe('[POST] - /people', () => {
//   const requestBody = {
//     email: 'email@gmail.com',
//     type: 'attendant',
//     language: 'pt-BR',
//   }

//   jest
//     .spyOn(services, 'findGoogleWorkspaceEmail')
//     .mockImplementation(async (email: string) => {
//       return {
//         id: '649b8b3599eca595e449856d',
//         name: 'John Doe',
//         primaryEmail: email,
//         isAdmin: true,
//         photo: null,
//       } as admin_directory_v1.Schema$User
//     })

//   it('should return 201 when is a valid request', async () => {
//     const response = await request(app)
//       .post('/people')
//       .set(AuthorizationData)
//       .send(requestBody)

//     expect(response.status).toBe(201)
//     expect(response.body).toHaveProperty('_id')
//     expect(response.body).toHaveProperty('email', requestBody.email)
//     expect(response.body).toHaveProperty('type', requestBody.type)
//     expect(response.body).toHaveProperty('language', requestBody.language)
//     expect(response.body).toHaveProperty('status', 'offline')
//   })

//   it('should return 400 with invalid request body attributes', async () => {
//     const response = await request(app)
//       .post('/people')
//       .set(AuthorizationData)
//       .send({
//         any_value: 'invalid_value',
//       })

//     expect(response.status).toBe(400)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .post('/people')
//       .set(AuthorizationData)
//       .send(requestBody)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 404 with invalid request body attributes', async () => {
//     jest
//       .spyOn(services, 'findGoogleWorkspaceEmail')
//       .mockImplementationOnce(async (_email: string) => {
//         return null
//       })

//     const payload = {
//       ...requestBody,
//       email: 'testUniqueEx1@test.com',
//     }

//     const response = await request(app)
//       .post('/people')
//       .set(AuthorizationData)
//       .send(payload)

//     expect(response.status).toBe(404)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 409 when try create with existent email', async () => {
//     const payload = {
//       ...requestBody,
//       email: 'testUniqueEx1@test.com',
//     }

//     // creating...
//     await request(app).post('/people').set(AuthorizationData).send(payload)

//     // duplicating...
//     const response = await request(app)
//       .post('/people')
//       .set(AuthorizationData)
//       .send(payload)

//     expect(response.status).toBe(409)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 500 with unexpected error ocurred', async () => {
//     jest.spyOn(dao, 'insertPerson').mockImplementationOnce(() => {
//       throw new Error()
//     })

//     const response = await request(app)
//       .post('/people')
//       .set(AuthorizationData)
//       .send({
//         ...requestBody,
//         email: 'test500@email.com',
//       })

//     expect(response.status).toBe(500)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })
// })

// describe('[GET] - /people', () => {
//   it('should return 200 with params', async () => {
//     const query = {
//       status: 'online',
//     }

//     const response = await request(app)
//       .get('/people')
//       .query(query)
//       .set(AuthorizationData)

//     expect(response.status).toBe(200)
//     expect(response.body.length).toBeGreaterThan(0)

//     const people = response.body
//     people.forEach(people => {
//       expect(people).toHaveProperty('_id')
//       expect(people).toHaveProperty('status', query.status)
//     })
//   })

//   it('should return 200 without params', async () => {
//     const query = {}

//     const response = await request(app)
//       .get('/people')
//       .query(query)
//       .set(AuthorizationData)

//     expect(response.status).toBe(200)
//     expect(response.body.length).toBeGreaterThan(1)
//   })

//   it('should return 200 with pagination params', async () => {
//     const query = {
//       limit: 1,
//       offset: 0,
//       sortBy: 'email',
//       sortOrder: 'asc',
//     }

//     const response = await request(app)
//       .get('/people')
//       .query(query)
//       .set(AuthorizationData)

//     expect(response.status).toBe(200)
//     expect(Number(response.headers['x-count'])).toBeGreaterThan(query.limit)
//     expect(response.body.length).toBe(query.limit)
//   })

//   it('should return 400 with invalid params', async () => {
//     const response = await request(app)
//       .get('/people')
//       .set(AuthorizationData)
//       .query({
//         value: 'invalid',
//       })

//     expect(response.status).toBe(400)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .get('/people')
//       .query({})
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 500 with unexpected error ocurred', async () => {
//     jest.spyOn(dao, 'findAndCountPeople').mockImplementationOnce(() => {
//       throw new Error()
//     })

//     const response = await request(app)
//       .get('/people')
//       .set(AuthorizationData)
//       .query({
//         name: 'people 1',
//         type: 'attendant',
//       })

//     expect(response.status).toBe(500)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })
// })

// describe('[GET] - /people/dashboard', () => {
//   it('should return 200 with params', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard`)
//       .query({
//         comarcaID: '64d111820c7feec57557a7da',
//         personID: '64f0efcc69e790f8ebe8311c',
//         deskID: '64d564d13872bd97a802ca11',
//         endDate: '2023-09-09',
//         startDate: '2023-08-01',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(200)
//     expect(response.body).toHaveProperty('totalAttendance', expect.any(Number))
//     expect(response.body).toHaveProperty(
//       'averageDurationInMinutes',
//       expect.any(Number),
//     )
//     expect(response.body).toHaveProperty('attendanceQueue', expect.any(Number))
//   })

//   it('should return 400 with invalid param', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard`)
//       .query({
//         personID: 'invalid value',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(400)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard`)
//       .query({
//         personID: '649c19fbf87504f685de9f70',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard`)
//       .query({})
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user verification is not Owner and attendant', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64cc12d6ad8f70b4a541674e',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard`)
//       .query({
//         personID: '649b8b3599eca595e449856d',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 404 with not exists id', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard`)
//       .query({
//         personID: '649c42df4d6daf5a88bfde15',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(404)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 500 with unexpected error ocurred', async () => {
//     jest.spyOn(helper, 'isNullOrUndefined').mockImplementationOnce(() => {
//       throw new Error()
//     })

//     const response = await request(app)
//       .get(`/people/dashboard`)
//       .query({
//         personID: '649c19fbf87504f685de9f70',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(500)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })
// })

// describe('[GET] - /people/dashboard/graph', () => {
//   it('should return 200 with params', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard/graph`)
//       .query({
//         comarcaID: '64d111820c7feec57557a7da',
//         personID: '64f0efcc69e790f8ebe8311c',
//         deskID: '64d564d13872bd97a802ca11',
//         endDate: '2023-09-09',
//         startDate: '2023-01-01',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(200)
//     expect(response.body).toHaveProperty('resolved', expect.any(Array))
//     expect(response.body).toHaveProperty('unresolved', expect.any(Array))
//   })

//   it('should return 400 with invalid param', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard/graph`)
//       .query({
//         personID: 'invalid value',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(400)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard/graph`)
//       .query({
//         personID: '649c19fbf87504f685de9f70',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard/graph`)
//       .query({})
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user verification is not Owner and attendant', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64cc12d6ad8f70b4a541674e',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard/graph`)
//       .query({
//         personID: '649b8b3599eca595e449856d',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 404 with not exists id', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard/graph`)
//       .query({
//         personID: '649c42df4d6daf5a88bfde15',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(404)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 500 with unexpected error ocurred', async () => {
//     jest.spyOn(helper, 'isNullOrUndefined').mockImplementationOnce(() => {
//       throw new Error()
//     })

//     const response = await request(app)
//       .get(`/people/dashboard/graph`)
//       .query({
//         personID: '649c19fbf87504f685de9f70',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(500)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })
// })

// describe('[GET] - /people/dashboard/average-time-attendance/graph', () => {
//   it('should return 200 with params', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard/average-time-attendance/graph`)
//       .query({
//         comarcaID: '64d111820c7feec57557a7da',
//         personID: '64f0efcc69e790f8ebe8311c',
//         deskID: '64d564d13872bd97a802ca11',
//         endDate: '2023-09-09',
//         startDate: '2023-01-01',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(200)
//     expect(response.body).toEqual(
//       expect.arrayContaining([
//         {
//           averageDuration: expect.any(Number),
//           date: {
//             mes: expect.any(Number),
//             ano: expect.any(Number),
//           },
//         },
//       ]),
//     )
//   })

//   it('should return 400 with invalid param', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard/average-time-attendance/graph`)
//       .query({
//         personID: 'invalid value',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(400)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard/average-time-attendance/graph`)
//       .query({
//         personID: '649c19fbf87504f685de9f70',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard/average-time-attendance/graph`)
//       .query({})
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user verification is not Owner and attendant', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64cc12d6ad8f70b4a541674e',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard/average-time-attendance/graph`)
//       .query({
//         personID: '649b8b3599eca595e449856d',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 404 with not exists id', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard/average-time-attendance/graph`)
//       .query({
//         personID: '649c42df4d6daf5a88bfde15',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(404)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 500 with unexpected error ocurred', async () => {
//     jest.spyOn(helper, 'isNullOrUndefined').mockImplementationOnce(() => {
//       throw new Error()
//     })

//     const response = await request(app)
//       .get(`/people/dashboard/average-time-attendance/graph`)
//       .query({
//         personID: '649c19fbf87504f685de9f70',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(500)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })
// })

// describe('[GET] - /people/dashboard/satisfaction/graph', () => {
//   it('should return 200 with params', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard/satisfaction/graph`)
//       .query({
//         comarcaID: '64d111820c7feec57557a7da',
//         personID: '64f0efcc69e790f8ebe8311c',
//         deskID: '64d564d13872bd97a802ca11',
//         endDate: '2023-09-09',
//         startDate: '2023-01-01',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(200)
//     expect(response.body).toEqual(
//       expect.arrayContaining([
//         {
//           count: expect.any(Number),
//           stars: expect.any(Number) || expect.any(null),
//         },
//       ]),
//     )
//   })

//   it('should return 400 with invalid param', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard/satisfaction/graph`)
//       .query({
//         personID: 'invalid value',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(400)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard/satisfaction/graph`)
//       .query({
//         personID: '649c19fbf87504f685de9f70',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard/satisfaction/graph`)
//       .query({})
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user verification is not Owner and attendant', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64cc12d6ad8f70b4a541674e',
//     )

//     const response = await request(app)
//       .get(`/people/dashboard/satisfaction/graph`)
//       .query({
//         personID: '649b8b3599eca595e449856d',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 404 with not exists id', async () => {
//     const response = await request(app)
//       .get(`/people/dashboard/satisfaction/graph`)
//       .query({
//         personID: '649c42df4d6daf5a88bfde15',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(404)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 500 with unexpected error ocurred', async () => {
//     jest.spyOn(helper, 'isNullOrUndefined').mockImplementationOnce(() => {
//       throw new Error()
//     })

//     const response = await request(app)
//       .get(`/people/dashboard/satisfaction/graph`)
//       .query({
//         personID: '649c19fbf87504f685de9f70',
//       })
//       .set(AuthorizationData)

//     expect(response.status).toBe(500)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })
// })

// describe('[GET] - /people/:personID', () => {
//   it('should return 200 with params', async () => {
//     const id = '64cc2945740d79af51c085e7'

//     const response = await request(app)
//       .get(`/people/${id}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(200)
//     expect(response.body).toHaveProperty('_id', id)
//     expect(response.body).toHaveProperty('name')
//     expect(response.body).toHaveProperty('email')
//     expect(response.body).toHaveProperty('type')
//   })

//   it('should return 400 with invalid param', async () => {
//     const value = 'invalid value'

//     const response = await request(app)
//       .get(`/people/${value}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(400)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const id = '649c19fbf87504f685de9f70'

//     const response = await request(app)
//       .get(`/people/${id}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 404 with not exists id', async () => {
//     const id = '649c42df4d6daf5a88bfde15'

//     const response = await request(app)
//       .get(`/people/${id}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(404)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 500 with unexpected error ocurred', async () => {
//     jest.spyOn(helper, 'isNullOrUndefined').mockImplementationOnce(() => {
//       throw new Error()
//     })

//     const id = '649c19fbf87504f685de9f70'

//     const response = await request(app)
//       .get(`/people/${id}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(500)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })
// })

// describe('[PUT] - /people/:personID', () => {
//   const requestBody = {
//     type: 'attendant',
//     language: 'pt-BR',
//     status: 'offline',
//   }

//   const id = '64cc2945740d79af51c085e7'

//   it('should return 200 without status params', async () => {
//     const response = await request(app)
//       .put(`/people/${id}`)
//       .set(AuthorizationData)
//       .send({
//         ...requestBody,
//         status: undefined,
//       })

//     expect(response.status).toBe(200)
//     expect(response.body).toHaveProperty('_id', id)
//     expect(response.body).toHaveProperty('language', requestBody.language)
//     expect(response.body).toHaveProperty('type', requestBody.type)
//     expect(response.body).toHaveProperty('status', 'online')
//   })

//   it('should return 200 with all params', async () => {
//     const response = await request(app)
//       .put(`/people/${id}`)
//       .set(AuthorizationData)
//       .send(requestBody)

//     expect(response.status).toBe(200)
//     expect(response.body).toHaveProperty('_id', id)
//     expect(response.body).toHaveProperty('language', requestBody.language)
//     expect(response.body).toHaveProperty('type', requestBody.type)
//     expect(response.body).toHaveProperty('status', requestBody.status)
//   })

//   it('should return 400 with invalid request body attributes', async () => {
//     const response = await request(app)
//       .put(`/people/${id}`)
//       .set(AuthorizationData)
//       .send({
//         any_value: 'invalid_value',
//       })

//     expect(response.status).toBe(400)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .put(`/people/${id}`)
//       .set(AuthorizationData)
//       .send(requestBody)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 404 with not exists id', async () => {
//     const nonExistentId = '649ca43ab949464d896bd54e'

//     const response = await request(app)
//       .put(`/people/${nonExistentId}`)
//       .set(AuthorizationData)
//       .send({
//         ...requestBody,
//         language: 'pt-BR',
//       })

//     expect(response.status).toBe(404)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 500 with unexpected error ocurred', async () => {
//     jest.spyOn(dao, 'updatePerson').mockImplementationOnce(() => {
//       throw new Error()
//     })

//     const response = await request(app)
//       .put(`/people/${id}`)
//       .set(AuthorizationData)
//       .send(requestBody)

//     expect(response.status).toBe(500)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })
// })

// describe('[DELETE] - /people/:personID', () => {
//   const id = '64cc25421c598923524a4f38'

//   it('should return 204 with delete person', async () => {
//     const response = await request(app)
//       .delete(`/people/${id}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(204)
//   })

//   it('should return 400 with invalid id', async () => {
//     const invalid_id = 'invalid_id'

//     const response = await request(app)
//       .delete(`/people/${invalid_id}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(400)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 403 when user type is not admin', async () => {
//     const AuthorizationData = await defineDefaultAuthorizationData(
//       Databases.db,
//       '64c03185e27afb1fa13f972b',
//     )

//     const response = await request(app)
//       .delete(`/people/${id}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(403)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 404 with not exists id', async () => {
//     const nonExistentId = '649ca43ab949464d896bd54e'

//     const response = await request(app)
//       .delete(`/people/${nonExistentId}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(404)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 409 when deleting a Person associated with existing Desk', async () => {
//     const id = '64cc27cc6c7e8eee55ac0c92'

//     const response = await request(app)
//       .delete(`/people/${id}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(409)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })

//   it('should return 500 with unexpected error ocurred', async () => {
//     const id = '649c1a0ceb77fcd3ca5f6919'

//     jest.spyOn(dao, 'deletePerson').mockImplementationOnce(() => {
//       throw new Error()
//     })

//     const response = await request(app)
//       .delete(`/people/${id}`)
//       .set(AuthorizationData)

//     expect(response.status).toBe(500)
//     expect(response.body).toHaveProperty('message', expect.any(String))
//   })
// })
