"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import usePayoutsStore from "@/app/store/usePayoutsStore"

const PayoutTable = () => {
  const {
    transactions,
    loading,
    pagination,
    filters,
    fetchPayouts,
    setFilter,
  } = usePayoutsStore();

  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "completed" | "failed"
  >("all")

  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Map tab to status filter
    const status = activeTab === 'all' ? '' : activeTab;
    setFilter('status', status);
  }, [activeTab]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter('search', searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    fetchPayouts();
  }, [])


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  return (
    <div className="min-h-screen p-4 mt-2">
      <div className="max-w-7xl mx-auto bg-white rounded-lg border border-gray-200">

        {/* Tabs + Search */}
        <div className="flex justify-between items-center px-4 border border-t-0 border-b-gray-200 border-l-[#EFEFEF] border-r-[#EFEFEF]">
          <div className="flex py-4 gap-4">
            {['all', 'pending', 'completed', 'failed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 capitalize ${activeTab === tab
                    ? "border-[#C9A227] text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab}
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
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading payouts...</div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No payouts found</div>
          ) : (
            transactions.map(listing => (
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
                  <p className="font-medium text-gray-900">{listing.seller_name}</p>
                  {/* <p className="text-sm text-gray-500">{listing.email}</p> Email might not be in response, check store type */}
                </div>

                {/* Amount */}
                <div className="font-medium">
                  ₦{listing.amount.toLocaleString()}
                </div>

                {/* Status */}
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="capitalize">{listing.method?.replace('_', ' ')}</div>

                {/* Date */}
                <div>{listing.request_date}</div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
          <span>Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
          <div className="flex gap-1">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchPayouts(pagination.page - 1)}
              className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchPayouts(pagination.page + 1)}
              className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayoutTable
