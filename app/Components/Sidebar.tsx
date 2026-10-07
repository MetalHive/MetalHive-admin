"use client"

import { useState } from 'react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Menu,
    X,
    LayoutDashboard,
    ShieldCheck,
    Users,
    Package,
    Gavel,
    CreditCard,
    Wallet,
    LogOut,
    type LucideIcon,
} from "lucide-react"
import useAuthStore from '@/app/store/useAuthStore'

interface NavLink {
    label: string;
    href: string;
    icon: LucideIcon;
}

const links: NavLink[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Buyer Verification",
        href: "/dashboard/verification",
        icon: ShieldCheck,
    },
    {
        label: "Users",
        href: "/dashboard/users",
        icon: Users,
    },
    {
        label: "Listings",
        href: "/dashboard/listings",
        icon: Package,
    },
    {
        label: "Bids & Transactions",
        href: "/dashboard/bids",
        icon: Gavel,
    },
    {
        label: "Subscriptions",
        href: "/dashboard/subscriptions",
        icon: CreditCard,
    },
    {
        label: "Payouts",
        href: "/dashboard/payouts",
        icon: Wallet,
    },
]

// Detail pages (/dashboard/users/42) should light up their section, so match
// by prefix. The dashboard root is matched exactly or it would always be lit.
const isActiveLink = (pathname: string, href: string) =>
    href === '/dashboard'
        ? pathname === '/dashboard' || pathname === '/'
        : pathname === href || pathname.startsWith(`${href}/`)

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { logout, isLoading } = useAuthStore()

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/30 z-30"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 bg-white shadow-xl z-40
          transition-transform duration-300 ease-in-out h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          w-80
        `}
            >
                <div className="p-6 flex flex-col h-full">
                    {/* Logo */}
                    <div className="mb-8">
                        <Image
                            src="/logoBlack.png"
                            width={120}
                            height={120}
                            alt="MetalHive black logo"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                        {links.map((link) => {
                            const isActive = isActiveLink(pathname, link.href)
                            const Icon = link.icon

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                    flex items-center justify-between gap-4 px-4 py-3 rounded-lg transition-colors
                    ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'}
                  `}
                                >
                                    <div className="flex items-center gap-4">
                                        <Icon
                                            size={24}
                                            className={isActive ? 'text-yellow-600' : 'text-gray-600'}
                                        />
                                        <span
                                            className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'
                                                }`}
                                        >
                                            {link.label}
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="mt-auto pt-6 border-t border-gray-200">
                        <button
                            onClick={() => logout()}
                            disabled={isLoading}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            <LogOut size={24} className="text-gray-600" />
                            <span className="font-medium">{isLoading ? 'Signing out…' : 'Log out'}</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
