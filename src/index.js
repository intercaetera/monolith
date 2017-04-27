//Dependencies
import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import stylus from 'stylus'
import nib from 'nib'
import express from 'express'
const app = express()

//Routes
import api from './routes/api'
import index from './routes/index'

//View engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//Middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

function compile(str, location) {
  return stylus(str)
         .set('filename', location)
         .set('compress', true)
         .use(nib())
         .import('nib')
}

app.use(stylus.middleware({
  src: path.join(__dirname, 'public'),
  compile: compile
}))
app.use(express.static(path.join(__dirname, 'public')))

//Routers
app.use('/', index)
app.use('/api', api)

// Catch 404
app.use((req, res, next) => {
  const err = new Error("Not Found")
  err.status = 404
  next(err)
})

// Error handling
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {error: err.status});
  console.log(err);
})

const PORT = process.env.PORT || "3000"
app.listen(PORT, () => {
  console.log("App listening on port "+PORT);
})

export default app
