import React from 'react';
import { GenerationState } from '../types';

interface AvatarResultProps {
  generationState: GenerationState;
}

const AvatarResult: React.FC<AvatarResultProps> = ({ generationState }) => {
  const { isGenerating, resultImage, error } = generationState;

  if (error) {
    return (
      <div className="w-full p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm mt-6">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] mt-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-indigo-400">
             AI
          </div>
        </div>
        <p className="mt-4 text-gray-400 text-sm animate-pulse">
           Gemini Nanobanana Pro is dreaming...
        </p>
        <p className="text-xs text-gray-600 mt-2">Generating pixel-perfect details</p>
      </div>
    );
  }

  if (resultImage) {
    return (
      <div className="w-full mt-8 animate-fade-in-up">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 text-center">
          您的年度开发者形象
        </h2>
        <div className="relative group max-w-md mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-xl overflow-hidden bg-black ring-1 ring-zinc-800 shadow-2xl">
              <img src={resultImage} alt="Generated Avatar" className="w-full h-auto object-cover" />
            </div>
        </div>
        
        <div className="flex justify-center mt-6 gap-4">
          <a
            href={resultImage}
            download="my-dev-year-avatar.png"
            className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-black font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            下载头像
          </a>
          <button 
             onClick={() => window.location.reload()}
             className="px-6 py-2.5 border border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-white rounded-lg transition-all"
          >
            重置
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AvatarResult;