import {thinky} from '../utils/thinky'
const type = thinky.type

const Tournament = thinky.createModel("tournament", {
  id: type.string(),
  structure: type.object()
})

export default Tournament
