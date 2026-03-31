import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../utils/storage'

function ProtectedRoute({ children }) {
  const user = getCurrentUser()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
