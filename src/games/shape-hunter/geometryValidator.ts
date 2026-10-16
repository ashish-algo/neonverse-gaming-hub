import { LineSegment, ShapeCategory, SVGGeometryData } from './types';

/**
 * NUMERICAL TOLERANCES FOR COMPUTATIONAL GEOMETRY IN SVG PIXEL COORDINATES
 * SVG line coordinates often undergo pixel grid alignment or rounding (±0.5 - 1.0px).
 * These tolerances guarantee accurate intersection detection, collinearity checking,
 * segment splitting, and shape classification without spurious artifacts.
 */
export const EPSILON = 1e-4;
export const SVG_SNAP_TOLERANCE = 1.2; // Tolerates ±1px rounding in raster/SVG coordinates
export const ANGLE_TOLERANCE = 0.04; // ~2.3 degrees tolerance for parallel/perpendicular tests
export const LENGTH_TOLERANCE_RATIO = 0.06; // 6% relative tolerance for side equality
export const MIN_POLYGON_AREA = 10.0; // Eliminates degenerate collinear slivers

export interface Point2D {
  x: number;
  y: number;
}

export interface GeometryValidationResult {
  isValid: boolean;
  detectedCounts: Record<ShapeCategory, number>;
  expectedCount?: number;
  targetShape?: ShapeCategory;
  errors: string[];
  warnings: string[];
  intersectionCount: number;
  vertexCount: number;
  atomicSegmentCount: number;
  details?: {
    triangles: Point2D[][];
    squares: Point2D[][];
    rectangles: Point2D[][];
    parallelograms: Point2D[][];
    rhombuses: Point2D[][];
  };
}

// ============================================================================
// 1. BASIC VECTOR & POINT UTILITIES
// ============================================================================

export function approxEqual(a: number, b: number, eps = EPSILON): boolean {
  return Math.abs(a - b) <= eps;
}

export function approxZero(val: number, eps = EPSILON): boolean {
  return Math.abs(val) <= eps;
}

export function pointsEqual(
  p1: Point2D,
  p2: Point2D,
  tol = SVG_SNAP_TOLERANCE
): boolean {
  return Math.abs(p1.x - p2.x) <= tol && Math.abs(p1.y - p2.y) <= tol;
}

export function pointDistance(p1: Point2D, p2: Point2D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function crossProduct(v1: Point2D, v2: Point2D): number {
  return v1.x * v2.y - v1.y * v2.x;
}

export function dotProduct(v1: Point2D, v2: Point2D): number {
  return v1.x * v2.x + v1.y * v2.y;
}

function quantize(val: number, snap = 1.0): number {
  return Math.round(val / snap) * snap;
}

export function pointKey(p: Point2D, snap = 1.0): string {
  return `${quantize(p.x, snap)},${quantize(p.y, snap)}`;
}

// ============================================================================
// 2. MATHEMATICAL INTERSECTION DETECTION & POINT-ON-SEGMENT
// ============================================================================

/**
 * Checks if a point lies on a given line segment within a numerical tolerance.
 */
export function isPointOnSegment(
  p: Point2D,
  s: LineSegment,
  tol = SVG_SNAP_TOLERANCE
): boolean {
  const minX = Math.min(s.x1, s.x2) - tol;
  const maxX = Math.max(s.x1, s.x2) + tol;
  const minY = Math.min(s.y1, s.y2) - tol;
  const maxY = Math.max(s.y1, s.y2) + tol;

  if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
    return false;
  }

  const vSeg = { x: s.x2 - s.x1, y: s.y2 - s.y1 };
  const vPt = { x: p.x - s.x1, y: p.y - s.y1 };
  const segLen = Math.sqrt(vSeg.x * vSeg.x + vSeg.y * vSeg.y);

  if (segLen < EPSILON) {
    return pointDistance(p, { x: s.x1, y: s.y1 }) <= tol;
  }

  const cross = Math.abs(crossProduct(vSeg, vPt));
  const distToLine = cross / segLen;

  return distToLine <= tol;
}

/**
 * Computes intersection between two line segments.
 * Returns intersection point if segments cross or meet, otherwise null.
 */
