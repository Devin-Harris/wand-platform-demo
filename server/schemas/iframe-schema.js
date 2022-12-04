const mongoose = require('mongoose')
const Schema = mongoose.Schema

const iframe_schema = new Schema({
  data: String,
  isWidget: Boolean
}, { strict: false })

module.exports = iframe_schema