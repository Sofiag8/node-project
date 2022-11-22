const mongoose = require('mongoose')
const config = require('./config')
const app = require('./app')

try {
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
} catch (error) {
  console.error('Error trying to connect to mongo database...', error)
}

try {
  app.listen(config.server.port, () => {
    console.log(`App running on port ${config.server.port}...`)
  })
} catch (error) {
  console.error('Error  starting server... ')
}
