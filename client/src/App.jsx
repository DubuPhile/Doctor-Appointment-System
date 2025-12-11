import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Page404 from './pages/404'
import { useSelector } from 'react-redux'
import Spinner from './components/Spinner'
import RequireAuth from './components/RequiredAuth'
import Logout from './components/logout'
import PersistLogin from './components/PersistLogin'
import Unautorized from './pages/Unautorized'
import ApplyDoctor from './pages/ApplyDoctor'

function App() {
  const {loading} = useSelector(state => state.alerts)
  return (
    <>
        {loading ? (<Spinner/>) : (
          <Routes>
            <Route path="/" element = {<Navigate to ="/login"/>}/>
            <Route path='/login' element = {<Login />} />
            <Route path='/register' element = {<Register />} />
            
            <Route element = {<PersistLogin />}>
              <Route element = {<RequireAuth allowedRoles={[2001,5150]}/>}>
                <Route path='/home' element = {<Home />} />
                <Route path='/apply-doctor' element = {<ApplyDoctor />} />
                <Route path = '/logout' element = {<Logout />} />
                <Route path ="/unautorized" element = {<Unautorized />}/>
              </Route>
            </Route>

            
            <Route path ="*" element = {<Page404/>}/>
          </Routes>
        )}
    </>
  )
}

export default App
