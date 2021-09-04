import { Schema, model } from 'mongoose';
export const ROLES = ["user", "admin"];

let roleSchema = new Schema({
	name: String
}, {
	versionKey: false
});

export default model("Role", roleSchema);