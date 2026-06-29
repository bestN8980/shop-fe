import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ShoppingCart,
  Package,
  ClipboardList,
  User,
  LogOut,
  Settings,
  Store,
} from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        isActive(to)
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}>
      <Icon size={16} />
      {label}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-slate-900">
            <Store size={20} className="text-blue-600" />
            ShopApp
          </Link>

          {user && (
            <div className="flex items-center gap-1">
              {navLink("/", "Sản phẩm", Package)}
              {navLink("/cart", "Giỏ hàng", ShoppingCart)}
              {navLink("/orders", "Đơn hàng", ClipboardList)}
              {user.role === "ADMIN" && navLink("/admin", "Quản trị", Settings)}
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                  <User size={16} />
                  <span className="hidden sm:inline">
                    {user.full_name || user.email}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-1.5">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-primary text-sm py-1.5">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
