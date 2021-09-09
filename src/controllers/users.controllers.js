import User from '../models/User';

const getUsers = async (req, res) => {
	const users = await User.find().select("-password -role -likedProducts")
	return res.json({status: 200, message: "Lista de usuarios de DixHost!", users});
}

module.exports = {
	getUsers
}
