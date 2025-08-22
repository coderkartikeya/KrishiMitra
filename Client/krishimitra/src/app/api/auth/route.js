import { NextResponse } from 'next/server';

// Dummy user store (replace with DB in production)
const users = [];

// Helper to find user
function findUser(email) {
    return users.find(user => user.email === email);
}

// Signup handler
export async function POST(request) {
    const { pathname } = new URL(request.url);

    const data = await request.json();
    const { email, password } = data;

    if (pathname.endsWith('/signup')) {
        if (findUser(email)) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }
        users.push({ email, password }); // Store password as hash in production
        return NextResponse.json({ message: 'Signup successful' });
    }

    if (pathname.endsWith('/login')) {
        const user = findUser(email);
        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        return NextResponse.json({ message: 'Login successful' });
    }

    return NextResponse.json({ error: 'Invalid route' }, { status: 404 });
}