import r from 'rethinkdb'
import secret from '../secret'
import shortid from 'shortid'
import express from 'express'
const router = express.Router()

router.get('/:shortid', (req, res) => {
  r.connect({
    host: 'localhost',
    port: 28015,
    user: "admin",
    password: secret.adminPassword
  }, (err, connect) => {
    if(err) throw err

    r.db('monolith').table('tournament')
    .filter(r.row("structure")("meta")("shortid").eq(req.params.shortid))
    .run(connect, (err, cursor) => {
      if(err) throw err
      cursor.toArray((err, result) => {
        if(err) throw err
        res.send(JSON.stringify(result, null, 2))
      })
    })
  })
})

/*
 * POST:
 *  structure: (Object) tournament structure
 */
router.post('/:uuid', (req, res) => {
  let { data } = req.body
  data = JSON.parse(data)

  r.connect({
    host: 'localhost',
    port: 28015,
    user: "admin",
    password: secret.adminPassword
  }, (err, connect) => {
    if(err) throw err

    r.db('monolith').table('tournament')
    .filter(r.row("structure")("meta")("id").eq(req.params.uuid))
    .run(connect, (err, cursor) => {

      if(err) throw err
      cursor.toArray((err, result) => {
        if(result.length == 0) {
          r.db('monolith').table('tournament')
          .insert([
            {
              structure: data
            }
          ])
          .run(connect, (err, inserted) => {
            if(err) throw err
            res.status(200)
          })
        }
        else {
          r.db('monolith').table('tournament')
          .update({structure: data})
          .run(connect, (err, updated) => {
            if(err) throw err
            res.status(201)
          })
        }
      })
    })
  })
})

export default router
