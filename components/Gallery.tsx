import React from 'react';
import { GenerationHistoryItem } from '../types';
import { Clock } from 'lucide-react';

interface GalleryProps {
  history: GenerationHistoryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2 mb-6 px-4">
        <Clock className="text-purple-600" size={20} />
        <h3 className="text-lg font-bold text-gray-800">历史生成记录</h3>
      </div>
      
      <div className="flex overflow-x-auto gap-4 px-4 pb-6 scrollbar-hide snap-x">
        {history.map((item) => (
          <div key={item.id} className="flex-shrink-0 snap-start flex flex-col gap-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-64">
             <div className="flex gap-1 h-20">
                 <img src={item.personImage} className="w-1/2 h-full object-cover rounded-md opacity-80" alt="Src" />
                 <img src={item.clothesImage} className="w-1/2 h-full object-cover rounded-md opacity-80" alt="Cloth" />
             </div>
             <div className="h-64 w-full rounded-lg overflow-hidden relative">
                 <img src={item.resultImage} className="w-full h-full object-cover" alt="Result" />
             </div>
             <span className="text-[10px] text-gray-400 text-center">
                {new Date(item.timestamp).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
             </span>
          </div>
        ))}
      </div>
    </div>
  );
};
