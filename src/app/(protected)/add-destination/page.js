'use client';

import { useState } from 'react';
import { Plus, Trash2, MapPin, Phone, Mail, Home, Star, Navigation, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function TravelPackageForm() {
    const [formData, setFormData] = useState({
        packageName: '',
        packageOverview: '',
        state: '',
        district: '',
        images: [],
        itinery: [{ day: '', title: '', desc: '' }],
        locationAddress: {
            address: '',
            mapLocation: '',
            howToReach: { car: '', train: '', flight: '' }
        },
        includes: [''],
        packageHighlights: [''],
        contact: { phone: '', email: '' },
        daysPeople: { days: '', people: '' },
        isHome: true,
        isEvent: true,
        isTopDestination: true,
        cardHighlight: ['']
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    const handleDeepNestedChange = (parent, nestedParent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [nestedParent]: {
                    ...prev[parent][nestedParent],
                    [field]: value
                }
            }
        }));
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field, index) => {
        if (formData[field].length <= 1) return;
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleItineryChange = (index, field, value) => {
        const newItinery = [...formData.itinery];
        newItinery[index] = { ...newItinery[index], [field]: value };
        setFormData(prev => ({ ...prev, itinery: newItinery }));
    };

    const addItineryItem = () => {
        setFormData(prev => ({
            ...prev,
            itinery: [...prev.itinery, { day: '', title: '', desc: '' }]
        }));
    };

    const removeItineryItem = (index) => {
        if (formData.itinery.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            itinery: prev.itinery.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Here you would typically send the data to your API
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                    <h2 className='text-2xl'>Create Package</h2>
                <Card className=" border-0">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Left: main form (spans 2 cols on md+) */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Package Name and Overview */}
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="packageName" className="text-gray-800 font-medium">
                                            Package Name
                                        </Label>
                                        <Input
                                            id="packageName"
                                            name="packageName"
                                            value={formData.packageName}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Kerala Backwaters Tour"
                                            className="border-blue-200 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="packageOverview" className="text-gray-800 font-medium">
                                            Package Overview
                                        </Label>
                                        <Textarea
                                            id="packageOverview"
                                            name="packageOverview"
                                            value={formData.packageOverview}
                                            onChange={handleInputChange}
                                            placeholder="Describe the package in a few sentences..."
                                            rows={3}
                                            className="border-blue-200 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Location Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="state" className="text-gray-800 font-medium">
                                            State
                                        </Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Kerala"
                                            className="border-blue-200 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="district" className="text-gray-800 font-medium">
                                            District
                                        </Label>
                                        <Input
                                            id="district"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Alleppey"
                                            className="border-blue-200 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Itinerary Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800">Itinerary</h3>
                                        <Button
                                            type="button"
                                            onClick={addItineryItem}
                                            className="bg-gray-900 hover:bg-blue-700 flex items-center gap-1"
                                        >
                                            <Plus className="h-4 w-4" /> Add Day
                                        </Button>
                                    </div>

                                    {formData.itinery.map((item, index) => (
                                        <Card key={index} className="bg-blue-50 border-blue-200">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="font-medium text-gray-800">Day {index + 1}</h4>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeItineryItem(index)}
                                                        className="text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Day Number</Label>
                                                        <Input
                                                            value={item.day}
                                                            onChange={(e) => handleItineryChange(index, 'day', e.target.value)}
                                                            placeholder="e.g., Day 1"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Title</Label>
                                                        <Input
                                                            value={item.title}
                                                            onChange={(e) => handleItineryChange(index, 'title', e.target.value)}
                                                            placeholder="e.g., Arrival in Cochin"
                                                        />
                                                    </div>

                                                    <div className="space-y-2 md:col-span-1">
                                                        <Label>Description</Label>
                                                        <Textarea
                                                            value={item.desc}
                                                            onChange={(e) => handleItineryChange(index, 'desc', e.target.value)}
                                                            placeholder="Describe the day's activities..."
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Location Address */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Location Details</h3>

                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Textarea
                                            value={formData.locationAddress.address}
                                            onChange={(e) => handleNestedChange('locationAddress', 'address', e.target.value)}
                                            placeholder="Full address of the location..."
                                            rows={2}
                                            className="border-blue-200 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Map Location URL</Label>
                                        <Input
                                            value={formData.locationAddress.mapLocation}
                                            onChange={(e) => handleNestedChange('locationAddress', 'mapLocation', e.target.value)}
                                            placeholder="https://maps.google.com/..."
                                            className="border-blue-200 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium text-blue-700">How to Reach</h4>

                                        <div className="space-y-2">
                                            <Label>By Car</Label>
                                            <Input
                                                value={formData.locationAddress.howToReach.car}
                                                onChange={(e) => handleDeepNestedChange('locationAddress', 'howToReach', 'car', e.target.value)}
                                                placeholder="Directions for traveling by car..."
                                                className="border-blue-200 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>By Train</Label>
                                            <Input
                                                value={formData.locationAddress.howToReach.train}
                                                onChange={(e) => handleDeepNestedChange('locationAddress', 'howToReach', 'train', e.target.value)}
                                                placeholder="Nearest railway station and directions..."
                                                className="border-blue-200 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>By Flight</Label>
                                            <Input
                                                value={formData.locationAddress.howToReach.flight}
                                                onChange={(e) => handleDeepNestedChange('locationAddress', 'howToReach', 'flight', e.target.value)}
                                                placeholder="Nearest airport and directions..."
                                                className="border-blue-200 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Package Highlights */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800">Package Highlights</h3>
                                        <Button
                                            type="button"
                                            onClick={() => addArrayItem('packageHighlights')}
                                            className="bg-gray-900 hover:bg-blue-700 flex items-center gap-1"
                                        >
                                            <Plus className="h-4 w-4" /> Add Highlight
                                        </Button>
                                    </div>

                                    {formData.packageHighlights.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={item}
                                                onChange={(e) => handleArrayChange('packageHighlights', index, e.target.value)}
                                                placeholder="e.g., Houseboat stay, Cultural shows..."
                                                className="border-blue-200 focus:border-blue-500"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeArrayItem('packageHighlights', index)}
                                                className="text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Includes */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-800">What's Included</h3>
                                        <Button
                                            type="button"
                                            onClick={() => addArrayItem('includes')}
                                            className="bg-gray-900 hover:bg-blue-700 flex items-center gap-1"
                                        >
                                            <Plus className="h-4 w-4" /> Add Item
                                        </Button>
                                    </div>

                                    {formData.includes.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={item}
                                                onChange={(e) => handleArrayChange('includes', index, e.target.value)}
                                                placeholder="e.g., Breakfast, Accommodation, Guide..."
                                                className="border-blue-200 focus:border-blue-500"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeArrayItem('includes', index)}
                                                className="text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Submit Button (left column) */}
                                <div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-700 py-2 text-lg"
                                    >
                                        Save Package
                                    </Button>
                                </div>
                            </div>

                            {/* Right: Contact Information + Package Visibility */}
                            <aside className="md:col-span-1 space-y-6">
                                <Card className="border-blue-100">
                                    <CardContent className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-1">
                                                    <Phone className="h-4 w-4" /> Phone
                                                </Label>
                                                <Input
                                                    value={formData.contact.phone}
                                                    onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                                                    placeholder="+91 1234567890"
                                                    className="border-blue-200 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-1">
                                                    <Mail className="h-4 w-4" /> Email
                                                </Label>
                                                <Input
                                                    type="email"
                                                    value={formData.contact.email}
                                                    onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                                                    placeholder="contact@example.com"
                                                    className="border-blue-200 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-blue-100">
                                    <CardContent className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Package Visibility</h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 border rounded-lg border-blue-200 bg-blue-50">
                                                <div className="flex items-center gap-2">
                                                    <Home className="h-5 w-5 text-blue-600" />
                                                    <Label htmlFor="isHome" className="text-gray-800 cursor-pointer">
                                                        Show on Homepage
                                                    </Label>
                                                </div>
                                                <Switch
                                                    id="isHome"
                                                    checked={formData.isHome}
                                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isHome: checked }))}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 border rounded-lg border-blue-200 bg-blue-50">
                                                <div className="flex items-center gap-2">
                                                    <Navigation className="h-5 w-5 text-blue-600" />
                                                    <Label htmlFor="isEvent" className="text-gray-800 cursor-pointer">
                                                        Is Special Event
                                                    </Label>
                                                </div>
                                                <Switch
                                                    id="isEvent"
                                                    checked={formData.isEvent}
                                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isEvent: checked }))}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 border rounded-lg border-blue-200 bg-blue-50">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-5 w-5 text-blue-600" />
                                                    <Label htmlFor="isTopDestination" className="text-gray-800 cursor-pointer">
                                                        Top Destination
                                                    </Label>
                                                </div>
                                                <Switch
                                                    id="isTopDestination"
                                                    checked={formData.isTopDestination}
                                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isTopDestination: checked }))}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-blue-100">
                                    <CardContent className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Day / People</h3>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" /> Days
                                                </Label>
                                                <Input
                                                    value={formData.daysPeople.days}
                                                    onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                                                    placeholder="2 Days 1 Night"
                                                    className="border-blue-200 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-1">
                                                    <User className="h-4 w-4" /> Number of People
                                                </Label>
                                                <Input
                                                    type="email"
                                                    value={formData.daysPeople.people}
                                                    onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                                                    placeholder="Max 10 People"
                                                    className="border-blue-200 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>


                            </aside>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}