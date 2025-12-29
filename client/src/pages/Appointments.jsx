import Layout from "../components/Layout"
import { useState, useEffect } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useUserInfo } from "../components/useUserInfo"
import dayjs from 'dayjs'
import { Table } from "antd"

const Appointments = () => {
    const {userId, isDoctor} = useUserInfo();
    const [Appointments, setAppointments] = useState([]);
    const axiosPrivate = useAxiosPrivate();
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

    const handleStatus = () => {

    }
    const columns = [
        {
            title:'ID',
            dataIndex:'_id',
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
                return(
                <span>
                    {record.doctorInfo.phone}
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
                                onClick={() => handleStatus(record,'reject')}
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
        <Table columns={columns} dataSource={Appointments}/>
    </Layout>
  )
}

export default Appointments