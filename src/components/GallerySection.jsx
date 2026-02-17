import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

// Import images
import Gallery1 from '../assets/images/gallery1.jpeg';
import Gallery2 from '../assets/images/gallery2.jpeg';
import Gallery3 from '../assets/images/gallery3.jpeg';
import Gallery4 from '../assets/images/gallery4.jpeg';
import Gallery5 from '../assets/images/gallery5.jpeg';
import Gallery6 from '../assets/images/gallery6.jpeg';

const galleryItems = [
    { id: 1, image: Gallery1, tagline: "Collaboration with Lecturers" },
    { id: 2, image: Gallery2, tagline: "Guest Speaker at Radio Broadcast" },
    { id: 3, image: Gallery3, tagline: "1st Place Digital Business Idea (IDEASI)" },
    { id: 4, image: Gallery4, tagline: "Gathering with Internship Team" },
    { id: 5, image: Gallery5, tagline: "Gathering with Mandala Team" },
    { id: 6, image: Gallery6, tagline: "Pitching Top 5 Pilmapres Instiki" },
];

const GallerySection = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <section id="gallery" className="py-20 relative">
            <div className="max-w-6xl mx-auto px-0 lg:px-4">
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
                            onClick={() => setSelectedItem(item)}
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
                                    <h3 className="text-white font-semibold text-sm md:text-base tracking-wide border-l-2 border-cyan-400 pl-3">
                                        {item.tagline}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
                        onClick={() => setSelectedItem(null)}
                    >
                        {/* Close Button */}
                        <motion.button
                            className="absolute top-6 right-6 z-20 text-white/50 hover:text-white transition-colors bg-black/20 p-2 rounded-full backdrop-blur-md"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedItem(null)}
                        >
                            <FaTimes size={32} />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                            className="relative max-w-[90vw] max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl"
                            style={{ width: 'fit-content' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedItem.image}
                                alt={selectedItem.tagline}
                                className="max-w-full max-h-[65vh] object-contain block"
                            />

                            {/* Modal Overlay / Tagline */}
                            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20">
                                <h3 className="text-white text-sm md:text-lg font-semibold tracking-wide border-l-4 border-cyan-400 pl-4">
                                    {selectedItem.tagline}
                                </h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GallerySection;
