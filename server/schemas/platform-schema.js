const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CollectionSchema = require("./collection-schema");

const platform_schema = new Schema(
  {
    domain: String,
    image_id: { type: Schema.ObjectId },
    images_collection: CollectionSchema,
    name: String,
  },
  { strict: false }
);

module.exports = platform_schema;
