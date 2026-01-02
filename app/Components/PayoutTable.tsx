"use client"

import { useState } from "react"
import { Search } from "lucide-react"

type Listing = {
  id: string
  name: string
  email: string
  status: "Paid" | "Pending" | "Failed"
  dateJoined: string
  amount: number
  paymentMethod: string
}

const listings: Listing[] = [
  {
    id: "#MH-8832-TR",
    name: "John Doe",
    email: "john.doe@email.com",
    status: "Paid",
    amount: 250000,
    paymentMethod: "Card",
    dateJoined: "2024-06-12",
  },
  {
    id: "#MH-7714-TR",
    name: "Amaka Okorie",
    email: "amaka.okorie@email.com",
    status: "Pending",
    amount: 180000,
    paymentMethod: "Bank Transfer",
    dateJoined: "2024-08-03",
  },
  {
    id: "#MH-6621-TR",
    name: "David Musa",
    email: "david.musa@email.com",
    status: "Failed",
    amount: 320000,
    paymentMethod: "Wallet",
    dateJoined: "2023-11-21",
  },
  {
    id: "#MH-5409-TR",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    status: "Paid",
    amount: 150000,
    paymentMethod: "Card",
    dateJoined: "2024-02-14",
  },
  {
    id: "#MH-3127-TR",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    status: "Pending",
    amount: 500000,
    paymentMethod: "Bank Transfer",
    dateJoined: "2023-05-09",
  },
]

const ListingsDashboard = () => {
 const [activeTab, setActiveTab] = useState<
  "all" | "pending" | "paid" | "failed"
>("all")

  const [searchQuery, setSearchQuery] = useState("")

  const pendingListings = listings.filter(l => l.status === "Pending")
  const paidListings = listings.filter(l => l.status === "Paid")
  const failedListings = listings.filter(l => l.status === "Failed")

const displayedListings =
  activeTab === "all"
    ? listings
    : activeTab === "pending"
    ? pendingListings
    : activeTab === "paid"
    ? paidListings
    : failedListings


  return (
    <div className="min-h-screen p-4 mt-2">
      <div className="max-w-7xl mx-auto bg-white rounded-lg border border-gray-200">
        
        {/* Tabs + Search */}
        <div className="flex justify-between items-center px-4 border border-t-0 border-b-gray-200 border-l-[#EFEFEF] border-r-[#EFEFEF]"
>
         <div className="flex py-4 ">
  {[
    { key: "all", label: "All", count: listings.length },
    { key: "pending", label: "Pending", count: pendingListings.length },
    { key: "paid", label: "Paid", count: paidListings.length },
    { key: "failed", label: "Failed", count: failedListings.length },
  ].map(tab => (
    <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key as any)}
      className={`px-6 py-3 text-sm font-medium border-b-2 ${
        activeTab === tab.key
          ? "border-[#C9A227] text-black"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {tab.label} ({tab.count})
    </button>
  ))}
</div>


          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-[#EFEFEF]"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[2.8fr_2fr_2fr_1.5fr_2fr_2fr] gap-10 px-4 py-6 border-b text-sm font-medium text-gray-600 border-[#EFEFEF] ">
          <div>Payout ID</div>
          <div>Seller</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Payment Method</div>
          <div>Date</div>
        </div>

        {/* Rows */}
            <div className="divide-y divide-[#EFEFEF]">
          {displayedListings.map(listing => (
            <div
              key={listing.id}
              className="grid grid-cols-[2.8fr_2fr_2fr_1.5fr_2fr_2fr] gap-10 px-4 py-4 hover:bg-gray-50 "
            >
              {/* Payout ID */}
              <div className="font-medium text-gray-900 pr-6">
                {listing.id}
              </div>

              {/* Seller */}
              <div>
                <p className="font-medium text-gray-900">{listing.name}</p>
                <p className="text-sm text-gray-500">{listing.email}</p>
              </div>

              {/* Amount */}
              <div className="font-medium">
                ₦{listing.amount.toLocaleString()}
              </div>

              {/* Status */}
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listing.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : listing.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {listing.status}
                </span>
              </div>

              {/* Payment Method */}
              <div>{listing.paymentMethod}</div>

              {/* Date */}
              <div>{listing.dateJoined}</div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {displayedListings.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No {activeTab} payouts found
          </div>
        )}
      </div>
    </div>
  )
}

export default ListingsDashboard
