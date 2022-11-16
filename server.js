const config = require('./config/index')
const app = require('./app')

app.listen(config.server.port, ()=> {
    console.log(`App running on port ${config.server.port}...`)
})