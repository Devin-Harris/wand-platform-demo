const mongoose = require("mongoose");
const schema = require("./../schemas/collection-schema");

const Collections = mongoose.model("collections", schema);

module.exports = Collections;
