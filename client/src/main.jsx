import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "antd/dist/reset.css"
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import store from './redux/store.jsx'

if (process.env.NODE_ENV === 'production'){
  disableReactDevTools();
}

createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <GoogleOAuthProvider clientId = {import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Routes>
              <Route path="/*" element={<App />}/> 
            </Routes>
          </GoogleOAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  </Provider>
)
