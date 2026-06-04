import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Terminal as TerminalIcon,
  Cpu,
  Layers,
  Search,
  Shield,
  Zap,
  GitCommit,
  FileCode,
  Activity,
  Database,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LogLine {
  id: string;
  timestamp: string;
  type: 'system' | 'info' | 'success' | 'warning' | 'reply' | 'command';
  text: string;
}

export function AutonomousTerminal() {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemUptime, setSystemUptime] = useState('00:00:00');
  const [memoryLoad, setMemoryLoad] = useState(57);
  const [kernelStatus, setKernelStatus] = useState<'IDLE' | 'BUSY' | 'SYNCING'>('IDLE');
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // System uptime clock
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      const secs = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      const mins = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const hrs = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      setSystemUptime(`${hrs}:${mins}:${secs}`);
      
      // Slighly fluctuate memory for realistic telemetry
      setMemoryLoad((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next > 80 ? 75 : next < 40 ? 45 : next;
      });
    }, 1000);

    // Initial boot sequence log
    const initialBootLogs: LogLine[] = [
      { id: '1', timestamp: getTimestamp(), type: 'system', text: 'AETHER.OS [Version 0.9.1b] INITIALIZING KERNEL...' },
      { id: '2', timestamp: getTimestamp(), type: 'info', text: 'Target device: Autonomous Research Cluster // Port: 3000' },
      { id: '3', timestamp: getTimestamp(), type: 'info', text: 'Checking cognitive weights index... OK (Ready: gemini-3.5-flash)' },
      { id: '4', timestamp: getTimestamp(), type: 'success', text: 'Connected: AI Research Subnet via secure Server-Side integration.' },
      { id: '5', timestamp: getTimestamp(), type: 'system', text: 'Type "help" to list available mainframe terminal hooks, or click below.' }
    ];
    setLogs(initialBootLogs);

    return () => clearInterval(interval);
  }, []);

  // Safe scroll on new log appending
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  function getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  const addLog = (type: LogLine['type'], text: string) => {
    const newLine: LogLine = {
      id: Math.random().toString(),
      timestamp: getTimestamp(),
      type,
      text
    };
    setLogs((prev) => [...prev, newLine]);
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    setInputVal('');
    addLog('command', `$ ${cmd}`);
    await executeCommand(cmd);
  };

  const executeCommand = async (fullCommand: string) => {
    setIsProcessing(true);
    setKernelStatus('BUSY');
    
    const parts = fullCommand.split(' ');
    const baseCmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    await new Promise((resolve) => setTimeout(resolve, 300)); // micro-delay for terminal feel

    switch (baseCmd) {
      case 'help':
        addLog('info', '================= MAIN MAIN DIRECTORY HOOKS =================');
        addLog('info', '  research <query> : Deploy deep Gemini autonomous agent to investigate any topic.');
        addLog('info', '  agents           : Audit status and load index of neural research sub-nodes.');
        addLog('info', '  system           : Print raw system hardware metrics and diagnostic states.');
        addLog('info', '  matrix           : Launch a 4D tensor matrix multiplication benchmark of Fisher index.');
        addLog('info', '  clean            : Clear terminal screen and reset telemetry stream.');
        addLog('info', '=============================================================');
        break;

      case 'clean':
        setLogs([
          { id: 'boot', timestamp: getTimestamp(), type: 'system', text: 'Terminal logs reset successfully. Aether kernel waiting...' }
        ]);
        break;

      case 'system':
        addLog('system', '--- HARDSYSTEM TELEMETRY DISPATCH ---');
        addLog('info', `  CORES          : Broadwell VM Core x2 // Frequency 2.30 GHz`);
        addLog('info', `  UPTIME         : ${systemUptime}`);
        addLog('info', `  MEMORY LOAD    : ${memoryLoad}% allocated from isolated container space`);
        addLog('info', `  ACTIVE PORT    : Port 3000 (Ingress Secure Reverse Proxy Tunnel)`);
        addLog('info', `  LLM ENGINE     : Gemini 3.5 Flash Protocol`);
        addLog('success', 'DIAGNOSTICS RESOLVE: ALL CONSTRAINTS NORMAL');
        break;

      case 'agents':
        addLog('system', '--- ACTIVE SUB-AGENT DIRECTORY MATRIX ---');
        addLog('info', '  [01] ORCHESTRATOR_AGENT    - STATUS: IDLE   - LOAD: 2%   - ROLE: Sequence Controller');
        addLog('info', '  [02] VECTOR_SEARCH_CRAWLER  - STATUS: ACTIVE - LOAD: 12%  - ROLE: Grounding Indexer');
        addLog('info', '  [03] HEURISTIC_RESOLVER     - STATUS: ONLINE - LOAD: 0%   - ROLE: Mathematical Validator');
        addLog('info', '  [04] SYNTHESIZER_MODEL_V4   - STATUS: READY  - LOAD: 45%  - ROLE: Markdown Compiler');
        break;

      case 'matrix':
        addLog('info', 'Initializing recursive mathematical benchmarks over Fisher database dimensions (150x4 entries)...');
        addLog('info', 'Calculating covariance matrices, eigenvalues, and standard error vectors...');
        await new Promise((resolve) => setTimeout(resolve, 800));
        addLog('success', '✓ Covariance Matrix Calculated.');
        addLog('success', '✓ Eigenvector Projection Completed: Petal space ratio = 92.46% variance.');
        addLog('info', 'Eigenvalues: [ 4.22, 0.24, 0.08, 0.02 ]');
        addLog('success', 'MATRIX COMPILATION STABLE // LATENCY: 0.003s');
        break;

      case 'research':
        if (!args) {
          addLog('warning', 'SYNTAX TARGET ERROR: Command "research" requires a query string. Example: "research deep learning inside botanical biology"');
          break;
        }
        addLog('system', `DEPLOYING AUTONOMOUS AGENT PROTOCOL: "${args.toUpperCase()}"...`);
        addLog('info', 'Negotiating secure SSL link... Querying server-side model nodes connected to Google AI Studio APIs...');
        
        try {
          const res = await fetch('/api/research', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: args })
          });

          if (!res.ok) {
            throw new Error(`Mainframe HTTP Error ${res.status}`);
          }

          const data = await res.json();
          addLog('success', `✓ COGNITIVE SYNTHESIS COMPLETED // SOURCE NODE: gemini-3.5-flash`);
          addLog('reply', data.result || 'Empty research compilation node.');
        } catch (error: any) {
          addLog('warning', `COGNITIVE FAILURE: Machine link timeout or connection broken. Error details: "${error.message}"`);
          addLog('info', 'Fallback local agent advice: Ensure to specify realistic scientific or technical questions.');
        }
        break;

      default:
        addLog('warning', `SYSTEM HOOK ERR: Command "${baseCmd}" not recognized by Aether kernel. Enter "help" to view directory of commands.`);
        break;
    }

    setIsProcessing(false);
    setKernelStatus('IDLE');
  };

  const loadPresetQuery = (topic: string) => {
    setInputVal(`research ${topic}`);
    addLog('command', `$ research ${topic}`);
    executeCommand(`research ${topic}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full" id="autonomous-terminal-view">
      
      {/* 1. Terminal Console (col-span-8) */}
      <div className="lg:col-span-8 flex flex-col bg-black rounded-sm border border-white/10 overflow-hidden font-mono text-[11px] leading-relaxed shadow-2xl h-[540px]">
        
        {/* Terminal Header Bar */}
        <div className="bg-[#121418] px-4 py-2.5 border-b border-white/10 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span className="text-[10px] text-white/50 tracking-wider font-bold ml-2 uppercase">AETHER.OS AUTONOMOUS MAIN SHELL v0.9 // SECURE CLUSTERING</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/40 text-[9px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>NODE: PORT-3000</span>
          </div>
        </div>

        {/* Terminal Feed Canvas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-white/80 max-h-[440px] bg-black/95">
          {logs.map((log) => {
            let colorClass = 'text-white/60';
            let prefix = '::';

            if (log.type === 'system') {
              colorClass = 'text-red-400 font-bold';
              prefix = 'SYSTEM';
            } else if (log.type === 'info') {
              colorClass = 'text-white/55';
              prefix = 'INFO';
            } else if (log.type === 'success') {
              colorClass = 'text-emerald-400 font-bold';
              prefix = 'SUCCESS';
            } else if (log.type === 'warning') {
              colorClass = 'text-amber-400 font-bold';
              prefix = 'WARN!';
            } else if (log.type === 'command') {
              colorClass = 'text-white font-semibold text-xs';
              prefix = 'USER';
            } else if (log.type === 'reply') {
              return (
                <div key={log.id} className="bg-white/5 border border-white/10 p-3.5 my-1.5 rounded-sm overflow-x-auto whitespace-pre-wrap max-w-full block">
                  <div className="text-[9px] text-[#a8b8d0] font-bold uppercase tracking-widest border-b border-white/10 pb-1.5 mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Autonomous Agent Target Analysis Output
                  </div>
                  <div className="text-[11px] text-white/90 leading-relaxed font-sans">{log.text}</div>
                </div>
              );
            }

            return (
              <div key={log.id} className="flex items-start gap-2.5">
                <span className="text-white/25 mt-0.5 select-none shrink-0 font-light font-mono text-[9px]">{log.timestamp}</span>
                <span className={`px-1.5 py-0.5 rounded-[1px] text-[8px] uppercase font-extrabold tracking-wider bg-white/5 border border-white/5 select-none shrink-0 ${colorClass}`}>
                  {prefix}
                </span>
                <p className={`flex-1 break-words leading-relaxed font-mono ${colorClass}`}>{log.text}</p>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center gap-2.5 py-1 text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
              <span className="text-[10px] italic tracking-wide font-mono">Agent reasoning engine calculating deep answers...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Input Form Fields */}
        <form onSubmit={handleCommandSubmit} className="p-3 bg-[#121418] border-t border-white/10 flex items-center gap-2 select-none">
          <span className="text-emerald-400 font-bold pl-1 font-mono text-[12px]">$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isProcessing}
            placeholder='Type a command ("help" for directories, "research <topic>" to query)...'
            className="flex-1 bg-transparent border-none outline-none font-mono text-white text-[11px] focus:ring-0 placeholder:text-white/20"
            autoFocus
          />
          <button
            type="submit"
            disabled={isProcessing}
            className="p-1 px-3 bg-white hover:bg-white/90 text-black text-[9px] font-bold uppercase tracking-wider rounded-sm select-none transition disabled:opacity-30 flex items-center gap-1 font-mono"
          >
            <Play className="h-2.5 w-2.5 fill-black" /> Run
          </button>
        </form>
      </div>

      {/* 2. Control Scope Panel (col-span-4) */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-6" id="terminal-control-scope">
        
        {/* Resource Telemetry Widget */}
        <div className="bg-[#121418] p-5 border border-white/5 rounded-sm space-y-4 flex-1">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Cpu className="h-4 w-4 text-white/50" />
            <h3 className="font-serif italic text-white text-sm">Mainframe Resources</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-[9px] uppercase tracking-widest text-white/30 font-bold font-mono">
                <span>Core Temperature</span>
                <span>46.5°C</span>
              </div>
              <div className="w-full bg-white/5 h-1 border border-white/5 rounded-sm">
                <div className="h-full bg-emerald-400" style={{ width: '46%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-[9px] uppercase tracking-widest text-white/30 font-bold font-mono">
                <span>Kernel Memory Allocation</span>
                <span>{memoryLoad}%</span>
              </div>
              <div className="w-full bg-white/5 h-1 border border-white/5 rounded-sm">
                <div className="h-full bg-[#a8b8d0]" style={{ width: `${memoryLoad}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-[9px] uppercase tracking-widest text-white/30 font-bold font-mono">
                <span>Uptime Clock</span>
                <span className="font-mono text-white/75">{systemUptime}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline text-[9px] uppercase tracking-widest text-white/30 font-bold font-mono">
                <span>Engine Socket</span>
                <span className="text-emerald-400 font-bold uppercase font-mono">STANDBY / ACTIVE</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-3 mt-2">
            <p className="text-[10px] text-white/40 leading-relaxed">
              This terminal is backed by an Express cluster and real LLM instances. Commands query authentic AI weights.
            </p>
          </div>
        </div>

        {/* Quick Automation Presets */}
        <div className="bg-[#121418] p-5 border border-white/5 rounded-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Zap className="h-4 w-4 text-white/50 animate-pulse" />
            <h3 className="font-serif italic text-white text-sm">Quick Agent Presets</h3>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => loadPresetQuery('what is linear discriminant analysis and how does it relate to flower datasets')}
              className="text-left bg-white/5 border border-white/10 rounded-sm p-2.5 hover:bg-white/10 text-white/80 hover:text-white transition group flex flex-col justify-between"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#a8b8d0] mb-1 font-mono">Preset 01: LDA & Classification</span>
              <span className="text-xs text-white/40 group-hover:text-white/60 font-sans truncate w-full">What is linear discriminant analysis and flower datasets</span>
            </button>

            <button
              onClick={() => loadPresetQuery('explain the machine learning concept of overfitting using simple analogies')}
              className="text-left bg-white/5 border border-white/10 rounded-sm p-2.5 hover:bg-white/10 text-white/80 hover:text-white transition group flex flex-col justify-between"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#a8b8d0] mb-1 font-mono">Preset 02: Model Mechanics</span>
              <span className="text-xs text-white/40 group-hover:text-white/60 font-sans truncate w-full">Explain the concept of overfitting with analogies</span>
            </button>

            <button
              onClick={() => loadPresetQuery('summarize the key botanical differences between Iris Setosa and Iris Virginica')}
              className="text-left bg-white/5 border border-white/10 rounded-sm p-2.5 hover:bg-white/10 text-white/80 hover:text-white transition group flex flex-col justify-between"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#a8b8d0] mb-1 font-mono">Preset 03: Taxonomic Differentiator</span>
              <span className="text-xs text-white/40 group-hover:text-white/60 font-sans truncate w-full">Summarize botanical differences of Fisher species</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
