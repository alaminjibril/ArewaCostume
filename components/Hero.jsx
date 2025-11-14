'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon, Sparkles } from 'lucide-react'
import Image from 'next/image'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'

  return (
    <div className="mx-6">
      <div className="flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-12">

        {/* 🎭 Main Hero Section */}
        <div className="relative flex-1 flex flex-col bg-gradient-to-br from-[#fdf4e3] via-[#f8e1b4] to-[#e7d3a1] rounded-3xl shadow-md overflow-hidden group">
          <div className="p-6 sm:p-16 z-10 relative">
            <div className="inline-flex items-center gap-3 bg-[#f5d06f]/40 text-[#4b3a1e] pr-4 p-1 rounded-full text-xs sm:text-sm backdrop-blur">
              <span className="bg-[#4b3a1e] px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs">NEW</span>
              Free Delivery in Arewa on Orders Above ₦30,000!
              <ChevronRightIcon className="group-hover:ml-2 transition-all" size={16} />
            </div>

            <h2 className="text-3xl sm:text-5xl leading-[1.2] my-4 font-bold bg-gradient-to-r from-[#4b3a1e] to-[#c69d4e] bg-clip-text text-transparent max-w-xs sm:max-w-lg">
              Embrace Royalty in Every Stitch.
            </h2>

            <p className="text-[#5c4a2c] mt-2 text-sm sm:text-base max-w-sm">
              Discover hand-crafted Arewa wears — made with timeless culture, elegance, and pride.
            </p>

            <div className="text-[#4b3a1e] text-sm font-medium mt-6 sm:mt-8">
              <p>Starting from</p>
              <p className="text-3xl font-semibold">{currency}15,000</p>
            </div>

            <button className="mt-6 sm:mt-10 bg-[#4b3a1e] text-white text-sm py-3 px-10 rounded-md hover:bg-[#3b2d1a] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg flex items-center gap-2">
              <Sparkles size={16} />
              SHOP COLLECTION
            </button>
          </div>

          {/* Model Image */}
          <Image
            className="sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-md object-contain"
            src={assets.banner_3}
            alt="Arewa Traditional Outfit"
            priority
          />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#d4b06a_1px,transparent_0)] [background-size:20px_20px] opacity-10" />
        </div>

        {/* 🕌 Side Promotions */}
        <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-700">
          <div className="flex-1 flex items-center justify-between w-full bg-[#f4dec1] rounded-3xl p-6 px-8 group shadow-sm hover:shadow-md transition">
            <div>
              <p className="text-2xl font-semibold bg-gradient-to-r from-[#3b2d1a] to-[#c89a50] bg-clip-text text-transparent max-w-40">
                Hausa Royal Styles
              </p>
              <p className="flex items-center gap-1 mt-4 text-[#4b3a1e] hover:underline cursor-pointer">
                View more <ArrowRightIcon className="group-hover:ml-2 transition-all" size={18} />
              </p>
            </div>
            <Image className="w-28 sm:w-36" src={assets.banner_1} alt="Hausa Attire" />
          </div>

          <div className="flex-1 flex items-center justify-between w-full bg-[#d4e7c5] rounded-3xl p-6 px-8 group shadow-sm hover:shadow-md transition">
            <div>
              <p className="text-2xl font-semibold bg-gradient-to-r from-[#2f3d1d] to-[#74C69D] bg-clip-text text-transparent max-w-40">
                20% Festival Discount
              </p>
              <p className="flex items-center gap-1 mt-4 text-[#2f3d1d] hover:underline cursor-pointer">
                View more <ArrowRightIcon className="group-hover:ml-2 transition-all" size={18} />
              </p>
            </div>
            <Image className="w-28 sm:w-36" src={assets.cap_1} alt="Discount Outfit" />
          </div>
        </div>
      </div>

      <CategoriesMarquee />
    </div>
  )
}

export default Hero
