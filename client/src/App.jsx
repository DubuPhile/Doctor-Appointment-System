import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Page404 from './pages/404'
import { useSelector } from 'react-redux'
import Spinner from './components/Spinner'

function App() {
  const {loading} = useSelector(state => state.alerts)
  return (
    <>
        {loading ? (<Spinner/>) : (
          <Routes>
            <Route path='/' element = {<Home />} />
            <Route path='/login' element = {<Login />} />
            <Route path='/register' element = {<Register />} />
            <Route path ="*" element = {<Page404/>}/>
          </Routes>
        )}
    </>
  )
}

export default App
