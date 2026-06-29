import { useState, useEffect } from "react";
import { orderAPI } from "../../services/api";
import { ClipboardList, ChevronDown, ChevronUp } from "lucide-react";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipping: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabel = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);

  const status = order?.status || "pending";
  const items = Array.isArray(order?.items) ? order.items : [];

  return (
    <div className="card overflow-hidden">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-4">
          <div>
            <p className="font-medium text-slate-900">
              Đơn #{order?.id || "—"}
            </p>
            <p className="text-sm text-slate-500">
              {order?.created_at
                ? new Date(order.created_at).toLocaleDateString("vi-VN")
                : "—"}
            </p>
          </div>

          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              statusColor[status] || "bg-slate-100 text-slate-600"
            }`}>
            {statusLabel[status] || status}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900">
            {Number(order?.total_price || 0).toLocaleString("vi-VN")}₫
          </span>

          {open ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </div>
      </div>

      {open && items.length > 0 && (
        <div className="border-t border-slate-100 divide-y divide-slate-100">
          {items.map((item, i) => {
            const price = Number(item?.price) || 0;
            const quantity = Number(item?.quantity) || 0;

            return (
              <div key={i} className="px-4 py-3 flex justify-between text-sm">
                <span className="text-slate-700">
                  {item?.product_name || "Sản phẩm"} × {quantity}
                </span>

                <span className="text-slate-900 font-medium">
                  {(price * quantity).toLocaleString("vi-VN")}₫
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI
      .getMyOrders()
      .then((res) => {
        setOrders(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log("Get orders error:", err?.response?.data || err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Đơn hàng của tôi
      </h1>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <ClipboardList size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500">Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order?.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
