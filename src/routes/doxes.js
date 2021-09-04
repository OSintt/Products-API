import { Router } from 'express';
import { 
	getDox, 
	getDoxById, 
	getRecentDox, 
	postDox, 
	verifyDox, 
	deleteDox, 
	getVerifiedDoxes, 
	getUnverifiedDoxes 
} from '../controllers/doxes.controllers';

import { isDoubleDox, addVisita, isDoxLength, doesDoxExist, checkCaptcha } from '../middleware/dox.middlewares';
import { isAdmin, verifyToken } from '../middleware/authJwt';

const route = Router();

route.route("/")
	.get([verifyToken, isAdmin], getDox)
	.post([isDoxLength, isDoubleDox], postDox);

route.route("/*/:id")
	.get([doesDoxExist, addVisita], getDoxById)
	.put([doesDoxExist], verifyDox)
	.delete([doesDoxExist, verifyToken, isAdmin], deleteDox);

route.route("/recientes")
	.get(getRecentDox);

route.route("/verified")
	.get(getVerifiedDoxes);

route.route("/unverified")
	.get([verifyToken, isAdmin], getUnverifiedDoxes);

module.exports = route;