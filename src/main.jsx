
import { createRoot } from 'react-dom/client'
import '../src/index.css'
import App from './App.jsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

createRoot(document.getElementById('root')).render(
    <App />

)
