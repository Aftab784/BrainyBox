import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express" {
  export interface Request {
    userId?: string;
  }
}
export const usermiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers['token'] as string;
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

// export const usermiddleware = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_USER_SECRET) as { id: string };
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };