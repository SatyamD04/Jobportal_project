import React, { useEffect, useState } from 'react'
import Navbar from '../commonfile/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { USER_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    //const [selectedRole, setSelectedRole] = useState('default'); // State to manage selected radio button

    const [input, setInput]=useState({
        fullname:"",
        email:"",
        phoneNumber:"",
        password:"",
        role:"",
        file:""
      })

      const {loading,user}=useSelector(store=>store.auth); //---calling/using loading
      const dispatch=useDispatch();
      const navigate=useNavigate(); //----- to send on other page ------
    
      const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value}); //---for fullname to role---
      }
    
      const changeFileHandler=(e)=>{
        setInput({...input, file:e.target.files?.[0]}); //--- to get file data
      }

      const submitHandler=async(e)=>{
        e.preventDefault();
        const formData=new FormData();  //------convert/store all data in form because we upload file also ------
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if(input.file){
            formData.append("file", input.file);
        }


        // ---- api call -----
        try {
            dispatch(setLoading(true));//---when user click signup button then loading shows ----
            const res=await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers:{
                    "Content-Type":"multipart/form-data"
                },
                withCredentials:true,
            });
            if(res.data.success){
                navigate("/login"); //----- send on login page -----
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            dispatch(setLoading(false));
        }
      }

      useEffect(()=>{
        if(user){
            navigate("/");
        }
      },[])


    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl max-auto'>
                <form onSubmit={submitHandler} className="w-1/2 border border-gray-200 rounded-md p-4 my-10">
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="dubey"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="dubey@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="&*#^^#"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone No</Label>
                        <Input
                            type="number"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="3773907957"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className='flex items-center gap-4 my-5'>
                            {/* value={selectedRole} onChange={setSelectedRole} */}

                            {/* <RadioGroupItem value="Student" id="r1" />
                            <RadioGroupItem value="Recruiter" id="r2" /> */}
                            <div className='flex items-center space-x-2'>
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role=='student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>

                            <div className='flex items-center space-x-2'>
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role=='recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>

                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input 
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {
                        loading?<Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</Button> : <Button type="submit" className="w-full my-4">Sign Up</Button>
                    }
                    <span className='text-sm'>Already have an account?<Link to="/login" className="text-blue-600">Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup
