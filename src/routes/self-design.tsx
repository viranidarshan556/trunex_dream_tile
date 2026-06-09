import { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Sparkles, Upload, RotateCcw, PenTool, Move, Check, Download, AlertCircle, ChevronRight, CornerDownRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { RoomImagePicker } from "@/components/RoomImagePicker";
import { TileGallery, type Tile } from "@/components/TileGallery";
import { LeadFormFields } from "@/components/LeadFormFields";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadRoomImage } from "@/lib/upload";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { createLead } from "@/lib/leads.functions";
import { supabase } from "@/integrations/supabase/client";
import {
  type Point,
  rnd,
  hexPath,
  drawTriangleTextured
} from "@/lib/perspective";

export const Route = createFileRoute("/self-design")({
  head: () => ({
    meta: [
      { title: "Self Design — Visualizer | TRUNEX" },
      { name: "description", content: "Upload your room photo, select or customize tiles, and preview them on your floor in real-time." },
    ],
  }),
  component: SelfDesignPage,
});

export interface PatternTile {
  id: string;
  name: string;
  code: string;
  isPattern: true;
  fn: (c: CanvasRenderingContext2D, s: number) => void;
}

export const PATTERN_TILES: PatternTile[] = [
  {
    id: 'marble_white',
    name: 'White Marble',
    code: 'PAT-MRB-WHT',
    isPattern: true,
    fn: (c, s) => {
      c.fillStyle = '#f5f1eb';
      c.fillRect(0, 0, s, s);
      c.strokeStyle = 'rgba(160,145,125,0.3)';
      c.lineWidth = 0.8;
      for (let i = 0; i < 6; i++) {
        c.beginPath();
        c.moveTo(rnd(s), 0);
        c.bezierCurveTo(rnd(s), rnd(s), rnd(s), rnd(s), rnd(s), s);
        c.stroke();
      }
    }
  },
  {
    id: 'marble_grey',
    name: 'Grey Marble',
    code: 'PAT-MRB-GRY',
    isPattern: true,
    fn: (c, s) => {
      c.fillStyle = '#b5b0ac';
      c.fillRect(0, 0, s, s);
      c.strokeStyle = 'rgba(60,55,50,0.25)';
      c.lineWidth = 1.2;
      for (let i = 0; i < 5; i++) {
        c.beginPath();
        c.moveTo(0, rnd(s));
        c.bezierCurveTo(rnd(s), rnd(s), rnd(s), rnd(s), s, rnd(s));
        c.stroke();
      }
    }
  },
  {
    id: 'marble_black',
    name: 'Black Marble',
    code: 'PAT-MRB-BLK',
    isPattern: true,
    fn: (c, s) => {
      c.fillStyle = '#1c1c1c';
      c.fillRect(0, 0, s, s);
      c.strokeStyle = 'rgba(200,180,140,0.25)';
      c.lineWidth = 0.8;
      for (let i = 0; i < 5; i++) {
        c.beginPath();
        c.moveTo(rnd(s), 0);
        c.bezierCurveTo(rnd(s), rnd(s), rnd(s), rnd(s), s, rnd(s));
        c.stroke();
      }
    }
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    code: 'PAT-TER-COT',
    isPattern: true,
    fn: (c, s) => {
      const g = c.createLinearGradient(0, 0, s, s);
      g.addColorStop(0, '#c4604a');
      g.addColorStop(1, '#a84c38');
      c.fillStyle = g;
      c.fillRect(0, 0, s, s);
      c.fillStyle = 'rgba(255,200,170,0.1)';
      c.fillRect(4, 4, s - 8, s - 8);
    }
  },
  {
    id: 'terracotta_hex',
    name: 'Terra Hex',
    code: 'PAT-TER-HEX',
    isPattern: true,
    fn: (c, s) => {
      c.fillStyle = '#c96040';
      c.fillRect(0, 0, s, s);
      hexPath(c, s / 2, s / 2, s * 0.4);
      c.fillStyle = '#b85535';
      c.fill();
      c.strokeStyle = 'rgba(80,20,10,0.3)';
      c.lineWidth = 1;
      c.stroke();
    }
  },
  {
    id: 'wood_light',
    name: 'Light Wood',
    code: 'PAT-WOD-LGT',
    isPattern: true,
    fn: (c, s) => {
      const g = c.createLinearGradient(0, 0, 0, s);
      g.addColorStop(0, '#d4a060');
      g.addColorStop(0.5, '#c49050');
      g.addColorStop(1, '#d0a060');
      c.fillStyle = g;
      c.fillRect(0, 0, s, s);
      c.strokeStyle = 'rgba(80,40,10,0.12)';
      c.lineWidth = 0.8;
      for (let i = 0; i < 10; i++) {
        c.beginPath();
        c.moveTo(0, (s / 10) * i + rnd(3));
        c.lineTo(s, (s / 10) * i + rnd(3));
        c.stroke();
      }
    }
  },
  {
    id: 'wood_dark',
    name: 'Dark Wood',
    code: 'PAT-WOD-DRK',
    isPattern: true,
    fn: (c, s) => {
      const g = c.createLinearGradient(0, 0, 0, s);
      g.addColorStop(0, '#5c3318');
      g.addColorStop(0.5, '#4a2810');
      g.addColorStop(1, '#5c3318');
      c.fillStyle = g;
      c.fillRect(0, 0, s, s);
      c.strokeStyle = 'rgba(255,180,100,0.08)';
      c.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        c.beginPath();
        c.moveTo(0, (s / 7) * i);
        c.lineTo(s, (s / 7) * i + rnd(4));
        c.stroke();
      }
    }
  },
  {
    id: 'hex_white',
    name: 'White Hex',
    code: 'PAT-HEX-WHT',
    isPattern: true,
    fn: (c, s) => {
      c.fillStyle = '#eeebe5';
      c.fillRect(0, 0, s, s);
      hexPath(c, s / 2, s / 2, s * 0.4);
      c.fillStyle = '#fff';
      c.fill();
      c.strokeStyle = '#ccc';
      c.lineWidth = 1;
      c.stroke();
    }
  },
  {
    id: 'hex_black',
    name: 'Black Hex',
    code: 'PAT-HEX-BLK',
    isPattern: true,
    fn: (c, s) => {
      c.fillStyle = '#1a1a1a';
      c.fillRect(0, 0, s, s);
      hexPath(c, s / 2, s / 2, s * 0.4);
      c.fillStyle = '#262626';
      c.fill();
      c.strokeStyle = '#444';
      c.lineWidth = 1;
      c.stroke();
    }
  },
  {
    id: 'checker',
    name: 'Checker B&W',
    code: 'PAT-CHK-BW',
    isPattern: true,
    fn: (c, s) => {
      c.fillStyle = '#e8e2d8';
      c.fillRect(0, 0, s, s);
      c.fillStyle = '#1e1e1e';
      c.fillRect(0, 0, s / 2, s / 2);
      c.fillRect(s / 2, s / 2, s / 2, s / 2);
    }
  },
  {
    id: 'mosaic_blue',
    name: 'Blue Mosaic',
    code: 'PAT-MOS-BLU',
    isPattern: true,
    fn: (c, s) => {
      const cols = ['#1a4d8a', '#2560b0', '#183f70', '#3878d0', '#0d2a58', '#4888e0'];
      const g = 4, cs = s / g;
      for (let r = 0; r < g; r++) {
        for (let col = 0; col < g; col++) {
          c.fillStyle = cols[Math.floor(Math.random() * cols.length)];
          c.fillRect(col * cs + 1, r * cs + 1, cs - 2, cs - 2);
        }
      }
    }
  },
  {
    id: 'zellige_green',
    name: 'Zellige Green',
    code: 'PAT-ZEL-GRN',
    isPattern: true,
    fn: (c, s) => {
      const cols = ['#1b6e60', '#e8c050', '#c04030', '#2050a8', '#f0ece0'];
      c.fillStyle = cols[Math.floor(Math.random() * cols.length)];
      c.fillRect(0, 0, s, s);
      c.fillStyle = 'rgba(255,255,255,0.15)';
      c.beginPath();
      c.moveTo(s * 0.1, 0);
      c.lineTo(s * 0.5, s * 0.15);
      c.lineTo(s * 0.9, 0);
      c.closePath();
      c.fill();
    }
  },
  {
    id: 'travertine',
    name: 'Travertine',
    code: 'PAT-TRV-TIN',
    isPattern: true,
    fn: (c, s) => {
      c.fillStyle = '#d8c8a8';
      c.fillRect(0, 0, s, s);
      c.strokeStyle = 'rgba(150,130,100,0.35)';
      c.lineWidth = 0.5;
      for (let i = 0; i < 14; i++) {
        c.beginPath();
        c.ellipse(rnd(s), rnd(s), rnd(8) + 2, rnd(3) + 1, rnd(Math.PI), 0, Math.PI * 2);
        c.stroke();
      }
    }
  },
  {
    id: 'concrete',
    name: 'Concrete',
    code: 'PAT-CON-CRT',
    isPattern: true,
    fn: (c, s) => {
      c.fillStyle = '#909090';
      c.fillRect(0, 0, s, s);
      const id = c.getImageData(0, 0, s, s);
      for (let i = 0; i < id.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 20;
        id.data[i] += n;
        id.data[i + 1] += n;
        id.data[i + 2] += n;
      }
      c.putImageData(id, 0, 0);
    }
  },
  {
    id: 'limestone',
    name: 'Limestone',
    code: 'PAT-LMS-TON',
    isPattern: true,
    fn: (c, s) => {
      c.fillStyle = '#e0d4bc';
      c.fillRect(0, 0, s, s);
      c.strokeStyle = 'rgba(140,120,90,0.2)';
      c.lineWidth = 0.6;
      for (let i = 0; i < 6; i++) {
        c.beginPath();
        c.moveTo(0, (s / 6) * i + rnd(5));
        c.lineTo(s, (s / 6) * i + rnd(5));
        c.stroke();
      }
    }
  }
];

