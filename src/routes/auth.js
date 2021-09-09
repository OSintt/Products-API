import * as authCtrl from '../controllers/auth.controllers';
import { checkDuplicated, checkRolesExisted, checkParams } from '../middleware/auth.middlewares';
import { isAdmin, verifyToken } from '../middleware/authJwt';
const { Router } = require('express');
const router = Router();

router.route("/@me")
	.get([verifyToken], authCtrl.me)
	.put([verifyToken], authCtrl.changeUsername)

router.post('/signin', authCtrl.signIn);

router.post('/signup', [checkParams, checkDuplicated, checkRolesExisted], authCtrl.signUp);

module.exports = router;