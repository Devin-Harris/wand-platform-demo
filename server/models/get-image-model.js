const mongoose = require("mongoose");
const schema = require("./../schemas/image-schema");
const collectionNames = require("./../collectionNames");

const Collections = require("../models/collection-model");
async function doesCollectionExist(collection_name) {
  return await Collections.exists({ collection_name });
}

async function getModel(name) {
  const collectionExists = await doesCollectionExist(name);
  if (collectionExists) {
    return mongoose.model(name, schema);
  }
  return mongoose.model("images", schema);
}

module.exports = getModel;
