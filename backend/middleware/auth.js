import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized. Login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX — Always use decoded.id
    req.body.userId = decoded.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
