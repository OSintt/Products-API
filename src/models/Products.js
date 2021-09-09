import { Schema, model } from 'mongoose';

const ProductsSchema = Schema({
	type: {
		ref: "ProductsType",
		type: Schema.Types.ObjectId
	},
	name: {
		required: true,
		type: String
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		default: 0
	},
	image: {
		data: Buffer,
		contentType: String
	},
	stock: {
		type: Number,
		default: 0
	},
	onSale: {
		type: Boolean,
		default: false
	},
	onSaleText: {
		type: String
	},
	onSaleUntil: {
		type: Date
	},
	likes: {
		type: Number,
		default: 0
	},
	comments: [{
		ref: "Comment",
		type: Schema.Types.ObjectId
	}],
	date: {
		type: Date,
		default: new Date()
	}

});

export default model("Products", ProductsSchema);