import React, { useContext, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData'
import Link from 'next/link'


function register() {
    const initialState = { userName: '', password: '', role: '' }
    const [userData, setUserData] = useState(initialState)
    const { userName, password, role } = userData
    const { state, dispatch } = useContext(DataContext)
    const [showModal, setShowModal] = useState(false)

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }
    const handleSubmit = async e => {
        e.preventDefault()

        const res = await postData('auth/register', userData)
        // If registration is successful, make a client-side fetch request
        if (res.msg === 'Successful Registration!') {
            await fetch('/api/generateUserJson', {
                method: 'GET',
            });

            console.log('JSON files generated successfully.');
        }
        setShowModal(true);
        console.log(res)

    }
    return (
        <body className='bg-black overflow-y-hidden'>
                <img src='/bgbg.jpeg' className='h-full z-10 absolute opacity-20 w-full' />

      <h1 className='text-white font-bold text-center font-mono text-2xl'> Register- Fun Roulette </h1>
            <div className="w-full max-w-xs flex mt-32 justify-center z-20 ml-auto mr-auto items-center absolute">
                <form className="bg-white shadow-md rounded px-8 pt-2 pb-2 mb-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" name='userName' value={userName} onChange={handleChangeInput} type="text" placeholder="Username" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" name='password' value={password} onChange={handleChangeInput} placeholder="******************" />

                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                            Role
                        </label>
                        <input className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="role" type="text" name='role' value={role} onChange={handleChangeInput} placeholder="Enter Role" />

                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Register
                        </button>
                    </div>
                </form>
                {/* <Modal isOpen={showModal} onClose={() => setShowModal(false)}  /> */}

            </div>
        </body>
    )
}

export default register



