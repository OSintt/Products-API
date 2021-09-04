import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
	token: {
		type: String,
		unique: true
	},
	date: Date
});

export default model("Token", TokenSchema);