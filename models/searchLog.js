const mongoose = require("mongoose");

const searchLogSchema = new mongoose.Schema({
  userId: String,
  location: String,
  minPrice: Number,
  maxPrice: Number,
  minRating: Number,
  searchDate: Date,
});

module.exports = mongoose.model("SearchLog", searchLogSchema);
