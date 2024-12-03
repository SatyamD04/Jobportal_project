import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
  const {allAppliedJobs}=useSelector(store=>store.job);
  //console.log(allAppliedJobs);
  return (
    <div>
      <Table>
        <TableCaption>List of Jobs you Applied</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Job Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className='text-right'>Status</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                allAppliedJobs.length <=0 ?<span>You haven't applied any job.</span> : allAppliedJobs.map((appliedJob)=>(
                    <TableRow key={appliedJob._id}>
                        <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                        <TableCell>{appliedJob.job?.title}</TableCell>
                        <TableCell>{appliedJob.job?.company?.name}</TableCell>
                        <TableCell className='text-right'><Badge>{appliedJob.status}</Badge></TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
      </Table>
    </div>
  )
}

export default AppliedJobTable
