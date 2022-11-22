const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../../.env` })

console.log('process ', process.env.NODE_ENV)
const config = {
  env: process.env.NODE_ENV,
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    enabled: process.env.BOOLEAN
      ? process.env.BOOLEAN.toLowerCase() === 'true'
      : false,
  },
  server: {
    port: process.env.PORT,
  },
  database: {
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
  },
}

module.exports = config
