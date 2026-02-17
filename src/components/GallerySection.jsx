
import React from 'react';
import { motion } from 'framer-motion';

// Import images
import Gallery1 from '../assets/images/gallery1.jpeg';
import Gallery2 from '../assets/images/gallery2.jpeg';
import Gallery3 from '../assets/images/gallery3.jpeg';
import Gallery4 from '../assets/images/gallery4.jpeg';
import Gallery5 from '../assets/images/gallery5.jpeg';
import Gallery6 from '../assets/images/gallery6.jpeg';

const galleryItems = [
    { id: 1, image: Gallery1, tagline: "Team Collaboration" },
    { id: 2, image: Gallery2, tagline: "Project Discussion" },
    { id: 3, image: Gallery3, tagline: "Deep Work Session" },
    { id: 4, image: Gallery4, tagline: "Creative Brainstorming" },
    { id: 5, image: Gallery5, tagline: "Client Meeting" },
    { id: 6, image: Gallery6, tagline: "Workshop & Training" },
];

const GallerySection = () => {
    return (
        <section id="gallery" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-0 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold font-moderniz">
                        <span style={{ color: "#00ffdc" }}>ACTIVITY</span>{' '}
                        <span style={{ color: "#fff" }}>GALLERY</span>
                    </h2>
                    <p className="mt-4 text-slate-400 font-cascadia max-w-2xl mx-auto">
                        Moments capturing the journey, teamwork, and creative process behind the code.
                    </p>
                </motion.div>

                <div className="columns-2 md:columns-3 gap-4 space-y-4">
                    {galleryItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-800/60 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20"
                        >
                            {/* Image */}
                            <img
                                src={item.image}
                                alt={item.tagline}
                                className="w-full h-auto block transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Default Gradient (Hidden on Hover) */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 group-hover:opacity-0"></div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 md:p-6">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white font-bold font-moderniz text-sm md:text-base tracking-wide border-l-2 border-cyan-400 pl-3">
                                        {item.tagline}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
