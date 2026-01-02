'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiEdit3 } from "react-icons/fi";
import { CgTrash } from "react-icons/cg";
interface Listing {
  id: string
  image: string
  title: string
  type?: string
  color?: string
  size?: string | number
  quantity: number
  bids: number
  price: string
  status: 'Active' | 'Sold' | 'Inactive'
}

const listingsData: Listing[] = [
  {
    id: '1',
    image: '/bid2.png',
    title: 'Copper Scrap Bundle',
    type: 'Copper',
    size: '200KG',
    quantity: 2,
    bids: 12,
    price: '$26.35',
    status: 'Active',
  },
  {
    id: '2',
    image: '/bid1.png',
    title: 'Nike Air Jordan Reflex',
    color: 'Black',
    size: 23,
    quantity: 2,
    bids: 5,
    price: 'Credit card',
    status: 'Active',
  },
  {
    id: '3',
    image: '/bid3.png',
    title: 'Nike Air Jordan Reflex',
    color: 'Black',
    size: 23,
    quantity: 2,
    bids: 7,
    price: 'Credit card',
    status: 'Active',
  },
  {
    id: '4',
    image: '/bid4.png',
    title: 'Nike Air Jordan Reflex',
    color: 'Black',
    size: 23,
    quantity: 2,
    bids: 10,
    price: 'Credit card',
    status: 'Active',
  },
]

const ListingsTable = () => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Sold' | 'Inactive'>('Active')

  const filteredListings = listingsData.filter((l) => l.status === activeTab)

  const statusColors: Record<Listing['status'], string> = {
    Active: 'bg-green-100 text-green-700',
    Sold: 'bg-gray-100 text-gray-700',
    Inactive: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="w-full bg-white p-6 rounded">
      {/* Header with search */}
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-lg font-semibold">Listings</h2>
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
        />
      </div>

      {/* Tabs */}
     <div className="flex justify-between items-center gap-4 mb-4 border-b border-gray-200">
  {/* Tabs */}
  <div className="flex gap-4">
    {['Active', 'Sold', 'Inactive'].map((tab) => (
      <button
        key={tab}
        className={`pb-2 text-sm font-medium transition ${
          activeTab === tab
            ? 'border-b-2 border-[#C9A227] text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab(tab as any)}
      >
        {tab} ({listingsData.filter((l) => l.status === tab).length})
      </button>
    ))}
  </div>

  {/* Action Buttons */}
  <div className="flex gap-2">
    <button className="flex items-center gap-1 px-3 py-1 ">
      <FiEdit3 className="w-4 h-4" />
      <span>Edit</span>
    </button>

    <button className="flex items-center gap-1 px-3 py-1  ">
      <CgTrash className="w-4 h-4" />
      <span>Delete</span>
    </button>
  </div>
</div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Listing
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bids</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredListings.map((row) => (
        <tr key={row.id} className="hover:bg-gray-50">
  {/* Listing with image & details */}
  <td className="px-2 py-3">
    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
      <input type="checkbox" className="h-4 w-4" />
      <div className="grid grid-cols-[48px_1fr] items-center gap-2">
        <div className="w-12 h-12 relative">
          <Image
            src={row.image}
            alt={row.title}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="flex flex-col text-sm text-gray-700">
          <span className="font-medium">{row.title}</span>
          {row.type && (
            <span className="text-gray-400 text-xs">
              Type: {row.type} | Size: {row.size} | Qty: {row.quantity}
            </span>
          )}
          {row.color && (
            <span className="text-gray-400 text-xs">
              Color: {row.color} | Size: {row.size} | Qty: {row.quantity}
            </span>
          )}
        </div>
      </div>
    </div>
  </td>

  <td className="px-2 py-3 text-sm text-gray-600 text-center">{row.bids}</td>
  <td className="px-2 py-3 text-sm text-gray-600 text-center">{row.price}</td>
  <td className="px-2 py-3 text-center">
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${statusColors[row.status]}`}
    >
      {row.status}
    </span>
  </td>
  <td className="px-2 py-3 text-center">
    <Link
      href={`/dashboard/listings/${row.id}`}
      className="text-[#C9A227] text-sm font-medium hover:underline"
    >
      View Listing
    </Link>
  </td>
</tr>
            ))}

            {filteredListings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-400">
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListingsTable
