const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    governmentId: { type: String, unique: true, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date }
  },
  { timestamps: true }
);

// hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// method to compare password
userSchema.methods.matchPassword = async function (entered) {
  console.log('Comparing passwords - Entered:', entered ? '***' : 'null', 'Stored hash:', this.password ? 'exists' : 'missing');
  const result = await bcrypt.compare(entered, this.password);
  console.log('Bcrypt compare result:', result);
  return result;
};

module.exports = mongoose.model('User', userSchema);
