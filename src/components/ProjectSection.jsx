// src/components/ProjectSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  FaExternalLinkAlt, FaReact, FaNodeJs, FaHtml5, FaCss3Alt,
  FaJsSquare, FaTools, FaFigma,
  FaBootstrap,
  FaGitAlt,
  FaWordpress
} from 'react-icons/fa';
import {
  SiTailwindcss, SiNextdotjs, SiVercel, SiMongodb,
  SiExpress, SiPostgresql,
  SiPhp,
  SiMysql
} from 'react-icons/si';
import { PiCodeBold } from "react-icons/pi";
import { LiaLayerGroupSolid } from "react-icons/lia";
import { useNavbar } from '../contexts/NavbarContext';
import { TbBrandLaravel, TbBrandVite } from 'react-icons/tb';
import Portfolio1 from '../assets/Project/portfolio1.png'
import Portfolio2 from '../assets/Project/portfolio2.png'
import Portfolio3 from '../assets/Project/portfolio3.png'
import Portfolio4 from '../assets/Project/portfolio4.png'
import Portfolio5 from '../assets/Project/portfolio5.jpg'
import Portfolio6 from '../assets/Project/portfolio6.png'
import UIUX1 from '../assets/Project/uiux1.png'
import UIUX2 from '../assets/Project/uiux2.png'
import UIUX3 from '../assets/Project/uiux3.png'


// ===================================
// DATA PROYEK (CONTOH)
// ===================================
const dummyProjects = [
  {
    title: "Amertha Sumita",
    description: "Amertha is a WordPress e-commerce site offering seamless browsing and checkout.",
    tech: ["Wordpress"],
    link: "https://amerthasumita.com/",
    image: Portfolio1,
    category: "Web/Apps",
  },
  {
    title: "Spotify Clone",
    description: "Spotify Clone is a React.js web application replicating Spotify’s streaming features, allowing users to browse, play, and manage playlists.",
    tech: ["React", "TailwindCSS"],
    link: "https://github.com/widyaanggara/Trave",
    image: Portfolio6,
    category: "Web/Apps",
  },
  {
    title: "Gemini Clone",
    description: "Gemini Clone website built with React.js and Vite, featuring live Q&A interactions.",
    tech: ["React", "Vite", "TailwindCSS"],
    link: "https://github.com/widyaanggara/gemini-clone",
    image: Portfolio3,
    category: "Web/Apps",
  },
  {
    title: "Da'Coffee Website",
    description: "Website showcasing coffee products, reviews, and details, emphasizing quality and uniqueness.",
    tech: ["HTML", "CSS", "JS", "Bootstrap"],
    link: "https://github.com/widyaanggara/coffee-shop-website",
    image: Portfolio2,
    category: "Web/Apps",
  },
  {
    title: "Dev Skills",
    description: "DevSkills is an online programming platform with courses, user/admin management, and tracking.",
    tech: ["PHP", "TailwindCSS", "MySQL"],
    link: "https://github.com/widyaanggara/devskills",
    image: Portfolio4,
    category: "Web/Apps",
  },
  {
    title: "Trave Website",
    description: "Trave is a Laravel-based website offering efficient navigation, content management, and interactive features.",
    tech: ["Laravel", "TailwindCSS", "MySQL"],
    link: "https://github.com/widyaanggara/Trave",
    image: Portfolio5,
    category: "Web/Apps",
  },
  {
    title: "Vitlife UI",
    description: "Vitlife is a UI/UX design concept for a nutrition tracker, helping users monitor meals, calories, nutrients, and health habits efficiently.",
    tech: ["Figma"],
    link: "https://www.figma.com/proto/mf8k3ftOuq2QLJiwVDJJvG/VitLife-SITEFEST?node-id=126-599&t=EsZbuzhZfNgsMFGB-1",
    image: UIUX1,
    category: "3D Design",
  },
  {
    title: "Halo Bali UI",
    description: "Halo Bali is a UI/UX design concept for travel booking, helping users plan trips, book stays, and connect with local guides.",
    tech: ["Figma"],
    link: "https://www.figma.com/proto/uADXDjXBhJDG6RrMnWJikD/BALIGIVATION?node-id=1-25&t=lAwpKm1szS3TFO7p-1",
    image: UIUX2,
    category: "3D Design",
  },
  {
    title: "Codify UI",
    description: "Codify is a UI/UX design concept for online programming courses, featuring interactive learning with private teachers.",
    tech: ["Figma"],
    link: "https://www.figma.com/proto/66KG18vKbaIc5LmnJvkjtQ/CODIFY-BBT?node-id=324-64&t=YUamRfiStzW2wGM5-1",
    image: UIUX3,
    category: "3D Design",
  },
];

