import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import Cookie from "js-cookie";
import { useRouter } from "next/router";

function login() {
    const initialState = { userName: "", password: "" };
    const [userData, setUserData] = useState(initialState);
    const { userName, password } = userData;
    const { state = {}, dispatch } = useContext(DataContext);
    const { auth = {} } = state;
    const router = useRouter();

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };


    const handleSubmit = async e => {
        e.preventDefault()

        const res = await postData('auth/login', userData)

        if (res.error) {
            window.location.reload();
            return;
        }

        dispatch({
            type: 'AUTH', payload: {
                token: res.access_token,
                user: res.user
            }
        })

        Cookie.set('refreshtoken', res.refresh_token, {
            path: '/api/auth/accessToken',
            expires: 7
        })

        localStorage.setItem('firstLogin', true)

        // check if user has admin privileges
        if (res.user.role === 'admin') {
            router.push("/admin");
        } else if (res.user.role === 'user') {
            router.push("/Home");
        } else if (res.user.role === 'subadmin') {
            router.push("/subadmin")
        }
    }

    const [isChecked, setChecked] = useState(true);

    const handleCheckboxChange = () => {
        setChecked(!isChecked);
    };

    return (
        <body className="w-screen h-screen o bg-black relative">
            <img
                src="/login.png"
                className="absolute   w-full h-full object-fill"
            />

            <div className="flex  justify-around absolute">

                <div className="">
                    <div className="bg-black ">
                        <form
                            className="mt-[40%] border p-4 border-amber-400 rounded-lg  shadow-md  "
                            onSubmit={handleSubmit}
                        >
                            <div className="pt-4 flex ">
                                <label
                                    className=" text-white mt-auto font-medium pb-4 my-auto  px-2  "
                                    htmlFor="username"
                                >
                                    Username
                                </label>
                                <input
                                    className="shadow appearance-none  rounded w-full  mt-auto p-1 bg-white text-black  leading-tight focus:outline-none focus:shadow-outline"
                                    id="username"
                                    name="userName"
                                    value={userName}
                                    onChange={handleChangeInput}
                                    type="text"
                                    placeholder="FUN"
                                />
                            </div>
                            <div className="py-4 flex ">
                                <label
                                    className=" text-white mt-auto font-medium pb-4  my-auto px-2  "
                                    htmlFor="username"
                                >
                                    Password 
                                </label>
                                <input
                                    className="shadow appearance-none  rounded w-full  mt-auto p-1 bg-white text-black  leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChangeInput}
                                    placeholder="******"
                                />
                                
                            </div>
                            <div className="flex ml-12  items-center justify-between w-1/2 ">
                                <button
                                    className="bg-gradient-to-b from-neutral-400 to-amber-300 hover:bg-red-700 w-full  text-black   border border-white font-bold py-3   px-2 rounded-lg focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Enter
                                </button>
                            </div>
                           
                        </form>
                    </div>

                </div>


            </div>
        </body>
    );
}

export default login;