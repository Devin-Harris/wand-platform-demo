const mongoose = require('mongoose')
const Schema = mongoose.Schema

const location_schema = new Schema({
  radius: Number,
  radiusUnit: String, // miles | kilometers
  latitude: Number,
  longitude: Number,
  name: String,
  formatted_address: String,
  place_id: String
}, { strict: false })

module.exports = location_schema