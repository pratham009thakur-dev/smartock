export default function Topbar() {
  return (
    <header className="topbar">
      <div className="search-bar">
        <input type="text" placeholder="Search inventory..." />
      </div>
      <div className="profile">
        <span>Admin User</span>
      </div>
    </header>
  );
}
