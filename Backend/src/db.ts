import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true },
    firstName: String,
    lastName: String
});

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
})


const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})

function model(name: string, schema: mongoose.Schema) {
    return mongoose.model(name, schema);
}

export const UserModel = model("User", userSchema);
export const ContentModel = model("Content", ContentSchema);
export const LinksModel = model("Links", LinkSchema);
