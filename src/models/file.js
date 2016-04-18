import { goose } from '../db'

const gridSchema = goose.Schema({}, {
  // Fields that aren't defined in the schema SHOULD be
  // saved to the DB nevertheless
  strict: false
})

const model = goose.model('Grid', gridSchema, 'media.files')
export default model
