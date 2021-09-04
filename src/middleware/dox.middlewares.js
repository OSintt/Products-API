import Doxes from '../models/Doxes';
import db from 'mongoose';

require('dotenv').config();

export const isDoubleDox = async (req, res, next) => {
	const { titulo } = req.body;
	const titleExist = await Doxes.findOne({titulo});
	if (titleExist) return res.status(409).json({status: 409, response: "Ese dox ya existe!"});
	next();
}

export const addVisita = async (req, res, next) => {
    const dox = await Doxes.findById(req.params.id);
    dox.visitas = dox.visitas + 1;
    await dox.save();
    next();
}

export const isDoxLength = async (req, res, next) => {
	const { titulo, autor, contenido } = req.body;
	if (!titulo || !autor || !contenido) return res.status(400).json({status: 400, response: "Hacen falta parámetros"});
	if (titulo.length <= 2) return res.status(409).json({status: 409, response: "Tu título es demasiado corto"});
	if (titulo.length > 40) return res.status(409).json({status: 409, response: "Tu título es demasiado largo"});
	if (autor.length <= 1) return res.status(409).json({status: 409, response: "Tu nombre de autor es demasiado corto"});
	if (titulo.length > 40) return res.status(409).json({status: 409, response: "Tu nombre de autor es demasiado largo"});
	if (contenido.length <= 10) return res.status(409).json({status: 409, response: "El contenido de tu dox es demasiado corto"});
	next();
}

export const doesDoxExist = async (req, res, next) => {
    if (!db.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({status: 400, response: "La ID proporcionada no es válida"});
    const dox = await Doxes.findById(req.params.id);
    if (!dox) return res.status(404).json({status: 404, response: "Ese dox no existe"});
    next();
}

export const checkCaptcha = async (req, res, next) => {
    const captcha = req.body.captcha;
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (captcha === undefined || captcha === "" || captcha === null || captcha === false) {
        return res.status(409).json({success: false, message: "Por favor, complete el captcha"});
    }
    const secretKey = process.env.CAPTCHA_SECRET;
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${userIp}`;

    axios.get(verifyUrl)
    .then(body => {
        if (body.success !== undefined && !body.success) {
            return res.status(403).json({status: 403, success: false, response: "Por favor, complete el captcha"});
        } else {
            res.json({status: 200, success: true, response: "Captcha passed"})
            next();
        } 
    });
}