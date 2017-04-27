import r from 'rethinkdb'
import secret from '../secret'
import {serialise, deserialise} from '../utils/serialise'
import {Player, Match, Round, Cut} from '../utils/tournament'
import express from 'express'
const router = express.Router()

import thinky from '../utils/thinky'
import Tournament from '../models/tournament.js'

router.get('/', (req, res) => {
  res.render("index", {title: "Index"})
})

router.get('/t/:shortid', (req, res, next) => {
  if(req.params.shortid === "api") {
    next()
    return
  }

  Tournament.filter({structure: {meta: {shortid: req.params.shortid}}}).run().then((result) => {
    if(result[0])
      res.render('tournament', {title: result[0].structure.meta.name, structure: deserialise(JSON.stringify(result[0].structure))})
    else
      res.render('error', {error: '404'})
  })
})

router.get('/t/:shortid/:playerid', (req, res) => {
  Tournament.filter({structure: {meta: {shortid: req.params.shortid}}}).run().then((result) => {
    let tournament = result[0]
    if(!tournament) {
      res.render('error', {error: '404'})
      return
    }
    else {
      let { playerid } = req.params

      for (let each of tournament.structure.rounds) {
        each.matches = each.matches.filter(el => {
          if(el.player1 === playerid) return true
          else if(el.player2 === playerid) return true
        })
      }

      const output = deserialise(JSON.stringify(tournament.structure))

      let tracked = ""
      for(let each of output.players) {
        if(each.id == playerid) tracked = each.name
      }

      res.render('track', {title: output.meta.name, name: tracked, structure: output})
    }
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
