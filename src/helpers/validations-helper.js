import { Joi } from 'celebrate'

const paginationBaseSchema = {
  limit: Joi.number().integer().min(1).default(10).max(100).optional(),
  offset: Joi.number().integer().greater(-1).default(0).optional(),
  sortBy: Joi.string().default('_id').optional(),
  search: Joi.string().optional(),
  sortOrder: Joi.string()
    .valid(...['asc', 'desc'])
    .default('desc')
    .optional(),
}

const objectId = joi => joi.string().regex(/^[0-9a-fA-F]{24}$/)

export { objectId, paginationBaseSchema }
