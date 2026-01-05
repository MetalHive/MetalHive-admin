import Link from "next/link";

const BidsOverviewTable = () => {
    const bids = [
  {
    id: "MH-8832-TR",
    listing: "Copper Wire",
    buyer: "Iron Works LTD.",
    placedOn: "Nov 10, 2025",
    amount: 1200,
    status: "Active",
  },
  {
    id: "MH-8832-TR",
    listing: "HMS 1&2 Scrap",
    buyer: "Heritage Atiba",
    placedOn: "Oct 24, 2024",
    amount: 400,
    status: "Suspended",
  },
  {
    id: "MH-8832-TR",
    listing: "Aluminum 6063",
    buyer: "James Fidelis",
    placedOn: "Oct 24, 2024",
    amount: 2000,
    status: "Suspended",
  },
  {
    id: "MH-8832-TR",
    listing: "Stainless Steel 304",
    buyer: "John Doe",
    placedOn: "Oct 28, 2024",
    amount: 100,
    status: "Active",
  },
  {
    id: "MH-8832-TR",
    listing: "Brass Honey",
    buyer: "John Livingstone",
    placedOn: "Oct 30, 2024",
    amount: 560,
    status: "Suspended",
  },
];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3  text-sm font-medium text-gray-700">
        Bids Overview
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className=" text-gray-500 border-2 border-[#EFEFEF] ">
            <tr>
              <th className="px-4 py-3 text-left">Bid ID</th>
              <th className="px-4 py-3 text-left">Listing</th>
              <th className="px-4 py-3 text-left">Buyer</th>
              <th className="px-4 py-3 text-left">Placed on</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EFEFEF]">
            {bids.map((bid, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-6 text-gray-700 flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  #{bid.id}
                </td>

                <td className="px-4 py-6 text-gray-700">
                  {bid.listing}
                </td>

                <td className="px-4 py-6 text-gray-700">
                  {bid.buyer}
                </td>

                <td className="px-4 py-6 text-gray-500">
                  {bid.placedOn}
                </td>

                <td className="px-4 py-6 font-medium text-gray-800">
                  ${bid.amount.toLocaleString()}
                </td>

                <td className="px-4 py-6">
                  <span
                    className={`text-xs font-medium ${
                      bid.status === "Active"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {bid.status}
                  </span>
                </td>

                <td className="px-4 py-6 text-right">
                   <Link
                    href={`/dashboard/listings/${bid.id}`} className="bg-[#C9A227] text-white text-xs px-4 py-2 rounded-md hover:opacity-90">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BidsOverviewTable;
