'use client'

import Image from 'next/image'
import useAuthStore from '@/app/store/useAuthStore'

const TopBar = () => {
  const { user } = useAuthStore()

  // /auth/me exposes id, email and role only, so the email is the best label
  // we have for the signed-in admin.
  const label = user?.email ?? 'Admin'
  const initials = label.slice(0, 2).toUpperCase()

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

      {/* Right - User */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
          {initials}
        </div>

        <div className="hidden sm:flex flex-col leading-tight">
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
      </div>
    </header>
  )
}

export default TopBar
