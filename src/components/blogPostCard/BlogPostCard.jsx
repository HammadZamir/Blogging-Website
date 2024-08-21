import { Button } from '@material-tailwind/react';
import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader';

function BlogPostCard() {
    const context = useContext(myContext);
    const { mode, getAllBlogs, loading } = context;
    const navigate = useNavigate();
    // console.log("in blogpost card ", loading);


    function createMarkup(c) {
        return { __html: c };
    }


    return (
        <section className={`py-16 ${mode === 'dark' ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 via-white to-blue-50'}`}>
            <div className="container mx-auto px-6">
                {/* Heading */}
                <h2 className={`text-4xl font-bold mb-12 text-center ${mode === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                    Latest Blog Posts
                </h2>

                {/* Blog Cards */}
                {loading ?
                    <Loader /> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {getAllBlogs.slice(0, 6).map((blog) => {
                            const { id, thumbnail, date, blog: { title, content } } = blog;
                            return (
                                <div key={id} className={`group relative bg-${mode === 'dark' ? 'gray-800' : 'white'} border border-${mode === 'dark' ? 'gray-700' : 'gray-200'} rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105`}>
                                    {/* Blog Thumbnail */}
                                    <img
                                        className="w-full h-48 object-cover group-hover:opacity-75"
                                        src={thumbnail}
                                        alt="blog"
                                    />

                                    {/* Blog Content */}
                                    <div className="p-6">
                                        {/* Blog Date */}
                                        <h2 className={`text-xs font-semibold mb-2 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {date}
                                        </h2>

                                        {/* Blog Title */}
                                        <h1 className={`text-xl font-bold mb-4 ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                            {title}
                                        </h1>

                                        {/* Blog Description */}
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
                                                dangerouslySetInnerHTML={createMarkup(content.slice(0, 160) + "...")}>
                                            </div>

                                        </div>


                                        {/* Read More Button */}
                                        <Button
                                            onClick={() => navigate(`/bloginfo/${id}`)}
                                            className={`mt-4 px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 ${mode === 'dark' ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                        >
                                            Read More
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                }


                {/* See More Button */}
                <div className="flex justify-center mt-12">
                    <Button
                        onClick={() => navigate('/allblogs')}
                        className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-300 ${mode === 'dark' ? 'bg-gray-600 text-gray-100 hover:bg-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        See More
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default BlogPostCard;