export function findSegmentIntersection(
  s1: LineSegment,
  s2: LineSegment,
  tol = SVG_SNAP_TOLERANCE
): Point2D | null {
  const p1: Point2D = { x: s1.x1, y: s1.y1 };
  const p2: Point2D = { x: s1.x2, y: s1.y2 };
  const p3: Point2D = { x: s2.x1, y: s2.y1 };
  const p4: Point2D = { x: s2.x2, y: s2.y2 };

  const dx1 = p2.x - p1.x;
  const dy1 = p2.y - p1.y;
  const dx2 = p4.x - p3.x;
  const dy2 = p4.y - p3.y;

  const det = dx1 * dy2 - dy1 * dx2;

  // Check if endpoints of one touch the other
  if (isPointOnSegment(p1, s2, tol)) return p1;
  if (isPointOnSegment(p2, s2, tol)) return p2;
  if (isPointOnSegment(p3, s1, tol)) return p3;
  if (isPointOnSegment(p4, s1, tol)) return p4;

  if (Math.abs(det) < EPSILON) {
    return null;
  }

  const t = ((p3.x - p1.x) * dy2 - (p3.y - p1.y) * dx2) / det;
  const u = ((p3.x - p1.x) * dy1 - (p3.y - p1.y) * dx1) / det;

  const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
  const tTol = len1 > 0 ? tol / len1 : tol;
  const uTol = len2 > 0 ? tol / len2 : tol;

  if (t >= -tTol && t <= 1 + tTol && u >= -uTol && u <= 1 + uTol) {
    const clampedT = Math.max(0, Math.min(1, t));
    return {
      x: p1.x + clampedT * dx1,
      y: p1.y + clampedT * dy1,
    };
  }

  return null;
}

/**
 * Finds all pairwise intersections among an array of line segments.
 */
export function detectAllIntersections(
  segments: LineSegment[],
  tol = SVG_SNAP_TOLERANCE
): Point2D[] {
  const intersections: Point2D[] = [];

  for (let i = 0; i < segments.length; i++) {
    for (let j = i + 1; j < segments.length; j++) {
      const pt = findSegmentIntersection(segments[i], segments[j], tol);
      if (pt) {
        if (!intersections.some((existing) => pointsEqual(existing, pt, tol))) {
          intersections.push(pt);
        }
      }
    }
  }

  return intersections;
}

// ============================================================================
// 3. SEGMENT SPLITTING & PLANAR GRAPH EDGE SUPPORT
// ============================================================================

/**
 * Splits original line segments at all intersection points to create
 * clean, atomic, non-overlapping sub-segments.
 */
