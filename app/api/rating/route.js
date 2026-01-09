import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


//add new rating 
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { orderId, productId, rating,  review } = await request.json();
        //get the order data
        const order = await prisma.order.findUnique({
            where: {id: orderId, userId}
        })

        if(!order) {
            return NextResponse.json({error: 'Order not Found'}, {status: 404})
        }
        //if order is available, check if product is already rated

        const isAlreadyRated = await prisma.rating.findFirst({
            where: {productId: orderId}
        })

        if(isAlreadyRated) {
            return NextResponse.json({error:'product already rated'}, {status: 404})
        }

        //if product is not rated
        const response = await prisma.rating.create({
            data: {
                userId,
                productId,
                rating,
                review,
                orderId
            }
        })

        return NextResponse.json({message:'Rating added successfully', rating: response})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status: 400})
        
    }
}

//get all rating for users
export async function GET(request){
    try {

        const { userId } = getAuth()
        if(!userId) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        }
        //find ratings where userid is true
        const ratings = await prisma.rating.findMany({
            where: {userId}
        })

        return NextResponse.json({ratings})
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
}