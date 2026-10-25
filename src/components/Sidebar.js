import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        Smart <span>Stock</span>
      </div>
      <nav className="sidebar-nav">
        <Link href="/">Dashboard</Link>
        <Link href="/inventory">Inventory</Link>
        <Link href="/analytics">Analytics</Link>
      </nav>
    </aside>
  );
}
