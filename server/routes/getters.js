const router = require("express").Router();
const axios = require("axios");

// Location Methods
const degreeOfLatOrLongInMeters = 111000;
async function searchForPlace(query) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  return response;
}
router.route("/google-maps-search/:query").get(async (req, res) => {
  const { data } = await searchForPlace(req.params.query);

  if (data.error_message) {
    res.status(500).send({ ok: false, ...data });
  } else {
    res.status(200).send({ ok: true, results: data.results });
  }
});
async function getLatLongFromIp(ip) {
  const { data } = await axios.get(`https://www.iplocate.io/api/lookup/${ip}`);
  return data;
}
function isLatLongInCircle(centerLat, centerLong, radius, lat, long) {
  const dx = Math.abs(lat - centerLat);
  const dy = Math.abs(long - centerLong);
  return Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(radius, 2);
}
function convertRadiusToMeters(val, unit) {
  if (unit === "mi") {
    return val * 1609.34;
  } else if (unit === "km") {
    return val * 1000;
  } else {
    return val;
  }
}
function filterImagesOutOfRange(locations, latitude, longitude) {
  let returnResponse = [];
  for (let i = 0; i < locations.length; i++) {
    if (
      locations[i].ignoreLocations ||
      !locations[i].locations ||
      locations[i].locations.length === 0
    ) {
      returnResponse.push(locations[i]);
    } else {
      // If there is at least 1 location that we are within the radius of add it into the return response
      if (
        locations[i].locations.some((location) =>
          isLatLongInCircle(
            latitude,
            longitude,
            convertRadiusToMeters(location.radius, location.radiusUnit) /
              degreeOfLatOrLongInMeters,
            location.latitude,
            location.longitude
          )
        )
      ) {
        returnResponse.push(locations[i]);
      }
    }
  }
  return returnResponse;
}

// Image Getters
const getModel = require("../models/get-image-model");
router.route("/rim-images").get(async (req, res) => {
  if (res.locals.ip === "::1") res.locals.ip = "65.28.240.145";
  const { latitude, longitude } = await getLatLongFromIp(res.locals.ip);

  const Model = await getModel(req.query.image_collection_name);
  Model.find({ isCenterImage: false }, async (err, response) => {
    if (err) {
      console.log(err);
      return;
    }
    if (req.query.ignoreLocations == "true") {
      res.json(response);
      return;
    } else {
      const returnResponse = filterImagesOutOfRange(
        response,
        latitude,
        longitude
      );
      res.json(returnResponse);
    }
  });
});
router.route("/center-images").get(async (req, res) => {
  if (res.locals.ip === "::1") res.locals.ip = "65.28.240.145";
  const { latitude, longitude } = await getLatLongFromIp(res.locals.ip);

  const Model = await getModel(req.query.image_collection_name);
  Model.find({ isCenterImage: true }, async (err, response) => {
    if (err) {
      console.log(err);
      return;
    }
    if (req.query.ignoreLocations == "true") {
      res.json(response);
      return;
    } else {
      const returnResponse = filterImagesOutOfRange(
        response,
        latitude,
        longitude
      );
      res.json(returnResponse);
    }
  });
});
router.route("/image/:id").get(async (req, res) => {
  const Model = await getModel(req.query.image_collection_name);
  Model.findOne({ _id: req.params.id }, async (err, response) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(response);
  });
});

// Platform Getters
const Platform = require("../models/platform-model");
router.route("/platform").get((req, res) => {
  const domain = req.query.origin_override
    ? req.query.origin_override
    : req.get("origin");
  Platform.findOne({ domain }, async (err, response) => {
    if (err) {
      console.log(err);
      res.status(400).send({ ok: false, platform: null, error: err });
      return;
    }
    res.status(200).send({ ok: true, platform: response });
  });
});

// Collection Getters
const Collections = require("../models/collection-model");
router.route("/collections").get((req, res) => {
  try {
    Collections.find(async (err, response) => {
      if (err) {
        throw err;
      }
      res
        .status(200)
        .send({ ok: true, message: "Successfully got collections", response });
    });
  } catch (e) {
    res
      .status(400)
      .send({ ok: false, message: "Error getting collections data", e });
  }
});

module.exports = router;
