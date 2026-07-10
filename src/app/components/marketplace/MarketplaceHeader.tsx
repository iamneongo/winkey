"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Search, ShoppingCart, Bell, User, LockKeyhole } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Package, Users } from "lucide-react";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/cua-hang", label: "Marketplace" },
  { href: "#", label: "Dịch vụ" },
  { href: "#", label: "Bản quyền" },
  { href: "#", label: "AI Tools" },
  { href: "#", label: "Bảng giá" },
  { href: "/tin-tuc", label: "Tin tức" },
];

function UserMenu() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/sign-in"
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          Đăng nhập
        </Link>
        <Link
          href="/auth/sign-up"
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
        >
          Đăng ký
        </Link>
      </div>
    );
  }

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
    user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ||
    "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center p-0 bg-transparent border-none cursor-pointer">
          <Avatar className="w-9 h-9 border border-gray-100 shadow-sm">
            <AvatarImage src={user.imageUrl} alt={user.fullName ?? "Avatar"} />
            <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
        <DropdownMenuLabel>
          <div className="font-semibold">{user.fullName || "Tài khoản"}</div>
          <div className="text-xs font-normal opacity-70 truncate">
            {user.primaryEmailAddress?.emailAddress}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
          <Link href="/tai-khoan" className="flex items-center gap-2">
            <User size={15} /> Tài khoản của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
          <Link href="/tai-khoan/don-hang" className="flex items-center gap-2">
            <Package size={15} /> Đơn hàng
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
          <Link href="/tai-khoan/affiliate" className="flex items-center gap-2">
            <Users size={15} /> Cộng tác viên
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex items-center gap-2 text-red-500 rounded-lg cursor-pointer focus:text-red-600 focus:bg-red-50"
        >
          <LogOut size={15} /> Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MarketplaceHeader() {
  const { cartCount, setIsCartOpen } = useCart();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <LockKeyhole className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 leading-tight tracking-tight">WinKey <span className="text-blue-600">AI</span></span>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.1em] mt-[-2px]">Digital Marketplace</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className={`hidden md:flex flex-1 max-w-md items-center bg-gray-50 rounded-full px-4 py-2 border transition-all ${searchFocused ? 'border-blue-300 ring-2 ring-blue-100 bg-white' : 'border-transparent'}`}>
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm, dịch vụ..." 
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href} 
              className={`text-[13px] font-bold transition-colors hover:text-blue-600 ${idx === 0 ? 'text-blue-600 relative after:absolute after:bottom-[-29px] after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-t-md' : 'text-gray-700'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions (Cart, Notif, User) */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={2.5} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
          
          <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
            <Bell className="w-[22px] h-[22px]" strokeWidth={2.5} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
