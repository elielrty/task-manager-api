const getKeysDiff = (target, source) => {
  return Object.keys(source).filter(key => source[key] !== target[key])
}

const isNullOrUndefined = object => [null, undefined].includes(object)
const isDefined = object => !isNullOrUndefined(object)

export { isDefined, isNullOrUndefined, getKeysDiff }
