import { NextResponse } from "next/server";
import { destinationRef } from "@/lib/database";
import { doc, serverTimestamp, setDoc, getDocs } from "firebase/firestore";


export async function POST(req) {
    try {
        const body = await req.json();

        if (!body) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const newDocRef = doc(destinationRef);
        await setDoc(newDocRef, {
            ...body,
            createdAt: serverTimestamp(),
            id: newDocRef.id
        });
        return NextResponse.json({ message: "Destination added successfully" }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}



export async function GET() {
    try {

        const querySnapshot = await getDocs(destinationRef);
        const destinations = querySnapshot.docs.map(doc => doc.data());
        console.log(destinations);
        return NextResponse.json({ destinations }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}