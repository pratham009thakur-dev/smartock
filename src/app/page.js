'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
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

  if (loading) return <div>Loading dashboard...</div>;
  if (!data || data.error) return <div>Failed to load dashboard data.</div>;

  const { dashboard, insights, alerts } = data;

  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      
      {/* Smart Insights Engine */}
      <div style={{
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        border: '1px solid var(--primary-color)',
        padding: '24px', borderRadius: '12px', marginBottom: '32px'
      }}>
        <h2 style={{ marginTop: 0, color: 'var(--primary-hover)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🧠 Smart Insights
        </h2>
        <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>{insights.insightMessage}</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <p className="card-title">Total Products</p>
          <p className="card-value">{dashboard.totalProducts}</p>
        </div>
        <div className="card">
          <p className="card-title">Total Value</p>
          <p className="card-value">${dashboard.totalValue.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="card-title">Low Stock Items</p>
          <p className="card-value" style={{ color: dashboard.lowStockCount > 0 ? 'var(--danger-color)' : 'inherit' }}>
            {dashboard.lowStockCount}
          </p>
        </div>
      </div>

      {alerts && alerts.length > 0 && (
        <div className="alerts-section" style={{ marginTop: '32px' }}>
          <h2>Recent Alerts</h2>
          <div className="alerts-list">
            {alerts.slice(0, 5).map((alert, i) => (
              <div key={i} className="alert-item" style={{
                padding: '16px', marginBottom: '12px', borderRadius: '8px', 
                backgroundColor: alert.type === 'danger' ? 'rgba(239,68,68,0.1)' : 
                                 alert.type === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                borderLeft: `4px solid var(--${alert.type}-color)`,
                fontWeight: 500
              }}>
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
