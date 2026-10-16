import {
  DifficultyLevel,
  GeometryQuestion,
  LineSegment,
  ShapeCategory,
  SVGGeometryData,
} from './types';
import {
  countAllShapesFromSegments,
  extractVertices,
  generateDistractorOptions,
  GeometryValidationResult,
  Point2D,
  splitSegmentsAtIntersections,
  validatePuzzleGeometry,
} from './geometryValidator';

/**
 * Standard SVG canvas dimensions for Shape Hunter diagrams
 */
export const DEFAULT_VIEWBOX_WIDTH = 380;
export const DEFAULT_VIEWBOX_HEIGHT = 320;

export interface ProceduralPuzzleData {
  svgData: SVGGeometryData;
  vertices: Point2D[];
  counts: Record<ShapeCategory, number>;
  validation: GeometryValidationResult;
  generatorType: GeometryQuestion['geometryType'];
  metadata: {
    rows?: number;
    cols?: number;
    intervals?: number;
    levels?: number;
    isSquare?: boolean;
    order?: number;
    steps?: number;
    armLength?: number;
    vertH?: number;
    outerSize?: number;
    subdivide?: boolean;
    [key: string]: any;
  };
}

export interface ProceduralQuestionOptions {
  level?: DifficultyLevel;
  targetShape?: ShapeCategory;
  geometryType?: GeometryQuestion['geometryType'];
  seed?: number;
}

// ============================================================================
// 1. PROCEDURAL DIAGRAM GENERATORS
// ============================================================================

/**
 * Procedurally generates an equilateral triangular lattice of order n.
 * Count formula: floor(n * (n + 2) * (2n + 1) / 8)
 */
export function generateProceduralTriangularGrid(
  order: number,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const n = Math.max(1, Math.min(5, Math.round(order)));
  const segments: LineSegment[] = [];

  const apex = { x: width / 2, y: 30 };
  const sideLength = width - 70;
  const h = (Math.sqrt(3) / 2) * sideLength;
  const baseLeft = { x: width / 2 - sideLength / 2, y: apex.y + h };
  const baseRight = { x: width / 2 + sideLength / 2, y: apex.y + h };

  // Family 1: Horizontal cross lines (r = 1 to n)
  for (let r = 1; r <= n; r++) {
    const t = r / n;
    segments.push({
      x1: Math.round(apex.x + t * (baseLeft.x - apex.x)),
      y1: Math.round(apex.y + t * h),
      x2: Math.round(apex.x + t * (baseRight.x - apex.x)),
      y2: Math.round(apex.y + t * h),
    });
  }

  // Family 2: Parallel to AC (right edge)
  for (let k = 0; k < n; k++) {
    const startX = apex.x + (k / n) * (baseLeft.x - apex.x);
    const startY = apex.y + (k / n) * h;
    const endX = startX + (1 - k / n) * (baseRight.x - apex.x);
    const endY = startY + (1 - k / n) * h;
    segments.push({
      x1: Math.round(startX),
      y1: Math.round(startY),
      x2: Math.round(endX),
      y2: Math.round(endY),
    });
  }

  // Family 3: Parallel to AB (left edge)
  for (let k = 0; k < n; k++) {
    const startX = apex.x + (k / n) * (baseRight.x - apex.x);
    const startY = apex.y + (k / n) * h;
    const endX = startX + (1 - k / n) * (baseLeft.x - apex.x);
    const endY = startY + (1 - k / n) * h;
    segments.push({
      x1: Math.round(startX),
      y1: Math.round(startY),
      x2: Math.round(endX),
      y2: Math.round(endY),
    });
  }

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const expectedCount = Math.floor((n * (n + 2) * (2 * n + 1)) / 8);
  const validation = validatePuzzleGeometry(svgData, 'triangles', expectedCount);
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'triangular-grid',
    metadata: { order: n },
  };
}

/**
 * Procedurally generates a triangle with apex rays dividing the base,
 * intersected by horizontal crossbars.
 * Count formula: levels * (intervals * (intervals + 1) / 2)
 */
export function generateProceduralTriangleRays(
  intervals: number,
  levels: number,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const m = Math.max(1, Math.min(6, Math.round(intervals)));
  const l = Math.max(1, Math.min(5, Math.round(levels)));
  const segments: LineSegment[] = [];

  const apex = { x: width / 2, y: 35 };
  const baseLeft = { x: 35, y: height - 35 };
  const baseRight = { x: width - 35, y: height - 35 };

  // Coordinates of base points
  const basePoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= m; i++) {
    const t = i / m;
    basePoints.push({
      x: baseLeft.x + t * (baseRight.x - baseLeft.x),
      y: baseLeft.y,
    });
  }

  // Draw rays from apex to each base point
  for (let i = 0; i <= m; i++) {
    segments.push({
      x1: Math.round(apex.x),
      y1: Math.round(apex.y),
      x2: Math.round(basePoints[i].x),
      y2: Math.round(basePoints[i].y),
    });
  }

  // Draw horizontal crossbars (levels)
  for (let lvl = 1; lvl <= l; lvl++) {
    const t = lvl / l;
    const y = apex.y + t * (baseLeft.y - apex.y);
    const x1 = apex.x + t * (baseLeft.x - apex.x);
    const x2 = apex.x + t * (baseRight.x - apex.x);

    segments.push({
      x1: Math.round(x1),
      y1: Math.round(y),
      x2: Math.round(x2),
      y2: Math.round(y),
    });
  }

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const expectedCount = l * ((m * (m + 1)) / 2);
  const validation = validatePuzzleGeometry(svgData, 'triangles', expectedCount);
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'triangle-rays',
    metadata: { intervals: m, levels: l },
  };
}

/**
 * Procedurally generates a rectangular or square grid.
 * - When isSquareGrid is true: cellW === cellH; shapes are classified into squares and exclusive rectangles.
 * - When isSquareGrid is false: cellW !== cellH; all shapes are non-square rectangles.
 */
