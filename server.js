import app from './src/app.js'
import config from './src/config.js'
import { connect } from './src/services/mongo/index.js'

let appServer

/* O set immediate serve para garantir que só irá executar após tudo concluir a execução */
setImmediate(async () => {
  const { port, mongo } = config
  const { dbURL, options } = mongo

  const dbClient = await connect({ host: dbURL, options })

  appServer = app({ dbClient, port })
})

export const server = appServer
