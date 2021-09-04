import * as authCtrl from '../controllers/auth.controllers';
import { checkDuplicated, checkRolesExisted, checkParams } from '../middleware/auth.middlewares';

const { Router } = require('express');
const router = Router();

router.post('/signin', authCtrl.signIn);

router.post('/signup', [checkParams, checkDuplicated, checkRolesExisted], authCtrl.signUp);

module.exports = router;