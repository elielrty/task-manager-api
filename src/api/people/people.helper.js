import { isDefined } from '../../helpers/object-helper.js'
import { Languages, Status } from './people.types'

const mapPeople = bodyPeople => {
  return {
    ...bodyPeople,
    language: bodyPeople.language ? bodyPeople.language : Languages.Brazilian,
    ...(isDefined(bodyPeople.type) && {
      status: bodyPeople.status ? bodyPeople.status : Status.Offline,
    }),
    deleted: false,
  }
}

export { mapPeople }
