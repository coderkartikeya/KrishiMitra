import connectDB from '../../../../../../db/connection.js';
import Post from '../../../../../../db/models/Post';
import mongoose from 'mongoose';

export async function POST(request, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });
  const { userId } = await request.json();
  if (!userId) return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
  const update = { $pull: { likes: userId } };
  const post = await Post.findByIdAndUpdate(id, update, { new: true }).lean();
  return new Response(JSON.stringify({ likesCount: post?.likes?.length || 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}


