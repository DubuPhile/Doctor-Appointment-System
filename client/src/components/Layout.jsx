import { Link, useNavigate } from "react-router-dom"
import "../styles/Layout.css"
import Sidebar from "./Sidebar"
import {useUserInfo} from "./useUserInfo"
import LogOut from "./logout"
import { Badge } from "antd"
import useNotification from "../hooks/useNotification"

const Layout = ({children}) => {
    const {user} = useUserInfo();
    const {notification, seenNotification} = useNotification();
    const navigate = useNavigate();

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