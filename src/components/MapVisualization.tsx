
import React, { useEffect, useRef } from 'react';

const MapVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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
    let points: { x: number; y: number; size: number; speed: number }[] = [];
    const pointDensity = 0.003; // Points per pixel
    const connectionDistance = 80;
    const maxPointSize = 2;
    const minPointSize = 0.5;
    
    // Create points
    const initializePoints = () => {
      resizeCanvas();
      const { width, height } = canvas;
      const pointCount = Math.floor(width * height * pointDensity);
      
      points = [];
      for (let i = 0; i < pointCount; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxPointSize - minPointSize) + minPointSize,
          speed: Math.random() * 0.2 + 0.1,
        });
      }
    };

    // Draw the network
    const draw = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines (representing streets/city blocks)
      ctx.strokeStyle = 'rgba(51, 195, 140, 0.1)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 50;
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
      
      // Update point positions
      points.forEach(point => {
        point.y -= point.speed;
        if (point.y < 0) {
          point.y = canvas.height;
          point.x = Math.random() * canvas.width;
        }
      });
      
      // Draw connections
      ctx.strokeStyle = 'rgba(51, 195, 140, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw points (representing properties/locations)
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(51, 195, 140, 0.8)';
        ctx.fill();
      });
      
      // Occasionally draw "property hotspots"
      if (Math.random() < 0.01) {
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
      
      requestAnimationFrame(draw);
    };

    // Handle window resize
    window.addEventListener('resize', () => {
      resizeCanvas();
      initializePoints();
    });

    // Initialize and start animation
    initializePoints();
    draw();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full z-0"
    />
  );
};

export default MapVisualization;