function PatternThumbnail({ pattern, size = 80 }: { pattern: PatternTile; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const half = size / 2;
    for (let r = 0; r < 2; r++) {
      for (let col = 0; col < 2; col++) {
        ctx.save();
        ctx.translate(col * half, r * half);
        ctx.rect(0, 0, half, half);
        ctx.clip();
        pattern.fn(ctx, half);
        ctx.restore();
      }
    }
  }, [pattern, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="h-full w-full rounded-lg object-cover aspect-square"
    />
  );
}

function SelfDesignPage() {
  const navigate = useNavigate();
  const createLeadFn = useServerFn(createLead);

  // Flow State
  const [step, setStep] = useState<"upload" | "visualize" | "details">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  
  // Custom Visualizer State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [mode, setMode] = useState<'mark' | 'move'>('mark');
  const [draggingIndex, setDraggingIndex] = useState<number>(-1);
  const [previewActive, setPreviewActive] = useState(false);

  // Settings
  const [tile, setTile] = useState<Tile | PatternTile | null>(null);
  const [tileSize, setTileSize] = useState<'2x2' | '2x4'>('2x2');
  const [opacity, setOpacity] = useState(90);
  const [groutWidth, setGroutWidth] = useState(0);
  const [groutColor, setGroutColor] = useState('#ffffff');

  // Loaded database tile cache
  const [tileImageElement, setTileImageElement] = useState<HTMLImageElement | null>(null);

  // Form State
  const [values, setValues] = useState<Partial<LeadInput>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof LeadInput, string>>>({});
  const [busy, setBusy] = useState(false);
  const [busyMsg, setBusyMsg] = useState("");

  // Load selected DB tile image
  useEffect(() => {
    if (!tile || 'isPattern' in tile) {
      setTileImageElement(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setTileImageElement(img);
    };
    img.src = tile.image_url;
  }, [tile]);

  // Read uploaded file as Image Element
  useEffect(() => {
    if (!file) {
      setOriginalImage(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setPoints([]);
        setPreviewActive(false);
        setStep("visualize");
        toast.success("Room photo loaded! Select 'Mark Floor' to click 4 corners.");
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [file]);

  // Handle canvas size resizing to parent container
  const resizeCanvas = useCallback(() => {
    if (step !== 'visualize') return;
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const container = canvas.parentElement;
    if (!container) return;

    const maxW = container.clientWidth;
    const maxH = Math.min(window.innerHeight * 0.55, 450);
    const ratio = Math.min(maxW / originalImage.naturalWidth, maxH / originalImage.naturalHeight);

    const w = Math.round(originalImage.naturalWidth * ratio);
    const h = Math.round(originalImage.naturalHeight * ratio);

    if (canvas.width !== w || canvas.height !== h) {
      // Scale points proportionally
      if (canvas.width > 0 && canvas.height > 0) {
        const scaleX = w / canvas.width;
        const scaleY = h / canvas.height;
        setPoints((prev) => prev.map((p) => ({ x: p.x * scaleX, y: p.y * scaleY })));
      }

      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
  }, [originalImage]);

  useEffect(() => {
    if (!originalImage) return;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [originalImage, resizeCanvas]);

  // Rendering Helper: boundary polygon
  const drawPolygon = useCallback((ctx: CanvasRenderingContext2D) => {
    if (points.length < 2) return;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    if (points.length === 4) {
      ctx.closePath();
    }
    ctx.stroke();

    if (points.length === 4) {
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(184, 150, 90, 0.85)'; // gold accent color
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < 4; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }, [points]);

  // Rendering Helper: point markers
  const drawPoints = useCallback((ctx: CanvasRenderingContext2D) => {
    const POINT_COLORS = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db'];
    const POINT_LABELS = ['TL', 'TR', 'BR', 'BL'];

    points.forEach((p, i) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = POINT_COLORS[i];
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(POINT_LABELS[i], p.x, p.y);
      ctx.restore();
    });
  }, [points]);

  // Rendering Helper: perspective warping
  const applyTileOverlay = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (points.length !== 4 || !tile) return;

    const base = Math.round(canvas.width / 8);
    const tileW = base;
    const tileH = tileSize === '2x2' ? base : base * 2;
    const cW = canvas.width;
    const cH = canvas.height;

    const flat = document.createElement('canvas');
    flat.width = cW;
    flat.height = cH;
    const fc = flat.getContext('2d')!;

    const tileOff = document.createElement('canvas');
    tileOff.width = tileW;
    tileOff.height = tileH;
    const tc = tileOff.getContext('2d')!;

    if ('isPattern' in tile) {
      tc.save();
      tc.scale(tileW / tileH, 1);
      tile.fn(tc, tileH);
      tc.restore();
    } else if (tileImageElement) {
      tc.drawImage(tileImageElement, 0, 0, tileW, tileH);
    }

    const stepX = tileW + groutWidth;
    const stepY = tileH + groutWidth;
    if (groutWidth > 0) {
      fc.fillStyle = groutColor;
      fc.fillRect(0, 0, cW, cH);
    }

    for (let y = 0; y < cH; y += stepY) {
      for (let x = 0; x < cW; x += stepX) {
        fc.drawImage(tileOff, x, y, tileW, tileH);
      }
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.clip();

    ctx.globalAlpha = opacity / 100;

    drawTriangleTextured(
      ctx,
      flat,
      { x: 0, y: 0 },
      { x: cW, y: 0 },
      { x: 0, y: cH },
      points[0],
      points[1],
      points[3]
    );
    drawTriangleTextured(
      ctx,
      flat,
      { x: cW, y: 0 },
      { x: cW, y: cH },
      { x: 0, y: cH },
      points[1],
      points[2],
      points[3]
    );

    ctx.globalAlpha = 1;
    ctx.restore();
  }, [points, tile, tileImageElement, tileSize, groutWidth, groutColor, opacity]);

  // Principal redraw cycle
  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    if (previewActive && points.length === 4 && tile) {
      applyTileOverlay(canvas, ctx);
    }

    drawPolygon(ctx);
    drawPoints(ctx);
  }, [originalImage, previewActive, points, tile, drawPolygon, drawPoints, applyTileOverlay]);

  useEffect(() => {
    drawScene();
  }, [drawScene]);

  // Pointer position helpers
  function getCanvasPos(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvasEl: HTMLCanvasElement
  ): Point {
    const rect = canvasEl.getBoundingClientRect();
    const scaleX = canvasEl.width / rect.width;
    const scaleY = canvasEl.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function nearestPoint(x: number, y: number, canvasEl: HTMLCanvasElement, threshold = 20): number {
    const rect = canvasEl.getBoundingClientRect();
    const sx = canvasEl.width / rect.width;
    const sy = canvasEl.height / rect.height;
    const maxT = threshold * Math.max(sx, sy);

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const dist = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2);
      if (dist < maxT) return i;
    }
    return -1;
  }

  // Canvas Interactions
  function handlePointerDown(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!originalImage || !canvasRef.current) return;
    const pos = getCanvasPos(e, canvasRef.current);

    if (mode === 'move') {
      const idx = nearestPoint(pos.x, pos.y, canvasRef.current);
      if (idx >= 0) {
        setDraggingIndex(idx);
      }
      return;
    }

    // Mark Mode
    if (points.length < 4) {
      const newPoints = [...points, pos];
      setPoints(newPoints);
      setPreviewActive(false);
      if (newPoints.length === 4) {
        toast.info("4 corners marked! Apply tiles to see the preview.");
      }
    }
  }

  function handlePointerMove(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (draggingIndex < 0 || !canvasRef.current) return;
    const pos = getCanvasPos(e, canvasRef.current);
    const newPoints = [...points];
    newPoints[draggingIndex] = pos;
    setPoints(newPoints);
    setPreviewActive(false);
  }

  function handlePointerUp() {
    if (draggingIndex >= 0) {
      setDraggingIndex(-1);
    }
  }

  // Clean, guidelines-free canvas blob exporter
  function getWarpedCanvasBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas || !originalImage || !tile) {
        reject(new Error("Canvas or image not loaded"));
        return;
      }

      const tmp = document.createElement('canvas');
      tmp.width = canvas.width;
      tmp.height = canvas.height;
      const tc = tmp.getContext('2d');
      if (!tc) {
        reject(new Error("Could not get context"));
        return;
      }

      tc.drawImage(originalImage, 0, 0, tmp.width, tmp.height);

      if (previewActive && points.length === 4) {
        const base = Math.round(tmp.width / 8);
        const tileW = base;
        const tileH = tileSize === '2x2' ? base : base * 2;
        const cW = tmp.width;
        const cH = tmp.height;

        const flat = document.createElement('canvas');
        flat.width = cW;
        flat.height = cH;
        const fc = flat.getContext('2d')!;

        const tileOff = document.createElement('canvas');
        tileOff.width = tileW;
        tileOff.height = tileH;
        const tcTile = tileOff.getContext('2d')!;

        if ('isPattern' in tile) {
          tcTile.save();
          tcTile.scale(tileW / tileH, 1);
          tile.fn(tcTile, tileH);
          tcTile.restore();
        } else if (tileImageElement) {
          tcTile.drawImage(tileImageElement, 0, 0, tileW, tileH);
        }

        const stepX = tileW + groutWidth;
        const stepY = tileH + groutWidth;
        if (groutWidth > 0) {
          fc.fillStyle = groutColor;
          fc.fillRect(0, 0, cW, cH);
        }

        for (let y = 0; y < cH; y += stepY) {
          for (let x = 0; x < cW; x += stepX) {
            fc.drawImage(tileOff, x, y, tileW, tileH);
          }
        }

        tc.save();
        tc.beginPath();
        tc.moveTo(points[0].x, points[0].y);
        points.forEach((p) => tc.lineTo(p.x, p.y));
        tc.closePath();
        tc.clip();

        tc.globalAlpha = opacity / 100;

        drawTriangleTextured(
          tc,
          flat,
          { x: 0, y: 0 },
          { x: cW, y: 0 },
          { x: 0, y: cH },
          points[0],
          points[1],
          points[3]
        );
        drawTriangleTextured(
          tc,
          flat,
          { x: cW, y: 0 },
          { x: cW, y: cH },
          { x: 0, y: cH },
          points[1],
          points[2],
          points[3]
        );

        tc.globalAlpha = 1;
        tc.restore();
      }

      tmp.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Blob conversion failed"));
        }
      }, 'image/jpeg', 0.93);
    });
  }

  // Upload and submit lead details
  async function handleSubmit() {
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const e: any = {};
      for (const i of parsed.error.issues) {
        e[i.path[0] as string] = i.message;
      }
      setErrors(e);
      return;
    }
    if (!file || !tile) return;
    setErrors({});
    setBusy(true);

    try {
      setBusyMsg("Uploading your room photo…");
      const roomUrl = await uploadRoomImage(file);

      setBusyMsg("Uploading visualizer preview…");
      const previewBlob = await getWarpedCanvasBlob();
      const previewPath = `${crypto.randomUUID()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("generated-previews")
        .upload(previewPath, previewBlob, { contentType: "image/jpeg", upsert: false });
      if (upErr) throw upErr;

      const { data: publicData } = supabase.storage
        .from("generated-previews")
        .getPublicUrl(previewPath);
      const previewUrl = publicData.publicUrl;

      const isDefault = 'isPattern' in tile ? false : tile.id.startsWith("default-");

      setBusyMsg("Saving your project…");
      const lead = await createLeadFn({
        data: {
          ...parsed.data,
          flow_type: "self",
          tile_id: 'isPattern' in tile || isDefault ? null : tile.id,
          original_image_url: roomUrl,
          generated_image_url: previewUrl,
        },
      });

      toast.success("Your design has been saved!");
      navigate({ to: "/result/$id", params: { id: lead.id } });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Visualizer upload failed. Try again.");
      setBusy(false);
    }
  }

  const tileReady = tile ? ('isPattern' in tile || !!tileImageElement) : false;
  const readyToApply = points.length === 4 && tileReady;

  return (
    <div className="min-h-screen pb-24 bg-background">
      <SiteHeader />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        
        {/* Header Title */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Visualize It Yourself</p>
            <h1 className="mt-1 font-display text-3xl font-bold">Dream Tile Floor Visualizer</h1>
          </div>
          {step === "visualize" && (
            <Button variant="outline" size="sm" onClick={() => setStep("upload")}>
              <Upload className="mr-2 h-4 w-4" /> Change Photo
            </Button>
          )}
        </div>

        {/* Upload Step */}
        {step === "upload" && (
          <div className="mx-auto max-w-xl space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold">Step 1: Upload Room Photo</h3>
              <p className="text-sm text-muted-foreground">Select a photo of the floor you want to visualize.</p>
            </div>
            <RoomImagePicker value={file} onChange={setFile} />
            {file && (
              <Button className="w-full gold-glow" onClick={() => setStep("visualize")}>
                Continue to Visualizer <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Visualizer Step */}
        <div className={step === "visualize" ? "" : "hidden"}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            
            {/* Left Column: Canvas and tools */}
            <div className="space-y-4">
              
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={mode === 'mark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('mark')}
                    disabled={points.length >= 4}
                    className="h-8 text-xs"
                  >
                    <PenTool className="mr-1.5 h-3.5 w-3.5" /> Mark Floor
                  </Button>
                  <Button
                    variant={mode === 'move' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('move')}
                    disabled={points.length === 0}
                    className="h-8 text-xs"
                  >
                    <Move className="mr-1.5 h-3.5 w-3.5" /> Move Points
                  </Button>
                  <div className="h-6 w-px bg-border hidden sm:block" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPoints([]);
                      setPreviewActive(false);
                      toast.info("Points cleared.");
                    }}
                    disabled={points.length === 0}
                    className="h-8 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Clear Points
                  </Button>
                </div>
                
                <Badge variant="outline" className="text-[10px] capitalize tracking-wide py-1 px-2.5">
                  Mode: <span className="font-semibold text-primary ml-1">{mode}</span>
                </Badge>
              </div>

              {/* Canvas Wrapper */}
              <div className="relative flex items-center justify-center min-h-[350px] bg-slate-900 border rounded-2xl overflow-hidden shadow-md">
                {points.length === 0 && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-[1px] pointer-events-none">
                    <AlertCircle className="h-10 w-10 text-white/50 mb-3" />
                    <p className="text-white text-sm font-semibold">Mark the floor boundary</p>
                    <p className="text-white/70 text-xs mt-1 max-w-[260px]">
                      Click 4 corners on the floor: TL (Top-Left), TR (Top-Right), BR (Bottom-Right), BL (Bottom-Left)
                    </p>
                  </div>
                )}
                
                <canvas
                  ref={canvasRef}
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerMove}
                  onMouseUp={handlePointerUp}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={handlePointerUp}
                  className="block max-w-full cursor-crosshair touch-none"
                />
              </div>

              {/* Guide instruction tip */}
              <div className="flex gap-2.5 items-start p-3 bg-muted/50 rounded-xl border border-dashed text-xs text-muted-foreground leading-relaxed">
                <CornerDownRight className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Tip:</strong> Click 4 points in a clockwise or counterclockwise loop. Use the <strong className="text-foreground">Move Points</strong> tool to drag and adjust any point handles.
                </div>
              </div>
            </div>

            {/* Right Column: Controls and options */}
            <div className="space-y-4">
              
              {/* Step label / Point Status */}
              <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold">2</div>
                    Corners Status
                  </div>
                  <Badge variant={points.length === 4 ? "default" : "secondary"} className="text-[10px]">
                    {points.length}/4 corners
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Top Left (TL)', 'Top Right (TR)', 'Bottom Right (BR)', 'Bottom Left (BL)'].map((lbl, idx) => (
                    <div
                      key={lbl}
                      className={`flex items-center gap-2 p-2 rounded-lg border ${
                        points[idx] ? "border-gold bg-gold/5 font-medium" : "bg-muted/40 text-muted-foreground border-transparent"
                      }`}
                    >
                      <div className={`h-2.5 w-2.5 rounded-full ${points[idx] ? "bg-gold" : "bg-border"}`} />
                      {lbl.split(' ')[0]} {lbl.split(' ')[1]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Choose Tile & Custom Tab options */}
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold">3</div>
                  Pick Tile Design
                </div>

                <Tabs defaultValue="catalog" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-3">
                    <TabsTrigger value="catalog" className="text-xs">TRUNEX Catalog</TabsTrigger>
                    <TabsTrigger value="patterns" className="text-xs">Generated Patterns</TabsTrigger>
                  </TabsList>

                  <TabsContent value="catalog" className="mt-0 outline-none">
                    <div className="max-h-[300px] overflow-y-auto pr-1">
                      <TileGallery
                        selectedId={tile && !('isPattern' in tile) ? tile.id : null}
                        onSelect={(t) => {
                          setTile(t);
                          setPreviewActive(true);
                        }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="patterns" className="mt-0 outline-none">
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
                      {PATTERN_TILES.map((pt) => (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => {
                            setTile(pt);
                            setPreviewActive(true);
                          }}
                          className={`group relative overflow-hidden rounded-xl border p-1 bg-muted/40 transition-all text-left ${
                            tile && 'isPattern' in tile && tile.id === pt.id
                              ? "border-primary ring-2 ring-primary ring-offset-1"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="aspect-square w-full">
                            <PatternThumbnail pattern={pt} size={70} />
                          </div>
                          <p className="mt-1 text-[9px] font-medium text-center truncate px-0.5">{pt.name}</p>
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Configure Dimensions Card */}
              <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold">4</div>
                  Customize Tiling
                </div>

                {/* Tile Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tile Dimensions</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={tileSize === '2x2' ? 'default' : 'outline'}
                      className="flex-1 text-xs"
                      onClick={() => setTileSize('2x2')}
                    >
                      2×2 ft (Square)
                    </Button>
                    <Button
                      type="button"
                      variant={tileSize === '2x4' ? 'default' : 'outline'}
                      className="flex-1 text-xs"
                      onClick={() => setTileSize('2x4')}
                    >
                      2×4 ft (Rect)
                    </Button>
                  </div>
                </div>

                {/* Opacity slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Tile Opacity</span>
                    <span className="font-semibold text-primary">{opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Grout Width slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Grout Line Width</span>
                    <span className="font-semibold text-primary">{groutWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={groutWidth}
                    onChange={(e) => setGroutWidth(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Grout Color selection */}
                {groutWidth > 0 && (
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-muted-foreground">Grout Color</label>
                    <input
                      type="color"
                      value={groutColor}
                      onChange={(e) => setGroutColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-border"
                    />
                  </div>
                )}
              </div>

              {/* Interactive buttons panel */}
              <div className="space-y-2 pt-2">
                <Button
                  className="w-full gold-glow"
                  disabled={!readyToApply}
                  onClick={() => {
                    setPreviewActive(true);
                    toast.success("Tile preview applied!");
                  }}
                >
                  <Check className="mr-2 h-4 w-4" /> Preview Apply Karo
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-primary/40 text-primary hover:bg-primary/5"
                  disabled={!previewActive || points.length !== 4}
                  onClick={async () => {
                    try {
                      const blob = await getWarpedCanvasBlob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.download = 'trunex-floor-preview.jpg';
                      a.href = url;
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch (err) {
                      toast.error("Download failed");
                    }
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Image
                </Button>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold"
                  disabled={!previewActive}
                  onClick={() => setStep("details")}
                >
                  Continue to Save & Redirect
                </Button>
              </div>

            </div>

          </div>
        </div>

        {/* Lead Details Step */}
        {step === "details" && (
          <div className="mx-auto max-w-md space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold">Step 3: Save Your Design</h3>
              <p className="text-sm text-muted-foreground">Tell us a bit about yourself to save this custom preview to your dashboard.</p>
            </div>
            
            <LeadFormFields
              values={values}
              errors={errors}
              onChange={(v) => setValues((p) => ({ ...p, ...v }))}
            />

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep("visualize")} disabled={busy}>
                Back
              </Button>
              <Button className="flex-1 gold-glow" disabled={busy} onClick={handleSubmit}>
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {busyMsg}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Save & View Result
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
