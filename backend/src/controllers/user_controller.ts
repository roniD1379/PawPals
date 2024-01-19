
import User, { IUser } from "../models/user_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";

class UserController extends BaseController<IUser>{
    constructor() {
        super(User)
    }

    async getById(req: AuthResquest, res: Response) {
        
        try {
            const obj = await User.findById(req.params.id).select({ password: 0 });
            res.send(obj);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new UserController();
