import '../styles/loginStyles.css';
import { Form, Input } from "antd";
import { Link } from 'react-router-dom';

const Login = () => {

  const onFinishHandler = (values) => {
    delete values.confirmPassword;
    console.log(values)
  }

  return (
    <>
      <section>
      <div className="logform-container">
        <Form layout="vertical" onFinish={onFinishHandler}>
          <h2>Sign in</h2>
          <Form.Item label ={<span className="custom-color">Name</span>} name="name">
            <Input type= "text" required/>
          </Form.Item>
          <Form.Item 
            label = {<span className="custom-color">Password</span>} 
            name="password"
          >
            <Input.Password placeholder='Enter your Password' required/>
          </Form.Item>
          <div className='register-btn'>
            <button className="btn btn-primary" type="submit">Sign-in</button>
            <Link to ="/register" className='m-2'>Don't Have Account?</Link>
          </div>
        </Form>
      </div>
      </section>
    </>
  )
}

export default Login