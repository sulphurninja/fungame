import Link from 'next/link'
import React from 'react'

export default function Admin() {
    return (
        <div>
            <div className='bg-black '>
                <h1 className='font-serif font-bold text-white text-xl text-center'>
                    Admin Panel -
                    <span className='text-amber-400 '>
                        {' '} Fun Roulette
                    </span>
                </h1>
            </div>
            <div className='grid grid-cols-3 text-center font-mono' >
                <Link href='/register'>
                    <h1 className='text-white hover:scale-105 bg-black mt-12 p-4  ml-12 text-lg font-bold'>Create User ID</h1>
                </Link>
              
                <Link href='/userlist'>
                    <h1 className='text-white bg-black hover:scale-105 mt-12 p-4  ml-12 text-lg font-bold'>User List</h1>
                </Link>
       
            </div>
            

        </div>

    )
}
