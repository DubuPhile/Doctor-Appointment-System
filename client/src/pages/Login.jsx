import '../styles/loginStyles.css';
import { Form, Input } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios'
import { message } from 'antd';
import { useRef, useState,useEffect } from 'react';
import useAuth from '../hooks/useAuth'
import FirebaseSocialLogin from '../components/firebaseSocialLogin';


const Login = () => {
  const { setAuth } = useAuth();

  const userRef = useRef();

  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if(userRef.current){
    userRef.current.focus();
    }
  },[])

  const onFinishHandler = async(e) => {
    
    try{
    
      const res = await axios.post('/login', 
        {user, password},
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        }
      );
      
      if(res.status === 200){
        message.success('Login Successfully')
        const accessToken = res?.data.accessToken;
        setAuth({ user, accessToken})
        setUser('');
        setPassword('');
        navigate('/home')
      } 
    } catch(err){
      
      if(!err?.response) {
        message.error('No response from Server');  
      }
      else if (err.response?.status === 400){
        message.error('Missing Username and Password');
      }
      else if (err.response?.status === 401){
        message.error('Unauthorized');
      }
      else if (err.response?.status === 403){
        message.error(err.response?.data.message);
      }
      else {
        message.error('Log-in Failed');
      }
    }
  }

  return (
    <>
      <section>
      <div className="logform-container">
        <Form layout="vertical" onFinish={onFinishHandler}>
          <h2 className='login-h2'>Sign in</h2>
          <Form.Item label ={<span className="custom-color">Username</span>} name="user">
            <Input type= "text" 
            required 
            autoComplete='username'
            value={user}
            style={{backgroundColor: "rgba(22, 22, 22, 0.4)"}}
            onChange ={ (e) => setUser(e.target.value)}
            />
          </Form.Item>
          <Form.Item 
            label = {<span className="custom-color">Password</span>} 
            name="password"
          >
            <Input.Password 
              placeholder='Enter your Password' 
              autoComplete='current-password' 
              required
              style={{backgroundColor: "rgba(22, 22, 22, 0.4)"}}
              value={password}
              onChange ={ (e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <FirebaseSocialLogin />

          <div className='login-btn'>
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