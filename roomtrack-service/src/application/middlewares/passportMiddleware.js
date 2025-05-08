import passport from "../../infrastructure/auth/passport.js";

export const authenticateJWT = (...allowedRoles) => {
  return (req, res, next) => {
    passport.authenticate("jwt", { session: true }, (err, user, info) => {
      if (err) {
        console.error(err);
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          message: info.message || "Unauthorized verify your credentials"
        });
      }

      if (allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.some((role) =>
          user.role.includes(role)
        );

        if (!hasRequiredRole) {
          return res.status(403).json({
            message: "Insufficient permissions to perform this action"
          });
        }
      }

      req.user = { ...user, id: user._id };
      next();
    })(req, res, next);
  };
};
