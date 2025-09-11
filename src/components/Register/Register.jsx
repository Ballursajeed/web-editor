import  { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginStart,loginSuccess } from '../../auth/authSlice.js';
import './Register.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Loading from '../Loader/Loader.jsx';
import { SERVER } from '../../constants.js';

const Register = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [fullName, setFullname] = useState('')
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);  


    const dispatch = useDispatch()
    const navigate = useNavigate();

    const hangleSubmit = async(e) => {
      e.preventDefault()
      setLoading(true);
       try {
        const formData = new FormData();
         formData.append("email",email)
         formData.append("username",username)
         formData.append("fullName",fullName)
         formData.append("password",password)
         
         
         const res = await axios.post(`${SERVER}/user/register`,{
          email,
          username,
          fullName,
          password
         });
 
       if (res.data.success) {
        dispatch(loginStart())
        
        toast.success('Registered Successfully!', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: async () => {  
           
            const loginRes = await axios.post(`${SERVER}/user/login`, {
                username,
                password
            }, { withCredentials: true });

            if (loginRes.data.success) {
              
              dispatch(loginSuccess({
                     user: loginRes.data.user,
                     token: loginRes.data.accessToken
              }));

              navigate("/");  
            }
        }
      })

       }
     
       } catch (error) {


        console.log(error); 
        toast.error(
          `${error?.response?.data?.message || "Something went wrong!"}`,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
       }finally {
        setLoading(false); 
       }

    }

  return (
    <>
    {
      loading ? <Loading /> : <>
          <div className="registerContainer">
     <div className='register'>
      <h2>Register</h2>
      <form action="" method='post' onSubmit={hangleSubmit}>
          <div>
           <label htmlFor="fullName">Full Name: </label>
           <input type="text" 
                placeholder='Enter Full Name...' 
                id='fullName' 
                value={fullName}
                onChange={(e) => setFullname(e.target.value)}
                required
           />
          </div>
          <div>
          <label htmlFor="email">Email: </label>
                    <input type="text" 
                          placeholder='Enter Email...' 
                          id='email' 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                    />
          </div>

          <div>
            <label htmlFor="username">Username: </label>
            <input type="text" 
                  placeholder='Enter Username...' 
                  id='username' 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
            />
          </div>

          <div>
            <label htmlFor="password">Password: </label>
            <input type="text" 
                  placeholder='Enter Password...'
                  id='password' 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
            />
          </div>

        
          <button type='submit' className='btn'>Submit</button>
          <div>
            <p>Already have an Account?</p>
            <Link to="/login">Login</Link> 
          </div>
        </form>
     </div>
     </div>
      </>
    }
     <ToastContainer />
    </>
  )
}

export default Register