import Product from '../models/Products';
import db from 'mongoose';

require('dotenv').config();

export const doesProductExist = async (req, res, next) => {
    if (!db.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({status: 400, response: "La ID proporcionada no es válida"});
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({status: 404, message: "Ese producto no existe"});
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
            return res.status(403).json({status: 403, success: false, message: "Por favor, complete el captcha"});
        } else {
            res.json({status: 200, success: true, response: "Captcha passed"})
            next();
        } 
    });
}