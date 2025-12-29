import { Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Page404 from './pages/404'
import { useSelector } from 'react-redux'
import Spinner from './components/Spinner'
import RequireAuth from './components/RequiredAuth'
import Logout from './components/logout'
import PersistLogin from './components/PersistLogin'
import Unauthorized from './pages/Unauthorized'
import ApplyDoctor from './pages/ApplyDoctor'
import Notification from './pages/Notification'
import Users from './pages/Admin/Users'
import Doctors from './pages/Admin/Doctors'
import { NotificationProvider } from './context/NotificationProvider'
import Profile from './pages/doctor/Profile'
import BookingPage from './pages/BookingPage'
import Appointments from './pages/Appointments'

function App() {
  const {loading} = useSelector(state => state.alerts)
  return (
    <>  
      <NotificationProvider>
        {loading ? (<Spinner/>) : (
          <Routes>
            <Route path="/" element = {<Navigate to ="/login"/>}/>
            <Route path='/login' element = {<Login />} />
            <Route path='/register' element = {<Register />} />
            
            <Route element = {<PersistLogin />}>
              <Route element = {<RequireAuth allowedRoles={[2001,5150]}/>}>         
                <Route path='/home' element = {<Home />} />
                <Route path='/notification' element = {<Notification />} />
                <Route path = '/logout' element = {<Logout />} />
                <Route path = '/book-appointment/:doctorId' element = {<BookingPage />} />
                <Route path = '/Appointments' element = {<Appointments />} />
                <Route path ="/unauthorized" element = {<Unauthorized />}/>
              </Route>
              {/*User Routes*/}
              <Route element = {<RequireAuth allowedRoles={[2001]}/>}>
                <Route path='/apply-doctor' element = {<ApplyDoctor />} />
                <Route path='/doctor/profile/:id' element = {<Profile />} />
                
              </Route>
              {/*Admin Routes*/}
              <Route element = {<RequireAuth allowedRoles={[5150]}/>}>
                <Route path='/admin/doctors' element = {<Doctors />} />
                <Route path='/admin/users' element = {<Users />} />

              </Route>
            </Route>
            <Route path ="*" element = {<Page404/>}/>
          </Routes>
        )}
      </NotificationProvider>
    </>
  )
}

export default App
