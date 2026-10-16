import { BinaryDecomposition, NumberCard, RangeOption } from '../types';

export const RANGE_OPTIONS: RangeOption[] = [
  {
    id: 1,
    min: 1,
    max: 31,
    cardCount: 5,
    label: '1 — 31',
    difficulty: 'QUICK READ',
    description: '5 Cards · Great for a rapid warm-up',
    accentColor: '#00F5FF', // Neon Cyan
  },
  {
    id: 2,
    min: 1,
    max: 63,
    cardCount: 6,
    label: '1 — 63',
    difficulty: 'CLASSIC',
    description: '6 Cards · The recommended mind challenge',
    accentColor: '#FF2DAA', // Hot Magenta
  },
  {
    id: 3,
    min: 1,
    max: 127,
    cardCount: 7,
    label: '1 — 127',
    difficulty: 'EXPANDED',
    description: '7 Cards · Triple digit cognitive depth',
    accentColor: '#C7FF4D', // Acid Lime
  },
];

/**
 * Generates all number cards dynamically for a selected maximum number.
 * Each card corresponds to a power of 2 (1, 2, 4, 8, ...) up to maxNumber.
 * Contains all integers n in [1, maxNumber] whose binary representation has that bit set.
 */
export function generateNumberCards(maxNumber: number): NumberCard[] {
  const cards: NumberCard[] = [];
  let cardIndex = 0;

  for (let power = 1; power <= maxNumber; power *= 2) {
    const numbers: number[] = [];

    for (let n = 1; n <= maxNumber; n++) {
      if ((n & power) !== 0) {
        numbers.push(n);
      }
    }

    cards.push({
      cardIndex,
      powerOfTwo: power,
      numbers,
    });

    cardIndex++;
  }

  return cards;
}

/**
 * Deterministically calculates the secret number by summing powers of 2
 * for every card where the player answered YES (true).
 */
export function calculateGuessedNumber(
  answers: (boolean | null)[],
  cards: NumberCard[]
): number {
  return answers.reduce((total: number, answer, index) => {
    if (answer === true && cards[index]) {
      return total + cards[index].powerOfTwo;
    }
    return total;
  }, 0);
}

const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

function toSuperscript(num: number): string {
  return num
    .toString()
    .split('')
    .map((digit) => SUPERSCRIPT_MAP[digit] || digit)
    .join('');
}

/**
 * Deconstructs a number into its powers-of-two components for mathematical transparency and display.
 */
export function getBinaryDecomposition(n: number): BinaryDecomposition {
  if (n <= 0) {
    return {
      number: 0,
      powers: [],
      exponents: [],
      formulaSum: '0',
      formulaExp: '0',
      binaryString: '0',
      cardsInvolved: [],
    };
  }

  const powers: number[] = [];
  const exponents: number[] = [];
  const cardsInvolved: number[] = [];

  let temp = n;
  let power = 1;
  let exp = 0;

  while (power <= temp) {
    if ((n & power) !== 0) {
      powers.unshift(power); // Descending for natural formula display e.g. 42 = 32 + 8 + 2
      exponents.unshift(exp);
      cardsInvolved.push(exp + 1); // 1-based card number
    }
    power *= 2;
    exp++;
  }

  const formulaSum = powers.join(' + ');
  const formulaExp = exponents.map((e) => `2${toSuperscript(e)}`).join(' + ');
  const binaryString = n.toString(2);

  return {
    number: n,
    powers,
    exponents,
    formulaSum,
    formulaExp,
    binaryString,
    cardsInvolved,
  };
}

/**
 * Comprehensive automated verification test suite for all ranges and numbers.
 */
export function runMathEngineVerification(): { passed: boolean; message: string; totalTested: number } {
  let totalTested = 0;

  for (const option of RANGE_OPTIONS) {
    const cards = generateNumberCards(option.max);

    // Verify card count equals expected
    if (cards.length !== option.cardCount) {
      return {
        passed: false,
        message: `Range 1-${option.max} generated ${cards.length} cards, expected ${option.cardCount}`,
        totalTested,
      };
    }

    // Verify all-NO yields 0
    const allNoAnswers = new Array(cards.length).fill(false);
    if (calculateGuessedNumber(allNoAnswers, cards) !== 0) {
      return {
        passed: false,
        message: `All NO answers did not yield 0 for range 1-${option.max}`,
        totalTested,
      };
    }

    // Verify all-YES yields max
    const allYesAnswers = new Array(cards.length).fill(true);
    if (calculateGuessedNumber(allYesAnswers, cards) !== option.max) {
      return {
        passed: false,
        message: `All YES answers did not yield ${option.max} for range 1-${option.max}`,
        totalTested,
      };
    }

    // Verify EVERY number from 1 to max can be uniquely reconstructed
    for (let target = 1; target <= option.max; target++) {
      totalTested++;
      const simulatedAnswers = cards.map((card) => (target & card.powerOfTwo) !== 0);
      const reconstructed = calculateGuessedNumber(simulatedAnswers, cards);

      if (reconstructed !== target) {
        return {
          passed: false,
          message: `Failed to reconstruct ${target} in range 1-${option.max}. Got ${reconstructed}`,
          totalTested,
        };
      }
    }
  }

  return {
    passed: true,
    message: `All ${totalTested} mathematical reconstruction tests across 3 ranges passed with 100% precision.`,
    totalTested,
  };
}
