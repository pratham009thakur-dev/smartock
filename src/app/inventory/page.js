'use client';

import { useState, useEffect } from 'react';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', quantity: '', price: '', supplier: '' });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setFormData({ 
        name: product.name, category: product.category, 
        quantity: product.quantity, price: product.price, supplier: product.supplier 
      });
    } else {
      setEditProduct(null);
      setFormData({ name: '', category: '', quantity: '', price: '', supplier: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editProduct ? `/api/products/${editProduct.id}` : '/api/products';
    const method = editProduct ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      fetchProducts();
    } catch (e) {
      alert("Error saving product");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (e) {
      alert("Error deleting product");
    }
  };

  if (loading) return <div>Loading inventory...</div>;

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Inventory Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          style={{ 
            backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', 
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
          }}>
          + Add Product
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '16px' }}>Name</th>
              <th style={{ padding: '16px' }}>Category</th>
              <th style={{ padding: '16px' }}>Price</th>
              <th style={{ padding: '16px' }}>Quantity</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }}>No products found. Add some!</td></tr>
            ) : (
              products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{p.category}</td>
                  <td style={{ padding: '16px' }}>${p.price.toFixed(2)}</td>
                  <td style={{ padding: '16px' }}>{p.quantity}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500,
                      backgroundColor: p.status.includes('✅') ? 'rgba(16,185,129,0.1)' : p.status.includes('🚨') ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                      color: p.status.includes('✅') ? 'var(--success-color)' : p.status.includes('🚨') ? 'var(--danger-color)' : 'var(--warning-color)'
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button onClick={() => handleOpenModal(p)} style={{ marginRight: '8px', cursor: 'pointer', background: 'none', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px' }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: 'var(--danger-color)', border: 'none', padding: '6px 12px', borderRadius: '6px' }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--card-bg)', padding: '32px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <h2 style={{ marginTop: 0 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Category</label>
                <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Price</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Quantity</label>
                  <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Supplier</label>
                <input value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', borderRadius: '6px', background: 'none', border: '1px solid var(--border-color)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 16px', borderRadius: '6px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
