import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new mongoose.Schema(
  {
    post: { type: String },
    userId: {  
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    subscribe: [{  
      type: Schema.Types.ObjectId,
      ref: "users",
    }],
    comments: [{
      userId:{  
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      comment: {
        type: String
      }
    }],
    upvote: { type: Number, default: 0 },
    downvote: { type: Number, default: 0 },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

postSchema.index({ '$**': 'text' });


const postModel = mongoose.model("post", postSchema);

export default postModel;
