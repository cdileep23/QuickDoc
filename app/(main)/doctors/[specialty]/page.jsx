import PageHeader from '@/components/PageHeader'
import { redirect } from 'next/navigation'
import React from 'react'
import {DoctorCard} from '../../../../components/DoctorCard'
import { getDoctorsBySpecialty } from '@/actions/doctors-listing'

const page = async({params}) => {
    const {specialty}=await params
    const modifiedSpeciality = specialty.replace(/[^a-zA-Z]/g, " ");
    if(!specialty){
      redirect('/doctors')
    }
    const {doctors,error}=await getDoctorsBySpecialty(specialty);
    if(error){
      console.log("Error Fetching doctors:",error)
    }
  return (
    <div className="space-y-5">
      <PageHeader
        title={modifiedSpeciality.split("%20").join(" ")}
        backLabel="ALL Specialties"
        backLink="/doctors"
      />
      {doctors && doctors.length > 0 ? (
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h1>No Doctors Available</h1>
          <p>
            There are Currently No verified doctors in this specialty .Please
            check back later or choose another specialty
          </p>
        </div>
      )}
    </div>
  );
}

export default page