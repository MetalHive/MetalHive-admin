'use client'

import { Bell } from 'lucide-react'
import Image from 'next/image'

const TopBar = () => {
  return (
    <header className="w-full h-16 bg-white flex items-center px-4 sm:px-6 lg:px-8 justify-between shadow-sm">
      {/* Left - Logo */}
      <div className="flex items-center">
        <Image
          src="/logoBlack.png"
          width={120}
          height={120}
          alt="MetalHive black logo"
          className="w-24 sm:w-28 md:w-32 h-auto"
        />
      </div>

      {/* Right - Notifications + User */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
            CC
          </div>

          {/* Name & role */}
          <div className="hidden sm:flex flex-col leading-tight">
            <p className="text-sm font-medium text-gray-800">Carbon Copy</p>
            <p className="text-xs text-gray-500">Verified buyer</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
