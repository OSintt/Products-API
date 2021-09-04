import Dox from '../models/Doxes';

const getDox = async (req, res) => {
	const doxes = await Dox.find();
	return res.json({status: 200, data: doxes});
}

const getDoxById = async (req, res) => {
	const dox = await Dox.findById(req.params.id);
	return res.json({status: 200, data: dox});
}

const getRecentDox = async (req, res) => {
	const doxes = await Dox.find();
	const recentDox = doxes.sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	}).slice(0, 3);
	return res.json({status: 200, response: "Lista de doxes recientes", data: recentDox});
}

const getVerifiedDoxes = async (req, res) => {
	const doxes = await Dox.find();
	const verifiedDoxes = doxes.filter(d => d.verificado);
	return res.json({status: 200, response: "Lista de doxes verificados", data: verifiedDoxes});
}

const getUnverifiedDoxes = async (req, res) => {
	const doxes = await Dox.find();
	const unverifiedDoxes = doxes.filter(d => !d.verificado);
	return res.json({status: 200, response: "Lista de doxes no verificados", data: unverifiedDoxes});
}

const postDox = async (req, res) => {
	const { titulo, contenido, autor } = req.body;
	const date = new Date();
	const dox = new Dox({
		titulo,
		contenido,
		autor,
		date
	});
	const doxSaved = await dox.save();
	return res.status(201).json({status: 201, response: "Se ha guardado un nuevo dox en el servidor", data: doxSaved}); 
}

const verifyDox = async (req, res) => {
	const dox = await Dox.findById(req.params.id);
	if (dox.verificado = true) return res.status(409).json({status: 409, response: "Este dox ya ha sido verificado previamente"});
	dox.verificado = true;
	const doxVerificado = await dox.save();
	return res.status(201).json({status: 201, response: "Se ha verificado un dox en el servidor", data: doxVerificado}); 
}

const deleteDox = async (req, res) => {
	const dox = await Dox.findByIdAndDelete(req.params.id);
	return res.status(201).json({status: 201, response: "Se ha eliminado un dox del servidor"});
}

module.exports = {
	getDox,
	getDoxById,
	getRecentDox,
	postDox,
	verifyDox,
	deleteDox,
	getVerifiedDoxes,
	getUnverifiedDoxes
}