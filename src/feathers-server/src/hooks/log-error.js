import { logger } from '../logger.js'
import { Unavailable } from '@feathersjs/errors'

export const logError = async (context, next) => {
  try {
    await next()
  } catch (error) {
    const knexOriginalError = error[Symbol.for('@feathersjs/knex/error')]

    logger.error(error.stack)
    logger.error('Error name: %s | message: %s', error.name, error.message)

    if (error.data) {
      logger.error('Data: %O', error.data)
    }

    if (error.errors) {
      logger.error('Errors: %O', error.errors)
    }

    if (error.cause) {
      logger.error('Cause: %O', error.cause)
    }

    if (error.original) {
      logger.error('Original: %O', error.original)
    }

    if (knexOriginalError) {
      logger.error('Knex original error: %O', knexOriginalError)
    }

    if (
      error.name === 'GeneralError' &&
      !error.message &&
      knexOriginalError?.code === 'ECONNREFUSED'
    ) {
      throw new Unavailable('Não foi possível conectar ao MySQL em localhost:3306. Verifique se o serviço está em execução.')
    }

    throw error
  }
}
