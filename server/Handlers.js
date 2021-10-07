"use strict";
const assert = require("assert");
const { query } = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/// Adding a single preset
const addPresets = async (req, res) => {
  // create new client
  try {
    const client = new MongoClient(MONGO_URI, options);
    // connect to the client
    await client.connect();
    // connect to the database (db name is provided as an argument to the function)
    const db = client.db("ampandplay");

    const result = await db.collection("presets").insertOne(req.body);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

/// Retrieve all presets
const getPresets = async (req, res) => {
  const client = await new MongoClient(MONGO_URI, options);
  // connect to the client
  await client.connect();
  // connect to the database (db name is provided as an argument to the function)
  const db = client.db("ampandplay");

  const data = await db.collection("presets").find().toArray();
  if (data.length > 0) {
    res.status(200).json({ status: 200, data: data });
  } else {
    res.status(404).json({ status: 404, message: "No preset found" });
  }
};

/// retrieve single preset
const getPreset = async (req, res) => {
  const id = req.params.id;

  try {
    const client = await new MongoClient(MONGO_URI, options);
    // connect to the client
    await client.connect();
    // connect to the database (db name is provided as an argument to the function)
    const db = client.db("ampandplay");

    await db.collection("presets").findOne({ id }, (err, result) => {
      if (result) {
        res.status(200).json({ status: 200, id, data: result });
      } else {
        res.status(400).json({ status: 400, id, data: "preset not found" });
      }
    });
  } catch (err) {
    res.status(500).json({ status: 500, data: id, message: err.message });
  }
};

/// update single preset
const updatePreset = async (req, res) => {
  const id = req.params.id;

  try {
    const client = await new MongoClient(MONGO_URI, options);
    // connect to the client
    await client.connect();
    // connect to the database (db name is provided as an argument to the function)
    const db = client.db("ampandplay");

    const newValues = { $set: { ...req.body } };

    const result = await db.collection("presets").updateOne({ id }, newValues);

    res.status(200).json({
      status: 200,
      data: req.body,
      message: "preset modified",
    });
  } catch (err) {
    // console.log("Error:", err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

/// delete single preset
const deletePreset = async (req, res) => {
  const id = req.params.id;

  try {
    const client = await new MongoClient(MONGO_URI, options);
    // connect to the client
    await client.connect();
    // connect to the database (db name is provided as an argument to the function)
    const db = client.db("ampandplay");

    const result = await db.collection("presets").deleteOne({ id });

    client.close();

    if (result.deletedCount === 1) {
      res
        .status(200)
        .json({ status: 200, data: id, message: "preset deleted" });
    } else {
      res.status(400).json({ status: 400, id, message: "preset not found" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, data: id, message: err.message });
  }
};

module.exports = {
  addPresets,
  getPresets,
  getPreset,
  updatePreset,
  deletePreset,
};
