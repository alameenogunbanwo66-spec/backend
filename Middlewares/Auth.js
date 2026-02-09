const jwt = require("jsonwebtoken");
const USER = require("../Models/User")

exports.auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!authHeader || !authHeader.startsWith("Bearer ") || !token) {
    return res.status(401).json({ message: "Unauthorized. No token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const user = await USER.findById(decoded.id); // make sure JWT has "id"
    if (!user) return res.status(401).json({ message: "Unauthorized. User not found." });

    req.user = user;
    console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    console.error("Token error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
  next();
};
exports.isUser = (req, res, next) => {
  if (req.user.role !== "user") return res.status(403).json({ message: "Forbidden" });
  next();
};
