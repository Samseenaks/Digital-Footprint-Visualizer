
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FootprintData } from '../types';

interface VisualizerProps {
  data: FootprintData;
  themeColor: string; // Hex color for the radar chart
}

const Visualizer: React.FC<VisualizerProps> = ({ data, themeColor }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const size = Math.min(400, w - 40);
        setDimensions({ width: size, height: size });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const axisData = [
      { axis: "Professional", value: data.metrics.professionalDensity },
      { axis: "Social", value: data.metrics.socialConnectivity },
      { axis: "Activity", value: data.metrics.activityFrequency },
      { axis: "Privacy", value: data.metrics.privacyResilience },
    ];

    const angleSlice = (Math.PI * 2) / axisData.length;
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, 100]);

    // Draw the background circles
    const levels = 5;
    for (let j = 0; j < levels; j++) {
      const levelFactor = radius * ((j + 1) / levels);
      svg.append("circle")
        .attr("r", levelFactor)
        .attr("fill", "none")
        .attr("stroke", "rgba(255, 255, 255, 0.05)")
        .attr("stroke-dasharray", "4,4");
    }

    // Draw the axes
    const axis = svg.selectAll(".axis")
      .data(axisData)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("stroke", "rgba(255, 255, 255, 0.15)");

    axis.append("text")
      .attr("class", "legend")
      .text(d => d.axis)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(125) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => rScale(125) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("fill", "#94a3b8")
      .attr("font-size", width < 350 ? "10px" : "11px")
      .attr("font-weight", "700")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.1em");

    // Radar area
    const radarLine = d3.lineRadial<{axis: string, value: number}>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    const glowColor = themeColor === '#f87171' ? 'rgba(248, 113, 113, 0.4)' : 
                     themeColor === '#fbbf24' ? 'rgba(251, 191, 36, 0.4)' : 
                     'rgba(52, 211, 153, 0.4)';

    svg.append("path")
      .datum(axisData)
      .attr("d", radarLine)
      .attr("fill", glowColor.replace('0.4', '0.15'))
      .attr("stroke", themeColor)
      .attr("stroke-width", "2.5px")
      .style("filter", `drop-shadow(0px 0px 8px ${glowColor})`);

    // Points
    svg.selectAll(".radarCircle")
      .data(axisData)
      .enter()
      .append("circle")
      .attr("r", width < 350 ? 4 : 5)
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("fill", themeColor)
      .attr("stroke", "#0f172a")
      .attr("stroke-width", "2px");

  }, [data, dimensions, themeColor]);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center w-full overflow-hidden">
      <h3 className="text-[10px] md:text-xs font-black mb-4 text-slate-500 uppercase tracking-[0.2em] opacity-80">
        Presence Metrics
      </h3>
      <svg ref={svgRef} className="max-w-full h-auto"></svg>
    </div>
  );
};

export default Visualizer;
