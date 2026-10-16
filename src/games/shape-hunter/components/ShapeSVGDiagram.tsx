import React from 'react';
import { SVGGeometryData } from '../types';

interface ShapeSVGDiagramProps {
  svgData: SVGGeometryData;
  accentColor?: string;
  glowColor?: string;
  showVertices?: boolean;
}

export const ShapeSVGDiagram: React.FC<ShapeSVGDiagramProps> = ({
  svgData,
  accentColor = '#00F5FF',
  glowColor = 'rgba(0, 245, 255, 0.45)',
  showVertices = true,
}) => {
  const { viewBoxWidth, viewBoxHeight, segments } = svgData;

  // Extract unique vertex coordinates for rendering intersection target points
  const vertexSet = new Set<string>();
  segments.forEach((seg) => {
    vertexSet.add(`${seg.x1},${seg.y1}`);
    vertexSet.add(`${seg.x2},${seg.y2}`);
  });

  const vertices = Array.from(vertexSet).map((str) => {
    const [x, y] = str.split(',').map(Number);
    return { x, y };
  });

  return (
    <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[380px] mx-auto p-3 sm:p-4 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden group">
      {/* Subtle cyber background grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Cyber Corner HUD Brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-slate-600 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-slate-600 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-slate-600 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-slate-600 pointer-events-none" />

      {/* Ambient center glow */}
      <div
        className="absolute w-44 h-44 rounded-full blur-[65px] opacity-25 pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
        style={{ backgroundColor: accentColor }}
      />

      {/* Scalable Vector Graphics Diagram */}
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full relative z-10 transition-transform duration-300 drop-shadow-[0_0_12px_var(--glow)] select-none"
        style={
          {
            '--glow': glowColor,
          } as React.CSSProperties
        }
      >
        <defs>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer subtle shadow under-lines */}
        {segments.map((seg, idx) => (
          <line
            key={`shadow-${idx}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke={accentColor}
            strokeWidth={4.5}
            strokeLinecap="round"
            opacity={0.35}
          />
        ))}

        {/* Primary Sharp Neon Vector Lines */}
        {segments.map((seg, idx) => (
          <line
            key={`line-${idx}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke="#ffffff"
            strokeWidth={2}
            strokeLinecap="round"
            filter="url(#neon-glow)"
          />
        ))}

        {/* Mathematical Vertex Nodes */}
        {showVertices &&
          vertices.map((v, idx) => (
            <g key={`vertex-${idx}`}>
              <circle
                cx={v.x}
                cy={v.y}
                r={3.5}
                fill={accentColor}
                stroke="#ffffff"
                strokeWidth={1}
                opacity={0.9}
              />
              <circle
                cx={v.x}
                cy={v.y}
                r={1.2}
                fill="#ffffff"
              />
            </g>
          ))}
      </svg>
    </div>
  );
};
