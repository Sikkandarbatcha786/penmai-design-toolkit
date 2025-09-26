'use client';

import { useState, useMemo } from 'react';
import { CalculatorCard } from './CalculatorCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function FileSizeEstimator() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [quality, setQuality] = useState(80);

  const estimatedSize = useMemo(() => {
    const pixels = width * height;
    if (pixels === 0) return 0;
    
    let bytes = 0;
    if (format === 'jpeg') {
      // Very rough heuristic for JPEG
      const baseBytes = pixels * 3;
      const compressionFactor = 0.05 + (100 - quality) / 100 * 0.4;
      bytes = baseBytes * compressionFactor;
    } else if (format === 'png') {
      // Very rough heuristic for PNG-24 with alpha
      const rawBytes = pixels * 4;
      const compressionFactor = 0.3; // Assume average compression
      bytes = rawBytes * compressionFactor;
    }
    
    return bytes;
  }, [width, height, format, quality]);

  return (
    <CalculatorCard
      title="File Size Estimator"
      description="Get a rough estimate of image file sizes based on dimensions and format."
    >
      <div className="space-y-6">
        <Alert>
            <Info className="h-4 w-4"/>
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
                This tool provides a very rough estimate. Actual file size depends heavily on image complexity and the compression algorithm used.
            </AlertDescription>
        </Alert>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <Input id="width" type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select value={format} onValueChange={(v: 'jpeg' | 'png') => setFormat(v)}>
                    <SelectTrigger id="format">
                        <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {format === 'jpeg' && (
                <div className="space-y-2">
                    <Label htmlFor="quality">JPEG Quality ({quality})</Label>
                    <Slider id="quality" min={1} max={100} step={1} value={[quality]} onValueChange={([v]) => setQuality(v)} />
                </div>
            )}
        </div>

        <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Estimated File Size</p>
            <p className="text-3xl font-bold text-primary">{formatBytes(estimatedSize)}</p>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>SVG:</strong> File size for SVG images cannot be estimated by dimensions as it depends entirely on the complexity of the vector paths, shapes, and effects within the file.</p>
        </div>
      </div>
    </CalculatorCard>
  );
}
