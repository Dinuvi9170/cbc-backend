import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
    const tokenString = req.header("Authorization");
    if (!tokenString) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || !decoded) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = decoded;
        next();
    });
};

export const requireAdmin = (req, res, next) => {
 
  const tokenString = req.header("Authorization");
    if (!tokenString) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = tokenString.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }
    req.user = decoded;
    next();
};