'use client'
import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreAddProduct() {

    const categories = [
        "Men's Traditional Wear",
        "Women's Traditional Wear",
        'Cultural Accessories',
        'Headwear & Caps',
        'Footwear',
        'Jewelry & Beads',
        "Children's Outfits",
        'Others'
    ]

    // Size presets based on category
    const sizePresets = {
        'Footwear': ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
        "Men's Traditional Wear": ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        "Women's Traditional Wear": ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        "Children's Outfits": ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'],
        'default': ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    }

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
    })
    const [sizes, setSizes] = useState([])
    const [customSize, setCustomSize] = useState("")
    const [loading, setLoading] = useState(false)

    const { getToken } = useAuth()

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onCategoryChange = (category) => {
        setProductInfo({ ...productInfo, category })
        // Reset sizes when category changes
        setSizes([])
    }

    const getAvailableSizes = () => {
        const category = productInfo.category
        if (category === 'Footwear') return sizePresets['Footwear']
        if (category === "Children's Outfits") return sizePresets["Children's Outfits"]
        if (category.includes('Traditional Wear')) return sizePresets['default']
        return sizePresets['default']
    }

    const toggleSize = (sizeValue) => {
        setSizes(prev => {
            const exists = prev.find(s => s.size === sizeValue)
            if (exists) {
                return prev.filter(s => s.size !== sizeValue)
            } else {
                return [...prev, { size: sizeValue, stock: 0 }]
            }
        })
    }

    const updateStock = (sizeValue, stock) => {
        setSizes(prev => prev.map(s => 
            s.size === sizeValue ? { ...s, stock: Number(stock) } : s
        ))
    }

    const addCustomSize = () => {
        if (!customSize.trim()) return
        const exists = sizes.find(s => s.size === customSize.trim())
        if (exists) {
            toast.error("Size already added")
            return
        }
        setSizes([...sizes, { size: customSize.trim(), stock: 0 }])
        setCustomSize("")
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if(!images[1] && !images[2] && !images[3] && !images[4]){
                return toast.error("please upload atleast one image")
            }

            // Check if sizes are needed for this category
            const needsSizes = ["Men's Traditional Wear", "Women's Traditional Wear", 'Footwear', "Children's Outfits"].includes(productInfo.category)
            
            if (needsSizes && sizes.length === 0) {
                return toast.error("Please add at least one size")
            }

            setLoading(true)
            const formData = new FormData()
            formData.append("name", productInfo.name)
            formData.append("description", productInfo.description)
            formData.append("mrp", productInfo.mrp)
            formData.append("price", productInfo.price)
            formData.append("category", productInfo.category)
            formData.append("sizes", JSON.stringify(sizes))

            Object.keys(images).forEach(key => {
                images[key] && formData.append('images', images[key])
            })

            const token = await getToken()
            const { data } = await axios.post("/api/store/product", formData, {headers: { Authorization: `Bearer ${token}`}})
            toast.success(data.message)

            setProductInfo({
                name: "",
                description: "",
                mrp: 0,
                price: 0,
                category: "",
            })
            setImages({ 1: null, 2: null, 3: null, 4: null })
            setSizes([])
            
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        finally {
            setLoading(false)
        }
    }

    const showSizeSelector = ["Men's Traditional Wear", "Women's Traditional Wear", 'Footwear', "Children's Outfits"].includes(productInfo.category)

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <div className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className="h-15 w-auto border border-slate-200 rounded cursor-pointer" src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" accept="image/*" id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <label className="flex flex-col gap-2 my-6">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label className="flex flex-col gap-2 my-6">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label className="flex flex-col gap-2">
                    Actual Price ($)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
                <label className="flex flex-col gap-2">
                    Offer Price ($)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
            </div>

            <select onChange={e => onCategoryChange(e.target.value)} value={productInfo.category} className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            {showSizeSelector && (
                <div className="my-6">
                    <p className="mb-3 text-slate-700 font-medium">Available Sizes & Stock</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {getAvailableSizes().map(sizeValue => {
                            const isSelected = sizes.find(s => s.size === sizeValue)
                            return (
                                <button
                                    key={sizeValue}
                                    type="button"
                                    onClick={() => toggleSize(sizeValue)}
                                    className={`px-4 py-2 rounded border transition ${
                                        isSelected 
                                            ? 'bg-slate-800 text-white border-slate-800' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                                    }`}
                                >
                                    {sizeValue}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex gap-2 mb-4">
                        <input 
                            type="text" 
                            value={customSize}
                            onChange={e => setCustomSize(e.target.value)}
                            placeholder="Add custom size" 
                            className="p-2 px-4 outline-none border border-slate-200 rounded"
                        />
                        <button 
                            type="button"
                            onClick={addCustomSize}
                            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
                        >
                            Add
                        </button>
                    </div>

                    {sizes.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm text-slate-600">Set stock quantity for each size:</p>
                            <div className="flex flex-wrap gap-3">
                                {sizes.map(sizeObj => (
                                    <div key={sizeObj.size} className="flex items-center gap-2 p-2 border border-slate-200 rounded">
                                        <span className="font-medium text-slate-700">{sizeObj.size}:</span>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={sizeObj.stock}
                                            onChange={e => updateStock(sizeObj.size, e.target.value)}
                                            placeholder="Stock"
                                            className="w-20 p-1 px-2 outline-none border border-slate-200 rounded"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setSizes(sizes.filter(s => s.size !== sizeObj.size))}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition disabled:opacity-50">
                Add Product
            </button>
        </form>
    )
}