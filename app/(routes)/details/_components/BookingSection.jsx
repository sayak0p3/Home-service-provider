// import React, { useEffect, useState } from 'react'
// import {
//     Sheet,
//     SheetClose,
//     SheetContent,
//     SheetDescription,
//     SheetFooter,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
//   } from "@/components/ui/sheet"

//   import { Calendar } from "@/components/ui/calendar"
// import { Button } from '@/components/ui/button';
// import GlobalApi from '@/app/_services/GlobalApi';
// import { useSession } from 'next-auth/react';
// import { toast } from 'sonner';
// import moment from 'moment';

// function BookingSection({children,business}) {

//     const [date,setDate]=useState(new Date());
//     const [timeSlot,setTimeSlot]=useState([]);
//     const [selectedTime,setSelectedTime]=useState();
//     const [bookedSlot,setBookedSlot]=useState([]);
//     const {data}=useSession();
//     useEffect(()=>{
//         getTime();
       
//     },[])

//     useEffect(()=>{
//         date&&BusinessBookedSlot();
//     },[date])

//     /**
//      * Get Selected Date Business Booked Slot
//      */
//     const BusinessBookedSlot=()=>{
//         GlobalApi.BusinessBookedSlot(business.id,moment(date).format('DD-MMM-yyyy'))
//         .then(resp=>{
//             console.log(resp)
//             setBookedSlot(resp.bookings)
//         })
//     }

//     const getTime = () => {
//         const timeList = [];
//         for (let i = 10; i <= 12; i++) {
//             timeList.push({
//                 time: i + ':00 AM'
//             })
//             timeList.push({
//                 time: i + ':30 AM'
//             })
//         }
//         for (let i = 1; i <= 6; i++) {
//             timeList.push({
//                 time: i + ':00 PM'
//             })
//             timeList.push({
//                 time: i + ':30 PM'
//             })
//         }
  
//         setTimeSlot(timeList)
//       }

//       const saveBooking=()=>{
//             GlobalApi.createNewBooking(business.id,
//                 moment(date).format('DD-MMM-yyyy'),selectedTime,data.user.email,data.user.name)
//                 .then(resp=>{
//                     console.log(resp);
//                     if(resp)
//                     {
//                         setDate();
//                         setSelectedTime('');
//                         toast('Service Booked successfully!')
//                         // Toast Msg 
//                     }
//                 },(e)=>{
//                     toast('Error while creating booking')
//                     //Error Toast Msg
//                 })
//       }

//       const isSlotBooked=(time)=>{
//         return bookedSlot.find(item=>item.time==time)
//       }
//     return (
//     <div>
        
//         <Sheet>
//   <SheetTrigger asChild>
//   {children}
//   </SheetTrigger>
//   <SheetContent className="overflow-auto">
//     <SheetHeader>
//       <SheetTitle>Book an Service</SheetTitle>
//       <SheetDescription>
//         Select Date and Time slot to book an service
//         {/* Date Picker  */}

//         <div className='flex flex-col gap-5 items-baseline'>
//         <h2 className='mt-5 font-bold'>Select Date</h2>

//             <Calendar
//                 mode="single"
//                 selected={date}
//                 onSelect={setDate}
//                 className="rounded-md border "
//             />

//         </div>
//         {/* Time Slot Picker  */}
//         <h2 className='my-5 font-bold'>Select Time Slot</h2>
//         <div className='grid grid-cols-3 gap-3'>
//             {timeSlot.map((item,index)=>(
//                 <Button key={index}
//                 disabled={isSlotBooked(item.time)}
//                 variant='outiline'
//                 className={`border rounded-full 
//                 p-2 px-3 hover:bg-primary
//                  hover:text-white
//                  ${selectedTime==item.time&&'bg-primary text-white'}`}
//                 onClick={()=>setSelectedTime(item.time)}
//                 >{item.time}</Button>
//             ))}
//         </div>
        
//       </SheetDescription>
//     </SheetHeader>
//     <SheetFooter className="mt-5">
//               <SheetClose asChild>
//                 <div className='flex gap-5'>
//                 <Button variant="destructive" 
//                 className="">Cancel</Button>

//                 <Button 
//                 disabled={!(selectedTime&&date)}
//                 onClick={()=>saveBooking()}
//                 >
//                     Book</Button>
//                 </div>
             
