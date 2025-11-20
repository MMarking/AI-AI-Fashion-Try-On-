import React, { useState } from 'react';
import { ImageItem } from '../types';
import { PRESET_CLOTHES } from '../constants';
import { Upload, CheckCircle, Wand2, Loader2 } from 'lucide-react';
import { generateClothingImage } from '../services/geminiService';

interface StepClothesProps {
  selectedPerson: ImageItem | null;
  selectedClothes: ImageItem | null;
  onSelect: (item: ImageItem) => void;
  onBack: () => void;
  onNext: () => void;
}

export const StepClothes: React.FC<StepClothesProps> = ({ 
  selectedPerson, 
  selectedClothes, 
  onSelect, 
  onBack, 
  onNext 
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'generate'>('presets');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedClothes, setGeneratedClothes] = useState<ImageItem[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newItem = {
          id: `upload-cloth-${Date.now()}`,
          url: result,
          isUploaded: true,
          description: '上传的服装'
        };
        onSelect(newItem);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const imageUrl = await generateClothingImage(prompt);
      const newItem: ImageItem = {
        id: `gen-${Date.now()}`,
        url: imageUrl,
        description: prompt,
        isUploaded: true
      };
      setGeneratedClothes(prev => [newItem, ...prev]);
      onSelect(newItem); // Auto select generated item
      setActiveTab('presets'); // Switch back to grid view to see it
    } catch (error) {
      alert("生成服装失败，请稍后再试。");
    } finally {
      setIsGenerating(false);
    }
  };

  const allClothes = [...generatedClothes, ...PRESET_CLOTHES];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Context Header showing Step 1 choice */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 mb-6">
        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {selectedPerson && <img src={selectedPerson.url} alt="Model" className="w-full h-full object-cover" />}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">当前模特</p>
          <p className="text-sm font-medium text-gray-800">{selectedPerson?.description || '未命名'}</p>
        </div>
        <div className="ml-auto text-sm text-gray-400">已选定</div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">第二步：选择服装</h2>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'presets' ? 'bg-white shadow text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            图库选择
          </button>
          <button 
             onClick={() => setActiveTab('generate')}
             className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'generate' ? 'bg-white shadow text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Wand2 size={14} />
            AI 生成
          </button>
        </div>
      </div>

      {activeTab === 'generate' ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">描述你想生成的服装</label>
          <div className="relative">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：一件红色的丝绸晚礼服，复古风格..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none min-h-[120px] resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="absolute bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {isGenerating ? <><Loader2 size={16} className="animate-spin"/> 生成中...</> : <><Wand2 size={16}/> 生成服装</>}
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500">Nano Banana 模型将根据您的描述创造独一无二的服装，生成后将自动添加到图库中。</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {/* Upload Button */}
          <label className="aspect-[1/1] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors group">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <Upload className="text-purple-500" size={24} />
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">上传服装</span>
          </label>

          {/* Clothes List (Generated + Preset) */}
          {allClothes.map((item) => {
            const isSelected = selectedClothes?.id === item.id;
            return (
              <div 
                key={item.id} 
                onClick={() => onSelect(item)}
                className={`relative aspect-[1/1] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 bg-white ${isSelected ? 'ring-4 ring-purple-500 ring-offset-2' : 'hover:shadow-lg hover:-translate-y-1'}`}
              >
                <img src={item.url} alt={item.description} className="w-full h-full object-contain p-2" />
                {/* Tag for generated items */}
                {item.id.startsWith('gen') && (
                    <div className="absolute top-2 left-2 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        AI GEN
                    </div>
                )}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="sticky bottom-6 flex justify-between pt-4">
        <button 
          onClick={onBack}
          className="px-6 py-3 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          上一步
        </button>
        <button
          onClick={onNext}
          disabled={!selectedClothes}
          className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform ${
            selectedClothes
              ? 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 hover:shadow-purple-500/30' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          下一步：生成试穿效果
        </button>
      </div>
    </div>
  );
};
