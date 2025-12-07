import { SideBarMenu } from "../data/data"
import { Link, useLocation } from "react-router-dom"
const Sidebar = () => {
    const location = useLocation();
    return(
        <>
            {SideBarMenu.map(menu => {
                const isActive = location.pathname === menu.path
                return(
                <div 
                    key = {menu.name}
                    className={`menu-item ${isActive && "active"}`}
                >
                    <i className={menu.icon}></i>
                    <Link to={menu.path}>{menu.name}</Link>
                </div>
                )
            })}
        </>
    )
}

export default Sidebar