//               </SheetClose>
//             </SheetFooter>
//   </SheetContent>
// </Sheet>

//     </div>
//   )
// }

// export default BookingSection


import React, { useEffect, useState } from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Calendar } from "@/components/ui/calendar"
import { Button } from '@/components/ui/button';
import GlobalApi from '@/app/_services/GlobalApi';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import moment from 'moment';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY); // Replace with your real Stripe publishable key

function BookingSection({children,business}) {

    const [date,setDate]=useState(new Date());
    const [timeSlot,setTimeSlot]=useState([]);
    const [selectedTime,setSelectedTime]=useState();
    const [bookedSlot,setBookedSlot]=useState([]);
    const {data}=useSession();

    useEffect(()=>{
        getTime();
    },[])

    useEffect(()=>{
        date&&BusinessBookedSlot();
    },[date])

    const BusinessBookedSlot=()=>{
        GlobalApi.BusinessBookedSlot(business.id,moment(date).format('DD-MMM-yyyy'))
        .then(resp=>{
            console.log(resp)
            setBookedSlot(resp.bookings)
        })
    }

    const getTime = () => {
        const timeList = [];
        for (let i = 10; i <= 12; i++) {
            timeList.push({ time: i + ':00 AM' })
            timeList.push({ time: i + ':30 AM' })
        }
        for (let i = 1; i <= 6; i++) {
            timeList.push({ time: i + ':00 PM' })
            timeList.push({ time: i + ':30 PM' })
        }
        setTimeSlot(timeList)
    }

    const saveBooking=()=>{
        GlobalApi.createNewBooking(
            business.id,
            moment(date).format('DD-MMM-yyyy'),
            selectedTime,
            data.user.email,
            data.user.name
        ).then(resp=>{
            console.log(resp);
            if(resp) {
                setDate();
                setSelectedTime('');
                toast('Service Booked successfully!')
            }
        },()=>{
            toast('Error while creating booking')
        })
    }

    // const handlePaymentAndBooking = async () => {
    //     const stripe = await stripePromise;

    //     const res = await fetch('/api/create-checkout-session', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             amount: 5000, // example amount in paise (₹50)
    //             email: data.user.email,
    //             name: data.user.name,
    //         }),
    //     });

    //     const session = await res.json();

    //     const result = await stripe.redirectToCheckout({
    //         sessionId: session.id,
    //     });

    //     if (result.error) {
    //         toast('Payment failed. Please try again.');
    //     }
    // }

    const handlePaymentAndBooking = async () => {
        const stripe = await stripePromise;
      
        // Save booking data for after payment
        localStorage.setItem('pendingBooking', JSON.stringify({
          businessId: business.id,
          date: moment(date).format('DD-MMM-yyyy'),
          time: selectedTime,
        }));
      
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 1000, // in cents
            email: data.user.email,
          }),
        });
      
        const session = await res.json();
      
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
      
        if (result.error) {
          toast('Payment error: ' + result.error.message);
        }
      };
      


    const isSlotBooked=(time)=>{
        return bookedSlot.find(item=>item.time==time)
    }

    return (
    <div>
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="overflow-auto">
                <SheetHeader>
                    <SheetTitle>Book an Service</SheetTitle>
                    <SheetDescription>
                        <div className='flex flex-col gap-5 items-baseline'>
                            <h2 className='mt-5 font-bold'>Select Date</h2>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border "
                            />
                        </div>
                        <h2 className='my-5 font-bold'>Select Time Slot</h2>
                        <div className='grid grid-cols-3 gap-3'>
                            {timeSlot.map((item,index)=>(
                                <Button key={index}
                                    disabled={isSlotBooked(item.time)}
                                    variant='outiline'
                                    className={`border rounded-full p-2 px-3 hover:bg-primary hover:text-white ${selectedTime==item.time&&'bg-primary text-white'}`}
                                    onClick={()=>setSelectedTime(item.time)}
                                >{item.time}</Button>
                            ))}
                        </div>
                    </SheetDescription>
                </SheetHeader>
                <SheetFooter className="mt-5">
                    <SheetClose asChild>
                        <div className='flex gap-5'>
                            <Button variant="destructive">Cancel</Button>
                            <Button 
                                disabled={!(selectedTime&&date)}
                                onClick={handlePaymentAndBooking}
                            >
                                Book
                            </Button>
                        </div>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </div>
  )
}

export default BookingSection
