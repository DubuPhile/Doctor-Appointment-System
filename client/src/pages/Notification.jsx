import Layout from '../components/Layout'
import { Button, Tabs } from 'antd'
import { useNavigate } from 'react-router-dom';
import useNotif from '../hooks/useNotif';

const Notification = () => {
  const {notification, markAllAsRead, seenNotification, DeleteAllNotification} = useNotif();
  const navigate = useNavigate();
  
  const tabItems = [
    {
      key: "0",
      label: "Unread",
      children: (
        <>
          <div className="d-flex justify-content-end">
            <Button className="p-2" onClick={markAllAsRead} style={{cursor: "pointer"}}>
              Mark All Read
            </Button>
          </div>

          {[...notification].reverse().map((notificationMsg, index) => (
            <div
              key={index}
              className="card"
              onClick={() => navigate(notificationMsg.data.path)}
              style={{cursor:"pointer"}}
            >
              <div className="card-text">
                &#9993;{notificationMsg.message}
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
            <Button className="p-2" onClick={DeleteAllNotification}>
              Delete All Read
            </Button>
          </div>
          {seenNotification.map((notificationMsg, index) => (
              <div
                key={index}
                className="card"
                onClick={() => {navigate(notificationMsg.data.path)}}
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