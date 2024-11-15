import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";
class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signUp(req, res, next) {
    const { name, email, password, type } = req.body;
    try {
      const user = new UserModel(name, email, password, type);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }
  async signIn(req, res) {
    try {
      // 1. Find user by email
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        const result = req.body.password;
        if (result) {
          // 2. Create token
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          // 3. Send token
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (error) {
      return res.status(500).send("Somthing went wrong");
    }
  }
  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const userID = req.userID;
    try {
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is updated");
    } catch (error) {
      console.log("Passing error to middleware");
      next(error);
    }
  }
}
export default UserController;
