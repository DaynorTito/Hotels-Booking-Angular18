import { User } from "../../infrastructure/database/mongoose/UserModel.js";

class UserRepository {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async getAllUsers(filters) {
    return await User.find(filters);
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async updateUser(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

export default UserRepository;
