import { Schema, model } from 'mongoose';

const CommentSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		required: true
	},
	author: {
		type: Schema.Types.ObjectId,
		required: true
	},
	date: {
		type: Date,
		default: new Date()
	},
	content: {
		type: String,
		required: true
	}
});

export default model("Comment", CommentSchema);