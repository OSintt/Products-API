import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	likedProducts: [{
		ref: "Product",
		type: Schema.Types.ObjectId
	}],
	comments: [{
		ref: "Comment",
		type: Schema.Types.ObjectId
	}],
	role: [
		{
			ref: "Role",
			type: Schema.Types.ObjectId
		}
	],
}, {
	timestamps: true,
	versiokey: false
});

userSchema.statics.encryptPassword = async (pwd) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(pwd, salt);
}

userSchema.statics.comparePwd = async (pwd, receivedPwd) => {
	return await bcrypt.compare(pwd, receivedPwd);
}

export default model("User", userSchema);