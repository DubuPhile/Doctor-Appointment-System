import { useState, useEffect,useCallback } from "react"
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from "./useAuth";
import { message } from "antd";

const useNotification = () => {
  const axiosPrivate = useAxiosPrivate();
  const [unread, setUnread] = useState([]);
  const [read, setRead] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const {auth} = useAuth();

  //Fetch notifications
  const getNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosPrivate.get("/notifications");

      if (res.data.success) {
        setUnread(res.data.unread);
        setRead(res.data.read);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (auth?.accessToken) {
      getNotifications();
  }
  }, [ auth?.accessToken]);

  //Mark all as read
  const markAllAsRead = async () => {
    try {
      await axiosPrivate.get("/notifications?markAsRead=true");
      getNotifications();
      message.success('All message mark as read!')
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRead = async () => {
    try {
      await axiosPrivate.get("/notifications?deleteRead=true");
      getNotifications();
      message.success('All Notifications has been Deleted!')
    } catch (err) {
      console.error(err);
    }
  };
  const openNotification = async (notification) => {
    try {
      if (!notification.seen) {
        await axiosPrivate.patch(`/notifications/${notification._id}/read`);
        getNotifications();
      }
      setSelectedNotification(notification);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    unread,
    read,
    loading,
    getNotifications,
    markAllAsRead,
    deleteRead,
    openNotification,
    selectedNotification,
    setSelectedNotification
  };
};

export default useNotification;
    
   