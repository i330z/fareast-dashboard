"use client"
import { useState, useEffect } from 'react';
import { Home, Image as ImageIcon, MapPin, User, Wifi, ParkingCircle, Utensils, Info, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const northEastStates = [
    {
        stateName: "Assam",
        districts: ["Kamrup", "Dibrugarh", "Nagaon"]
    },
    {
        stateName: "Arunachal Pradesh",
        districts: ["Tawang", "Papum Pare", "East Siang"]
    },
    {
        stateName: "Manipur",
        districts: ["Imphal West", "Thoubal", "Churachandpur"]
    },
    {
        stateName: "Meghalaya",
        districts: ["East Khasi Hills", "West Garo Hills"]
    },
    {
        stateName: "Mizoram",
        districts: ["Aizawl", "Lunglei"]
    },
    {
        stateName: "Nagaland",
        districts: ["Kohima", "Dimapur"]
    },
    {
        stateName: "Sikkim",
        districts: ["East Sikkim", "West Sikkim"]
    },
    {
        stateName: "Tripura",
        districts: ["West Tripura", "South Tripura"]
    }
];

const facilitiesList = [
    { id: 'coupleFriendly', label: 'Couple Friendly' },
    { id: 'parking', label: 'Parking' },
    { id: 'wifi', label: 'Wi-Fi' },
    { id: 'food', label: 'Food Available' },
    { id: 'breakfast', label: 'Breakfast Included' } // added breakfast
];

function AddAccommodationPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        notes:'',
        images: [], // Array of { file, url }
        location: {
            state: '',
            district: '',
            address: '',
            pincode: ''
        },
        host: {
            name: '',
            image: null, // { file, url }
            contact: '',
            whatsapp: '',
        },
        facilities: [],
        note: ''
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

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages].slice(0, 4) // Enforce max 4 images
        }));
        e.target.value = "";
    };

    const removeImage = (index) => {
        setFormData(prev => {
            const toRemove = prev.images[index];
            if (toRemove?.url) URL.revokeObjectURL(toRemove.url);
            return { ...prev, images: prev.images.filter((_, i) => i !== index) };
        });
    };

    const handleHostImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                host: { ...prev.host, image: { file, url: URL.createObjectURL(file) } }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                host: { ...prev.host, image: null }
            }));
        }
        e.target.value = "";
    };

    const handleFacilityChange = (facilityId, checked) => {
        setFormData(prev => {
            const facilities = checked
                ? [...prev.facilities, facilityId]
                : prev.facilities.filter(id => id !== facilityId);
            return { ...prev, facilities };
        });
    };

    const getDistrictsForState = (stateName) => {
        const state = northEastStates.find(st => st.stateName === stateName);
        return state ? state.districts : [];
    };

    useEffect(() => {
        return () => {
            formData.images.forEach(img => img?.url && URL.revokeObjectURL(img.url));
            if (formData.host.image?.url) {
                URL.revokeObjectURL(formData.host.image.url);
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting Homestay Data:', formData);
        alert('Form data logged to console. See implementation notes for API submission.');
        // API submission logic would go here.
        // You would likely use FormData to send files.
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Add New Homestay</h1>
                    <p className="text-muted-foreground">Fill in the details below to add a new accommodation listing.</p>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Home className="w-5 h-5" /> Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Homestay Name</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Serene Valley Homestay" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell us about this wonderful place..." rows={10} />
                                </div>

                                {/* Facilities multi-select */}
                                <div className="space-y-2">
                                    <Label>Facilities Available</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {facilitiesList.map(f => (
                                            <label key={f.id} className="inline-flex items-center space-x-2">
                                                <Checkbox
                                                    checked={formData.facilities.includes(f.id)}
                                                    onCheckedChange={(checked) => handleFacilityChange(f.id, Boolean(checked))}
                                                />
                                                <span className="text-sm">{f.label}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Selected facilities as removable chips */}
                                    {formData.facilities.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.facilities.map(id => {
                                                const f = facilitiesList.find(x => x.id === id);
                                                return (
                                                    <div key={id} className="inline-flex items-center px-2 py-1 bg-muted rounded-full text-sm">
                                                        <span className="mr-2">{f?.label ?? id}</span>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleFacilityChange(id, false)}
                                                            className="p-0"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Add extra notes for the customers.." rows={10} />
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex justify-end mt-10">
                            <Button type="submit" size="lg">Save Homestay</Button>
                        </div>
                    </div>
                    <div className="md:col-span-4 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Host Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Host Image</Label>
                                    <div className="flex flex-col items-center gap-4">
                                        <AspectRatio ratio={1 / 1} className="w-full bg-muted rounded-md overflow-hidden">
                                            {formData.host.image?.url ? (
                                                <img src={formData.host.image.url} alt="Host" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-slate-100">
                                                    <ImageIcon className="w-8 h-8 text-slate-400" />
                                                </div>
                                            )}
                                        </AspectRatio>
                                        <Input id="hostImage" type="file" accept="image/*" onChange={handleHostImageChange} className="hidden" />
                                        <Button type="button" variant="outline" onClick={() => document.getElementById('hostImage')?.click()}>
                                            <Plus className="w-4 h-4 mr-2" /> Upload
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hostName">Host Name</Label>
                                    <Input id="hostName" value={formData.host.name} onChange={(e) => handleNestedChange('host', 'name', e.target.value)} placeholder="e.g., John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hostContact">Contact Number</Label>
                                    <Input id="hostContact" type="tel" value={formData.host.contact} onChange={(e) => handleNestedChange('host', 'contact', e.target.value)} placeholder="e.g., 9876543210" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hostWhatsapp">WhatsApp Number</Label>
                                    <Input id="hostWhatsapp" type="tel" value={formData.host.whatsapp} onChange={(e) => handleNestedChange('host', 'whatsapp', e.target.value)} placeholder="e.g., 9876543210" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Location Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Select value={formData.location.state} onValueChange={(value) => { handleNestedChange('location', 'state', value); handleNestedChange('location', 'district', ''); }}>
                                            <SelectTrigger><SelectValue placeholder="Select a state" /></SelectTrigger>
                                            <SelectContent>
                                                {northEastStates.map(s => <SelectItem key={s.stateName} value={s.stateName}>{s.stateName}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 ">
                                        <Label htmlFor="district">District</Label>
                                        <Select value={formData.location.district} onValueChange={(value) => handleNestedChange('location', 'district', value)} disabled={!formData.location.state}>
                                            <SelectTrigger><SelectValue placeholder="Select a district" /></SelectTrigger>
                                            <SelectContent>
                                                {getDistrictsForState(formData.location.state).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Full Address</Label>
                                    <Textarea id="address" value={formData.location.address} onChange={(e) => handleNestedChange('location', 'address', e.target.value)} placeholder="Street, Village, Landmark..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input id="pincode" type="number" value={formData.location.pincode} onChange={(e) => handleNestedChange('location', 'pincode', e.target.value)} placeholder="e.g., 799001" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>  {/* closes md:col-span-4 */}

                </div>  {/* <-- ADD this line to close the grid (md:grid-cols-12) */}

                {/* Continue with other sections... */}

            </form>
        </div>);
}

export default AddAccommodationPage;