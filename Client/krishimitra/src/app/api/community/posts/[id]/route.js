import connectDB from '../../../../../db/connection';
import Post from '../../../../../db/models/Post';
import Comment from '../../../../../db/models/Comment';
import mongoose from 'mongoose';

export async function GET(_req, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });
  const post = await Post.findById(id).lean();
  if (!post) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 }).lean();
  return new Response(JSON.stringify({ post, comments }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });
  await Post.findByIdAndDelete(id);
  await Comment.deleteMany({ postId: id });
  return new Response(null, { status: 204 });
}


