import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import DoctorUser from "../models/doctoruserModel.js";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const doctoruser = await DoctorUser.findOne({ email });

  if (doctoruser && (await doctoruser.matchPassword(password))) {
    res.json({
      _id: doctoruser._id,
      name: doctoruser.name,
      email: doctoruser.email,
      isAdmin: doctoruser.isAdmin,
      token: generateToken(doctoruser._id),
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await DoctorUser.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const doctoruser = await DoctorUser.create({
    name,
    email,
    password,
  });

  if (doctoruser) {
    res.status(201).json({
      _id: doctoruser._id,
      name: doctoruser.name,
      email: doctoruser.email,
      isAdmin: doctoruser.isAdmin,
      token: generateToken(doctoruser._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid doctoruser data");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const doctoruser = await DoctorUser.findById(req.doctoruser._id);

  if (doctoruser) {
    res.json({
      _id: doctoruser._id,
      name: doctoruser.name,
      email: doctoruser.email,
      isAdmin: doctoruser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const doctoruser = await DoctorUser.findById(req.doctoruser._id);

  if (doctoruser) {
    doctoruser.name = req.body.name || doctoruser.name;
    doctoruser.email = req.body.email || doctoruser.email;
    if (req.body.password) {
      doctoruser.password = req.body.password;
    }

    const updatedUser = await doctoruser.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const getUsers = asyncHandler(async (req, res) => {
  const users = await DoctorUser.find({});
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const doctoruser = await DoctorUser.findById(req.params.id);

  if (doctoruser) {
    await doctoruser.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const getUserById = asyncHandler(async (req, res) => {
  const doctoruser = await DoctorUser.findById(req.params.id).select('-password')

  if (doctoruser) {
    res.json(doctoruser)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const updateUser = asyncHandler(async (req, res) => {
  const doctoruser = await DoctorUser.findById(req.params.id);

  if (doctoruser) {
    doctoruser.name = req.body.name || doctoruser.name;
    doctoruser.email = req.body.email || doctoruser.email;
    doctoruser.isAdmin = req.body.isAdmin;

    const updatedUser = await doctoruser.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  getUserProfile,
  authUser,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
