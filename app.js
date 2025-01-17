const express = require("express")
const app = express()
const cors = require('cors')
const notFound = require("./middlewares/notFound")
const errorsHandler = require("./middlewares/errorsHandler")
const port = process.env.PORT || 3000
const movieRouter = require('./routers/movieRouter')

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
)

app.use(express.json())  //Middleware per analizzare il json-body
app.use(express.static('pubblic'))

app.get('/', (req, res) => {
  res.send('Server is running')
})

//Rotte per movies
app.use('/api/movies', movieRouter)


//Middlewares per errori
app.use(errorsHandler)
app.use(notFound)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