export function splitSegmentsAtIntersections(
  segments: LineSegment[],
  tol = SVG_SNAP_TOLERANCE
): LineSegment[] {
  const allPoints: Point2D[] = [];
  const addPoint = (p: Point2D) => {
    if (!allPoints.some((existing) => pointsEqual(existing, p, tol))) {
      allPoints.push(p);
    }
  };

  for (const s of segments) {
    addPoint({ x: s.x1, y: s.y1 });
    addPoint({ x: s.x2, y: s.y2 });
  }

  const intersections = detectAllIntersections(segments, tol);
  for (const pt of intersections) {
    addPoint(pt);
  }

  const atomicSegments: LineSegment[] = [];

  for (const seg of segments) {
    const pStart: Point2D = { x: seg.x1, y: seg.y1 };
    const pEnd: Point2D = { x: seg.x2, y: seg.y2 };
    const segVec = { x: pEnd.x - pStart.x, y: pEnd.y - pStart.y };
    const segLenSq = segVec.x * segVec.x + segVec.y * segVec.y;

    if (segLenSq < EPSILON) continue;

    const pointsOnSeg: { pt: Point2D; t: number }[] = [];
    for (const pt of allPoints) {
      if (isPointOnSegment(pt, seg, tol)) {
        const t =
          ((pt.x - pStart.x) * segVec.x + (pt.y - pStart.y) * segVec.y) /
          segLenSq;
        pointsOnSeg.push({ pt, t: Math.max(0, Math.min(1, t)) });
      }
    }

    pointsOnSeg.sort((a, b) => a.t - b.t);

    const deduped: Point2D[] = [];
    for (const entry of pointsOnSeg) {
      if (
        deduped.length === 0 ||
        !pointsEqual(deduped[deduped.length - 1], entry.pt, tol)
      ) {
        deduped.push(entry.pt);
      }
    }

    for (let k = 0; k < deduped.length - 1; k++) {
      const a = deduped[k];
      const b = deduped[k + 1];
      const len = pointDistance(a, b);
      if (len > tol) {
        const sub: LineSegment = { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
        const isDupe = atomicSegments.some(
          (existing) =>
            (pointsEqual({ x: existing.x1, y: existing.y1 }, a, tol) &&
              pointsEqual({ x: existing.x2, y: existing.y2 }, b, tol)) ||
            (pointsEqual({ x: existing.x1, y: existing.y1 }, b, tol) &&
              pointsEqual({ x: existing.x2, y: existing.y2 }, a, tol))
        );
        if (!isDupe) {
          atomicSegments.push(sub);
        }
      }
    }
  }

  return atomicSegments;
}

/**
 * Extracts unique vertices from atomic line segments.
 */
export function extractVertices(
  atomicSegments: LineSegment[],
  tol = SVG_SNAP_TOLERANCE
): Point2D[] {
  const vertices: Point2D[] = [];
  for (const seg of atomicSegments) {
    const p1: Point2D = { x: seg.x1, y: seg.y1 };
    const p2: Point2D = { x: seg.x2, y: seg.y2 };
    if (!vertices.some((v) => pointsEqual(v, p1, tol))) vertices.push(p1);
    if (!vertices.some((v) => pointsEqual(v, p2, tol))) vertices.push(p2);
  }
  return vertices;
}

/**
 * Verifies that a straight edge from pA to pB is continuously supported
 * by the drawn line segments (i.e. every portion of [pA, pB] is covered).
 */
export function isEdgeSupported(
  pA: Point2D,
  pB: Point2D,
  originalSegments: LineSegment[],
  tol = SVG_SNAP_TOLERANCE
): boolean {
  const edgeLen = pointDistance(pA, pB);
  if (edgeLen < tol) return false;

  const candidateSeg: LineSegment = { x1: pA.x, y1: pA.y, x2: pB.x, y2: pB.y };

  const intervals: { t0: number; t1: number }[] = [];

  for (const seg of originalSegments) {
    const s1: Point2D = { x: seg.x1, y: seg.y1 };
    const s2: Point2D = { x: seg.x2, y: seg.y2 };

    const onA = isPointOnSegment(pA, seg, tol);
    const onB = isPointOnSegment(pB, seg, tol);

    // If both candidate endpoints lie on seg, it is completely supported!
    if (onA && onB) {
      return true;
    }

    const vCandidate = { x: pB.x - pA.x, y: pB.y - pA.y };
    const vSeg = { x: s2.x - s1.x, y: s2.y - s1.y };
    const segLen = Math.sqrt(vSeg.x * vSeg.x + vSeg.y * vSeg.y);
    if (segLen < tol) continue;

    const cross = Math.abs(crossProduct(vCandidate, vSeg));
    if (cross / (edgeLen * segLen) > ANGLE_TOLERANCE) {
      continue;
    }

    const vToS1 = { x: s1.x - pA.x, y: s1.y - pA.y };
    if (Math.abs(crossProduct(vCandidate, vToS1)) / edgeLen > tol) {
      continue;
    }

    const dotS1 = dotProduct(vCandidate, vToS1) / (edgeLen * edgeLen);
    const vToS2 = { x: s2.x - pA.x, y: s2.y - pA.y };
    const dotS2 = dotProduct(vCandidate, vToS2) / (edgeLen * edgeLen);

    const minT = Math.max(0, Math.min(dotS1, dotS2));
    const maxT = Math.min(1, Math.max(dotS1, dotS2));

    if (maxT - minT > tol / edgeLen) {
      intervals.push({ t0: minT, t1: maxT });
    }
  }

  if (intervals.length === 0) return false;

  intervals.sort((a, b) => a.t0 - b.t0);
  let currentMax = 0;
  const tTol = tol / edgeLen;

  for (const interval of intervals) {
    if (interval.t0 <= currentMax + tTol) {
      currentMax = Math.max(currentMax, interval.t1);
      if (currentMax >= 1 - tTol) return true;
    } else {
      return false;
    }
  }

  return currentMax >= 1 - tTol;
}

// ============================================================================
// 4. SHAPE ENUMERATION & GEOMETRIC CLASSIFICATION
// ============================================================================

/**
 * Enumerate all triangles formed by straight lines in the diagram.
 */
export function enumerateTriangles(
  vertices: Point2D[],
  originalSegments: LineSegment[],
  tol = SVG_SNAP_TOLERANCE
): Point2D[][] {
  const triangles: Point2D[][] = [];
  const n = vertices.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (!isEdgeSupported(vertices[i], vertices[j], originalSegments, tol)) {
        continue;
      }
      for (let k = j + 1; k < n; k++) {
        const vA = vertices[i];
        const vB = vertices[j];
        const vC = vertices[k];

        // Area test: filter out degenerate collinear sets
        const area =
          0.5 *
          Math.abs(
            (vB.x - vA.x) * (vC.y - vA.y) - (vB.y - vA.y) * (vC.x - vA.x)
          );
        if (area < MIN_POLYGON_AREA) {
          continue;
        }

        // Collinear intermediary checks: none of the 3 vertices can lie along the edge between the other two
        if (
          isPointOnSegment(vB, { x1: vA.x, y1: vA.y, x2: vC.x, y2: vC.y }, tol) ||
          isPointOnSegment(vA, { x1: vB.x, y1: vB.y, x2: vC.x, y2: vC.y }, tol) ||
          isPointOnSegment(vC, { x1: vA.x, y1: vA.y, x2: vB.x, y2: vB.y }, tol)
        ) {
          continue;
        }

        if (
          isEdgeSupported(vB, vC, originalSegments, tol) &&
          isEdgeSupported(vC, vA, originalSegments, tol)
        ) {
          triangles.push([vA, vB, vC]);
        }
      }
    }
  }

  return triangles;
}

