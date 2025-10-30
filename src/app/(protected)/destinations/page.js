"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/DataTable'
import { useRouter } from 'next/navigation'
import { Edit, Trash } from "lucide-react" 


function page() {
  const router = useRouter()

  const deleteDestination = async (id) => {
    try {
      if (!id) return
      const res = await fetch(`/api/destination?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      console.log(data)
      await getDestinations() // Re-fetch data after deletion
    } catch (error) {
      console.log(error)
      alert("Error deleting destination")
    }
  }

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
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      id: "actions", // special column id
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original // access full row data here
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/destinations/edit/${rowData.id}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteDestination(rowData.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
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