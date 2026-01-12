import { Link, useNavigate } from "react-router-dom"
import "../styles/Layout.css"
import Sidebar from "./Sidebar"
import {useUserInfo} from "../hooks/useUserInfo"
import LogOut from "./logout"
import { Badge } from "antd"
import useNotif from "../hooks/useNotif"
import { useState } from "react"

const Layout = ({children}) => {
    const {user} = useUserInfo();
    const {notification} = useNotif();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

  return (
    <main className='main'>
        <div className='layout'>
            <section className='sidebar d-none d-lg-block'>
                <div className="logo">
                    <h6>DOC APP</h6>
                    <hr/>
                </div>
                <div className="menu">
                   <Sidebar/>
                   <LogOut />
                </div>
            </section>
            <button 
                className={`burgerbtn d-block d-lg-none ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
            >
                <div className="hamburger-line"></div>
            </button>
            <section className={`d-block d-lg-none sidebarBurger ${open ? "open" : ""}`}>
                <div className="logo">
                    <h6>DOC APP</h6>
                    <hr/>
                </div>
                <div className="menu">
                   <Sidebar/>
                   <LogOut />
                </div>
            </section>
            <div className="content">
                <header className='header'>
                    <div className="header-content" style={{cursor: 'pointer'}}>
                        <Badge count ={notification.length} onClick={() => {navigate('/notification')}}>
                        <i className="fa-solid fa-bell" ></i>
                        </Badge>
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