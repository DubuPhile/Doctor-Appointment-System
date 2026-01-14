import Layout from "../components/Layout"
import { useState, useEffect } from "react"
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useUserInfo } from "../hooks/useUserInfo"
import dayjs from 'dayjs'
import { Table } from "antd"
import { message } from "antd";
import useMediaQuery from "../hooks/useMediaQuery";

const Appointments = () => {
    const {userId, isDoctor} = useUserInfo();
    const [Appointments, setAppointments] = useState([]);
    const [sortedInfo, setSortedInfo] = useState({})
    const isMobile = useMediaQuery("(max-width: 768px)");
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();
    const getAppointments = async() => {      
        try{
            const res = await axiosPrivate.get(
                !isDoctor 
                ? '/user/user-appointments' 
                : '/doctor/doctor-appointments', {params:{ userId }})
            if(res.data.success){
                setAppointments(res.data.data)
            }
        }catch (err){
            console.log(err)
        }
    }

    useEffect(() => {
        getAppointments();
    },[])

    const handleStatus = async(record , status) => {
        try{
            dispatch(showLoading())
            const res = await axiosPrivate.post ('/doctor/update-status', {appointmentsId: record._id, status});
            if(res.data.success){
                message.success(res.data.message);
                getAppointments();
            }
        } catch(err){
            dispatch(hideLoading())
            console.log(err)
            message.error('Handle Status Error')
        } finally {
            dispatch(hideLoading())
        }
    }
    const columns = [
        {
            title:'ID',
            dataIndex:'_id',
            render: (text) =>
            isMobile ? `...${text.substring(text.length - 3)}` : text,
        },
        {
            title:'Doctor',
            dataIndex:'doctor',
            render: (text, record) => {
                return(
                    <span>
                        {record?.doctorInfo
                            ? `${record.doctorInfo.firstName} ${record.doctorInfo.lastName}`
                            : "N/A"}
                    </span>
                )
            }
        },
        {
            title:'Contact',
            dataIndex:'phone',
            render: (text, record) => {
                const phone = record?.doctorInfo?.phone || "";

                return(
                <span>
                    {isMobile && phone.length > 4
                        ? `...${phone.substring(phone.length - 4)}`
                        : phone}
                </span>
                )
            }
        },
        {   
            dataIndex:'datetime',
            key: 'datetime',
            title: (
                <span
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() =>
                    setSortedInfo(prev => ({
                    columnKey: 'datetime',
                    order: prev.order === 'ascend' ? 'descend' : 'ascend'
                    }))
                }
                >
                Date & Time
                {sortedInfo.columnKey === 'datetime' &&
                    (sortedInfo.order === 'ascend' ? ' ⬆️' : ' ⬇️')}
                </span>
            ),
            sorter: (a, b) => {
                const dateTimeA = dayjs(a.date).hour(dayjs(a.time).hour()).minute(dayjs(a.time).minute()).second(dayjs(a.time).second());
                const dateTimeB = dayjs(b.date).hour(dayjs(b.time).hour()).minute(dayjs(b.time).minute()).second(dayjs(b.time).second());
                    return dateTimeA.valueOf() - dateTimeB.valueOf();
            },
            sortOrder: sortedInfo.columnKey === 'datetime' && sortedInfo.order,
            showSorterTooltip: false,
            render: (text, record) => {
                const hasDate = record?.date;
                const hasTime = record?.time;
                if (!hasDate && !hasTime) {
                    return <span>—</span>; 
                }
                return(
                    <span>
                        {dayjs(record.date).format('DD-MM-YYYY')} &nbsp;
                        {dayjs(record.time).format('hh:mm A')}
                    </span>
                )
            }
        },
        {
            title:'Status',
            dataIndex:'status',
        },
        (isDoctor 
        ? 
        {
            title: "Action",
            dataIndex: "actions",
            render: (text, record) => (
                <>
                    {record.status === "pending" && (
                        <div className="d-flex">
                            <button 
                                className="btn btn-success ms-2"
                                onClick={() => handleStatus(record,'approved')}
                            >Approved
                            </button>
                            <button 
                                className="btn btn-danger ms-2"
                                onClick={() => handleStatus(record,'rejected')}
                            >Reject
                            </button>
                        </div>
                    )}
                </>
            )
        } : []),
    ];
  return (
    <Layout>
        <h1 className="p-3">Appointments</h1>
        <Table 
            className="AppointmentsTable" 
            columns={columns} 
            dataSource={Appointments} 
            rowKey={(record) => record._id}
            scroll={{ x: true }}
        />
    </Layout>
  )
}

export default Appointments