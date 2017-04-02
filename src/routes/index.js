import r from 'rethinkdb'
import secret from '../secret'
import {serialise, deserialise} from '../utils/serialise'
import {Player, Match, Round, Cut} from '../utils/tournament'
import express from 'express'
const router = express.Router()

let connect
r.connect({
  host: 'localhost',
  port: 28015,
  user: "admin",
  password: secret.adminPassword
}, (err, conn) => {
  if(err) throw err
  connect = conn
})

router.get('/', (req, res) => {
  res.render("index", {title: "Index"})
})

router.get('/t/:shortid', (req, res, next) => {
  if(req.params.shortid === "api") next()

  r.db('monolith').table('tournament')
  .filter(r.row("structure")("meta")("shortid").eq(req.params.shortid))
  .run(connect, (err, cursor) => {
    if(err) throw err
    cursor.toArray((err, result) => {
      if(err) throw err

      if(result.length != 0) {
        res.render('tournament', {title: result[0].structure.meta.name, structure: deserialise(JSON.stringify(result[0].structure))})
      }
      else {
        res.render('error', {error: '404'})
      }
    })
  })
})

router.get('/t/:shortid/:playerid', (req, res) => {
  r.db('monolith').table('tournament')
  .filter(r.row("structure")("meta")("shortid").eq(req.params.shortid))
  .run(connect, (err, cursor) => {
    if(err) throw err
    cursor.toArray((err, result) => {
      if(err) throw err

      if(result.length != 0) {
        for(let each of result[0].structure.rounds) {
          each.matches = each.matches.filter((el) => {
            if(el.player1 == req.params.playerid) return true
            else if(el.player2 == req.params.playerid) return true
          })
        }

        const output = deserialise(JSON.stringify(result[0].structure))
        let tracked
        for(let each of output.players) {
          if(each.id === req.params.playerid) tracked = each.name
        }

        res.render('track', {title: output.meta.name, name: tracked, structure: output})
      }
      else {
        res.render('error', {error: '404'})
      }
    })
  })
})

export default router
