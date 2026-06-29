import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartAPI, orderAPI } from "../../services/api";
import toast from "react-hot-toast";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.get();
      setCart(res.data || null);
    } catch (err) {
      console.log(err?.response?.data || err);
      toast.error("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      toast.success("Đã xóa sản phẩm");
      fetchCart();
    } catch (err) {
      console.log(err?.response?.data || err);
      toast.error("Xóa thất bại");
    }
  };

  const handleOrder = async () => {
    if (!items.length) return;

    setOrdering(true);

    try {
      // 👉 an toàn nhất cho backend hiện tại
      await orderAPI.create({
        cart_id: cart.id,
      });

      toast.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (err) {
      const msg =
        err?.response?.data?.detail?.[0]?.msg ||
        err?.response?.data?.detail ||
        err?.message ||
        "Đặt hàng thất bại";

      toast.error(msg);
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ✅ SAFE ITEMS
  const items = Array.isArray(cart?.items) ? cart.items : [];

  // ✅ SAFE TOTAL (chống NaN 100%)
  const total = items.reduce((sum, item) => {
    const price = Number(item?.price) || 0;
    const quantity = Number(item?.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Giỏ hàng</h1>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingBag size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">Giỏ hàng trống</p>
          <Link to="/" className="btn-primary inline-flex">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const price = Number(item?.price) || 0;
            const quantity = Number(item?.quantity) || 0;

            return (
              <div key={item?.id} className="card p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item?.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item?.product_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {item?.product_name || "Sản phẩm"}
                  </p>

                  <p className="text-sm text-slate-500">
                    {price.toLocaleString("vi-VN")}₫ × {quantity}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-slate-900">
                    {(price * quantity).toLocaleString("vi-VN")}₫
                  </p>

                  <button
                    onClick={() => handleRemove(item?.id)}
                    className="text-red-400 hover:text-red-600 transition-colors mt-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* TOTAL */}
          <div className="card p-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-slate-700">Tổng cộng</span>

              <span className="text-xl font-bold text-blue-600">
                {total.toLocaleString("vi-VN")}₫
              </span>
            </div>

            <button
              onClick={handleOrder}
              disabled={!items.length || ordering}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
              {ordering ? (
                "Đang đặt hàng..."
              ) : (
                <>
                  Đặt hàng <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
