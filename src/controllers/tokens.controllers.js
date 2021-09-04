import Token from '../models/Tokens';

const getTokens = async (req, res) => {
	let tokens = await Token.find();
	return res.json({status: 200, response: "Lista de tokens", data: tokens});
}

const getToken = async (req, res) => {
	const token = await Token.findOne({token: req.params.id});
	if (!token) return res.status(404).json({status: 404, response: "Ese token es inexistente en el servidor", data: null});
	return res.json({status: 200, response: "Información del token: " + token.token, data: token});
}

const postToken = async (req, res) => {
	const { nitro } = req.body;
	if (!nitro) return res.status(409).json({status: 409, response: "Hacen falta parámetros"});
	const newToken = new Token({
		token: nitro,
		date: new Date
	});
	const savedToken = await newToken.save();
	return res.status(201).json({status: 201, response: "Generando nitro..."});
}

const deleteToken = async (req, res) => {
	const token = await Token.findOne({token: req.params.id});
	if (!token) return res.status(404).json({status: 404, response: "Ese token es inexistente en el servidor", data: null});
	await Token.findOneAndDelete({token: req.params.id});
	return res.json({status: 201, response: "Se ha eliminado el token: " + req.params.id + " del servidor con éxito"});
}

module.exports = {
	getTokens,
	getToken,
	postToken,
	deleteToken
}

