import jwt from 'jsonwebtoken';
import Comment from '../models/Comments';
import Product from '../models/Products';
import User from '../models/User';
require('dotenv').config();
const config = process.env.SECRET_AUTH_KEY;

const postComment = async (req, res) => {
	const { content } = req.body;
	const token = req.headers["x-access-token"];
	const productToSave = await Product.findById(req.params.id);
	if (!productToSave) return res.status(404).json({status: 404, message: "Ese producto no existe"});
	if (!content) return res.status(400).json({status: 400, message: "Hacen falta parámetros"});
	if (content.length > 1200) return res.status(409).json({status: 409, message: "El contenido del comentario es demasiado largo"});
	if (content.length < 1) return res.status(409).json({status: 409, message: "El contenido del comentario es demasiado corto"});
	const decoded = jwt.verify(token, config);
	const user = await User.findById(decoded.id, {password: 0});
	const comment = new Comment({
		content,
		product: productToSave._id,
		author: user._id
	});
	productToSave.comments.push(comment._id);
	user.comments.push(comment._id);
	try {
		const commentSaved = await comment.save();
		await user.save();
		await productToSave.save();
		return res.status(201).json({status: 201, message: "Se ha publicado tu comentario con éxito", comment: commentSaved});
	} catch(e) {
		return res.status(502).json({status: 502, message: "Ha ocurrido un error publicando tu comentario"});
	}
}

const editComment = async (req, res) => {
	const { content } = req.params.id;
	const comment = await Comment.findById(req.params.id);
	const token = req.headers["x-access-token"];

	const decoded = jwt.verify(token, config);
	req.userId = decoded.id
	const user = await User.findById(decoded.id, {password: 0});

	if (!user.comments.includes(comment._id)) return res.status(401).json({status: 401, message: "No puedes editar este comentario"});

	comment.content = content;
	try {
		await comment.save();
	} catch(e) {
		return res.status(502).json({status: 502, message: "Ha ocurrido un error actualizando tu comentario"});
	}
	return res.status(201).json({status: 201, message: "Tu comentario se actualizó con éxito", comment: comment});
}

const deleteComment = async (req, res) => {
	const comment = await Comment.findById(req.params.id);
	const product = await Product.findOne({_id: comment.product});
	const token = req.headers["x-access-token"];

	const decoded = jwt.verify(token, config);
	const user = await User.findById(decoded.id, {password: 0});

	if (!user.comments.includes(comment._id)) return res.status(401).json({status: 401, message: "No puedes borrar este comentario"});

	try {
		let commentCopy = [...user.comments];
		commentCopy.splice(commentCopy.indexOf(commentCopy.find(c => c._id === comment._id)), 1);
		user.comments = commentCopy;

		let commentProductCopy = [...product.comments];
		commentProductCopy.splice(commentProductCopy.indexOf(commentProductCopy.find(c => c._id === comment._id)), 1);
		product.comments = commentProductCopy;

		await user.save();
		await product.save();
		await Product.deleteOne({_id: comment._id});
	} catch(e) {
		return res.status(502).json({status: 502, message: "Ha ocurrido un error borrando tu comentario"});
	}

	return res.status(201).json({status: 201, message: "Tu comentario se eliminó con éxito"});
}

const likeProduct = async (req, res) => {
	const token = req.headers["x-access-token"];
	const product = await Product.findById(req.params.id);

	const decoded = jwt.verify(token, config);
	req.userId = decoded.id
	const user = await User.findById(decoded.id, {password: 0});
	let message = "Se ha dado like al producto " + product.name + " con éxito";
	if (!user.likedProducts.includes(product._id)) {
		user.likedProducts.push(product._id);
		product.likes = product.likes + 1;
	} else {
		message = "Se ha quitado el like al producto " + product.name + " con éxito";
		let commentCopy = [...user.likedProducts];
		commentCopy.splice(commentCopy.indexOf(commentCopy.find(c => c._id === product._id)), 1);
		user.likedProducts = commentCopy;
		product.likes = product.likes - 1;
	}
	try {
		await product.save();
		await user.save();
		return res.status(201).json({status: 201, message, product});
	} catch(e) {
		return res.status(502).json({status: 502, message: "Ha ocurrido un error actualizando este producto"});
	}
}

module.exports = {
	postComment,
	editComment,
	deleteComment,
	likeProduct
}
