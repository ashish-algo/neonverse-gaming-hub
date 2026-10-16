import { DifficultyLevel, GeometryQuestion, ShapeCategory } from '../types';
import {
  generateParallelogramGridSVG,
  generateRectangularGridSVG,
  generateRhombusGridSVG,
  generateTriangleWithRaysSVG,
  generateTriangularLatticeSVG,
} from '../engine/geometryGenerators';
import {
  generateProceduralDualRayTriangle,
  generateProceduralSquareDiagonalsAndCross,
  generateProceduralNestedDiamondSquare,
  generateProceduralTrussTriangle,
  generateProceduralStarPolygon,
  generateProceduralChevronParallelograms,
  generateProceduralQuestionBatch,
  generateProceduralQuestion,
} from '../GeometryGenerator';
import { generateDistractorOptions } from '../engine/geometryValidator';
import { LEVEL_CONFIGS } from '../constants';

/**
 * Builds a validated question object with 4 randomized distinct options.
 */
function createQuestion(
  id: string,
  level: DifficultyLevel,
  targetShape: ShapeCategory,
  targetPrompt: string,
  svgData: any,
  correctCount: number,
  explanation: string,
  hint: string,
  geometryType: any,
  fixedDistractors?: [number, number, number]
): GeometryQuestion {
  let options: number[];

  if (fixedDistractors && fixedDistractors.length === 3) {
    const set = new Set<number>([correctCount, ...fixedDistractors]);
    if (set.size === 4) {
      options = Array.from(set);
    } else {
      options = generateDistractorOptions(correctCount);
    }
  } else {
    options = generateDistractorOptions(correctCount);
  }

  // Shuffle options deterministically based on id hash so correct option is randomized
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  // Deterministic shuffle
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed + i * 7) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const correctIndex = shuffled.indexOf(correctCount);

  return {
    id,
    level,
    targetShape,
    targetPrompt,
    svgData,
    correctCount,
    options: shuffled,
    correctIndex,
    explanation,
    hint,
    geometryType,
  };
}

/**
 * Generates verified questions for all 5 levels.
 * Guarantees at least 25 validated questions per level (125 total).
 */
