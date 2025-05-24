import jwt from "jsonwebtoken";


export const authenticatedUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token not available" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded.id)
        req.user = {
            userId: decoded.id || decoded.userId,
            role: decoded.role,
            organisationId: decoded.organisationId  // Consistent spelling
          };
        next();

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }
      next();
    };
  };