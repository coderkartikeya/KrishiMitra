import connectDB from '../../../../db/connection';
import Post from '../../../../db/models/Post';

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const filter = q ? { $or: [{ title: new RegExp(q, 'i') }, { content: new RegExp(q, 'i') }] } : {};
  const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  return new Response(JSON.stringify({ items: posts }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const { authorId, authorName, title, content, tags } = body;
  if (!authorId || !authorName || !title || !content) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }
  const post = await Post.create({ authorId, authorName, title, content, tags: Array.isArray(tags) ? tags : [] });
  return new Response(JSON.stringify(post), { status: 201, headers: { 'Content-Type': 'application/json' } });
}


