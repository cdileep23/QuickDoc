import Link from 'next/link'
import React from 'react'

const ButtonsMain = () => {
  return (
    <div className="flex gap-4">
               <Link href="/onboarding">
                 <button className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
                  Get Started
                 </button>
               </Link>
               <Link href="/doctors">
                 <button className="px-6 py-3 border border-gray-300 text-gray-800 rounded-xl hover:bg-gray-100 transition">
                   Find Doctors
                 </button>
               </Link>
             </div>
  )
}

export default ButtonsMain