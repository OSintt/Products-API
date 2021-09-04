import jwt from 'jsonwebtoken';
import User from '../models/User';
import Role from '../models/Roles';
require('dotenv').config();

const config = process.env.SECRET_AUTH_KEY;

export const verifyToken = async (req, res, next) => {
	try {
		const token = req.headers["x-access-token"];
		if (!token) return res.status(401).json({status: 401, response: "No se encontró ningún token proporcionado"});
		const decoded = jwt.verify(token, config);
		req.userId = decoded.id
		const user = await User.findById(decoded.id, {password: 0});
		if (!user) return res.status(404).json({status: 404, response: 'Token inválido'});
		next();
	} catch (error) {
		res.status(401).json({status: 401, response: "Unhautorized"});
	}
}

export const isAdmin = async(req, res, next) => {
	const user = await User.findById(req.userId);
	const roles = await Role.find({_id: {$in: user.role}});
	for (let i = 0; i < roles.length; i++) {
		if (roles[i].name === "admin") {
			return next();
		}
	}
	return res.status(401).json({status: 401, response: "Unhautorized"});
}