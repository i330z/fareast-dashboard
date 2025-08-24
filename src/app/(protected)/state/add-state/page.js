"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StateForm() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, image: file }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        // You can send formData to your backend or API here
    };

    return (

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* State Name */}
            <div className="space-y-2">
                <Label htmlFor="name">State Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter state name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <Label htmlFor="image">State Image</Label>
                <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Write a short description..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
                Submit
            </Button>
        </form>


    );
}
