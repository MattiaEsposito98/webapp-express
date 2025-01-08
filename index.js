const express = require("express")
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
)

app.use(express.static('pubblic'))

app.get('/', (req, res) => {
  res.send('Server is running')
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})