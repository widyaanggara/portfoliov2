import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const socials = [
    { icon: <FaGithub />, href: 'https://github.com/widyaanggara', label: 'GitHub' },
    { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/widyanggara/', label: 'LinkedIn' },
    { icon: <FaInstagram />, href: 'https://www.instagram.com/widyanggaraa/', label: 'Instagram' },
    { icon: <FaEnvelope />, href: 'mailto:widyanggaraa005@gmail.com', label: 'Email' },
];

function ContactSection() {
    return (
        <section id="contact" className="py-24">
            <div className="max-w-2xl mx-auto text-center">
                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-cyan-400 font-cascadia text-sm tracking-widest uppercase mb-4"
                >
                    Contact
                </motion.p>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl sm:text-4xl font-bold font-moderniz text-white mb-5"
                >
                    Let's Build Something{' '}
                    <span style={{ color: '#00ffdc' }}>Together</span>
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-slate-400 font-cascadia text-sm leading-relaxed mb-10 max-w-md mx-auto"
                >
                    Have a project in mind or just want to say hello? I'd love to hear from you.
                </motion.p>

                {/* Email CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-12"
                >
                    <a
                        href="mailto:widyanggaraa005@gmail.com"
                        className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
                    >
                        <FaEnvelope className="text-lg" />
                        widyanggaraa005@gmail.com
                    </a>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="w-24 h-px bg-slate-700 mx-auto mb-8"
                />

                {/* Social Icons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex justify-center gap-5"
                >
                    {socials.map((s, i) => (
                        <a
                            key={i}
                            href={s.href}
                            target={s.href.startsWith('mailto') ? '_self' : '_blank'}
                            rel="noopener noreferrer"
                            aria-label={s.label}
                            className="group flex items-center justify-center w-12 h-12 rounded-full border border-slate-800 bg-slate-900/50 text-slate-400 text-xl transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-slate-800/70 hover:shadow-[0_0_12px_2px_#00ffdc30] hover:scale-110"
                        >
                            {s.icon}
                        </a>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default ContactSection;
