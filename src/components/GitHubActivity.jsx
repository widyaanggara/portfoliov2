
import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaCalendarAlt } from 'react-icons/fa';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_LABEL = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Blue/cyan color levels matching the portfolio theme
const COLOR_LEVELS = [
    'rgba(10, 24, 50, 0.6)',   // level 0 - very dark blue (no activity)
    '#0c4a6e',                  // level 1
    '#0e7490',                  // level 2
    '#22d3ee',                  // level 3
    '#00ffdc',                  // level 4 - brightest (matches accent)
];

const getColor = (count) => {
    if (count === 0) return COLOR_LEVELS[0];
    if (count <= 2) return COLOR_LEVELS[1];
    if (count <= 5) return COLOR_LEVELS[2];
    if (count <= 8) return COLOR_LEVELS[3];
    return COLOR_LEVELS[4];
};

const GitHubActivity = ({ username = 'widyaanggara' }) => {
    const [originalContributions, setOriginalContributions] = useState({});
    const [contributions, setContributions] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [events, setEvents] = useState({});
    const [tooltip, setTooltip] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            // 1. Fetch ALL contribution data (remove ?y=last)
            try {
                const res = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${username}`
                );
                const data = await res.json();

                if (!cancelled && data.contributions) {
                    // Extract available years from data.total or contributions
                    const availableYears = Object.keys(data.total).map(Number).sort((a, b) => b - a);
                    setYears(availableYears);

                    // Filter contributions for the initial selected year (current year)
                    // If current year is not in data (e.g. new year), select the latest available
                    const initialYear = availableYears.includes(new Date().getFullYear())
                        ? new Date().getFullYear()
                        : availableYears[0];

                    setSelectedYear(initialYear);
                    setOriginalContributions(data); // Store full data
                }
            } catch (err) {
                console.error('Failed to fetch contributions:', err);
            }

            // 2. Fetch recent push events for commit details
            try {
                const allEvents = [];
                for (let page = 1; page <= 3; page++) {
                    const res = await fetch(
                        `https://api.github.com/users/${username}/events?per_page=100&page=${page}`
                    );
                    const data = await res.json();
                    if (!Array.isArray(data) || data.length === 0) break;
                    allEvents.push(...data);
                }

                const eventsByDate = {};
                allEvents.forEach((event) => {
                    if (event.type === 'PushEvent') {
                        const date = event.created_at.split('T')[0];
                        if (!eventsByDate[date]) eventsByDate[date] = [];
                        event.payload.commits?.forEach((commit) => {
                            eventsByDate[date].push({
                                message: commit.message.split('\n')[0],
                                repo: event.repo.name.split('/').pop(),
                            });
                        });
                    }
                });
                if (!cancelled) setEvents(eventsByDate);
            } catch (err) {
                // Events are optional
            }

            if (!cancelled) setLoading(false);
        };

        fetchData();
        return () => { cancelled = true; };
    }, [username]);

    // Update displayed contributions when selectedYear changes
    useEffect(() => {
        if (!originalContributions.contributions) return;

        const start = `${selectedYear}-01-01`;
        const end = `${selectedYear}-12-31`;

        const filtered = originalContributions.contributions.filter(c =>
            c.date >= start && c.date <= end
        );

        setContributions(filtered);
    }, [selectedYear, originalContributions]);

    // Build the contribution grid (52/53 weeks × 7 days)
    const { weeks, monthLabels, totalContributions } = useMemo(() => {
        if (!contributions.length) return { weeks: [], monthLabels: [], totalContributions: 0 };

        const contribMap = {};
        let total = 0;
        contributions.forEach((c) => {
            contribMap[c.date] = c.count;
            total += c.count;
        });

        const startDate = new Date(selectedYear, 0, 1); // Jan 1st
        // Adjust start date to the previous Sunday to align grid
        const startDay = startDate.getDay();
        const gridStartDate = new Date(startDate);
        gridStartDate.setDate(startDate.getDate() - startDay);

        const endDate = new Date(selectedYear, 11, 31); // Dec 31st

        const weeksArr = [];
        const current = new Date(gridStartDate);

        // We need to render enough weeks to cover the entire year
        while (current <= endDate || weeksArr.length < 52) {
            const week = [];
            for (let day = 0; day < 7; day++) {
                const y = current.getFullYear();

                const m = String(current.getMonth() + 1).padStart(2, '0');
                const d = String(current.getDate()).padStart(2, '0');
                const dateStr = `${y}-${m}-${d}`;

                const count = contribMap[dateStr] || 0;

                if (y !== selectedYear) {
                    week.push({ date: dateStr, count: 0, outsideYear: true });
                } else {
                    week.push({ date: dateStr, count: count, outsideYear: false });
                }

                current.setDate(current.getDate() + 1);
            }
            weeksArr.push(week);
            // Safety break for loop
            if (current.getFullYear() > selectedYear + 1) break;
        }

        // Month labels logic
        const labels = [];
        let lastMonth = -1;
        weeksArr.forEach((week, weekIndex) => {
            // Find first day in the week that belongs to this year to determine month label position
            const firstValidDay = week.find((d) => !d.outsideYear);
            if (firstValidDay) {
                const month = new Date(firstValidDay.date + 'T00:00:00').getMonth();
                if (month !== lastMonth) {
                    labels.push({ month: MONTHS[month], weekIndex });
                    lastMonth = month;
                }
            }
        });

        // Use total from API for accuracy if available, else sum calculated
        const apiTotal = originalContributions.total ? originalContributions.total[selectedYear] : total;

        return { weeks: weeksArr, monthLabels: labels, totalContributions: apiTotal || total };
    }, [contributions, selectedYear, originalContributions]);

    const handleMouseEnter = (dayData, e) => {
        if (!dayData) return;
        const rect = e.target.getBoundingClientRect();

        // Calculate position relative to viewport for fixed positioning
        const x = rect.left + rect.width / 2;
        const y = rect.top; // Position above the square

        const commits = events[dayData.date] || [];
        const dateObj = new Date(dayData.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        setTooltip({
            x,
            y,
            date: formattedDate,
            count: dayData.count,
            commits,
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
            className="max-w-6xl mx-auto mt-16 px-4"
        >
            <div className="relative p-4 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/70 border border-slate-800/80 shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 gap-4">
                    <div>
                        <h3 className="md:text-lg text-base font-semibold text-white font-moderniz">
                            Activity
                        </h3>
                    </div>

                    {!loading && (
                        <div className="flex items-center gap-4 w-full md:w-auto justify-end">


                            {/* Year Selector */}
                            <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1 border border-slate-800/60">
                                <button
                                    onClick={() => {
                                        const currentIndex = years.indexOf(selectedYear);
                                        if (currentIndex < years.length - 1) {
                                            setSelectedYear(years[currentIndex + 1]);
                                        }
                                    }}
                                    disabled={years.indexOf(selectedYear) === years.length - 1}
                                    className={`p-1.5 rounded-md transition-colors ${years.indexOf(selectedYear) === years.length - 1
                                        ? 'text-slate-700 cursor-not-allowed'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <span className="text-sm font-medium text-slate-200 min-w-[3rem] text-center">
                                    {selectedYear}
                                </span>

                                <button
                                    onClick={() => {
                                        const currentIndex = years.indexOf(selectedYear);
                                        if (currentIndex > 0) {
                                            setSelectedYear(years[currentIndex - 1]);
                                        }
                                    }}
                                    disabled={years.indexOf(selectedYear) === 0}
                                    className={`p-1.5 rounded-md transition-colors ${years.indexOf(selectedYear) === 0
                                        ? 'text-slate-700 cursor-not-allowed'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>



                {/* Contribution Grid */}
                <div
                    ref={containerRef}
                    className="relative w-full overflow-x-auto"
                    style={{ paddingBottom: '8px' }}
                >
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="flex items-center gap-3 text-slate-400">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4" fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Loading activity...
                            </div>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto pb-4">
                            <div className="min-w-[750px] w-full flex gap-4">
                                {/* Day labels */}
                                <div className="flex flex-col gap-[3px] pt-6 shrink-0 w-8">
                                    {DAYS_LABEL.map((day, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 flex items-center justify-end text-[10px] text-slate-500"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Grid */}
                                <div className="flex-1 flex gap-[3px]">
                                    {weeks.map((week, weekIdx) => {
                                        // Find month label for this week
                                        const label = monthLabels.find(l => l.weekIndex === weekIdx);

                                        return (
                                            <div key={weekIdx} className="flex-1 flex flex-col gap-[3px] relative pt-6">
                                                {/* Month Label */}
                                                {label && (
                                                    <span className="absolute top-0 left-0 text-xs text-slate-500 whitespace-nowrap">
                                                        {label.month}
                                                    </span>
                                                )}

                                                {/* Days */}
                                                {week.map((day, dayIdx) => (
                                                    <div
                                                        key={dayIdx}
                                                        className={`w-full aspect-square rounded-sm transition-all duration-200 ${day.outsideYear ? 'opacity-30' : ''}`}
                                                        style={{
                                                            backgroundColor: day ? getColor(day.count) : 'transparent',
                                                            cursor: day && !day.outsideYear ? 'pointer' : 'default',
                                                            border: day ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                                        }}
                                                        onMouseEnter={(e) => day && !day.outsideYear && handleMouseEnter(day, e)}
                                                        onMouseLeave={handleMouseLeave}
                                                    />
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tooltip Portal */}
                    {createPortal(
                        <AnimatePresence>
                            {tooltip && (
                                <div
                                    className="fixed z-[9999] pointer-events-none"
                                    style={{
                                        left: `${tooltip.x}px`,
                                        top: `${tooltip.y - 12}px`,
                                        transform: 'translate(-50%, -100%)'
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5, y: 15 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, y: 10 }}
                                        transition={{ duration: 0.2, type: 'spring', stiffness: 350, damping: 25 }}
                                        style={{ transformOrigin: "bottom center" }}
                                    >
                                        <div
                                            className="rounded-lg px-3 py-2 shadow-xl border border-slate-700/80 text-xs text-left"
                                            style={{
                                                background: 'rgba(10, 15, 30, 0.95)',
                                                backdropFilter: 'blur(12px)',
                                                maxWidth: '280px',
                                                minWidth: '160px',
                                            }}
                                        >
                                            {/* Date & count */}
                                            <p className="font-semibold text-white mb-1">{tooltip.date}</p>
                                            <p className="text-cyan-300 mb-1">
                                                {tooltip.count} {tooltip.count === 1 ? 'contribution' : 'contributions'}
                                            </p>

                                            {/* Commit details */}
                                            {tooltip.commits.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-slate-700/60">
                                                    <p className="text-slate-400 mb-1 font-semibold">
                                                        Commits:
                                                    </p>
                                                    <ul className="space-y-1">
                                                        {tooltip.commits.slice(0, 5).map((commit, i) => (
                                                            <li key={i} className="flex items-start gap-1.5">
                                                                <span className="text-cyan-400 mt-0.5 shrink-0 text-[10px]">●</span>
                                                                <span className="text-slate-300 break-words leading-tight">
                                                                    <span className="text-slate-500 text-[10px]">[{commit.repo}]</span>{' '}
                                                                    {commit.message}
                                                                </span>
                                                            </li>
                                                        ))}
                                                        {tooltip.commits.length > 5 && (
                                                            <li className="text-slate-500 italic">
                                                                +{tooltip.commits.length - 5} more...
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Arrow */}
                                            <div
                                                className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full"
                                                style={{
                                                    width: 0,
                                                    height: 0,
                                                    borderLeft: '6px solid transparent',
                                                    borderRight: '6px solid transparent',
                                                    borderTop: '6px solid rgba(10, 15, 30, 0.95)',
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>,
                        document.body
                    )}
                </div>

                {/* Legend - Moved outside scroll container */}
                {!loading && (
                    <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-end mt-6 pt-4 border-t border-slate-800/60">
                        {/* Center: Total Contributions */}
                        <div className="w-full md:w-auto md:absolute md:left-1/2 md:-translate-x-1/2 text-center mb-2 md:mb-0">
                            <p className="text-sm text-slate-400">
                                <span className="text-cyan-300 font-semibold">{totalContributions}</span>{' '}
                                contributions in {selectedYear}
                            </p>
                        </div>

                        {/* Right: Legend */}
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                            <span>Less</span>
                            {COLOR_LEVELS.map((color, i) => (
                                <div
                                    key={i}
                                    className="rounded-sm"
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        backgroundColor: color,
                                        border: '1px solid rgba(255,255,255,0.04)',
                                    }}
                                />
                            ))}
                            <span>More</span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default GitHubActivity;
