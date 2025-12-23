import { Row } from "antd";
import Layout from "../components/Layout"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useEffect, useState } from "react"
import DoctorList from "../components/DoctorList";
import dayjs from 'dayjs';

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    let isMounted = true
    const getDoctorsData = async() => {
      try {
        const res = await axiosPrivate.get('/user/getApprovedDoctors')
        if(isMounted && res.data.success){
          const doctorsWithTimings = res.data.data.map(doctor => ({
          ...doctor,
          timings: doctor.timings?.map(t => dayjs(t)) || [],
          }));
        
        setDoctors(doctorsWithTimings);
        }
        
      } catch (err) {
      console.log(err);
      }
    };
    getDoctorsData();
    return () => {
      isMounted = false
    }
  },[])
  return (
    <Layout>
      <h1 className="text-center">Home</h1>
      <Row>
        {doctors && doctors.map(doctor => (
          <DoctorList doctor = {doctor} key={doctor.userId}/>
        ))}
      </Row>
    </Layout>
  )
}

export default Home