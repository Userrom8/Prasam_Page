import Admin from "../model/adminModel.js";

export const getAllAdmins = async (req, res) => {
  const admins = await Admin.find().select("email _id");
  res.status(200).json(admins);
};

export const addAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  try {
    const newAdmin = await Admin.create({ email, password });
    res.status(201).json({ email: newAdmin.email, _id: newAdmin._id });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
};

export const removeAdmin = async (req, res) => {
  const { id } = req.params;
  await Admin.findByIdAndDelete(id);
  res.status(204).send();
};