export function generateProceduralRectangularGrid(
  rows: number,
  cols: number,
  isSquareGrid = false,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const rCount = Math.max(1, Math.min(5, Math.round(rows)));
  const cCount = Math.max(1, Math.min(5, Math.round(cols)));
  const segments: LineSegment[] = [];

  const marginX = 45;
  const marginY = 40;
  const availableW = width - 2 * marginX;
  const availableH = height - 2 * marginY;

  let cellW = availableW / cCount;
  let cellH = availableH / rCount;

  if (isSquareGrid) {
    const minCell = Math.floor(Math.min(cellW, cellH));
    cellW = minCell;
    cellH = minCell;
  } else {
    // Ensure distinct aspect ratio so cells are strictly non-square rectangles
    if (Math.abs(cellW - cellH) < 5) {
      cellW += 12;
      cellH -= 8;
    }
  }

  const startX = Math.round((width - cCount * cellW) / 2);
  const startY = Math.round((height - rCount * cellH) / 2);

  // Horizontal lines
  for (let r = 0; r <= rCount; r++) {
    const y = Math.round(startY + r * cellH);
    segments.push({
      x1: startX,
      y1: y,
      x2: Math.round(startX + cCount * cellW),
      y2: y,
    });
  }

  // Vertical lines
  for (let c = 0; c <= cCount; c++) {
    const x = Math.round(startX + c * cellW);
    segments.push({
      x1: x,
      y1: startY,
      x2: x,
      y2: Math.round(startY + rCount * cellH),
    });
  }

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const targetCategory: ShapeCategory = isSquareGrid ? 'squares' : 'rectangles';
  const validation = validatePuzzleGeometry(svgData, targetCategory);
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'rectangle-grid',
    metadata: { rows: rCount, cols: cCount, isSquare: isSquareGrid },
  };
}

/**
 * Procedurally generates a slanted parallelogram grid.
 * All quadrilaterals are general parallelograms (none are squares, rectangles, or rhombuses).
 */
export function generateProceduralParallelogramGrid(
  rows: number,
  cols: number,
  slantX = 40,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const rCount = Math.max(1, Math.min(5, Math.round(rows)));
  const cCount = Math.max(1, Math.min(5, Math.round(cols)));
  const segments: LineSegment[] = [];

  const marginY = 45;
  const totalH = height - 2 * marginY;
  const rowH = totalH / rCount;
  const totalW = width - 110;
  const colW = totalW / cCount;
  const startY = marginY;
  const startX = 40;

  // Horizontal lines
  for (let r = 0; r <= rCount; r++) {
    const y = Math.round(startY + r * rowH);
    const offsetX = Math.round((r / rCount) * slantX);
    segments.push({
      x1: startX + offsetX,
      y1: y,
      x2: startX + offsetX + Math.round(cCount * colW),
      y2: y,
    });
  }

  // Slanted lines
  for (let c = 0; c <= cCount; c++) {
    const xTop = Math.round(startX + c * colW);
    const xBot = xTop + slantX;
    segments.push({
      x1: xTop,
      y1: Math.round(startY),
      x2: xBot,
      y2: Math.round(startY + totalH),
    });
  }

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const expectedCount =
    ((rCount * (rCount + 1)) / 2) * ((cCount * (cCount + 1)) / 2);
  const validation = validatePuzzleGeometry(svgData, 'parallelograms', expectedCount);
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'parallelogram-grid',
    metadata: { rows: rCount, cols: cCount },
  };
}

/**
 * Procedurally generates a rhombus lattice where all unit cells have equal sides.
 * Contains both rhombuses (k x k) and composite general parallelograms (w x h, w !== h).
 */
export function generateProceduralRhombusLattice(
  rows: number,
  cols: number,
  sideLen = 65,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const rCount = Math.max(1, Math.min(4, Math.round(rows)));
  const cCount = Math.max(1, Math.min(4, Math.round(cols)));
  const segments: LineSegment[] = [];

  const angle = (60 * Math.PI) / 180; // 60 degrees slant
  const dx = sideLen * Math.cos(angle);
  const dy = sideLen * Math.sin(angle);

  const totalH = rCount * dy;
  const totalW = cCount * sideLen + rCount * dx;

  const startX = Math.round((width - totalW) / 2);
  const startY = Math.round((height - totalH) / 2);

  // Horizontal lines of length cols * sideLen
  for (let r = 0; r <= rCount; r++) {
    const y = Math.round(startY + r * dy);
    const x = Math.round(startX + r * dx);
    segments.push({
      x1: x,
      y1: y,
      x2: Math.round(x + cCount * sideLen),
      y2: y,
    });
  }

  // Slanted lines of length rows * sideLen
  for (let c = 0; c <= cCount; c++) {
    const x = Math.round(startX + c * sideLen);
    segments.push({
      x1: x,
      y1: startY,
      x2: Math.round(x + rCount * dx),
      y2: Math.round(startY + totalH),
    });
  }

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  let expectedRhombuses = 0;
  const maxK = Math.min(rCount, cCount);
  for (let k = 1; k <= maxK; k++) {
    expectedRhombuses += (rCount - k + 1) * (cCount - k + 1);
  }

  const validation = validatePuzzleGeometry(svgData, 'rhombuses', expectedRhombuses);
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'rhombus-lattice',
    metadata: { rows: rCount, cols: cCount },
  };
}

/**
 * Procedurally generates a square or rectangular grid crossed by diagonals.
 * Creates an intricate composite geometry of triangles, squares, and rectangles.
 */
export function generateProceduralDiagonalGrid(
  size = 2,
  includeBothDiagonals = true,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const s = Math.max(1, Math.min(3, Math.round(size)));
  const segments: LineSegment[] = [];

  const cell = 80;
  const startX = Math.round((width - s * cell) / 2);
  const startY = Math.round((height - s * cell) / 2);

  // Outer grid lines
  for (let r = 0; r <= s; r++) {
    const y = startY + r * cell;
    segments.push({
      x1: startX,
      y1: y,
      x2: startX + s * cell,
      y2: y,
    });
  }
  for (let c = 0; c <= s; c++) {
    const x = startX + c * cell;
    segments.push({
      x1: x,
      y1: startY,
      x2: x,
      y2: startY + s * cell,
    });
  }

  // Diagonals inside cells
  for (let r = 0; r < s; r++) {
    for (let c = 0; c < s; c++) {
      const x0 = startX + c * cell;
      const y0 = startY + r * cell;
      const x1 = x0 + cell;
      const y1 = y0 + cell;

      // Top-left to bottom-right diagonal
      segments.push({
        x1: x0,
        y1: y0,
        x2: x1,
        y2: y1,
      });

      if (includeBothDiagonals) {
        // Top-right to bottom-left diagonal
        segments.push({
          x1: x1,
          y1: y0,
          x2: x0,
          y2: y1,
        });
      }
    }
  }

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const validation = validatePuzzleGeometry(svgData, 'triangles');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'diagonal-grid',
    metadata: { order: s },
  };
}

/**
 * Procedurally generates a Triangle with Dual Corner Rays:
 * Rays shooting from apex A to base BC AND from bottom-left corner B to side AC!
 * An iconic, rich geometric puzzle forming large numbers of nested triangles.
 */
