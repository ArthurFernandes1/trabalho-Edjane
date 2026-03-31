import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from './Modal'
import { getUsers, saveCurrentUser, saveUsers } from '../utils/storage'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' })

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const showModal = (title, message, type = 'error') => {
    setModal({ isOpen: true, title, message, type })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    const password = form.password.trim()

    if (!name || !email || !password) {
      showModal('Campos obrigatórios', 'Preencha nome, e-mail e senha.')
      return
    }

    const users = getUsers()
    const userExists = users.some((user) => user.email === email)

    if (userExists) {
      showModal('E-mail já cadastrado', 'Este e-mail já foi cadastrado! Você já possui uma conta.')
      return
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    }

    saveUsers([...users, newUser])
    saveCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email })
    showModal('Conta criada', 'Cadastro realizado com sucesso. Você será redirecionado.', 'success')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">Criar conta</h1>
        <p className="mb-6 text-sm text-slate-500">Cadastre-se para gerenciar seus produtos.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
              Nome completo
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Digite seu nome completo"
            />
          </div>

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
            Cadastrar
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Já possui conta?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Fazer login
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

export default Register
