import UserModel, { IUser } from "../models/user_model";
import createController from "./base_controller";

const userController = createController<IUser>(UserModel);

export default userController
