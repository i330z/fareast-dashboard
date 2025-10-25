"use client"
import { useState, useEffect } from "react";
import { Home, Image as ImageIcon, MapPin, User, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import MultiFileUploadComponent from "@/components/MultiFileUploadComponent";
import { useRouter } from "next/navigation";
import { Wifi, Car, Coffee, Dog, Clock, Mountain } from 'lucide-react'
import HostImageUploadComponent from "@/components/HostImageUploadComponent";

const northEastStates = [
    { stateName: "Assam", districts: ["Kamrup", "Dibrugarh", "Nagaon"] },
    { stateName: "Arunachal Pradesh", districts: ["Tawang", "Papum Pare", "East Siang"] },
    { stateName: "Manipur", districts: ["Imphal West", "Thoubal", "Churachandpur"] },
    { stateName: "Meghalaya", districts: ["East Khasi Hills", "West Garo Hills"] },
    { stateName: "Mizoram", districts: ["Aizawl", "Lunglei"] },
    { stateName: "Nagaland", districts: ["Kohima", "Dimapur"] },
    { stateName: "Sikkim", districts: ["East Sikkim", "West Sikkim"] },
    { stateName: "Tripura", districts: ["West Tripura", "South Tripura"] }
];

const facilitiesList = [
    { id: "coupleFriendly", label: "Couple Friendly", icon: Dog, iconName: 'Dog' },
    { id: "wifi", label: 'Free Wi-Fi', icon: Wifi, iconName: 'Wifi' },
    // { id: "freeparking", name: 'Free Parking', icon: Car },
    { id: "breakfast", label: 'Breakfast Included', icon: Coffee, iconName: 'Coffee' },
    { id: "pet-friendly", label: 'Pet Friendly', icon: Dog, iconName: 'Dog' },
    { id: "checkin", label: '24/7 Check-in', icon: Clock, iconName: 'Clock' },
    { id: "mountain", label: 'Mountain View', icon: Mountain, iconName: 'Mountain' },
];

const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-');     // Remove consecutive hyphens
};

