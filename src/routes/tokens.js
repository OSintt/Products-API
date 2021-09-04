import { Router } from "express";
import { 
	getTokens,
	getToken,
	postToken,
	deleteToken 
} from "../controllers/tokens.controllers";
import { checkDoubleToken, checkValidToken } from '../middleware/tokens.middleware';
import { isAdmin, verifyToken } from '../middleware/authJwt';

const router = Router();

router.route("/")
	.get([verifyToken, isAdmin], getTokens)
	.post([ checkDoubleToken, checkValidToken ], postToken);

router.route("/:id")
	.get([verifyToken, isAdmin], getToken)
	.delete([verifyToken, isAdmin], deleteToken);

module.exports = router;