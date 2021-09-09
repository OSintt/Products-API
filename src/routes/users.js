import { getUsers } from '../controllers/users.controllers';

const { Router } = require('express');
const router = Router();

router.route("/all")
	.get(getUsers);

module.exports = router;