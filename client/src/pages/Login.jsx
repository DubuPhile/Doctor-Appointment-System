import '../styles/loginStyles.css';
import { Form, Input } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios'
import { message } from 'antd';
import { useRef, useState,useEffect } from 'react';
import useAuth from '../hooks/useAuth'
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';


const Login = () => {
  const { setAuth } = useAuth();

  const userRef = useRef();

  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if(userRef.current){
    userRef.current.focus();
    }
  },[])

  const onFinishHandler = async(e) => {
    
    try{
      dispatch(showLoading())
      const res = await axios.post('/login', 
        {user, password},
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true,
        }
      );
      dispatch(hideLoading())
      if(res.status === 200){
        message.success('Login Successfully')
        const accessToken = res?.data.accessToken;
        setAuth({ user, accessToken})
        setUser('');
        setPassword('');
        navigate('/home')
      } 
    } catch(err){
      dispatch(hideLoading())
      if(!err?.response) {
        message.error('No response from Server');  
      }
      else if (err.response?.status === 400){
        message.error('Missing Username and Password');
      }
      else if (err.response?.status === 401){
        message.error('Unauthorized');
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
              value={password}
              onChange ={ (e) => setPassword(e.target.value)}
            />
          </Form.Item>
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