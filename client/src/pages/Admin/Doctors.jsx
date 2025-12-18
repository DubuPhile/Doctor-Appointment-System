import { useEffect, useState } from "react"
import Layout from "../../components/Layout"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { Table } from "antd";


const Doctors = () => {

  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [ doctors, setDoctors ] = useState([]);

  useEffect(() =>{
    let isMounted = true

    if(!auth?.accessToken) return;
    const getDoctors = async() => {
      
      try{
        const res = await axiosPrivate.get('/admin/getAllDoctors')
        if(isMounted && res.data?.success){
          setDoctors(res.data.data);
        }
      } catch(err){
        console.log(err)
      }
    }
    
    getDoctors();

    return () => {
      isMounted = false
    }
  },[auth?.accessToken, axiosPrivate])

  const columns = [
    {
      title: 'Users',
      dataIndex: 'user',
      render: ( text, record ) => (
        <span>{record.firstName} {record.lastName}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          {record.status === 'pending' 
            ? <button className="btn btn-success">Approve</button> 
            : <button className="btn btn-danger">Reject</button>}
        </div>
      )
    },
  ]

  return (
    <Layout>
        <h1 className="text-center">All Doctors</h1>
        <br/>
        <Table columns={columns} dataSource={doctors} rowKey={'_id'}/>
    </Layout>
  )
}

export default Doctors