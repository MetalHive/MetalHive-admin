'use client'
import { useState } from 'react';
import { Star, MapPin, Package, Scale } from 'lucide-react';
import Link from 'next/link'
import { FaArrowLeftLong } from "react-icons/fa6";
import TopBar from '@/app/Components/TopBar'
import BidsOverviewTable from '@/app/Components/Bidsoverview';
import { Modal } from '@/app/Components/Modal';
interface ListingData {
    id: string;
    title: string;
    weight: string;
    seller: string;
    price: number;
    rating: number;
    type: string;
    quantity: string;
    location: string;
    description: string;
    images: string[];
    createdDate: string;
    priceNote: string;
    listingId: string
}
const sampleListing: ListingData = {
    id: '1',
    title: 'Aluminium Sheets',
    weight: '500kg',
    seller: 'Metal Recycling Ltd.',
    price: 18.00,
    rating: 5,
    type: 'Copper Scrap',
    quantity: '500kg',
    location: 'Birmingham',
    listingId: '#MH-8832-TR',
    description: 'This copper scrap batch is clean, well-sorted, and ready for immediate pickup. Material has low moisture content and consistent grade, suitable for recycling or industrial use.',
    images: [
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    ],
    createdDate: '12-07-2025',
    priceNote: 'Final price depends on your bid.'
};

const ScrapMetalListing: React.FC<{ data?: ListingData }> = ({ data = sampleListing }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalType, setModalType] = useState<string | null>(null);

    return (
        <div className="">
            <TopBar />
            <div className="w-full p-20">
                {/* Back Button */}
                <button className=" text-gray-600 mb-4 hover:text-gray-900">
                    <FaArrowLeftLong className="w-5 h-5" />
                </button>
                <div className="grid md:grid-cols-10 gap-8 p-6 ">
                    {/* Left Column - Images */}
                    <div className=' col-span-5'>

                        {/* Product Title and Date */}
                        <div className='mb-10'>
                            <h1 className="text-2xl font-bold mb-1">{data.title}</h1>
                            <p className="text-sm text-gray-500 mb-4">
                                Listing created on {data.createdDate}
                            </p>

                            {/* Description Section */}
                            <div className="my-6">
                                <h3 className="text-sm font-semibold mb-2">Description</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {data.description}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div>
                                <h3 className='text-gray-500 mb-2'>Seller Information</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex items-start gap-2">
                                        <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Offer</p>
                                            <p className="text-sm font-semibold">${data.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Location</p>
                                            <p className="text-sm font-semibold">{data.location}, UK</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Scale className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Weight</p>
                                            <p className="text-sm font-semibold">{data.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Image Carousel */}
                        <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4">
                            <img
                                src={data.images[currentImageIndex]}
                                alt={data.title}
                                className="w-full h-80 object-cover"
                            />

                            {/* Image Dots */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {data.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                            ? 'bg-white w-6'
                                            : 'bg-white/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>


                    </div>

                    {/* Right Column - Details */}
                    <div className='col-span-full md:col-start-8 md:col-span-4'>
                        {/* Seller Info */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-1">{data.seller}</p>
                            <h3 className="text-xl font-semibold mb-2">{data.title}</h3>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < data.rating
                                            ? 'fill-black text-black'
                                            : 'fill-gray-200 text-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Price */}
                            <p className="text-3xl font-bold mb-2">${data.price.toFixed(2)}</p>
                            <p className="text-sm text-[#C9A227] flex items-center gap-1">
                                <span className="text-[#C9A227]">⚠</span>
                                {data.priceNote}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Type</span>
                                <span className="text-sm font-medium">{data.type}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Quantity</span>
                                <span className="text-sm font-medium">{data.quantity}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Location</span>
                                <span className="text-sm font-medium">{data.location}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Listing Id</span>
                                <span className="text-sm font-medium">{data.listingId}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Created On</span>
                                <span className="text-sm font-medium">{data.createdDate}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">


                            <button className=" w-full hover:bg-white bg-[#FF0000] hover:text-[#FF0000] text-white font-semibold py-3  border  hover:border-[#FF0000] rounded-md" 
                             onClick={() => setModalType("DELETE_LISTING")}>
                                Delete listing
                            </button>
                           
                                <button className="w-full bg-[#C9A227] hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors"
                                 onClick={() => setModalType("SUSPEND_LISTING")}>
                                    Suspend Listing
                                </button>
                           
                        </div>
                    </div>
                </div>
                <BidsOverviewTable />
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
};

export default ScrapMetalListing;