// app/(account-pages)/trips/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LeaveReviewForm, { ReviewData as SubmittedReviewData } from '../reviews/components/LeaveReviewForm';
import RaiseDisputeForm, { DisputeData as SubmittedDisputeData } from '../disputes/components/RaiseDisputeForm';

// Define Trip and Listing types
interface TripListing {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  hostName?: string;
}

// Extended Trip interface for dispute status
export type DisputeStatus = "Dispute Open" | "Awaiting Host Response" | "Admin Reviewing" | "Resolved" | "Closed";

interface Trip {
  id: string; // Booking ID
  listing: TripListing;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'upcoming' | 'current' | 'previous' | 'cancelled';
  hasBeenReviewed?: boolean;
  // Dispute related fields
  disputeId?: string; // If a dispute exists
  disputeStatus?: DisputeStatus;
  disputeRaisedAt?: string; // ISO date string
}

type TabName = 'pending' | 'upcoming' | 'current' | 'previous';

// Mock data for trips - replace with actual data fetching
const mockTripsData: Trip[] = [
  {
    id: 'trip1',
    listing: { id: 'l1', name: 'Sunny Beachfront Condo', imageUrl: 'https://via.placeholder.com/150/FFC107/000000?Text=Beach+Condo', location: 'Miami, USA', hostName: 'John D.' },
    checkInDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ended 2 days ago
    guests: 2, totalPrice: 750, status: 'previous', hasBeenReviewed: true,
  },
  {
    id: 'trip2',
    listing: { id: 'l2', name: 'Cozy Downtown Studio', imageUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?Text=Studio+Apt', location: 'New York, USA', hostName: 'Sarah L.' },
    checkInDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    guests: 1, totalPrice: 600, status: 'upcoming',
  },
  {
    id: 'trip5', // For dispute testing
    listing: { id: 'l5', name: 'Chic Parisian Apartment', imageUrl: 'https://via.placeholder.com/150/2196F3/FFFFFF?Text=Paris+Apt', location: 'Paris, France', hostName: 'Amelie C.' },
    checkInDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ended 20 days ago
    checkOutDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ended 15 days ago - still in 14 day dispute window for this mock
    guests: 2, totalPrice: 1200, status: 'previous', hasBeenReviewed: false,
    disputeId: 'D123', disputeStatus: 'Awaiting Host Response', disputeRaisedAt: new Date(Date.now() - 1 * 24*60*60*1000).toISOString(),
  },
  {
    id: 'trip6', // For dispute testing - eligible to raise
    listing: { id: 'l6', name: 'Mountain Hideaway', imageUrl: 'https://via.placeholder.com/150/FF5722/FFFFFF?Text=Hideaway', location: 'Denver, USA', hostName: 'Greg P.' },
    checkInDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ended 10 days ago
    checkOutDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    guests: 2, totalPrice: 400, status: 'previous', hasBeenReviewed: false,
  },
   {
    id: 'trip7', // For dispute testing - cancelled
    listing: { id: 'l7', name: 'Lakeside Cabin', imageUrl: 'https://via.placeholder.com/150/00BCD4/FFFFFF?Text=Lakeside', location: 'Michigan, USA', hostName: 'Laura B.' },
    checkInDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    guests: 4, totalPrice: 600, status: 'cancelled',
  },
];

// --- Helper: Check if trip is within dispute window (e.g., 14 days after checkout) ---
const isWithinDisputeWindow = (checkoutDateStr: string): boolean => {
  const checkoutDate = new Date(checkoutDateStr);
  const today = new Date();
  const daysSinceCheckout = (today.getTime() - checkoutDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceCheckout > 0 && daysSinceCheckout <= 14; // Must be past checkout, and within 14 days
};


// --- TripCard Component ---
interface TripCardProps {
  trip: Trip;
  onCancelTrip: (tripId: string) => void;
  onLeaveReview: (trip: Trip) => void;
  onRaiseDispute: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onCancelTrip, onLeaveReview, onRaiseDispute }) => {
  const canRaiseDispute = (trip.status === 'previous' || trip.status === 'cancelled') && !trip.disputeId && isWithinDisputeWindow(trip.checkOutDate);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative w-full h-48">
        <Image src={trip.listing.imageUrl} alt={trip.listing.name} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{trip.listing.name}</h3>
        <p className="text-sm text-gray-600 mb-1">{trip.listing.location}</p>
        <p className="text-sm text-gray-600">Dates: {new Date(trip.checkInDate).toLocaleDateString()} - {new Date(trip.checkOutDate).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">Guests: {trip.guests}</p>
        <p className="text-md font-semibold text-gray-800 mt-2">Total: ${trip.totalPrice.toFixed(2)}</p>
        <p className={`text-sm font-medium mt-1 ${
          trip.status === 'upcoming' || trip.status === 'current' ? 'text-green-600' :
          trip.status === 'pending' ? 'text-yellow-600' :
          trip.status === 'cancelled' ? 'text-red-500' : 'text-gray-500'
        }`}>
          Status: {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </p>

        {/* Dispute Status Display */}
        {trip.disputeId && (
          <p className="text-xs text-orange-600 font-semibold mt-1">
            Dispute Status: {trip.disputeStatus || "Open"}
            {/* <Link href={`/disputes/${trip.disputeId}`} className="ml-1 text-indigo-600 hover:underline">(View)</Link> */}
          </p>
        )}

        <div className="mt-auto pt-3 flex flex-col space-y-2">
          <Link href={`/trips/${trip.id}/itinerary`} passHref>
            <button className="w-full py-2 px-4 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              View Itinerary
            </button>
          </Link>
          {(trip.status === 'upcoming' || trip.status === 'pending') && (
            <button onClick={() => onCancelTrip(trip.id)} className="w-full py-2 px-4 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">
              Cancel Trip
            </button>
          )}
          {trip.status === 'previous' && !trip.hasBeenReviewed && !trip.disputeId && (
            <button onClick={() => onLeaveReview(trip)} className="w-full py-2 px-4 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600">
              Leave Review
            </button>
          )}
          {trip.status === 'previous' && trip.hasBeenReviewed && !trip.disputeId && (
            <p className="text-xs text-green-600 text-center mt-2">✓ Review Submitted</p>
          )}
          {canRaiseDispute && (
            <button onClick={() => onRaiseDispute(trip)} className="w-full py-2 px-4 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600">
              Raise Dispute
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main ManageTripsPage Component ---
export default function ManageTripsPage() {
  const [activeTab, setActiveTab] = useState<TabName>('previous'); // Default to previous for testing dispute
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTripForReview, setSelectedTripForReview] = useState<Trip | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedTripForDispute, setSelectedTripForDispute] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>(mockTripsData);

  const handleCancelTrip = (tripId: string) => alert(`Mock cancel trip: ${tripId}`);

  const handleOpenReviewModal = (trip: Trip) => { setSelectedTripForReview(trip); setShowReviewModal(true); };
  const handleCloseReviewModal = () => { setShowReviewModal(false); setSelectedTripForReview(null); };
  const handleSubmitReview = (reviewData: SubmittedReviewData) => {
    console.log('Review Submitted:', reviewData);
    setTrips(prev => prev.map(t => t.id === reviewData.bookingId ? { ...t, hasBeenReviewed: true } : t));
    alert('Review submitted successfully (mock)!');
    handleCloseReviewModal();
  };

  const handleOpenDisputeModal = (trip: Trip) => { setSelectedTripForDispute(trip); setShowDisputeModal(true); };
  const handleCloseDisputeModal = () => { setShowDisputeModal(false); setSelectedTripForDispute(null); };
  const handleSubmitDispute = (disputeData: Omit<SubmittedDisputeData, 'tripName'>) => {
    console.log('Dispute Submitted:', disputeData);
    setTrips(prev => prev.map(t => t.id === disputeData.bookingId ? { ...t, disputeId: `D${Date.now()}`, disputeStatus: 'Dispute Open' } : t));
    alert('Dispute submitted successfully (mock)!');
    handleCloseDisputeModal();
  };

  const filterTrips = (status: TabName) => trips.filter(trip => trip.status === status || (status === 'previous' && (trip.status === 'cancelled' || trip.status === 'previous')));

  const tabs: { name: TabName; label: string }[] = [ { name: 'upcoming', label: 'Upcoming' }, { name: 'pending', label: 'Pending' }, { name: 'current', label: 'Current' }, { name: 'previous', label: 'Previous' }];
  const displayedTrips = filterTrips(activeTab);

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Manage Your Trips</h1>
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button key={tab.name} onClick={() => setActiveTab(tab.name)}
                className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm sm:text-base ${activeTab === tab.name ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {tab.label} ({filterTrips(tab.name).length})
              </button>
            ))}
          </nav>
        </div>
        {displayedTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} onCancelTrip={handleCancelTrip} onLeaveReview={handleOpenReviewModal} onRaiseDispute={handleOpenDisputeModal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-3xl mb-4">🧳</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No trips in this category.</h2>
            {activeTab !== 'previous' && <Link href="/search" className="mt-4 inline-block py-2 px-5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Explore Stays</Link>}
          </div>
        )}
      </div>

      {showReviewModal && selectedTripForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"><div className="bg-transparent w-full max-w-lg max-h-full overflow-y-auto rounded-lg">
          <LeaveReviewForm bookingId={selectedTripForReview.id} listingName={selectedTripForReview.listing.name} hostName={selectedTripForReview.listing.hostName} onSubmitReview={handleSubmitReview} onCancel={handleCloseReviewModal}/>
        </div></div>
      )}
      {showDisputeModal && selectedTripForDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"><div className="bg-transparent w-full max-w-lg max-h-full overflow-y-auto rounded-lg">
          <RaiseDisputeForm bookingId={selectedTripForDispute.id} tripName={selectedTripForDispute.listing.name} onSubmitDispute={handleSubmitDispute} onCancel={handleCloseDisputeModal} />
        </div></div>
      )}
    </>
  );
}
