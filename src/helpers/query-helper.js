import { isDefined } from './object-helper.js'
import { escapeRegExp } from './string-helper.js'

const buildPaginationPipeline = ({ offset, limit, sortBy, sortOrder }) => {
  const pipeline = []

  // Sort
  pipeline.push({
    $sort: { [sortBy || '_id']: (sortOrder || 'desc') === 'asc' ? 1 : -1 },
  })

  // Offset
  if (isDefined(offset) && offset >= 0) {
    pipeline.push({ $skip: offset })
  }

  // Limit
  if (isDefined(limit) && limit > 0) {
    pipeline.push({ $limit: limit })
  }

  return pipeline
}

const getQueryContainsAttributeString = (key, value) => ({
  [key]: {
    $regex: `${escapeRegExp(value)}`,
    $options: 'si',
  },
})

const getQueryStartWithAttributeString = (key, value) => ({
  [key]: {
    $regex: `^${escapeRegExp(value)}`,
    $options: 'si',
  },
})

const getQueryExactMatchEmailDomain = (key, domain) => ({
  [key]: {
    $regex: `@${escapeRegExp(domain)}$`,
    $options: 'i',
  },
})

const searchAttributeString = (key, value) => {
  if (!value) {
    return {}
  }

  const texts = value.toLowerCase().trim().split(' ')
  const normalizedTexts = texts.map(s => normalizeString(escapeRegExp(s)))

  return {
    $and: normalizedTexts.map(t => ({
      [key]: {
        $regex: `.*${t}.*$`,
        $options: 'si',
      },
    })),
  }
}

export {
  getQueryContainsAttributeString,
  buildPaginationPipeline,
  getQueryExactMatchEmailDomain,
  getQueryStartWithAttributeString,
  searchAttributeString,
}
