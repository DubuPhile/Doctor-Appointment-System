import { useEffect, useState } from "react"
import Layout from "../../components/Layout"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { Table, message } from "antd";
import Spinner from "../../components/Spinner";


const Doctors = () => {

  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [ doctors, setDoctors ] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally{
        if(isMounted) setIsLoading(false)
      }
    }
    
    getDoctors();

    return () => {
      isMounted = false
    }
  },[axiosPrivate, auth?.accessToken, isLoading])

  
  const handleAccountStatus = async( record, status ) => {
    setIsLoading(true)
    try{
      const res = await axiosPrivate.put('/admin/changeAccountStatus', {doctorsId: record._id, status: status})
  
      if(res.data.success){
        message.success(res.data.message);
      }
    } catch(err){
      console.log(err)
      message.error('Something went Wrong!')
    } finally{
      setIsLoading(false)
    }
  }

  const handleRemove = async(record) => {
    setIsLoading(true)
    try{
      const res = await axiosPrivate.delete('/admin/removeDoctor', {data: {doctorsId: record.userId}})

      if(res.status === 204){
        message.success("Remove SuccessFully!")
      }
      setDoctors(prev => prev.filter(doc => doc.userId !== record.userId));
    } catch(err){
      console.log(err)
      message.error('Cannot remove at this time!');
    } finally{
      setIsLoading(false)
    }
  }
  
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
          {
          record.status === 'pending' 
            ? <button className="btn btn-success" onClick={() => handleAccountStatus(record, 'approved')}>Approve</button> 
            : <button className="btn btn-danger" onClick={() => handleRemove(record)}>Remove</button>
          }
        </div>
      )
    },
  ]

  return (
    <Layout>
        {isLoading ? (<Spinner />) : (
        <>
          <h1 className="text-center">All Doctors</h1>
          <br/>
          <Table columns={columns} dataSource={doctors} rowKey={record => record._id}/>
        </>
        )}
    </Layout>
  )
}

export default Doctors