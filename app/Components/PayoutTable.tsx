"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import usePayoutsStore from "@/app/store/usePayoutsStore"
import { useToast } from "@/app/Components/Toast"
import ErrorBanner from "@/app/Components/ErrorBanner"
import PaginationFooter from "@/app/Components/PaginationFooter"
import { formatCurrency, formatDate } from '@/app/lib/format';

const TABS = ['all', 'pending', 'processing', 'completed', 'failed'] as const;

const PayoutTable = () => {
  const {
    transactions,
    loading,
    error,
    actionLoading,
    pagination,
    filters,
    fetchPayouts,
    setFilter,
    approvePayout,
    rejectPayout,
  } = usePayoutsStore();

  const toast = useToast();
  const activeTab = filters.status || 'all';
  const [searchQuery, setSearchQuery] = useState(filters.search)

  // Exactly one fetch on mount.
  useEffect(() => {
    fetchPayouts(1);
  }, [fetchPayouts])

  // Debounced search; skipped when the input already matches the store.
  useEffect(() => {
    if (searchQuery === filters.search) return;
    const timeoutId = setTimeout(() => {
      setFilter('search', searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters.search, setFilter]);

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this payout? The withdrawal will be marked completed.')) return;
    try {
      await approvePayout(id);
      toast.success('Payout approved.');
    } catch {
      toast.error(usePayoutsStore.getState().error || 'Failed to approve payout.');
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Reject this payout? The amount will be returned to the seller\'s balance.')) return;
    try {
      await rejectPayout(id);
      toast.success('Payout rejected.');
    } catch {
      toast.error(usePayoutsStore.getState().error || 'Failed to reject payout.');
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  const columns = "grid grid-cols-[2.8fr_2fr_1.5fr_1.5fr_2fr_1.5fr_2fr] gap-6 px-4";

  return (
    <div className="min-h-screen p-4 mt-2">
      <div className="max-w-7xl mx-auto bg-white rounded-lg border border-gray-200">

        {/* Tabs + Search */}
        <div className="flex justify-between items-center px-4 border border-t-0 border-b-gray-200 border-l-[#EFEFEF] border-r-[#EFEFEF]">
          <div className="flex py-4 gap-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter('status', tab === 'all' ? '' : tab)}
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

        {error && <ErrorBanner message={error} className="m-4" />}

        {/* Table Header */}
        <div className={`${columns} py-6 border-b text-sm font-medium text-gray-600 border-[#EFEFEF]`}>
          <div>Payout ID</div>
          <div>Seller</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Payment Method</div>
          <div>Date</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#EFEFEF]">
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading payouts...</div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              {error ? 'Payouts could not be loaded.' : 'No payouts found'}
            </div>
          ) : (
            transactions.map(payout => {
              const busy = actionLoading === payout.id;
              return (
                <div
                  key={payout.id}
                  className={`${columns} py-4 hover:bg-gray-50 items-center`}
                >
                  {/* Payout ID */}
                  <div className="font-medium text-gray-900 pr-6 break-all">
                    {payout.id}
                  </div>

                  {/* Seller */}
                  <div>
                    <p className="font-medium text-gray-900">{payout.seller_name}</p>
                  </div>

                  {/* Amount — withdrawals are stored negative */}
                  <div className="font-medium">
                    {formatCurrency(Math.abs(Number(payout.amount)))}
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </div>

                  {/* Payment Method */}
                  <div className="capitalize">{payout.method?.replace(/_/g, ' ') || '—'}</div>

                  {/* Date */}
                  <div>{formatDate(payout.request_date)}</div>

                  {/* Actions: only a processing withdrawal can be decided */}
                  <div className="flex items-center justify-end gap-2">
                    {payout.status === 'processing' ? (
                      <>
                        <button
                          onClick={() => handleApprove(payout.id)}
                          disabled={busy}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#C9A227] text-white hover:bg-[#b08d21] disabled:opacity-50"
                        >
                          {busy ? '…' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(payout.id)}
                          disabled={busy}
                          className="px-3 py-1.5 text-xs font-medium rounded-md border border-red-500 text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <PaginationFooter pagination={pagination} onPageChange={fetchPayouts} />
      </div>
    </div>
  )
}

export default PayoutTable
