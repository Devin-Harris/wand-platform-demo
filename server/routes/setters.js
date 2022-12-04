const router = require("express").Router();
const ftp = require("basic-ftp");
const formidable = require("formidable");
const fs = require("fs");
const schema = require("./../schemas/image-schema");
const mongoose = require("mongoose");

async function createFTPConnection() {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  await client.access({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.MONGO_ATLAS_PASSWORD,
    secure: true,
    secureOptions: { rejectUnauthorized: false },
  });
  return client;
}
async function uploadImage(image) {
  const client = await createFTPConnection();
  const stream = fs.createReadStream(image.path);
  await client.uploadFrom(stream, image.name);
  client.close();
}
async function removeFile(dataPath) {
  const client = await createFTPConnection();
  const paths = dataPath.split("/");
  try {
    await client.remove(paths[paths.length - 1]);
  } catch (e) {
    console.log("Error deleting file: ", e);
  }
  client.close();
}

// Image Setters
const getModel = require("../models/get-image-model");
router.route("/add").post(async (req, res) => {
  const Model = await getModel(req.query.image_collection_name);
  Model.create(req.body, async (err, response) => {
    if (err) {
      res
        .status(400)
        .send({ ok: false, message: "Unsuccessfully added an image" });
      return;
    }
    res.status(200).send({
      ok: true,
      message: "Successfully added an image",
      image: response,
    });
  });
});
router.route("/upload").post(async (req, res) => {
  try {
    new formidable.IncomingForm()
      .parse(req)
      .on("file", async (name, file) => {
        await uploadImage(file);
        res
          .status(200)
          .send({ ok: false, message: "Successfully uploaded an image", name });
      })
      .on("error", (err) => {
        throw err;
      });
  } catch (error) {
    res
      .status(400)
      .send({ ok: false, message: "Unsuccessfully uploaded an image", error });
  }
});
router.route("/delete/:id").delete(async (req, res) => {
  const Model = await getModel(req.query.image_collection_name);
  const image = await Model.findOne({ _id: req.params.id });
  Model.deleteOne({ _id: req.params.id }, async (err, response) => {
    if (err) {
      res
        .status(400)
        .send({ ok: false, message: "Unsuccessfully deleted an image" });
      return;
    }
    await removeFile(image.data);
    res
      .status(200)
      .send({ ok: true, message: "Successfully deleted an image" });
  });
});
router.route("/delete-path").post(async (req, res) => {
  try {
    await removeFile(req.body.path);
    res
      .status(200)
      .send({ ok: true, message: "Successfully deleted an image" });
  } catch {
    res
      .status(400)
      .send({ ok: false, message: "Unsuccessfully deleted an image" });
  }
});

// Platform Setters
const Platforms = require("../models/platform-model");
const Collections = require("../models/collection-model");
router.route("/platform").post(async (req, res) => {
  const { domain, images_collection_name } = req.body;
  console.log(domain, images_collection_name);
  try {
    let images_collection = await Collections.findOne({
      collection_name: images_collection_name,
    });

    if (!images_collection) {
      throw "No collection found";
    }

    Platforms.create({ domain, images_collection }, async (err, platform) => {
      if (err) {
        res.status(400).send({
          ok: false,
          message: "Unsuccessfully created platform",
          response,
        });
        return;
      }
      res.status(200).send({
        ok: true,
        message: "Successfully created platform",
        platform,
      });
      return;
    });
  } catch (e) {
    res
      .status(400)
      .send({ ok: false, message: "Unsuccessfully created platform", e });
  }
});

// Collection Setters
router.route("/collections").post(async (req, res) => {
  const { name, duplicate_from_collection, action } = req.body;
  let collection_name = name;
  if (name.length === 1 || name[name.length - 1] !== "s") {
    collection_name += "s";
  }
  try {
    Collections.exists({ collection_name }, async (err, collectionExists) => {
      if (err) {
        throw err;
      }
      if (collectionExists) {
        throw "Duplicate collection name";
      }
    });

    Collections.create(
      { collection_name, display_name: name },
      async (err, collection) => {
        if (err) {
          throw err;
        }

        // Create empty collection in db atlas
        mongoose.model(collection_name, schema);

        if (action === "duplicate" && duplicate_from_collection) {
          const duplicateCollectionModel = await getModel(
            duplicate_from_collection.collection_name
          );
          duplicateCollectionModel.find(async (err2, response) => {
            if (err2) {
              throw err2;
            }
            const newCollectionModel = await getModel(collection_name);
            newCollectionModel.insertMany(response, async (err3, response) => {
              if (err3) {
                throw err3;
              }
            });
          });
        }

        res.status(200).send({
          ok: true,
          message: "Successfully created collection",
          collection,
        });
        return;
      }
    );
  } catch (e) {
    res
      .status(400)
      .send({ ok: false, message: "Unsuccessfully created collection", e });
  }
});
router.route("/collections").delete(async (req, res) => {
  const { _id, collection_name } = req.body;
  try {
    Collections.exists({ _id }, async (err, collectionExists) => {
      if (!collectionExists) {
        throw "Collection name does not exist";
      }
    });

    Collections.updateOne(
      { _id },
      { $set: { is_deleted: true } },
      async (err, response) => {
        if (err) {
          throw response;
        } else {
          res.status(200).send({
            ok: true,
            message: "Successfully deleted collection",
          });
        }
      }
    );
  } catch (e) {
    res
      .status(400)
      .send({ ok: false, message: "Unsuccessfully created collection", e });
  }
});

module.exports = router;
