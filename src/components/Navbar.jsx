import { NavLink } from "react-router-dom";
import BookLogo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-border-card">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <img src={BookLogo} alt="BookGuard logo" className="w-9 h-9 object-contain drop-shadow-sm" />
          <span className="font-semibold text-text-main">BookGuard AI</span>
        </div>

        <div className="flex items-center gap-6">
          <NavLink to="/" className={({isActive})=> isActive ? "text-accent-cyan" : "text-text-muted hover:text-accent-cyan transition"}>Home</NavLink>
          <NavLink to="/upload" className={({isActive})=> isActive ? "text-accent-cyan" : "text-text-muted hover:text-accent-cyan transition"}>Upload</NavLink>
          <NavLink to="/how" className={({isActive})=> isActive ? "text-accent-cyan" : "text-text-muted hover:text-accent-cyan transition"}>How it works</NavLink>
          <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent-cyan transition">GitHub</a>
        </div>
      </div>
    </nav>
  );
}