export function generateProceduralDualRayTriangle(
  apexRays = 1,
  baseRays = 1,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const m = Math.max(1, Math.min(3, Math.round(apexRays)));
  const n = Math.max(1, Math.min(3, Math.round(baseRays)));
  const segments: LineSegment[] = [];

  const A = { x: width / 2, y: 35 };
  const B = { x: 45, y: height - 35 };
  const C = { x: width - 45, y: height - 35 };

  // Outer boundary of triangle ABC
  segments.push({ x1: A.x, y1: A.y, x2: B.x, y2: B.y });
  segments.push({ x1: B.x, y1: B.y, x2: C.x, y2: C.y });
  segments.push({ x1: C.x, y1: C.y, x2: A.x, y2: A.y });

  // Rays from apex A to base BC
  for (let i = 1; i <= m; i++) {
    const t = i / (m + 1);
    const targetX = Math.round(B.x + t * (C.x - B.x));
    const targetY = Math.round(B.y + t * (C.y - B.y));
    segments.push({
      x1: Math.round(A.x),
      y1: Math.round(A.y),
      x2: targetX,
      y2: targetY,
    });
  }

  // Rays from vertex B to opposite side AC
  for (let j = 1; j <= n; j++) {
    const t = j / (n + 1);
    const targetX = Math.round(A.x + t * (C.x - A.x));
    const targetY = Math.round(A.y + t * (C.y - A.y));
    segments.push({
      x1: Math.round(B.x),
      y1: Math.round(B.y),
      x2: targetX,
      y2: targetY,
    });
  }

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const validation = validatePuzzleGeometry(svgData, 'triangles');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'triangle-dual-rays',
    metadata: { intervals: m, levels: n },
  };
}

/**
 * Procedurally generates a Square with Diagonals and Mid-Axis Cross (+ and X).
 * Produces 16 right triangles, 5 squares, and 4 rectangles.
 */
export function generateProceduralSquareDiagonalsAndCross(
  size = 200,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const s = Math.min(220, Math.max(160, size));
  const x0 = Math.round((width - s) / 2);
  const y0 = Math.round((height - s) / 2);
  const midX = Math.round(x0 + s / 2);
  const midY = Math.round(y0 + s / 2);

  const segments: LineSegment[] = [
    // Outer square
    { x1: x0, y1: y0, x2: x0 + s, y2: y0 },
    { x1: x0 + s, y1: y0, x2: x0 + s, y2: y0 + s },
    { x1: x0 + s, y1: y0 + s, x2: x0, y2: y0 + s },
    { x1: x0, y1: y0 + s, x2: x0, y2: y0 },
    // Horizontal and vertical midline cross
    { x1: x0, y1: midY, x2: x0 + s, y2: midY },
    { x1: midX, y1: y0, x2: midX, y2: y0 + s },
    // Full corner-to-corner diagonals
    { x1: x0, y1: y0, x2: x0 + s, y2: y0 + s },
    { x1: x0 + s, y1: y0, x2: x0, y2: y0 + s },
  ];

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const validation = validatePuzzleGeometry(svgData, 'triangles');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'square-diagonals',
    metadata: { order: 2 },
  };
}

/**
 * Procedurally generates a Concentric Diamond-in-Square pattern.
 * Outer square -> Midpoint rotated diamond -> Inner square -> Bisectors.
 * Tests detection of rotated squares, non-square rectangles, and right triangles.
 */
export function generateProceduralNestedDiamondSquare(
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const size = 210;
  const x0 = Math.round((width - size) / 2);
  const y0 = Math.round((height - size) / 2);
  const midX = Math.round(x0 + size / 2);
  const midY = Math.round(y0 + size / 2);

  const segments: LineSegment[] = [
    // Outer square
    { x1: x0, y1: y0, x2: x0 + size, y2: y0 },
    { x1: x0 + size, y1: y0, x2: x0 + size, y2: y0 + size },
    { x1: x0 + size, y1: y0 + size, x2: x0, y2: y0 + size },
    { x1: x0, y1: y0 + size, x2: x0, y2: y0 },
    // Rotated diamond connecting outer midpoints
    { x1: midX, y1: y0, x2: x0 + size, y2: midY },
    { x1: x0 + size, y1: midY, x2: midX, y2: y0 + size },
    { x1: midX, y1: y0 + size, x2: x0, y2: midY },
    { x1: x0, y1: midY, x2: midX, y2: y0 },
    // Horizontal and vertical bisectors
    { x1: x0, y1: midY, x2: x0 + size, y2: midY },
    { x1: midX, y1: y0, x2: midX, y2: y0 + size },
  ];

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const validation = validatePuzzleGeometry(svgData, 'squares');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'nested-diamonds',
    metadata: { order: 2 },
  };
}

/**
 * Procedurally generates an A-frame Truss Triangle with zigzag cross-bracing.
 */
export function generateProceduralTrussTriangle(
  levels = 2,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const segments: LineSegment[] = [];
  const A = { x: width / 2, y: 35 };
  const B = { x: 40, y: height - 35 };
  const C = { x: width - 40, y: height - 35 };

  // Main triangle
  segments.push({ x1: A.x, y1: A.y, x2: B.x, y2: B.y });
  segments.push({ x1: B.x, y1: B.y, x2: C.x, y2: C.y });
  segments.push({ x1: C.x, y1: C.y, x2: A.x, y2: A.y });

  // Tier levels
  const leftPoints = [A];
  const rightPoints = [A];

  for (let l = 1; l <= levels; l++) {
    const t = l / levels;
    const pL = {
      x: Math.round(A.x + t * (B.x - A.x)),
      y: Math.round(A.y + t * (B.y - A.y)),
    };
    const pR = {
      x: Math.round(A.x + t * (C.x - A.x)),
      y: Math.round(A.y + t * (C.y - A.y)),
    };
    leftPoints.push(pL);
    rightPoints.push(pR);

    // Horizontal tie
    segments.push({ x1: pL.x, y1: pL.y, x2: pR.x, y2: pR.y });
  }

  // Cross diagonals between successive tiers
  for (let l = 1; l <= levels; l++) {
    segments.push({
      x1: leftPoints[l - 1].x,
      y1: leftPoints[l - 1].y,
      x2: rightPoints[l].x,
      y2: rightPoints[l].y,
    });
    segments.push({
      x1: rightPoints[l - 1].x,
      y1: rightPoints[l - 1].y,
      x2: leftPoints[l].x,
      y2: leftPoints[l].y,
    });
  }

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const validation = validatePuzzleGeometry(svgData, 'triangles');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'triangle-truss',
    metadata: { levels },
  };
}

