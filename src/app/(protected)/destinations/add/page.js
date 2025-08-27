"use client"
import SimpleEditor from '@/components/Editor';
import { Input } from '@/components/ui/input';
import { useState, useRef } from 'react'

function Page() {

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        address: "",
        phone: "",
        email: "",
        images: [] // { id, file, url, name }
    })

    const fileInputRef = useRef(null)

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // uploadImages is a standalone function so it can be extracted to a component later
    const uploadImages = (files) => {
        // files: File[]
        const uploaded = files.map((file, idx) => ({
            id: `${Date.now()}-${idx}`,
            file,
            url: URL.createObjectURL(file),
            name: file.name
        }))
        return uploaded
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return
        const uploaded = uploadImages(files)
        setFormData(prev => ({ ...prev, images: [...prev.images, ...uploaded] }))
        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const removeImage = (id) => {
        setFormData(prev => {
            const toRemove = prev.images.find(img => img.id === id)
            if (toRemove) URL.revokeObjectURL(toRemove.url)
            return { ...prev, images: prev.images.filter(img => img.id !== id) }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Replace with real submit logic (API call / formData build)
        console.log("Submitting", formData)
        alert("Form data logged to console.")
    }

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
        <form onSubmit={handleSubmit} className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
                {/* Left - main form */}
                <div className='md:col-span-8'>
                    <div className='bg-white rounded-lg shadow-sm p-6 space-y-4'>
                        <h2 className='text-2xl font-semibold text-slate-800'>Add Destination</h2>
                        <p className='text-sm text-slate-500'>Provide details for the destination. Add rich content and multiple images on the right.</p>

                        <label className='block'>
                            <span className='text-sm font-medium text-slate-700'>Title</span>
                            <Input placeholder="Enter the title" value={formData.title} onChange={(e)=>(handleChange("title", e.target.value))} className="mt-2" />
                        </label>

                        <div>
                            <span className='text-sm font-medium text-slate-700'>Content</span>
                            <div className='mt-2 bg-white border rounded-md'>
                                <SimpleEditor onChange={(value) => handleChange("content", value)} />
                            </div>
                        </div>

                        <div className='pt-2'>
                            <button type="submit" className='inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm transition'>
                                Save Destination
                            </button>
                        </div>

                        {/* <pre className='mt-4 text-xs bg-slate-100 p-3 rounded text-slate-700 overflow-auto'>{JSON.stringify(formData, null, 2)}</pre> */}
                    </div>
                </div>

                {/* Right - sidebar with contact fields and image upload */}
                <div className='md:col-span-4'>
                    <div className='bg-white rounded-lg shadow-sm p-4 space-y-4'>
                        <h3 className='text-lg font-semibold text-slate-800'>Contact & Media</h3>

                        <label className='block'>
                            <span className='text-sm font-medium text-slate-700'>Address</span>
                            <textarea
                                rows={3}
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className='mt-2 w-full border rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-200'
                                placeholder="Enter address"
                            />
                        </label>

                        <label className='block'>
                            <span className='text-sm font-medium text-slate-700'>Phone</span>
                            <Input placeholder="Phone number" value={formData.phone} onChange={(e)=>handleChange("phone", e.target.value)} className="mt-2" />
                        </label>

                        <label className='block'>
                            <span className='text-sm font-medium text-slate-700'>Email</span>
                            <Input placeholder="Email address" value={formData.email} onChange={(e)=>handleChange("email", e.target.value)} className="mt-2" />
                        </label>

                        <div>
                            <span className='text-sm font-medium text-slate-700'>Images</span>
                            <div className='mt-2 border-dashed border-2 border-slate-200 rounded-md p-3 bg-slate-50'>
                                <div className='flex items-center justify-between gap-2'>
                                    <div className='text-sm text-slate-500'>Upload multiple images (jpg, png)</div>
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className='px-3 py-1 text-sm bg-white border rounded-md hover:shadow-sm'>
                                        Choose
                                    </button>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className='hidden'
                                />
                                <div className='mt-3'>
                                    {/* images grid */}
                                    {formData.images.length === 0 ? (
                                        <div className='text-xs text-slate-400'>No images uploaded yet.</div>
                                    ) : (
                                        <div className='grid grid-cols-3 gap-2'>
                                            {formData.images.map(img => (
                                                <div key={img.id} className='relative group rounded overflow-hidden border'>
                                                    <img src={img.url} alt={img.name} className='w-full h-20 object-cover' />
                                                    <button type="button" onClick={()=>removeImage(img.id)} className='absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1 hidden group-hover:block'>
                                                        Remove
                                                    </button>
                                                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-1'>
                                                        {img.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
  )
}

export default Page