import { Schema, model } from 'mongoose';
export const TYPES = ["VPS", "Host"];

let ProductTypeSchema = new Schema({
	name: String,
	products: [{
		ref: "Products",
		type: Schema.Types.ObjectId
	}]
}, {
	versionKey: false
});

export default model("ProductsType", ProductTypeSchema);