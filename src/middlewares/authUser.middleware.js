import jwt from "jsonwebtoken";

export const verifyUserJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // userId + email available
    next();
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};