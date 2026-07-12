"use client";

import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Bell, User, Menu } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Package, Users } from "lucide-react";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/coming-soon?title=Marketplace", label: "Marketplace" },
  { href: "/coming-soon?title=Dịch vụ", label: "Dịch vụ" },
  { href: "/coming-soon?title=Bản quyền", label: "Bản quyền" },
  { href: "/coming-soon?title=AI Tools", label: "AI Tools" },
  { href: "/tin-tuc", label: "Tin tức" },
];

function isNavActive(href: string, pathname: string, currentTitle: string | null): boolean {
  const [path, query = ""] = href.split("?");
  if (path === "/") return pathname === "/";
  if (path === "/coming-soon") {
    return (
      pathname === "/coming-soon" &&
      new URLSearchParams(query).get("title") === currentTitle
    );
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

function NavLinks({ pathname, currentTitle }: { pathname: string; currentTitle: string | null }) {
  return (
    <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
      {navLinks.map((item) => {
        const active = isNavActive(item.href, pathname, currentTitle);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`text-[13px] font-bold whitespace-nowrap transition-colors hover:text-blue-600 ${
              active
                ? "text-blue-600 relative after:absolute after:bottom-[-29px] after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-t-md"
                : "text-slate-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function HeaderNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return <NavLinks pathname={pathname} currentTitle={searchParams.get("title")} />;
}

function AuthButtons({
  onNavigate,
  className = "",
  fullWidth = false,
}: {
  onNavigate?: () => void;
  className?: string;
  fullWidth?: boolean;
}) {
  const base = `inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full px-4 text-center text-sm font-semibold transition-colors ${
    fullWidth ? "w-full" : ""
  }`;
  return (
    <div className={className}>
      <Link
        href="/auth/sign-in"
        onClick={onNavigate}
        className={`${base} text-gray-700 bg-gray-100 hover:bg-gray-200 focus-visible:bg-gray-200`}
      >
        Đăng nhập
      </Link>
      <Link
        href="/auth/sign-up"
        onClick={onNavigate}
        className={`${base} text-white bg-blue-600 hover:bg-blue-700 focus-visible:bg-blue-700 active:bg-blue-800 shadow-sm`}
      >
        Đăng ký
      </Link>
    </div>
  );
}

function UserMenu() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) return null;

  // On mobile the auth buttons live inside the mobile menu, so hide them here below lg.
  if (!isSignedIn) {
    return <AuthButtons className="hidden lg:flex items-center gap-2" />;
  }

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
    user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ||
    "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Tài khoản"
          className="flex items-center justify-center p-0 bg-transparent border-none cursor-pointer"
        >
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

type OrderNotification = {
  id: number;
  payment_status: string;
  total_amount: string | number;
  created_at: string;
};

function orderStatusLabel(status: string) {
  if (status === "paid") return "Đã thanh toán";
  if (status === "failed") return "Thất bại";
  return "Đang xử lý";
}

function NotificationBell() {
  const { isSignedIn, isLoaded } = useUser();
  const [orders, setOrders] = useState<OrderNotification[] | null>(null);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    if (!isSignedIn || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json().catch(() => ({}));
      setOrders(res.ok && Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && loadOrders()}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative hidden md:flex items-center justify-center w-11 h-11 text-gray-700 hover:text-blue-600 transition-colors"
          aria-label="Thông báo"
        >
          <Bell className="w-[22px] h-[22px]" strokeWidth={2.5} />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 mt-2 rounded-xl">
        <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isLoaded ? (
          <div className="px-3 py-4 text-sm text-gray-500">Đang tải...</div>
        ) : !isSignedIn ? (
          <div className="px-3 py-4 text-center">
            <p className="mb-3 text-sm text-gray-600">Đăng nhập để xem thông báo đơn hàng của bạn.</p>
            <Link
              href="/auth/sign-in"
              className="inline-flex rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Đăng nhập
            </Link>
          </div>
        ) : loading && orders === null ? (
          <div className="px-3 py-4 text-sm text-gray-500">Đang tải thông báo...</div>
        ) : !orders || orders.length === 0 ? (
          <div className="px-3 py-4 text-sm text-gray-500">Bạn chưa có thông báo nào.</div>
        ) : (
          orders.map((order) => (
            <DropdownMenuItem key={order.id} asChild className="rounded-lg cursor-pointer">
              <Link href={`/tai-khoan/don-hang/${order.id}`} className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-semibold">
                  Đơn hàng #{order.id} — {orderStatusLabel(order.payment_status)}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleDateString("vi-VN")} ·{" "}
                  {Number(order.total_amount).toLocaleString("vi-VN")} ₫
                </span>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenuLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="flex flex-col gap-1">
      {navLinks.map((item) => {
        // Match by pathname only (search-param disambiguation isn't needed in the list).
        const active = isNavActive(item.href, pathname, null);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-3 text-sm font-bold transition-colors ${
              active ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      {isLoaded && !isSignedIn && (
        <AuthButtons onNavigate={onNavigate} fullWidth className="mt-4 grid grid-cols-2 gap-2" />
      )}
    </div>
  );
}

export function MarketplaceHeader() {
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const keyword = searchTerm.trim();
    if (!keyword) return;
    router.push(`/cua-hang?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6 h-20 flex items-center justify-between gap-3 md:gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" width="32" height="32" className="text-[#00a4ef]">
              <path fill="currentColor" d="M0 12.402l35.687-4.86.016 34.423h-35.703v-29.563zm39.866-5.495l48.134-6.907v40.366h-48.134v-33.459zm0 41.01h48.134v40.354l-48.134-6.914v-33.44zm-39.866 1.439h35.703v29.585l-35.703-4.856v-24.729z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 leading-tight tracking-tight">WinKey</span>
            <span className="hidden sm:block text-[9px] text-gray-500 font-bold uppercase tracking-[0.1em] mt-[-2px]">Bản quyền &amp; Phần mềm</span>
          </div>
        </Link>

        {/* Search Bar (desktop only, from xl to avoid crowding navigation at lg) */}
        <form
          onSubmit={handleSearchSubmit}
          role="search"
          className={`hidden xl:flex flex-1 max-w-md items-center bg-gray-50 rounded-full px-4 py-2 border transition-all ${searchFocused ? 'border-blue-300 ring-2 ring-blue-100 bg-white' : 'border-transparent'}`}
        >
          <button type="submit" aria-label="Tìm kiếm" className="mr-2 flex items-center text-gray-400 hover:text-blue-600">
            <Search className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm kiếm sản phẩm, dịch vụ..."
            aria-label="Tìm kiếm sản phẩm, dịch vụ"
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </form>

        {/* Desktop Navigation */}
        <Suspense fallback={<NavLinks pathname="" currentTitle={null} />}>
          <HeaderNav />
        </Suspense>

        {/* Actions (Cart, Notif, User, Mobile toggle) */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-11 h-11 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={2.5} />
            {isMounted && cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          <NotificationBell />

          <UserMenu />

          {/* Mobile / tablet menu — off-canvas drawer sliding in from the right */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Mở menu"
                className="lg:hidden flex items-center justify-center w-11 h-11 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[88vw] max-w-[360px] sm:w-[400px] sm:max-w-[420px] gap-0 overflow-y-auto p-0 pb-[env(safe-area-inset-bottom)]"
            >
              <SheetHeader className="px-5 pt-5 pb-2">
                <SheetTitle className="text-base">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col px-5 pb-6">
                {/* Search inside the drawer (header search is desktop-only) */}
                <form
                  onSubmit={(event) => {
                    handleSearchSubmit(event);
                    setMobileOpen(false);
                  }}
                  role="search"
                  className="flex items-center bg-gray-50 rounded-full px-4 py-2.5 border border-transparent focus-within:border-blue-300 focus-within:bg-white mb-4"
                >
                  <button type="submit" aria-label="Tìm kiếm" className="mr-2 flex items-center text-gray-400 hover:text-blue-600">
                    <Search className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Tìm kiếm sản phẩm, dịch vụ..."
                    aria-label="Tìm kiếm sản phẩm, dịch vụ"
                    className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
                  />
                </form>
                <MobileMenuLinks onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
