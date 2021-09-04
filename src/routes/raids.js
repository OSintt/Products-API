import { Router } from 'express';
import { getRaids, getRaidById, getRecentRaids } from '../controllers/raids.controllers.js'; 

const route = Router();

route.route("/")
	.get(getRaids);

route.route("/:id")
	.get(getRaidById);

route.route("/recientes")
	.get(getRecentRaids);

module.exports = route;