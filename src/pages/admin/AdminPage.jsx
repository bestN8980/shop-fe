import { useState, useEffect } from 'react'
import { productAPI, categoryAPI, adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Check, Package, Tag, Users } from 'lucide-react'

/* ---- Reusable modal ---- */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

/* ---- Products tab ---- */
function ProductsTab() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | { mode: 'create'|'edit', data }
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '' })

  const fetch = async () => {
    const res = await productAPI.getAll()
    setProducts(res.data)
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => {
    setForm({ name: '', description: '', price: '', stock: '', category_id: '' })
    setModal({ mode: 'create' })
  }

  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock || '', category_id: p.category_id || '' })
    setModal({ mode: 'edit', id: p.id })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), category_id: form.category_id ? Number(form.category_id) : undefined }
    try {
      if (modal.mode === 'create') await productAPI.create(payload)
      else await productAPI.update(modal.id, payload)
      toast.success(modal.mode === 'create' ? 'Đã tạo sản phẩm' : 'Đã cập nhật')
      setModal(null)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Thao tác thất bại')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return
    try {
      await productAPI.delete(id)
      toast.success('Đã xóa')
      fetch()
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{products.length} sản phẩm</p>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5 text-sm py-1.5">
          <Plus size={15} /> Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse"/>)}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-2 font-medium">Tên</th>
                <th className="pb-2 font-medium">Giá</th>
                <th className="pb-2 font-medium">Tồn kho</th>
                <th className="pb-2 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="py-3 text-slate-600">{Number(p.price).toLocaleString('vi-VN')}₫</td>
                  <td className="py-3 text-slate-600">{p.stock ?? '—'}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-blue-600 transition-colors"><Pencil size={15}/></button>
                      <button onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === 'create' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label: 'Tên sản phẩm', key: 'name', type: 'text', required: true },
              { label: 'Giá (₫)', key: 'price', type: 'number', required: true },
              { label: 'Tồn kho', key: 'stock', type: 'number' },
              { label: 'ID danh mục', key: 'category_id', type: 'number' },
            ].map(({ label, key, type, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                <input type={type} className="input-field" value={form[key]} required={required}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
              <textarea className="input-field resize-none" rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn-primary flex-1">Lưu</button>
              <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Hủy</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

/* ---- Categories tab ---- */
function CategoriesTab() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })

  const fetch = async () => {
    const res = await categoryAPI.getAll()
    setCategories(res.data)
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => { setForm({ name: '', description: '' }); setModal({ mode: 'create' }) }
  const openEdit = (c) => { setForm({ name: c.name, description: c.description || '' }); setModal({ mode: 'edit', id: c.id }) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modal.mode === 'create') await categoryAPI.create(form)
      else await categoryAPI.update(modal.id, form)
      toast.success(modal.mode === 'create' ? 'Đã tạo danh mục' : 'Đã cập nhật')
      setModal(null)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Thao tác thất bại')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa danh mục này?')) return
    try {
      await categoryAPI.delete(id)
      toast.success('Đã xóa')
      fetch()
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{categories.length} danh mục</p>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5 text-sm py-1.5">
          <Plus size={15} /> Thêm danh mục
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse"/>)}</div>
      ) : (
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
              <div>
                <p className="font-medium text-slate-900">{c.name}</p>
                <p className="text-sm text-slate-500">{c.description || '—'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="text-slate-400 hover:text-blue-600 transition-colors"><Pencil size={15}/></button>
                <button onClick={() => handleDelete(c.id)} className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={15}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal.mode === 'create' ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên danh mục</label>
              <input className="input-field" value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
              <textarea className="input-field resize-none" rows={2} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn-primary flex-1">Lưu</button>
              <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Hủy</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

/* ---- Users tab ---- */
function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getAllUsers()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Xóa người dùng này?')) return
    try {
      await adminAPI.deleteUser(id)
      toast.success('Đã xóa người dùng')
      setUsers(users.filter(u => u.id !== id))
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">{users.length} người dùng</p>
      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse"/>)}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-2 font-medium">Tên</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Vai trò</th>
                <th className="pb-2 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-900">{u.full_name || '—'}</td>
                  <td className="py-3 text-slate-600">{u.email}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(u.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={15}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ---- Main Admin Page ---- */
const TABS = [
  { id: 'products', label: 'Sản phẩm', Icon: Package },
  { id: 'categories', label: 'Danh mục', Icon: Tag },
  { id: 'users', label: 'Người dùng', Icon: Users },
]

export default function AdminPage() {
  const [tab, setTab] = useState('products')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Quản trị</h1>

      <div className="card overflow-hidden">
        <div className="flex border-b border-slate-100">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === id
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === 'products' && <ProductsTab />}
          {tab === 'categories' && <CategoriesTab />}
          {tab === 'users' && <UsersTab />}
        </div>
      </div>
    </div>
  )
}
