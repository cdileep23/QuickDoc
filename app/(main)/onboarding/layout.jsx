import { getCurrentUser } from '@/actions/onBoardng'
import { redirect } from "next/navigation";

import React from 'react'
export const metadata={
    title:"Onboarding - QUICKDOC",
    descripton:"Complete your profile to get started with Quick Doc"
}
const OnBoardingLayout = async({
    children
}) => {

const user=await getCurrentUser()
if(user){
    if(user.role==="PATIENT"){
        redirect('/doctors')
    
    }else if(user.role==="DOCTOR"){
        if(user.verificationStatus==="VERIFIED"){
            redirect('/doctor')
        }else{
            redirect('/doctor/verification')
        }
    }else if(user.role==="ADMIN"){
redirect('/admin')
    }
}

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-10'>

            <h1 className='text-3xl font-bold text-blue-400 gradient-title'>Welcome to Quick Doc</h1>
            <p className='text-muted-foreground '>Tell Us how you want to use the platform</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export default OnBoardingLayout;