import { useContext } from "react";
import NotificationContext from "../context/NotificationProvider";

const useNotif = () => {
    return useContext(NotificationContext);
}

export default useNotif;