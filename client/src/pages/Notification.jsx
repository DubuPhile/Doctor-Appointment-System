import Layout from '../components/Layout'
import { Button, Tabs, Empty, Modal } from 'antd'
import { useNavigate } from 'react-router-dom';
import useNotif from '../hooks/useNotif';
import dayjs from 'dayjs';

const Notification = () => {
  const {
    read, 
    unread, 
    markAllAsRead, 
    deleteRead,
    openNotification, 
    selectedNotification, 
    setSelectedNotification
  } = useNotif();
  
  const tabItems = [
    {
      key: "0",
      label: `Unread(${unread.length})`,
      children: (
        <>
          <div className="d-flex justify-content-end">
            <Button className="p-2" onClick={markAllAsRead} disabled={!unread.length} style={{cursor: "pointer"}}>
              Mark All Read
            </Button>
          </div>

          {unread.length === 0 ? (
            <Empty description="No unread notifications" />
          ) : (
            [...unread]
              .reverse()
              .map((notification) => (
                <div
                  key={notification._id}
                  className="card mb-2 fw-bold"
                  onClick={() => openNotification(notification)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-start me-3">
                    <div className="card-text">
                      &#9993;{notification.message}
                    </div>
                    <small className="text-muted">
                      {dayjs(notification.createdAt).format("MMM DD, YYYY hh:mm A")}
                    </small>
                  </div>
                </div>
              ))
          )}
        </>
      ),
    },
    {
      key: "1",
      label: `Read(${read.length})`,
      children: (
        <>
          <div className="d-flex justify-content-end">
            <Button className="p-2" onClick={deleteRead} disabled={!read.length}>
              Delete All Read
            </Button>
          </div>
          {read.length === 0 ? (
            <Empty description="No read notifications" />
          ) : (
            [...read]
              .reverse()
              .map((notification) => (
                <div
                  key={notification._id}
                  className="card mb-2 opacity-75 "
                  onClick={() => openNotification(notification)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-start me-3">
                    <div className="card-text">
                      &#9993;{notification.message}
                    </div>
                    <small className="text-muted">
                      {dayjs(notification.createdAt).format("MMM DD, YYYY hh:mm A")}
                    </small>
                  </div>
                </div>
              ))
          )}
        </>
      ),
    },
  ];
  return (
    <Layout>
      <h4 className='p-3 text-center'>Notifications</h4>
      <Tabs defaultActiveKey="0" items={tabItems} />
      <Modal
        open={!!selectedNotification}
        title={`${selectedNotification?.from}`}
        onCancel={() => setSelectedNotification(null)}
        footer={null}
      >
        <p>{selectedNotification?.message}</p>
        {selectedNotification?.createdAt && (
          <small className="text-muted">
            {dayjs(selectedNotification.createdAt).format("MMM DD, YYYY hh:mm A")}
          </small>
        )}
      </Modal>
    </Layout>
  )
}

export default Notification