// ===================================
// TECH STACK
// ===================================
const techStack = {
  frontend: [
    { name: "React", icon: <FaReact className="text-[#61DAFB]" /> },
    { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#38B2AC]" /> },
    { name: "Bootstrap", icon: <FaBootstrap className="text-[#7511f6]" /> },
    { name: "JavaScript", icon: <FaJsSquare className="text-[#F7DF1E]" /> },
    { name: "HTML", icon: <FaHtml5 className="text-[#E34F26]" /> },
    { name: "CSS", icon: <FaCss3Alt className="text-[#1572B6]" /> },
  ],
  backend: [
    { name: "PHP", icon: <SiPhp className="text-[#777bb3]" /> },
    { name: "Laravel", icon: <TbBrandLaravel className="text-[#f5360b]" /> },
  ],
  database: [
    { name: "MySQL", icon: <SiMysql className="text-[#086590]" /> },
    { name: "PostgreSQL", icon: <SiPostgresql className="text-[#336791]" /> },
  ],
  tools: [
    { name: "Git & GitHub", icon: <FaGitAlt className="text-white" /> },
    { name: "Vercel", icon: <SiVercel className="text-white" /> },
    { name: "Figma", icon: <FaFigma className="text-[#F24E1E]" /> },
    { name: "Tools Lain", icon: <FaTools className="text-gray-400" /> },
  ],
};

// ===================================
// KOMPONEN KARTU PROYEK
// ===================================
const ProjectCard = ({ project, index }) => {
  const techIcons = {
    "Next.js": <SiNextdotjs />, "React": <FaReact />, "TailwindCSS": <SiTailwindcss />, "Wordpress": <FaWordpress />, "HTML": <FaHtml5 />, "CSS": <FaCss3Alt />, "JS": <FaJsSquare />, "Bootstrap": <FaBootstrap />, "Vite": <TbBrandVite />, "PHP": <SiPhp />, "Laravel": <TbBrandLaravel />, "MySQL": <SiMysql />,
    "Framer Motion": "💫", "Node.js": <FaNodeJs />, "Express": <SiExpress />,
    "MongoDB": <SiMongodb />, "JWT": "🔑", "Figma": <FaFigma />, "Storybook": "📚"
  };

  return (
    <motion.a
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      href={project.link} target="_blank" rel="noopener noreferrer"
      className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
      style={{ background: `url('${project.image}') center/cover no-repeat`, cursor: 'pointer' }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent"></div>
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300 flex flex-col justify-between p-4 sm:p-6 text-white">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-cyan-300">{project.title}</h3>
          <p className="text-slate-300 mt-2 text-xs sm:text-sm leading-relaxed">{project.description}</p>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech.map((t, i) => (
              <span key={i} className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full bg-cyan-900/70 text-cyan-200 border border-cyan-800/30 backdrop-blur-sm">
                {techIcons?.[t] || t}
              </span>
            ))}
          </div>
          <FaExternalLinkAlt className="text-slate-300 group-hover:text-cyan-200 transition-colors duration-300" />
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-0 rounded-2xl border border-cyan-300/10 pointer-events-none"></div>
    </motion.a>
  );
};

// ===================================
// KOMPONEN UTAMA SECTION PROJECT
// ===================================
function ProjectSection() {
  const [activeTab, setActiveTab] = useState('Projects');
  const [projectCategory, setProjectCategory] = useState('Web/Apps');
  const { hideNavbar, showNavbar } = useNavbar();

  // Show More/Less Projects — show 4 on iPad/tablet (768px–1023px), 3 on others
  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const handler = (e) => setIsTablet(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const initialCount = isTablet ? 2 : 3;
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(initialCount);

  // Reset visible count when breakpoint changes
  useEffect(() => {
    setVisibleProjectsCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    return () => showNavbar();
  }, [showNavbar]);

  const tabs = [
    { id: 'Projects', label: 'Projects', icon: <PiCodeBold className="text-[1.7em] mb-1" /> },
    { id: 'Tech Stack', label: 'Tech Stack', icon: <LiaLayerGroupSolid className="text-[1.5em] mb-1" /> },
  ];

  const filteredProjects = dummyProjects.filter(p => p.category === projectCategory);

  // Reset visible count when switching category
  useEffect(() => {
    setVisibleProjectsCount(initialCount);
  }, [projectCategory]);

  const handleShowMore = () => setVisibleProjectsCount(filteredProjects.length);
  const handleShowLess = () => setVisibleProjectsCount(initialCount);

  return (
    <section id="project" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl font-bold font-moderniz">
          <span style={{ color: "#00ffdc" }}>PORTFOLIO</span>{' '}
          <span style={{ color: "#fff" }}>SHOWCASE</span>
        </h2>
      </motion.div>

      <div className="w-full">
        <div className="flex justify-center mb-12">
          <motion.div
            layout
            className="inline-flex w-full max-w-4xl rounded-3xl p-2 shadow-lg border border-slate-800 bg-gradient-to-r from-[#101624] via-[#0a1627] to-[#0a223a] backdrop-blur-md"
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer relative flex flex-1 flex-col items-center justify-center px-2 py-7 rounded-2xl font-semibold text-base transition-colors duration-300 outline-none ${activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-cyan-300"}`}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03 }}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute inset-0 bg-gradient-to-br from-[#0a223a] to-[#101624] rounded-2xl"
                    style={{ zIndex: -1, opacity: 0.96 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-2">
                  {tab.icon}
                  <span className="font-bold">{tab.label}</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className="rounded-3xl p-0 md:p-6 shadow-xl border border-slate-800/60 mx-auto max-w-7xl bg-clip-padding" style={{ background: "rgba(17, 24, 39, 0.55)", backdropFilter: "blur(16px)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-10"
            >
              {activeTab === 'Projects' && (
                <>
                  <div className="flex justify-center gap-4 mb-8">
                    <button className={`cursor-pointer px-5 py-2 rounded-full font-semibold transition-all duration-200 border ${projectCategory === 'Web/Apps' ? 'bg-cyan-700/80 text-white border-cyan-400 shadow-lg' : 'bg-slate-900/60 text-cyan-200 border-slate-700 hover:bg-cyan-800/40 hover:text-white'}`} onClick={() => setProjectCategory('Web/Apps')}>Web/Apps</button>
                    <button className={`cursor-pointer px-5 py-2 rounded-full font-semibold transition-all duration-200 border ${projectCategory === '3D Design' ? 'bg-cyan-700/80 text-white border-cyan-400 shadow-lg' : 'bg-slate-900/60 text-cyan-200 border-slate-700 hover:bg-cyan-800/40 hover:text-white'}`} onClick={() => setProjectCategory('3D Design')}>UI/UX Design</button>
                  </div>
                  <motion.div
                    key={projectCategory}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredProjects.slice(0, visibleProjectsCount).map((p, i) => (
                        <ProjectCard key={p.title} project={p} index={i} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                  {filteredProjects.length > initialCount && (
                    <div className="flex justify-center mt-12">
                      {visibleProjectsCount < filteredProjects.length ? (
                        <motion.button
                          onClick={handleShowMore}
                          className="group bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Show More
                        </motion.button>
                      ) : (
                        <motion.button
                          onClick={handleShowLess}
                          className="group bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 shadow-lg cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Show Less
                        </motion.button>
                      )}
                    </div>
                  )}
                </>
              )}
              {activeTab === 'Tech Stack' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  {Object.entries(techStack).map(([category, techs]) => (
                    <div key={category}>
                      <h3 className="text-xl font-bold text-cyan-300 capitalize mb-4 border-b-2 border-slate-800 pb-2">{category}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {techs.map((tech, i) => (
                          <div key={i} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:bg-slate-800/50 hover:border-cyan-500/30">
                            <div className="text-4xl">{tech.icon}</div>
                            <p className="text-sm text-slate-300">{tech.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default ProjectSection;
