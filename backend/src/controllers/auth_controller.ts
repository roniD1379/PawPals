import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

const USERNAME_REGEX = /^[a-zA-Z0-9]{6,}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

const register = async (req: Request, res: Response) => {
  let filename = "";
  if (req.file) filename = (req.file as Express.Multer.File).filename;

  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userImage = filename ? filename : "";
  const phoneNumber = req.body.phoneNumber;
  const description = req.body.description;

  // Validation
  if (!username || !username.match(USERNAME_REGEX)) {
    return res
      .status(400)
      .send(
        "Username can only contain letters and numbers and must be at least 6 characters long"
      );
  }

  if (!password || !password.match(PASSWORD_REGEX)) {
    return res
      .status(400)
      .send(
        "Password must contain letters and numbers and must be at least 6 characters long"
      );
  }

  if (!firstName) return res.status(400).send("First name is required");
  if (!lastName) return res.status(400).send("Last name is required");
  if (!phoneNumber) return res.status(400).send("Phone number is required");

  try {
    const isUserExists = await User.findOne({ username: username });
    if (isUserExists != null) {
      return res.status(406).send("Username already exists");
    }

    // Register the user
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username: username,
      password: encryptedPassword,
      firstname: firstName,
      lastname: lastName,
      userImage: userImage,
      description: description,
      phoneNumber: phoneNumber,
    });

    console.log("User registered successfully, ID: " + newUser._id);
    return res.status(201).send(newUser);
  } catch (err) {
    console.log("Registration error: " + err);
    return res.status(500).send("Server error");
  }
};

const login = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validation
  if (!username) return res.status(400).send("Username is required");
  if (!password) return res.status(400).send("Password is required");

  try {
    const user = await User.findOne({ username: username });
    if (user == null) {
      return res.status(400).send("Username or password incorrect");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send("Username or password incorrect");
    }

    // Create JWT
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );
    if (user.refreshTokens == null) {
      user.refreshTokens = [refreshToken];
    } else {
      user.refreshTokens.push(refreshToken);
    }

    await user.save();

    return res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.log("Login error: " + err);
    return res.status(500).send("Server error");
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) {
    return res.sendStatus(401);
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: ObjectId }) => {
      if (err) {
        return res.sendStatus(401);
      }

      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();

          return res.sendStatus(401);
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
            (t) => t !== refreshToken
          );
          await userDb.save();

          return res.sendStatus(200);
        }
      } catch (err) {
        res.sendStatus(500).send(err.message);
      }
    }
  );
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) {
    return res.sendStatus(401);
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: ObjectId }) => {
      if (err) {
        return res.sendStatus(401);
      }

      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        }

        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET
        );
        userDb.refreshTokens = userDb.refreshTokens.filter(
          (t) => t !== refreshToken
        );
        userDb.refreshTokens.push(newRefreshToken);
        await userDb.save();

        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } catch (err) {
        res.sendStatus(500).send(err.message);
      }
    }
  );
};

export default {
  register,
  login,
  logout,
  refresh,
};
