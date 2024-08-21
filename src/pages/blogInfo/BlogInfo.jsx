import React, { useContext, useEffect, useState } from 'react'
import myContext from '../../context/data/myContext'
import { Link, useParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { fireDb } from '../../firebase/FirebaseConfig';
import Loader from '../../components/loader/Loader'
import Layout from '../../components/layout/Layout';
import Comment from '../../components/comment/Comment';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

function BlogInfo() {

  const context = useContext(myContext)
  const { mode, loading, setLoading, usersData } = context;

  const [getBlogs, setGetBlogs] = useState();
  const [fullName, setFullName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState('');

  const params = useParams()       // it will store the id of blog that we clicked on



  //---------------------//




  // function to get blog data
const getAllBlogs = async () => {
  setLoading(true);
  try {
    const productTemp = await getDoc(doc(fireDb, "blogPost", params.id));
    if (productTemp.exists()) {
      const blogData = productTemp.data();
      setGetBlogs(blogData);
    } else {
      console.log("Document does not exist");
    }
    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
};


  useEffect(() => {
    getAllBlogs();
    window.scrollTo(0, 0)
  }, []);



  //---------------------//


  // function to store comment data

  const addComment = async () => {

    const commentRef = collection(fireDb, "blogPost/" + `${params.id}/` + "comment");
    if(fullName === "" || commentText === ""){
      return
    } 
    try {
      await addDoc(commentRef, {
        fullName,
        commentText,
        time: Timestamp.now(),
        date: new Date().toLocaleString(
          "en-US",
          {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }
        )
      })
      setFullName("");
      setCommentText("");
    } catch (error) {
      console.log(error)
    }
  }


  //---------------------//


  //Function to get all Comments data

  const [allComment, setAllComment] = useState([]);

  const getcomment = async () => {
    try {
      const q = query(
        collection(fireDb, "blogPost/" + `${params.id}/` + "comment/"),
        orderBy('time')
      );
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productsArray = [];
        QuerySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });
        setAllComment(productsArray)
        // console.log(productsArray)
      });
      return () => data;
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getcomment()
  }, []);


  //---------------------//


  function createMarkup(c) {
    return { __html: c };
  }


  //---------------------//


  return (
    <Layout>
      <div>
        <section className="w-full rounded-lg h-full overflow-hidden max-w-4xl mx-auto px-4 ">
          <div className=" py-4 lg:py-8 ">

            {loading ?
              <Loader />
              :
              <div >
                <Link className='p-6 text-3xl' to={"/allblogs"}>
                  <BsFillArrowLeftCircleFill size={25} />
                </Link>
                {/* Thumbnail  */}
                <img alt="content" className="mb-3 rounded-lg h-full w-full"
                  src={getBlogs?.thumbnail}
                />
                {/* title And date  */}
                <div className="flex justify-between items-center mb-3">
                  <h1 style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    className=' text-xl md:text-2xl lg:text-2xl font-semibold'>
                    {getBlogs?.blog?.title}
                  </h1>
{/* 
                  <p style={{ color: mode === 'dark' ? 'white' : 'black' }}
                    className=' text-xl md:text-sm lg:text-md font-semibold'>
                    Blog By : { authorName }
                  </p> */}

                  <p style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                    {getBlogs?.date}
                  </p>
                </div>
                <div
                  className={`border-b mb-5 ${mode === 'dark' ?
                    'border-gray-600' : 'border-gray-400'}`}
                />
                

                {/* blog Content  */}
                <div className="content">
                  <div
                    className={`[&> h1]:text-[32px] [&>h1]:font-bold  [&>h1]:mb-2.5
                        ${mode === 'dark' ? '[&>h1]:text-[#ff4d4d]' : '[&>h1]:text-black'}

                        [&>h2]:text-[24px] [&>h2]:font-bold [&>h2]:mb-2.5
                        ${mode === 'dark' ? '[&>h2]:text-white' : '[&>h2]:text-black'}

                        [&>h3]:text-[18.72] [&>h3]:font-bold [&>h3]:mb-2.5
                        ${mode === 'dark' ? '[&>h3]:text-white' : '[&>h3]:text-black'}

                        [&>h4]:text-[16px] [&>h4]:font-bold [&>h4]:mb-2.5
                        ${mode === 'dark' ? '[&>h4]:text-white' : '[&>h4]:text-black'}

                        [&>h5]:text-[13.28px] [&>h5]:font-bold [&>h5]:mb-2.5
                        ${mode === 'dark' ? '[&>h5]:text-white' : '[&>h5]:text-black'}

                        [&>h6]:text-[10px] [&>h6]:font-bold [&>h6]:mb-2.5
                        ${mode === 'dark' ? '[&>h6]:text-white' : '[&>h6]:text-black'}

                        [&>p]:text-[16px] [&>p]:mb-1.5
                        ${mode === 'dark' ? '[&>p]:text-[#7efff5]' : '[&>p]:text-black'}

                        [&>ul]:list-disc [&>ul]:mb-2
                        ${mode === 'dark' ? '[&>ul]:text-white' : '[&>ul]:text-black'}

                        [&>ol]:list-decimal [&>li]:mb-10
                        ${mode === 'dark' ? '[&>ol]:text-white' : '[&>ol]:text-black'}

                        [&>li]:list-decimal [&>ol]:mb-2
                        ${mode === 'dark' ? '[&>ol]:text-white' : '[&>ol]:text-black'}

                        [&>img]:rounded-lg
                        `}
                    dangerouslySetInnerHTML={createMarkup(getBlogs?.blog?.content)}>
                  </div>
                </div>
              </div>
            }

            <Comment
              addComment={addComment}
              commentText={commentText}
              setCommentText={setCommentText}
              allComment={allComment}
              fullName={fullName}
              setFullName={setFullName}
            />

          </div>
        </section>
      </div>
    </Layout>
  )
}

export default BlogInfo
