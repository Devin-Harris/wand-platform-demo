const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const collection_schema = new Schema(
  {
    _id: { type: Schema.ObjectId, auto: true },
    collection_name: String,
    display_name: String,
    is_deleted: {
      type: Boolean,
      required: false,
    },
    is_default_collection: {
      type: Boolean,
      required: false,
    },
  },
  { strict: false }
);

module.exports = collection_schema;
