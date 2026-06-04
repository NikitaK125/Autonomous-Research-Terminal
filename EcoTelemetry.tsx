import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Droplet,
  Sun,
  Flame,
  Wind,
  Cpu,
  TrendingUp,
  RefreshCw,
  Gauge,
  Thermometer,
  CloudRain
} from 'lucide-react';

export function EcoTelemetry() {
  const [moisture, setMoisture] = useState(48.5);
  const [temperature, setTemperature] = useState(24.2);
  const [lightIndex, setLightIndex] = useState(72);
  const [photosynthesisRate, setPhotosynthesisRate] = useState(84.1);
  const [co2Sequestration, setCo2Sequestration] = useState(12.4); // mg/hr
  const [isRaining, setIsRaining] = useState(false);
  const [isHeatwave, setIsHeatwave] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataPointsRef = useRef<number[]>(Array(50).fill(60));

  // Push log updates
  const addLog = (msg: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setTelemetryLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 9)]);
  };

  // Run initial simulation ticks
  useEffect(() => {
    addLog('EcoTelemetry Kernel Online.');
    addLog('Sensors connected: Cap Moisture, Optic Pyranometer, Quantum Flux.');
    
    const interval = setInterval(() => {
      // Natural sensor drift/simulation
      setMoisture((prev) => {
        let drift = (Math.random() - 0.5) * 0.4;
        if (isRaining) drift += 0.8;
        else drift -= 0.05; // slow drying
        const next = prev + drift;
        return next > 100 ? 100 : next < 10 ? 10 : next;
      });

      setTemperature((prev) => {
        let drift = (Math.random() - 0.5) * 0.15;
        if (isHeatwave) drift += 0.4;
        const next = prev + drift;
        return next > 50 ? 53 : next < 5 ? 5 : next;
      });

      // Recalculate Photosynthesis and Sequestration index
      // formula balancing light, water index, temperature
      setPhotosynthesisRate((prev) => {
        const waterFactor = moisture > 40 && moisture < 85 ? 1.0 : 0.4;
        const tempFactor = temperature > 18 && temperature < 32 ? 1.0 : 0.5;
        const lightFactor = lightIndex / 100;
        const target = waterFactor * tempFactor * lightFactor * 100;
        return parseFloat((prev * 0.8 + target * 0.2).toFixed(1));
      });

      setCo2Sequestration((prev) => {
        const rate = (photosynthesisRate * 0.15) + (Math.random() - 0.5) * 0.2;
        return parseFloat((rate < 0 ? 0 : rate).toFixed(2));
      });

    }, 2000);

    return () => clearInterval(interval);
  }, [isRaining, isHeatwave, moisture, temperature, lightIndex, photosynthesisRate]);

  // Handle stimulus triggers
  const triggerRain = () => {
    setIsRaining((prev) => {
      const next = !prev;
      if (next) {
        addLog('STIMULUS TRIGGERED: Cloudburst simulated. Watering field soil...');
        if (isHeatwave) setIsHeatwave(false);
      } else {
        addLog('STIMULUS ENDED: Precipitation stopped. Restoring state.');
      }
      return next;
    });
  };

  const triggerHeatwave = () => {
    setIsHeatwave((prev) => {
      const next = !prev;
      if (next) {
        addLog('STIMULUS TRIGGERED: Safe extreme heat wave projection activated...');
        if (isRaining) setIsRaining(false);
      } else {
        addLog('STIMULUS ENDED: Air cooling systems restoring ambient baseline.');
      }
      return next;
    });
  };

  const adjustLight = (val: number) => {
    setLightIndex(val);
    addLog(`STIMULUS TRIGGERED: Lux Pyranometer light exposure index set to ${val}%`);
  };

  // Render canvas osciloscope telemetry
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Shift data points vector
      const pts = dataPointsRef.current;
      pts.push(photosynthesisRate);
      pts.shift();

      // Background grid
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 25) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw active wave segment
      ctx.strokeStyle = '#a8b8d0';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const step = canvas.width / (pts.length - 1);
      pts.forEach((pt, idx) => {
        // map pt (0-100) to coordinates (canvas height flipped)
        const x = idx * step;
        const y = canvas.height - (pt / 100) * (canvas.height - 20) - 10;
        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw subtle glow shadow
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(168, 184, 208, 0.15)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [photosynthesisRate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="eco-telemetry-view">
      
      {/* LEFT PANEL: Live stats grid and control stimulus knobs (col-span-4) */}
      <div className="lg:col-span-4 bg-[#121418] border border-white/5 p-5 rounded-sm flex flex-col justify-between space-y-6">
        <div>
          <div className="border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
            <h3 className="font-serif italic text-white text-base">Ecosystem Core</h3>
            <span className="text-[8px] font-bold text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono bg-emerald-500/5">
              TELEMETRY LOGGED
            </span>
          </div>

          <p className="text-xs text-white/40 leading-relaxed mb-5">
            Model parameters representing simulated soil biology. Trigger environmental stimulus states to project crop carbon capture.
          </p>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Stat: Soil Moisture */}
            <div className={`p-3.5 border rounded-sm transition ${isRaining ? 'bg-indigo-500/10 border-indigo-500/40 text-white' : 'bg-white/5 border-white/5'}`}>
              <div className="flex items-center gap-1.5 mb-1 text-white/40">
                <Droplet className={`h-3.5 w-3.5 ${isRaining ? 'text-indigo-400 animate-bounce' : ''}`} />
                <span className="text-[9px] uppercase tracking-wider font-bold">Soil Water</span>
              </div>
              <p className="text-xl font-bold font-mono text-white/90">{moisture.toFixed(1)}%</p>
              <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono">Volumetric</span>
            </div>

            {/* Stat: Temperature */}
            <div className={`p-3.5 border rounded-sm transition ${isHeatwave ? 'bg-amber-500/10 border-amber-500/40 text-white' : 'bg-white/5 border-white/5'}`}>
              <div className="flex items-center gap-1.5 mb-1 text-white/40">
                <Thermometer className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[9px] uppercase tracking-wider font-bold">Thermal Index</span>
              </div>
              <p className="text-xl font-bold font-mono text-white/90">{temperature.toFixed(1)}°C</p>
              <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono">Ambient</span>
            </div>

            {/* Stat: Carbon Absorption */}
            <div className="p-3.5 bg-white/5 border border-white/5 rounded-sm col-span-2">
              <div className="flex items-center gap-1.5 mb-1 text-white/40">
                <Activity className="h-3.5 w-3.5 text-[#a8b8d0]" />
                <span className="text-[9px] uppercase tracking-wider font-bold">Carbon Sequestration Ratio</span>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-2xl font-serif italic text-[#a8b8d0] font-bold">{co2Sequestration.toFixed(2)}</p>
                <span className="text-[9px] text-white/40 font-mono">mg CO₂ / dm² / hr</span>
              </div>
            </div>

          </div>
        </div>

        {/* Climate Stimulus Suite Controls */}
        <div className="border-t border-white/5 pt-5 space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#a8b8d0] block font-mono">
            Simulated Climate Forcing Suite
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={triggerRain}
              className={`py-2 px-3 hover:opacity-95 text-[10px] uppercase font-bold tracking-wider rounded-sm border transition flex items-center justify-center gap-1.5 ${
                isRaining
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CloudRain className="h-3.5 w-3.5" />
              {isRaining ? 'Stop Rain' : 'Simulate Rain'}
            </button>

            <button
              onClick={triggerHeatwave}
              className={`py-2 px-3 hover:opacity-95 text-[10px] uppercase font-bold tracking-wider rounded-sm border transition flex items-center justify-center gap-1.5 ${
                isHeatwave
                  ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-md shadow-amber-500/10'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              {isHeatwave ? 'Cool Down' : 'Heatwave'}
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] uppercase tracking-wider text-white/50 font-bold">
              <span>Light Pyranometer Quantum flux</span>
              <span className="font-mono text-white/90 font-bold">{lightIndex}% LUX</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={lightIndex}
              onChange={(e) => adjustLight(parseInt(e.target.value))}
              className="w-full h-px bg-white/10 relative appearance-none cursor-pointer accent-white focus:outline-none"
            />
          </div>
        </div>

      </div>

      {/* RIGHT PANEL: Live osciloscope canvas and real-time logs (col-span-8) */}
      <div className="lg:col-span-8 flex flex-col justify-between gap-6" id="eco-telemetry-visualizer">
        
        {/* Real-time Oscilloscope */}
        <div className="bg-black/90 border border-white/10 p-5 rounded-sm flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h4 className="text-white text-xs tracking-wider uppercase font-mono font-bold">Photosynthesis Efficiency Osciloscope Progress</h4>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono font-bold text-[#a8b8d0] bg-white/10 px-2 py-0.5 rounded-sm border border-white/5">
                {photosynthesisRate.toFixed(1)}% Yield
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-[220px] bg-black border border-white/5 rounded-sm overflow-hidden flex items-stretch">
            <canvas
              ref={canvasRef}
              width={640}
              height={220}
              className="w-full h-full object-cover select-none"
            />
          </div>
        </div>

        {/* Live Kernel Logs Stream */}
        <div className="bg-[#121418] p-4 border border-white/5 rounded-sm h-[180px] flex flex-col overflow-hidden">
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 pb-2 mb-2 font-mono flex justify-between">
            <span>Environmental Telemetry Dispatch Stream</span>
            <span>Kernel: Active</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[10px] text-white/60">
            {telemetryLogs.length === 0 ? (
              <span className="text-white/20 italic">Waiting for telemetry logs to push...</span>
            ) : (
              telemetryLogs.map((log, idx) => (
                <div key={idx} className={`animate-fade-in ${idx === 0 ? 'text-[#a8b8d0] font-bold' : 'text-white/40'}`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
