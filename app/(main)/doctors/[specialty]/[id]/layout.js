import { getDoctorById } from '@/actions/appointment'
import PageHeader from '@/components/PageHeader';
import { redirect } from 'next/navigation';
import React from 'react'
export async function generateMetadata({ params }) {
  const { id } =await  params; // No await here

  const { doctor } = await getDoctorById(id);

  return {
    title: `Dr. ${doctor.name} - MediMeet`,
    description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty} specialist with ${doctor.experience} years of experience.`,
  };
}

const layout = async({children,params}) => {
  const { id } = await params; 
  const { doctor } = await getDoctorById(id);
  if(!doctor){
    redirect('/doctors')
  }
  return (
    <div className='container mx-auto px-4 py-8'>
      <PageHeader title={`Dr. ${doctor.name}`} backLink={`/doctors/${doctor.specialty}`} backLabel={`Back to ${doctor.specialty}`}/>
      {children}</div>
  )
}

export default layout