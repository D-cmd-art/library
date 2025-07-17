// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  address: String,
  grade: String,
  phoneNumber: String,
  profilePicture: String,
  role: { type: String, default: 'userprofile' },
});

export default mongoose.model('UserProfile', userSchema);
