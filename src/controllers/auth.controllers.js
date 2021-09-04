import User from '../models/User';
import jwt from 'jsonwebtoken';
import Role from '../models/Roles';
require('dotenv').config();
const config = process.env.SECRET_AUTH_KEY;

export const signUp = async (req, res) => {
	const { username, password, role } = req.body;
	const newUser = new User({
		username,
		password: await User.encryptPassword(password),
	});

	if (role) {
		const roles = await Role.findOne({name: "admin"});
		newUser.role = [roles._id];
	} else {
		const roles = await Role.findOne({name: "user"});
		newUser.role = [roles._id];
	}
	const save = await newUser.save();
	const token = jwt.sign({id: save._id}, config, {
		expiresIn: 86400
	});
	return res.json({status: 200, response: "Bienvenido a EthernalSquad!", token: token});
}

export const signIn = async (req, res) => {
	const foundUser = await User.findOne({username: req.body.username}).populate("roles");
	if (!foundUser) return res.status(401).json({status: 401, response: "Nombre de usuario o contraseña incorrectos", token: null});
	const matchPwd = await User.comparePwd(req.body.password, foundUser.password);
	if (!matchPwd) return res.status(401).json({status: 401, response: "Nombre de usuario o contraseña incorrectos", token: null});
	const token = jwt.sign({id: foundUser._id}, config, {
		expiresIn: 86400
	});
	return res.json({status: 200, response: "Usuario autenticado", token: token});
}