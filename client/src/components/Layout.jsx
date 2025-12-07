import "../styles/Layout.css"
import Sidebar from "./Sidebar"


const Layout = ({children}) => {
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
                </div>
            </div>
            <div className="content">
                <header className='header'>Header</header>
                <div className='body'>{ children }</div>
            </div>
        </div>
            

    </main>
  )
}

export default Layout