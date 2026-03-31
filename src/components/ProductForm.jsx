import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Maximize2, Minus, RotateCcw, Save, X, ZoomIn } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Modal from './Modal'
import { CATEGORIES, getCurrentUser, getProductById, upsertProduct } from '../utils/storage'

const INITIAL_FORM = {
  name: '',
  category: CATEGORIES[0],
  price: '',
  quantity: 0,
  description: '',
  imageUrl: '',
  status: 'Ativo',
}
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/e2e8f0/334155?text=Sem+Imagem'

function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = useMemo(() => Boolean(id), [id])
  const user = getCurrentUser()

  const [form, setForm] = useState(INITIAL_FORM)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' })
  const [expandedImage, setExpandedImage] = useState(false)
  const [zoom, setZoom] = useState(1)
  const pinchDistanceRef = useRef(null)
  const pinchStartZoomRef = useRef(1)

  useEffect(() => {
    if (!isEdit) return

    const product = getProductById(id)
    if (!product || product.ownerEmail !== user?.email) {
      setModal({
        isOpen: true,
        title: 'Produto não encontrado',
        message: 'Este produto não existe ou não pertence ao usuário logado.',
        type: 'error',
      })
      return
    }

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      imageUrl: product.imageUrl,
      status: product.status,
    })
  }, [id, isEdit, user?.email])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!form.name.trim() || !form.category || !form.description.trim()) {
      return 'Preencha todos os campos obrigatórios.'
    }

    const price = Number(form.price)
    if (Number.isNaN(price) || price <= 0) {
      return 'Preço deve ser um número maior que 0.'
    }

    const quantity = Number(form.quantity)
    if (!Number.isInteger(quantity) || quantity < 0) {
      return 'Quantidade deve ser um número inteiro maior ou igual a 0.'
    }

    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const errorMessage = validate()

    if (errorMessage) {
      setModal({ isOpen: true, title: 'Validação', message: errorMessage, type: 'error' })
      return
    }

    const product = {
      id: id || crypto.randomUUID(),
      ownerEmail: user.email,
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      status: form.status,
    }

    upsertProduct(product)
    setModal({
      isOpen: true,
      title: isEdit ? 'Produto atualizado' : 'Produto criado',
      message: isEdit ? 'As alterações foram salvas.' : 'Novo produto cadastrado com sucesso.',
      type: 'success',
    })
  }

  const applyZoom = (value) => {
    setZoom(Math.min(4, Math.max(1, Number(value.toFixed(2)))))
  }

  const closeImageViewer = () => {
    setExpandedImage(false)
    setZoom(1)
    pinchDistanceRef.current = null
  }

  const handleWheelZoom = (event) => {
    event.preventDefault()
    const delta = event.deltaY < 0 ? 0.15 : -0.15
    applyZoom(zoom + delta)
  }

  const handleTouchStart = (event) => {
    if (event.touches.length !== 2) return
    const [a, b] = event.touches
    pinchDistanceRef.current = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    pinchStartZoomRef.current = zoom
  }

  const handleTouchMove = (event) => {
    if (event.touches.length !== 2 || !pinchDistanceRef.current) return
    const [a, b] = event.touches
    const currentDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    const scale = currentDistance / pinchDistanceRef.current
    applyZoom(pinchStartZoomRef.current * scale)
  }

  const handleTouchEnd = () => {
    pinchDistanceRef.current = null
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
          {isEdit ? 'Editar produto' : 'Novo produto'}
        </h2>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-5 shadow">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nome do produto *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Categoria *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Preço *</label>
            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Quantidade em estoque *</label>
            <input
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Descrição *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">URL da imagem</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <div className="relative aspect-[4/3] w-full">
              <img
                src={form.imageUrl.trim() || PLACEHOLDER_IMAGE}
                alt={form.name || 'Preview do produto'}
                className="h-full w-full object-cover object-center"
                onError={(event) => {
                  event.currentTarget.src = PLACEHOLDER_IMAGE
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setExpandedImage(true)
                  setZoom(1)
                }}
                className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-slate-900/70 px-2 py-1 text-xs font-medium text-white transition hover:bg-slate-900"
              >
                <Maximize2 size={14} />
                Tela cheia
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Save size={16} />
            Salvar produto
          </button>
        </div>
      </form>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={() => {
          const isSuccess = modal.type === 'success' || modal.title === 'Produto não encontrado'
          setModal((prev) => ({ ...prev, isOpen: false }))
          if (isSuccess) navigate('/products')
        }}
      />

      {expandedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4"
          onClick={closeImageViewer}
        >
          <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900/80 p-2 text-white">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                applyZoom(zoom - 0.2)
              }}
              className="rounded-lg p-2 hover:bg-white/10"
            >
              <Minus size={16} />
            </button>
            <span className="min-w-14 text-center text-xs font-semibold">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                applyZoom(zoom + 0.2)
              }}
              className="rounded-lg p-2 hover:bg-white/10"
            >
              <ZoomIn size={16} />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setZoom(1)
              }}
              className="rounded-lg p-2 hover:bg-white/10"
            >
              <RotateCcw size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={closeImageViewer}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X size={20} />
          </button>
          <img
            src={form.imageUrl.trim() || PLACEHOLDER_IMAGE}
            alt={form.name || 'Preview do produto'}
            className="max-h-[90vh] w-auto max-w-[95vw] rounded-xl object-contain shadow-2xl transition-transform duration-100"
            style={{ transform: `scale(${zoom})` }}
            onClick={(event) => event.stopPropagation()}
            onWheel={handleWheelZoom}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onError={(event) => {
              event.currentTarget.src = PLACEHOLDER_IMAGE
            }}
          />
        </div>
      )}
    </main>
  )
}

export default ProductForm
