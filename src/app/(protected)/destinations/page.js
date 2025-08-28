"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/DataTable'

function page() {
  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'content',
      header: 'Address',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
  ]

  const [data, setData] = useState([])

  async function getDestinations() {
    const res = await fetch('/api/destination', { method:'GET', cache: 'no-store' })
    const data = await res.json()
    console.log(data)
    setData(data.destinations || [])
  }

  useEffect(() => {
    getDestinations()
  },[])


  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-4'>
        <div></div>
        <Link href="/destinations/add">
          <Button>Add Destinations</Button>
        </Link>
      </div>
      <h2 className='text-2xl font-semibold text-slate-800 mb-4'>
        All Destinations
      </h2>
      <Separator />
      <div id='table'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default page 