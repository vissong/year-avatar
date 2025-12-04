
import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import StatsForm from './components/StatsForm';
import AvatarResult from './components/AvatarResult';
import { UserStats, GenerationState, GenerationMode } from './types';
import { DEFAULT_STATS } from './constants';
import { generateProgrammerImage } from './services/geminiService';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.AVATAR);
  
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    resultImage: null,
  });

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) return;

    setGenerationState({ isGenerating: true, error: null, resultImage: null });

    try {
      // Generate based on the selected mode
      const result = await generateProgrammerImage(sourceImage, stats, mode);
      setGenerationState({
        isGenerating: false,
        error: null,
        resultImage: result,
      });
    } catch (err: any) {
      // Handle permission/auth errors by resetting the key state
      const errorMessage = err.message || '';
      if (errorMessage.includes("403") || errorMessage.includes("permission") || errorMessage.includes("Requested entity was not found")) {
         setHasKey(false);
         setGenerationState({
           isGenerating: false,
           error: "Permission denied or API Key invalid. Please select a valid API Key.",
           resultImage: null,
         });
         return;
      }

      setGenerationState({
        isGenerating: false,
        error: errorMessage || "Something went wrong generating the image.",
        resultImage: null,
      });
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 max-w-lg w-full bg-zinc-900/50 backdrop-blur-xl p-10 rounded-3xl border border-zinc-800 shadow-2xl">
           <h1 className="text-4xl font-extrabold tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              DevYear
            </span>{' '}
            Generator
          </h1>
          <p className="text-zinc-400 text-lg mb-8">
            Create your 2024 Programmer Year in Review.<br/>
            This tool uses the advanced <strong>Gemini Nanobanana Pro</strong> model.
          </p>

          <button
            onClick={handleSelectKey}
            className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Connect API Key to Start
          </button>

          <p className="mt-6 text-xs text-zinc-600">
            A paid Google Cloud Project with billing enabled is required for Gemini Pro Vision models.
            <br />
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-zinc-400">
              Learn about billing
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              DevYear
            </span>{' '}
            Rewind
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Generate your 2024 Programmer "Year in Review" visuals.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Input */}
          <div className="space-y-8 bg-zinc-900/50 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-zinc-800 shadow-xl">
            <ImageUploader 
              onImageSelected={setSourceImage} 
              selectedImage={sourceImage} 
            />
            
            <StatsForm 
              stats={stats} 
              setStats={setStats} 
              disabled={generationState.isGenerating} 
            />

            {/* Mode Selection Toggle */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-400">
                4. 选择生成模式
              </label>
              <div className="grid grid-cols-2 gap-4 p-1 bg-zinc-800 rounded-xl">
                <button
                  onClick={() => setMode(GenerationMode.AVATAR)}
                  disabled={generationState.isGenerating}
                  className={`relative py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                    mode === GenerationMode.AVATAR
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-base">👤 头像</span>
                    <span className="text-[10px] opacity-70 font-mono">1:1 Ratio</span>
                  </div>
                </button>
                <button
                  onClick={() => setMode(GenerationMode.SCENE)}
                  disabled={generationState.isGenerating}
                  className={`relative py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                    mode === GenerationMode.SCENE
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-base">🖼️ 故事场景</span>
                    <span className="text-[10px] opacity-70 font-mono">4:3 Ratio</span>
                  </div>
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!sourceImage || generationState.isGenerating}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                !sourceImage || generationState.isGenerating
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-indigo-500/25 transform hover:-translate-y-0.5'
              }`}
            >
              {generationState.isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </>
              ) : (
                <>
                  Generate {mode === GenerationMode.AVATAR ? 'Avatar' : 'Scene'} ⚡
                </>
              )}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="lg:sticky lg:top-8">
             <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 shadow-xl min-h-[600px] flex flex-col justify-center">
                {generationState.resultImage ? (
                    <AvatarResult generationState={generationState} />
                ) : generationState.isGenerating ? (
                    <AvatarResult generationState={generationState} />
                ) : (
                    <div className="text-center text-zinc-500 space-y-6 opacity-60">
                         <div className="mx-auto w-40 h-40 border-2 border-dashed border-zinc-700 rounded-3xl flex items-center justify-center bg-zinc-800/30">
                            <span className="text-5xl">✨</span>
                         </div>
                         <div className="space-y-2">
                           <p className="text-lg font-medium text-zinc-400">Ready to Visualize</p>
                           <p className="text-sm">Upload a photo and describe your year<br/>to generate a unique {mode === GenerationMode.AVATAR ? 'avatar' : 'story scene'}.</p>
                         </div>
                    </div>
                )}
             </div>
          </div>
        </main>
        
        <footer className="mt-20 text-center text-zinc-600 text-sm">
          <p>Powered by Google Gemini (Nanobanana Pro) & React</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
