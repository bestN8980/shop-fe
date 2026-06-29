# ShopApp Frontend

React + React Router + Tailwind CSS, kết nối với FastAPI backend.

## Cài đặt

```bash
npm install
```

## Cấu hình

Copy file `.env.example` thành `.env` và sửa URL backend:

```
VITE_API_URL=http://localhost:8000
```

## Chạy dev

```bash
npm run dev
```

## Build production

```bash
npm run build
```

---

## Cấu trúc thư mục

```
src/
├── context/
│   └── AuthContext.jsx        # Auth state toàn app (login/logout/user)
├── services/
│   └── api.js                 # Axios instance + tất cả API calls
├── components/
│   ├── common/
│   │   └── ProtectedRoute.jsx # Route guard (auth + admin)
│   └── layout/
│       └── Navbar.jsx         # Navbar responsive
└── pages/
    ├── auth/
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   └── ProfilePage.jsx
    ├── products/
    │   └── ProductsPage.jsx   # Grid sản phẩm + filter + thêm giỏ
    ├── cart/
    │   └── CartPage.jsx       # Giỏ hàng + đặt hàng
    ├── orders/
    │   └── OrdersPage.jsx     # Danh sách đơn hàng
    └── admin/
        └── AdminPage.jsx      # CRUD sản phẩm, danh mục, user
```

## Routes

| Path | Trang | Quyền |
|------|-------|-------|
| `/` | Danh sách sản phẩm | Đã đăng nhập |
| `/login` | Đăng nhập | Public |
| `/register` | Đăng ký | Public |
| `/profile` | Hồ sơ cá nhân | Đã đăng nhập |
| `/cart` | Giỏ hàng | Đã đăng nhập |
| `/orders` | Đơn hàng của tôi | Đã đăng nhập |
| `/admin` | Quản trị | Admin only |
