import { ObjectId } from 'mongodb'

import { isDefined } from '../../helpers/object-helper.js'
import {
  buildPaginationPipeline,
  getQueryContainsAttributeString,
  getQueryStartWithAttributeString,
  searchAttributeString,
} from '../../helpers/query-helper.js'
import { CollectionNames } from '../../types/global.enums.js'

const findPersonByID = async (db, personID) => {
  const collection = db.collection(CollectionNames.People)

  return collection.findOne({
    _id: new ObjectId(personID),
    deleted: false,
  })
}

const insertPerson = async (db, person) => {
  const collection = db.collection(CollectionNames.People)

  const { insertedId } = await collection.insertOne(person)
  const personID = insertedId.toString()

  return findPersonByID(db, personID)
}

const findAndCountPeople = async (db, params) => {
  const collection = db.collection < TypePerson > CollectionNames.People

  const { limit, offset, sortBy, sortOrder } = params

  const pipeline = []

  // Match
  pipeline.push({
    $match: {
      deleted: false,
      ...(isDefined(params.search) && {
        $or: [
          searchAttributeString('name', params.search),
          searchAttributeString('email', params.search),
        ],
      }),
      ...(isDefined(params.name) &&
        getQueryContainsAttributeString('name', params.name)),
      ...(isDefined(params.email) &&
        getQueryStartWithAttributeString('email', params.email)),
      ...(isDefined(params.cpf) &&
        getQueryContainsAttributeString('cpf', params.cpf)),
      ...(isDefined(params.phone) &&
        getQueryContainsAttributeString('phone', params.phone)),
      ...(isDefined(params.language) && {
        language: params.language,
      }),
      ...(isDefined(params.type) && {
        type: params.type,
      }),
      ...(isDefined(params.status) && {
        status: params.status,
      }),
    },
  })

  const paginationPipeline = buildPaginationPipeline({
    offset,
    limit,
    sortBy,
    sortOrder,
  })

  const result = await collection
    .aggregate([...pipeline, ...paginationPipeline])
    .toArray()
  const [resultCount] = await collection
    .aggregate([...pipeline, { $count: 'count' }])
    .toArray()

  return { result, count: resultCount?.count || 0 }
}

const updatePerson = async (db, personID, person) => {
  const collection = db.collection(CollectionNames.People)

  const $set = {
    ...(isDefined(person.name) && {
      name: person.name,
    }),
    ...(isDefined(person.email) && {
      email: person.email,
    }),
    ...(isDefined(person.photo) && {
      photo: person.photo,
    }),
    ...(isDefined(person.language) && {
      language: person.language,
    }),
    ...(isDefined(person.type) && {
      type: person.type,
    }),
    ...(isDefined(person.status) && {
      status: person.status,
    }),
  }

  await collection.updateOne(
    {
      _id: new ObjectId(personID),
      deleted: false,
    },
    { $set },
  )

  return findPersonByID(db, personID)
}

const deletePerson = async (db, personID) => {
  const collection = db.collection(CollectionNames.People)

  return collection.updateOne(
    {
      _id: new ObjectId(personID),
      deleted: false,
    },
    { $set: { deleted: true } },
  )
}

const findPersonByEmail = async (db, email) => {
  const collection = db.collection(CollectionNames.People)

  return collection.findOne({
    email,
    deleted: false,
  })
}

const findPeopleByIDs = async (db, personIDs) => {
  const collection = db.collection < TypePerson > CollectionNames.People

  return collection
    .find({
      _id: { $in: personIDs.map(id => new ObjectId(id)) },
    })
    .toArray()
}

export {
  insertPerson,
  findPersonByID,
  findAndCountPeople,
  updatePerson,
  deletePerson,
  findPersonByEmail,
  findPeopleByIDs,
}
