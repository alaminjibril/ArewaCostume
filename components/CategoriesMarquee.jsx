"use client"
import { categories } from "@/assets/assets";
import { Sparkles, Crown, Star } from "lucide-react";

const CategoriesMarquee = () => {
  return (
    <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group my-16">
      <div className="absolute left-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-r from-[#fdf8f3] to-transparent" />
      <div className="absolute right-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-l from-[#fdf8f3] to-transparent" />

     
      <div className="flex min-w-[200%] animate-[marqueeScroll_30s_linear_infinite] hover:[animation-play-state:paused] gap-6 sm:gap-10">
        {[...categories, ...categories].map((cat, index) => (
          <button
            key={index}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium 
                       bg-gradient-to-r from-[#f8e1b4] to-[#f7d794] text-[#3d2b1f]
                       hover:from-[#3d2b1f] hover:to-[#5b4636] hover:text-[#f8e1b4]
                       active:scale-95 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            {/* Random icon variety for visual richness */}
            {index % 3 === 0 ? (
              <Sparkles size={16} />
            ) : index % 3 === 1 ? (
              <Crown size={16} />
            ) : (
              <Star size={16} />
            )}
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesMarquee;