export type QuadrilateralType =
  | 'square'
  | 'rectangle'
  | 'rhombus'
  | 'parallelogram'
  | 'other';

/**
 * Evaluates a 4-vertex cycle (A, B, C, D) and classifies it strictly into:
 * - square: 4 equal sides AND 4 right angles
 * - rectangle: 4 right angles AND opposite sides equal AND not square
 * - rhombus: 4 equal sides AND opposite sides parallel AND not right angle (not square)
 * - parallelogram: opposite sides parallel AND equal AND not 4 equal sides AND not right angles
 */
export function classifyQuadrilateral(
  quad: [Point2D, Point2D, Point2D, Point2D],
  angleTol = ANGLE_TOLERANCE,
  ratioTol = LENGTH_TOLERANCE_RATIO
): QuadrilateralType {
  const [A, B, C, D] = quad;

  const vAB = { x: B.x - A.x, y: B.y - A.y };
  const vBC = { x: C.x - B.x, y: C.y - B.y };
  const vCD = { x: D.x - C.x, y: D.y - C.y };
  const vDA = { x: A.x - D.x, y: A.y - D.y };

  const lAB = Math.sqrt(vAB.x * vAB.x + vAB.y * vAB.y);
  const lBC = Math.sqrt(vBC.x * vBC.x + vBC.y * vBC.y);
  const lCD = Math.sqrt(vCD.x * vCD.x + vCD.y * vCD.y);
  const lDA = Math.sqrt(vDA.x * vDA.x + vDA.y * vDA.y);

  if (lAB < 5 || lBC < 5 || lCD < 5 || lDA < 5) {
    return 'other';
  }

  // Opposite sides parallel test: AB parallel to CD (opposite directions)
  const crossOpp1 = Math.abs(crossProduct(vAB, vCD));
  const isParallel1 = crossOpp1 / (lAB * lCD) < angleTol;

  const crossOpp2 = Math.abs(crossProduct(vBC, vDA));
  const isParallel2 = crossOpp2 / (lBC * lDA) < angleTol;

  if (!isParallel1 || !isParallel2) {
    return 'other';
  }

  // Opposite sides equal length
  const oppEqual1 =
    Math.abs(lAB - lCD) <= Math.max(2.5, ratioTol * Math.max(lAB, lCD));
  const oppEqual2 =
    Math.abs(lBC - lDA) <= Math.max(2.5, ratioTol * Math.max(lBC, lDA));

  if (!oppEqual1 || !oppEqual2) {
    return 'other';
  }

  // Right angle test: dot product of adjacent vectors vAB and vBC ~ 0
  const dotCorner = Math.abs(dotProduct(vAB, vBC));
  const isRightAngle = dotCorner / (lAB * lBC) < angleTol;

  // All 4 sides equal length test
  const avgSide = (lAB + lBC + lCD + lDA) / 4;
  const maxDiff = Math.max(
    Math.abs(lAB - avgSide),
    Math.abs(lBC - avgSide),
    Math.abs(lCD - avgSide),
    Math.abs(lDA - avgSide)
  );
  const allSidesEqual = maxDiff <= Math.max(2.5, ratioTol * avgSide);

  if (isRightAngle) {
    if (allSidesEqual) {
      return 'square';
    } else {
      return 'rectangle'; // Non-square rectangle
    }
  } else {
    if (allSidesEqual) {
      return 'rhombus'; // Non-square rhombus
    } else {
      return 'parallelogram'; // Non-square, non-rhombus, non-rectangle parallelogram
    }
  }
}

