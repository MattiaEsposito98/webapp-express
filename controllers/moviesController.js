const connection = require('../data/db')

function index(req, res) {
  let sql = 'SELECT * FROM movies'

  connection.query(sql, (err, books) => {
    if (err) return res.status(500).json({ message: err.message })

    res.json(movies)
  })
}