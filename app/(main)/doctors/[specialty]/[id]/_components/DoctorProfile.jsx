"use client"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Calendar, ChevronDown, ChevronUp, Clock, FileText, Medal, User } from 'lucide-react';
import Image from 'next/image';
import React, { useReducer, useState } from 'react'

import AppointmentForm from './AppointmentForm';
import { useRouter } from 'next/navigation';

import PickSlot from './PickSlot';
const DoctorProfile = ({doctor,availableSlots}) => {
  const[showBooking,setBooking]=useState(null)
  const[selectSlot,setSelectedSlot]=useState(null)
  const router=useRouter()
  const handleSeletSlot=(slot)=>{
    setSelectedSlot(slot)
  }
  const handleBookingComplete=()=>{
router.push('/appointments')
  }
  const toggleBooking=()=>{
    setBooking(!showBooking)
    if(!showBooking){
      setTimeout(()=>{
        document.getElementById('booking-section')?.scrollIntoView({
          behavior:"smooth"
        })
      },100)
    }
  }
  const totalSlots=availableSlots?.reduce((total,day)=>total+day.slots.length,0)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1">
        <div className="md:sticky md:top-28">
          <Card className="border-blue-200 bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {/* Profile Image */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-blue-100">
                  {doctor?.imageUrl ? (
                    <Image
                      src={doctor?.imageUrl}
                      alt={doctor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-blue-400" />
                    </div>
                  )}
                </div>

                {/* Doctor Name */}
                <h2 className="text-xl font-bold text-blue-900 mb-1">
                  Dr. {doctor.name}
                </h2>

                {/* Specialty Badge */}
                <Badge
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-500 mb-4"
                >
                  {doctor.specialty}
                </Badge>

                {/* Experience Info */}
                <div className="flex items-center justify-center mb-2">
                  <Medal className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {doctor.experience} years experience
                  </span>
                </div>

                <Button
                  onClick={toggleBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                >
                  {showBooking ? (
                    <>
                      Hide Booking <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {" "}
                      Book Appointment <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="col-span-1 md:col-span-2 space-y-4">
        <Card className="border border-blue-200 shadow-lg  overflow-hidden">
          <CardHeader className=" px-6 py-4">
            <CardTitle className="text-2xl font-bold text-blue-900 tracking-tight">
              About Dr. {doctor.name}
            </CardTitle>
            <CardDescription className="text-blue-700 text-sm font-medium mt-1 tracking-wide">
              {doctor.specialty}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6 bg-white">
            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Description
                </h3>
              </div>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                {doctor.description}
              </p>
            </div>

            <Separator className="bg-blue-200" />

            {/* Availability */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Availability
                </h3>
              </div>

              {totalSlots > 0 ? (
                <div className="flex items-center bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <Calendar className="h-5 w-5 text-blue-400 mr-2" />
                  <p className="text-blue-800 text-sm font-medium">
                    {totalSlots} time slots available for booking over the next
                    4 days
                  </p>
                </div>
              ) : (
                <Alert className="bg-red-50 border border-red-200 text-red-700 mt-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      No available slots for the next 4 days. Please check back
                      later.
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
        {showBooking && (
          <div id="booking-section ">
            <Card>
              <CardHeader>
                <CardTitle>Book An Appointment</CardTitle>
                <CardDescription>
                  Select a time slot and provide details for your consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {totalSlots > 0 ? (
                  <>
                  {
                    !selectSlot &&  <PickSlot days={availableSlots} onSelectedSlot={handleSeletSlot}/>
                  }

                  {
                    selectSlot &&(
                    <AppointmentForm doctorId={doctor.id} slot={selectSlot}  onBack={()=>setSelectedSlot(null)} onComplete={handleBookingComplete}/>
                    )
                  }
                  </>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-xl font-medium  mb-2">
                      No available slots
                    </h3>
                    <p className="text-muted-foreground">
                      This doctor doesn&apos;t have any available appointment
                      slots for the next 4 days. Please check back later or try
                      another doctor.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorProfile