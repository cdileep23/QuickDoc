import React from 'react'
import { Card, CardContent } from './ui/card'
import { PricingTable } from '@clerk/nextjs'

const Pricing = () => {
  return (
    <Card className='bg-blue-50'>
        <CardContent className="p-6 md:p-8">
            <PricingTable  checkoutProps={{
                appearance:{
                    elements:{
                        drawerRoot:{
                            zIndex:200
                        }
                    }
                }
            }}/>
        </CardContent>
    </Card>
  )
}

export default Pricing;