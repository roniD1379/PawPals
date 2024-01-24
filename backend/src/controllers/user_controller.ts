import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import user_service from "../services/user_service";

class UserController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  async getUserDetails(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select({ password: 0 });
      const numOfPosts = await user_service.getUserNumOfPosts(userId);
      const userDetails = {
        username: user.username,
        numOfPosts: numOfPosts,
        userImage: user.userImage,
        description: user.description,
        firstName: user.firstname,
        lastName: user.lastname,
        phoneNumber: user.phoneNumber,
      };

      res.status(200).send(userDetails);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async editUserDetails(req: AuthRequest, res: Response) {
    try {
      let filename = "";
      if (req.file) filename = (req.file as Express.Multer.File).filename;

      const userId = req.user._id;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const userImage = filename ? filename : "";
      const phoneNumber = req.body.phoneNumber;
      const description = req.body.description;

      if (!firstName) return res.status(400).send("First name is required");
      if (!lastName) return res.status(400).send("Last name is required");
      if (!phoneNumber) return res.status(400).send("Phone number is required");

      const user = await User.findById(userId);
      if (!user) return res.status(400).send("User not found");

      await User.findByIdAndUpdate(userId, {
        firstname: firstName,
        lastname: lastName,
        userImage: userImage === "" ? user.userImage : userImage,
        phoneNumber: phoneNumber,
        description: description,
      });

      console.log("Edited user details successfully");
      res.status(200).send();
    } catch (err) {
      console.log("Failed to edit user details: " + err.message);
      res.status(500).json({ message: err.message });
    }
  }
}

export default new UserController();
