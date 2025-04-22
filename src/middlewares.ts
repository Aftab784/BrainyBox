import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const usermiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers["token"] as string;
    
        if (!token) {
          res.status(401).json({ message: "Token not provided" });
          return;
        }
    
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET as string);
    
        if (typeof decoded === "string") {
          res.status(403).json({ message: "Invalid token format" });
          return;
        }
    
        req.userId = (decoded as JwtPayload).id;
        next();
      } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
      }
};
