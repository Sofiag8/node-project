const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/../../.env` })

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
  jwtKey: process.env.JWT_KEY,
  jwtExpiration: process.env.JWT_EXPIRATION,
  jwtCookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
}

module.exports = config
