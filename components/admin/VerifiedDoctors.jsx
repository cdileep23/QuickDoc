
"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import {  Ban, Lock, LockIcon, Superscript } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import { updateDoctorActiveStatus } from '@/actions/admin'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'

const VerifiedDoctors = ({doctors}) => {
  const [searchTerm,setSearchTerm]=useState("")
  const[targetDoctor,setTargetDoctor]=useState(null)
  const {data,loading, fn:submitStatusUpdate}=useFetch(updateDoctorActiveStatus)

  const filteredDoctors=doctors.filter((doctor)=>{
    const query=searchTerm.toLowerCase()
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.email.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query)
    );
  })
  useEffect(()=>{
if(data &&data?.success){
  toast.success("Suspended the User")
  setTargetDoctor(null)
}
  },[data])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Doctors On Platform</CardTitle>
        <CardDescription>View And Manage all Verified Doctors</CardDescription>

        <div className="mt-2">
          <Input
            type="text"
            placeholder="search doctors"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredDoctors.length === 0 ? (
          <div>
            {searchTerm
              ? "No Doctors match Your search Criteria "
              : "No Verified Doctors as Of Now"}
          </div>
        ) : (
          filteredDoctors.map((doctor) => {
            return (
              <div key={doctor.id} className="flex justify-between">
                <div>
                  <h1 className="font-bold">{doctor.name}</h1>
                  <p>
                    {doctor.specialty} • {doctor.experience} Years of Experience
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-blue-600 bg-blue-100">Active</Badge>
                  <Button
                    disabled={targetDoctor === doctor.id && loading}
                    onClick={() => {
                      setTargetDoctor(doctor.id);
                      submitStatusUpdate({
                        doctorId: doctor.id,
                        suspend: true,
                      });
                    }}
                  >
                    <Ban /> Suspend
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export default VerifiedDoctors