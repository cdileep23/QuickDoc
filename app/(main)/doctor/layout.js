

import { getCurrentUser } from '@/actions/onBoardng'
import PageHeader from '@/components/PageHeader'

import { StethoscopeIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

import React from 'react'

export const metadata={
    title:"Doctor Dasboard - QuickDoc",
    description:"Manage Your appointments and availability"
}
const layout = async({children}) => {

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        icon={<StethoscopeIcon />}
        title={"Doctor dashboard"}
        backLink="/"
      />
      {children}
    </div>
  );
}

export default layout