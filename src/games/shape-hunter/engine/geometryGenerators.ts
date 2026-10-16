import { LineSegment, SVGGeometryData } from '../types';

/**
 * Geometric SVG line generators that calculate exact coordinates and dimensions.
 */

/**
 * Generator A: Triangle with rays from apex to base, intersected by horizontal crossbars.
 */
export function generateTriangleWithRaysSVG(
  intervals: number,
  levels: number,
  width = 380,
  height = 320
): { svgData: SVGGeometryData; totalTriangles: number } {
  const segments: LineSegment[] = [];
  const apex = { x: width / 2, y: 35 };
  const baseLeft = { x: 35, y: height - 35 };
  const baseRight = { x: width - 35, y: height - 35 };

  // Coordinates of base points
  const basePoints: { x: number; y: number }[] = [];
  for (let i = 0; i <= intervals; i++) {
    const t = i / intervals;
    basePoints.push({
      x: baseLeft.x + t * (baseRight.x - baseLeft.x),
      y: baseLeft.y,
    });
  }

  // Draw rays from apex to each base point
  for (let i = 0; i <= intervals; i++) {
    segments.push({
      x1: Math.round(apex.x),
      y1: Math.round(apex.y),
      x2: Math.round(basePoints[i].x),
      y2: Math.round(basePoints[i].y),
    });
  }

  // Draw horizontal crossbars (levels)
  for (let lvl = 1; lvl <= levels; lvl++) {
    const t = lvl / levels;
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

  const totalTriangles = levels * ((intervals * (intervals + 1)) / 2);

  return {
    svgData: {
      viewBoxWidth: width,
      viewBoxHeight: height,
      segments,
    },
    totalTriangles,
  };
}

/**
 * Generator B: Equilateral triangular lattice of order n.
 */
export function generateTriangularLatticeSVG(
  n: number,
  width = 380,
  height = 340
): { svgData: SVGGeometryData; totalTriangles: number } {
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

  const totalTriangles = Math.floor((n * (n + 2) * (2 * n + 1)) / 8);

  return {
    svgData: {
      viewBoxWidth: width,
      viewBoxHeight: height,
      segments,
    },
    totalTriangles,
  };
}

/**
 * Generator C: Rectangular grid (R rows, C columns).
 */
export function generateRectangularGridSVG(
  rows: number,
  cols: number,
  isSquareGrid = false,
  width = 380,
  height = 320
): {
  svgData: SVGGeometryData;
  totalRectangles: number;
  totalSquares: number;
  exclusiveRectangles: number;
} {
  const segments: LineSegment[] = [];

  const marginX = 45;
  const marginY = 40;
  const availableW = width - 2 * marginX;
  const availableH = height - 2 * marginY;

  let cellW = availableW / cols;
  let cellH = availableH / rows;

  if (isSquareGrid) {
    const minCell = Math.min(cellW, cellH);
    cellW = minCell;
    cellH = minCell;
  }

  const startX = (width - cols * cellW) / 2;
  const startY = (height - rows * cellH) / 2;

  // Horizontal lines
  for (let r = 0; r <= rows; r++) {
    const y = startY + r * cellH;
    segments.push({
      x1: Math.round(startX),
      y1: Math.round(y),
      x2: Math.round(startX + cols * cellW),
      y2: Math.round(y),
    });
  }

  // Vertical lines
  for (let c = 0; c <= cols; c++) {
    const x = startX + c * cellW;
    segments.push({
      x1: Math.round(x),
      y1: Math.round(startY),
      x2: Math.round(x),
      y2: Math.round(startY + rows * cellH),
    });
  }

  const totalRectangles =
    ((rows * (rows + 1)) / 2) * ((cols * (cols + 1)) / 2);

  let totalSquares = 0;
  if (isSquareGrid) {
    const maxK = Math.min(rows, cols);
    for (let k = 1; k <= maxK; k++) {
      totalSquares += (rows - k + 1) * (cols - k + 1);
    }
  }

  const exclusiveRectangles = totalRectangles; // Every square is a rectangle!

  return {
    svgData: {
      viewBoxWidth: width,
      viewBoxHeight: height,
      segments,
    },
    totalRectangles,
    totalSquares,
    exclusiveRectangles,
  };
}

/**
 * Generator D: Parallelogram grid (slanted grid with angle != 90).
 */
export function generateParallelogramGridSVG(
  rows: number,
  cols: number,
  slantX = 40,
  width = 380,
  height = 320
): {
  svgData: SVGGeometryData;
  totalParallelograms: number;
} {
  const segments: LineSegment[] = [];
  const marginY = 45;
  const totalH = height - 2 * marginY;
  const rowH = totalH / rows;
  const totalW = width - 110;
  const colW = totalW / cols;
  const startY = marginY;
  const startX = 40;

  // Horizontal parallel lines
  for (let r = 0; r <= rows; r++) {
    const y = startY + r * rowH;
    const offsetX = (r / rows) * slantX;
    segments.push({
      x1: Math.round(startX + offsetX),
      y1: Math.round(y),
      x2: Math.round(startX + offsetX + cols * colW),
      y2: Math.round(y),
    });
  }

  // Slanted parallel lines
  for (let c = 0; c <= cols; c++) {
    const xTop = startX + c * colW;
    const xBot = xTop + slantX;
    segments.push({
      x1: Math.round(xTop),
      y1: Math.round(startY),
      x2: Math.round(xBot),
      y2: Math.round(startY + totalH),
    });
  }

  const totalParallelograms =
    ((rows * (rows + 1)) / 2) * ((cols * (cols + 1)) / 2);

  return {
    svgData: {
      viewBoxWidth: width,
      viewBoxHeight: height,
      segments,
    },
    totalParallelograms,
  };
}

/**
 * Generator E: Rhombus grid with equal side lengths.
 */
export function generateRhombusGridSVG(
  rows: number,
  cols: number,
  sideLen = 65,
  width = 380,
  height = 320
): {
  svgData: SVGGeometryData;
  totalRhombuses: number;
  totalParallelograms: number;
  exclusiveParallelograms: number;
} {
  const segments: LineSegment[] = [];
  const angle = (60 * Math.PI) / 180; // 60 degrees slant
  const dx = sideLen * Math.cos(angle);
  const dy = sideLen * Math.sin(angle);

  const totalH = rows * dy;
  const totalW = cols * sideLen + rows * dx;

  const startX = (width - totalW) / 2;
  const startY = (height - totalH) / 2;

  // Horizontal lines of length cols * sideLen
  for (let r = 0; r <= rows; r++) {
    const y = startY + r * dy;
    const x = startX + r * dx;
    segments.push({
      x1: Math.round(x),
      y1: Math.round(y),
      x2: Math.round(x + cols * sideLen),
      y2: Math.round(y),
    });
  }

  // Slanted lines of length rows * sideLen
  for (let c = 0; c <= cols; c++) {
    const x = startX + c * sideLen;
    segments.push({
      x1: Math.round(x),
      y1: Math.round(startY),
      x2: Math.round(x + rows * dx),
      y2: Math.round(startY + totalH),
    });
  }

  let totalRhombuses = 0;
  const maxK = Math.min(rows, cols);
  for (let k = 1; k <= maxK; k++) {
    totalRhombuses += (rows - k + 1) * (cols - k + 1);
  }

  // By mathematical definition, every rhombus is also a parallelogram!
  const totalAll = ((rows * (rows + 1)) / 2) * ((cols * (cols + 1)) / 2);

  return {
    svgData: {
      viewBoxWidth: width,
      viewBoxHeight: height,
      segments,
    },
    totalRhombuses,
    totalParallelograms: totalAll,
    exclusiveParallelograms: totalAll,
  };
}
