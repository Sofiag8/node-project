const express = require("express")

const app = express()
const port = 3000

app.get("/", (request, response) => {
    response.status(200).json({message: 'Hello from the server side', app: 'natours'})
})

app.post("/", (request, response) => {
    response.send("You can post this endpoint")
})

app.listen(port, ()=> {
    console.log(`App running on port ${port}...`)
})