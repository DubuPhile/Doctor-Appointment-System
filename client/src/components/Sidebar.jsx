import { userMenu, AdminMenu } from "../data/data"
import { Link, useLocation } from "react-router-dom"
import { useUserInfo } from "./useUserInfo";
const Sidebar = () => {
    const location = useLocation();
    const {userId , isDoctor, roles} = useUserInfo();
    //============Doctors Menu ================
    const doctorsMenu = [
        {
            name:"Home",
            path:"/home",
            icon:"fa-solid fa-house"
        },
        {
            name:"Appointments",
            path:"/appointments",
            icon:"fa-solid fa-list"
        },
        {
            name:"Profile",
            path:`/doctor/profile/${userId}`,
            icon:"fa-solid fa-user"
        },
    ]
    const SideBarMenu = roles.includes(5150) ? AdminMenu : isDoctor ? doctorsMenu : userMenu;
    
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