import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import Config from '../config';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // Get the jwt token from the head
  const token = <string>req.headers['token'];
  let jwtPayload;
  
  //Try to validate the token and get data
  try {
    jwtPayload = Jwt.verify(token, Config.JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }

  //Call the next middleware or controller
  next();
};