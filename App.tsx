import { useState, useRef, useEffect } from 'react';
import { Pencil, Play, GraduationCap } from 'lucide-react';
import HanziBoard, { HanziBoardHandle } from './components/HanziBoard';
import InfoCard from './components/InfoCard';
import { fetchCharacterMetadata } from './services/geminiService';
import { CharacterData } from './types';

function App() {
  const [inputChar, setInputChar] = useState<string>('猫');
  const [activeChar, setActiveChar] = useState<string>('猫');
  const [charData, setCharData] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("准备就绪! 选择模式开始。");

  const hanziRef = useRef<HanziBoardHandle>(null);

  const handleGenerate = async () => {
    if (!inputChar.trim()) return;
    
    // Only take the first character if user types multiple
    const firstChar = inputChar.trim().charAt(0);
    if (!/[\u4e00-\u9fa5]/.test(firstChar)) {
      setStatusMessage("请输入有效的中文汉字。");
      return;
    }

    setLoading(true);
    setActiveChar(firstChar);
    setStatusMessage("正在分析汉字...");
    
    try {
      const data = await fetchCharacterMetadata(firstChar);
      setCharData(data);
      setStatusMessage(`已加载: ${firstChar}。准备练习。`);
      // Auto animate on load
      setTimeout(() => hanziRef.current?.animate(), 500);
    } catch (error) {
      console.error(error);
      setStatusMessage("获取数据失败，请检查网络或 API Key。");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnimate = () => {
    setStatusMessage("演示笔画顺序...");
    hanziRef.current?.animate();
  };

  const handleQuiz = () => {
    setStatusMessage("描红模式：请在田字格中书写。");
    hanziRef.current?.quiz();
  };

  const handleQuizComplete = () => {
    setStatusMessage("太棒了！书写正确！🎉");
  };

  const handleMistake = () => {
    setStatusMessage("笔画顺序错误，请重试。");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-700 selection:bg-green-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <span className="text-2xl">✍️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">周翀汉字笔画学习器</h1>
          </div>
          <p className="text-gray-500 text-sm font-medium tracking-wide text-opacity-80">
            Interactive Stroke Order Practice Board
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        
        {/* Input Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <div className="relative group w-full sm:w-64">
            <input
              type="text"
              maxLength={1}
              value={inputChar}
              onChange={(e) => setInputChar(e.target.value)}
              placeholder="输入汉字..."
              className="w-full px-4 py-3 text-center text-2xl font-serif border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all placeholder:text-gray-300 shadow-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg shadow-md shadow-green-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/>
            ) : (
              <Pencil size={20} />
            )}
            生成笔画
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Writer */}
          <div className="flex flex-col items-center">
             {/* Character Preview Wrapper */}
            <div className="relative">
               {/* Mode Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full border border-gray-200 shadow-sm z-20">
                预览模式
              </div>
              
              <div className="p-4 bg-white rounded-2xl shadow-xl border border-gray-100">
                <HanziBoard 
                  ref={hanziRef} 
                  character={activeChar} 
                  size={320} // Slightly larger for better visibility
                  onQuizComplete={handleQuizComplete}
                  onMistake={handleMistake}
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-medium mb-6 animate-fade-in">
                {statusMessage}
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleAnimate}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium shadow-md shadow-blue-200 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Play size={18} fill="currentColor" />
                  演示笔画
                </button>
                <button
                  onClick={handleQuiz}
                  className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-full font-medium shadow-md shadow-gray-400 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <GraduationCap size={18} />
                  开始描红
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div>
            <InfoCard data={charData} loading={loading} />
            
            <div className="mt-8 text-center text-xs text-gray-400">
              <p>© 2025 由 Zhou Chong 制作</p>
              <p className="mt-1">Powered by Hanzi Writer & Google Gemini</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;