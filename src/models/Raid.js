import { Schema, model } from 'mongoose';

const RaidsSchema = new Schema({
	serverName: String,
	serverId: {
		type: String,
		unique: true
	},
	date: {
		type: Date,
		required: true
	},
	serverIcon: {
		type: String,
		default: "https://wallpaperaccess.com/full/225023.jpg"
	},
	author: {
		type: String,
		default: "EthernalSquad"
	},
	serverMemberCount: Number
});

export default model("Raid", RaidsSchema);