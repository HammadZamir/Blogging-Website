import React, { useContext, useState, useEffect } from 'react'
import Layout from '../../../components/layout/Layout'
import myContext from '../../../context/data/myContext';
import { Button } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Import signOut function
import { auth } from '../../../firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc, Firestore, onSnapshot } from 'firebase/firestore';
import { fireDb } from '../../../firebase/FirebaseConfig';


function Dashboard() {

    const [email, setEmail] = useState(null)
    const context = useContext(myContext);
    const { mode, getAllBlogs } = context;


    const navigate = useNavigate();

    // console.log("usersData",usersData)

    useEffect(() => {
        const { usersData } = context;
        // console.log("usersData", usersData)
    }, [context])

    // console.log(usersData.fullName)

    // const [blogList, setBlogList] = useState(getAllBlogs);

    const userAuthId = auth.currentUser?.uid;
    // console.log("this is User Auth Id" , userAuthId);

    // Filter blogs by the current user's ID
    const userBlogs = getAllBlogs.filter(blog => blog.blog.uid === userAuthId);
    // Get the count of blogs by the current user
    const userBlogCount = userBlogs.length;




    // getAllBlogs.map((blog, index) => {
    //     console.log("index is : ", index)
    //     console.log("blog is : ", blog.id)
    //     return 1;
    // })

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email);
            } else {
                setEmail(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);


    // console.log(email)

    const handleSignout = async () => {
        try {
            await signOut(auth)
            localStorage.clear();
            setUsersData({});
            navigate('/')

        } catch (error) {
            alert("There is some issue");
            console.log(error);
        }
    }




    const [usersData, setUsersData] = useState([])

    useEffect(() => {
        if (!auth.currentUser) {
            console.log("There is no user");
            return
        }
        else console.log("There is user ");
        const fetchUserInfo = () => {
            try {
                const docRef = doc(fireDb, "users", auth.currentUser.uid);

                // Set up real-time listener
                const unsubscribe = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUsersData({ ...data });
                        // console.log("User data:", usersData);
                    } else {
                        console.log("No such document!");
                    }
                }, (error) => {
                    console.error("Error fetching user info:", error);
                });

                // Clean up the listener on component unmount
                return () => unsubscribe();

            } catch (error) {
                console.error("Error setting up real-time listener:", error);
            }
        };

        if (auth.currentUser) {
            fetchUserInfo();
        }
    }, [auth.currentUser]);





    const handleEditBlog = (id) => {
        const blogToEdit = getAllBlogs.find(blog => blog.id === id);
        if (blogToEdit) {
            // Navigate to the edit page and pass the blog data
            navigate(`/editblog/${id}`, { state: { blog: blogToEdit } });
        }
    };





    const handleDeleteBlog = async (id) => {
        try {
            const blogDocRef = doc(fireDb, 'blogPost', id);
            await deleteDoc(blogDocRef);
            getAllBlogs();
            alert("blog deleted successfully")

            // setBlogList(blogList.filter((blog) => blog.id !== id));
        } catch (error) {
            console.log("some error : ".error);
        }
    }



    return (
        <Layout>
            <div className="py-10">
                <div
                    className="flex flex-wrap justify-start items-center lg:justify-center gap-2 lg:gap-10 px-4 lg:px-0 mb-8">
                    <div className="left">
                        <img
                            className=" w-40 h-40  object-cover rounded-full border-2 border-pink-600 p-1"
                            src={'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'} alt="profile"
                        />
                    </div>
                    <div className="right">
                        <h1
                            className='text-center font-bold text-2xl mb-2'
                            style={{ color: mode === 'dark' ? 'white' : 'black' }}
                        >
                            {usersData.fullName}
                        </h1>

                        <h2
                            style={{ color: mode === 'dark' ? 'white' : 'black' }} className="font-semibold">
                            {usersData.profession}
                        </h2>
                        <h2 style={{ color: mode === 'dark' ? 'white' : 'black' }} className="font-semibold">
                            {email}
                        </h2>
                        <h2
                            style={{ color: mode === 'dark' ? 'white' : 'black' }} className="font-semibold">
                            <span>Total Blog : </span>  {userBlogCount}
                        </h2>
                        <div className=" flex gap-2 mt-2">
                            <Link to={'/createblog'}>
                                <div className=" mb-2">
                                    <Button
                                        style={{
                                            background: mode === 'dark'
                                                ? 'rgb(226, 232, 240)'
                                                : 'rgb(30, 41, 59)',
                                            color: mode === 'dark'
                                                ? 'black'
                                                : 'white'
                                        }}
                                        className='px-8 py-2'
                                    >
                                        Create Blog
                                    </Button>
                                </div>
                            </Link>
                            <div className="mb-2">
                                <Button
                                    onClick={handleSignout}
                                    style={{
                                        background: mode === 'dark'
                                            ? 'rgb(226, 232, 240)'
                                            : 'rgb(30, 41, 59)',
                                        color: mode === 'dark'
                                            ? 'black'
                                            : 'white'
                                    }}
                                    className='px-8 py-2'
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line  */}
                <hr className={`border-2
                 ${mode === 'dark'
                        ? 'border-gray-300'
                        : 'border-gray-400'}`
                }
                />

                {/* Table  */}
                <div className="">
                    <div className=' container mx-auto px-4 max-w-7xl my-5' >
                        <div className="relative overflow-x-auto shadow-md sm:rounded-xl">
                            {/* table  */}
                            <table className="w-full border-2 border-white shadow-md text-sm text-left text-gray-500 dark:text-gray-400" >
                                {/* thead  */}
                                <thead
                                    style={{
                                        background: mode === 'dark'
                                            ? 'white'
                                            : 'rgb(30, 41, 59)'
                                    }}
                                    className="text-xs ">
                                    <tr>
                                        {/* <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            S.No
                                        </th> */}
                                        <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            Thumbnail
                                        </th>
                                        <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            Title
                                        </th>
                                        <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            Category
                                        </th>
                                        <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            Date
                                        </th>
                                        <th style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }} scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                {/* tbody  */}
                                <tbody>
                                    {getAllBlogs.map((blog, index) => {
                                        if (userAuthId === blog.blog.uid) {
                                            return (
                                                <tr key={blog.id} className="border-b-2" style={{ background: mode === 'dark' ? 'rgb(30, 41, 59)' : 'white' }}>
                                                    {/* S.No */}
                                                    {/* <td style={{ color: mode === 'dark' ? 'white' : 'black' }} className="px-6 py-4">
                                                        {`${index + 1}.`}
                                                    </td> */}
                                                    {/* Blog Thumbnail */}
                                                    <td style={{ color: mode === 'dark' ? 'white' : 'black' }} className="px-6 py-4">
                                                        <img className="w-16 rounded-lg" src={blog.thumbnail} alt="thumbnail" />
                                                    </td>
                                                    {/* Blog Title */}
                                                    <td style={{ color: mode === 'dark' ? 'white' : 'black' }} className="px-6 py-4">
                                                        {blog.blog.title}
                                                    </td>
                                                    {/* Blog Category */}
                                                    <td style={{ color: mode === 'dark' ? 'white' : 'black' }} className="px-6 py-4">
                                                        {blog.blog.category}
                                                    </td>
                                                    {/* Blog Date */}
                                                    <td style={{ color: mode === 'dark' ? 'white' : 'black' }} className="px-6 py-4">
                                                        {blog.date}
                                                    </td>
                                                    {/* Delete Blog */}
                                                    <td style={{ color: mode === 'dark' ? 'white' : 'black' }} className="px-6 py-4">
                                                        <button
                                                            onClick={() => { handleEditBlog(blog.id) }}
                                                            className="px-4 py-1 mr-2 rounded-lg text-white font-bold bg-blue-500"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => { handleDeleteBlog(blog.id) }}
                                                            className="px-4 py-1 rounded-lg text-white font-bold bg-red-500"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>

                                            );
                                        } else {
                                            // Return null to not render anything if the condition is not met
                                            return null;
                                        }
                                    })}
                                </tbody>

                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default Dashboard