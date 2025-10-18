import StayForm from '@/components/StayForm'
import React from 'react'

function page({params}) {
    const {id} = params
    console.log("Edit Stay ID:", id);
  return (
    <div>
        <StayForm  stayId={id} />
    </div>
  )
}

export default page;