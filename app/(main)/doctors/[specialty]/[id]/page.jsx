import { getAvailableTimeSlots, getDoctorById } from '@/actions/appointment'
import { redirect } from 'next/navigation'
import React from 'react'
import DoctorProfile from './_components/DoctorProfile'

const page = async({params}) => {
    const{id}=await params
    try {
      const[doctorDat,slotsData]=await Promise.all([
        getDoctorById(id),getAvailableTimeSlots(id)
      ])
      console.log(slotsData)
      return <DoctorProfile doctor={doctorDat.doctor} availableSlots={slotsData.days||[]}/>
    } catch (error) {
      console.log(error)
    redirect('/doctors')
    }
  
}

export default page