/**
 * Enumerate all convex quadrilaterals and classify them into exclusive categories.
 */
export function enumerateQuadrilaterals(
  vertices: Point2D[],
  originalSegments: LineSegment[],
  tol = SVG_SNAP_TOLERANCE
): {
  squares: Point2D[][];
  rectangles: Point2D[][];
  rhombuses: Point2D[][];
  parallelograms: Point2D[][];
} {
  const squares: Point2D[][] = [];
  const rectangles: Point2D[][] = [];
  const rhombuses: Point2D[][] = [];
  const parallelograms: Point2D[][] = [];

  const seenQuads = new Set<string>();

  const n = vertices.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      if (!isEdgeSupported(vertices[i], vertices[j], originalSegments, tol)) {
        continue;
      }

      for (let k = 0; k < n; k++) {
        if (k === i || k === j) continue;
        if (!isEdgeSupported(vertices[j], vertices[k], originalSegments, tol)) {
          continue;
        }

        for (let l = 0; l < n; l++) {
          if (l === i || l === j || l === k) continue;
          if (
            !isEdgeSupported(vertices[k], vertices[l], originalSegments, tol) ||
            !isEdgeSupported(vertices[l], vertices[i], originalSegments, tol)
          ) {
            continue;
          }

          const A = vertices[i];
          const B = vertices[j];
          const C = vertices[k];
          const D = vertices[l];

          // Check strict convexity & positive orientation (counter-clockwise)
          const cp1 = crossProduct(
            { x: B.x - A.x, y: B.y - A.y },
            { x: C.x - B.x, y: C.y - B.y }
          );
          const cp2 = crossProduct(
            { x: C.x - B.x, y: C.y - B.y },
            { x: D.x - C.x, y: D.y - C.y }
          );
          const cp3 = crossProduct(
            { x: D.x - C.x, y: D.y - C.y },
            { x: A.x - D.x, y: A.y - D.y }
          );
          const cp4 = crossProduct(
            { x: A.x - D.x, y: A.y - D.y },
            { x: B.x - A.x, y: B.y - A.y }
          );

          if (
            cp1 <= MIN_POLYGON_AREA ||
            cp2 <= MIN_POLYGON_AREA ||
            cp3 <= MIN_POLYGON_AREA ||
            cp4 <= MIN_POLYGON_AREA
          ) {
            continue;
          }

          // Canonical representation to avoid duplicate counts
          const keys = [
            pointKey(A, 2.0),
            pointKey(B, 2.0),
            pointKey(C, 2.0),
            pointKey(D, 2.0),
          ];
          let minIdx = 0;
          for (let m = 1; m < 4; m++) {
            if (keys[m] < keys[minIdx]) minIdx = m;
          }
          const canonical = `${keys[minIdx]}|${keys[(minIdx + 1) % 4]}|${keys[(minIdx + 2) % 4]}|${keys[(minIdx + 3) % 4]}`;

          if (seenQuads.has(canonical)) continue;
          seenQuads.add(canonical);

          const classification = classifyQuadrilateral([A, B, C, D]);

          if (classification === 'square') {
            squares.push([A, B, C, D]);
            rectangles.push([A, B, C, D]); // By mathematical definition, every square is a rectangle!
            rhombuses.push([A, B, C, D]); // By mathematical definition, every square has 4 equal sides, so it is a rhombus!
            parallelograms.push([A, B, C, D]); // Every square is a parallelogram!
          } else if (classification === 'rectangle') {
            rectangles.push([A, B, C, D]);
            parallelograms.push([A, B, C, D]); // Rectangles are parallelograms with right angles
          } else if (classification === 'rhombus') {
            rhombuses.push([A, B, C, D]);
            parallelograms.push([A, B, C, D]); // By mathematical definition, every rhombus is a parallelogram!
          } else if (classification === 'parallelogram') {
            parallelograms.push([A, B, C, D]);
          }
        }
      }
    }
  }

  return { squares, rectangles, rhombuses, parallelograms };
}

