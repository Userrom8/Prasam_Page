import Admin from "../model/adminModel.js";

export const getAllAdmins = async (req, res) => {
  const admins = await Admin.find().select("email _id");
  res.status(200).json(admins);
};

export const addAdmin = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  const newAdmin = await Admin.create({ email });
  res.status(201).json(newAdmin);
};

export const removeAdmin = async (req, res) => {
  const { id } = req.params;
  await Admin.findByIdAndDelete(id);
  res.status(204).send();
};
