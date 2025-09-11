import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../auth/authSlice.js";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../constants.js";

export const useCheckAuth = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const checkAuth = async(path) => {

    try {
      const response = await axios.get(`${SERVER}/user/auth`, {
          withCredentials: true
      });

      if (response.data.success) {
        dispatch(loginSuccess({
          user:response.data?.user,
          token: response.data?.user?.accessToken
         }))
      }

  } catch (error) {
      console.error('Failed to fetch user details:', error);
      navigate(`${path}`)
  }
  
}

return checkAuth;
}