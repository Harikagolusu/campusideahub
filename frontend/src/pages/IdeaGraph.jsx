import { useEffect, useState, useRef } from 'react';
import { Network as VisNetwork } from 'vis-network';
import axios from 'axios';
import { Network, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function IdeaGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const container = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await axios.get(`http://${window.location.hostname}:5000/api/graph`);
        setGraphData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#94a3b8",
      smooth: { type: 'continuous' }
    },
    physics: {
      enabled: true,
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springConstant: 0.08,
        springLength: 100,
        damping: 0.4,
        avoidOverlap: 0
      }
    },
    nodes: {
      shape: 'dot',
      size: 30,
      font: {
        size: 14,
        color: '#1e293b',
        face: 'var(--font-sans)',
        strokeWidth: 3,
        strokeColor: '#ffffff'
      },
      borderWidth: 2,
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
    }
  };

  useEffect(() => {
    if (!loading && container.current) {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
      networkRef.current = new VisNetwork(container.current, graphData, options);

      networkRef.current.on('select', function(event) {
        // var { nodes, edges } = event;
        // logic for clicks if desired
      });

      return () => {
        if (networkRef.current) {
          networkRef.current.destroy();
          networkRef.current = null;
        }
      };
    }
  }, [loading, graphData]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center animate-pulse text-indigo-500"><Network size={40} className="animate-bounce" /></div>;

  return (
    <div className="pt-20 px-4 max-w-7xl mx-auto h-[90vh] flex flex-col relative">
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-cyan-500">
            Idea Evolution Graph
          </h1>
          <p className="text-slate-600 font-medium">See how student ideas connect and grow over time.</p>
        </div>
      </div>
      
      <div className="flex-1 glass-card overflow-hidden relative shadow-2xl border-indigo-100">
        <div ref={container} style={{ height: "100%", width: "100%" }} />
        
        <div className="absolute bottom-6 right-6 flex gap-2">
          {['AI', 'Web', 'IoT', 'Cybersecurity', 'Cloud'].map(domain => (
            <div key={domain} className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-slate-200 text-xs font-semibold text-slate-700">
              {domain}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
