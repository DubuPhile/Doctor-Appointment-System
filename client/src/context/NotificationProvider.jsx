import { createContext } from "react";
import useNotification from "../hooks/useNotification";

const NotificationContext = createContext({});

export const NotificationProvider = ({children}) => {
    const notificationState = useNotification();

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext;