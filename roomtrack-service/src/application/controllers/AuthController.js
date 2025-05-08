import UserRepository from "../../adapters/repositories/UserRepository.js";
import AuthService from "../../domain/services/AuthService.js";

const tokenBlacklist = AuthService.createBlacklist();

class AuthController {
  constructor() {
    const userRepository = new UserRepository();
    this.authService = new AuthService(userRepository);
  }

  register = async (req, res, next) => {
    try {
      const userData = await this.authService.register(req.body);
      res.status(201).json(userData);
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token, name } = await this.authService.login(email, password);
      res.status(200).json({ token, name });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }
      this.authService.logout(token, tokenBlacklist);
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    });
  };
}

export default AuthController;
