// import { Router } from 'express'

// import {
//   createPerson,
//   fetchPerson,
//   fetchPeople,
//   editPerson,
//   removePerson,
//   fetchDashboardPeople,
//   fetchDashboardGraphPeople,
//   fetchAverageAttendanceTimeGraphPeople,
//   fetchDashboardSatisfactionGraphPeople,
// } from './people.controller'
// import {
//   validateCreatePersonSchema,
//   validateFetchPeopleSchema,
//   validateFetchPersonSchema,
//   validateEditPersonSchema,
//   validateRemovePersonSchema,
//   validateUniquePerson,
//   validatePersonExistence,
//   checkPersonWorkspaceByEmail,
//   checkPersonIsAdmin,
//   checkDeskAssociationExistence,
//   checkPersonIsOwnerDashboard,
//   validateFetchDashboardPeopleSchema,
//   validateFetchDashboardGraphPeopleSchema,
// } from './people.middleware'

// const router = Router()

// router.post('/', [
//   checkPersonIsAdmin,
//   validateCreatePersonSchema,
//   validateUniquePerson,
//   checkPersonWorkspaceByEmail,
//   createPerson,
// ])

// router.get('/dashboard', [
//   validateFetchDashboardPeopleSchema,
//   checkPersonIsAdmin,
//   checkPersonIsOwnerDashboard,
//   validatePersonExistence,
//   fetchDashboardPeople,
// ])

// router.get('/dashboard/graph', [
//   validateFetchDashboardGraphPeopleSchema,
//   checkPersonIsAdmin,
//   checkPersonIsOwnerDashboard,
//   validatePersonExistence,
//   fetchDashboardGraphPeople,
// ])

// router.get('/dashboard/average-time-attendance/graph', [
//   validateFetchDashboardGraphPeopleSchema,
//   checkPersonIsAdmin,
//   checkPersonIsOwnerDashboard,
//   validatePersonExistence,
//   fetchAverageAttendanceTimeGraphPeople,
// ])

// router.get('/dashboard/satisfaction/graph', [
//   validateFetchDashboardGraphPeopleSchema,
//   checkPersonIsAdmin,
//   checkPersonIsOwnerDashboard,
//   validatePersonExistence,
//   fetchDashboardSatisfactionGraphPeople,
// ])

// router.get('/', [checkPersonIsAdmin, validateFetchPeopleSchema, fetchPeople])

// router.get('/:personID', [
//   checkPersonIsAdmin,
//   validateFetchPersonSchema,
//   validatePersonExistence,
//   fetchPerson,
// ])

// router.put('/:personID', [
//   checkPersonIsAdmin,
//   validateEditPersonSchema,
//   validatePersonExistence,
//   editPerson,
// ])

// router.delete('/:personID', [
//   checkPersonIsAdmin,
//   validateRemovePersonSchema,
//   validatePersonExistence,
//   checkDeskAssociationExistence,
//   removePerson,
// ])

// export default router