/**
 * Procedurally generates a 6-pointed Star Polygon (Star of David / Hexagram).
 * 2 Interlocking equilateral triangles creating 8 triangles and 3 rhombuses.
 */
export function generateProceduralStarPolygon(
  radius = 100,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const cx = width / 2;
  const cy = height / 2;
  const r = radius;

  const p1 = { x: Math.round(cx), y: Math.round(cy - r) };
  const p2 = { x: Math.round(cx + r * Math.cos(Math.PI / 6)), y: Math.round(cy + r * Math.sin(Math.PI / 6)) };
  const p3 = { x: Math.round(cx - r * Math.cos(Math.PI / 6)), y: Math.round(cy + r * Math.sin(Math.PI / 6)) };

  const q1 = { x: Math.round(cx), y: Math.round(cy + r) };
  const q2 = { x: Math.round(cx + r * Math.cos(Math.PI / 6)), y: Math.round(cy - r * Math.sin(Math.PI / 6)) };
  const q3 = { x: Math.round(cx - r * Math.cos(Math.PI / 6)), y: Math.round(cy - r * Math.sin(Math.PI / 6)) };

  const segments: LineSegment[] = [
    { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y },
    { x1: p2.x, y1: p2.y, x2: p3.x, y2: p3.y },
    { x1: p3.x, y1: p3.y, x2: p1.x, y2: p1.y },
    { x1: q1.x, y1: q1.y, x2: q2.x, y2: q2.y },
    { x1: q2.x, y1: q2.y, x2: q3.x, y2: q3.y },
    { x1: q3.x, y1: q3.y, x2: q1.x, y2: q1.y },
  ];

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const validation = validatePuzzleGeometry(svgData, 'triangles');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'star-polygon',
    metadata: { order: 6 },
  };
}

/**
 * Procedurally generates a Staggered Chevron Parallelogram Grid.
 */
export function generateProceduralChevronParallelograms(
  rows = 2,
  cols = 3,
  slant = 35,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const rCount = Math.max(1, Math.min(3, rows));
  const cCount = Math.max(1, Math.min(4, cols));
  const cellW = 65;
  const cellH = 60;
  const startX = Math.round((width - (cCount * cellW + rCount * slant)) / 2);
  const startY = Math.round((height - rCount * cellH) / 2);
  const segments: LineSegment[] = [];

  for (let r = 0; r <= rCount; r++) {
    const y = startY + r * cellH;
    const shift = r * slant;
    segments.push({
      x1: startX + shift,
      y1: y,
      x2: startX + shift + cCount * cellW,
      y2: y,
    });
  }

  for (let c = 0; c <= cCount; c++) {
    const x = startX + c * cellW;
    segments.push({
      x1: x,
      y1: startY,
      x2: x + rCount * slant,
      y2: startY + rCount * cellH,
    });
  }

  const svgData: SVGGeometryData = {
    viewBoxWidth: width,
    viewBoxHeight: height,
    segments,
  };

  const validation = validatePuzzleGeometry(svgData, 'parallelograms');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'parallelogram-chevron',
    metadata: { rows: rCount, cols: cCount },
  };
}

/**
 * Procedurally generates an Upward Stepped Staircase Grid.
 * Column c has height c + 1 for c = 0..steps-1.
 * Non-standard shape counting for squares and rectangles.
 */
export function generateProceduralStaircaseGrid(
  steps = 3,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const n = Math.max(2, Math.min(4, Math.round(steps)));
  const size = Math.floor(180 / n);
  const totalW = n * size;
  const totalH = n * size;
  const x0 = Math.round((width - totalW) / 2);
  const baseY = Math.round((height + totalH) / 2);

  const segments: LineSegment[] = [];

  // Base horizontal line
  segments.push({ x1: x0, y1: baseY, x2: x0 + totalW, y2: baseY });

  // Tops of each column step
  for (let c = 0; c < n; c++) {
    const colHeight = c + 1;
    const topY = baseY - colHeight * size;
    segments.push({ x1: x0 + c * size, y1: topY, x2: x0 + (c + 1) * size, y2: topY });
  }

  // Vertical column dividers & outer risers
  for (let c = 0; c <= n; c++) {
    const leftHeight = c === 0 ? 0 : c;
    const rightHeight = c === n ? 0 : c + 1;
    const maxHeight = Math.max(leftHeight, rightHeight);
    segments.push({ x1: x0 + c * size, y1: baseY - maxHeight * size, x2: x0 + c * size, y2: baseY });
  }

  // Internal horizontal grid lines
  for (let h = 1; h < n; h++) {
    const y = baseY - h * size;
    const startCol = h - 1;
    segments.push({ x1: x0 + startCol * size, y1: y, x2: x0 + n * size, y2: y });
  }

  const svgData: SVGGeometryData = { viewBoxWidth: width, viewBoxHeight: height, segments };
  const validation = validatePuzzleGeometry(svgData, 'rectangles');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'staircase-grid',
    metadata: { steps: n },
  };
}

/**
 * Procedurally generates a Plus / Cross-shaped Grid.
 * Central square unit flanked by 4 perimeter arm blocks.
 */
export function generateProceduralCrossGrid(
  armLength = 1,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const arm = Math.max(1, Math.min(2, Math.round(armLength)));
  const s = arm === 1 ? 55 : 38;
  const cx = Math.round(width / 2);
  const cy = Math.round(height / 2);
  const x0 = cx - (arm + 0.5) * s;
  const y0 = cy - (arm + 0.5) * s;
  const totalSpan = (2 * arm + 1) * s;

  const segments: LineSegment[] = [];

  // Top arm
  segments.push({ x1: x0 + arm * s, y1: y0, x2: x0 + (arm + 1) * s, y2: y0 });
  segments.push({ x1: x0 + arm * s, y1: y0, x2: x0 + arm * s, y2: y0 + arm * s });
  segments.push({ x1: x0 + (arm + 1) * s, y1: y0, x2: x0 + (arm + 1) * s, y2: y0 + arm * s });

  // Main horizontal bar across all columns
  for (let r = 0; r <= 1; r++) {
    const y = y0 + (arm + r) * s;
    segments.push({ x1: x0, y1: y, x2: x0 + totalSpan, y2: y });
  }

  // Bottom arm
  const bY = y0 + (arm + 1) * s;
  segments.push({ x1: x0 + arm * s, y1: y0 + totalSpan, x2: x0 + (arm + 1) * s, y2: y0 + totalSpan });
  segments.push({ x1: x0 + arm * s, y1: bY, x2: x0 + arm * s, y2: y0 + totalSpan });
  segments.push({ x1: x0 + (arm + 1) * s, y1: bY, x2: x0 + (arm + 1) * s, y2: y0 + totalSpan });

  // Left & right outer ends
  segments.push({ x1: x0, y1: y0 + arm * s, x2: x0, y2: y0 + (arm + 1) * s });
  segments.push({ x1: x0 + totalSpan, y1: y0 + arm * s, x2: x0 + totalSpan, y2: y0 + (arm + 1) * s });

  // Internal cross dividers
  segments.push({ x1: x0 + arm * s, y1: y0 + arm * s, x2: x0 + arm * s, y2: y0 + (arm + 1) * s });
  segments.push({ x1: x0 + (arm + 1) * s, y1: y0 + arm * s, x2: x0 + (arm + 1) * s, y2: y0 + (arm + 1) * s });

  const svgData: SVGGeometryData = { viewBoxWidth: width, viewBoxHeight: height, segments };
  const validation = validatePuzzleGeometry(svgData, 'squares');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'cross-grid',
    metadata: { armLength: arm },
  };
}

