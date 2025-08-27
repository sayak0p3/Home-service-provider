// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Search } from 'lucide-react'
// import React from 'react'

// function Hero() {
//   return (
//     <div className='flex items-center gap-3 flex-col justify-center pt-14 pb-7'>
//         <h2 className='font-bold text-[46px] text-center'>
//             Find Home 
//             <span className='text-primary'> Service/Repair</span>
//             <br></br> Near You</h2>
//         <h2 className='text-xl text-gray-400'>Explore Best Home Service & Repair near you</h2>
//         <div className='mt-4 flex gap-4 items-center'>
//             <Input placeholder='Search'
//             className="rounded-full md:w-[350px]" />
//             <Button className="rounded-full h-[46px]">
//                 <Search className='h-4 w-4'/>
//             </Button>
//         </div>
//     </div>
//   )
// }

// export default Hero

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

function Hero() {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')

  const handleSearch = () => {
    if (searchText.trim() !== '') {
      router.push(`/search/${encodeURIComponent(searchText.trim())}`)
    }
  }

  return (
    <div className='flex items-center gap-3 flex-col justify-center pt-14 pb-7'>
      <h2 className='font-bold text-[46px] text-center'>
        Find Home 
        <span className='text-primary'> Service/Repair</span>
        <br /> Near You
      </h2>
      <h2 className='text-xl text-gray-400'>
        Explore Best Home Service & Repair near you
      </h2>

      <div className='mt-4 flex gap-4 items-center'>
        <Input
          placeholder='Search'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='rounded-full md:w-[350px]'
        />
        <Button
          className='rounded-full h-[46px]'
          onClick={handleSearch}
        >
          <Search className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export default Hero
