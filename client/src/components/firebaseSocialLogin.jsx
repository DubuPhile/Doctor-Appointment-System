import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../hooks/firebase";
import axios from "../api/axios";
import { message, Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const FirebaseSocialLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSocialLogin = async (provider) => {
    try {
      dispatch(showLoading());

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      // Send Firebase token to backend
      const res = await axios.post(
        "/auth/firebase",
        { token },
        { withCredentials: true }
      );

      dispatch(hideLoading());

      setAuth({
        user: user.displayName,
        accessToken: res.data.accessToken,
      });
      
      message.success("Logged in successfully!");
      await res.data.hasLocalPassword === false ? navigate("/set-password") : navigate("/home");
      
    } catch (err) {
      dispatch(hideLoading());
      console.error(err);
      message.error("Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <button
        type="primary"
        className="firebaseLogin"
        icon={<GoogleOutlined />}
        onClick={() => handleSocialLogin(googleProvider)}
      >
        <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
            alt="Google Logo"
            style={{ width: 20, height: 20 }}
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default FirebaseSocialLogin;
