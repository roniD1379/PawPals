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
      };

      res.status(200).send(userDetails);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new UserController();
