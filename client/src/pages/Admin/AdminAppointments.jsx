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
    const [sortedInfo, setSortedInfo] = useState({})
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
            key:'_id',
            render: (text) =>
            isMobile ? `...${text.substring(text.length - 3)}` : text,
        },
        {   
            dataIndex:'patient',
            key:'patient',
            title:(<span
                style={{cursor: 'pointer', userSelect: 'none'}}
                onClick={() => setSortedInfo(prev => ({
                    columnKey: 'patient',
                    order: prev.order === 'ascend' ? 'descend' : 'ascend'
                }))
                }
                >
                Patient{sortedInfo.columnKey === 'patient' && 
                    (sortedInfo.order === 'ascend' ? ' ⬆️' : ' ⬇️')}
                </span>
            ),
            sorter: (a,b) => 
                (a?.userInfo?.user || '').localeCompare(b?.userInfo?.user || '')
            ,
            sortOrder: sortedInfo.columnKey === 'patient' && sortedInfo.order,
            showSorterTooltip: false,
            render: (text, record) => {
                return(
                    <span>
                        {record?.userInfo?.user ?? "unknown"}
                    </span>
                )
            }
        },
        {   
            dataIndex:'doctor',
            key: 'doctor',
            title:(
                <span
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() =>
                    setSortedInfo(prev => ({
                    columnKey: 'doctor',
                    order: prev.order === 'ascend' ? 'descend' : 'ascend'
                    }))
                }
                >
                Doctor
                {sortedInfo.columnKey === 'doctor' &&
                    (sortedInfo.order === 'ascend' ? ' ⬆️' : ' ⬇️')}
                </span>
            ),
            sorter: (a, b) => {
                const nameA = `${a?.doctorInfo?.firstName || ''} ${a?.doctorInfo?.lastName || ''}`;
                const nameB = `${b?.doctorInfo?.firstName || ''} ${b?.doctorInfo?.lastName || ''}`;

                return nameA.localeCompare(nameB);
            },
            sortOrder: sortedInfo.columnKey === 'doctor' && sortedInfo.order,
            showSorterTooltip: false,
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
            key: 'phone',
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