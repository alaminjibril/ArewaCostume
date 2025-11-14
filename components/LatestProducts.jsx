'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const LatestProducts = () => {

    const displayQuantity = 4
    const products = useSelector(state => state.product.list)

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <div className="text-center mb-12">
                <Title
                    title="Latest Arrivals"
                    description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity
                        } of ${products.length} available products`}
                    href="/shop"
                />
                <div className="mt-3 w-20 mx-auto border-b-4 border-[#c69d4e] rounded-full"></div>
            </div>
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {products.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, displayQuantity).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default LatestProducts