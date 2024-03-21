import Fastify from 'fastify'
import cors from '@fastify/cors'
import config from './config.js'
import { logger } from './services/logger/index.js'
import { extractPersonData } from './middlewares/auth-middleware.js'

const appServer = async ({ dbClient, port }) => {
  const {
    env,
    mongo: { dbName },
  } = config
  const isTestEnv = env === 'test'

  if (!isTestEnv && !dbName) {
    logger.info('[error*****]: please, pass DB_NAME env before running it!')
    process.exit(1)
  }

  const app = Fastify({})

  await app.register(cors, {
    // put your options here
  })

  app.addHook('onRequest', (request, _, done) => {
    request.locals = {
      mongo: dbClient,
    }

    done() // Chama done para prosseguir para o próximo middleware ou rota
  })

  app.addHook('onRequest', async (request, _) => {
    await extractPersonData(request)
  })

  app.get('/', (req, reply) => {
    console.log({ locals: req.locals })
    reply.send({ hello: 'world' })
  })

  app.addHook('onClose', async () => {
    logger.info('server closed!')
    return dbClient.close()
  })

  if (!isTestEnv) {
    const serverInfo = await app.listen({
      port: port || 9999,
      host: '::',
    })

    logger.info(`server is running at ${serverInfo}`)
  }

  return app
}

export default appServer
