const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  arrayId: [],
  id : { type: String, required: true }
});

module.exports = mongoose.model("Like", likeSchema);