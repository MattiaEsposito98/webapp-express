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

  //query per trovare un film
  const movieSql = 'SELECT * FROM db_movies.movies WHERE id = ?'
  connection.query(movieSql, [id], (err, results) => {
    if (err) return next(err) // Interviene middlware errorsHandler per gestire l'errore
    if (results.length === 0) {
      return next()  // Passa al prossimo middleware notFound perché non ci sono erorri da gestire
    }
    const movie = results[0]



    //query per le reviews
    const reviewsSql = `SELECT * FROM db_movies.reviews WHERE movie_id = ?`
    connection.query(reviewsSql, [id], (err, reviewsResults) => {
      if (err) return next(err)
      if (reviewsResults.length === 0) {
        return next()
      }
      movie.reviews = reviewsResults
      res.json(movie)
    })

  })
}


module.exports = { index, show }