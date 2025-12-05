import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Page404 from './pages/404'
import { useSelector } from 'react-redux'
import Spinner from './components/Spinner'
import RequireAuth from './components/RequiredAuth'

function App() {
  const {loading} = useSelector(state => state.alerts)
  return (
    <>
        {loading ? (<Spinner/>) : (
          <Routes>
            <Route path='/login' element = {<Login />} />
            <Route path='/register' element = {<Register />} />

            <Route element = {<RequireAuth allowedRoles={[2001]}/>}>
            <Route path='/' element = {<Home />} />
            </Route>

            <Route path ="*" element = {<Page404/>}/>
          </Routes>
        )}
    </>
  )
}

export default App
