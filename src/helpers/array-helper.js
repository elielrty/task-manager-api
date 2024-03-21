const chunkArrayInGroups = (array, unit) => {
  const results = []
  const length = Math.ceil(array.length / unit)

  for (let i = 0; i < length; i++) {
    results.push(array.slice(i * unit, (i + 1) * unit))
  }
  return results
}

export { chunkArrayInGroups }
