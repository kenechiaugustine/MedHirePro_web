import AppRouter from './router'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
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
    </>
  )
}

export default App
