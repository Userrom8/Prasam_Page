import Content from "../model/contentModel.js";

/**
 * @desc    Get the single content document for the entire site
 * @route   GET /api/content
 * @access  Public
 */
export const getContent = async (req, res) => {
  try {
    // Find the one and only content document.
    let content = await Content.findOne({});
    // If it doesn't exist (e.g., first run), create it with default values.
    if (!content) {
      content = await Content.create({});
    }
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Update basic content fields like heroText, contactEmail etc.
 * @route   PUT /api/content
 * @access  Private
 */
export const updateContent = async (req, res) => {
  try {
    // Find the single document and update the fields passed in the body.
    // Using $set ensures only provided fields are updated.
    // upsert:true will create the document if it doesn't exist.
    const updatedContent = await Content.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updatedContent);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Update a specific testimonial, including its image
 * @route   PUT /api/content/testimonial
 * @access  Private
 */
export const updateTestimonial = async (req, res) => {
  try {
    const { index, name, text } = req.body;

    // Find the main content document
    const content = await Content.findOne({});
    if (!content) {
      return res.status(404).json({ message: "Content document not found." });
    }

    // Check if the testimonial at the given index exists
    if (index === undefined || !content.testimonials[index]) {
      return res.status(400).json({ message: "Invalid testimonial index." });
    }

    // Update the text fields
    content.testimonials[index].name = name;
    content.testimonials[index].text = text;

    // --- MODIFICATION ---
    // If a new file was uploaded, encode it to a Base64 data URI and save that string.
    if (req.file) {
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      content.testimonials[index].image = base64Image;
    }

    await content.save();
    res.status(200).json({
      message: `Testimonial ${Number(index) + 1} updated successfully!`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Remove an image from a specific testimonial
 * @route   DELETE /api/content/testimonial/:index/image
 * @access  Private
 */
export const removeTestimonialImage = async (req, res) => {
  try {
    const { index } = req.params;

    const content = await Content.findOne({});
    if (!content || !content.testimonials[index]) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    // Since images are stored as Base64, we just clear the field.
    // If you were storing on a filesystem, you would add logic here to delete the old file.
    content.testimonials[index].image = "";

    await content.save();
    res
      .status(200)
      .json({ message: "Testimonial image removed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
