import { ObjectId } from 'mongodb'

import { CollectionNames } from '../../types/global.enums.js'

const findTokenByID = async (db, tokenID) => {
  const collection = db.collection(CollectionNames.Tokens)

  return collection.findOne({
    _id: new ObjectId(tokenID),
  })
}

const insertToken = async (db, payload) => {
  const collection = db.collection(CollectionNames.Tokens)

  const { insertedId } = await collection.insertOne(payload)

  return findTokenByID(db, insertedId.toString())
}

const fetchTokens = async (db, params) => {
  const collection = db.collection(CollectionNames.Tokens)

  return collection
    .find({
      ...(!!params._id && { _id: params._id }),
      ...(!!params.accessToken && { accessToken: params.accessToken }),
      ...(!!params.refreshToken && { refreshToken: params.refreshToken }),
      ...(!!params.personID && { userID: params.personID }),
    })
    .toArray()
}

const findByRefreshToken = async (db, refreshToken) => {
  const collection = db.collection(CollectionNames.Tokens)

  return collection.findOne({
    refreshToken,
  })
}

const removeTokenByPersonID = async (db, personID) => {
  const collection = db.collection < TypeToken > CollectionNames.Tokens

  return collection.deleteMany({ personID: new ObjectId(personID) })
}

const removeToken = async (db, tokenID) => {
  const collection = db.collection(CollectionNames.Tokens)

  return collection.deleteOne({ _id: new ObjectId(tokenID) })
}

export {
  findTokenByID,
  insertToken,
  fetchTokens,
  findByRefreshToken,
  removeTokenByPersonID,
  removeToken,
}
