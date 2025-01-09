const connection = require('../data/db')

function index(req, res, next) {
  let sql = 'SELECT * FROM db_movies.movies;'

  connection.query(sql, (err, movies) => {
    if (err) return next(err) // Interviene middlware errorsHandler per gestire l'errore
    // movie.image = `${process.env.BE_HOST}/${movie.image}`
    // movie.image = `http://localhost:3000/inception.jpg`
    movies.forEach((movie) => {
      if (movie.id === 1) {
        movie.image = `${process.env.BE_HOST}/inception.jpg`;
      } else if (movie.id === 2) {
        movie.image = `${process.env.BE_HOST}/the_godfather.jpg`; // Immagine di default per altri film
      } else if (movie.id === 3) {
        movie.image = `${process.env.BE_HOST}/titanic.jpg`; // Immagine di default per altri film
      } else if (movie.id === 4) {
        movie.image = `${process.env.BE_HOST}/matrix.jpg`; // Immagine di default per altri film
      } else if (movie.id === 5) {
        movie.image = `${process.env.BE_HOST}/interstellar.jpg`; // Immagine di default per altri film
      } else {
        movie.image = `http://localhost:3000/logo.jpg`
      }
    })
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