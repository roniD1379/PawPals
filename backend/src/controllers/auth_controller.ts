import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { OAuth2Client } from "google-auth-library";
import user_service from "../services/user_service";

const USERNAME_REGEX = /^[a-zA-Z0-9]{6,}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
const client = new OAuth2Client();

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
      firstName: firstName,
      lastName: lastName,
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

    await User.updateOne(
      { _id: user._id },
      { refreshTokens: user.refreshTokens }
    );

    return res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.log("Login error: " + err);
    return res.status(500).send("Server error");
  }
};

const googleLogin = async (req: Request, res: Response) => {
  const { credential, client_id } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: client_id,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const givenName = payload.given_name;
    const familyName = payload.family_name;
    const profileImage = payload.picture;
    let username = email.split("@")[0];

    let user = await User.findOne({ username: username });
    if (!user) {
      username = await user_service.generateUniqueUsername(email);
      user = await User.create({
        username: username,
        firstName: givenName,
        lastName: familyName,
        description: "",
        userImage: profileImage,
        phoneNumber: "-",
        password: "-",
        authSource: "google",
      });
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

    await User.updateOne(
      { _id: user._id },
      { refreshTokens: user.refreshTokens }
    );

    return res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.log("Google login error: " + err);
    return res.status(500).send("Server error");
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) {
    return res.status(401).send();
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: ObjectId }) => {
      if (err) {
        return res.status(401).send();
      }

      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();

          return res.status(401).send();
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
            (t) => t !== refreshToken
          );
          await userDb.save();

          return res.status(200).send();
        }
      } catch (err) {
        return res.status(500).send(err.message);
      }
    }
  );
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) {
    return res.status(401).send();
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: ObjectId }) => {
      if (err) return res.status(401).send();

      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          console.log("Refresh token not found");
          userDb.refreshTokens = [];
          await User.updateOne(
            { _id: userDb._id },
            { refreshTokens: userDb.refreshTokens }
          );
          return res.status(401).send();
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
        await User.updateOne(
          { _id: userDb._id },
          { refreshTokens: userDb.refreshTokens }
        );

        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: newRefreshToken,
        });
      } catch (err) {
        return res.status(500).send(err.message);
      }
    }
  );
};

export default {
  register,
  login,
  googleLogin,
  logout,
  refresh,
};
