import imagekit from "@/configs/imagekit";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//add new product 
export async function POST(request) {
    try {

        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 })
        }

        //get the data from the form 
        const formData = await request.formData()
        const name = formData.get("name")
        const description = formData.get("description")
        const mrp = Number(formData.get("mrp"))
        const price = Number(formData.get("price"))
        const category = formData.get("category")
        const images = formData.getAll("images")

        if (!name || !description || !mrp || !price || !category || images.length < 1) {
            return NextResponse.json({ error: "missing product details" }, { status: 400 })
        }

        //upload images to image kit
        const imageUrl = await Promise.all(images.map(async (image) => {
            // to send the images you have to convert it into buffer
            const buffer = Buffer.from(await image.arrayBuffer());
            //upload the buffer
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products",
            })
            //optimize the images and get the url
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: 1024 }
                ]
            })
            return url
        }))

        //store data in the database
        await prisma.product.create({
            data: {
                name,
                description,
                mrp,
                price,
                category,
                images: imageUrl,
                storeId
            }
        })

        return NextResponse.json({message: "product added successfully"})


    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400})

    }
}

//get all prodcuts function for a seller
//get all the product data for a particular seller
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 })
        }

        const products = await prisma.product.findMany({
            where: {storeId}
        })

        return NextResponse.json({products})
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
}