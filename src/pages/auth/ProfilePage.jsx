import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import toast from "react-hot-toast";
import { User, Lock } from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "" });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      await authAPI.updateMe(profileForm);
      await refreshUser();
      toast.success("Cập nhật thành công");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Cập nhật thất bại");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoadingPw(true);
    try {
      await authAPI.changePassword(pwForm);
      toast.success("Đổi mật khẩu thành công");
      setPwForm({ old_password: "", new_password: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Đổi mật khẩu thất bại");
    } finally {
      setLoadingPw(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Hồ sơ của tôi</h1>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Thông tin cá nhân</h2>
            <p className="text-sm text-slate-500">
              Username: <span className="font-medium">{user?.username}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Họ tên
            </label>
            <input
              className="input-field"
              value={profileForm.full_name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, full_name: e.target.value })
              }
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
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm({ ...profileForm, email: e.target.value })
              }
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
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm({ ...profileForm, phone: e.target.value })
              }
              minLength={10}
              maxLength={15}
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Vai trò:</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                user?.role === "ADMIN"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
              {user?.role}
            </span>
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loadingProfile}>
            {loadingProfile ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Lock size={20} className="text-slate-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Đổi mật khẩu</h2>
            <p className="text-sm text-slate-500">Bảo mật tài khoản của bạn</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              className="input-field"
              value={pwForm.old_password}
              onChange={(e) =>
                setPwForm({ ...pwForm, old_password: e.target.value })
              }
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              className="input-field"
              value={pwForm.new_password}
              onChange={(e) =>
                setPwForm({ ...pwForm, new_password: e.target.value })
              }
              minLength={6}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loadingPw}>
            {loadingPw ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}
