'use client'

import { useState } from 'react'
import Link from 'next/link'
import {  Trash2 } from "lucide-react";

interface Listing {
  id: string
  seller: string
  email: string
  status: 'Active' | 'Suspended'
  bids: number
  dateListed: string
  material: string
}

const listingsData: Listing[] = [
  {
    id: 'Copper Scrap – 200kg',
    seller: 'Heritage Atiba',
    email: 'heritage@gmail.com',
    status: 'Active',
    bids: 2,
    dateListed: 'Aug 12, 2025',
    material: '',
  },
  {
    id: 'Copper Scrap – 200kg',
    seller: 'Heritage Atiba',
    email: 'heritage@gmail.com',
    status: 'Suspended',
    bids: 4,
    dateListed: 'HMS 182 Scrap',
    material: '',
  },
  {
    id: 'Copper Scrap – 200kg',
    seller: 'Heritage Atiba',
    email: 'heritage@gmail.com',
    status: 'Suspended',
    bids: 35,
    dateListed: 'Aluminum 6063',
    material: '',
  },
  {
    id: 'Copper Scrap – 200kg',
    seller: 'Heritage Atiba',
    email: 'heritage@gmail.com',
    status: 'Active',
    bids: 10,
    dateListed: 'Stainless Steels 304',
    material: '',
  },
  {
    id: 'Copper Scrap – 200kg',
    seller: 'Heritage Atiba',
    email: 'heritage@gmail.com',
    status: 'Suspended',
    bids: 9,
    dateListed: 'Brass Honey',
    material: '',
  },
]

const TableWithTabs = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Suspended'>('All')

  const filteredListings =
    activeTab === 'All' ? listingsData : listingsData.filter((l) => l.status === activeTab)

  const handleDelete = (row: Listing) => {
    console.log('Deleting:', row.id)
  }

  const statusColors: Record<Listing['status'], string> = {
    Active: 'text-green-500',
    Suspended: 'text-red-500',
  }

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {['All', 'Active', 'Suspended'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2  font-medium transition ${
                activeTab === tab
                  ? 'border-b-2 border-[#C9A227] text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab} ({tab === 'All' ? listingsData.length : listingsData.filter(l => l.status === tab).length})
            </button>
          ))}
        </div>

        {/* Search & Delete (placeholder) */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
          />
          <div className=" flex gap-4 items-center">
              <Trash2 size={20} />
         <p className='text-lg'>Delete</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Listing
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Seller</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Bids</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date Listed</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredListings.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-800">{row.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div>{row.seller}</div>
                  <div className="text-xs text-gray-400">{row.email}</div>
                </td>
                <td className={`px-4 py-3 text-sm font-medium ${statusColors[row.status]}`}>
                  {row.status}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.bids}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.dateListed}</td>
                <td className="px-4 py-3 text-sm flex gap-2">
                  <Link
                    href={`/dashboard/listings/${row.id}`}
                    className="bg-[#C9A227] text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(row)}
                    className="border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredListings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-400">
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

export default TableWithTabs
