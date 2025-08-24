"use client"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import DistrictForm from '@/components/AddDistricts'
import { DialogTitle } from '@radix-ui/react-dialog'

function page() {
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='bg-black px-4 py-2 text-white rounded-md'>Add District</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Fill Up District</DialogTitle>
                    <DistrictForm />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default page