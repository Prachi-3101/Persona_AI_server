import express from "express";
const router = express.Router();
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
