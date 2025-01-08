const connection = require('../data/db')

function index(req, res, next) {
  let sql = 'SELECT * FROM db_movies.movies;'

  connection.query(sql, (err, movies) => {
    if (err) return next(err) // Interviene middlware errorsHandler per gestire l'errore

    res.json(movies)
  })
}

function show(req, res, next) {
  const { id } = req.params
  const movieSql = 'SELECT * FROM db_movies.movies WHERE id = ?'

  connection.query(movieSql, [id], (err, results) => {
    if (err) return next(err) // Interviene middlware errorsHandler per gestire l'errore
    if (results.length === 0) {
      return next()  // Passa al prossimo middleware notFound perché non ci sono erorri da gestire
    }
    const movie = results[0]
    res.json(movie)
  })
}


module.exports = { index, show }