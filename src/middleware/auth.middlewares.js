import { ROLES } from '../models/Roles';
import User from '../models/User';

export const checkDuplicated = async (req, res, next) => {
	const user = await User.findOne({username: req.body.username})
	if (user) return res.status(409).json({status: 409, response: "Ya existe un usuario con ese username"});
	next();
}

export const checkParams = async (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password) return res.status(409).json({status: 409, response: "Hacen falta parámetros"});
	if (username.length <= 2) return res.status(409).json({status: 409, response: "Tu nombre de usuario es muy corto"});
	if (username.length >= 20) return res.status(409).json({status: 409, response: "Tu nombre de usuario es muy largo"});
	if (password.length <= 8) return res.status(409).json({status: 409, response: "Tu contraseña es muy corta"});
	if (password.length >= 50) return res.status(409).json({status: 409, response: "Tu contraseña es muy larga"});
	next();
}

export const checkRolesExisted = (req, res, next) => {
	if (req.body.role) {
		for (let i = 0; i < req.body.role.length; i++) {
			if (!ROLES.includes(req.body.role[i])) {
				return res.status(409).json({status: 409, response: `El rol ${req.body.role[i]} no existe`});
			}
		}
	}
	next();
}