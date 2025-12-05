

const Layout = ({children}) => {
  return (
    <main className='main'>
        <div className='layout'>
            <div className='sidebar'>
                <div className="logo"> Logo </div>
                <div className="menu"> Menu </div>
            </div>
            <header className='header'>Header</header>
            <div className='body'>{ children }</div>
        </div>
            

    </main>
  )
}

export default Layout