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
	return res.json({status: 200, message: "Bienvenido a DixHost!", token: token});
}

export const signIn = async (req, res) => {
	const foundUser = await User.findOne({username: req.body.username}).populate("roles");
	let admin = false;
	const roles = await Role.find({_id: {$in: foundUser.role}});
	for (let i = 0; i < roles.length; i++) {
		if (roles[i].name === "admin") {
			admin = true;
		}
	}
	if (!foundUser) return res.status(401).json({status: 401, message: "Nombre de usuario o contraseña incorrectos", token: null});
	const matchPwd = await User.comparePwd(req.body.password, foundUser.password);
	if (!matchPwd) return res.status(401).json({status: 401, message: "Nombre de usuario o contraseña incorrectos", token: null});
	const token = jwt.sign({id: foundUser._id}, config, {
		expiresIn: 86400
	});
	return res.json({status: 200, message: "Usuario autenticado", admin, token});
}

export const banUser = async (req, res) => {
	await User.findByIdAndDelete(req.params.id);
	return res.status(201).json({status: 201, message: "Se ha baneado con éxito a un usuario"});
}

export const me = async (req, res) => {
	const token = req.headers["x-access-token"];
	const decoded = jwt.verify(token, config);
	const user = await User.findById(decoded.id, {password: 0});

	res.json({status: 200, message: "Tu usuario", user: user});
}

export const changeUsername = async (req, res) => {
	const { newUsername } = req.body;
	if (!newUsername) return res.status(400).json({status: 400, message: "Hacen falta parámetros"});  
	const token = req.headers["x-access-token"];
	const decoded = jwt.verify(token, config);
	const user = await User.findById(decoded.id, {password: 0});

	if (newUsername.length <= 2) return res.status(409).json({status: 409, message: "Tu nombre de usuario es muy corto"});
	if (newUsername.length >= 20) return res.status(409).json({status: 409, message: "Tu nombre de usuario es muy largo"});

	const usernameTaken = await User.findOne({username: newUsername});
	if (usernameTaken) return res.status(409).json({status: 409, message: "Ya existe un usuario con ese username"});

	user.username = newUsername;
	try {
		const userSaved = await user.save();
		return res.status(201).json({status: 201, message: "Nombre de usuario actualizado con éxito", user: userSaved});
	} catch(e) {
		return res.status(502).json({status: 502, message: e});
	}
}