/**
 * Procedurally generates an L-Shaped Composite Grid.
 * An L-shaped polygon divided into square and rectangular units.
 */
export function generateProceduralLShapedGrid(
  vertH = 2,
  vertW = 1,
  horizW = 2,
  horizH = 1,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const s = 48;
  const totalW = (vertW + horizW) * s;
  const totalH = (vertH + horizH) * s;
  const x0 = Math.round((width - totalW) / 2);
  const y0 = Math.round((height - totalH) / 2);
  const junctionY = vertH * s;
  const junctionX = vertW * s;

  const segments: LineSegment[] = [];

  // Vertical arm horizontal dividers
  for (let r = 0; r <= vertH; r++) {
    segments.push({ x1: x0, y1: y0 + r * s, x2: x0 + junctionX, y2: y0 + r * s });
  }
  // Horizontal arm horizontal dividers
  for (let r = 1; r <= horizH; r++) {
    segments.push({ x1: x0, y1: y0 + junctionY + r * s, x2: x0 + totalW, y2: y0 + junctionY + r * s });
  }
  // Vertical lines in vertical arm (full height)
  for (let c = 0; c <= vertW; c++) {
    segments.push({ x1: x0 + c * s, y1: y0, x2: x0 + c * s, y2: y0 + totalH });
  }
  // Vertical lines in horizontal arm (bottom row only)
  for (let c = vertW + 1; c <= vertW + horizW; c++) {
    segments.push({ x1: x0 + c * s, y1: y0 + junctionY, x2: x0 + c * s, y2: y0 + totalH });
  }
  // Top of horizontal arm extension
  segments.push({ x1: x0 + junctionX, y1: y0 + junctionY, x2: x0 + totalW, y2: y0 + junctionY });

  const svgData: SVGGeometryData = { viewBoxWidth: width, viewBoxHeight: height, segments };
  const validation = validatePuzzleGeometry(svgData, 'rectangles');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'l-shaped-grid',
    metadata: { vertH, vertW, horizW, horizH },
  };
}

/**
 * Procedurally generates Concentric Square Frames with Bisecting Crosshairs.
 * Boxes within boxes intersected by full horizontal and vertical crossbars.
 */
export function generateProceduralConcentricSquareCrossbars(
  outerSize = 190,
  innerSize = 100,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const cx = Math.round(width / 2);
  const cy = Math.round(height / 2);
  const s1 = outerSize;
  const s2 = innerSize;

  const segments: LineSegment[] = [
    // Outer square
    { x1: cx - s1 / 2, y1: cy - s1 / 2, x2: cx + s1 / 2, y2: cy - s1 / 2 },
    { x1: cx + s1 / 2, y1: cy - s1 / 2, x2: cx + s1 / 2, y2: cy + s1 / 2 },
    { x1: cx + s1 / 2, y1: cy + s1 / 2, x2: cx - s1 / 2, y2: cy + s1 / 2 },
    { x1: cx - s1 / 2, y1: cy + s1 / 2, x2: cx - s1 / 2, y2: cy - s1 / 2 },
    // Inner square
    { x1: cx - s2 / 2, y1: cy - s2 / 2, x2: cx + s2 / 2, y2: cy - s2 / 2 },
    { x1: cx + s2 / 2, y1: cy - s2 / 2, x2: cx + s2 / 2, y2: cy + s2 / 2 },
    { x1: cx + s2 / 2, y1: cy + s2 / 2, x2: cx - s2 / 2, y2: cy + s2 / 2 },
    { x1: cx - s2 / 2, y1: cy + s2 / 2, x2: cx - s2 / 2, y2: cy - s2 / 2 },
    // Full bisecting crossbars
    { x1: cx, y1: cy - s1 / 2, x2: cx, y2: cy + s1 / 2 },
    { x1: cx - s1 / 2, y1: cy, x2: cx + s1 / 2, y2: cy },
  ];

  const svgData: SVGGeometryData = { viewBoxWidth: width, viewBoxHeight: height, segments };
  const validation = validatePuzzleGeometry(svgData, 'squares');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'concentric-crossbars',
    metadata: { outerSize, innerSize },
  };
}

/**
 * Procedurally generates an Isometric Rhombus Cluster (Hexagonal 3D Cube).
 * When subdivide is true: each face is subdivided into 4 rhombuses (15 rhombuses, 27 parallelograms).
 * When false: 3 rhombuses meeting at the center.
 */
