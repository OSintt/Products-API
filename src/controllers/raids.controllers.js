import Raid from '../models/Raid';

const raidControllers = {}; 

raidControllers.getRaids = async (req, res) => {
	const raids = await Raid.find();
	return res.json({status: 200, response: "Lista de raids", data: raids});
}

raidControllers.getRaidById = async (req, res) => {
	const raid = await Raid.findOneById(req.params.id);
	if (!raid) return res.status(404).json({status: 404, response: "Ese raid no existe"});
	return res.json({status: 200, response: "Se ha encontrado un raid por ID", data: raid});
}

raidControllers.getRecentRaids = async (req, res) => {
	const raids = await Raid.find();
	const recentRaids = raid.sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	}).slice(0, 3);
	return res.json({status: 200, response: "Lista de raids recientes", data: recentRaids});
}

module.exports = raidControllers;