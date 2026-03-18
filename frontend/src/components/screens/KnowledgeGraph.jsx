import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { useStore } from '../../hooks/useStore';
import { useSkillGraph } from '../../hooks/useSkillGraph';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Network, Search, Filter, Play, AlertCircle } from 'lucide-react';

export default function KnowledgeGraph() {
  const { nextStep } = useStore();
  const { graphData, isLoading, error } = useSkillGraph();
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // D3 Visualization logic
  useEffect(() => {
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0 || !svgRef.current || !containerRef.current) return;
    
    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();
    
    const width = containerRef.current.clientWidth;
    const height = 600;
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);
      
    // Force Simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.edges).id(d => d.id).distance(d => d.strong ? 50 : 150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => d.radius + 10));

    // Links
    const link = svg.append("g")
      .attr("stroke", "#3f3c77")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(graphData.edges)
      .join("line")
      .attr("stroke-width", d => Math.max(1, d.strength * 5))
      .attr("stroke-dasharray", d => d.strong ? "none" : "4,4");

    // Heat glow definitions
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(graphData.nodes)
      .join("g")
      .call(drag(simulation))
      .on("click", (event, d) => setSelectedNode(d));

    // Node circles
    node.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.owned ? "#6C63FF" : "#1E1E2E")
      .attr("stroke", d => {
        if (d.hot) return "#FF3B30";
        return d.owned ? "#ffffff" : "#4A4A68";
      })
      .attr("stroke-width", 2)
      .attr("filter", d => d.hot ? "url(#glow)" : null);

    // Node labels
    node.append("text")
      .text(d => d.name)
      .attr("x", 0)
      .attr("y", d => d.radius + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#E0E0E0")
      .attr("font-size", d => d.owned ? "14px" : "12px")
      .attr("font-weight", d => d.owned ? "bold" : "normal")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
    
    return () => {
      simulation.stop();
    };
  }, [graphData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-text-secondary font-mono">Synthesizing Ontology Model...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-center">
        <Card className="max-w-md mx-auto">
          <AlertCircle className="text-accent w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Graph Generation Failed</h3>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-4xl font-display font-bold mb-2">Topology Map</h2>
            <p className="text-text-secondary">Explore your skill adjacencies and market gravity vectors.</p>
          </div>
          
          <Button variant="glow" onClick={nextStep} className="hidden md:flex">
            Scan Market Sentiment <Play size={16} fill="white" />
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Visualizer */}
          <Card className="lg:col-span-3 p-0 overflow-hidden relative" glass={false}>
            {/* Top Toolbar overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
              <div className="bg-background/80 backdrop-blur border border-border rounded-lg p-2 px-4 flex gap-4 pointer-events-auto">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <div className="w-3 h-3 rounded-full bg-primary" /> Owned
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-surface border-2 border-border" /> Adjacent
                </div>
                <div className="flex items-center gap-2 text-sm text-accent">
                  <div className="w-3 h-3 rounded-full bg-surface border-2 border-accent shadow-[0_0_8px_rgba(255,59,48,0.8)]" /> Hot Market
                </div>
              </div>
              
              <div className="flex gap-2 pointer-events-auto">
                <button className="w-10 h-10 bg-background/80 backdrop-blur border border-border rounded-lg flex items-center justify-center hover:bg-surface transition">
                  <Search size={18} />
                </button>
                <button className="w-10 h-10 bg-background/80 backdrop-blur border border-border rounded-lg flex items-center justify-center hover:bg-surface transition">
                  <Filter size={18} />
                </button>
              </div>
            </div>
            
            {/* SVG Container */}
            <div ref={containerRef} className="w-full h-[600px] cursor-move bg-[#0d0d14]">
              <svg ref={svgRef} className="w-full h-full" />
            </div>
          </Card>
          
          {/* Side Panel - Selection Details */}
          <div className="flex flex-col gap-6">
            <Card className="flex-grow">
              {!selectedNode ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted text-center italic p-4">
                  <Network size={40} className="opacity-20 mb-4" />
                  Select a node on the graph to inspect its properties and market alignment.
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={selectedNode.id}
                  className="space-y-6"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold font-display">{selectedNode.name}</h3>
                      {selectedNode.hot && (
                        <div className="flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded">
                          <span className="animate-pulse">🔥</span> HOT
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-mono text-text-muted mb-4 uppercase tracking-wider border-b border-border/50 pb-4">
                      {selectedNode.category} • {selectedNode.owned ? 'Acquired' : 'Target'}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-text-muted mb-1">Market Gravity</div>
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-display font-medium text-primary">
                          {selectedNode.demand}/100
                        </div>
                        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${selectedNode.demand > 80 ? 'bg-primary' : 'bg-text-muted'}`}
                            style={{ width: `${selectedNode.demand}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-text-muted mb-1">Trend Vector</div>
                      <div className="text-lg font-medium capitalize flex items-center gap-2">
                        {selectedNode.trend === 'growing' ? (
                          <span className="text-success">↗ Growing Demand</span>
                        ) : selectedNode.trend === 'declining' ? (
                          <span className="text-accent">↘ Declining Need</span>
                        ) : (
                          <span className="text-text-secondary">→ Stable Market</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!selectedNode.owned && (
                    <div className="pt-6 border-t border-border/50">
                      <Button variant="primary" className="w-full text-sm py-3">
                        Calculate ROI to Acquire
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </Card>
            
            <Button variant="glow" onClick={nextStep} className="w-full md:hidden">
              Scan Market Sentiment <Play size={16} fill="white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
