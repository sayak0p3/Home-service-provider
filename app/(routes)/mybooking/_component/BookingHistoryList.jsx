import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';

function BookingHistoryList({ bookingHistory, setBookingHistory, type }) {
  const cancelAppointment = (booking) => {
    GlobalApi.deleteBooking(booking.id).then(
      (resp) => {
        if (resp) {
          toast('Booking Deleted Successfully!');
          // Remove the booking from the list
          setBookingHistory((prev) => prev.filter((item) => item.id !== booking.id));
        } else {
          toast('Error while canceling booking!');
        }
      },
      () => {
        toast('Error while canceling booking!');
      }
    );
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
      {bookingHistory.map((booking) => (
        <div key={booking.id ?? `${booking.date}-${booking.time}`} className='border rounded-lg p-4 mb-5'>
          <div className='flex gap-4'>
            {booking?.businessList?.images?.[0]?.url && (
              <Image
                src={booking.businessList.images[0].url}
                alt='image'
                width={120}
                height={120}
                className='rounded-lg object-cover'
              />
            )}
            <div className='flex flex-col gap-2'>
              <h2 className='font-bold'>{booking.businessList.name}</h2>
              <h2 className='flex gap-2 text-primary'>
                <User /> {booking.businessList.contactPerson}
              </h2>
              <h2 className='flex gap-2 text-gray-500'>
                <MapPin className='text-primary' /> {booking.businessList.address}
              </h2>
              <h2 className='flex gap-2 text-gray-500'>
                <Calendar className='text-primary' />
                Service on: <span className='text-black'>{booking.date}</span>
              </h2>
              <h2 className='flex gap-2 text-gray-500'>
                <Clock className='text-primary' />
                At: <span className='text-black'>{booking.time}</span>
              </h2>
            </div>
          </div>

          {/* Cancel button */}
          <Button onClick={() => cancelAppointment(booking)} className='mt-4'>
            Cancel Booking
          </Button>
        </div>
      ))}
    </div>
  );
}

export default BookingHistoryList;
