'use client';

import { useState, useEffect } from 'react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (!data || data.error) return <div>Failed to load analytics.</div>;

  const { categoryAnalytics, topProducts, recentProducts } = data;

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '32px', marginBottom: '32px' }}>
        
        <div className="card" style={{ overflowX: 'auto' }}>
          <h2 style={{ marginTop: 0 }}>Category Breakdown</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '8px 0' }}>Category</th>
                <th>Products</th>
                <th>Quantity</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {categoryAnalytics.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '12px 0' }}>No categories yet.</td></tr>
              ) : (
                categoryAnalytics.map(c => (
                  <tr key={c.category} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 0', fontWeight: 500 }}>{c.category}</td>
                    <td>{c.totalProducts}</td>
                    <td>{c.totalQuantity}</td>
                    <td>${c.totalValue.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Top Products (by Value)</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {topProducts.length === 0 ? (
              <li style={{ padding: '12px 0' }}>No products yet.</li>
            ) : (
              topProducts.map((p, i) => (
                <li key={p.id} style={{ 
                  padding: '12px 0', 
                  borderBottom: i !== topProducts.length - 1 ? '1px solid var(--border-color)' : 'none',
                  display: 'flex', justifyContent: 'space-between'
                }}>
                  <span style={{ fontWeight: 500 }}>{p.name}</span>
                  <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>
                    ${(p.price * p.quantity).toFixed(2)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Recently Added</h2>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '8px 0' }}>Name</th>
              <th>Category</th>
              <th>Added On</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '12px 0' }}>No recent products.</td></tr>
            ) : (
              recentProducts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 0', fontWeight: 500 }}>{p.name}</td>
                  <td>{p.category}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.dateAdded}</td>
                  <td>${p.price.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
