import initThinky from 'thinky'
import secret from '../secret'

const thinky = initThinky({
  host: "localhost",
  db: "monolith",
  user: "admin",
  password: secret.adminPassword
})

const {r} = thinky

export {thinky, r}
