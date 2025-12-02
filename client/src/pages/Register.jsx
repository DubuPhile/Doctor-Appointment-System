import '../styles/registerStyles.css';
import { Form, Input } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from '../api/axios'

const Register = () => {

  const navigate = useNavigate();

  const onFinishHandler = async (values) => {
    delete values.confirmPassword;
    try{
      const res = await axios.post('/register', 
        JSON.stringify(values),{
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        }
      );
      if(res.data.success){
        message.success('Register Successfully')
        navigate('/login')
      } else {
        message.error(res.data.message);
      }

    } catch(err){
      console.error(err.message)
    }
  }

  return (
    <>
      <section>
      <div className="regform-container">
        <Form layout="vertical" onFinish={onFinishHandler}>
          <h3>Register Form</h3>
          <div>
            <Form.Item label ={<span className="custom-color">Username</span>} name="user">
              <Input type= "text" required autoComplete='username'/>
            </Form.Item>
            <Form.Item label ={<span className="custom-color">Email</span>} name="email">
              <Input type= "email" required />
            </Form.Item>
            <Form.Item 
              label = {<span className="custom-color">Password</span>} 
              name="password" rules={[
                {required: true, message: 'Enter your Password'}
              ]} 
              hasFeedback 
            >
              <Input.Password placeholder='Enter your Password' autoComplete='new-password'/>
            </Form.Item>
            <Form.Item 
              label ={<span className="custom-color">Confirm Password</span>}
              name= "confirmPassword" 
              dependencies={['password']}
              hasFeedback
              rules={[
                {required: true, message:'Please confirm your password'},
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder='Confirm password' autoComplete='new-password' />
            </Form.Item>
          </div>
          <div className='register-btn'>
            <button className="btn btn-primary" type="submit">Register</button>
            <Link to ="/login" className='m-2'>Already Have Account?</Link>
          </div>
        </Form>
      </div>
      </section>
    </>
  )
}

export default Register