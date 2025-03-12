
import React, { useEffect, useRef, memo } from 'react';

const MapVisualization: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const pointsRef = useRef<{ x: number; y: number; size: number; speed: number }[]>([]);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match its display size
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        const { devicePixelRatio: ratio = 1 } = window;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        ctx.scale(ratio, ratio);
      }
    };

    // Grid parameters
    const pointDensity = 0.0015; // Reduced point density for better performance
    const connectionDistance = 60; // Reduced connection distance
    const maxPointSize = 1.5;
    const minPointSize = 0.5;
    
    // Create points
    const initializePoints = () => {
      resizeCanvas();
      const { width, height } = canvas;
      const pointCount = Math.floor(width * height * pointDensity);
      
      pointsRef.current = [];
      for (let i = 0; i < pointCount; i++) {
        pointsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxPointSize - minPointSize) + minPointSize,
          speed: Math.random() * 0.1 + 0.05, // Reduced speed
        });
      }
    };

    // Draw the network
    const draw = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines (representing streets/city blocks)
      ctx.strokeStyle = 'rgba(51, 195, 140, 0.05)'; // Reduced opacity
      ctx.lineWidth = 0.3; // Thinner lines
      
      const gridSize = 80; // Larger grid size for fewer lines
      
      // Only draw grid lines every other frame to improve performance
      if (Math.random() > 0.5) {
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
      
      // Update point positions
      pointsRef.current.forEach(point => {
        point.y -= point.speed;
        if (point.y < 0) {
          point.y = canvas.height;
          point.x = Math.random() * canvas.width;
        }
      });
      
      // Draw connections (optimized - reduced number of iterations)
      ctx.strokeStyle = 'rgba(51, 195, 140, 0.08)';
      ctx.lineWidth = 0.3;
      
      // Only check connections between points that are likely to be close
      // This significantly reduces the number of calculations
      const points = pointsRef.current;
      const gridCells: Record<string, number[]> = {};
      const cellSize = connectionDistance;
      
      // Place points in grid cells
      points.forEach((point, idx) => {
        const cellX = Math.floor(point.x / cellSize);
        const cellY = Math.floor(point.y / cellSize);
        const cellKey = `${cellX},${cellY}`;
        
        if (!gridCells[cellKey]) {
          gridCells[cellKey] = [];
        }
        gridCells[cellKey].push(idx);
      });
      
      // Check connections only with points in the same or adjacent cells
      Object.keys(gridCells).forEach(cellKey => {
        const [cellX, cellY] = cellKey.split(',').map(Number);
        
        // Check adjacent cells including current cell
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const neighborKey = `${cellX + i},${cellY + j}`;
            const neighborPoints = gridCells[neighborKey];
            
            if (!neighborPoints) continue;
            
            // Connect points from current cell with points from neighbor cell
            gridCells[cellKey].forEach(pointIdx => {
              neighborPoints.forEach(neighborIdx => {
                if (pointIdx >= neighborIdx) return; // Avoid duplicate connections
                
                const p1 = points[pointIdx];
                const p2 = points[neighborIdx];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
                }
              });
            });
          }
        }
      });
      
      // Draw points (representing properties/locations)
      ctx.fillStyle = 'rgba(51, 195, 140, 0.7)';
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Occasionally draw "property hotspots" (reduced frequency)
      if (Math.random() < 0.003) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(51, 195, 140, 0.2)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(51, 195, 140, 0.6)';
        ctx.fill();
      }
      
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Handle window resize
    const handleResize = () => {
      resizeCanvas();
      initializePoints();
    };

    window.addEventListener('resize', handleResize);

    // Initialize and start animation
    initializePoints();
    animationFrameRef.current = requestAnimationFrame(draw);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full z-0"
    />
  );
});

export default MapVisualization;
