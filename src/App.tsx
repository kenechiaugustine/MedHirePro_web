import AppRouter from './router'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          className: 'dark:bg-gray-800 dark:text-white'
        }}
      />
    </AuthProvider>
  )
}

export default App
