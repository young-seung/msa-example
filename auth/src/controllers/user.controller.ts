import { Request, Response } from 'express';
import { getRepository, IsNull } from 'typeorm';
import Jwt from 'jsonwebtoken';
import User from '../entity/user.entity';
import AppConfiguration from '../config';

class UserController{
  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = getRepository(User);
    
    const userInfo = new Array();

    try {
      const users = await userRepository.find( { deletedAt: IsNull() })

      if (users.length > 0) {
        users.forEach((element) => {
          userInfo.push({
            id: element.id,
            email: element.email,
            access: Jwt.sign(
              {id: element.id, email: element.email},
              AppConfiguration.JWT_SECRET,
              { expiresIn: AppConfiguration.JWT_EXPIRATION }
            )
          });
        });
      };
    } catch (error) {
      res.status(404).send('User not found');
    }

    //Send the users object
    res.json(userInfo);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;

    //Get the user from database
    const userRepository = getRepository(User);

    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ['id', 'name', 'email', 'password']
      });
      res.json(user);
    } catch (error) {
      res.status(404).send('User not found');
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { name, email, password } = req.body;

    let user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.createdAt = new Date();

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send('username already in use');
      return;
    }

    //If all ok, send 201 response
    res.json({ user });
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    //Try to find user on database
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send('User not found');
      return;
    }

    user.password = req.body.password;
    user.hashPassword();

    //Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send('username already in use');
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send('User not found');
      return;
    }
    userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
};

export default UserController;