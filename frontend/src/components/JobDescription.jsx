import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {

    const params=useParams();
    const jobId=params.id;
    const {singleJob}=useSelector(store=>store.job);
    //console.log(singleJob);
    const {user}=useSelector(store=>store.auth);
    const dispatch=useDispatch();
    const isInitiallyApplied = singleJob?.applications.some(application=>application.applicant==user?._id) || false; //-----user applied for job or not--
    const [isApplied, setIsApplied]=useState(isInitiallyApplied);

    //----checking the login user is already applied for this job or not -----
    const applyJobHandler=async()=>{
        try {
            const res=await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            //console.log(res.data);

            if(res.data.success){
                setIsApplied(true); //update the local state
                const updatedSingleJob={...singleJob,applications:[...singleJob.applications,{applicant:user?._id}]};
                dispatch(setSingleJob(updatedSingleJob));//helps to update real time ui
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        const fetchSingleJob=async()=>{
            try {
                const res=await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant==user?._id));//ensure that the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
      },[jobId, dispatch, user?._id]);

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-600 font-bold'} variant="ghost">{singleJob?.position} Positions</Badge>
                        <Badge className={'text-red-600 font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-purple-600 font-bold'} variant="ghost">{singleJob?.salary} LPA</Badge>
                    </div>
                </div>
                <Button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-700 hover:bg-[#5f32ad]'}`}>
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium text-lg py-4'>Job Description</h1>
            <div>
                <h1 className='font-bold my-1 text-sm'>Role:<span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1 text-sm'>Location:<span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1 text-sm'>Description:<span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1 text-sm'>Experience:<span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel} yrs</span></h1>
                <h1 className='font-bold my-1 text-sm'>Salary:<span className='pl-4 font-normal text-gray-800'>{singleJob?.salary} LPA</span></h1>
                <h1 className='font-bold my-1 text-sm'>Total Application:<span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1 text-sm'>Posted Date:<span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
            </div>
        </div>
    )
}

export default JobDescription
