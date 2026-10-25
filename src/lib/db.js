import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'smart-stock.json');

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]), 'utf-8');
}

const getProducts = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const saveProducts = (products) => {
  fs.writeFileSync(dbPath, JSON.stringify(products, null, 2), 'utf-8');
};

export const db = {
  all: () => getProducts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  insert: (product) => {
    const products = getProducts();
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      ...product,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    saveProducts(products);
    return id;
  },
  update: (id, updates) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return 0;
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
    saveProducts(products);
    return 1;
  },
  delete: (id) => {
    let products = getProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id != id);
    saveProducts(products);
    return initialLength !== products.length ? 1 : 0;
  }
};
