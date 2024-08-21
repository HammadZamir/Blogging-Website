import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';

function HeroSection() {
    const context = useContext(myContext);
    const { mode } = context;

    return (
        <section className={`relative overflow-hidden ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-blue-500 to-teal-400 text-gray-100'}`}>
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-opacity-30" style={{ backgroundColor: mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(0, 128, 128, 0.3)' }}></div>
            
            {/* Hero Section Content */}
            <div className="relative z-10 container mx-auto flex px-6 py-24 items-center justify-center flex-col">
                {/* Main Content */}
                <main className="text-center">
                    <div className="mb-6">
                        {/* Image */}
                        <div className="flex justify-center mb-4">
                            <img
                                className="w-24 h-24 shadow-lg"
                                src="https://cdn-icons-png.flaticon.com/128/3685/3685253.png"
                                alt="Blogging Logo"
                            />
                        </div>

                        {/* Title */}
                        <h1 className={`text-4xl font-extrabold mb-4 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Blogging
                        </h1>
                    </div>

                    {/* Paragraph */}
                    <p
                        className={`text-lg font-light ${mode === 'dark' ? 'text-gray-300' : 'text-gray-800'} sm:text-2xl`}
                    >
                        Discover a variety of blogs and tutorials contributed by the community.
                    </p>
                </main>
            </div>
        </section>
    );
}

export default HeroSection;