// ============================================================================
// 5. FULL SHAPE COUNTING & PUZZLE VALIDATION
// ============================================================================

/**
 * Analyzes an arbitrary set of line segments and returns shape counts
 * for all five required categories.
 */
export function countAllShapesFromSegments(
  segments: LineSegment[],
  tol = SVG_SNAP_TOLERANCE
): {
  counts: Record<ShapeCategory, number>;
  atomicSegments: LineSegment[];
  vertices: Point2D[];
  details: {
    triangles: Point2D[][];
    squares: Point2D[][];
    rectangles: Point2D[][];
    parallelograms: Point2D[][];
    rhombuses: Point2D[][];
  };
} {
  const atomicSegments = splitSegmentsAtIntersections(segments, tol);
  const vertices = extractVertices(atomicSegments, tol);

  const triangles = enumerateTriangles(vertices, segments, tol);
  const { squares, rectangles, rhombuses, parallelograms } =
    enumerateQuadrilaterals(vertices, segments, tol);

  const counts: Record<ShapeCategory, number> = {
    triangles: triangles.length,
    squares: squares.length,
    rectangles: rectangles.length,
    parallelograms: parallelograms.length,
    rhombuses: rhombuses.length,
  };

  return {
    counts,
    atomicSegments,
    vertices,
    details: {
      triangles,
      squares,
      rectangles,
      parallelograms,
      rhombuses,
    },
  };
}

/**
 * Validates a puzzle diagram before rendering to guarantee mathematical accuracy.
 */
export function validatePuzzleGeometry(
  svgData: SVGGeometryData | LineSegment[],
  targetShape: ShapeCategory,
  expectedCount?: number,
  tol = SVG_SNAP_TOLERANCE
): GeometryValidationResult {
  const segments = Array.isArray(svgData) ? svgData : svgData?.segments;
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!segments || segments.length === 0) {
    return {
      isValid: false,
      detectedCounts: {
        triangles: 0,
        squares: 0,
        rectangles: 0,
        parallelograms: 0,
        rhombuses: 0,
      },
      expectedCount,
      targetShape,
      errors: ['No line segments found in puzzle.'],
      warnings: [],
      intersectionCount: 0,
      vertexCount: 0,
      atomicSegmentCount: 0,
    };
  }

  const intersections = detectAllIntersections(segments, tol);
  const { counts, atomicSegments, vertices, details } =
    countAllShapesFromSegments(segments, tol);

  const detectedTargetCount = counts[targetShape];

  if (expectedCount !== undefined && detectedTargetCount !== expectedCount) {
    errors.push(
      `Count mismatch for ${targetShape}: Algorithm counted ${detectedTargetCount}, but expected ${expectedCount}.`
    );
  }

  if (detectedTargetCount === 0) {
    warnings.push(`Target shape ${targetShape} count is 0.`);
  }

  return {
    isValid: errors.length === 0,
    detectedCounts: counts,
    expectedCount,
    targetShape,
    errors,
    warnings,
    intersectionCount: intersections.length,
    vertexCount: vertices.length,
    atomicSegmentCount: atomicSegments.length,
    details,
  };
}

