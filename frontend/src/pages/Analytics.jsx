import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Activity, LayoutDashboard, Target, Users } from 'lucide-react';
import axios from 'axios';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#3b82f6', '#f43f5e'];

export default function Analytics() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/projects`);
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Derived filter options
  const years = useMemo(() => {
    const y = [...new Set(projects.map(p => p.year?.toString() || new Date(p.created_at).getFullYear().toString() || 'Unknown'))];
    return ['All', ...y.sort((a, b) => b.localeCompare(a))];
  }, [projects]);

  const domains = useMemo(() => {
    const d = [...new Set(projects.map(p => p.domain || 'Uncategorized'))];
    return ['All', ...d.sort()];
  }, [projects]);

  // Filtered data for cards and pie chart
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const pYear = p.year?.toString() || new Date(p.created_at).getFullYear().toString() || 'Unknown';
      const pDomain = p.domain || 'Uncategorized';
      return (selectedYear === 'All' || pYear === selectedYear) &&
             (selectedDomain === 'All' || pDomain === selectedDomain);
    });
  }, [projects, selectedYear, selectedDomain]);

  // Summary Metrics
  const summary = useMemo(() => {
    const total = filteredProjects.length;
    const currentYear = new Date().getFullYear().toString();
    const thisYear = filteredProjects.filter(p => (p.year?.toString() || new Date(p.created_at).getFullYear().toString()) === currentYear).length;
    const contributors = new Set(filteredProjects.map(p => p.submitted_by)).size;
    
    // Most popular domain
    const counts = {};
    filteredProjects.forEach(p => {
      counts[p.domain] = (counts[p.domain] || 0) + 1;
    });
    let mostPopular = 'N/A';
    let maxCount = 0;
    for (const [dom, cnt] of Object.entries(counts)) {
      if (cnt > maxCount && dom !== 'undefined') {
        maxCount = cnt;
        mostPopular = dom;
      }
    }

    return { total, thisYear, contributors, mostPopular };
  }, [filteredProjects]);

  // Transform data for Yearly Stacked Bar & Line Chart
  // We use the full projects list here so the trend isn't isolated when year/domain are "All",
  // but we can respect domain filter to just show trend for one domain.
  const chartData = useMemo(() => {
    const dataByYear = {};
    const filteredForChart = projects.filter(p => selectedDomain === 'All' || (p.domain || 'Uncategorized') === selectedDomain);

    filteredForChart.forEach(p => {
      const pYear = p.year?.toString() || new Date(p.created_at).getFullYear().toString() || 'Unknown';
      const dom = p.domain || 'Uncategorized';
      
      if (!dataByYear[pYear]) {
        dataByYear[pYear] = { name: pYear };
      }
      dataByYear[pYear][dom] = (dataByYear[pYear][dom] || 0) + 1;
    });

    return Object.values(dataByYear).sort((a, b) => a.name.localeCompare(b.name));
  }, [projects, selectedDomain]);

  // Get active domains across the chart data for dynamic bars/lines
  const activeDomains = useMemo(() => {
    const doms = new Set();
    chartData.forEach(item => {
      Object.keys(item).forEach(k => {
        if (k !== 'name') doms.add(k);
      });
    });
    return Array.from(doms);
  }, [chartData]);

  // Transform data for Pie Chart
  const pieData = useMemo(() => {
    const counts = {};
    filteredProjects.forEach(p => {
      const dom = p.domain || 'Uncategorized';
      counts[dom] = (counts[dom] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredProjects]);

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-indigo-500"><Activity size={40} className="animate-spin-slow" /></div>;

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-500 mb-2 flex items-center gap-3">
          <LayoutDashboard className="text-indigo-600" size={36} /> Project Analytics Dashboard
        </h1>
        <p className="text-slate-600 font-medium text-lg">Visualizing innovation trends and emerging domains across campus projects.</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 border-indigo-50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors pointer-events-none"></div>
          <p className="text-slate-500 font-semibold mb-1 relative text-sm uppercase tracking-wide">Total Projects</p>
          <h2 className="text-4xl font-black text-slate-800 relative">{summary.total}</h2>
          <Target className="absolute right-6 bottom-6 text-indigo-200 group-hover:text-indigo-300 transition-colors" size={32} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border-cyan-50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-50 rounded-full blur-2xl group-hover:bg-cyan-100 transition-colors pointer-events-none"></div>
          <p className="text-slate-500 font-semibold mb-1 relative text-sm uppercase tracking-wide">Most Popular Domain</p>
          <h2 className="text-2xl font-black text-slate-800 relative mt-2 truncate pr-10">{summary.mostPopular}</h2>
          <Activity className="absolute right-6 bottom-6 text-cyan-200 group-hover:text-cyan-300 transition-colors" size={32} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 border-emerald-50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors pointer-events-none"></div>
          <p className="text-slate-500 font-semibold mb-1 relative text-sm uppercase tracking-wide">Active Contributors</p>
          <h2 className="text-4xl font-black text-slate-800 relative">{summary.contributors}</h2>
          <Users className="absolute right-6 bottom-6 text-emerald-200 group-hover:text-emerald-300 transition-colors" size={32} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 border-purple-50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full blur-2xl group-hover:bg-purple-100 transition-colors pointer-events-none"></div>
          <p className="text-slate-500 font-semibold mb-1 relative text-sm uppercase tracking-wide">Projects This Year</p>
          <h2 className="text-4xl font-black text-slate-800 relative">{summary.thisYear}</h2>
          <LayoutDashboard className="absolute right-6 bottom-6 text-purple-200 group-hover:text-purple-300 transition-colors" size={32} />
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-8 flex flex-wrap gap-4 items-center relative z-20">
        <span className="font-bold text-slate-700 ml-2">Filters:</span>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-500">Year</label>
          <select 
            className="glass-input h-10 py-0 text-sm font-semibold cursor-pointer"
            value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-500">Domain</label>
          <select 
            className="glass-input h-10 py-0 text-sm font-semibold cursor-pointer max-w-xs"
            value={selectedDomain} onChange={e => setSelectedDomain(e.target.value)}
          >
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Domain-wise Projects by Year (Stacked Bar) */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Domain-wise Projects by Year</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f8fafc'}}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                {activeDomains.map((dom, i) => (
                  <Bar key={dom} dataKey={dom} stackId="a" fill={COLORS[i % COLORS.length]} radius={i === activeDomains.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Trend Line Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Trend of Domains Over Time</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                {activeDomains.map((dom, i) => (
                  <Line key={dom} type="monotone" dataKey={dom} stroke={COLORS[i % COLORS.length]} strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Domain Distribution Pie Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 shadow-sm w-full lg:w-1/2 mx-auto">
        <h3 className="font-bold text-lg text-slate-800 mb-2 text-center">Domain Distribution</h3>
        <p className="text-center text-slate-500 text-sm mb-6">Percentage breakdown of project domains.</p>
        <div className="h-80 w-full flex justify-center items-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="none"
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value} projects`, entry => entry.name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-400 font-semibold text-center mt-10">No projects match the current filters.</div>
          )}
        </div>
      </motion.div>

    </div>
  );
}
