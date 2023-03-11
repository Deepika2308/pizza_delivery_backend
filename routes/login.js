import express from "express";
import jwt from "jsonwebtoken";
import { findAdmin, findCustomer } from "../helper.js";
import { checkString } from "../server.js";
import bcrypt from 'bcrypt';

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body.body;
  const isAdmin = checkString(email);

  try {
    //check if user is registered
    let user;

    if (isAdmin) {
      user = await findAdmin(email);
    } else {
      user = await findCustomer(email);
    }
    if (user) {
      let dbPassword = user.password;
      //validate password
      let checkPassword = await bcrypt.compare(password, dbPassword);

      if (checkPassword) {
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
          expiresIn: "25m",
        });
        res.status(200).send({ result: user, token: jwtToken });
      } else {
        res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      res.status(404).send({ error: "User not found!!" });
    }
  } catch (err) {
    res.status(500).send({ error: "Internal server error" });
  }
});

export const loginRouter = router;
