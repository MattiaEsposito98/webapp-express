const connection = require('../data/db')

function index(req, res) {
  let sql = 'SELECT * FROM movies.movies'

  connection.query(sql, (err, movies) => {
    if (err) return res.status(500).json({ message: err.message })

    res.json(movies)
  })
}

module.exports = { index }