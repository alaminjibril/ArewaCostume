'use client'
import { PackageIcon, Search, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart.total);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-[#fdf8ef] border-b border-[#e8d8b1] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* 🪶 Logo */}
        <Link
          href="/"
          className="relative text-3xl md:text-4xl font-semibold tracking-tight text-[#3b2d1a]"
        >
          <span className="text-[#c69d4e]">Arewa</span>
          Costumes
          <span className="text-[#4b3a1e] text-5xl leading-0">.</span>

          <Protect plan={"plus"}>
            <p className="absolute text-[10px] font-bold -top-2 -right-8 px-2 py-0.5 rounded-full text-white bg-[#7b5f2b] shadow-sm">
              plus
            </p>
          </Protect>
        </Link>

        {/* 📱 Mobile Menu Button */}
        <button
          className="sm:hidden text-[#3b2d1a]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* 💻 Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6 lg:gap-10 text-[#4b3a1e] font-medium">
          <Link href="/" className="hover:text-[#c69d4e] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#c69d4e] transition-colors">Shop</Link>
          <Link href="/" className="hover:text-[#c69d4e] transition-colors">About</Link>
          <Link href="/" className="hover:text-[#c69d4e] transition-colors">Contact</Link>

          {/* 🔍 Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden xl:flex items-center gap-2 bg-[#f5e9cf] px-4 py-2 rounded-full border border-[#dec79b] focus-within:ring-1 focus-within:ring-[#c69d4e]"
          >
            <Search size={18} className="text-[#4b3a1e]" />
            <input
              className="w-40 bg-transparent outline-none text-sm text-[#3b2d1a] placeholder-[#7a6b56]"
              type="text"
              placeholder="Search outfits"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
            />
          </form>

          {/* 🛒 Cart */}
          <Link href="/cart" className="relative flex items-center gap-2 hover:text-[#c69d4e] transition">
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 left-3 text-[8px] text-white bg-[#4b3a1e] size-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* 👤 Auth Buttons */}
          {!user ? (
            <button
              onClick={openSignIn}
              className="px-7 py-2 bg-[#4b3a1e] hover:bg-[#3b2d1a] text-white rounded-full transition"
            >
              Login
            </button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  labelIcon={<PackageIcon size={16} />}
                  label="My Orders"
                  onClick={() => router.push("/orders")}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}
        </div>
      </div>

      {/* 📱 Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="sm:hidden bg-[#fffaf0] border-t border-[#e8d8b1] shadow-md p-4 space-y-3 text-[#3b2d1a] font-medium">
          <Link href="/" onClick={() => setMobileOpen(false)} className="block hover:text-[#c69d4e]">Home</Link>
          <Link href="/shop" onClick={() => setMobileOpen(false)} className="block hover:text-[#c69d4e]">Shop</Link>
          <Link href="/" onClick={() => setMobileOpen(false)} className="block hover:text-[#c69d4e]">About</Link>
          <Link href="/" onClick={() => setMobileOpen(false)} className="block hover:text-[#c69d4e]">Contact</Link>

          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-[#f5e9cf] px-3 py-2 rounded-full border border-[#dec79b]">
            <Search size={16} className="text-[#4b3a1e]" />
            <input
              className="bg-transparent outline-none text-sm w-full"
              placeholder="Search outfits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 hover:text-[#c69d4e]">
            <ShoppingCart size={18} />
            <span>Cart ({cartCount})</span>
          </Link>

          {!user ? (
            <button
              onClick={openSignIn}
              className="w-full px-6 py-2 bg-[#4b3a1e] hover:bg-[#3b2d1a] text-white rounded-full transition"
            >
              Login
            </button>
          ) : (
            <UserButton />
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
