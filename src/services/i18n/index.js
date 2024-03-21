/* eslint-disable no-unused-vars */
import { Languages } from '../../types/global.enums.js'

import en from './locales/en-US.json' assert { type: 'json' }
import br from './locales/pt-BR.json' assert { type: 'json' }

const messages = {
  [Languages.Brazilian]: br,
  [Languages.English]: en,
}

const defaultLanguage = Languages.Brazilian

const getMessages = language => {
  return messages[language] || messages[defaultLanguage]
}

export { getMessages }