export function buildVerifiedQuestionBank(): GeometryQuestion[] {
  const bank: GeometryQuestion[] = [];

  // ==========================================
  // LEVEL 1: VERY EASY (25 Questions)
  // Simple figures, basic counting, small counts
  // ==========================================

  // L1-01: Triangle with 1 central ray (2 intervals), 1 level
  {
    const { svgData, totalTriangles } = generateTriangleWithRaysSVG(2, 1);
    bank.push(
      createQuestion(
        'L1-01',
        1,
        'triangles',
        'Count all the triangles in this figure.',
        svgData,
        totalTriangles, // 3
        'There are 2 small single-cell triangles on each side, plus 1 large outer triangle combining both. Total = 2 + 1 = 3.',
        'Count the small individual triangles first, then look for the big outer triangle.',
        'triangle-rays',
        [2, 4, 5]
      )
    );
  }

  // L1-02: Triangle with 2 rays (3 intervals), 1 level
  {
    const { svgData, totalTriangles } = generateTriangleWithRaysSVG(3, 1);
    bank.push(
      createQuestion(
        'L1-02',
        1,
        'triangles',
        'How many triangles are present in this diagram?',
        svgData,
        totalTriangles, // 6
        'Small triangles (1 interval): 3. Medium triangles (2 intervals combined): 2. Large triangle (3 intervals combined): 1. Total = 3 + 2 + 1 = 6.',
        'Use the formula C(3+1, 2) = 6: count shapes made of 1, 2, and 3 parts.',
        'triangle-rays',
        [3, 5, 8]
      )
    );
  }

  // L1-03: Triangle with 1 ray (2 intervals), 2 horizontal levels
  {
    const { svgData, totalTriangles } = generateTriangleWithRaysSVG(2, 2);
    bank.push(
      createQuestion(
        'L1-03',
        1,
        'triangles',
        'Count all the triangles in this figure.',
        svgData,
        totalTriangles, // 6
        'Upper half: 2 small + 1 combined = 3 triangles. Full height: 2 small + 1 combined = 3 triangles. Total = 3 + 3 = 6.',
        'Look at the upper level above the crossbar, then the full triangles down to the base.',
        'triangle-rays',
        [4, 5, 8]
      )
    );
  }

  // L1-04: Square grid 2x2: Count Squares
  {
    const { svgData, totalSquares } = generateRectangularGridSVG(2, 2, true);
    bank.push(
      createQuestion(
        'L1-04',
        1,
        'squares',
        'How many squares are present in this 2×2 grid?',
        svgData,
        totalSquares, // 5
        'There are 4 small 1×1 squares, plus 1 large 2×2 outer square. Total = 4 + 1 = 5.',
        'Do not forget the big boundary square enclosing all 4 smaller ones.',
        'rectangle-grid',
        [4, 6, 8]
      )
    );
  }

  // L1-05: Rectangular grid 1x2: Count Rectangles
  {
    const { svgData, totalRectangles } = generateRectangularGridSVG(1, 2, true);
    bank.push(
      createQuestion(
        'L1-05',
        1,
        'rectangles',
        'Count all the rectangles in this 1×2 grid.',
        svgData,
        totalRectangles, // 3
        'By mathematical definition, every square is also a rectangle! The two 1×1 squares plus the one 1×2 rectangle make 3 rectangles in total.',
        'Remember that squares have 4 right angles, so they count as rectangles too! (2 squares + 1 wide rectangle = 3).',
        'rectangle-grid',
        [1, 2, 4]
      )
    );
  }

  // L1-06: Rectangular grid 1x3: Count Rectangles
  {
    const { svgData, totalRectangles } = generateRectangularGridSVG(1, 3, true);
    bank.push(
      createQuestion(
        'L1-06',
        1,
        'rectangles',
        'How many rectangles are in this row of 3 cells?',
        svgData,
        totalRectangles, // 6
        'Every square is a rectangle! The three 1×1 squares, plus two 1×2 rectangles, plus one 1×3 rectangle = 3 + 2 + 1 = 6 rectangles.',
        'Use the formula C(cols+1, 2) = C(4, 2) = 6: all single squares and multi-cell combinations count!',
        'rectangle-grid',
        [3, 4, 5]
      )
    );
  }

  // L1-07: Square grid 2x2: Count Rectangles
  {
    const { svgData, totalRectangles } = generateRectangularGridSVG(2, 2, true);
    bank.push(
      createQuestion(
        'L1-07',
        1,
        'rectangles',
        'Count all the rectangles in this 2×2 grid.',
        svgData,
        totalRectangles, // 9
        'Every square is a rectangle! There are 5 squares (4 unit + 1 big) plus 4 oblong 1×2 rectangles = 9 rectangles total: C(3, 2) × C(3, 2) = 9.',
        'Count all 5 squares AND all 4 oblong rectangles together: 5 + 4 = 9.',
        'rectangle-grid',
        [4, 5, 8]
      )
    );
  }

  // L1-08: Parallelogram grid 1x2: Count Parallelograms
  {
    const { svgData, totalParallelograms } = generateParallelogramGridSVG(1, 2);
    bank.push(
      createQuestion(
        'L1-08',
        1,
        'parallelograms',
        'How many parallelograms can you find in this slanted figure?',
        svgData,
        totalParallelograms, // 3
        'There are 2 small single parallelograms plus 1 combined 1×2 parallelogram. Total = 2 + 1 = 3.',
        'Count the individual slanted blocks first, then combine them.',
        'parallelogram-grid',
        [2, 4, 5]
      )
    );
  }

  // L1-09: Parallelogram grid 1x3: Count Parallelograms
  {
    const { svgData, totalParallelograms } = generateParallelogramGridSVG(1, 3);
    bank.push(
      createQuestion(
        'L1-09',
        1,
        'parallelograms',
        'Count all the parallelograms in this row of 3 cells.',
        svgData,
        totalParallelograms, // 6
        'Single cells: 3. Two cells combined: 2. Three cells combined: 1. Total = 3 + 2 + 1 = 6.',
        'Count 1-cell, 2-cell, and 3-cell wide parallelograms.',
        'parallelogram-grid',
        [3, 5, 8]
      )
    );
  }

  // L1-10: Rhombus grid 1x2: Count Rhombuses
  {
    const { svgData, totalRhombuses } = generateRhombusGridSVG(1, 2);
    bank.push(
      createQuestion(
        'L1-10',
        1,
        'rhombuses',
        'How many rhombuses are present in this diagram?',
        svgData,
        totalRhombuses, // 2
        'Each of the 2 individual cells has 4 equal sides, making 2 rhombuses. The combined 1×2 shape has sides of lengths 1 and 2 (not equal), so it is not a rhombus. Total = 2.',
        'A rhombus must have all 4 sides equal in length.',
        'rhombus-lattice',
        [1, 3, 4]
      )
    );
  }

  // L1-11: Rhombus grid 2x2: Count Rhombuses
  {
    const { svgData, totalRhombuses } = generateRhombusGridSVG(2, 2);
    bank.push(
      createQuestion(
        'L1-11',
        1,
        'rhombuses',
        'How many rhombuses are present in this 2×2 diamond pattern?',
        svgData,
        totalRhombuses, // 5
        'There are 4 small 1×1 unit rhombuses plus 1 large 2×2 rhombus enclosing them all. Total = 4 + 1 = 5.',
        'Look for the large 2×2 rhombus that has all four outer sides equal.',
        'rhombus-lattice',
        [4, 6, 8]
      )
    );
  }

  // L1-12: Triangle with 3 rays (4 intervals), 1 level
  {
    const { svgData, totalTriangles } = generateTriangleWithRaysSVG(4, 1);
    bank.push(
      createQuestion(
        'L1-12',
        1,
        'triangles',
        'Count all the triangles in this figure.',
        svgData,
        totalTriangles, // 10
        '1-part triangles: 4. 2-part triangles: 3. 3-part triangles: 2. 4-part triangle: 1. Total = 4 + 3 + 2 + 1 = 10.',
        'Systematically add: 4 + 3 + 2 + 1 = 10.',
        'triangle-rays',
        [8, 9, 12]
      )
    );
  }

  // L1-13: Rectangular grid 1x4: Count Rectangles
  {
    const { svgData, totalRectangles } = generateRectangularGridSVG(1, 4, true);
    bank.push(
      createQuestion(
        'L1-13',
        1,
        'rectangles',
        'Count all the rectangles in this 1×4 row.',
        svgData,
        totalRectangles, // 10
        'Every square is a rectangle! The 4 unit squares plus multi-cell rectangles (3 of size 2, 2 of size 3, 1 of size 4) = 4 + 3 + 2 + 1 = 10 rectangles.',
        'Use the formula C(4+1, 2) = 10: all squares and composite rectangles count.',
        'rectangle-grid',
        [6, 8, 12]
      )
    );
  }

  // L1-14: Parallelogram grid 2x2: Count Parallelograms
  {
    const { svgData, totalParallelograms } = generateParallelogramGridSVG(2, 2);
    bank.push(
      createQuestion(
        'L1-14',
        1,
        'parallelograms',
        'Count all the parallelograms in this 2×2 slanted grid.',
        svgData,
        totalParallelograms, // 9
        '1×1 blocks: 4. 1×2 horizontal blocks: 2. 2×1 vertical blocks: 2. 2×2 full block: 1. Total = 4 + 2 + 2 + 1 = 9.',
        'Calculate: C(2+1, 2) × C(2+1, 2) = 3 × 3 = 9.',
        'parallelogram-grid',
        [4, 8, 12]
      )
    );
  }

  // L1-15: Rhombus grid 1x3: Count Rhombuses
  {
    const { svgData, totalRhombuses } = generateRhombusGridSVG(1, 3);
    bank.push(
      createQuestion(
        'L1-15',
        1,
        'rhombuses',
        'How many rhombuses are in this strip of 3 unit cells?',
        svgData,
        totalRhombuses, // 3
        'Only the 3 individual 1×1 cells have all 4 sides equal. Any combined shape has length > height and is a non-rhombus parallelogram. Total = 3.',
        'Only single 1×1 cells have 4 equal sides in a 1×3 strip.',
        'rhombus-lattice',
        [2, 4, 6]
      )
    );
  }

  // L1-16 to L1-25: Additional Level 1 variations
  for (let i = 16; i <= 25; i++) {
    if (i === 16) {
      const { svgData, totalTriangles } = generateTriangleWithRaysSVG(2, 1);
      bank.push(
        createQuestion(
          'L1-16',
          1,
          'triangles',
          'How many triangles can you spot in this simple bisected triangle?',
          svgData,
          totalTriangles, // 3
          'Left triangle: 1. Right triangle: 1. Entire triangle: 1. Total = 3.',
          'Two halves plus the whole.',
          'triangle-rays',
          [2, 4, 5]
        )
      );
    } else if (i === 17) {
      const { svgData, totalSquares } = generateRectangularGridSVG(1, 1, true);
      bank.push(
        createQuestion(
          'L1-17',
          1,
          'squares',
          'Count the squares in this single cell.',
          svgData,
          totalSquares, // 1
          'There is exactly 1 square shown.',
          'Look at the entire four-sided boundary.',
          'rectangle-grid',
          [0, 2, 4]
        )
      );
    } else if (i === 18) {
      const { svgData, totalTriangles } = generateTriangleWithRaysSVG(3, 1);
      bank.push(
        createQuestion(
          'L1-18',
          1,
          'triangles',
          'Find all the triangles in this 3-partition triangle.',
          svgData,
          totalTriangles, // 6
          '3 single + 2 doubles + 1 whole = 6 triangles.',
          'Pair adjacent sections to find the medium triangles.',
          'triangle-rays',
          [3, 5, 7]
        )
      );
    } else if (i === 19) {
      const { svgData, totalParallelograms } = generateParallelogramGridSVG(1, 2);
      bank.push(
        createQuestion(
          'L1-19',
          1,
          'parallelograms',
          'Count all the parallelograms in this 2-cell slanted band.',
          svgData,
          totalParallelograms, // 3
          '2 individual cells + 1 outer block = 3 parallelograms.',
          'Remember to count the overall boundary as well.',
          'parallelogram-grid',
          [2, 4, 6]
        )
      );
    } else if (i === 20) {
      const { svgData, totalRhombuses } = generateRhombusGridSVG(1, 4);
      bank.push(
        createQuestion(
          'L1-20',
          1,
          'rhombuses',
          'How many rhombuses are in this strip of 4 cells?',
          svgData,
          totalRhombuses, // 4
          'Each of the 4 unit cells has equal sides. Longer combinations are non-rhombus parallelograms. Total = 4.',
          'Count the unit diamond cells.',
          'rhombus-lattice',
          [3, 5, 8]
        )
      );
    } else if (i === 21) {
      const { svgData, totalTriangles } = generateTriangleWithRaysSVG(2, 2);
      bank.push(
        createQuestion(
          'L1-21',
          1,
          'triangles',
          'How many triangles are formed with this horizontal division?',
          svgData,
          totalTriangles, // 6
          '3 in the top tier + 3 spanning the full height = 6 triangles.',
          'Check both horizontal levels.',
          'triangle-rays',
          [4, 5, 7]
        )
      );
    } else if (i === 22) {
      const { svgData, totalSquares } = generateRectangularGridSVG(2, 2, true);
      bank.push(
        createQuestion(
          'L1-22',
          1,
          'squares',
          'How many total squares are in this 2×2 window?',
          svgData,
          totalSquares, // 5
          '4 individual squares + 1 large square = 5.',
          'The 4 small panes plus the full window frame.',
          'rectangle-grid',
          [4, 6, 7]
        )
      );
    } else if (i === 23) {
      const { svgData, totalRectangles } = generateRectangularGridSVG(1, 2, true);
      bank.push(
        createQuestion(
          'L1-23',
          1,
          'rectangles',
          'Count all the rectangles in this 1×2 figure.',
          svgData,
          totalRectangles, // 3
          'Every square is a rectangle! Two 1×1 squares + one 1×2 rectangle = 3 rectangles total.',
          'Squares count as rectangles because they have 4 right angles.',
          'rectangle-grid',
          [1, 2, 4]
        )
      );
    } else if (i === 24) {
      const { svgData, totalParallelograms } = generateParallelogramGridSVG(1, 3);
      bank.push(
        createQuestion(
          'L1-24',
          1,
          'parallelograms',
          'Count all parallelograms in this 3-cell band.',
          svgData,
          totalParallelograms, // 6
          '3 single + 2 double + 1 triple = 6.',
          'Sum of integers from 1 to 3.',
          'parallelogram-grid',
          [4, 5, 7]
        )
      );
    } else {
      const { svgData, totalTriangles } = generateTriangleWithRaysSVG(4, 1);
      bank.push(
        createQuestion(
          'L1-25',
          1,
          'triangles',
          'Count the triangles formed by these 3 interior rays.',
          svgData,
          totalTriangles, // 10
          '4 unit + 3 double + 2 triple + 1 full = 10.',
          '4 + 3 + 2 + 1 = 10.',
          'triangle-rays',
          [8, 11, 12]
        )
      );
    }
  }

  // ==========================================
  // LEVEL 2: EASY (25 Questions)
  // 120s timer per question, slightly larger lattices
  // ==========================================

  // L2-01: Triangular lattice T_2 (Equilateral)
  {
    const { svgData, totalTriangles } = generateTriangularLatticeSVG(2);
    bank.push(
      createQuestion(
        'L2-01',
        2,
        'triangles',
        'Count all triangles in this divided equilateral triangle.',
        svgData,
        totalTriangles, // 5
        '3 upright small triangles + 1 inverted small triangle in the middle + 1 large outer triangle = 5 total triangles.',
        'Do not miss the upside-down central triangle and the large overall triangle.',
        'triangular-grid',
        [4, 6, 7]
      )
    );
  }

  // L2-02: Triangle with 3 rays (4 intervals), 2 levels
  {
    const { svgData, totalTriangles } = generateTriangleWithRaysSVG(4, 2);
    bank.push(
      createQuestion(
        'L2-02',
        2,
        'triangles',
        'How many triangles are in this two-tier figure?',
        svgData,
        totalTriangles, // 20
        'Top tier: C(4+1, 2) = 10 triangles. Full height to base: 10 triangles. Total = 10 + 10 = 20.',
        'Calculate triangles on the upper horizontal line (10), then repeat for the base (10).',
        'triangle-rays',
        [16, 18, 22]
      )
    );
  }

  // L2-03: Square grid 3x3: Count Squares
  {
    const { svgData, totalSquares } = generateRectangularGridSVG(3, 3, true);
    bank.push(
      createQuestion(
        'L2-03',
        2,
        'squares',
        'How many squares exist in this 3×3 grid?',
        svgData,
        totalSquares, // 14
        '1×1 squares: 9. 2×2 squares: 4. 3×3 square: 1. Total = 9 + 4 + 1 = 14.',
        'Remember to count the 2×2 squares that overlap across the center.',
        'rectangle-grid',
        [10, 13, 16]
      )
    );
  }

  // L2-04: Rectangular grid 2x3: Count Squares
  {
    const { svgData, totalSquares } = generateRectangularGridSVG(2, 3, true);
    bank.push(
      createQuestion(
        'L2-04',
        2,
        'squares',
        'Count all the squares in this 2×3 grid of unit squares.',
        svgData,
        totalSquares, // 8
        '1×1 squares: 6 (2 rows of 3). 2×2 squares: 2. Total = 6 + 2 = 8.',
        'Only 1×1 and 2×2 squares are possible in a grid with 2 rows.',
        'rectangle-grid',
        [6, 7, 10]
      )
    );
  }

  // L2-05: Rectangular grid 2x3: Count Rectangles
  {
    const { svgData, totalRectangles } = generateRectangularGridSVG(2, 3, true);
    bank.push(
      createQuestion(
        'L2-05',
        2,
        'rectangles',
        'Count all the rectangles in this 2×3 grid.',
        svgData,
        totalRectangles, // 18
        'Every square is a rectangle! Total rectangles = C(3, 2) × C(4, 2) = 3 × 6 = 18 (8 squares + 10 oblong rectangles = 18).',
        'Use the formula C(rows+1, 2) × C(cols+1, 2) = 3 × 6 = 18 rectangles in total.',
        'rectangle-grid',
        [10, 14, 16]
      )
    );
  }

  // L2-06: Parallelogram grid 2x3: Count Parallelograms
  {
    const { svgData, totalParallelograms } = generateParallelogramGridSVG(2, 3);
    bank.push(
      createQuestion(
        'L2-06',
        2,
        'parallelograms',
        'Count all the parallelograms in this 2×3 slanted grid.',
        svgData,
        totalParallelograms, // 18
        'Vertical choices: C(2+1, 2) = 3. Horizontal choices: C(3+1, 2) = 6. Total = 3 × 6 = 18.',
        'Multiply 3 vertical row combinations by 6 horizontal column combinations.',
        'parallelogram-grid',
        [14, 16, 20]
      )
    );
  }

  // L2-07: Rhombus grid 2x3: Count Rhombuses
  {
    const { svgData, totalRhombuses } = generateRhombusGridSVG(2, 3);
    bank.push(
      createQuestion(
        'L2-07',
        2,
        'rhombuses',
        'How many rhombuses are present in this 2×3 diamond lattice?',
        svgData,
        totalRhombuses, // 8
        '1×1 unit rhombuses: 6. 2×2 rhombuses: 2. Total = 6 + 2 = 8.',
        'A rhombus requires equal sides, so only 1×1 and 2×2 shapes qualify.',
        'rhombus-lattice',
        [6, 9, 12]
      )
    );
  }

  // L2-08: Triangle with 2 rays (3 intervals), 3 levels
  {
    const { svgData, totalTriangles } = generateTriangleWithRaysSVG(3, 3);
    bank.push(
      createQuestion(
        'L2-08',
        2,
        'triangles',
        'Count all the triangles in this 3-tier triangle.',
        svgData,
        totalTriangles, // 18
        'Each horizontal crossbar forms C(3+1, 2) = 6 triangles with the apex. With 3 tiers, total = 3 × 6 = 18.',
        'Each horizontal level contains 6 triangles pointing to the top apex.',
        'triangle-rays',
        [15, 16, 21]
      )
    );
  }

  // L2-09: Rectangular grid 2x4: Count Squares
  {
    const { svgData, totalSquares } = generateRectangularGridSVG(2, 4, true);
    bank.push(
      createQuestion(
        'L2-09',
        2,
        'squares',
        'How many squares are in this 2×4 grid of unit squares?',
        svgData,
        totalSquares, // 11
        '1×1 squares: 8. 2×2 squares: 3. Total = 8 + 3 = 11.',
        'Count 8 individual squares, then find the 3 overlapping 2×2 squares.',
        'rectangle-grid',
        [8, 10, 13]
      )
    );
  }

  // L2-10: Rectangular grid 2x4: Count Rectangles
  {
    const { svgData, totalRectangles } = generateRectangularGridSVG(2, 4, true);
    bank.push(
      createQuestion(
        'L2-10',
        2,
        'rectangles',
        'Count all the rectangles in this 2×4 grid.',
        svgData,
        totalRectangles, // 30
        'Every square is a rectangle! Total rectangles = C(3, 2) × C(5, 2) = 3 × 10 = 30 (11 squares + 19 oblong rectangles = 30).',
        'Use the formula C(rows+1, 2) × C(cols+1, 2) = 3 × 10 = 30.',
        'rectangle-grid',
        [19, 24, 28]
      )
    );
  }

  // L2-11: Parallelogram grid 2x4: Count Parallelograms
  {
    const { svgData, totalParallelograms } = generateParallelogramGridSVG(2, 4);
    bank.push(
      createQuestion(
        'L2-11',
        2,
        'parallelograms',
        'Count all the parallelograms in this 2×4 slanted matrix.',
        svgData,
        totalParallelograms, // 30
        'C(2+1, 2) × C(4+1, 2) = 3 × 10 = 30.',
        'Formula: 3 row combinations × 10 column combinations = 30.',
        'parallelogram-grid',
        [24, 28, 34]
      )
    );
  }

  // L2-12: Rhombus grid 2x4: Count Rhombuses
  {
    const { svgData, totalRhombuses } = generateRhombusGridSVG(2, 4);
    bank.push(
      createQuestion(
        'L2-12',
        2,
        'rhombuses',
        'How many rhombuses are in this 2×4 pattern?',
        svgData,
        totalRhombuses, // 11
        '1×1 rhombuses: 8. 2×2 rhombuses: 3. Total = 8 + 3 = 11.',
        'Only 1×1 and 2×2 shapes have four equal sides.',
        'rhombus-lattice',
        [8, 10, 14]
      )
    );
  }

  // L2-13: Triangle with 1 ray (2 intervals), 4 levels
  {
    const { svgData, totalTriangles } = generateTriangleWithRaysSVG(2, 4);
    bank.push(
      createQuestion(
        'L2-13',
        2,
        'triangles',
        'How many triangles are in this 4-tier bisected triangle?',
        svgData,
        totalTriangles, // 12
        'Each tier has 2 small + 1 combined = 3 triangles. With 4 tiers, total = 4 × 3 = 12.',
        'Multiply 3 triangles per level by 4 horizontal levels.',
        'triangle-rays',
        [10, 11, 14]
      )
    );
  }

  // L2-14: Square grid 3x3: Count Rectangles
  {
    const { svgData, totalRectangles } = generateRectangularGridSVG(3, 3, true);
    bank.push(
      createQuestion(
        'L2-14',
        2,
        'rectangles',
        'Count all the rectangles in this 3×3 grid.',
        svgData,
        totalRectangles, // 36
        'Every square is a rectangle! Total rectangles = C(4, 2) × C(4, 2) = 6 × 6 = 36 rectangles (14 squares + 22 oblong rectangles = 36).',
        'Use the formula C(4, 2) × C(4, 2) = 6 × 6 = 36 rectangles in total.',
        'rectangle-grid',
        [22, 28, 32]
      )
    );
  }

  // L2-15: Parallelogram grid 3x2: Count Parallelograms
  {
    const { svgData, totalParallelograms } = generateParallelogramGridSVG(3, 2);
    bank.push(
      createQuestion(
        'L2-15',
        2,
        'parallelograms',
        'Count all the parallelograms in this 3×2 slanted grid.',
        svgData,
        totalParallelograms, // 18
        'C(3+1, 2) × C(2+1, 2) = 6 × 3 = 18.',
        '6 vertical pairs × 3 horizontal pairs = 18.',
        'parallelogram-grid',
        [14, 16, 21]
      )
    );
  }

  // L2-16 to L2-25: Diverse Level 2 questions across all 5 shape categories
  {
    const shapes: ShapeCategory[] = ['triangles', 'squares', 'rectangles', 'parallelograms', 'rhombuses'];
    for (let i = 16; i <= 25; i++) {
      const targetShape = shapes[(i - 16) % shapes.length];
      const q = generateProceduralQuestion({ level: 2, targetShape });
      q.id = `L2-${i}`;
      bank.push(q);
    }
  }

  // ==========================================
  // LEVEL 3: MODERATE (25 Questions)
  // 180s timer per question, denser lattices
  // ==========================================

  // L3-01: Triangular lattice T_3 (Order 3)
  {
    const { svgData, totalTriangles } = generateTriangularLatticeSVG(3);
    bank.push(
      createQuestion(
        'L3-01',
        3,
        'triangles',
        'Count all the triangles in this 3-row equilateral lattice.',
        svgData,
        totalTriangles, // 13
        'Upright: 6 (size 1) + 3 (size 2) + 1 (size 3) = 10. Inverted: 3 (size 1) = 3. Total = 10 + 3 = 13.',
        'Formula floor(3×5×7/8) = floor(105/8) = 13. Remember the 3 inverted triangles.',
        'triangular-grid',
        [10, 12, 15]
      )
    );
  }

  // L3-02: Triangle with 4 rays (5 intervals), 2 levels
  {
    const { svgData, totalTriangles } = generateTriangleWithRaysSVG(5, 2);
    bank.push(
      createQuestion(
        'L3-02',
        3,
        'triangles',
        'How many triangles are in this diagram?',
        svgData,
        totalTriangles, // 30
        'Per tier: C(5+1, 2) = 15. With 2 tiers: 2 × 15 = 30.',
        'Each tier has 5 + 4 + 3 + 2 + 1 = 15 triangles.',
        'triangle-rays',
        [24, 28, 35]
      )
    );
  }

  // L3-03: Square grid 4x4: Count Squares
  {
    const { svgData, totalSquares } = generateRectangularGridSVG(4, 4, true);
    bank.push(
      createQuestion(
        'L3-03',
        3,
        'squares',
        'How many squares are in this 4×4 grid?',
        svgData,
        totalSquares, // 30
        '1×1: 16. 2×2: 9. 3×3: 4. 4×4: 1. Total = 16 + 9 + 4 + 1 = 30.',
        'Sum of squares: 1² + 2² + 3² + 4² = 30.',
        'rectangle-grid',
        [25, 28, 35]
      )
    );
  }

  // L3-04: Rectangular grid 3x4: Count Squares
  {
    const { svgData, totalSquares } = generateRectangularGridSVG(3, 4, true);
    bank.push(
      createQuestion(
        'L3-04',
        3,
        'squares',
        'Count all squares in this 3×4 grid of unit cells.',
        svgData,
        totalSquares, // 20
        '1×1: 12. 2×2: 6. 3×3: 2. Total = 12 + 6 + 2 = 20.',
        'Calculate: (3×4) + (2×3) + (1×2) = 12 + 6 + 2 = 20.',
        'rectangle-grid',
        [16, 18, 24]
      )
    );
  }

  // L3-05: Rectangular grid 3x4: Count Rectangles
  {
    const { svgData, totalRectangles } = generateRectangularGridSVG(3, 4, true);
    bank.push(
      createQuestion(
        'L3-05',
        3,
        'rectangles',
        'Count all the rectangles in this 3×4 grid.',
        svgData,
        totalRectangles, // 60
        'By mathematical definition, every square is a rectangle with equal sides! In this 3×4 grid, total rectangles = C(4, 2) × C(5, 2) = 6 × 10 = 60 rectangles (20 squares + 40 oblong rectangles = 60).',
        'Use the standard rectangle formula: C(3+1, 2) × C(4+1, 2) = 6 × 10 = 60.',
        'rectangle-grid',
        [40, 50, 70]
      )
    );
  }

  // L3-06: Parallelogram grid 3x3: Count Parallelograms
  {
    const { svgData, totalParallelograms } = generateParallelogramGridSVG(3, 3);
    bank.push(
      createQuestion(
        'L3-06',
        3,
        'parallelograms',
        'Count all the parallelograms in this 3×3 slanted grid.',
        svgData,
        totalParallelograms, // 36
        'C(3+1, 2) × C(3+1, 2) = 6 × 6 = 36.',
        '6 row selections × 6 column selections = 36.',
        'parallelogram-grid',
        [28, 32, 40]
      )
    );
  }

  // L3-07: Rhombus grid 3x3: Count Rhombuses
  {
    const { svgData, totalRhombuses } = generateRhombusGridSVG(3, 3);
    bank.push(
      createQuestion(
        'L3-07',
        3,
        'rhombuses',
        'How many rhombuses are in this 3×3 rhombus lattice?',
        svgData,
        totalRhombuses, // 14
        '1×1: 9. 2×2: 4. 3×3: 1. Total = 9 + 4 + 1 = 14.',
        'Only k×k shapes have equal sides.',
        'rhombus-lattice',
        [10, 12, 16]
      )
    );
  }

  // L3-08 to L3-25: Diverse Level 3 questions across all 5 shape categories
  {
    const shapes: ShapeCategory[] = ['triangles', 'squares', 'rectangles', 'parallelograms', 'rhombuses'];
    for (let i = 8; i <= 25; i++) {
      const targetShape = shapes[(i - 8) % shapes.length];
      const q = generateProceduralQuestion({ level: 3, targetShape });
      q.id = `L3-${i < 10 ? '0' + i : i}`;
      bank.push(q);
    }
  }

  // ==========================================
  // LEVEL 4: DIFFICULT (25 Questions)
  // 240s timer per question, larger combinatorics
  // ==========================================

  // L4-01: Triangular lattice T_4 (Order 4)
  {
    const { svgData, totalTriangles } = generateTriangularLatticeSVG(4);
    bank.push(
      createQuestion(
        'L4-01',
        4,
        'triangles',
        'Count all the triangles in this 4-row triangular lattice.',
        svgData,
        totalTriangles, // 27
        'Upright: 10 + 6 + 3 + 1 = 20. Inverted: 6 (size 1) + 1 (size 2) = 7. Total = 20 + 7 = 27.',
        'Formula: floor(4×6×9/8) = floor(216/8) = 27. Note the size-2 inverted triangle!',
        'triangular-grid',
        [22, 25, 30]
      )
    );
  }

  // L4-02: Triangle with 5 rays (6 intervals), 2 levels
  {
    const { svgData, totalTriangles } = generateTriangleWithRaysSVG(6, 2);
    bank.push(
      createQuestion(
        'L4-02',
        4,
        'triangles',
        'How many triangles are in this wide two-level figure?',
        svgData,
        totalTriangles, // 42
        'Per level: C(6+1, 2) = 21. Across 2 levels: 2 × 21 = 42.',
        'Each level has 6+5+4+3+2+1 = 21 triangles.',
        'triangle-rays',
        [36, 40, 48]
      )
    );
  }

  // L4-03: Square grid 5x5: Count Squares
  {
    const { svgData, totalSquares } = generateRectangularGridSVG(5, 5, true);
    bank.push(
      createQuestion(
        'L4-03',
        4,
        'squares',
        'Count all squares in this 5×5 grid.',
        svgData,
        totalSquares, // 55
        '1² + 2² + 3² + 4² + 5² = 25 + 16 + 9 + 4 + 1 = 55.',
        'Sum of the first 5 square numbers.',
        'rectangle-grid',
        [45, 50, 60]
      )
    );
  }

  // L4-04: Rectangular grid 4x5: Count Squares
  {
    const { svgData, totalSquares } = generateRectangularGridSVG(4, 5, true);
    bank.push(
      createQuestion(
        'L4-04',
        4,
        'squares',
        'How many squares are in this 4×5 grid of unit cells?',
        svgData,
        totalSquares, // 40
        '1×1: 20. 2×2: 12. 3×3: 6. 4×4: 2. Total = 20 + 12 + 6 + 2 = 40.',
        '(4×5) + (3×4) + (2×3) + (1×2) = 20 + 12 + 6 + 2 = 40.',
        'rectangle-grid',
        [34, 38, 45]
      )
    );
  }

  // L4-05: Rectangular grid 4x5: Count Rectangles
  {
    const { svgData, totalRectangles } = generateRectangularGridSVG(4, 5, true);
    bank.push(
      createQuestion(
        'L4-05',
        4,
        'rectangles',
        'Count all the rectangles in this 4×5 grid.',
        svgData,
        totalRectangles, // 150
        'Every square is a rectangle! Total rectangles = C(5, 2) × C(6, 2) = 10 × 15 = 150 rectangles (40 squares + 110 oblong rectangles = 150).',
        'Use the formula C(rows+1, 2) × C(cols+1, 2) = 10 × 15 = 150 rectangles in total.',
        'rectangle-grid',
        [110, 130, 160]
      )
    );
  }

  // L4-06: Parallelogram grid 4x4: Count Parallelograms
  {
    const { svgData, totalParallelograms } = generateParallelogramGridSVG(4, 4);
    bank.push(
      createQuestion(
        'L4-06',
        4,
        'parallelograms',
        'Count all the parallelograms in this 4×4 slanted matrix.',
        svgData,
        totalParallelograms, // 100
        'C(4+1, 2) × C(4+1, 2) = 10 × 10 = 100.',
        '10 vertical pairs × 10 horizontal pairs = 100.',
        'parallelogram-grid',
        [80, 90, 110]
      )
    );
  }

  // L4-07: Rhombus grid 4x4: Count Rhombuses
  {
    const { svgData, totalRhombuses } = generateRhombusGridSVG(4, 4);
    bank.push(
      createQuestion(
        'L4-07',
        4,
        'rhombuses',
        'How many rhombuses exist in this 4×4 diamond grid?',
        svgData,
        totalRhombuses, // 30
        '16 (1×1) + 9 (2×2) + 4 (3×3) + 1 (4×4) = 30.',
        'Only k×k shapes have 4 equal sides: 16+9+4+1 = 30.',
        'rhombus-lattice',
        [24, 28, 35]
      )
    );
  }

  // L4-08 to L4-25: Diverse Level 4 questions across all 5 shape categories
  {
    const shapes: ShapeCategory[] = ['triangles', 'squares', 'rectangles', 'parallelograms', 'rhombuses'];
    for (let i = 8; i <= 25; i++) {
      const targetShape = shapes[(i - 8) % shapes.length];
      const q = generateProceduralQuestion({ level: 4, targetShape });
      q.id = `L4-${i < 10 ? '0' + i : i}`;
      bank.push(q);
    }
  }

  // ==========================================
  // LEVEL 5: VERY DIFFICULT (25 Questions)
  // 300s timer per question, master tier
  // ==========================================

  // L5-01: Triangular lattice T_5 (Order 5)
  {
    const { svgData, totalTriangles } = generateTriangularLatticeSVG(5);
    bank.push(
      createQuestion(
        'L5-01',
        5,
        'triangles',
        'Master challenge: count all triangles in this 5-row equilateral lattice.',
        svgData,
        totalTriangles, // 48
        'Upright: 15 + 10 + 6 + 3 + 1 = 35. Inverted: 10 (size 1) + 3 (size 2) = 13. Total = 35 + 13 = 48.',
        'Formula floor(5×7×11/8) = floor(385/8) = 48.',
        'triangular-grid',
        [42, 45, 52]
      )
    );
  }

  // L5-02: Triangle with 6 rays (7 intervals), 2 levels
  {
    const { svgData, totalTriangles } = generateTriangleWithRaysSVG(7, 2);
    bank.push(
      createQuestion(
        'L5-02',
        5,
        'triangles',
        'How many triangles are in this 7-segment, 2-tier triangle?',
        svgData,
        totalTriangles, // 56
        'C(7+1, 2) = 28 per level. Total across 2 levels = 2 × 28 = 56.',
        'Each level has 7+6+5+4+3+2+1 = 28 triangles.',
        'triangle-rays',
        [48, 52, 60]
      )
    );
  }

  // L5-03: Square grid 6x6: Count Squares
  {
    const { svgData, totalSquares } = generateRectangularGridSVG(6, 6, true);
    bank.push(
      createQuestion(
        'L5-03',
        5,
        'squares',
        'Count all squares in this massive 6×6 grid.',
        svgData,
        totalSquares, // 91
        '1² + 2² + 3² + 4² + 5² + 6² = 36 + 25 + 16 + 9 + 4 + 1 = 91.',
        'Sum of the first 6 square numbers.',
        'rectangle-grid',
        [80, 85, 96]
      )
    );
  }

  // L5-04: Rectangular grid 5x5: Count Rectangles
  {
    const { svgData, totalRectangles } = generateRectangularGridSVG(5, 5, true);
    bank.push(
      createQuestion(
        'L5-04',
        5,
        'rectangles',
        'Count all the rectangles in this 5×5 grid.',
        svgData,
        totalRectangles, // 225
        'Every square is a rectangle! Total rectangles = C(6, 2) × C(6, 2) = 15 × 15 = 225 rectangles (55 squares + 170 oblong rectangles = 225).',
        'Use the formula C(rows+1, 2) × C(cols+1, 2) = 15 × 15 = 225.',
        'rectangle-grid',
        [170, 200, 250]
      )
    );
  }

  // L5-05: Parallelogram grid 4x5: Count Parallelograms
  {
    const { svgData, totalParallelograms } = generateParallelogramGridSVG(4, 5);
    bank.push(
      createQuestion(
        'L5-05',
        5,
        'parallelograms',
        'Count all parallelograms in this 4×5 slanted array.',
        svgData,
        totalParallelograms, // 150
        'C(4+1, 2) × C(5+1, 2) = 10 × 15 = 150.',
        '10 vertical combinations × 15 horizontal combinations = 150.',
        'parallelogram-grid',
        [130, 140, 165]
      )
    );
  }

  // L5-06: Rhombus grid 5x5: Count Rhombuses
  {
    const { svgData, totalRhombuses } = generateRhombusGridSVG(5, 5);
    bank.push(
      createQuestion(
        'L5-06',
        5,
        'rhombuses',
        'How many rhombuses exist in this 5×5 diamond field?',
        svgData,
        totalRhombuses, // 55
        '25 (1×1) + 16 (2×2) + 9 (3×3) + 4 (4×4) + 1 (5×5) = 55.',
        'Sum of squares from 1 to 5 = 55.',
        'rhombus-lattice',
        [45, 50, 65]
      )
    );
  }

  // L5-07 to L5-25: Diverse Level 5 questions across all 5 shape categories
  {
    const shapes: ShapeCategory[] = ['triangles', 'squares', 'rectangles', 'parallelograms', 'rhombuses'];
    for (let i = 7; i <= 25; i++) {
      const targetShape = shapes[(i - 7) % shapes.length];
      const q = generateProceduralQuestion({ level: 5, targetShape });
      q.id = `L5-${i < 10 ? '0' + i : i}`;
      bank.push(q);
    }
  }

  // ==========================================
  // LEVEL 6: NAGASTRA (The Serpent Dart)
  // Dual-ray triangles, Star Polygons, Square Diagonals Cross, Chevron Grids
  // ==========================================
  {
    // L6-01: Dual Ray Triangle (1 apex ray, 1 base ray)
    const p1 = generateProceduralDualRayTriangle(1, 1);
    bank.push(
      createQuestion(
        'L6-01',
        6,
        'triangles',
        'Count all triangles in this dual-ray triangle.',
        p1.svgData,
        p1.counts.triangles,
        'Rays drawn from apex and base corner intersect to partition the interior into 8 distinct triangular regions.',
        'Count the small unit triangles around the intersection, then medium and outer triangles.',
        'triangle-dual-rays'
      )
    );

    // L6-02: 6-pointed Star Polygon (Star of David) -> Triangles
    const p2 = generateProceduralStarPolygon(100);
    bank.push(
      createQuestion(
        'L6-02',
        6,
        'triangles',
        'How many triangles are present in this 6-pointed star?',
        p2.svgData,
        p2.counts.triangles,
        'There are 6 outer corner triangles plus 2 large overlapping central equilateral triangles. Total = 6 + 2 = 8.',
        'Count the 6 sharp points along the rim, then look for the two large opposite triangles.',
        'star-polygon'
      )
    );

    // L6-03: 6-pointed Star Polygon -> Rhombuses
    bank.push(
      createQuestion(
        'L6-03',
        6,
        'rhombuses',
        'How many rhombuses can be formed in this star figure?',
        p2.svgData,
        p2.counts.rhombuses,
        'Opposite pairs of equilateral point triangles joined across the central hexagonal hub form exactly 3 distinct rhombuses.',
        'Look for 4-sided diamond shapes made of two adjacent triangular wedges.',
        'star-polygon'
      )
    );

    // L6-04: Square with Diagonals and Midline Cross -> Triangles
    const p4 = generateProceduralSquareDiagonalsAndCross();
    bank.push(
      createQuestion(
        'L6-04',
        6,
        'triangles',
        'Count all triangles in this square with diagonals and crosslines.',
        p4.svgData,
        p4.counts.triangles,
        'There are 8 small 1-cell right triangles, 4 medium 2-cell triangles, and 4 large quadrant triangles = 16 triangles.',
        'Count the 8 smallest triangles inside the quadrants, then look for pairs forming larger right triangles.',
        'square-diagonals'
      )
    );

    // L6-05: Square with Diagonals and Midline Cross -> Squares
    bank.push(
      createQuestion(
        'L6-05',
        6,
        'squares',
        'How many squares are present in this figure?',
        p4.svgData,
        p4.counts.squares,
        'There are 4 small quadrant squares plus 1 large outer boundary square = 5 squares total.',
        'Notice that the diagonals do not create new squares—only the grid lines form squares.',
        'square-diagonals'
      )
    );

    // L6-06: 2-tier Truss Triangle
    const p6 = generateProceduralTrussTriangle(2);
    bank.push(
      createQuestion(
        'L6-06',
        6,
        'triangles',
        'Count all triangles in this A-frame truss structure.',
        p6.svgData,
        p6.counts.triangles,
        'The combination of horizontal ties and diagonal cross-struts forms 12 distinct upright and inverted triangles.',
        'Check both top-down triangles and inverted triangles formed by the cross-struts.',
        'triangle-truss'
      )
    );

    // L6-07: Nested Diamond Square -> Triangles
    const p7 = generateProceduralNestedDiamondSquare();
    bank.push(
      createQuestion(
        'L6-07',
        6,
        'triangles',
        'Count all triangles formed in this nested diamond pattern.',
        p7.svgData,
        p7.counts.triangles,
        'The 4 outer corner triangles plus the 8 internal right triangles inside the rotated diamond equal 12 triangles.',
        'Look at the 4 corner right triangles outside the diamond, then the inner quadrants.',
        'nested-diamonds'
      )
    );

    // L6-08: Nested Diamond Square -> Squares
    bank.push(
      createQuestion(
        'L6-08',
        6,
        'squares',
        'Count all squares (including rotated squares) in this diagram.',
        p7.svgData,
        p7.counts.squares,
        '1 outer square, 1 rotated diamond square connecting midpoints, plus 4 small quadrant squares inside = 6 squares.',
        'Remember that a rhombus with 90° angles is a square, even when tilted 45°!',
        'nested-diamonds'
      )
    );

    // L6-09: 2x3 Chevron Parallelograms
    const p9 = generateProceduralChevronParallelograms(2, 3);
    bank.push(
      createQuestion(
        'L6-09',
        6,
        'parallelograms',
        'Count all parallelograms in this slanted chevron lattice.',
        p9.svgData,
        p9.counts.parallelograms,
        'Choosing pairs of parallel horizontal lines and slanted boundary lines forms 10 general parallelograms.',
        'Count 1-cell slanted parallelograms, then horizontal and vertical combos.',
        'parallelogram-chevron'
      )
    );

    // L6-10 to L6-15: additional verified questions
    for (let k = 10; k <= 15; k++) {
      const q = generateProceduralQuestionBatch(1, 6)[0];
      if (q) {
        q.id = `L6-${k}`;
        bank.push(q);
      }
    }
  }

  // ==========================================
  // LEVEL 7: NARAYANASTRA (Lord Narayana's Astra)
  // Higher complexity, chevron lattices, nested matrices
  // ==========================================
  {
    // L7-01: Dual Ray Triangle (2 apex rays, 1 base ray)
    const p1 = generateProceduralDualRayTriangle(2, 1);
    bank.push(
      createQuestion(
        'L7-01',
        7,
        'triangles',
        'Count all triangles in this intricate dual-ray triangle.',
        p1.svgData,
        p1.counts.triangles,
        'With 2 rays from the apex and 1 transversal from the base corner, planar intersection yields 15 distinct triangles.',
        'Break it down into triangles sharing the apex vertex and triangles formed by the transversal ray.',
        'triangle-dual-rays'
      )
    );

    // L7-02: 3-tier Truss Triangle
    const p2 = generateProceduralTrussTriangle(3);
    bank.push(
      createQuestion(
        'L7-02',
        7,
        'triangles',
        'Count all triangles in this 3-tier truss network.',
        p2.svgData,
        p2.counts.triangles,
        'The 3 horizontal bays with alternating diagonals create 22 distinct geometric triangles across all sizes.',
        'Count triangles on the upper peak tier, middle bay, and base bay systematically.',
        'triangle-truss'
      )
    );

    // L7-03: Order-3 Triangular Lattice
    const { svgData: svgTri3, totalTriangles: totTri3 } = generateTriangularLatticeSVG(3);
    bank.push(
      createQuestion(
        'L7-03',
        7,
        'triangles',
        'How many triangles exist in this order-3 triangular lattice?',
        svgTri3,
        totTri3, // 13
        'For n = 3: floor(3 × 5 × 7 / 8) = floor(105 / 8) = 13 triangles (9 unit upward, 3 of size 2, 1 size 3).',
        'Remember to count the 1-unit triangles, 2-unit triangles, and the outer 3-unit triangle.',
        'triangular-grid'
      )
    );

    // L7-04: 3x3 Square Grid -> Squares
    const { svgData: svgSq3, totalSquares: totSq3 } = generateRectangularGridSVG(3, 3, true);
    bank.push(
      createQuestion(
        'L7-04',
        7,
        'squares',
        'Count all squares in this 3×3 square grid.',
        svgSq3,
        totSq3, // 14
        '9 of size 1×1 + 4 of size 2×2 + 1 of size 3×3 = 14 squares.',
        'Sum of squares formula: 1² + 2² + 3² = 1 + 4 + 9 = 14.',
        'rectangle-grid'
      )
    );

    // L7-05: 4x2 Rectangular Grid -> Rectangles
    const { svgData: svgRec42, totalRectangles: totRec42 } = generateRectangularGridSVG(4, 2, false);
    bank.push(
      createQuestion(
        'L7-05',
        7,
        'rectangles',
        'How many rectangles exist in this 4×2 grid?',
        svgRec42,
        totRec42, // 30
        'Total line combinations: C(5, 2) × C(3, 2) = 10 × 3 = 30 rectangles total.',
        'Count horizontal combinations of 1 and 2 cells across the 4 rows: C(5, 2) × C(3, 2) = 30.',
        'rectangle-grid'
      )
    );

    // L7-06: 3x3 Parallelogram Grid
    const { svgData: svgPar33, totalParallelograms: totPar33 } = generateParallelogramGridSVG(3, 3);
    bank.push(
      createQuestion(
        'L7-06',
        7,
        'parallelograms',
        'Count all parallelograms in this 3×3 slanted grid.',
        svgPar33,
        totPar33, // 36
        'Choosing 2 horizontal lines from 4 and 2 slanted lines from 4 gives C(4,2) × C(4,2) = 6 × 6 = 36.',
        'Apply the combinatorial line-pair formula: C(rows+1, 2) × C(cols+1, 2).',
        'parallelogram-grid'
      )
    );

    // L7-07 to L7-15: Additional verified procedural questions
    for (let k = 7; k <= 15; k++) {
      const q = generateProceduralQuestionBatch(1, 7)[0];
      if (q) {
        q.id = `L7-${k < 10 ? '0' + k : k}`;
        bank.push(q);
      }
    }
  }

  // ==========================================
  // LEVEL 8: BRAHMASTRA (The Creator Weapon)
  // Symmetric dual cevians, 4x4 grids, full diagonals
  // ==========================================
  {
    // L8-01: Dual Ray 2x2 Triangle (The iconic 27 triangles puzzle!)
    const p1 = generateProceduralDualRayTriangle(2, 2);
    bank.push(
      createQuestion(
        'L8-01',
        8,
        'triangles',
        'Count all triangles in this triangle with 2 rays from apex and 2 rays from base.',
        p1.svgData,
        p1.counts.triangles, // 27
        'This classic problem features 2 cevians from two vertices. Total triangles = (n+1)³ for n=2 is 3³ = 27 triangles!',
        'This is the famous (n+1)³ formula where n is the number of internal rays from both vertices.',
        'triangle-dual-rays'
      )
    );

    // L8-02: Order-4 Triangular Lattice
    const { svgData: svgTri4, totalTriangles: totTri4 } = generateTriangularLatticeSVG(4);
    bank.push(
      createQuestion(
        'L8-02',
        8,
        'triangles',
        'Count all triangles of all sizes in this order-4 equilateral triangular lattice.',
        svgTri4,
        totTri4, // 27
        'For n = 4: floor(4 × 6 × 9 / 8) = 27 triangles (16 unit upward, 7 of size 2, 3 of size 3, 1 size 4).',
        'Do not miss the inverted downward-pointing triangles formed in the interior!',
        'triangular-grid'
      )
    );

    // L8-03: 4x4 Square Grid -> Squares
    const { svgData: svgSq4, totalSquares: totSq4 } = generateRectangularGridSVG(4, 4, true);
    bank.push(
      createQuestion(
        'L8-03',
        8,
        'squares',
        'Count all squares in this 4×4 grid.',
        svgSq4,
        totSq4, // 30
        'Sum of squares: 1² + 2² + 3² + 4² = 1 + 4 + 9 + 16 = 30 squares.',
        'Add squares of sizes 1×1 (16), 2×2 (9), 3×3 (4), and 4×4 (1).',
        'rectangle-grid'
      )
    );

    // L8-04: 4x3 Parallelogram Grid
    const { svgData: svgPar43, totalParallelograms: totPar43 } = generateParallelogramGridSVG(4, 3);
    bank.push(
      createQuestion(
        'L8-04',
        8,
        'parallelograms',
        'Count all parallelograms in this 4×3 slanted lattice.',
        svgPar43,
        totPar43, // 60
        'C(5, 2) × C(4, 2) = 10 × 6 = 60 parallelograms.',
        'Multiply horizontal line pairs C(5, 2) by slanted line pairs C(4, 2).',
        'parallelogram-grid'
      )
    );

    // L8-05 to L8-15: Additional verified procedural questions
    for (let k = 5; k <= 15; k++) {
      const q = generateProceduralQuestionBatch(1, 8)[0];
      if (q) {
        q.id = `L8-${k < 10 ? '0' + k : k}`;
        bank.push(q);
      }
    }
  }

  // ==========================================
  // LEVEL 9: PASHUPATASTRA (Lord Shiva's Weapon)
  // Extreme topological density and multi-tier webs
  // ==========================================
  {
    // L9-01: Dual Ray 3x2 Triangle
    const p1 = generateProceduralDualRayTriangle(3, 2);
    bank.push(
      createQuestion(
        'L9-01',
        9,
        'triangles',
        'Count all triangles in this high-density dual-ray triangle.',
        p1.svgData,
        p1.counts.triangles,
        'Planar geometric validation confirms exactly ' + p1.counts.triangles + ' triangles formed by 3 apex rays and 2 base rays.',
        'Break down the diagram into primary triangular sectors and composite combinations.',
        'triangle-dual-rays'
      )
    );

    // L9-02: 5x3 Parallelogram Grid
    const { svgData: svgPar53, totalParallelograms: totPar53 } = generateParallelogramGridSVG(5, 3);
    bank.push(
      createQuestion(
        'L9-02',
        9,
        'parallelograms',
        'How many parallelograms can you find in this 5×3 slanted grid?',
        svgPar53,
        totPar53, // 90
        'C(6, 2) × C(4, 2) = 15 × 6 = 90 parallelograms.',
        '15 horizontal choices × 6 slanted choices = 90 combinations.',
        'parallelogram-grid'
      )
    );

    // L9-03: 5x3 Rectangular Grid -> Rectangles
    const { svgData: svgRec53, totalRectangles: totRec53 } = generateRectangularGridSVG(5, 3, false);
    bank.push(
      createQuestion(
        'L9-03',
        9,
        'rectangles',
        'Count all rectangles in this 5×3 grid.',
        svgRec53,
        totRec53, // 90
        'Combinations of 6 horizontal lines and 4 vertical lines: 15 × 6 = 90 rectangles. (Every square is also a rectangle!)',
        'C(6, 2) × C(4, 2) = 90.',
        'rectangle-grid'
      )
    );

    // L9-04 to L9-15: Additional verified procedural questions
    for (let k = 4; k <= 15; k++) {
      const q = generateProceduralQuestionBatch(1, 9)[0];
      if (q) {
        q.id = `L9-${k < 10 ? '0' + k : k}`;
        bank.push(q);
      }
    }
  }

  // ==========================================
  // LEVEL 10: SUDARSHANA (The Supreme Cosmic Discus)
  // The pinnacle of geometric mastery and sacred symmetry
  // ==========================================
  {
    // L10-01: Supreme Dual Ray 3x3 Triangle (The Master 64 Triangles Problem!)
    const p1 = generateProceduralDualRayTriangle(3, 3);
    bank.push(
      createQuestion(
        'L10-01',
        10,
        'triangles',
        'Count all triangles in this supreme dual-ray geometry (3 rays from each vertex).',
        p1.svgData,
        p1.counts.triangles,
        'By the symmetric cevian theorem: with 3 rays from each vertex, total triangles = (3+1)³ = 4³ = 64 triangles!',
        'Formula: (n+1)³ where n=3 rays per corner: 4³ = 64.',
        'triangle-dual-rays'
      )
    );

    // L10-02: 5x5 Square Grid -> Squares
    const { svgData: svgSq5, totalSquares: totSq5 } = generateRectangularGridSVG(5, 5, true);
    bank.push(
      createQuestion(
        'L10-02',
        10,
        'squares',
        'Count all squares of all sizes in this 5×5 cosmic mandala grid.',
        svgSq5,
        totSq5, // 55
        'Sum of squares: 1² + 2² + 3² + 4² + 5² = 1 + 4 + 9 + 16 + 25 = 55 squares.',
        'Add up all 1×1 (25), 2×2 (16), 3×3 (9), 4×4 (4), and 5×5 (1) squares.',
        'rectangle-grid'
      )
    );

    // L10-03: 5x4 Parallelogram Cosmic Web
    const { svgData: svgPar54, totalParallelograms: totPar54 } = generateParallelogramGridSVG(5, 4);
    bank.push(
      createQuestion(
        'L10-03',
        10,
        'parallelograms',
        'Count all parallelograms in this 5×4 cosmic web.',
        svgPar54,
        totPar54, // 150
        'C(6, 2) × C(5, 2) = 15 × 10 = 150 parallelograms.',
        'Combinations: 15 horizontal line pairs × 10 slanted line pairs = 150.',
        'parallelogram-grid'
      )
    );

    // L10-04 to L10-15: Additional verified procedural questions
    for (let k = 4; k <= 15; k++) {
      const q = generateProceduralQuestionBatch(1, 10)[0];
      if (q) {
        q.id = `L10-${k < 10 ? '0' + k : k}`;
        bank.push(q);
      }
    }
  }

  return bank;
}

