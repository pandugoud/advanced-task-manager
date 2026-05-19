import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div>
        <h2>Advanced Task Manager</h2>
        <p>{user?.name ? `Hello, ${user.name}` : "Stay focused today"}</p>
      </div>
      <button className="secondary-btn" onClick={logout}>
        Logout
      </button>
    </header>
  );
}