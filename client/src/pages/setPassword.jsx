
import { Form, Input } from "antd";
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from '../api/axios'
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import { useUserInfo } from "../hooks/useUserInfo";

const PWD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const setPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {userId} = useUserInfo();

    const onFinishHandler = async (values) => {
        delete values.confirmPassword;
        const password = values.password
        try{
        dispatch(showLoading())
        const res = await axios.post('/auth/set-password', 
            {userId, password},{
            headers: {'Content-Type': 'application/json'},
            withCredentials: true,
            }
        );
        dispatch(hideLoading())
        
        if(res.data.success){
            message.success('Set Password Successfully')
            navigate('/home')
        } 
    
        } catch(err){
        dispatch(hideLoading())
        if(!err?.response) {
            message.error('No response from Server');
        }

        else {
            message.error('Set Password Failed');
        }
        }
    }
  return (
    <>
    <section>
        <div className="setPassword">
        <Form layout="vertical" onFinish={onFinishHandler}>
            {/* Hidden username/email field for accessibility */}
            <Form.Item
                name="username"
                style={{ display: "none" }} // hides the input
                >
                <Input autoComplete="username" />
            </Form.Item>
            <h3 className='setPassword-h3'>Set Password</h3>
            <Form.Item 
                label = {<span className="custom-color">Password</span>} 
                name="password" rules={[
                {required: true, message: 'Enter your Password'},
                { pattern: PWD_REGEX, message: 'Password must be 8-24 chars, include upper, lower, number & special char (!@#$%)' }
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
                { pattern: PWD_REGEX, message: 'Password must be 8-24 chars, include upper, lower, number & special char (!@#$%)' },
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
            <div className='register-btn d-flex justify-content-center'>
                <button className="btn btn-primary" type="submit">Confirm</button>
            </div>
        </Form>
        </div>
    </section>
    </>
  )
  
}

export default setPassword