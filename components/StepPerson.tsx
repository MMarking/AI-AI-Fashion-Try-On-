import React from 'react';
import { ImageItem } from '../types';
import { PRESET_PEOPLE } from '../constants';
import { Upload, CheckCircle } from 'lucide-react';

interface StepPersonProps {
  selectedPerson: ImageItem | null;
  onSelect: (item: ImageItem) => void;
  onNext: () => void;
}

export const StepPerson: React.FC<StepPersonProps> = ({ selectedPerson, onSelect, onNext }) => {
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSelect({
          id: `upload-${Date.now()}`,
          url: result,
          isUploaded: true,
          description: '上传的图片'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">第一步：选择模特</h2>
        <span className="text-sm text-gray-500">请选择预设人物或上传您的照片</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Upload Button */}
        <label className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors group">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <Upload className="text-purple-500" size={24} />
          </div>
          <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">上传照片</span>
        </label>

        {/* Presets */}
        {PRESET_PEOPLE.map((item) => {
          const isSelected = selectedPerson?.id === item.id;
          return (
            <div 
              key={item.id} 
              onClick={() => onSelect(item)}
              className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-purple-500 ring-offset-2' : 'hover:shadow-lg hover:-translate-y-1'}`}
            >
              <img src={item.url} alt={item.description} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              {isSelected && (
                <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1">
                  <CheckCircle size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-6 flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!selectedPerson}
          className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform ${
            selectedPerson 
              ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 hover:shadow-purple-500/30' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          下一步：选择服装
        </button>
      </div>
    </div>
  );
};
