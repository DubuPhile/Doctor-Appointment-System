import Layout from "../components/Layout"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import {useUserInfo} from "../hooks/useUserInfo"
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import { useEffect, useState } from "react"
import dayjs from 'dayjs';
import { useParams } from "react-router-dom";
import { DatePicker, TimePicker } from "antd";
import {message} from 'antd';
import { confirmAction } from "../components/Confirmation";

const BookingPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const {userId, userInfo} = useUserInfo();
  const param = useParams();
  const dispatch = useDispatch();
  const {doctorId} = param

  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);

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

      if (!isAvailable) {
        return message.warning("Please check availability first");
      }
      try{
        if(!date && !time) {
          return alert ('Date & Time Required');
        }
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
        if(err.response?.status === 409){
          message.error("Time slot already booked")
        }
        console.log(err)
      }
    }
    const handleAvailability = async(e) => {
      e.preventDefault();
      if (!date || !time) {
        return message.warning("Please select date and time");
      }
      try {
        const res = await axiosPrivate.post('/user/book-availability', { doctorId, date, time })
        
        if (res.data.message === "Doctor is not available at this time" ) {
          setIsAvailable(false);
          message.warning(res.data.message);
          return;
        }
        if (res.data.message === "Time slot already booked" ) {
          setIsAvailable(false);
          message.warning(res.data.message);
          return;
        }
        if(res.data.success){
          setIsAvailable(true)
          message.success(res.data.message)
        } else {
          message.error(res.data.message)
        }
      } catch(err){
        console.log(err)
        if (err.response?.status === 400){
          message.error(err.response.data.message)
        }
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
              <div className="d-flex flex-column bookpageDateTime">
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
                  onClick={handleAvailability}
                >
                  Check Availability
                </button>
                <button 
                className="btn btn-success mt-2"
                onClick={() => 
                  confirmAction({
                    title: "Are you sure for the Schedule?",
                    content: "This will be submitted to the Doctor.",
                    onOk: () =>handleBooking()
                  })
                }
                disabled = {!isAvailable}
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