export function generateProceduralIsometricRhombusCluster(
  subdivide = false,
  radius = 110,
  width = DEFAULT_VIEWBOX_WIDTH,
  height = DEFAULT_VIEWBOX_HEIGHT
): ProceduralPuzzleData {
  const cx = Math.round(width / 2);
  const cy = Math.round(height / 2);
  const O = { x: cx, y: cy };
  const V: { x: number; y: number }[] = [];

  for (let k = 0; k < 6; k++) {
    const angle = (k * 60 - 90) * (Math.PI / 180);
    V.push({
      x: Math.round(cx + radius * Math.cos(angle)),
      y: Math.round(cy + radius * Math.sin(angle)),
    });
  }

  const segments: LineSegment[] = [];

  // Outer perimeter of hexagon
  for (let k = 0; k < 6; k++) {
    segments.push({ x1: V[k].x, y1: V[k].y, x2: V[(k + 1) % 6].x, y2: V[(k + 1) % 6].y });
  }

  // 3 central spokes to alternate vertices
  segments.push({ x1: O.x, y1: O.y, x2: V[0].x, y2: V[0].y });
  segments.push({ x1: O.x, y1: O.y, x2: V[2].x, y2: V[2].y });
  segments.push({ x1: O.x, y1: O.y, x2: V[4].x, y2: V[4].y });

  if (subdivide) {
    const midO_V0 = { x: Math.round((O.x + V[0].x) / 2), y: Math.round((O.y + V[0].y) / 2) };
    const midO_V2 = { x: Math.round((O.x + V[2].x) / 2), y: Math.round((O.y + V[2].y) / 2) };
    const midO_V4 = { x: Math.round((O.x + V[4].x) / 2), y: Math.round((O.y + V[4].y) / 2) };

    const midV0_V1 = { x: Math.round((V[0].x + V[1].x) / 2), y: Math.round((V[0].y + V[1].y) / 2) };
    const midV1_V2 = { x: Math.round((V[1].x + V[2].x) / 2), y: Math.round((V[1].y + V[2].y) / 2) };
    const midV2_V3 = { x: Math.round((V[2].x + V[3].x) / 2), y: Math.round((V[2].y + V[3].y) / 2) };
    const midV3_V4 = { x: Math.round((V[3].x + V[4].x) / 2), y: Math.round((V[3].y + V[4].y) / 2) };
    const midV4_V5 = { x: Math.round((V[4].x + V[5].x) / 2), y: Math.round((V[4].y + V[5].y) / 2) };
    const midV5_V0 = { x: Math.round((V[5].x + V[0].x) / 2), y: Math.round((V[5].y + V[0].y) / 2) };

    // Top-right face cross
    segments.push({ x1: midO_V0.x, y1: midO_V0.y, x2: midV1_V2.x, y2: midV1_V2.y });
    segments.push({ x1: midO_V2.x, y1: midO_V2.y, x2: midV0_V1.x, y2: midV0_V1.y });

    // Bottom face cross
    segments.push({ x1: midO_V2.x, y1: midO_V2.y, x2: midV3_V4.x, y2: midV3_V4.y });
    segments.push({ x1: midO_V4.x, y1: midO_V4.y, x2: midV2_V3.x, y2: midV2_V3.y });

    // Top-left face cross
    segments.push({ x1: midO_V4.x, y1: midO_V4.y, x2: midV5_V0.x, y2: midV5_V0.y });
    segments.push({ x1: midO_V0.x, y1: midO_V0.y, x2: midV4_V5.x, y2: midV4_V5.y });
  }

  const svgData: SVGGeometryData = { viewBoxWidth: width, viewBoxHeight: height, segments };
  const validation = validatePuzzleGeometry(svgData, 'rhombuses');
  const atomic = splitSegmentsAtIntersections(segments);
  const vertices = extractVertices(atomic);

  return {
    svgData,
    vertices,
    counts: validation.detectedCounts,
    validation,
    generatorType: 'isometric-rhombus',
    metadata: { subdivide, radius },
  };
}

// ============================================================================
// 2. COMPLETE QUESTION FACTORY (WITH PRE-VALIDATION GUARANTEE)
// ============================================================================

/**
 * Standard prompts for each shape category (mathematically sound)
 */
const TARGET_PROMPTS: Record<ShapeCategory, string[]> = {
  triangles: [
    'Count all the triangles.',
    'How many triangles can you find in this diagram?',
    'Count every triangle of all sizes in this figure.',
  ],
  squares: [
    'Count all the squares.',
    'How many squares are present in this figure?',
    'Count every square of all sizes.',
  ],
  rectangles: [
    'Count all the rectangles.',
    'How many rectangles (including all squares) can you find?',
    'Count all the rectangles of all dimensions in this figure.',
  ],
  parallelograms: [
    'Count all the parallelograms.',
    'How many parallelograms (including all rhombuses & rectangles) are present?',
    'Count every parallelogram in this figure.',
  ],
  rhombuses: [
    'Count all the rhombuses.',
    'How many rhombuses are present in this lattice?',
    'Count all equilateral rhombuses in this pattern.',
  ],
};

/**
 * Generates an educational step-by-step mathematical explanation.
 */
