"use client"

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
    LayoutDashboard,
    ShieldCheck,
    Users,
    Package,
    Gavel,
    CreditCard,
    Wallet,
} from "lucide-react"



export default function SideBar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const toggleSidebar = () => setIsOpen(!isOpen)
    const links = [
        {
            label: "Dashboard",
            href: "/",
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

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
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
                <div className="p-6">
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
                        {links.map((link: any) => {
                            const isActive = pathname === link.href
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

                                    {link.badge && (
                                        <span className="text-gray-400 font-medium">
                                            {link.badge}
                                        </span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </aside>
        </>
    )
}
