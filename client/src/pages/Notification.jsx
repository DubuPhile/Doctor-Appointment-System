import Layout from '../components/Layout'
import { Tabs } from 'antd'
import { useNavigate } from 'react-router-dom';
import useNotification from '../hooks/useNotification';

const Notification = () => {
  const {notification, markAllAsRead, seenNotification} = useNotification();
  const navigate = useNavigate();
  const handleDeleteAllRead = () => {}

  const tabItems = [
    {
      key: "0",
      label: "Unread",
      children: (
        <>
          <div className="d-flex justify-content-end">
            <h4 className="p-2" onClick={markAllAsRead} style={{cursor: "pointer"}}>
              Mark All Read
            </h4>
          </div>

          {notification.map((notificationMsg, index) => (
            <div
              key={index}
              className="card"
              onClick={navigate(notificationMsg.onClickPath)}
              style={{cursor:"pointer"}}
            >
              <div className="card-text">
                {notificationMsg.message}
              </div>
            </div>
          ))}
        </>
      ),
    },
    {
      key: "1",
      label: "Read",
      children: (
        <>
          <div className="d-flex justify-content-end">
            <h4 className="p-2" onClick={handleDeleteAllRead}>
              Delete All Read
            </h4>
          </div>
          {seenNotification.map((notificationMsg, index) => (
              <div
                key={index}
                className="card"
                onClick={navigate(notificationMsg.onClickPath)}
                style={{cursor:"pointer"}}
              >
                <div className="card-text">
                  {notificationMsg.message}
                </div>
              </div>
          ))}
        </>
      ),
    },
  ];
  return (
    <Layout>
      <h4 className='p-3 text-center'>Notifications</h4>
      <Tabs defaultActiveKey="0" items={tabItems} />
    </Layout>
  )
}

export default Notification