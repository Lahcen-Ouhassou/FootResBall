const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer token

    if (!token)
      return res.status(401).json({ message: "Invalid token format" });

    const decoded = jwt.verify(token, "your_jwt_secret");

    req.admin = decoded; // باش نعرفو شكون داخل

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
