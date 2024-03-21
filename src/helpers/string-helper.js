const containsAlphabeticalChar = str => {
  str = (str || '').toString()
  return /[a-zA-Z]+/.test(str)
}

const separateNumbersAndLetters = str => {
  str = (str || '').toString()
  const numbers = str.split('').filter(char => !Number.isNaN(char))
  const letters = str.split('').filter(char => Number.isNaN(char))
  return { numbers: numbers.join(''), letters: letters.join('') }
}

const generateRandomString = (
  length = 5,
  characters = 'ACEFGHJKQRSTUVWXYZ245789',
) => {
  let result = ''

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

const capitalize = (text = '') => {
  return text.charAt(0).toUpperCase().concat(text.toLowerCase().substring(1))
}

const charMap = {
  a: '[aàáâãäå]',
  e: '[eèéêë]',
  i: '[iìíîï]',
  o: '[oòóôõö]',
  u: '[uùúûü]',
  c: '[cç]',
}

const normalizeString = str => {
  // Passo 1: Normalizar a string
  const normalizedString = [
    ...str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  ]

  // Passo 2: Mapear e substituir caracteres
  const mappedString = normalizedString.map(char => {
    // Verificar se o caractere tem uma substituição no charMap
    if (charMap[char]) {
      // Substituir o caractere pelo valor correspondente no charMap
      return char.replace(char, charMap[char])
    }
    // Manter o caractere original se não houver substituição no charMap
    return char
  })

  // Passo 3: Unir os caracteres em uma string
  const finalString = mappedString.join('')

  // Retornar a string normalizada
  return finalString
}

const escapeRegExp = str => {
  // Passo 1: Remover espaços extras
  const words = str.split(' ')
  const trimmedWords = words.map(word => word.trim())
  const nonEmptyWords = trimmedWords.filter(word => word)
  const joinedString = nonEmptyWords.join(' ')

  // Passo 2: Remover espaços em branco no início e no final
  const trimmedString = joinedString.trim()

  // Passo 3: Escapar caracteres especiais
  return trimmedString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export {
  containsAlphabeticalChar,
  separateNumbersAndLetters,
  generateRandomString,
  capitalize,
  escapeRegExp,
  normalizeString,
}
