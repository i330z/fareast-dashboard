import { NextResponse } from "next/server";
import { accomadationRef } from "@/lib/database";
import { doc, serverTimestamp, setDoc, getDocs, getDoc, updateDoc, deleteDoc } from "firebase/firestore";


export async function POST(req) {
    try {
        const body = await req.json();

        if (!body) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const newDocRef = doc(accomadationRef);
        await setDoc(newDocRef, {
            ...body,
            createdAt: serverTimestamp(),
            id: newDocRef.id
        });
        return NextResponse.json({ message: "Accomadation added successfully" }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}



export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if(id){
            const docRef = doc(accomadationRef, id);
            const docSnap = await getDoc(docRef);

            if(!docSnap.exists()){
                return NextResponse.json({ message: "Accomadation not found" }, { status: 404 });    
            }

            return NextResponse.json({ accomadation: docSnap.data() }, { status: 200 });
        }else{

            const querySnapshot = await getDocs(accomadationRef);
            const accomadations = querySnapshot.docs.map(doc => doc.data());
            return NextResponse.json({ accomadations }, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const body = await req.json();

        const docRef =  doc(accomadationRef, id);
        await updateDoc(docRef, {
            ...body,
            updatedAt: serverTimestamp()
        })
        return NextResponse.json({ message: "Accomadation updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating the document" }, { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const docRef =  doc(accomadationRef, id);
        await deleteDoc(docRef);
        return NextResponse.json({ message: "Accomadation deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error deleting the document" }, { status: 500 });
    }
}
