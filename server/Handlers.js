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
    //   console.log("connected!");
    const result = await db.collection("presets").insertOne(req.body);

    // assert.equal(1, result.insertedCount);

    res.status(201).json({ status: 201, data: req.body });
    // client.close();
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

const getPresets = async (req, res) => {
  const client = await new MongoClient(MONGO_URI, options);
  // connect to the client
  await client.connect();
  // connect to the database (db name is provided as an argument to the function)
  const db = client.db("ampandplay");
  //get result
  const data = await db.collection("presets").find().toArray();
  if (data.length > 0) {
    res.status(200).json({ status: 200, data: data });
  } else {
    res
      .status(404)
      .json({ status: 404, message: "No reservation preset found" });
  }
};

module.exports = {
  addPresets,
  getPresets,
};
