'use client'
import PayoutTable from '@/app/Components/PayoutTable';
import SideBar from '@/app/Components/Sidebar'
import { useState } from 'react';
import { FaSortDown } from "react-icons/fa";
import { LuCalendarRange } from "react-icons/lu";
const page = () => {
   const cards = [
          {
              key: '1',
              title: 'Total Listings',
              amount: '1,284',
              sub: 'Active listings',
          },
          {
              key: '2',
              title: 'Completed Transactions',
              amount: '842',
              sub: 'Successful trades',
          },
          {
              key: '3',
              title: 'Total transaction value',
              amount: '$2.4M',
              sub: 'Value of completed trades',
          },
          {
              key: '4',
              title: 'Active Users',
              amount: '612',
              sub: 'Total number of users',
          },
      ]
      const [open, setOpen] = useState(false);
      const [selected, setSelected] = useState("30 days");
  return (
<div className='flex min-h-screen'>
            <SideBar />
            <div className='flex-1 p-6 '>
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                                  <div>
                                      <h1 className="text-3xl font-normal text-[#17181A]">Payouts</h1>
                                      <p className="text-[#737780]">Review and manage seller payout requests.</p>
                                  </div>
                                  <div>
                                      <div className="relative">
                                          <button
                                              onClick={() => setOpen(!open)}
                                              className="flex items-center gap-3 border border-gray-300 rounded-md px-4 py-2 text-[15px] font-normal hover:bg-gray-50"
                                          >
                                              <LuCalendarRange className="text-black text-[18px]" />
                                              <span className="text-black">{selected}</span>
                                              <FaSortDown className="text-black text-[18px]" />
                                          </button>
              
                                          {open && (
                                              <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
                                                  {["30 days", "2 weeks", "7 days", "24 hours"].map((opt) => (
                                                      <button
                                                          key={opt}
                                                          onClick={() => {
                                                              setSelected(opt);
                                                              setOpen(false);
                                                          }}
                                                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[15px] font-normal"
                                                      >
                                                          {opt}
                                                      </button>
                                                  ))}
                                              </div>
                                          )}
                                      </div>
              
                                  </div>
                              </div>
                               {/* second sec */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card, index) => (
                     <div className="w-56" key={index}>
  <div className="h-[110px] rounded-xl border border-gray-200 bg-white p-4 flex flex-col justify-between">
    <p className="text-sm text-gray-400 flex items-center gap-2">
     {card.title}</p>

    <p className="text-2xl font-semibold text-gray-900">
     $842
    </p>
  </div>
</div>

                    ))}
                </div>
                <PayoutTable />
              </div>
              </div>
  )
}

export default page