const connection = require('../data/db')

function index(req, res, next) {
  let sql = 'SELECT movies.*, AVG(vote) AS avg_vote FROM db_movies.movies JOIN db_movies.reviews ON movies.id = reviews.movie_id GROUP BY movies.id'

  connection.query(sql, (err, movies) => {
    if (err) return next(err) // Interviene middlware errorsHandler per gestire l'errore

    movies.forEach((movie) => {
      if (movie.id === 1) {
        movie.image = `${process.env.BE_HOST}/inception.jpg`;
      } else if (movie.id === 2) {
        movie.image = `${process.env.BE_HOST}/the_godfather.jpg`
      } else if (movie.id === 3) {
        movie.image = `${process.env.BE_HOST}/titanic.jpg`
      } else if (movie.id === 4) {
        movie.image = `${process.env.BE_HOST}/matrix.jpg`
      } else if (movie.id === 5) {
        movie.image = `${process.env.BE_HOST}/interstellar.jpg`
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
  const movieSql = `SELECT movies.*, AVG(vote) AS avg_vote 
		FROM db_movies.movies
		JOIN db_movies.reviews
		ON movies.id = reviews.movie_id 
		WHERE movies.id = ?
		GROUP BY movies.id
		`
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