const mongoose = require('mongoose')
const Schema = mongoose.Schema
const IframeEmbed = require('./iframe-schema.js')
const ApplicationEmbed = require('./application-schema.js')
const Location = require('./location-schema.js')

const image_schema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  data: String,
  hyperLink: String,
  isHyperLinkVideo: Boolean,
  hasCoverImage: Boolean,
  isCenterImage: Boolean,
  ignoreLocations: Boolean,
  locations: [Location],
  name: String,
  data2: String | Object | IframeEmbed | ApplicationEmbed,
  outerClickThruCount: Number,
  centerClickThruCount: Number
}, { strict: false })

module.exports = image_schema