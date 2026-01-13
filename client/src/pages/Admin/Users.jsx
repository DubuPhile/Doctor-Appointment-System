import { useEffect, useState } from "react"
import Layout from "../../components/Layout"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { Table } from "antd";

const Users = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [ users, setUsers ] = useState([]);

  useEffect(() =>{
    let isMounted = true

    if(!auth?.accessToken) return;
    const getUsers = async() => {
      
      try{
        const res = await axiosPrivate.get('/admin/getAllUsers')
        if(isMounted && res.data?.success){
          setUsers(res.data.data);
        }
      } catch(err){
        console.log(err)
      }
    }
    
    getUsers();

    return () => {
      isMounted = false
    }
  },[auth?.accessToken, axiosPrivate])

  //ant table column
  const columns = [
    {
      title: 'Users',
      dataIndex: 'user',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Doctor',
      dataIndex: 'isDoctor',
      render: ( text , record ) => (
        <span>{record.isDoctor === true ? 'Yes' : 'No' }</span>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: ( text , record ) => (
        <div className="d-flex">
          {!Object.values(record.roles).includes(5150) && (
          <button className="btn btn-danger">Block</button>)}
        </div>
      )
    },
  ]

  return (
    <Layout>
        <h1 className="text-center">Users Lists</h1>
        <br/>
        <Table columns={columns} dataSource={users} rowKey={'_id'}/>
    </Layout>
  )
}

export default Users