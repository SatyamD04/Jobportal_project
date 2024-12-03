import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setSearchedQuery } from '@/redux/jobSlice';

const HeroSection = () => {
    const [query, setQuery]=useState("");
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const searchJobHandler=()=>{
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-blue-700 font-medium'>No. 1 Job Website</span>
                <h1 className='text-5xl font-bold '>Search, Apply &<br /> Shape Your<span className='text-blue-700'> Career </span>Path</h1>
                <div>
                <p>SkillBridge connects students with relevant job opportunities and helps recruiters efficiently</p>
                <p>manage applications and select candidates.</p>
                </div>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input 
                        type="text"
                        placeholder='find your dream jobs'
                        onChange={(e)=>setQuery(e.target.value)}
                        className='outline-none border-none w-full bg-white'
                    />
                    <Button onClick={searchJobHandler} className='rounded-r-full bg-blue-700'>
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
