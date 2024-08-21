import React, { useEffect, useState } from 'react'
import MyContext from './myContext';
import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, fireDb } from '../../firebase/FirebaseConfig';

function MyState(props) {
    const [mode, setMode] = useState('light'); // Whether dark mode is enabled or not
    
    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = 'rgb(17, 24, 39)';
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = 'white';
        }
    }

    const [searchKey , setSearchKey] = useState("");
    const [loading , setLoading] = useState(false)

    const [getAllBlogs , setGetAllBlogs] = useState([])
    // const [usersData , setUsersData] = useState([])


    //Function to get blogs data from firestore
    function getAllBlogsFunction() {
        setLoading(true);
        // console.log("in my state", loading);
        try {
            const q = query(collection(fireDb, "blogPost"),
                orderBy('time')
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let blogArray = [];
                QuerySnapshot.forEach((doc) => {
                    blogArray.push({ ...doc.data(), id: doc.id });
                });
                
                setGetAllBlogs(blogArray)
                // console.log(productsArray)   
                setLoading(false)
            });
            return () => data;
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(()=>{
        getAllBlogsFunction();
    } , [])








    return (
        <MyContext.Provider value={{ 
            mode,
            toggleMode,
            searchKey,
            setSearchKey,
            loading,
            setLoading,
            getAllBlogs,
            // usersData,
            // setUsersData
            }}>
            {props.children}
        </MyContext.Provider>
    );
}

export default MyState;