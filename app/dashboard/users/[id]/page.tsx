import SideBar from "@/app/Components/Sidebar"
import ListingsTable from "@/app/Components/userListingTable"
import { ChevronLeft, Edit, Shield, Trash2 } from 'lucide-react';

interface UserProfileHeaderProps {
  userId?: string;
  userName?: string;
  accountType?: string;
  totalSales?: number;
  activeListings?: number;
  reputation?: number;
  listingsSold?: number;
}
const UserProfile: React.FC<UserProfileHeaderProps> = ({
  userId = '#7D-1234',
  userName = 'Alex Mercer',
  accountType = 'Seller account',
  totalSales = 142500,
  activeListings = 12,
  reputation = 4.8,
  listingsSold = 12240
}) => {
  return (
    <div className='flex min-h-screen bg-[#EFEFEF]'>
      <SideBar />
      <div className='flex-1 p-6'>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button className="flex items-center gap-1 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
        <div className="flex  justify-between ">

        <div className="flex items-center gap-2  text-gray-600 mb-8">
          <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <span className="hover:text-gray-900 cursor-pointer">Users</span>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <span className="text-gray-900 font-medium">{userName}</span>
        </div>
        <div>
 <button className="flex items-center gap-4">
                  <Edit className="w-4 h-4 text-gray-700" />
                  Edit Profile
                </button>
        </div>
        </div>

        {/* Profile Card */}
        <div className="">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                </div>

                {/* User Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-900">{userName}</h1>
                    <span className="text-gray-500">{userId}</span>
                  </div>
                  <p className="text-sm text-gray-600 p-2 mt-1 bg-white rounded-lg shadow-sm">{accountType}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Shield className="w-4 h-4" />
                  Suspend Account
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
               
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-4  mb-20 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalSales.toLocaleString()}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Active Listings</p>
              <p className="text-2xl font-semibold text-gray-900">{activeListings}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Reputation</p>
              <p className="text-2xl font-semibold text-gray-900">{reputation}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Listings Sold</p>
              <p className="text-2xl font-semibold ">
                +${listingsSold.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <ListingsTable />
      </div>
    </div>
  );
}

export default UserProfile