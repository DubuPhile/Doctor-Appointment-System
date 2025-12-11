import { useState, useEffect } from "react"
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const useNotification = () => {
   
    const axiosPrivate = useAxiosPrivate();
    const [notification, setNotification] = useState([]);
    const [seenNotification, setSeenNotification] = useState([]);
    
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchNotifications = async () => {
        try {
            const { data } = await axiosPrivate.get("/notifications", {
                signal: controller.signal,
            });

            if (isMounted) {
            setNotification(data.notification || []);
            setSeenNotification(data.seenNotification || []);
            }
        } catch (err) {
            console.log("Notification error:", err);
        }
        };

        fetchNotifications();

        return () => {
        isMounted = false;
        controller.abort();
        };
    }, [axiosPrivate]);

    return {notification , setNotification, seenNotification, setSeenNotification}
    
    
}

export default useNotification
    
   