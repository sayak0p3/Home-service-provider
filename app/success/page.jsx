'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import GlobalApi from '@/app/_services/GlobalApi';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionId && session?.user) {
      // Extract booking info from localStorage (stored before payment)
      const bookingData = JSON.parse(localStorage.getItem('pendingBooking'));

      if (bookingData) {
        const { businessId, date, time } = bookingData;

        GlobalApi.createNewBooking(
          businessId,
          date,
          time,
          session.user.email,
          session.user.name
        ).then(
          (resp) => {
            if (resp) {
              toast.success('Service booked successfully!');
              localStorage.removeItem('pendingBooking');
              router.push('/'); // Redirect after success (optional)
            }
          },
          () => {
            toast.error('Booking failed, please contact support.');
          }
        );
      }
    }
  }, [sessionId, session]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">✅ Payment Successful</h1>
      <p>Booking is being processed...</p>
    </div>
  );
}
