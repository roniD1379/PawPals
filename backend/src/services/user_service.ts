import post_model from "../models/post_model";

class UserService {
  async getUserNumOfPosts(userId: string) {
    return await post_model.countDocuments({ ownerId: userId });
  }
}

export default new UserService();
