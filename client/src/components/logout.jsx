import { useEffect } from 'react';
import useLogout from '../hooks/useLogout'
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const LogOut = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }
    return (
        <div 
            className="menu-item Logout"
            onClick={signOut}
        >
            <i className="fa-solid fa-right-from-bracket logoutIcon"></i>
            <button className='Logoutbtn'>Logout</button>
        </div>
    )
    
}

export default LogOut