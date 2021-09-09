import Comment from '../models/Comments';
import db from 'mongoose';

export const doesCommentExist = async (req, res, next) => {
    if (!db.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({status: 400, response: "La ID proporcionada no es válida"});
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({status: 404, message: "Ese comentario no existe"});
    next();
}