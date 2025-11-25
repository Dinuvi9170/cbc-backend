import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const tokenString = req.header("Authorization");

  if (!tokenString) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = tokenString.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || !decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = decoded; 
    next();
  });
};
