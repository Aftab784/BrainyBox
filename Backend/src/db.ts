import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true },
    Name: String,
});

const ContentSchema = new Schema({
    title: String,
    link: String,
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
})


const LinkSchema = new mongoose.Schema({
  hash: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Remove all existing indexes first
LinkSchema.clearIndexes();

// Create new indexes
LinkSchema.index({ hash: 1 }, { unique: true });
LinkSchema.index({ userId: 1, active: 1 });

function model(name: string, schema: mongoose.Schema) {
    return mongoose.model(name, schema);
}

export const UserModel = model("User", userSchema);
export const ContentModel = model("Content", ContentSchema);
export const LinksModel = mongoose.model('Links', LinkSchema);
