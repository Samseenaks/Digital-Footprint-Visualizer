
import React, { useState, useEffect } from 'react';
import { analyzeFootprint } from './services/geminiService';
import { FootprintData, ExposureLevel } from './types';
import Visualizer from './components/Visualizer';
import { Shield, Eye, Info, AlertTriangle, CheckCircle, RefreshCcw, Github, Linkedin, FileText, Share2, X, ClipboardList, Twitter, Globe, User, ShieldAlert, ShieldCheck, ShieldOff, Fingerprint } from 'lucide-react';

const MIN_CHAR_COUNT = 40;

const SourceIcon = ({ source }: { source: string }) => {
  const s = source.toLowerCase();
  if (s.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
  if (s.includes('github')) return <Github className="w-4 h-4" />;
  if (s.includes('twitter') || s.includes(' x ')) return <Twitter className="w-4 h-4" />;
  if (s.includes('portfolio') || s.includes('blog') || s.includes('website')) return <Globe className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
};

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [result, setResult] = useState<FootprintData | null>(null);

  useEffect(() => {
    if (inputText.length > 0 && inputText.length < MIN_CHAR_COUNT) {
      setValidationWarning(`Input is too short (${inputText.length}/${MIN_CHAR_COUNT} chars). Analysis works best with full bios or multiple posts.`);
    } else if (inputText.length >= 2000) {
      setValidationWarning('Input is very long. Results may be truncated for the summary.');
    } else {
      setValidationWarning(null);
    }
  }, [inputText]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    if (inputText.length < MIN_CHAR_COUNT) {
      setError(`Please provide more detail. At least ${MIN_CHAR_COUNT} characters are needed.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await analyzeFootprint(inputText);
      setResult(data);
    } catch (err) {
      setError('The analysis failed. Please ensure you are pasting valid profile text.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setInputText("Alex Rivera | Senior Cloud Architect @ DataFlow Systems | Seattle. 8 years in distributed systems. AWS Certified. Regular speaker at CloudCon. Passionate about open-source security. Active contributor to Kubernetes. Often posts about serverless architecture and remote work culture on LinkedIn.");
    setError(null);
  };

  const reset = () => {
    setResult(null);
    setInputText('');
    setError(null);
    setValidationWarning(null);
  };

  const getExposureTheme = (level: ExposureLevel) => {
    switch (level) {
      case ExposureLevel.HIGH:
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          hex: '#f87171',
          icon: <ShieldOff className="w-5 h-5 md:w-6 lg:w-7 text-red-400" />,
          label: 'High Exposure'
        };
      case ExposureLevel.MEDIUM:
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          hex: '#fbbf24',
          icon: <ShieldAlert className="w-5 h-5 md:w-6 lg:w-7 text-amber-400" />,
          label: 'Moderate Exposure'
        };
      case ExposureLevel.LOW:
      default:
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          hex: '#34d399',
          icon: <ShieldCheck className="w-5 h-5 md:w-6 lg:w-7 text-emerald-400" />,
          label: 'Low Exposure'
        };
    }
  };

  const theme = result ? getExposureTheme(result.exposureLevel) : null;

  return (
    <div className="min-h-screen pb-12 md:pb-20 lg:pb-24 px-4 md:px-12 lg:px-10">
      {/* Header - Centered Logo as requested */}
      <header className="relative max-w-7xl mx-auto py-6 md:py-8 lg:py-10 flex items-center justify-center border-b border-slate-800/50 md:border-none mb-4 md:mb-6 lg:mb-0">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 p-2 md:p-2.5 rounded-xl shadow-lg shadow-sky-500/20">
            <Fingerprint className="text-white w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none">Footprint<span className="text-sky-400">Lens</span></h1>
            <p className="text-slate-500 text-[9px] md:text-[10px] lg:text-[11px] uppercase tracking-widest mt-1 font-bold">Privacy Awareness Tool</p>
          </div>
        </div>
        
        {/* Absolute positioned system status to maintain logo centering */}
        <div className="absolute right-0 hidden sm:flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 pr-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          System Operational
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-4 md:mt-8">
        {!result ? (
          <div className="grid lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-center">
            <section className="lg:col-span-7 space-y-6 md:space-y-10 text-center md:text-left">
              {/* Catchier Headline as requested */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                Expose your <span className="text-sky-400 underline underline-offset-8 decoration-sky-500/20 italic">digital trail.</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0 font-medium">
                Our AI analyzes your public bios to visualize how much personal and professional data is accessible to anyone online.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/40 p-4 md:px-6 rounded-2xl border border-slate-700/50 text-sm md:text-base transition-colors hover:bg-slate-800/60">
                  <Eye className="w-5 h-5 text-sky-400 shrink-0" />
                  <span>No data is stored.</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/40 p-4 md:px-6 rounded-2xl border border-slate-700/50 text-sm md:text-base transition-colors hover:bg-slate-800/60">
                  <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Safe & Private.</span>
                </div>
              </div>
            </section>

            <section className="lg:col-span-5 glass p-6 md:p-8 lg:p-10 rounded-[2rem] shadow-2xl relative border-white/5">
              <div className="mb-6 md:mb-8">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Input Data</h3>
                    <p className="text-[10px] md:text-xs text-slate-400 mt-1">Paste a bio or summary</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={loadSample}
                      className="text-[10px] md:text-xs text-sky-400 hover:text-sky-300 transition-colors font-bold uppercase tracking-wider"
                    >
                      Sample
                    </button>
                    {inputText && (
                      <button
                        onClick={() => setInputText('')}
                        className="text-[10px] md:text-xs text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 font-bold uppercase tracking-wider"
                      >
                        <X className="w-3 h-3" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <textarea
                    className={`w-full h-44 md:h-48 lg:h-56 bg-slate-900/80 border rounded-2xl p-4 md:p-5 text-sm md:text-base text-slate-100 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all placeholder:text-slate-700 resize-none leading-relaxed ${
                      error ? 'border-red-500/50' : validationWarning ? 'border-amber-500/50' : 'border-slate-700'
                    }`}
                    placeholder="Example: 'Cloud Architect at TechCorp...'"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <div className={`absolute bottom-4 right-5 text-[10px] font-black font-mono px-2 py-1 rounded bg-slate-900/50 ${inputText.length < MIN_CHAR_COUNT && inputText.length > 0 ? 'text-amber-500' : 'text-slate-600'}`}>
                    {inputText.length} CHRS
                  </div>
                </div>
                
                {validationWarning && (
                  <p className="mt-3 text-[10px] md:text-xs text-amber-500 flex items-start gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    {validationWarning}
                  </p>
                )}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !inputText.trim() || !!validationWarning}
                className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 md:py-5 rounded-2xl transition-all shadow-xl shadow-sky-500/30 flex items-center justify-center gap-3 text-sm md:text-base uppercase tracking-widest"
              >
                {loading ? (
                  <>
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Info className="w-5 h-5" />
                    Visualize
                  </>
                )}
              </button>

              {error && (
                <div className="mt-5 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs md:text-sm flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-black uppercase tracking-wider mb-1">Error</p>
                    <p className="opacity-80">{error}</p>
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12">
              
              {/* Result View remains consistent with the previous successful styling */}
              <div className="lg:col-span-5 space-y-8">
                <div className="glass p-6 md:p-8 lg:p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 transition-colors duration-1000 ${theme?.bg}`}></div>
                  <Visualizer data={result} themeColor={theme?.hex || '#38bdf8'} />
                  
                  <div className="grid grid-cols-2 gap-4 mt-8 md:mt-10">
                    <div className="bg-slate-900/60 p-4 md:p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                      <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Exposure</div>
                      <div className={`text-base md:text-lg lg:text-xl font-black ${theme?.text}`}>
                        {result.exposureLevel}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 p-4 md:p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                      <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Public ID</div>
                      <div className="text-xs md:text-sm lg:text-base text-slate-200 font-black truncate">
                        {result.identity.name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass p-6 md:p-8 lg:p-10 rounded-[2.5rem] border-white/5 space-y-8">
                  <div>
                    <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                      <Globe className="w-4 h-4 md:w-5 md:h-5 text-sky-400" />
                      Likely Platforms
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {result.detectedSources.map((source, i) => (
                        <div key={i} className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/50 px-3.5 py-1.5 md:px-4 md:py-2 rounded-2xl text-slate-200 text-xs md:text-sm font-bold">
                          <SourceIcon source={source} />
                          {source}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                      <Share2 className="w-4 h-4 md:w-5 md:h-5 text-sky-400" />
                      Extracted Context
                    </h3>
                    <div className="space-y-6">
                      <div className="bg-slate-900/40 p-4 md:p-5 rounded-2xl border border-white/5">
                        <div className="text-[9px] md:text-[10px] text-slate-600 mb-3 font-black uppercase tracking-widest">Core Profile</div>
                        <div className="flex flex-wrap gap-2.5">
                          <span className="bg-sky-500/10 text-sky-400 px-3 py-1.5 md:px-3.5 md:py-1.5 rounded-xl text-[10px] md:text-[11px] lg:text-xs border border-sky-500/20 font-black uppercase tracking-wider flex items-center gap-2">
                            <User className="w-3.5 h-3.5" />
                            {result.identity.role}
                          </span>
                          <span className="bg-slate-800 text-slate-400 px-3 py-1.5 md:px-3.5 md:py-1.5 rounded-xl text-[10px] md:text-[11px] lg:text-xs border border-slate-700 font-bold uppercase tracking-wider">
                            {result.identity.location}
                          </span>
                        </div>
                      </div>
                      <div className="bg-slate-900/40 p-4 md:p-5 rounded-2xl border border-white/5">
                        <div className="text-[9px] md:text-[10px] text-slate-600 mb-3 font-black uppercase tracking-widest">Capabilities</div>
                        <div className="flex flex-wrap gap-2">
                          {result.capabilities.map((s, i) => (
                            <span key={i} className="bg-slate-700/30 text-slate-400 px-3 py-1 rounded-xl text-[10px] border border-slate-600/50 font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-8">
                <div className={`p-8 md:p-10 lg:p-12 rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden shadow-2xl ${theme?.bg} ${theme?.border}`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 md:p-3 rounded-2xl bg-white/5 backdrop-blur-md border ${theme?.border}`}>
                          {theme?.icon}
                        </div>
                        <h3 className="text-xl md:text-2xl lg:text-2xl font-black text-white tracking-tight italic">
                          Analysis Findings
                        </h3>
                      </div>
                      <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] lg:text-xs font-black uppercase tracking-widest border-2 ${theme?.border} ${theme?.text} bg-slate-900/50`}>
                        {theme?.label}
                      </span>
                    </div>
                    
                    <p className="text-white leading-relaxed italic mb-8 md:mb-10 text-lg md:text-xl lg:text-2xl font-medium tracking-tight">
                      "{result.riskReasoning}"
                    </p>
                    
                    <div className="space-y-4">
                      <h4 className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] ${theme?.text} mb-4 opacity-90`}>Exposure Signals</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {result.activitySignals.map((sig, i) => (
                          <div key={i} className="flex gap-4 text-slate-100 text-xs md:text-sm bg-slate-900/60 p-4 md:p-5 rounded-2xl border border-white/5 backdrop-blur-md">
                            <span className={`${theme?.text} font-black mt-0.5`}>•</span>
                            <span className="font-medium">{sig}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass p-8 md:p-10 lg:p-12 rounded-[2.5rem] border-emerald-500/10">
                  <h3 className="text-xl md:text-2xl font-black mb-8 md:mb-10 flex items-center gap-4 text-emerald-400 italic">
                    <CheckCircle className="w-6 h-6 md:w-7 md:h-7" />
                    Improvements
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {result.tips.map((tip, i) => (
                      <div key={i} className="bg-slate-900/50 p-6 md:p-7 rounded-[1.5rem] border border-slate-700/50 flex flex-col gap-4">
                        <div className="bg-emerald-500/10 text-emerald-400 w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center font-black flex-shrink-0 text-xs md:text-sm border border-emerald-500/20">
                          {i + 1}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed font-medium">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-3 py-5 text-slate-500 hover:text-white transition-all text-xs md:text-sm font-black uppercase tracking-[0.3em] rounded-3xl"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Analyze New Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto mt-12 md:mt-20 lg:mt-24 text-center">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 md:gap-x-10 mb-8">
          {['LinkedIn', 'GitHub', 'Twitter', 'Portfolios'].map(s => (
            <div key={s} className="flex items-center gap-2 text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-600">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
               {s}
            </div>
          ))}
        </div>
        <p className="text-slate-700 text-[9px] md:text-[10px] lg:text-xs font-bold px-8 md:px-16 max-w-3xl mx-auto italic leading-relaxed">
          FootprintLens &copy; 2025. Privacy Awareness Tool. This application does not store user data. All processing is transient and intended for educational awareness of online visibility.
        </p>
      </footer>
    </div>
  );
};

export default App;
