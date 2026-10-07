'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SideBar from "@/app/Components/Sidebar"
import { ChevronLeft, Shield, ShieldOff, Trash2, Loader2 } from 'lucide-react';
import useUsersStore, { UserStatus } from '@/app/store/useUsersStore';
import { useToast } from "@/app/Components/Toast";
import ErrorBanner from '@/app/Components/ErrorBanner';
import { formatDate } from '@/app/lib/format';

const UserProfile = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ? String(params.id) : '';
  const router = useRouter();
  const { userDetails, fetchUserDetails, loading, error, updateUserStatus, deleteUser } = useUsersStore();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserDetails(id);
    }
  }, [id, fetchUserDetails]);

  const toast = useToast();

  // The status PATCH goes out as soon as the admin confirms; the store then
  // refetches this user (comparing ids as strings) so the Status card updates.
  const handleStatusChange = async (status: UserStatus) => {
    if (!id) return;
    const question = status === 'suspended'
      ? 'Suspend this account? The user will no longer be able to sign in.'
      : 'Reactivate this account? The user will be able to sign in again.';
    if (!window.confirm(question)) return;

    setBusy(true);
    try {
      await updateUserStatus(id, status);
      toast.success(status === 'suspended' ? 'Account suspended.' : 'Account activated.');
    } catch {
      toast.error(useUsersStore.getState().error || 'Failed to update user status.');
    } finally {
      setBusy(false);
    }
  }

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setBusy(true);
    try {
      await deleteUser(id);
      toast.success('User deleted.');
      router.push('/dashboard/users');
    } catch {
      toast.error(useUsersStore.getState().error || 'Failed to delete user.');
      setBusy(false);
    }
  }

  if (loading && !userDetails) {
    return (
      <div className='flex min-h-screen bg-[#EFEFEF] items-center justify-center'>
        <Loader2 className="animate-spin h-8 w-8 text-black" />
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className='flex min-h-screen bg-[#EFEFEF]'>
        <SideBar />
        <div className='flex-1 p-6'>
          <ErrorBanner message={error || "User not found"} />
          <button onClick={() => router.back()} className="mt-4 text-blue-500">Go Back</button>
        </div>
      </div>
    );
  }

  // `name` is the display name; first_name/last_name are usually empty.
  const displayName = userDetails.name || userDetails.email;
  const initial = displayName.charAt(0).toUpperCase();
  const isSuspended = userDetails.status === 'suspended';

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
            <span className="hover:text-gray-900 cursor-pointer" onClick={() => router.push('/dashboard')}>Dashboard</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="hover:text-gray-900 cursor-pointer" onClick={() => router.push('/dashboard/users')}>Users</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="text-gray-900 font-medium">{displayName}</span>
          </div>
        </div>

        {error && <ErrorBanner message={error} className="mb-6" />}

        {/* Profile Card */}
        <div className="">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                  {initial}
                </div>

                {/* User Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-900">{displayName}</h1>
                    <span className="text-gray-500 text-sm">ID: {userDetails.id}</span>
                  </div>
                  <p className="text-sm text-gray-600 p-2 mt-1 bg-white rounded-lg shadow-sm w-fit capitalize">{userDetails.user_type}</p>
                  <p className="text-sm text-gray-500 mt-1">{userDetails.email}</p>
                  {userDetails.company_name && (
                    <p className="text-sm text-gray-500">{userDetails.company_name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isSuspended ? (
                  <button
                    onClick={() => handleStatusChange('active')}
                    disabled={busy}
                    className="flex items-center gap-2 px-4 py-2 border border-green-300 bg-green-50 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
                  >
                    <Shield className="w-4 h-4" />
                    {busy ? 'Working…' : 'Activate Account'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange('suspended')}
                    disabled={busy}
                    className="flex items-center gap-2 px-4 py-2 border border-yellow-300 bg-yellow-50 rounded-lg text-sm font-medium text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
                  >
                    <ShieldOff className="w-4 h-4" />
                    {busy ? 'Working…' : 'Suspend Account'}
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  disabled={busy}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>

              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 mb-20 gap-6 mt-6">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className={`text-2xl font-semibold capitalize ${isSuspended ? 'text-red-600' : 'text-green-700'}`}>
                {userDetails.status}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Date Joined</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(userDetails.date_joined)}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Last Login</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(userDetails.last_login)}
              </p>
            </div>
          </div>
        </div>

        {/* Contact / profile details from AdminUserProfileSerializer */}
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Profile Details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 py-2">
              <dt className="text-gray-500">Phone</dt>
              <dd className="font-medium text-gray-900">{userDetails.phone || '—'}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <dt className="text-gray-500">Country</dt>
              <dd className="font-medium text-gray-900">{userDetails.country || '—'}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <dt className="text-gray-500">City</dt>
              <dd className="font-medium text-gray-900">{userDetails.city || '—'}</dd>
            </div>
            {userDetails.profile_details &&
              Object.entries(userDetails.profile_details).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-100 py-2">
                  <dt className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</dt>
                  <dd className="font-medium text-gray-900 text-right">{value || '—'}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default UserProfile
