const mongoose = require('mongoose')
const schema = require('./../schemas/platform-schema')

const Platforms = mongoose.model('platforms', schema)

module.exports = Platforms