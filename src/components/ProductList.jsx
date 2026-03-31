import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Modal from './Modal'
import { CATEGORIES, deleteProduct, formatPrice, getCurrentUser, getUserProducts } from '../utils/storage'

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/e2e8f0/334155?text=Sem+Imagem'

function ProductList() {
  const user = getCurrentUser()
  const [products, setProducts] = useState(() => getUserProducts(user.email))
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [sortBy, setSortBy] = useState('name')
  const [direction, setDirection] = useState('asc')
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: undefined,
    onConfirm: undefined,
  })

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim()
    let result = [...products]

    if (query) {
      result = result.filter((product) => product.name.toLowerCase().includes(query))
    }

    if (category !== 'Todas') {
      result = result.filter((product) => product.category === category)
    }

    result.sort((a, b) => {
      let comparison = 0

      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === 'price') {
        comparison = a.price - b.price
      } else {
        comparison = a.quantity - b.quantity
      }

      return direction === 'asc' ? comparison : comparison * -1
    })

    return result
  }, [products, search, category, sortBy, direction])

  const openInfoModal = (title, message, type = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      confirmText: 'Fechar',
      cancelText: undefined,
      onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
    })
  }

  const handleDelete = (product) => {
    if (products.length === 0) {
      openInfoModal('Lista vazia', 'Não há mais produtos para excluir.', 'error')
      return
    }

    setModal({
      isOpen: true,
      title: 'Confirmar exclusao',
      message: `Deseja excluir o produto "${product.name}"?`,
      type: 'error',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      onConfirm: () => {
        deleteProduct(product.id)
        setProducts((prev) => prev.filter((item) => item.id !== product.id))
        setModal((prev) => ({ ...prev, isOpen: false }))
      },
    })
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Produtos</h1>
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus size={16} />
          Adicionar novo produto
        </Link>
      </div>

      <section className="mb-5 grid gap-3 rounded-2xl bg-white p-4 shadow sm:grid-cols-2 lg:grid-cols-5">
        <label className="relative sm:col-span-2 lg:col-span-2">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome"
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="Todas">Todas categorias</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="name">Ordenar por nome</option>
          <option value="price">Ordenar por preco</option>
          <option value="quantity">Ordenar por quantidade</option>
        </select>

        <select
          value={direction}
          onChange={(event) => setDirection(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>
      </section>

      {products.length === 0 ? (
        <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow">
          <h3 className="mb-2 text-xl font-semibold text-slate-800">Nenhum produto cadastrado ainda.</h3>
          <p className="mb-5 text-sm text-slate-500">Comece adicionando o primeiro produto para visualizar a lista.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/products/new"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Adicionar o primeiro produto
            </Link>
            <button
              type="button"
              onClick={() => openInfoModal('Lista vazia', 'Não há mais produtos para excluir.', 'error')}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Tentar excluir
            </button>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <p className="text-slate-600">Nenhum produto encontrado para os filtros aplicados.</p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-2xl bg-white shadow">
              <img
                src={product.imageUrl || PLACEHOLDER_IMAGE}
                alt={product.name}
                className="h-48 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = PLACEHOLDER_IMAGE
                }}
              />
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 text-lg font-semibold text-slate-800">{product.name}</h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      product.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{product.category}</p>
                <p className="text-lg font-bold text-indigo-600">{formatPrice(product.price)}</p>
                <p className="text-sm text-slate-700">Quantidade: {product.quantity}</p>
                <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
              </div>
              <div className="flex gap-2 border-t border-slate-200 p-4">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Pencil size={16} />
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onCancel={
          modal.cancelText
            ? () => {
                setModal((prev) => ({ ...prev, isOpen: false }))
              }
            : undefined
        }
        onConfirm={modal.onConfirm}
      />
    </main>
  )
}

export default ProductList
