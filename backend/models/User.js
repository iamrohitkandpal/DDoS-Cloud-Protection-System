import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'analyst', 'viewer'],
    default: 'viewer'
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String
  },
  lastLogin: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for password
userSchema.virtual('password')
  .set(function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hashedPassword = this.encryptPassword(password);
  });

// Methods
userSchema.methods = {
  // Authenticate - check if the passwords are the same
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  
  // Encrypt password
  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  }
};

const User = mongoose.model('User', userSchema);

export default User;