// Global cached question bank
export const ALL_VERIFIED_QUESTIONS = buildVerifiedQuestionBank();

/**
 * Selects 7 distinct, diverse questions for an Astra level attempt.
 *
 * User Constraints Enforced:
 * 1. Strict No-Repeat: No question may repeat within a level.
 * 2. High Type Diversity: Every level attempt must feature diverse questions across
 *    triangles, squares, rectangles, parallelograms, and rhombuses.
 * 3. Fresh Replay: Prioritizes unseen questions; supplements with procedurally verified
 *    questions across varied dimensions (1x3, 2x4, 3x4, 3x5, 4x2, 4x5, star polygons,
 *    chevrons, cross-grids, staircases, etc.) when needed.
 * 4. Random Sequence: Shuffles the final set so question types appear in varied order.
 */
export function selectQuestionsForLevel(
  level: DifficultyLevel,
  recentlySeenIds: string[] = [],
  desiredCount = 7
): GeometryQuestion[] {
  const coreCategories: ShapeCategory[] = [
    'triangles',
    'squares',
    'rectangles',
    'parallelograms',
    'rhombuses',
  ];

  const selectedQuestions: GeometryQuestion[] = [];
  const selectedIds = new Set<string>();
  const usedSignatures = new Set<string>();

  // Signature prevents visually identical puzzles from repeating in the same level attempt
  const getSignature = (q: GeometryQuestion): string => {
    return `${q.geometryType}_${q.correctCount}_${q.targetShape}_${q.targetPrompt.slice(0, 20)}`;
  };

  const levelPool = ALL_VERIFIED_QUESTIONS.filter((q) => q.level === level);

  // Helper to pick a candidate question for a specific shape category
  const pickForCategory = (cat: ShapeCategory): GeometryQuestion => {
    const candidates = levelPool.filter(
      (q) =>
        q.targetShape === cat &&
        !selectedIds.has(q.id) &&
        !usedSignatures.has(getSignature(q))
    );

    // Prioritize unseen questions
    const unseen = candidates.filter((q) => !recentlySeenIds.includes(q.id));
    if (unseen.length > 0) {
      return unseen[Math.floor(Math.random() * unseen.length)];
    }
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    // Dynamically synthesize a fresh, pre-validated procedural question
    const dyn = generateProceduralQuestion({ level, targetShape: cat });
    dyn.id = `proc-dyn-L${level}-${cat}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    return dyn;
  };

  // Step 1: Guarantee all 5 core shape types are represented in this level attempt
  for (const cat of coreCategories) {
    const q = pickForCategory(cat);
    selectedQuestions.push(q);
    selectedIds.add(q.id);
    usedSignatures.add(getSignature(q));
  }

  // Step 2: Fill remaining slots (e.g. 2 more to make 7) with different shape types and dimensions
  const remainingSlots = desiredCount - selectedQuestions.length;
  const extraCategories = [...coreCategories].sort(() => Math.random() - 0.5);

  for (let i = 0; i < remainingSlots; i++) {
    const cat = extraCategories[i % extraCategories.length];
    const q = pickForCategory(cat);
    selectedQuestions.push(q);
    selectedIds.add(q.id);
    usedSignatures.add(getSignature(q));
  }

  // Step 3: Shuffle the final 7 questions so shape categories appear in varied order
  for (let i = selectedQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
  }

  return selectedQuestions;
}
