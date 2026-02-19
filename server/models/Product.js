const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  servicedBy: String,
  servicedOn: Date,
  notes: String
});

const ProductSchema = new mongoose.Schema({
  productName: String,
  productLink: String,
  sku: { type: String, unique: true, default: () => `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
  location: {
    address: String,
    lat: Number,
    lng: Number
  },
  serviceHistory: [ServiceSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
