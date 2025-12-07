import { useEffect } from 'react';
import logout from '../hooks/useLogout'
import { useNavigate } from 'react-router-dom';



const logOut = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/login');
    },[logout])

    logout();
}

export default logOut