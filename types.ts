export interface CharacterData {
  char: string;
  pinyin: string;
  definition: string;
  exampleSentence: string;
  exampleSentenceMeaning: string;
}

export interface HanziWriterOptions {
  width: number;
  height: number;
  padding: number;
  showOutline: boolean;
  strokeAnimationSpeed: number;
  delayBetweenStrokes: number;
  showCharacter: boolean;
  showHintAfterMisses: number;
  highlightOnVariation: boolean;
  outlineColor: string;
  strokeColor: string;
  radicalColor?: string;
}

export type WriterMode = 'view' | 'animate' | 'quiz';