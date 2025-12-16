import { useState, useEffect,useCallback } from "react"
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from "./useAuth";

const useNotification = () => {
  const axiosPrivate = useAxiosPrivate();
  const [notification, setNotification] = useState([]);
  const [seenNotification, setSeenNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const {auth} = useAuth();

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
  //Delete All Notifications
  const DeleteAllNotification = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await axiosPrivate.get(
        "/notifications?deleteRead=true"
      );

      setNotification([]); // unread cleared
      setSeenNotification([]);
    } catch (err) {
      console.error("Mark as read error:", err);
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate]);

    useEffect(() => {
    if (auth?.accessToken) {
        fetchNotifications();
    }
    }, [fetchNotifications, auth?.accessToken]);

  return {
    notification,
    seenNotification,
    loading,
    fetchNotifications,
    markAllAsRead,
    DeleteAllNotification,
  };
};

export default useNotification;
    
   