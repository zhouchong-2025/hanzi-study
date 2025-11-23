import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import HanziWriter from 'hanzi-writer';

interface HanziBoardProps {
  character: string;
  size?: number;
  onQuizComplete?: () => void;
  onMistake?: () => void;
}

export interface HanziBoardHandle {
  animate: () => void;
  quiz: () => void;
}

const HanziBoard = forwardRef<HanziBoardHandle, HanziBoardProps>(({ character, size = 300, onQuizComplete, onMistake }, ref) => {
  const writerRef = useRef<HanziWriter | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    animate: () => {
      if (writerRef.current) {
        writerRef.current.showCharacter();
        writerRef.current.animateCharacter();
      }
    },
    quiz: () => {
      if (writerRef.current) {
        writerRef.current.quiz({
          onComplete: () => {
            if (onQuizComplete) onQuizComplete();
          },
          onMistake: () => {
             if (onMistake) onMistake();
          }
        });
      }
    }
  }));

  useEffect(() => {
    if (targetRef.current && character) {
      // Clean up previous instance only if the div is about to be reused 
      // (HanziWriter doesn't have a clear destroy method but overwriting innerHTML works for simple cases, 
      // usually one creates a new instance).
      targetRef.current.innerHTML = '';

      try {
        writerRef.current = HanziWriter.create(targetRef.current, character, {
          width: size,
          height: size,
          padding: 20,
          showOutline: true,
          strokeAnimationSpeed: 1, // 1x speed
          delayBetweenStrokes: 200, // ms
          charDataLoader: (char, onComplete) => {
            fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`)
            .then(res => res.json())
            .then(onComplete)
            .catch(() => console.error("Failed to load char data"));
          }
        });
      } catch (e) {
        console.error("Error initializing HanziWriter", e);
      }
    }
  }, [character, size]);

  return (
    <div className="relative group">
      {/* Background Grid (Tian Zi Ge) */}
      <div 
        className="absolute inset-0 pointer-events-none border-2 border-gray-100 bg-white rounded-xl shadow-inner z-0"
        style={{ width: size, height: size }}
      >
        {/* Diagonal lines */}
        <div className="absolute top-0 left-0 w-full h-full border-gray-100" 
             style={{ 
               backgroundImage: `
                 linear-gradient(45deg, transparent 49.5%, #e5e7eb 49.5%, #e5e7eb 50.5%, transparent 50.5%),
                 linear-gradient(-45deg, transparent 49.5%, #e5e7eb 49.5%, #e5e7eb 50.5%, transparent 50.5%),
                 linear-gradient(to right, transparent 49.5%, #e5e7eb 49.5%, #e5e7eb 50.5%, transparent 50.5%),
                 linear-gradient(to bottom, transparent 49.5%, #e5e7eb 49.5%, #e5e7eb 50.5%, transparent 50.5%)
               ` 
             }}
        />
      </div>

      {/* Writer Container */}
      <div 
        ref={targetRef} 
        className="relative z-10 cursor-pointer" 
        style={{ width: size, height: size }}
      />
    </div>
  );
});

HanziBoard.displayName = 'HanziBoard';

export default HanziBoard;