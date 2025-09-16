import connectDB from '../../../../../../db/connection.js';
import Comment from '../../../../../../db/models/Comment';
import Post from '../../../../../../db/models/Post';
import mongoose from 'mongoose';

export async function GET(_req, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });
  const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 }).lean();
  return new Response(JSON.stringify({ items: comments }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });
  const { authorId, authorName, content } = await request.json();
  if (!authorId || !authorName || !content) return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  const created = await Comment.create({ postId: id, authorId, authorName, content });
  await Post.findByIdAndUpdate(id, { $inc: { commentsCount: 1 } });
  return new Response(JSON.stringify(created), { status: 201, headers: { 'Content-Type': 'application/json' } });
}