export default function StayForm({ stayId = null, onSuccess = () => { }, fetchUrlBase = "/api/stay" }) {
    const router = useRouter();
    const [loading, setLoading] = useState(Boolean(stayId));
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        notes: "",
        images: [], // items: { id?, file?, url?, name? }
        location: { state: "", district: "", address: "", pincode: "" },
        host: { name: "", image: null, contact: "", whatsapp: "" },
        facilities: [],
        notes: "",
        category: "",
        slug: "",
        isPublished: false
    });

    useEffect(() => {
        let mounted = true;
        if (!stayId) return;
        setLoading(true);
        fetch(`${fetchUrlBase}?id=${encodeURIComponent(stayId)}`)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!mounted) return;

                // The API response is nested under an 'accomodation' object.
                const stayData = data.accomadation;

                if (!stayData) throw new Error("Fetched data is missing 'accomodation' object.");

                // Map backend response to form shape. Adjust mapping as needed.
                setFormData(prev => ({
                    ...prev,
                    name: stayData.name ?? "", // Using 'nam' as per your API response
                    description: stayData.description ?? "",
                    notes: stayData.notes ?? "",
                    images: (stayData.images ?? []).map(img => ({ id: img.id, url: img.url, name: img.name })),
                    location: {
                        ...prev.location, // Keep initial structure
                        ...stayData.location, // Spread fetched location data
                    },
                    host: {
                        ...prev.host, // Keep initial structure
                        ...stayData.host, // Spread fetched host data
                        image: stayData.host?.image ? { id: stayData.host.image.id, url: stayData.host.image.url } : null,
                    },
                    facilities: stayData.facilities ?? [],
                    note: stayData.note ?? "",
                    category: stayData.category ?? ""
                }));
            })
            .catch(err => {
                console.error(err);
                if (mounted) setError(err.message || "Failed to fetch");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, [stayId, fetchUrlBase]);

    useEffect(() => {
        return () => {
            formData.images.forEach(img => img?.url && URL.revokeObjectURL(img.url));
            if (formData.host.image?.url) URL.revokeObjectURL(formData.host.image.url);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUploadSuccess = ({ id, url, name }) => {
        setFormData(prev => ({ ...prev, images: [...prev.images, { id, url, name }].slice(0, 4) }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));
    };

    const handleImageUpload = (e) => {
        e.preventDefault();
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const newImages = files.map(file => ({ file, url: URL.createObjectURL(file), name: file.name }));
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages].slice(0, 4) }));
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
        e.preventDefault();
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, host: { ...prev.host, image: { file, url: URL.createObjectURL(file) } } }));
        } else {
            setFormData(prev => ({ ...prev, host: { ...prev.host, image: null } }));
        }
        e.target.value = "";
    };

    // const handleFacilityChange = (facilityId, checked) => {
    //     setFormData(prev => {
    //         const facilities = checked ? [...prev.facilities, facilityId] : prev.facilities.filter(id => id !== facilityId);
    //         return { ...prev, facilities };
    //     });
    // };
    const handleFacilityChange = (facilityId, checked) => {
        setFormData(prev => {
            const f = facilitiesList.find(x => x.id === facilityId);
            if (!f) return prev;

            if (checked) {
                // add object, avoid duplicates
                if (prev.facilities.some(item => item.id === facilityId)) return prev;
                return { ...prev, facilities: [...prev.facilities, { id: f.id, label: f.label, iconName: f.iconName }] };
            } else {
                // remove by id
                return { ...prev, facilities: prev.facilities.filter(item => item.id !== facilityId) };
            }
        });
    };


    const getDistrictsForState = (stateName) => {
        const state = northEastStates.find(st => st.stateName === stateName);
        return state ? state.districts : [];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Basic behavior: send JSON for fields and expect backend to handle files via separate uploads.
            const url = stayId ? `${fetchUrlBase}?id=${encodeURIComponent(stayId)}` : fetchUrlBase;
            const method = stayId ? "PUT" : "POST";
            const slug = generateSlug(formData.name);
            const payload = { ...formData, slug };


            console.log("Submitting payload:", payload);
            // return
            // If images contain File objects, you might need to upload them separately. Adjust as needed.
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `Request failed ${res.status}`);
            }

            const data = await res.json();
            onSuccess(data);
            // default navigation back to list
            router.push("/stay");
        } catch (err) {
            console.error(err);
            setError(err.message || "Submit failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{stayId ? "Edit Homestay" : "Add New Homestay"}</h1>
                    <p className="text-muted-foreground">Fill in the details below.</p>

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
                                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell us about this wonderful place..." rows={8} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Facilities Available</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {facilitiesList.map(f => (
                                            <label key={f.id} className="inline-flex items-center space-x-2">
                                                <Checkbox
                                                    checked={formData.facilities.some(item => item.id === f.id)}
                                                    onCheckedChange={(checked) => handleFacilityChange(f.id, Boolean(checked))}
                                                />
                                                <span className="text-sm">{f.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {formData.facilities.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.facilities.map(fac => (
                                                <div key={fac.id} className="inline-flex items-center px-2 py-1 bg-muted rounded-full text-sm">
                                                    <span className="mr-2">
                                                        {/* optional: render icon component */}
                                                        {fac.label}
                                                    </span>
                                                    <Button type="button" size="sm" variant="ghost" onClick={() => handleFacilityChange(fac.id, false)} className="p-0">
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Add extra notes for the customers.." rows={6} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Homestay">Homestay</SelectItem>
                                            <SelectItem value="Hotel">Hotel</SelectItem>
                                            <SelectItem value="Camping">Camping</SelectItem>
                                            <SelectItem value="Zostel">Zostel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Location Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Select value={formData.location.state} onValueChange={(value) => { handleNestedChange("location", "state", value); handleNestedChange("location", "district", ""); }}>
                                            <SelectTrigger><SelectValue placeholder="Select a state" /></SelectTrigger>
                                            <SelectContent>
                                                {northEastStates.map(s => <SelectItem key={s.stateName} value={s.stateName}>{s.stateName}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="district">District</Label>
                                        <Select value={formData.location.district} onValueChange={(value) => handleNestedChange("location", "district", value)} disabled={!formData.location.state}>
                                            <SelectTrigger><SelectValue placeholder="Select a district" /></SelectTrigger>
                                            <SelectContent>
                                                {getDistrictsForState(formData.location.state).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Full Address</Label>
                                    <Textarea id="address" value={formData.location.address} onChange={(e) => handleNestedChange("location", "address", e.target.value)} placeholder="Street, Village, Landmark..." />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input id="pincode" type="number" value={formData.location.pincode} onChange={(e) => handleNestedChange("location", "pincode", e.target.value)} placeholder="e.g., 799001" />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="mt-6">
                            <Label>Images</Label>
                            <div className="space-y-2">
                                <MultiFileUploadComponent onUploadSuccess={handleUploadSuccess} />
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {formData.images.map((img, idx) => (
                                        <div key={img.id ?? img.url ?? idx} className="relative">
                                            <img src={img.url} alt={img.name ?? `img-${idx}`} className="w-full h-24 object-cover rounded" />
                                            <Button type="button" variant="ghost" size="sm" className="absolute top-1 right-1" onClick={() => removeImage(idx)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <div className="flex items-center justify-between bg-gray-300/50 p-4 rounded">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        className="bg-white border-gray-400"
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                                    />
                                    <Label htmlFor="isPublished">Publish this homestay</Label>
                                </div>
                                <Button type="submit" size="lg" disabled={loading}>
                                    {loading ? "Saving..." : (stayId ? "Update Homestay" : "Save Homestay")}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-4 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Host Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">



                                { /* ...inside the Host Details CardContent, replace existing host image input block with: */}
                                <div className="space-y-2">
                                    <Label>Host Image</Label>
                                    <HostImageUploadComponent
                                        initialImage={formData.host.image ?? null}
                                        onUploadSuccess={(data) => {
                                            if (data) {
                                                setFormData(prev => ({ ...prev, host: { ...prev.host, image: { id: data.id, url: data.url, name: data.name } } }));
                                            } else {
                                                setFormData(prev => ({ ...prev, host: { ...prev.host, image: null } }));
                                            }
                                        }}
                                    />
                                </div>

                                {/* <div className="space-y-2">
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
                                        <Button type="button" variant="outline" onClick={() => document.getElementById("hostImage")?.click()}>
                                            <Plus className="w-4 h-4 mr-2" /> Upload
                                        </Button>
                                    </div>
                                </div> */}

                                <div className="space-y-2">
                                    <Label htmlFor="hostName">Host Name</Label>
                                    <Input id="hostName" value={formData.host.name} onChange={(e) => handleNestedChange("host", "name", e.target.value)} placeholder="e.g., John Doe" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hostContact">Contact Number</Label>
                                    <Input id="hostContact" type="tel" value={formData.host.contact} onChange={(e) => handleNestedChange("host", "contact", e.target.value)} placeholder="e.g., 9876543210" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hostWhatsapp">WhatsApp Number</Label>
                                    <Input id="hostWhatsapp" type="tel" value={formData.host.whatsapp} onChange={(e) => handleNestedChange("host", "whatsapp", e.target.value)} placeholder="e.g., 9876543210" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {error && <div className="text-red-600">{error}</div>}
            </form>
        </div>
    );
}