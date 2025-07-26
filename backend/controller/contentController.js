import Content from "../model/contentModel.js";

/**
 * @desc    Get all editable content
 * @route   GET /api/content
 * @access  Public
 */
export const getContent = async (req, res) => {
  try {
    const items = await Content.find({});
    // Convert the array of documents into a single key-value object
    // for easier use on the frontend.
    const contentObject = items.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    res.json(contentObject);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Update or create content
 * @route   PUT /api/content
 * @access  Private (should be protected in a real app)
 */
export const updateContent = async (req, res) => {
  try {
    // Loop through the key-value pairs in the request body
    for (const [key, value] of Object.entries(req.body)) {
      // Find a document with the given key and update its value,
      // or create it if it doesn't exist (upsert: true).
      await Content.findOneAndUpdate(
        { key: key },
        { value: value },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    res.status(200).json({ message: "Content updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
