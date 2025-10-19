import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


//get store info and store product
export async function GET(request) {
    try {

        //get store username from query params
        const { searchParams } = new URL(request.url)
        const username = searchParams.get("username").toLowerCase();

        if(!username) {
            return NextResponse.json({error: "missing username"}, {status: 400})
        }

        //get store info and instock products with ratings
        const store = await prisma.store.findUnique({
            where: {username, isActive: true},
            include: {Product: {include: {rating: true}}}
        })

        if(!store) {
            return NextResponse.json({error: "store not found"}, {status: 400})
        }

        return NextResponse.json({store})

        
    } catch (error) {
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
    
}