'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SideBar from "@/app/Components/Sidebar"
// import ListingsTable from "@/app/Components/userListingTable" // Temporarily commenting out or will use but it might not be connected yet
import { ChevronLeft, Edit, Shield, Trash2, Loader2 } from 'lucide-react';
import useUsersStore from '@/app/store/useUsersStore';

const UserProfile = () => {
  const { id } = useParams();
  const router = useRouter();
  const { userDetails, fetchUserDetails, loading, error, updateUserStatus, deleteUser } = useUsersStore();

  useEffect(() => {
    if (id) {
      fetchUserDetails(id as string);
    }
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (id && confirm(`Are you sure you want to change user status to ${status}?`)) {
      await updateUserStatus(id as string, status);
    }
  }

  const handleDelete = async () => {
    if (id && confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(id as string);
      router.push('/dashboard/users');
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-screen bg-[#EFEFEF] items-center justify-center'>
        <Loader2 className="animate-spin h-8 w-8 text-black" />
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className='flex min-h-screen bg-[#EFEFEF]'>
        <SideBar />
        <div className='flex-1 p-6'>
          <div className="text-red-500">{error || "User not found"}</div>
          <button onClick={() => router.back()} className="mt-4 text-blue-500">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-[#EFEFEF]'>
      <SideBar />
      <div className='flex-1 p-6'>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
        <div className="flex  justify-between ">

          <div className="flex items-center gap-2  text-gray-600 mb-8">
            <span className="hover:text-gray-900 cursor-pointer" onClick={() => router.push('/')}>Dashboard</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="hover:text-gray-900 cursor-pointer" onClick={() => router.push('/dashboard/users')}>Users</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="text-gray-900 font-medium">{userDetails.first_name} {userDetails.last_name}</span>
          </div>
          <div>
            {/* <button className="flex items-center gap-4">
                  <Edit className="w-4 h-4 text-gray-700" />
                  Edit Profile
            </button> */}
          </div>
        </div>

        {/* Profile Card */}
        <div className="">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                  {userDetails.first_name?.[0]}
                </div>

                {/* User Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-900">{userDetails.first_name} {userDetails.last_name}</h1>
                    <span className="text-gray-500 text-sm">ID: {userDetails.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 p-2 mt-1 bg-white rounded-lg shadow-sm w-fit capitalize">{userDetails.user_type}</p>
                  <p className="text-sm text-gray-500 mt-1">{userDetails.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
<<<<<<< HEAD
                {userDetails.status !== 'suspended' ? (
                  <button
                    onClick={() => handleStatusChange('suspended')}
                    className="flex items-center gap-2 px-4 py-2 border border-yellow-300 bg-yellow-50 rounded-lg text-sm font-medium text-yellow-700 hover:bg-yellow-100"
                  >
                    <Shield className="w-4 h-4" />
                    Suspend Account
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="flex items-center gap-2 px-4 py-2 border border-green-300 bg-green-50 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100"
                  >
                    <Shield className="w-4 h-4" />
                    Activate Account
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
=======
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                   onClick={() => setModalType("SUSPEND_ACCOUNT")}>
                  <Shield className="w-4 h-4" />
                  Suspend Account
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                   onClick={() => setModalType("DELETE_LISTING")}>
>>>>>>> 859b2a077a31bef22ef788d729fc99da966f787b
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>

              </div>
            </div>
          </div>

          {/* Stats Section - Placeholder values or data if available in userDetails extra props if API sends valid data */}
          <div className="grid grid-cols-4  mb-20 gap-6 mt-6">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-2xl font-semibold text-gray-900 capitalize">
                {userDetails.status}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Date Joined</p>
              <p className="text-lg font-semibold text-gray-900">
                {userDetails.date_joined || 'N/A'}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Last Login</p>
              <p className="text-lg font-semibold text-gray-900">
                {userDetails.last_login || 'N/A'}
              </p>
            </div>
            {/*
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Listings Sold</p>
              <p className="text-2xl font-semibold ">
                +${listingsSold.toLocaleString()}
              </p>
            </div>
            */}
          </div>
        </div>

        {/* Listings Table - Temporarily using the main Listings Table if we want to show all, or just text for now */}
        {/* <ListingsTable /> */}
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">User Listings</h3>
          <p className="text-gray-500 italic">User specific listings view coming soon.</p>
        </div>
      </div>
          {modalType && (
              <Modal
                type={modalType}
                isOpen={true}
                onClose={() => setModalType(null)}
              />
            )}
    </div>
  );
}

export default UserProfile