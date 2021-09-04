import Token from '../models/Tokens';
import axios from 'axios';

export const checkDoubleToken = async (req, res, next) => {
	const { nitro } = req.body;
	const doubleToken = await Token.findOne({token: nitro});
	if (doubleToken) return res.status(409).json({status: 409, response: "Recurso duplicado en el servidor"});
	next();
}

export const checkValidToken = async (req, res, next) => {
	const { nitro } = req.body;
	try {
		await axios.get("https://discord.com/api/v9/users/@me", {
			headers: {
				Authorization: nitro
			}
		});
		next();
	} catch (e) {
		return res.status(409).json({status: 409, response: "Recurso inválido!"});
	}
}