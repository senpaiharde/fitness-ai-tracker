import { error } from "console";
import { Request, Response, NextFunction, response } from "express";
import  jwt  from "jsonwebtoken";

const JWT_SECRET = 'dev_secret'

export const authMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error: 'Unauthorized'});
    }


    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }catch {
        res.status(401).json({ error: 'Invaild token'})
    }

}