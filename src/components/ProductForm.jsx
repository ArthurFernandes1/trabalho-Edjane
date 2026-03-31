import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
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

function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = useMemo(() => Boolean(id), [id])
  const user = getCurrentUser()

  const [form, setForm] = useState(INITIAL_FORM)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' })

  useEffect(() => {
    if (!isEdit) return

    const product = getProductById(id)
    if (!product || product.ownerEmail !== user?.email) {
      setModal({
        isOpen: true,
        title: 'Produto nao encontrado',
        message: 'Este produto nao existe ou nao pertence ao usuario logado.',
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
      return 'Preencha todos os campos obrigatorios.'
    }

    const price = Number(form.price)
    if (Number.isNaN(price) || price <= 0) {
      return 'Preco deve ser um numero maior que 0.'
    }

    const quantity = Number(form.quantity)
    if (!Number.isInteger(quantity) || quantity < 0) {
      return 'Quantidade deve ser um numero inteiro maior ou igual a 0.'
    }

    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const errorMessage = validate()

    if (errorMessage) {
      setModal({ isOpen: true, title: 'Validacao', message: errorMessage, type: 'error' })
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
      message: isEdit ? 'As alteracoes foram salvas.' : 'Novo produto cadastrado com sucesso.',
      type: 'success',
    })
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Preco *</label>
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
          <label className="mb-1 block text-sm font-medium text-slate-700">Descricao *</label>
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
          const isSuccess = modal.type === 'success' || modal.title === 'Produto nao encontrado'
          setModal((prev) => ({ ...prev, isOpen: false }))
          if (isSuccess) navigate('/products')
        }}
      />
    </main>
  )
}

export default ProductForm
