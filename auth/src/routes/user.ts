import cors from 'cors';
import Express from 'express';
import UserController from '../controllers/user.controller';
import { checkJwt } from '../middlewares/checkJwt';

const router = Express.Router();

router.post('/', UserController.newUser)

//Get all users
router.get('/', cors(), UserController.listAll);

// Get one user
router.get(
  '/:id',
  // checkJwt,
  cors(),
  UserController.getOneById
);

// //Edit one user
router.put(
  '/:id',
  // checkJwt,
  cors(),
  UserController.editUser
);

//Delete one user
router.delete(
  '/:id',
  // checkJwt,
  cors(),
  UserController.deleteUser
);

export default router;