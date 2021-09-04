import { Schema, model } from 'mongoose';

const DoxesSchema = Schema({
	autor: {
		type: String,
		required: true,
		default: "EthernalSquad"
	},
	titulo: {
		type: String,
		require: true
	},
	contenido: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	verificado: {
		type: Boolean,
		default: false
	},
	visitas: {
		type: Number,
		default: 0
	}
});

export default model("Dox", DoxesSchema);