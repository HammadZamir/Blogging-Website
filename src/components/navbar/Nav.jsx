import React, { useState, useEffect, useContext } from "react";
import { Navbar, Typography, IconButton, Avatar, Collapse } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import myContext from "../../context/data/myContext";
import SearchDialog from "../searchDialog/SearchDialog";
import ShareDialogBox from "../shareDialogBox/ShareDialogBox";

export default function Nav() {
    const [uid, setUid] = useState(null);
    const [openNav, setOpenNav] = useState(false);
    const context = useContext(myContext);
    const { mode, toggleMode } = context;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            } else {
                setUid(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const navList = (
        <ul className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            <Typography
                as="li"
                variant="small"
                className="p-1 font-bold text-xl transition-colors duration-300 ease-in-out hover:text-blue-500"
                style={{ color: mode === 'dark' ? '#f0f4f8' : '#333' }}
            >
                <Link to={'/'}>Home</Link>
            </Typography>

            <Typography
                as="li"
                variant="small"
                className="p-1 font-bold text-xl transition-colors duration-300 ease-in-out hover:text-blue-500"
                style={{ color: mode === 'dark' ? '#f0f4f8' : '#333' }}
            >
                <Link to={'/allblogs'}>Blogs</Link>
            </Typography>

            { !uid && 
            <Typography
                as="li"
                variant="small"
                className="p-1 font-bold text-xl transition-colors duration-300 ease-in-out hover:text-blue-500"
                style={{ color: mode === 'dark' ? '#f0f4f8' : '#333' }}
            >
                <Link to={'/adminlogin'}>Login</Link>
            </Typography>
            }

            { !uid && 
            <Typography
                as="li"
                variant="small"
                className="p-1 font-bold text-xl transition-colors duration-300 ease-in-out hover:text-blue-500"
                style={{ color: mode === 'dark' ? '#f0f4f8' : '#333' }}
            >
                <Link to={'/adminsignup'}>Signup</Link>
            </Typography>
            }
        </ul>
    );

    return (
        <>
            <Navbar
                className={`sticky inset-0 z-20 h-max max-w-full border-none rounded-none py-2 px-6 lg:px-10 lg:py-2
                ${mode === 'dark' ? 'bg-gray-900 text-gray-100 shadow-lg' : 'bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md'}`}
            >
                <div className="flex items-center justify-between">
                    <Link to={'/'}>
                        <Typography
                            as="a"
                            className="mr-4 cursor-pointer py-2 text-3xl font-bold flex gap-2 items-center"
                            style={{ color: mode === 'dark' ? '#e2e8f0' : '#ffffff' }}
                        >
                            <img
                                className='w-14 h-14'
                                src='https://cdn-icons-png.flaticon.com/128/3685/3685253.png'
                                alt="logo"
                            />
                            <span className="hidden md:inline">Blogging</span>
                        </Typography>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex">
                            {navList}
                        </div>

                        <div>
                            <SearchDialog />
                        </div>

                        <div>
                            <Link to={'/dashboard'}>
                                <Avatar
                                    src={'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'}
                                    alt="avatar"
                                    withBorder={true}
                                    className="w-12 h-12 border-4"
                                    style={{
                                        borderColor: mode === 'dark' ? '#1e293b' : '#ffffff'
                                    }}
                                />
                            </Link>
                        </div>

                        <div>
                            <IconButton onClick={toggleMode} className={`rounded-full p-2 transition-colors duration-300 ${mode === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                {mode === 'light'
                                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                    </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                    </svg>
                                }
                            </IconButton>
                        </div>

                        <div>
                            <IconButton
                                className={`ml-auto h-10 w-10 text-inherit rounded-lg lg:hidden p-2 ${mode === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                                ripple={false}
                                onClick={() => setOpenNav(!openNav)}
                            >
                                {openNav ?
                                    (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            className="h-6 w-6"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    )
                                    : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    )}
                            </IconButton>
                        </div>
                    </div>
                </div>

                <Collapse open={openNav}>
                    {navList}
                </Collapse>
            </Navbar>
        </>
    );
}
