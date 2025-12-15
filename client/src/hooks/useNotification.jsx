import { useState, useEffect,useCallback } from "react"
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const useNotification = () => {
  const axiosPrivate = useAxiosPrivate();
  const [notification, setNotification] = useState([]);
  const [seenNotification, setSeenNotification] = useState([]);
  const [loading, setLoading] = useState(false);

  //Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await axiosPrivate.get("/notifications");

      setNotification(data.notification || []);
      setSeenNotification(data.seenNotification || []);
    } catch (err) {
      console.error("Notification error:", err);
    }
  }, [axiosPrivate]);

  //Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axiosPrivate.get(
        "/notifications?markAsRead=true"
      );

      setNotification([]); // unread cleared
      setSeenNotification(data.seenNotification || []);
    } catch (err) {
      console.error("Mark as read error:", err);
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, markAllAsRead]);

  return {
    notification,
    seenNotification,
    loading,
    fetchNotifications,
    markAllAsRead,
  };
};

export default useNotification;
    
   