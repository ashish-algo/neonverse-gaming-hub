export interface RangeOption {
  id: number;
  min: number;
  max: number;
  cardCount: number;
  label: string;
  difficulty: string;
  description: string;
  accentColor: string;
}

export interface NumberCard {
  cardIndex: number;
  powerOfTwo: number;
  numbers: number[];
}

export type GamePhase =
  | 'welcome'
  | 'range-selection'
  | 'instructions'
  | 'playing'
  | 'revealing'
  | 'result';

export interface BinaryDecomposition {
  number: number;
  powers: number[];
  exponents: number[];
  formulaSum: string;
  formulaExp: string;
  binaryString: string;
  cardsInvolved: number[];
}
