import { Link } from "react-router-dom"
import "../styles/Layout.css"
import Sidebar from "./Sidebar"
import {useUserInfo} from "./useUserInfo"
import LogOut from "./logout"

const Layout = ({children}) => {
    const {user} = useUserInfo();

  return (
    <main className='main'>
        <div className='layout'>
            <div className='sidebar'>
                <div className="logo">
                    <h6>DOC APP</h6>
                    <hr/>
                </div>
                <div className="menu">
                   <Sidebar/>
                   <LogOut />
                </div>
            </div>
            <div className="content">
                <header className='header'>
                    <div className="header-content">
                        <i className="fa-solid fa-bell"></i>
                        <Link to ='/profile'>{ user || 'Guest'}</Link>
                    </div>
                </header>
                <div className='body'>{ children }</div>
            </div>
        </div>
            

    </main>
  )
}

export default Layout