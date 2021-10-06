"use strict";

const express = require("express");
const morgan = require("morgan");

// Import handler functions
const {
  addPresets,
  getPresets,
  getPreset,
  updatePreset,
  deletePreset,
} = require("./Handlers");

const PORT = 4000;

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // REST endpoints?
  .get("/bacon", (req, res) => res.status(200).json("🥓"))

  ////----------END POINTS----------////

  // GET presets all PRESETS
  .get("/presets", getPresets)

  // GET single PRESET
  .get("/preset/:id", getPreset)

  //PUT single PRESET
  .put("/preset/:id", updatePreset)

  // POST single PRESET
  .post("/presets", addPresets)

  //DELETE single PRESET
  .delete("/preset/:id", deletePreset)

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
