import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt-nodejs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    password: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateHash = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJWt = function () {
  const expiry = new Date();
  const SECRET = process.env.JWT_SECRET;
  expiry.setDate(expiry.getDate() + 7);
  return JWT.sign(
    {
      _id: this._id,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    },
    SECRET
  );
};

userSchema.index({ '$**': 'text' });

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
