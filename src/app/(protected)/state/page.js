"use client"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import StateForm from './add-state/page' // re-use the form component
import { DialogTitle } from '@radix-ui/react-dialog'

function page() {
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='bg-black px-4 py-2 text-white rounded-md'>Add State</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Add State</DialogTitle>
                    <StateForm />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default page