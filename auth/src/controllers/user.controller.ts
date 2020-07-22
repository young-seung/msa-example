import { Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import { getRepository, IsNull } from 'typeorm';
import AppConfiguration from '../config';
import User from '../entity/user.entity';

class UserController {
  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    const { name, email, password } = req.body;

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.createdAt = new Date();

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the email is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);

      //If all ok, send user response
      res.json({ user });
    } catch (e) {
      res.status(409).send('Failed. Email already in use');
      return;
    }
  };

  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = getRepository(User);
    
    const userInfo = new Array();

    try {
      const users = await userRepository.find({ deletedAt: IsNull() })

      if (users.length > 0) {
        users.forEach((element) => {
          userInfo.push({
            id: element.id,
            email: element.email,
            access: Jwt.sign(
              { id: element.id, email: element.email },
              AppConfiguration.JWT_SECRET,
              { expiresIn: AppConfiguration.JWT_EXPIRATION }
            )
          });
        });
        //Send the users object
        res.json(userInfo);
      };
    } catch (error) {
      res.status(404).send('Failed. User not found');
      return;
    }
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get the user from database
    const userRepository = getRepository(User);

    try {
      const user = await userRepository.findOneOrFail(
        { id, deletedAt: IsNull() },
        { select: ['id', 'name', 'email', 'password'] }
      );
      res.json(user);
    } catch (error) {
      res.status(404).send('Failed. User not found');
      return;
    }
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const newPassword = req.body.password; 

    //Try to find user on database
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send('Failed. User not found');
      return;
    }

    //Compare previous password and new password
    if (user.comparePassword(newPassword)) {
      res.status(402).send('Failed. The password is the same as the previous password.');
      return;
    }

    //Change user password
    user.password = newPassword;
    user.hashPassword();

    try {
      await userRepository.save(user);
      res.json(user);
    } catch (e) {
      res.status(404).send('Failed. User not changed');
      return;
    }
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