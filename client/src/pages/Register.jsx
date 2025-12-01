import '../styles/registerStyles.css';
import { Form, Input } from "antd";
import { Link } from 'react-router-dom';

const Register = () => {

  const onFinishHandler = (values) => {
    delete values.confirmPassword;
    console.log(values)
  }

  return (
    <>
      <section>
      <div className="regform-container">
        <Form layout="vertical" onFinish={onFinishHandler}>
          <h3>Register Form</h3>
          <div>
            <Form.Item label ={<span className="custom-color">Name</span>} name="name">
              <Input type= "text" required/>
            </Form.Item>
            <Form.Item label ={<span className="custom-color">Email</span>} name="email">
              <Input type= "email" required/>
            </Form.Item>
            <Form.Item 
              label = {<span className="custom-color">Password</span>} 
              name="password" rules={[
                {required: true, message: 'Enter your Password'}
              ]} 
              hasFeedback 
            >
              <Input.Password placeholder='Enter your Password'/>
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
              <Input.Password placeholder='Confirm password' required/>
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