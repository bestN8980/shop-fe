import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <UserPlus size={28} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Tạo tài khoản</h1>
          <p className="text-slate-500 text-sm mt-1">Miễn phí, mãi mãi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              className="input-field"
              placeholder="nguyenvana"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Họ tên
            </label>
            <input
              className="input-field"
              placeholder="Nguyễn Văn A"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              className="input-field"
              placeholder="0901234567"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              minLength={10}
              maxLength={15}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Tối thiểu 6 ký tự"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-2.5"
            disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
