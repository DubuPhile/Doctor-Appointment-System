import Layout from "../components/Layout"
import { useState, useEffect } from "react"
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useUserInfo } from "../components/useUserInfo"
import dayjs from 'dayjs'
import { Table } from "antd"
import { message } from "antd";
import useMediaQuery from "../hooks/useMediaQuery";

const Appointments = () => {
    const {userId, isDoctor} = useUserInfo();
    const [Appointments, setAppointments] = useState([]);
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
                        {record.doctorInfo.firstName + " " + record.doctorInfo.lastName}
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
            title:'Date & Time',
            dataIndex:'Date',
            render: (text, record) => {
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
        <Table className="AppointmentsTable" columns={columns} dataSource={Appointments} rowKey={(record) => record._id}/>
    </Layout>
  )
}

export default Appointments