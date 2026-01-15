import { useEffect, useState } from 'react';
import Layout from '../../components/Layout'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Col, Form, Row, Input, TimePicker, message } from 'antd'
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../../redux/features/alertSlice'
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const Profile = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [doctor , setDoctor] = useState(null);
    const param = useParams();
    useEffect(() => {
        let isMounted = true
        const getDoctorsInfo = async() => {
            
            try{
                const res = await axiosPrivate.post('/doctor/getDoctorInfo', {
                    userId: param.id
                })
                if(res.data.success && isMounted){
                    const timings = res.data.data.timings?.map(t => dayjs(t));
                    setDoctor({...res.data.data, timings})
                }
            } catch(err){
                console.log(err)
            }
        }
        getDoctorsInfo();
        return () => {isMounted = false}
    },[])

    const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const { data } = await axiosPrivate.put("/doctor/updateProfile", {
        ...values,
        timings: values.timings.map(t => dayjs(t)), 
        userId: param.id,
      });
      message.success(data.message);
      navigate('/home');
      dispatch(hideLoading());

    } catch (error) {
      dispatch(hideLoading());
      console.log(error)
        message.error("Error to edit Profile Account");
      }
    }
  
  return (
    <Layout>
        <h1>Manage Profile</h1>
        {doctor && (
        <Form layout="vertical" onFinish = {handleFinish} className="m-5" initialValues={doctor}>
          <h6 className="mb-3">Personal Information:</h6>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item 
                label = "First Name" 
                name = "firstName" 
                required rules={[{required:true}]}
              >
                <Input type="text" placeholder="Your First Name"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item 
                label = "Last Name" 
                name = "lastName" 
                required rules={[{required:true}]}
              >
                <Input type="text" placeholder="Your Last Name"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item 
                label = "Phone Number" 
                name = "phone" 
                required rules={[{required:true}]}
              >
                <Input type="text" placeholder="Your Contact Number"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item 
                label = "Email" 
                name = "email" 
                required rules={[{required:true}]}
              >
                <Input type="text" placeholder="Your Email Address"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item 
                label = "Address" 
                name = "address" 
                required rules={[{required:true}]}
              >
                <Input type="text" placeholder="Your Home Address"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item 
                label = "Website" 
                name = "website" 
                required rules={[{required:true}]}
              >
                <Input type="text" placeholder="Your Home Website"/>
              </Form.Item>

            </Col>
          </Row>
          <h6 className="mt-5 mb-3">Professional Information:</h6>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item 
                label = "Specialization" 
                name = "specialization" 
                required rules={[{required:true}]}
              >
                <Input type="text" placeholder="Your Specialization"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item 
                label = "Experience" 
                name = "experience" 
                required rules={[{required:true}]}
              >
                <Input type="text" placeholder="Your Experience"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item 
                label = "Fees Per Consultation" 
                name = "feesPerConsultation" 
                required rules={[{required:true}]}
              >
                <Input type="number" placeholder="Your Fees per Cunsaltation"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item 
                label = "Timings" 
                name = "timings" 
                required
              >
                <TimePicker.RangePicker format="HH:mm"/>
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}></Col>
            <Col xs={24} md={24} lg={8}>
              <button className="text-center btn btn-primary form-btn" type="submit">Update</button>
            </Col>
          </Row>
          
        </Form>
        )}
    </Layout>
  )
}

export default Profile