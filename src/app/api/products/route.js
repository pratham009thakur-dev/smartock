import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = db.all();

    const totalProducts = products.length;
    const totalQuantity = products.reduce((acc, p) => acc + p.quantity, 0);
    const totalValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const lowStockCount = products.filter((p) => p.quantity < 5).length;

    const categoryMap = {};
    products.forEach((p) => {
      if (!categoryMap[p.category]) {
        categoryMap[p.category] = { totalProducts: 0, totalQuantity: 0, totalValue: 0 };
      }
      categoryMap[p.category].totalProducts += 1;
      categoryMap[p.category].totalQuantity += p.quantity;
      categoryMap[p.category].totalValue += p.price * p.quantity;
    });

    const categoryAnalytics = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      ...categoryMap[cat],
    }));

    const topProducts = [...products]
      .sort((a, b) => b.price * b.quantity - a.price * a.quantity)
      .slice(0, 5);

    const recentProducts = [...products].slice(0, 5);

    const alerts = [];
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    products.forEach((p) => {
      if (p.quantity < 5) {
        alerts.push({ id: p.id + '-low', type: 'danger', message: `⚠️ Low Stock: ${p.name}` });
      }
      if (p.price * p.quantity > 10000) {
        alerts.push({ id: p.id + '-val', type: 'warning', message: `💰 High Value Stock: ${p.name}` });
      }
      const pDate = new Date(p.createdAt);
      if (pDate >= twoDaysAgo) {
        alerts.push({ id: p.id + '-new', type: 'success', message: `🆕 Recently Added: ${p.name}` });
      }
    });

    let criticalProduct = null;
    let lowestDaysLeft = Infinity;

    const productsWithPredictions = products.map((p) => {
      const avgDailyUsage = (p.id % 5) + 1;
      const projectedDaysLeft = Math.floor(p.quantity / avgDailyUsage);
      
      let status = '✅ Sufficient';
      if (projectedDaysLeft <= 3) status = '🚨 Restock Soon';
      else if (projectedDaysLeft <= 7) status = '⚠️ Monitor';

      const suggestedReorder = Math.max(0, 20 - p.quantity);

      if (projectedDaysLeft < lowestDaysLeft) {
        lowestDaysLeft = projectedDaysLeft;
        criticalProduct = p;
      }

      return { ...p, avgDailyUsage, projectedDaysLeft, status, suggestedReorder };
    });

    let insightMessage = "Inventory looks healthy. Keep it up!";
    if (criticalProduct && criticalProduct.quantity < 5) {
      insightMessage = `⚡ ${criticalProduct.name} is running critically low — reorder immediately!`;
    } else if (criticalProduct && criticalProduct.projectedDaysLeft <= 7) {
      insightMessage = `👀 Keep an eye on ${criticalProduct.name}. Restock may be needed soon.`;
    }

    const insights = {
      insightMessage,
      criticalProduct,
      totalProducts,
      totalQuantity,
      totalValue,
      topProduct: topProducts[0] || null,
      lowStockCount,
    };

    return NextResponse.json({
      products: productsWithPredictions,
      dashboard: { totalProducts, totalQuantity, totalValue, lowStockCount },
      categoryAnalytics,
      topProducts,
      recentProducts,
      alerts,
      insights,
    });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, category, quantity, price, supplier } = data;
    
    const qty = parseInt(quantity, 10) || 0;
    const prc = parseFloat(price) || 0.0;
    const dateAdded = new Date().toISOString().split('T')[0];

    const id = db.insert({ name, category, quantity: qty, price: prc, supplier: supplier || '', dateAdded });

    return NextResponse.json({ id, success: true }, { status: 201 });
  } catch (error) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
