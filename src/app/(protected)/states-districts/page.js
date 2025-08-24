'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function StateWithDistrictsForm() {
    const [stateName, setStateName] = useState('')
    const [stateDescription, setStateDescription] = useState('')
    const [stateImageFile, setStateImageFile] = useState(null)
    const [stateImagePreview, setStateImagePreview] = useState(null)

    const [districts, setDistricts] = useState([
        { id: Date.now(), name: '', description: '', imageFile: null, imagePreview: null },
    ])

    const handleStateImageChange = (e) => {
        const file = e.target.files?.[0] ?? null
        setStateImageFile(file)
        setStateImagePreview(file ? URL.createObjectURL(file) : null)
    }

    const handleDistrictChange = (index, key, value) => {
        setDistricts((prev) => {
            const copy = [...prev]
            copy[index] = { ...copy[index], [key]: value }
            return copy
        })
    }

    const handleDistrictImageChange = (index, file) => {
        handleDistrictChange(index, 'imageFile', file)
        handleDistrictChange(index, 'imagePreview', file ? URL.createObjectURL(file) : null)
    }

    const addDistrict = () => {
        setDistricts((prev) => [
            ...prev,
            { id: Date.now() + Math.random(), name: '', description: '', imageFile: null, imagePreview: null },
        ])
    }

    const removeDistrict = (index) => {
        setDistricts((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('stateName', stateName)
        formData.append('stateDescription', stateDescription)
        if (stateImageFile) formData.append('stateImage', stateImageFile)

        const districtsData = districts.map((d, i) => {
            const keyPrefix = `districts[${i}]`
            formData.append(`${keyPrefix}.name`, d.name)
            formData.append(`${keyPrefix}.description`, d.description)
            if (d.imageFile) formData.append(`${keyPrefix}.image`, d.imageFile)
            return { name: d.name, description: d.description, hasImage: !!d.imageFile }
        })

        console.log({
            stateName,
            stateDescription,
            stateImageFile,
            districts: districtsData,
        })

        // await fetch('/api/states', { method: 'POST', body: formData })
        alert('Form prepared. Check console for output.')
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <CardHeader>
                        <CardTitle>Create / Edit State</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="stateName" className="mb-2">State name</Label>
                                <Input
                                    id="stateName"
                                    value={stateName}
                                    onChange={(e) => setStateName(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="stateDescription" className="mb-2">State description</Label>
                                <Textarea
                                    id="stateDescription"
                                    value={stateDescription}
                                    onChange={(e) => setStateDescription(e.target.value)}
                                    rows={4}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="flex-1">
                                    <Label className="mb-2">State image</Label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleStateImageChange}
                                        className="block w-full text-sm text-muted-foreground"
                                    />
                                </div>

                                {stateImagePreview && (
                                    <div className="w-40">
                                        <img className="rounded-md shadow-sm w-full object-cover" src={stateImagePreview} alt="state preview" />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                setStateImageFile(null)
                                                setStateImagePreview(null)
                                            }}
                                            className="mt-2 w-full"
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">Districts</h3>
                                <Button type="button" onClick={addDistrict}>
                                    + Add district
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {districts.map((d, idx) => (
                                    <Card key={d.id} className="p-4">
                                        <div className="flex gap-4 items-start">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-1 gap-4">
                                                <div>
                                                    <Label className="mb-2">District name</Label>
                                                    <Input
                                                        value={d.name}
                                                        onChange={(e) => handleDistrictChange(idx, 'name', e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="mb-2">District description</Label>
                                                    <Textarea
                                                        value={d.description}
                                                        onChange={(e) => handleDistrictChange(idx, 'description', e.target.value)}
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>

                                            <div className="w-60 flex-shrink-0">
                                                <Label className="mb-2">Image (optional)</Label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleDistrictImageChange(idx, e.target.files?.[0] ?? null)}
                                                    className="block w-full text-sm text-muted-foreground"
                                                />

                                                {d.imagePreview && (
                                                    <div className="mt-2">
                                                        <img className="rounded-md w-full object-cover shadow-sm" src={d.imagePreview} alt={`district-${idx}`} />
                                                        <div className="flex gap-2 mt-2">
                                                            <Button type="button" variant="ghost" onClick={() => handleDistrictImageChange(idx, null)}>
                                                                Clear image
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-center mt-4">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => removeDistrict(idx)}
                                                disabled={districts.length === 1}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2">
                        <Button type="submit" className="bg-primary text-white">
                            Submit
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
