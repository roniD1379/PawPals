import post_model from "../models/post_model";
import user_model from "../models/user_model";

class UserService {
  async getUserNumOfPosts(userId: string) {
    return await post_model.countDocuments({ ownerId: userId });
  }

  async generateUniqueUsername(email: string) {
    const baseUsername = email.split("@")[0];
    let username = baseUsername;
    let suffix = 0;

    while (await this.isUsernameExists(username)) {
      suffix++;
      username = `${baseUsername}${suffix}`;
    }

    return username;
  }

  async isUsernameExists(username: string) {
    const user = await user_model.findOne({ username });
    return user !== null;
  }
}

export default new UserService();
