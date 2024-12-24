import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  category: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date },
  updatedAt: { type: Date, default: Date.now },
});
postSchema.index({ title: "text", content: "text", category: "text" });

const Post = mongoose.model("Post", postSchema);
Post.createIndexes();

export default Post;
