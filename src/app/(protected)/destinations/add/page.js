"use client"
import SimpleEditor from '@/components/Editor';
import { Input } from '@/components/ui/input';
import {useState} from 'react'

function page() {

    const [formData, setFormData] = useState({
        title: "",
        content: ""
    })


    const handleChange = (field, value) => {
        setFormData((prev) => ({...prev, [field]: value}))
    }


  return (
    <div className='p-4'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
            <div className='md:col-span-8'>
                <h2 className='text-lg font-semibold mb-2'>Add Destination</h2>
                <div className='h-40 bg-white'>
                    <Input placeholder="Enter the title" z onChange={(e)=>(handleChange("title", e.target.value))} ></Input>
                    <SimpleEditor onChange={(value) => handleChange("content", value)} />
                    <pre> {JSON.stringify(formData, null, 2)}</pre>
                </div>
            </div>    
        </div>
    </div>
  )
}

export default page