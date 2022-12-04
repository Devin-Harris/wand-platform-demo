const mongoose = require('mongoose')
const Schema = mongoose.Schema

const application_schema = new Schema({
  data: String,
  isEmbed: Boolean,
  component: String
}, { strict: false })

module.exports = application_schema