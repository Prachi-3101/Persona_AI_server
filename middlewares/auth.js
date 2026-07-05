import jwt from "jsonwebtoken";
import { generateAccessToken, setTokens } from "../utils/tokens.js";

export const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Access token missing" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      req.userId = decoded.userId;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired" });
      }
      return res.status(401).json({ message: "Invalid access token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Authentication error" });
  }
};
