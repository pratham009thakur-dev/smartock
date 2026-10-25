import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const data = await request.json();
    const { name, category, quantity, price, supplier } = data;

    const qty = parseInt(quantity, 10) || 0;
    const prc = parseFloat(price) || 0.0;

    const changes = db.update(id, { name, category, quantity: qty, price: prc, supplier: supplier || '' });

    if (changes === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const changes = db.delete(id);

    if (changes === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
