import Layout from "../components/Layout"
import { Col, Form, Row, Input, TimePicker, message } from 'antd'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { showLoading, hideLoading } from "../redux/features/alertSlice"
import { useUserInfo } from "../components/useUserInfo"
import useAuth from "../hooks/useAuth"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useState } from "react"

const ApplyDoctor = () => {
  const axiosPrivate = useAxiosPrivate();
  const [form, setForm] = useState([]);

  //handle form
  const handleFinish = async (values) => {
    try {
      const { data } = await axiosPrivate.post("/apply-doctor", {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        website: values.website,
        specialization: values.specialization,
        experience: values.experience,
        feesPerConsultation: values.feesPerConsultation,
        timings: values.timings.map(time => time.toDate()), 
      });

      message.success(data.message);

    } catch (error) {
      console.error("Apply doctor error:", error);
      alert("Error applying for doctor account.");
    }
  }
  return (
    <Layout>
        <h1 className="text-center">Apply Doctor</h1>
        <Form layout="vertical" onFinish = {handleFinish} className="m-5">
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
              <button className="d-flex justify-end btn btn-primary form-btn" type="submit">Submit</button>
            </Col>
          </Row>
          
        </Form>
    </Layout>
  )
}

export default ApplyDoctor