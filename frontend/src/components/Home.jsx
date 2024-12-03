import React, { useEffect } from 'react'
import Navbar from './commonfile/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJob from './LatestJob'
import Footer from './commonfile/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const Home = () => {
  useGetAllJobs();
  const {user}=useSelector(store=>store.auth);//----get user data----
  const navigate=useNavigate();

  useEffect(()=>{
    if(user?.role=='recruiter'){
      //-----if userRole is recruiter then redirect "admin/companies" rather than '/home'----
      navigate("/admin/companies");
    }
  },[]);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel/>
      <LatestJob />
      <Footer />
    </div>
  )
}

export default Home
