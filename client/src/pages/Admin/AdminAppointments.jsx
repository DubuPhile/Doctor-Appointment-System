import Layout from "../../components/Layout"
import { useState, useEffect } from "react"
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../../redux/features/alertSlice';
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import dayjs from 'dayjs'
import { Table, message } from "antd"
import useMediaQuery from "../../hooks/useMediaQuery";

const Appointments = () => {
    const [Appointments, setAppointments] = useState([]);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();
    const getAppointments = async() => {     
        try{
            const res = await axiosPrivate.get(
                 '/admin/getAllAppointments')
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

    const handleDelete = async(record) => {
        try {
            dispatch(showLoading())
            const res = await axiosPrivate.delete('/admin/delete-appointment', {data: {appointmentsId: record._id}})
            dispatch(hideLoading())
            if(res.status === 204){
                message.success(res.data.message || "Delete Successfully!");
                getAppointments();
            }
        } catch(err) {
            console.log(err)
            dispatch(hideLoading())
            message.error(err?.response?.data?.message || "Something went wrong!");
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
            title:'Patient',
            dataIndex:'patient',
            render: (text, record) => {
                return(
                    <span>
                        {record?.userInfo?.user ?? "unknown"}
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
        {
            title:'Action',
            dataIndex:'action',
             render: (text, record) => (
                
                <div className="d-flex">
                    <button 
                        className="btn btn-danger ms-2"
                        onClick={() => handleDelete(record)}
                    >Delete
                    </button>
                </div>
            )
        },
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