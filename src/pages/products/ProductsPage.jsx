import { useState, useEffect } from 'react'
import { productAPI, categoryAPI, cartAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { ShoppingCart, Search, Filter } from 'lucide-react'

function ProductCard({ product, onAddToCart }) {
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    setAdding(true)
    await onAddToCart(product.id, qty)
    setAdding(false)
  }

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="text-slate-300 text-5xl">📦</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-blue-600 font-medium mb-1">{product.category_name || 'Chung'}</p>
        <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">
            {Number(product.price).toLocaleString('vi-VN')}₫
          </span>
          <span className="text-xs text-slate-400">Còn {product.stock ?? '–'}</span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={product.stock || 99}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="input-field w-16 text-center py-1.5"
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="btn-primary flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm"
          >
            <ShoppingCart size={14} />
            {adding ? 'Đang thêm...' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')

  useEffect(() => {
    Promise.all([productAPI.getAll(), categoryAPI.getAll()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data)
        setCategories(cRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAddToCart = async (productId, quantity) => {
    if (!user) return toast.error('Hãy đăng nhập để thêm vào giỏ')
    try {
      await cartAPI.add({ product_id: productId, quantity })
      toast.success('Đã thêm vào giỏ hàng!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Thêm thất bại')
    }
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !selectedCat || String(p.category_id) === selectedCat
    return matchSearch && matchCat
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Sản phẩm</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              className="input-field pl-9 w-52"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <select
              className="input-field pl-9 pr-8 w-44 appearance-none"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-3">🔍</div>
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  )
}
