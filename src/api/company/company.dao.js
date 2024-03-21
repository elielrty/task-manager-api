import { Db, ObjectId } from 'mongodb'

import { isDefined } from '../../helpers/object-helper.js'
import { CollectionNames } from '../../types/global.enums.js'

const findCompanyByID = async (db, companyID) => {
  const collection = db.collection < TypeCompany > CollectionNames.Companies

  return collection.findOne({
    _id: new ObjectId(companyID),
    deleted: false,
  })
}

const insertCompany = async (db, company) => {
  const collection = db.collection(CollectionNames.Companies)

  const { insertedId } = await collection.insertOne(company)
  const companyID = insertedId.toString()

  return findCompanyByID(db, companyID)
}

const findCompanies = async (db, params) => {
  const collection = db.collection < TypeCompany > CollectionNames.Companies

  const query = {
    deleted: false,
    ...(isDefined(params.name) && {
      name: params.name,
    }),
  }

  return collection.find(query).toArray()
}

const findCompanyByKey = async (db, key) => {
  const collection = db.collection(CollectionNames.Companies)

  return collection.findOne({
    key,
    deleted: false,
  })
}

const updateCompany = async (db, companyID, company) => {
  const collection = db.collection < TypeCompany > CollectionNames.Companies

  const $set = {
    ...(isDefined(company.name) && {
      name: company.name,
    }),
    ...(isDefined(company.key) && {
      key: company.key,
    }),
    ...(isDefined(company.tenant) && {
      tenant: company.tenant,
    }),
    ...(isDefined(company.active) && {
      active: company.active,
    }),
  }

  await collection.updateOne(
    {
      _id: new ObjectId(companyID),
      deleted: false,
    },
    { $set },
  )

  return findCompanyByID(db, companyID)
}

const deleteCompany = async (db, companyID) => {
  const collection = db.collection(CollectionNames.Companies)

  await collection.updateOne(
    {
      _id: new ObjectId(companyID),
      deleted: false,
    },
    { $set: { deleted: true } },
  )
}

export {
  findCompanyByID,
  insertCompany,
  findCompanies,
  findCompanyByKey,
  updateCompany,
  deleteCompany,
}
