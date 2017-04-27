
import r from 'rethinkdb'
import secret from '../secret'
import shortid from 'shortid'
import express from 'express'
const router = express.Router()

import thinky from '../utils/thinky'
import Tournament from '../models/tournament.js'

/*
 * GET:
 *  shortid: The short id of the tournament from structure.
 */

router.get('/:shortid', (req, res) => {
  Tournament.filter({structure: {meta: {shortid: req.params.shortid}}}).run().then((result) => {
    if(result[0])
      res.send(JSON.stringify(result[0].structure, null, 2))
    else
      res.sendStatus(404)
  })
})

/*
 * POST:
 *  data: (Object) tournament structure
 */
router.post('/:uuid', (req, res) => {
  let { data } = req.body
  data = JSON.parse(data)

  Tournament.filter({structure: {meta: {id: data.meta.id}}}).run().then((result) => {
    if(result[0]) {
      result[0].structure = data
      result[0].save(() => {
        res.sendStatus(201)
      })
    }
    else {
      let tournament = new Tournament({
        structure: data
      }).save().then(() => {
        res.sendStatus(200)
      })
    }
  })
})

export default router
