import React, { useEffect, useState, useRef } from 'react';
import { ImageItem } from '../types';
import { generateTryOnResult } from '../services/geminiService';
import { Loader2, RefreshCw, Download, ArrowLeft, Save } from 'lucide-react';

interface StepResultProps {
  person: ImageItem;
  clothes: ImageItem;
  onBack: () => void;
  onSaveToHistory: (resultUrl: string) => void;
}

export const StepResult: React.FC<StepResultProps> = ({ person, clothes, onBack, onSaveToHistory }) => {
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasRunRef = useRef(false);

  const handleGeneration = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await generateTryOnResult(person.url, clothes.url);
      setResultUrl(url);
      onSaveToHistory(url);
    } catch (err) {
      setError("生成失败，可能是网络问题或图片格式不支持，请重试。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasRunRef.current) {
      hasRunRef.current = true;
      handleGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">第三步：试穿完成</h2>
      </div>

      <div className="relative w-full min-h-[400px] bg-white rounded-2xl shadow-inner border border-gray-200 flex items-center justify-center overflow-hidden p-4">
        {loading ? (
          <div className="flex flex-col items-center text-purple-600">
             <Loader2 size={48} className="animate-spin mb-4" />
             <p className="text-lg font-medium animate-pulse">正在编织魔法...</p>
             <p className="text-sm text-gray-400 mt-2">Nano Banana 正在合成光影与材质</p>
          </div>
        ) : error ? (
          <div className="text-center px-6">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={handleGeneration}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium flex items-center justify-center mx-auto gap-2"
            >
              <RefreshCw size={18} /> 重试
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full flex justify-center">
            <img src={resultUrl!} alt="Try-on Result" className="max-h-[600px] w-auto object-contain rounded-lg shadow-md" />
            
            <div className="absolute bottom-4 right-4 flex gap-2">
              <a 
                href={resultUrl!} 
                download="try-on-result.png"
                className="p-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-50 transition-transform hover:scale-110"
                title="下载图片"
              >
                <Download size={20} />
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button 
          onClick={onBack}
          className="px-6 py-3 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} /> 再试一次
        </button>
        {!loading && !error && (
           <button 
           onClick={() => {
            // Logic to "Restart" completely or just show success
            onBack(); // Simply go back for now or we could add a "Done" state
           }}
           className="px-8 py-3 rounded-full font-semibold bg-black text-white shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2"
         >
           <Save size={18} /> 完成并保存
         </button>
        )}
      </div>
    </div>
  );
};
