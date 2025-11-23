import React from 'react';
import { CharacterData } from '../types';
import { BookOpen, HelpCircle } from 'lucide-react';

interface InfoCardProps {
  data: CharacterData | null;
  loading: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full min-h-[300px] flex flex-col justify-center items-center animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="h-24 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-gray-400">
        <HelpCircle size={48} className="mb-4 opacity-20" />
        <p>请输入汉字开始学习</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-2">
        <BookOpen size={20} className="text-green-600" />
        <h3 className="font-bold text-green-800">汉字详情</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Pinyin */}
        <div className="flex justify-between items-end border-b border-gray-50 pb-4">
          <span className="text-gray-500 text-sm font-medium">拼音 (Pinyin)</span>
          <span className="text-3xl font-serif text-gray-800 font-bold tracking-wide">{data.pinyin}</span>
        </div>

        {/* Definition */}
        <div>
          <span className="text-gray-500 text-sm font-medium block mb-1">释义 (Meaning)</span>
          <p className="text-gray-800 leading-relaxed">{data.definition}</p>
        </div>

        {/* Example Sentence */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Example / 例句</span>
          </div>
          <p className="text-lg text-gray-800 font-medium mb-1 font-serif">"{data.exampleSentence}"</p>
          <p className="text-gray-600 text-sm italic">{data.exampleSentenceMeaning}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;