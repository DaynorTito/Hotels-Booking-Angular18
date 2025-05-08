import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  ALREADY_EXISTS,
  RESOURCE_NOT_FOUND,
  UNAUTHENTICATED
} from "../../application/utils/errors.js";

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login(email, password) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw RESOURCE_NOT_FOUND("User");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw UNAUTHENTICATED("Invalid password");

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    return { token, name: user.name };
  }

  async register(userData) {
    const { email, password, name, role } = userData;

    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) throw ALREADY_EXISTS("User");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      name,
      role
    });

    return { id: user.id, name, email, role: user.role };
  }

  static createBlacklist() {
    return new Set();
  }

  async logout(token, blacklist) {
    blacklist.add(token);
    return true;
  }

  isTokenBlacklisted(token, blacklist) {
    return blacklist.has(token);
  }
}

export default AuthService;
