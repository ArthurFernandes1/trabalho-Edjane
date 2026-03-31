import { LogOut, Package } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../utils/storage'

function Navbar({ user }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/products" className="flex items-center gap-2 text-slate-800">
          <Package size={20} className="text-indigo-600" />
          <span className="text-lg font-semibold">Gestao de Produtos</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-slate-500">Logado como</p>
            <p className="text-sm font-medium text-slate-700">{user?.name}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
