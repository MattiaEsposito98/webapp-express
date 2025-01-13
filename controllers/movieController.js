const connection = require('../data/db')

function index(req, res, next) {
  let sql = 'SELECT movies.*, AVG(vote) AS avg_vote FROM db_movies.movies JOIN db_movies.reviews ON movies.id = reviews.movie_id '

  if (req.query.search) {
    sql += ` WHERE title LIKE '%${req.query.search}%' OR director LIKE '%${req.query.search}%' OR genre LIKE '%${req.query.search}%'`
  }
  sql += 'GROUP BY movies.id'
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
        movie.image = `${process.env.BE_HOST}/logo.jpg`
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



    //query per le vedere le reviews
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

function storeReview(req, res) {
  const id = req.params.id
  const { text, vote, name } = req.body

  const intVote = parseInt(vote)
  // validare vote e name
  if (
    !name ||
    !intVote ||
    isNaN(intVote) ||
    intVote < 1 ||
    intVote > 5 ||
    name?.length > 255 ||
    typeof name !== 'string'
  ) {
    return res.status(400).json({ message: 'The data is invalid' })
  }

  // query INSERT INTO
  const sql =
    'INSERT INTO reviews (text, name, vote, movie_id) VALUES (?, ?, ?, ?)'

  connection.query(sql, [text, name, intVote, id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database query failed' })
    res.status(201).json({ message: 'Recensione aggiunta', id: results.insertId })
  })
}


module.exports = { index, show, storeReview }