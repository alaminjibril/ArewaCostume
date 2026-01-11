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
        const sizesJson = formData.get("sizes") // NEW: Get sizes

        if (!name || !description || !mrp || !price || !category || images.length < 1) {
            return NextResponse.json({ error: "missing product details" }, { status: 400 })
        }

        // Parse sizes if provided
        let sizes = []
        if (sizesJson) {
            try {
                sizes = JSON.parse(sizesJson)
            } catch (e) {
                return NextResponse.json({ error: "invalid sizes format" }, { status: 400 })
            }
        }

        //upload images to image kit
        const imageUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products",
            })
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
                sizes: sizes, // NEW: Save sizes
                storeId
            }
        })

        return NextResponse.json({message: "product added successfully"})

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
}

//get all products function for a seller
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