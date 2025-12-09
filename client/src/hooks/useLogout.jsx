import axios from "../api/axios"
import useAuth from "./useAuth"

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {

        try{
            const response = await axios.get('/logout', {} ,{
                withCredentials: true
            });
        } catch(err){
            console.error(err);
        }
        finally{
            setAuth({});
        }

    }

    return logout;
}


export default useLogout;