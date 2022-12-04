const router = require("express").Router();

// Image Mutators
const getModel = require("../models/get-image-model");
router.route("/edit/:id").put(async (req, res) => {
  const Model = await getModel(req.query.image_collection_name);
  Model.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    async (err, response) => {
      if (err) {
        res.status(400).send({
          ok: false,
          message: "Unsuccessfully edited image",
          response,
        });
        return;
      }
      Model.findOne({ _id: req.params.id }, async (err, image) => {
        res
          .status(200)
          .send({ ok: true, message: "Successfully edited image", image });
      });
    }
  );
});

// ClickThru Setters
router.route("/click-thru/:id/outer").put(async (req, res) => {
  const Model = await getModel(req.query.image_collection_name);
  const image = await Model.findOne({ _id: req.params.id });

  // Initialize newClickThru count
  let newClickThruCount = image.outerClickThruCount;
  if (newClickThruCount === undefined || newClickThruCount === null)
    newClickThruCount = 0;

  // Increment newClickThru count
  newClickThruCount = newClickThruCount + 1;

  Model.findOneAndUpdate(
    { _id: req.params.id },
    { outerClickThruCount: newClickThruCount },
    async (err, response) => {
      if (err) {
        res.status(400).send({
          ok: false,
          message: "Unsuccessfully updated outer clickThru of image",
          response,
        });
        return;
      }
      Model.findOne({ _id: req.params.id }, async (err, image) => {
        res.status(200).send({
          ok: true,
          message: "Successfully updated outer clickThru of image",
          image,
        });
      });
    }
  );
});
router.route("/click-thru/:id/center").put(async (req, res) => {
  const Model = await getModel(req.query.image_collection_name);
  const image = await Model.findOne({ _id: req.params.id });

  // Initialize newClickThru count
  let newClickThruCount = image.centerClickThruCount;
  if (newClickThruCount === undefined || newClickThruCount === null)
    newClickThruCount = 0;

  // Increment newClickThru count
  newClickThruCount = newClickThruCount + 1;

  Model.findOneAndUpdate(
    { _id: req.params.id },
    { centerClickThruCount: newClickThruCount },
    async (err, response) => {
      if (err) {
        res.status(400).send({
          ok: false,
          message: "Unsuccessfully updated center clickThru of image",
          response,
        });
        return;
      }
      Model.findOne({ _id: req.params.id }, async (err, image) => {
        res.status(200).send({
          ok: true,
          message: "Successfully updated center clickThru of image",
          image,
        });
      });
    }
  );
});

// // Platform Mutators
const Platforms = require('../models/platform-model')
const Collections = require('../models/collection-model')
router.route('/platform').put(async (req, res) => {
  const mutating_platform = await Platforms.findOne({ domain: req.body.domain })
  if (!mutating_platform) {
    const image_collection = await Collections.findOne({ collection_name: "images" })
    Platforms.create({ domain: req.body.domain, image_id: req.body.image_id, image_collection }, async (err, response) => {
      if (err) {
        res.status(400).send({ ok: false, message: 'Unsuccessfully added platform', response })
        return
      }
      Platforms.findOne({ domain: req.body.domain }, async (err, platform) => {
        res.status(200).send({ ok: true, message: 'Successfully added platform', platform })
      })
    })
    return
  } else {
    if (req.body.isMainImageForDomain) {
      mutating_platform.image_id = req.body.image_id
    } else if (!req.body.isMainImageForDomain && req.body.image_id === String(mutating_platform.image_id)) {
      mutating_platform.image_id = null
    }
    if (req.body.name) mutating_platform.name = req.body.name
    if (req.body.images_collection_name) mutating_platform.images_collection_name = req.body.images_collection_name
    if (req.body.images_collection) {
      const collection = await Collections.findOne({ _id: req.body.images_collection._id })
      mutating_platform.images_collection = collection
    }
    // if (req.body.images_collection_name) mutating_platform.images_collection_name = req.body.images_collection_name
    Platforms.findOneAndUpdate({ domain: req.body.domain }, { ...mutating_platform }, async (err, response) => {
      if (err) {
        res.status(400).send({ ok: false, message: 'Unsuccessfully edited platform', response })
        return
      }
      Platforms.findOne({ domain: req.body.domain }, async (err, platform) => {
        res.status(200).send({ ok: true, message: 'Successfully edited platform', platform })
      })
    })
  }
})

module.exports = router;
