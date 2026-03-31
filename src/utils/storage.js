const USERS_KEY = 'users'
const CURRENT_USER_KEY = 'currentUser'
const PRODUCTS_KEY = 'products'

export const CATEGORIES = ['Eletrônicos', 'Roupas', 'Alimentos', 'Livros', 'Beleza', 'Casa', 'Outros']

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null')
}

export function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getProducts() {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]')
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function getUserProducts(userEmail) {
  return getProducts().filter((product) => product.ownerEmail === userEmail)
}

export function upsertProduct(product) {
  const products = getProducts()
  const index = products.findIndex((item) => item.id === product.id)
  if (index >= 0) {
    products[index] = product
  } else {
    products.push(product)
  }
  saveProducts(products)
}

export function deleteProduct(productId) {
  const products = getProducts().filter((product) => product.id !== productId)
  saveProducts(products)
}

export function getProductById(productId) {
  return getProducts().find((product) => product.id === productId)
}

export function formatPrice(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

