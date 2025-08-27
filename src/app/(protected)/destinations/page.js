import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link'

function page() {
  return (
    <div>
        <Link href="/destinations/add">
        <Button>Add Destinations</Button>
        </Link>
        Destination Blogs
    </div>
  )
}

export default page 