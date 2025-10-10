"use client"
import SimpleEditor from '@/components/Editor';
import FileUploadComponent from '@/components/FileUploadComponent';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useState, useRef, useEffect } from 'react'
import { X } from "lucide-react";
import { useRouter } from 'next/navigation';


function Page() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        address: "",
        phone: "",
        email: "",
        isFeatured: false,
        isPublished: false,
        description: '',
        slug: '',
        category: '',
        state: '',
        images: [] // { id, file, url, name }
    })




    const generateSlug = (string) => {
        return string
            .toLowerCase()                     // Convert string to lowercase
            .trim()                             // Remove leading and trailing spaces
            .replace(/[\s_-]+/g, '-')           // Replace spaces and underscores with hyphens
            .replace(/[^a-z0-9-]/g, '')         // Remove non-alphanumeric characters (except for hyphen)
            .replace(/--+/g, '-')               // Replace multiple hyphens with a single one
            .replace(/^-+/, '')                 // Remove leading hyphen
            .replace(/-+$/, '');                // Remove trailing hyphen
    };


    const slugRef = useRef('');




    const handleChange = (field, value) => {
        setFormData((prev) => {
            if (field === "title") {
                return { ...prev, title: value, slug: generateSlug(value) };
            }
            return { ...prev, [field]: value };
        })


    }


    const handleFileUpload = (fileObj) => {
        console.log("File uploaded Object:", fileObj);
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, fileObj],
        }));
    };



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
        return
        const res = await fetch('/api/destination', {
            method: 'POST',
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
                            <h2 className='text-2xl font-semibold text-slate-800'>Add Destination</h2>
                            <p className='text-sm text-slate-500'>Provide details for the destination. Add rich content and multiple images on the right.</p>

                            <label className='block'>
                                <span className='text-sm font-medium text-slate-700'>Title</span>
                                <Input placeholder="Enter the title" value={formData.title} onChange={(e) => (handleChange("title", e.target.value))} className="mt-2" />
                            </label>

                            <div>
                                <span className='text-sm font-medium text-slate-700'>Content</span>
                                <div className='mt-2 bg-white border rounded-md'>
                                    <SimpleEditor onChange={(value) => handleChange("content", value)} />
                                </div>
                            </div>
                            <div className='pt-2'>


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
                            <div className='space-y-4 border border-slate-200 p-4 rounded bg-blue-50'>
                                <h3 className='text-lg font-semibold text-slate-800'>Actions</h3>
                                <div className="flex items-center justify-between">
                                    <span className='text-sm font-medium text-slate-700'>Publish Online</span>
                                    <Switch
                                        id="notifications"
                                        checked={formData.isPublished}
                                        onCheckedChange={(checked) => handleChange("isPublished", checked)
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className='text-sm font-medium text-slate-700'>Featured(Home Page)</span>
                                    <Switch
                                        id="notifications"
                                        checked={formData.isFeatured}
                                        onCheckedChange={(checked) => handleChange("isFeatured", checked)
                                        }
                                    />
                                </div>

                            </div>

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

                            <div>
                                <label htmlFor="slug">Slug</label>
                                <input
                                    type="text"
                                    id="slug"
                                    value={formData.slug} // Use ref to display the slug value
                                    readOnly
                                />
                            </div>

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