function buildExplanation(
  targetShape: ShapeCategory,
  correctCount: number,
  puzzle: ProceduralPuzzleData
): string {
  const { generatorType, metadata } = puzzle;

  switch (generatorType) {
    case 'triangular-grid': {
      const n = metadata.order || 1;
      return `For an equilateral triangular lattice of order n = ${n}, total triangles = floor(n(n+2)(2n+1)/8) = ${correctCount}. This includes both upward-pointing and downward-pointing triangles of various sizes.`;
    }
    case 'triangle-rays': {
      const m = metadata.intervals || 1;
      const l = metadata.levels || 1;
      return `With ${m} base intervals and ${l} horizontal levels, each level contains ${
        (m * (m + 1)) / 2
      } triangles formed by pairs of apex rays. Across all ${l} levels, total triangles = ${l} × ${
        (m * (m + 1)) / 2
      } = ${correctCount}.`;
    }
    case 'triangle-dual-rays': {
      return `Dual corner rays generate combinations of intersecting triangular regions. Validated by planar edge support: exactly ${correctCount} triangles exist.`;
    }
    case 'triangle-truss': {
      return `In this A-frame truss with horizontal chords and alternating cross-struts, small and composite triangles combine across multiple bays. Exactly ${correctCount} triangles are confirmed.`;
    }
    case 'star-polygon': {
      return `In the 6-pointed star (hexagram), 6 outer triangles around the perimeter plus 2 large central equilateral triangles yield exactly ${correctCount} triangles.`;
    }
    case 'square-diagonals': {
      if (targetShape === 'triangles') {
        return `A square with horizontal & vertical midlines and both diagonals produces 8 single-cell right triangles, 4 medium triangles combining two halves, and 4 large quadrant triangles = 16 triangles.`;
      } else if (targetShape === 'squares') {
        return `A square with midlines and diagonals contains 4 small unit squares plus 1 outer square = 5 squares total.`;
      } else {
        return `All squares are rectangles! The 5 squares plus 4 double-cell rectangles yield exactly ${correctCount} rectangles.`;
      }
    }
    case 'nested-diamonds': {
      return `Nested rotated diamond-in-square layers create concentric squares and corner right triangles. Verified count: exactly ${correctCount} ${targetShape}.`;
    }
    case 'rectangle-grid': {
      const r = metadata.rows || 1;
      const c = metadata.cols || 1;
      if (targetShape === 'squares') {
        return `In a ${r}×${c} grid, squares of size k×k exist for k = 1..min(${r}, ${c}). Summing (rows - k + 1)(cols - k + 1) yields exactly ${correctCount} squares.`;
      } else if (targetShape === 'rectangles') {
        return `By mathematical definition, every square is a rectangle! In this ${r}×${c} grid, total rectangles = C(${r}+1, 2) × C(${c}+1, 2) = [${r}(${r}+1)/2] × [${c}(${c}+1)/2] = ${correctCount} rectangles (counting all squares and non-square rectangles).`;
      } else {
        return `In a ${r}×${c} grid, opposite sides are parallel, so all ${correctCount} rectangles are also parallelograms.`;
      }
    }
    case 'staircase-grid': {
      return `In this stepped staircase grid, counting unit cells and composite shapes across all column heights yields exactly ${correctCount} ${targetShape}. (Squares are also counted as rectangles!)`;
    }
    case 'cross-grid': {
      return `In this cross/plus-shaped grid, the central block and perimeter arms combine into single and multi-cell shapes: exactly ${correctCount} ${targetShape} exist.`;
    }
    case 'l-shaped-grid': {
      return `In this L-shaped composite figure, shapes along the vertical arm, horizontal arm, and their overlap junction total exactly ${correctCount} ${targetShape}.`;
    }
    case 'concentric-crossbars': {
      return `In these concentric square frames with bisecting crossbars, inner and outer quadrants combine into nested squares and rectangles: exactly ${correctCount} ${targetShape}.`;
    }
    case 'isometric-rhombus': {
      return `In this isometric 3D cube projection, each visible face is an equilateral rhombus. Because every rhombus is a parallelogram, they all count: exactly ${correctCount} ${targetShape}.`;
    }
    case 'parallelogram-grid':
    case 'parallelogram-chevron': {
      const r = metadata.rows || 1;
      const c = metadata.cols || 1;
      return `In a slanted grid with ${r} rows and ${c} columns, choosing any 2 horizontal lines and any 2 slanted lines forms a parallelogram: C(${
        r + 1
      }, 2) × C(${c + 1}, 2) = ${correctCount}. Every rhombus is also a parallelogram!`;
    }
    case 'rhombus-lattice': {
      const r = metadata.rows || 1;
      const c = metadata.cols || 1;
      if (targetShape === 'parallelograms') {
        return `Every rhombus is a parallelogram! Total parallelograms in this ${r}×${c} lattice = C(${r}+1, 2) × C(${c}+1, 2) = ${correctCount}.`;
      } else {
        return `In an equilateral rhombus lattice with 60° angles, rhombuses are formed by k×k sub-diamonds of equal side length. Exactly ${correctCount} rhombuses exist.`;
      }
    }
    case 'diagonal-grid': {
      return `In this diagonal-crossed grid, triangular quadrants and quadrilaterals combine across cell boundaries. Exactly ${correctCount} ${targetShape} exist.`;
    }
    default:
      return `Mathematically validated by planar graph segment support: exactly ${correctCount} ${targetShape} exist in this geometry.`;
  }
}

/**
 * Builds a strategic geometric hint.
 */
function buildHint(targetShape: ShapeCategory, puzzle: ProceduralPuzzleData): string {
  switch (targetShape) {
    case 'triangles':
      return 'Remember to count composite triangles of larger sizes in addition to the smallest unit triangles!';
    case 'squares':
      return 'Check for multi-cell squares (2×2, 3×3) that enclose the smaller unit squares.';
    case 'rectangles':
      return 'Remember that every square is also a rectangle! Total rectangles = all squares + all non-square rectangles.';
    case 'parallelograms':
      return 'Remember that every rhombus, rectangle, and square is also a parallelogram (both pairs of opposite sides are parallel)!';
    case 'rhombuses':
      return 'A rhombus requires all 4 sides to be equal in length. Count unit diamonds as well as larger composite diamonds!';
    default:
      return 'Look for larger composite shapes built from combinations of smaller shapes.';
  }
}

/**
 * Procedurally generates a fully validated question ready for the game across all 10 Astra levels.
 * Guarantees that every generated question has passed computational geometry validation.
 */
