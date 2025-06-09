import React from 'react'

export const metadata = {
  title: "Doctors- QuickDoc",
  description: "View the doctors on specialty",
};

const DoctorsLayout=({children})=>{
    return(
        <div className='container mx-auto px-4 py-8'>
<div className='max-w-6xl mx-auto'>
{children}
</div>
        </div>
    )
}

export default DoctorsLayout