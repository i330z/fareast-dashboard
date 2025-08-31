"use client"
import SimpleEditor from '@/components/Editor';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation';
import FileUploadComponent from '@/components/FileUploadComponent';
import { X } from "lucide-react";
import { useRouter } from 'next/navigation';


function Page() {
    const router = useRouter()
    const { id } = useParams();
    console.log("Editing ID:", id)

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        address: "",
        phone: "",
        email: "",
        images: [] // { id, file, url, name }
    })




    useEffect(() => {
        const fetchDestination = async () => {
            if (!id) return;
            try {
                const response = await fetch('/api/destination?id=' + id, { method: 'GET', cache: 'no-store' });
                const data = await response.json();
                console.log("Fetched destination data:", data);
                setFormData(data.destination)
            } catch (error) {
                console.log("Error fetching destination:", error);
            }
        }
        fetchDestination();

    }, [id])


    const fileInputRef = useRef(null)

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }




    const handleFileUpload = (fileObj) => {
        console.log("File uploaded Object:", fileObj);
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, fileObj],
        }));
    };


    // const handleImageChange = (e) => {
    //     const files = Array.from(e.target.files || [])
    //     if (files.length === 0) return
    //     const uploaded = uploadImages(files)
    //     setFormData(prev => ({ ...prev, images: [...prev.images, ...uploaded] }))
    //     // Reset input so same file can be selected again if needed
    //     if (fileInputRef.current) fileInputRef.current.value = ""
    // }

    const removeImage = (id) => {
        setFormData(prev => {
            const toRemove = prev.images.find(img => img.id === id)
            if (toRemove) URL.revokeObjectURL(toRemove.url)
            return { ...prev, images: prev.images.filter(img => img.id !== id) }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Replace with real submit logic (API call / formData build)
        console.log("Submitting", formData)
        const res = await fetch(`/api/destination?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        const data = await res.json()

        console.log(data)

        alert("Form data logged to console.")
        router.push("/destinations")
    }

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <form onSubmit={handleSubmit} className='max-w-7xl mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
                    {/* Left - main form */}
                    <div className='md:col-span-8'>
                        <div className='bg-white rounded-lg shadow-sm p-6 space-y-4'>
                            <h2 className='text-2xl font-semibold text-slate-800'>Edit/Update Destination</h2>
                            <p className='text-sm text-slate-500'>Provide details for the destination. Add rich content and multiple images on the right.</p>

                            <label className='block'>
                                <span className='text-sm font-medium text-slate-700'>Title</span>
                                <Input placeholder="Enter the title" value={formData.title} onChange={(e) => (handleChange("title", e.target.value))} className="mt-2" />
                            </label>

                            <div>
                                <span className='text-sm font-medium text-slate-700'>Content</span>
                                <div className='mt-2 bg-white border rounded-md'>
                                    <SimpleEditor text={formData.content} onChange={(value) => handleChange("content", value)} />
                                </div>
                            </div>

                            <div className='pt-2'>
                                <button type="submit" className='inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-sm transition'>
                                    Update Destination
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
                                <Input placeholder="Phone number" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className="mt-2" />
                            </label>

                            <label className='block'>
                                <span className='text-sm font-medium text-slate-700'>Email</span>
                                <Input placeholder="Email address" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className="mt-2" />
                            </label>

                            <label className='block'>
                                <span className='text-sm font-medium text-slate-700'>Select State</span>
                                <select
                                    value={formData.state}
                                    onChange={(e) => handleChange("state", e.target.value)}
                                    className='mt-2 w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200'>
                                    <option value="">Select State</option>
                                    <option value="Assam">Assam</option>
                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                    <option value="Nagaland">Nagaland</option>
                                    <option value="Manipur">Manipur</option>
                                    <option value="Mizoram">Mizoram</option>
                                    <option value="Tripura">Tripura</option>
                                    <option value="Meghalaya">Meghalaya</option>
                                    <option value="Sikkim">Sikkim</option>

                                </select>
                            </label>

                            {/* Description Textarea */}
                            <label className='block'>
                                <span className='text-sm font-medium text-slate-700'>Description</span>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    className='mt-2 w-full border rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-200'
                                    placeholder="Enter a description"
                                />
                            </label>

                            {/* Category Selector */}
                            <label className='block'>
                                <span className='text-sm font-medium text-slate-700'>Category</span>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleChange("category", e.target.value)}
                                    className='mt-2 w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200'>
                                    <option value="">Select Category</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Nature">Nature</option>
                                    <option value="Hiking">Hiking</option>
                                </select>
                            </label>


                            <div>
                                <FileUploadComponent onUploadSuccess={handleFileUpload} />
                                {formData.images.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {formData.images.map((img) => (
                                            <div
                                                key={img.id}
                                                className="relative group border rounded-lg overflow-hidden"
                                            >
                                                {/* Preview Image */}
                                                <img
                                                    src={img.url}
                                                    alt={img.name}
                                                    className="w-full h-32 object-cover"
                                                />

                                                {/* Remove Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(img.id)}
                                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition"
                                                >
                                                    <X size={16} />
                                                </button>

                                                {/* File Name Overlay */}
                                                <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white text-[10px] px-2 py-1 truncate">
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
            </form>
        </div>
    )
}

export default Page