// ============================================================================
// 6. CLOSED-FORM FORMULAS & DISTRACTOR OPTION GENERATOR
// ============================================================================

export function countTrianglesInLattice(n: number): number {
  if (n <= 0) return 0;
  return Math.floor((n * (n + 2) * (2 * n + 1)) / 8);
}

export function countTrianglesFromVertexRays(
  intervals: number,
  levels: number
): number {
  if (intervals <= 0 || levels <= 0) return 0;
  return levels * ((intervals * (intervals + 1)) / 2);
}

export function countRectanglesInGrid(
  rows: number,
  cols: number
): {
  totalRectangles: number;
  totalSquares: number;
  exclusiveRectangles: number;
} {
  if (rows <= 0 || cols <= 0) {
    return { totalRectangles: 0, totalSquares: 0, exclusiveRectangles: 0 };
  }
  // By mathematical definition, every square is a rectangle!
  // Any choice of 2 horizontal lines and 2 vertical lines forms a rectangle.
  const totalRectangles =
    ((rows * (rows + 1)) / 2) * ((cols * (cols + 1)) / 2);
  let totalSquares = 0;
  const maxK = Math.min(rows, cols);
  for (let k = 1; k <= maxK; k++) {
    totalSquares += (rows - k + 1) * (cols - k + 1);
  }
  return {
    totalRectangles,
    totalSquares,
    exclusiveRectangles: totalRectangles, // Total rectangles ALWAYS includes squares!
  };
}

export function countGeneralParallelograms(rows: number, cols: number): number {
  if (rows <= 0 || cols <= 0) return 0;
  return ((rows * (rows + 1)) / 2) * ((cols * (cols + 1)) / 2);
}

export function countRhombusesInLattice(
  rows: number,
  cols: number
): {
  totalRhombuses: number;
  totalParallelograms: number;
  exclusiveParallelograms: number;
} {
  if (rows <= 0 || cols <= 0) {
    return { totalRhombuses: 0, totalParallelograms: 0, exclusiveParallelograms: 0 };
  }
  let totalRhombuses = 0;
  const maxK = Math.min(rows, cols);
  for (let k = 1; k <= maxK; k++) {
    totalRhombuses += (rows - k + 1) * (cols - k + 1);
  }
  // By mathematical definition, every rhombus is a parallelogram!
  const totalAllParallelograms =
    ((rows * (rows + 1)) / 2) * ((cols * (cols + 1)) / 2);
  return {
    totalRhombuses,
    totalParallelograms: totalAllParallelograms,
    exclusiveParallelograms: totalAllParallelograms, // Total parallelograms includes rhombuses!
  };
}

export function generateDistractorOptions(correctCount: number): number[] {
  const optionsSet = new Set<number>();
  optionsSet.add(correctCount);

  const candidates: number[] = [];

  if (correctCount > 4) {
    candidates.push(correctCount - 1);
    candidates.push(correctCount + 1);
  }
  if (correctCount > 8) {
    candidates.push(correctCount - 2);
    candidates.push(correctCount + 2);
  }
  if (correctCount > 12) {
    candidates.push(correctCount - 3);
    candidates.push(correctCount + 3);
  }
  if (correctCount > 18) {
    candidates.push(correctCount - 4);
    candidates.push(correctCount + 4);
  }

  const missedLarge = Math.max(1, Math.round(correctCount * 0.75));
  if (missedLarge !== correctCount) candidates.push(missedLarge);

  const overcount = Math.round(correctCount * 1.25);
  if (overcount !== correctCount) candidates.push(overcount);

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  for (const c of candidates) {
    if (c > 0 && c !== correctCount) {
      optionsSet.add(c);
      if (optionsSet.size === 4) break;
    }
  }

  let delta = 1;
  while (optionsSet.size < 4) {
    const up = correctCount + delta;
    const down = correctCount - delta;
    if (down > 0) optionsSet.add(down);
    if (optionsSet.size < 4) optionsSet.add(up);
    delta++;
  }

  const options = Array.from(optionsSet);
  return options.sort((a, b) => a - b);
}
