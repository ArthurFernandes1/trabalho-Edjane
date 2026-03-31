import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from './Modal'
import { getUsers, saveCurrentUser } from '../utils/storage'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' })

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const showModal = (title, message, type = 'error') => {
    setModal({ isOpen: true, title, message, type })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const email = form.email.trim().toLowerCase()
    const password = form.password.trim()

    if (!email || !password) {
      showModal('Campos obrigatórios', 'Informe e-mail e senha.')
      return
    }

    const users = getUsers()
    const user = users.find((item) => item.email === email)

    if (!user) {
      showModal('E-mail não encontrado', 'E-mail não encontrado. Verifique ou cadastre-se.')
      return
    }

    if (user.password !== password) {
      showModal('Senha incorreta', 'Senha incorreta. Tente novamente.')
      return
    }

    saveCurrentUser({ id: user.id, name: user.name, email: user.email })
    showModal('Login realizado', 'Autenticação concluída com sucesso.', 'success')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">Entrar</h1>
        <p className="mb-6 text-sm text-slate-500">Acesse sua conta para gerenciar produtos.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Entrar
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Não possui conta?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Cadastrar
          </Link>
        </p>
      </div>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={() => {
          const isSuccess = modal.type === 'success'
          setModal((prev) => ({ ...prev, isOpen: false }))
          if (isSuccess) navigate('/products')
        }}
      />
    </div>
  )
}

export default Login
