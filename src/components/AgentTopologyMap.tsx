import { useMemo } from 'react';
import { motion } from 'motion/react';
import { AgentNode, AgentLink, BiometricMetrics, BrainwaveBands } from '../types';
import { Cpu, Zap, Activity, ShieldAlert, Sparkles, Brain } from 'lucide-react';

interface AgentTopologyMapProps {
  metrics: BiometricMetrics;
  bands: BrainwaveBands;
  stateLabel: string;
}

export default function AgentTopologyMap({ metrics, bands, stateLabel }: AgentTopologyMapProps) {
  // Compute positions and structures dynamically based on active mental states
  const { nodes, links, activeStructure } = useMemo(() => {
    const { attention, meditation, chaos } = metrics;
    
    // Determine archetype structure
    let activeStructure = "Baseline Consortium";
    let nodePreset: Omit<AgentNode, 'x' | 'y'>[] = [];
    let linkPreset: AgentLink[] = [];

    if (chaos > 65) {
      activeStructure = "Dampened Analytical Guard (Noise Defense)";
      // Minimal topology: Sever links to damp stress and reduce context overhead.
      nodePreset = [
        { id: 'orch', name: 'Guide Orchestrator', role: 'Core Neural Mediator', load: 15, status: 'active' },
        { id: 'ground', name: 'Cognitive Grounder', role: 'Noise-Filter Barrier', load: 95, status: 'overloaded' },
        { id: 'swarm_a', name: 'Creative Swarm Alpha', role: 'Code Generator', load: 5, status: 'dampened' },
        { id: 'swarm_b', name: 'Creative Swarm Beta', role: 'Lateral Thinker', load: 5, status: 'dampened' },
        { id: 'compress', name: 'Context Compressor', role: 'Entropy Denoiser', load: 80, status: 'active' },
      ];
      linkPreset = [
        { source: 'orch', target: 'ground', strength: 0.9, active: true },
        { source: 'orch', target: 'compress', strength: 0.7, active: true },
        { source: 'ground', target: 'compress', strength: 0.4, active: true },
        // Others severed!
        { source: 'orch', target: 'swarm_a', strength: 0.05, active: false },
        { source: 'orch', target: 'swarm_b', strength: 0.05, active: false },
      ];
    } else if (meditation > 65) {
      activeStructure = "Reflective Socratic Panel (Deep Audit)";
      // Calm, sequential thinking: Guide & Inspector are clean and linked
      nodePreset = [
        { id: 'orch', name: 'Guide Orchestrator', role: 'Core Neural Mediator', load: 20, status: 'active' },
        { id: 'inspector', name: 'Socratic Auditor', role: 'Intuition Reviewer', load: 30, status: 'active' },
        { id: 'ground', name: 'Cognitive Grounder', role: 'Noise-Filter Barrier', load: 10, status: 'idle' },
        { id: 'swarm_a', name: 'Creative Swarm Alpha', role: 'Concept Map', load: 15, status: 'idle' },
        { id: 'compress', name: 'Context Compressor', role: 'Vector Cache', load: 12, status: 'idle' },
      ];
      linkPreset = [
        { source: 'orch', target: 'inspector', strength: 0.95, active: true },
        { source: 'orch', target: 'ground', strength: 0.3, active: true },
        { source: 'inspector', target: 'swarm_a', strength: 0.5, active: true },
        { source: 'inspector', target: 'compress', strength: 0.4, active: true },
      ];
    } else if (attention > 65 && bands.gamma > 23) {
      activeStructure = "High-Speed Creative Swarm (Peak Synthesis)";
      // Peak Flow: Multi-agent highly interconnected complex
      nodePreset = [
        { id: 'orch', name: 'Guide Orchestrator', role: 'Core Neural Mediator', load: 85, status: 'active' },
        { id: 'swarm_a', name: 'Creative Swarm Alpha', role: 'Deep Synaptic Threader', load: 92, status: 'active' },
        { id: 'swarm_b', name: 'Creative Swarm Beta', role: 'Accelerated Code Engine', load: 88, status: 'active' },
        { id: 'inspector', name: 'Socratic Auditor', role: 'Real-time Logic Gate', load: 60, status: 'active' },
        { id: 'compress', name: 'Context Compressor', role: 'Volatile Cache', load: 75, status: 'active' },
      ];
      linkPreset = [
        { source: 'orch', target: 'swarm_a', strength: 0.95, active: true },
        { source: 'orch', target: 'swarm_b', strength: 0.95, active: true },
        { source: 'swarm_a', target: 'swarm_b', strength: 0.9, active: true },
        { source: 'orch', target: 'inspector', strength: 0.8, active: true },
        { source: 'swarm_a', target: 'inspector', strength: 0.75, active: true },
        { source: 'swarm_b', target: 'compress', strength: 0.85, active: true },
        { source: 'compress', target: 'orch', strength: 0.7, active: true },
      ];
    } else {
      activeStructure = "Baseline Consensus Consortium";
      // Standard stable network
      nodePreset = [
        { id: 'orch', name: 'Guide Orchestrator', role: 'Core Neural Mediator', load: 45, status: 'active' },
        { id: 'ground', name: 'Cognitive Grounder', role: 'Sensor Boundary', load: 30, status: 'idle' },
        { id: 'swarm_a', name: 'Creative Swarm Alpha', role: 'Idea Incubator', load: 40, status: 'idle' },
        { id: 'inspector', name: 'Socratic Auditor', role: 'Logical Checkpoint', load: 35, status: 'idle' },
        { id: 'compress', name: 'Context Compressor', role: 'Token Packager', load: 38, status: 'idle' },
      ];
      linkPreset = [
        { source: 'orch', target: 'ground', strength: 0.6, active: true },
        { source: 'orch', target: 'swarm_a', strength: 0.7, active: true },
        { source: 'orch', target: 'inspector', strength: 0.5, active: true },
        { source: 'swarm_a', target: 'compress', strength: 0.5, active: true },
        { source: 'compress', target: 'orch', strength: 0.4, active: true },
      ];
    }

    // Map presets to dynamic SVG coords (circle radial pattern)
    const baseNodes: AgentNode[] = nodePreset.map((p, index) => {
      const angle = (index * 2 * Math.PI) / nodePreset.length - Math.PI / 2;
      const radius = 100 + (chaos > 65 ? -20 : meditation > 65 ? 10 : 25); // Contract/expand radial map
      const x = 200 + Math.cos(angle) * radius;
      const y = 200 + Math.sin(angle) * radius;
      return {
        ...p,
        x,
        y,
      } as AgentNode;
    });

    return { nodes: baseNodes, links: linkPreset, activeStructure };
  }, [metrics, bands, chaos => metrics.chaos, meditation => metrics.meditation, attention => metrics.attention]);

  // Helper structure map to easily get node positionsfor Link render
  const nodePositionMap = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    nodes.forEach(n => {
      map[n.id] = { x: n.x, y: n.y };
    });
    return map;
  }, [nodes]);

  // Determine line qualities
  const activeIntensityColor = metrics.chaos > 65 
    ? 'stroke-[#f43f5e]' // red for overload
    : metrics.meditation > 65 
      ? 'stroke-[#a855f7]' // purple stillness
      : (metrics.attention > 65 && bands.gamma > 23)
        ? 'stroke-[#06b6d4]' // cyan peak flow
        : 'stroke-[#3b82f6]'; // blue standard

  return (
    <div className="flex flex-col h-full bg-[#0c0e12] rounded-xl border border-slate-800 p-5 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 font-display">
            <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
            Adaptive Agent Topology
          </h2>
          <p className="text-xs text-slate-500 font-mono">Real-time LLM routing matrix based on neuro-dynamics</p>
        </div>
        <div className="px-2.5 py-1 bg-black/40 border border-slate-800 rounded text-center">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wide">
            {activeStructure}
          </span>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col md:flex-row items-center justify-between gap-4 p-2 min-h-0 overflow-hidden">
        {/* Left side/Centered: SVG Map */}
        <div className="relative flex-1 flex items-center justify-center max-h-[220px] md:max-h-none">
          {/* Background circuit grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

          <svg viewBox="0 0 400 400" className="w-full max-w-[240px] md:max-w-[260px] h-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="chaosGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Render Connections */}
            {links.map((link, idx) => {
              const start = nodePositionMap[link.source];
              const end = nodePositionMap[link.target];
              if (!start || !end) return null;

              const isSevered = !link.active;
              const motionDuration = metrics.attention > 65 ? 1.5 : metrics.chaos > 65 ? 5 : 3;

              return (
                <g key={`link-${idx}`}>
                  {/* Underlay glow path */}
                  {link.active && (
                    <line
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      className={`${activeIntensityColor} stroke-2 opacity-30`}
                      style={{ strokeDasharray: metrics.chaos > 65 ? '4, 12' : undefined }}
                    />
                  )}

                  {/* Main line mapping */}
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    className={`${link.active ? activeIntensityColor : 'stroke-slate-800'} ${link.active ? 'stroke-1.5' : 'stroke-1'} ${link.active ? 'opacity-80' : 'opacity-20'}`}
                    style={{
                      strokeDasharray: isSevered ? '5, 5' : undefined,
                    }}
                  />

                  {/* Animated transmission packet circle */}
                  {link.active && (
                    <motion.circle
                      r="3.5"
                      className={metrics.chaos > 65 ? 'fill-rose-400' : metrics.meditation > 65 ? 'fill-purple-400' : 'fill-cyan-400'}
                      initial={{ cx: start.x, cy: start.y }}
                      animate={{ cx: [start.x, end.x], cy: [start.y, end.y] }}
                      transition={{
                        duration: motionDuration,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  )}
                </g>
              );
            })}

            {/* Render Agent Nodes */}
            {nodes.map((node) => {
              const isOverloaded = node.status === 'overloaded';
              const isDampened = node.status === 'dampened';
              const nodeColor = isOverloaded
                ? 'bg-rose-500 text-rose-100 border-rose-400'
                : isDampened
                  ? 'bg-slate-900/50 text-slate-600 border-slate-800'
                  : node.id === 'orch'
                    ? 'bg-cyan-950 text-cyan-200 border-cyan-400'
                    : 'bg-slate-900 text-slate-250 border-slate-700';

              const scaleFactor = node.id === 'orch' ? 1.15 : 1.0;
              const dynamicScale = isDampened ? 0.8 : scaleFactor;

              return (
                <g key={node.id}>
                  {/* Node ambient pulse rings */}
                  {!isDampened && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={32 * dynamicScale}
                      fill={isOverloaded ? "url(#chaosGlow)" : "url(#nodeGlow)"}
                      className="animate-pulse"
                    />
                  )}

                  {/* HTML Node Overlay via foreignObject for high interactivity */}
                  <foreignObject
                    x={node.x - 36}
                    y={node.y - 36}
                    width="72"
                    height="72"
                    className="overflow-visible"
                  >
                    <motion.div
                      className="flex flex-col items-center justify-center w-full h-full text-center"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: dynamicScale, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    >
                      {/* Visual icon badge */}
                      <div className="relative">
                        <div className={`p-1.5 rounded-full border shadow-lg backdrop-blur-sm flex items-center justify-center ${nodeColor}`}>
                          {node.id === 'orch' ? (
                            <Brain className="h-4 w-4" />
                          ) : isOverloaded ? (
                            <ShieldAlert className="h-4 w-4" />
                          ) : metrics.meditation > 65 && node.id === 'inspector' ? (
                            <Cpu className="h-4 w-4 text-purple-400" />
                          ) : (metrics.attention > 65 && bands.gamma > 23) ? (
                            <Sparkles className="h-4 w-4 text-cyan-400" />
                          ) : (
                            <Cpu className="h-3.5 w-3.5" />
                          )}
                        </div>

                        {/* Floating dynamic priority indicator dot */}
                        <span className={`absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full ring-2 ring-[#0c0e12] ${
                          isOverloaded
                            ? 'bg-rose-500 shadow-[0_0_6px_#ef4444]'
                            : isDampened
                              ? 'bg-purple-500 shadow-[0_0_4px_#a855f7]'
                              : node.status === 'active'
                                ? 'bg-cyan-400 shadow-[0_0_6px_cyan]'
                                : 'bg-slate-500'
                        }`} />
                      </div>
                      {/* Node Mini Tag */}
                      <div className="mt-1 flex flex-col items-center select-none">
                        <span className={`text-[8.5px] font-semibold text-slate-100 uppercase tracking-tight line-clamp-1`}>
                          {node.id === 'orch' ? 'Orchestrator' : node.id === 'inspector' ? 'Auditor' : node.id === 'swarm_a' ? 'Swarm A' : node.id === 'swarm_b' ? 'Swarm B' : node.id === 'ground' ? 'Grounder' : 'Compressor'}
                        </span>
                        <span className="text-[6.5px] text-slate-400 scale-90 font-mono">
                          Ld:{node.load}%
                        </span>
                      </div>
                    </motion.div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right side: Interactive detailed Agent Node Status list */}
        <div className="w-full md:w-[170px] lg:w-[190px] flex flex-col gap-1.5 font-mono text-[9px] bg-black/40 p-2.5 rounded-lg border border-slate-800/60 shadow-inner overflow-y-auto max-h-[140px] md:max-h-none">
          <h3 className="text-[9px] text-slate-450 font-bold uppercase tracking-wider pb-1.5 border-b border-slate-800/80 flex items-center justify-between">
            <span>Roster Matrix</span>
            <span className="text-[8px] text-slate-500">Node Statuses</span>
          </h3>
          <div className="flex flex-col gap-1.5">
            {nodes.map((node) => {
              const isOverloaded = node.status === 'overloaded';
              const isDampened = node.status === 'dampened';
              const isActive = node.status === 'active';

              let statusLabel = "Standby";
              let statusBadgeCss = "";
              let indicatorDot = null;

              if (isOverloaded) {
                statusLabel = "Overload";
                statusBadgeCss = "bg-rose-950/30 border border-rose-500/30 text-rose-400 font-extrabold shadow-[0_0_8px_rgba(244,63,94,0.15)] animate-pulse";
                indicatorDot = (
                  <span className="relative flex h-1.5 w-1.5 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                  </span>
                );
              } else if (isDampened) {
                statusLabel = "Damped";
                statusBadgeCss = "bg-purple-950/20 border border-purple-900/40 text-purple-400";
                indicatorDot = (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60 mr-1 block" />
                );
              } else if (isActive) {
                statusLabel = "Active";
                statusBadgeCss = "bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 font-bold shadow-[0_0_6px_rgba(34,211,238,0.1)]";
                indicatorDot = (
                  <span className="relative flex h-1.5 w-1.5 mr-1">
                    <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                  </span>
                );
              } else {
                statusLabel = "Standby";
                statusBadgeCss = "bg-slate-900 border border-slate-850 text-slate-500";
                indicatorDot = (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-650 mr-1 block" />
                );
              }

              return (
                <div key={node.id} className="flex flex-col gap-0.5 p-1 rounded bg-[#050608]/40 border border-slate-900 hover:border-slate-800/80 hover:bg-[#050608]/80 transition-all duration-150">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {indicatorDot}
                      <span className="text-slate-200 font-semibold truncate leading-none">
                        {node.id === 'orch' ? 'Orchestrator' : node.id === 'inspector' ? 'Auditor' : node.id === 'swarm_a' ? 'Swarm A' : node.id === 'swarm_b' ? 'Swarm B' : node.id === 'ground' ? 'Grounder' : 'Compressor'}
                      </span>
                    </div>

                    <span className={`px-1 py-0.5 rounded-[2px] text-[7.5px] uppercase tracking-wider scale-90 origin-right font-semibold ${statusBadgeCss}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[7.5px] text-slate-500 scale-95 origin-left px-0.5 mt-0.5 leading-none">
                    <span className="truncate italic max-w-[85px]">{node.role}</span>
                    <span className={isOverloaded ? "text-rose-450 font-bold" : isActive ? "text-cyan-400" : "text-slate-400"}>
                      Load:{node.load}%
                    </span>
                  </div>

                  <div className="h-1 w-full bg-slate-950/60 rounded-full overflow-hidden mt-0.5 border border-slate-900">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isOverloaded ? 'bg-rose-500' : isDampened ? 'bg-purple-600' : isActive ? 'bg-cyan-500' : 'bg-slate-705'}`}
                      style={{ width: `${node.load}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Structural diagnostics bar */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-3 text-[10px] font-mono mt-auto">
        <div className="flex flex-col text-left">
          <span className="text-slate-500 uppercase text-[8px]">Matrix Links</span>
          <span className="text-slate-200 font-semibold">{links.filter(l => l.active).length} / {links.length} Active</span>
        </div>
        <div className="flex flex-col text-center border-x border-slate-800/80 px-1">
          <span className="text-slate-500 uppercase text-[8px]">Routing Overhead</span>
          <span className={metrics.chaos > 65 ? "text-rose-400" : "text-green-400"}>
            {metrics.chaos > 65 ? "Minimized" : (metrics.attention > 65 && bands.gamma > 23) ? "Enhanced" : "Nominal"}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-slate-500 uppercase text-[8px]">Socratic Focus</span>
          <span className="text-slate-200">
            {metrics.meditation > 65 ? "Introspection" : "Synthesizer"}
          </span>
        </div>
      </div>
    </div>
  );
}
