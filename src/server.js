const mongoose = require('mongoose')
const config = require('./config')
const app = require('./app')
const { gracefullyshutDownServer } = require('./utils')

mongoose
  .connect(config.database.dbHost, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((conn) => {
    console.log(
      `Mongo database successfully connected to port ${conn.connections[0].port}, ${conn.connections[0].name} database`
    )
  })

const server = app.listen(config.server.port, () => {
  console.log(`App running on port ${config.server.port}...`)
})

// LISTENERS

process.on('unhandledRejection', (error) => {
  console.error(error.name, error.message)
  console.log('Unhandled Rejection, Shutting down ...')
  gracefullyshutDownServer(server)
})

process.on('uncaughtException', (error) => {
  console.error(error)
  console.log('Uncaught Exception, Shutting down ...')
  gracefullyshutDownServer(server)
})
