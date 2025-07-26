import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  // The key will be a unique identifier like 'heroText' or 'contactEmail'
  key: {
    type: String,
    required: true,
    unique: true,
  },
  // The value will be the text content itself
  value: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Content", ContentSchema);