export function generateProceduralQuestion(
  options: ProceduralQuestionOptions = {}
): GeometryQuestion {
  const level = (options.level ?? 1) as DifficultyLevel;

  // Diverse shape selection across all levels
  let targetShape: ShapeCategory = options.targetShape ?? 'triangles';

  if (!options.targetShape) {
    const shapePool: ShapeCategory[] = ['triangles', 'squares', 'rectangles', 'parallelograms', 'rhombuses'];
    targetShape = shapePool[Math.floor(Math.random() * shapePool.length)];
  }

  // Generate procedural puzzle data based on chosen shape and difficulty tier
  let puzzle: ProceduralPuzzleData;

  switch (targetShape) {
    case 'triangles': {
      const varietyRoll = Math.random();
      if (level >= 6 && varietyRoll < 0.25) {
        const apex = level >= 8 ? 2 : 1;
        const base = level >= 8 ? 2 : 1;
        puzzle = generateProceduralDualRayTriangle(apex, base);
      } else if (level >= 4 && varietyRoll < 0.45) {
        puzzle = generateProceduralSquareDiagonalsAndCross();
      } else if (level >= 5 && varietyRoll < 0.65) {
        const lvls = level >= 8 ? 3 : 2;
        puzzle = generateProceduralTrussTriangle(lvls);
      } else if (varietyRoll < 0.8) {
        puzzle = generateProceduralStarPolygon();
      } else if (varietyRoll < 0.9) {
        const order = Math.min(4, 1 + Math.floor(level / 3));
        puzzle = generateProceduralTriangularGrid(order);
      } else {
        const intervals = Math.min(5, 1 + Math.floor(level / 2));
        const lvls = Math.min(3, 1 + Math.floor(level / 3));
        puzzle = generateProceduralTriangleRays(intervals, lvls);
      }
      break;
    }
    case 'squares': {
      const roll = Math.random();
      if (level >= 4 && roll < 0.20) {
        puzzle = generateProceduralStaircaseGrid(level >= 7 ? 4 : 3);
      } else if (level >= 3 && roll < 0.38) {
        puzzle = generateProceduralCrossGrid(level >= 6 ? 2 : 1);
      } else if (level >= 3 && roll < 0.55) {
        puzzle = generateProceduralConcentricSquareCrossbars();
      } else if (level >= 5 && roll < 0.72) {
        puzzle = generateProceduralNestedDiamondSquare();
      } else if (roll < 0.85) {
        puzzle = generateProceduralSquareDiagonalsAndCross();
      } else {
        // Diverse dimensions of rectangular grids with square cells (1x1, 1x2, 1x3, 2x2, 2x3, 2x4, 3x3, 3x4, 4x4, 4x5, 5x5)
        const squareGridPairs = [
          [1, 1], [1, 2], [1, 3], [1, 4],
          [2, 2], [2, 3], [2, 4], [2, 5],
          [3, 3], [3, 4], [3, 5],
          [4, 4], [4, 5], [5, 5]
        ];
        const maxDim = level <= 2 ? 3 : level <= 5 ? 4 : 5;
        const validPairs = squareGridPairs.filter(([r, c]) => Math.max(r, c) <= maxDim);
        const pair = validPairs[Math.floor(Math.random() * validPairs.length)];
        puzzle = generateProceduralRectangularGrid(pair[0], pair[1], true);
      }
      break;
    }
    case 'rectangles': {
      const roll = Math.random();
      if (level >= 4 && roll < 0.18) {
        puzzle = generateProceduralStaircaseGrid(level >= 7 ? 4 : 3);
      } else if (level >= 3 && roll < 0.35) {
        puzzle = generateProceduralLShapedGrid(2, 1, level >= 6 ? 3 : 2, 1);
      } else if (level >= 4 && roll < 0.50) {
        puzzle = generateProceduralConcentricSquareCrossbars();
      } else if (level >= 3 && roll < 0.65) {
        puzzle = generateProceduralCrossGrid(1);
      } else if (roll < 0.75) {
        puzzle = generateProceduralSquareDiagonalsAndCross();
      } else {
        // Rich diversity of rectangular grid dimensions:
        // (1x2, 1x3, 1x4, 1x5, 2x2, 2x3, 2x4, 2x5, 3x2, 3x3, 3x4, 3x5, 4x2, 4x3, 4x4, 4x5, 5x2, 5x3, 5x4, 5x5)
        const dimPairs = [
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 2], [2, 3], [2, 4], [2, 5],
          [3, 2], [3, 3], [3, 4], [3, 5],
          [4, 2], [4, 3], [4, 4], [4, 5],
          [5, 2], [5, 3], [5, 4], [5, 5]
        ];
        const maxDim = level <= 2 ? 3 : level <= 5 ? 4 : 5;
        const validPairs = dimPairs.filter(([r, c]) => Math.max(r, c) <= maxDim);
        const pair = validPairs[Math.floor(Math.random() * validPairs.length)];
        const isSquareCell = Math.random() > 0.4; // Mix of square-celled and non-square celled grids
        puzzle = generateProceduralRectangularGrid(pair[0], pair[1], isSquareCell);
      }
      break;
    }
    case 'parallelograms': {
      const roll = Math.random();
      if (level >= 4 && roll < 0.25) {
        puzzle = generateProceduralIsometricRhombusCluster(level >= 7);
      } else if (level >= 4 && roll < 0.50) {
        puzzle = generateProceduralChevronParallelograms(
          Math.min(3, 1 + Math.floor(level / 4)),
          Math.min(4, 2 + Math.floor(level / 3))
        );
      } else if (roll < 0.75) {
        const rows = Math.min(4, 1 + Math.floor(level / 3));
        const cols = Math.min(4, 2 + Math.floor(level / 3));
        puzzle = generateProceduralRhombusLattice(rows, cols);
      } else {
        const slantedDims = [
          [1, 2], [1, 3], [2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [4, 4], [5, 3]
        ];
        const maxDim = level <= 3 ? 3 : level <= 6 ? 4 : 5;
        const validDims = slantedDims.filter(([r, c]) => Math.max(r, c) <= maxDim);
        const pair = validDims[Math.floor(Math.random() * validDims.length)];
        puzzle = generateProceduralParallelogramGrid(pair[0], pair[1], 35);
      }
      break;
    }
    case 'rhombuses': {
      const roll = Math.random();
      if (level >= 3 && roll < 0.35) {
        puzzle = generateProceduralIsometricRhombusCluster(level >= 6);
      } else if (roll < 0.65) {
        puzzle = generateProceduralStarPolygon();
      } else {
        const rhombusDims = [
          [1, 2], [1, 3], [1, 4], [2, 2], [2, 3], [2, 4], [3, 3], [3, 4], [4, 4]
        ];
        const maxDim = level <= 3 ? 2 : level <= 6 ? 3 : 4;
        const validDims = rhombusDims.filter(([r, c]) => Math.max(r, c) <= maxDim);
        const pair = validDims[Math.floor(Math.random() * validDims.length)];
        puzzle = generateProceduralRhombusLattice(pair[0], pair[1]);
      }
      break;
    }
    default:
      puzzle = generateProceduralTriangleRays(3, 2);
  }

  // Pre-validation assertion
  let correctCount = puzzle.counts[targetShape];

  // Fallback safety
  if (!puzzle.validation.isValid || correctCount === 0) {
    if (targetShape === 'triangles') {
      puzzle = generateProceduralSquareDiagonalsAndCross();
      correctCount = puzzle.counts.triangles;
    } else if (targetShape === 'squares') {
      puzzle = generateProceduralRectangularGrid(2, 2, true);
      correctCount = puzzle.counts.squares;
    } else if (targetShape === 'rectangles') {
      puzzle = generateProceduralRectangularGrid(2, 3, true);
      correctCount = puzzle.counts.rectangles;
    } else if (targetShape === 'parallelograms') {
      puzzle = generateProceduralParallelogramGrid(2, 2);
      correctCount = puzzle.counts.parallelograms;
    } else {
      puzzle = generateProceduralRhombusLattice(2, 2);
      correctCount = puzzle.counts.rhombuses;
    }
  }

  // Generate 4 distinct options with plausible distractors
  const optionsList = generateDistractorOptions(correctCount);

  // Randomize placement of the correct answer
  const correctIndex = optionsList.indexOf(correctCount);

  // Pick prompt
  const prompts = TARGET_PROMPTS[targetShape];
  const targetPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  const explanation = buildExplanation(targetShape, correctCount, puzzle);
  const hint = buildHint(targetShape, puzzle);

  const id = `proc-${puzzle.generatorType}-L${level}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .substring(2, 6)}`;

  return {
    id,
    level,
    targetShape,
    targetPrompt,
    svgData: puzzle.svgData,
    correctCount,
    options: optionsList,
    correctIndex,
    explanation,
    hint,
    geometryType: puzzle.generatorType,
  };
}

/**
 * Generates a batch of distinct, pre-validated procedural questions.
 */
export function generateProceduralQuestionBatch(
  count: number,
  level: DifficultyLevel = 1,
  targetShape?: ShapeCategory
): GeometryQuestion[] {
  const questions: GeometryQuestion[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < count; i++) {
    const q = generateProceduralQuestion({ level, targetShape });
    if (!seenIds.has(q.id)) {
      seenIds.add(q.id);
      questions.push(q);
    }
  }

  return questions;
}
