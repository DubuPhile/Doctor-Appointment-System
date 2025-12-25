import Layout from "../components/Layout"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import {useUserInfo} from "../components/useUserInfo"
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import { useEffect, useState } from "react"
import dayjs from 'dayjs';
import { useParams } from "react-router-dom";
import { DatePicker, TimePicker } from "antd";
import {message} from 'antd';

const BookingPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const {userId, userInfo} = useUserInfo();
  const param = useParams();
  const dispatch = useDispatch();
  const {doctorId} = param

  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState();

  useEffect(() => {
    let isMounted = true
    const getDoctorsData = async() => {
      try {
        const res = await axiosPrivate.get('/doctor/getDoctorId', {params: { doctorId } })
        if(isMounted && res.data.success){
          const doctorsWithTimings = {...res.data.data,
          timings: Array.isArray (res.data.data.timings) 
            ? res.data.data.timings?.map(t => dayjs(t).format('HH:mm')) 
            : [],
          };
        
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

    const handleBooking = async() => {
      try{
        dispatch(showLoading())
        const res = await axiosPrivate.post('/user/book-appointment', 
          {
            doctorId: doctorId,
            userId: userId,
            doctorInfo: doctors,
            userInfo: userInfo,
            date: date,
            time: time,
          }
        )
        dispatch(hideLoading())
        if(res.data.success){
          message.success(res.data.message)
        }
      } catch(err){
        dispatch(hideLoading())
        console.log(err)
      }
    }
    
  return (
    <Layout>
        <h3 className="text-center">Booking Page</h3>
        <div className="container m-2">
          {doctors && (
            <div>
              <h4>Dr. {doctors.firstName +" "+ doctors.lastName}</h4>
              <h4>Fees : {doctors.feesPerConsultation}</h4>
              <h4>Time : {doctors.timings?.[0]+" - "+doctors.timings?.[1]}</h4>
              <div className="d-flex flex-column w-25">
                <DatePicker 
                  className="m-2"
                  format={"DD-MM-YYYY"} 
                  onChange={(value) => setDate(dayjs(value).format("DD-MM-YYYY"))}
                />
                <TimePicker 
                  className="m-2"
                  format={"HH:mm"} 
                  onChange={(value) => setTime( dayjs(value).format("HH:mm") )}
                />
                <div className="d-flex flex-row justify-content-between">
                <button 
                  className="btn btn-primary mt-2"
                >
                  Check Availability
                </button>
                <button 
                className="btn btn-success mt-2"
                onClick={handleBooking}
                >
                  Book Now!
                </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </Layout>
  )
}

export default BookingPage