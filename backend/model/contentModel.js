import mongoose from "mongoose";

// Schema for a single testimonial (a sub-document)
const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    text: {
      type: String,
      trim: true,
      default: "",
    },
    // We will store the filename of the uploaded image
    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
); // _id is not needed for sub-documents in this case

// Main schema for all site content
const ContentSchema = new mongoose.Schema({
  heroText: {
    type: String,
    default: "Default Hero Text. Edit me in the dashboard!",
  },
  contactEmail: {
    type: String,
    default: "contact@example.com",
  },
  contactNumber: {
    type: String,
    default: "1234567890",
  },
  linkedinLink: {
    type: String,
    default: "",
  },
  instagramLink: {
    type: String,
    default: "",
  },
  facebookLink: {
    type: String,
    default: "",
  },
  testimonials: {
    type: [testimonialSchema],
    // This ensures there are always exactly 3 testimonial objects in the array
    default: [{}, {}, {}],
  },
});

export default mongoose.model("Content", ContentSchema);
