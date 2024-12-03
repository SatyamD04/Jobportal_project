import React, { useEffect, useState }  from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'


const filterData=[
    {
        filterType:"Location",
        array:["Mumbai","Delhi","Hyderabad","Pune","Bangalore"]
    },
    {
        filterType:"Industry",
        array:["Frontend Developer","Backend Developer","FullStack Developer"]
    },
    // {
    //     filterType:"Salary",
    //     array:["0-40k","42k-1lakh","1lakh-5lakh"]
    // }
]

// FilterCard Component
const FilterCard = () => {

    const [selectedValue, setSelectedValue]=useState('');
    const dispatch=useDispatch();

    const changeHandler=(value)=>{
        setSelectedValue(value);
    }

    useEffect(()=>{
        //console.log(selectedValue);
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);

  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='text-lg font-bold'>Filter Jobs</h1>
      <h4 className='mt-3'>
        <RadioGroup value={selectedValue} onValueChange={changeHandler}>
            {
                filterData.map((data, index)=>(
                    <div>
                        <h1 className='text-lg font-bold'>{data.filterType}</h1>
                        {
                            data.array.map((item, idx)=>{
                                const itemId=`id${index}-${idx}`;
                                return (
                                    <div>
                                        <RadioGroupItem value={item} id={itemId} class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                                        <Label htmlFor={itemId}>{item}</Label>
                                    </div>
                                )
                            })
                        }
                    </div>
                ))
            }
        </RadioGroup>
      </h4>
    </div>
  )
}

export default FilterCard;