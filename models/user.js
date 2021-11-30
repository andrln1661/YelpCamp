import mongoose from "mongoose";
import passportLocalMongooose from "passport-local-mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongooose);

export default mongoose.model("User", userSchema);
