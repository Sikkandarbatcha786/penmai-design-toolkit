'use client';

import { useState, useEffect } from 'react';
import { CalculatorCard } from './CalculatorCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Lock, LockOpen } from 'lucide-react';

const presets = {
  'Social Media': [
    { name: 'Instagram Post (1:1)', w: 1080, h: 1080 },
    { name: 'Instagram Story (9:16)', w: 1080, h: 1920 },
    { name: 'Facebook Post (1.91:1)', w: 1200, h: 630 },
    { name: 'Twitter Post (16:9)', w: 1600, h: 900 },
  ],
  'Print': [
    { name: 'A4', w: 2480, h: 3508 },
    { name: 'US Letter', w: 2550, h: 3300 },
    { name: 'Business Card (US)', w: 1050, h: 600 },
  ],
  'Web': [
    { name: 'Web Banner (728x90)', w: 728, h: 90 },
    { name: 'Web Banner (300x250)', w: 300, h: 250 },
    { name: 'Full HD Screen (1920x1080)', w: 1920, h: 1080 },
  ]
};

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

export default function CanvasSizeOptimizer() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [lockRatio, setLockRatio] = useState(true);
  const [ratio, setRatio] = useState(16 / 9);

  const handlePresetChange = (value: string) => {
    const [w, h] = value.split('x').map(Number);
    setWidth(w);
    setHeight(h);
    setRatio(w / h);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (lockRatio) {
      setHeight(Math.round(newWidth / ratio));
    } else {
      setRatio(newWidth / height);
    }
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (lockRatio) {
      setWidth(Math.round(newHeight * ratio));
    } else {
      setRatio(width / newHeight);
    }
  };

  const handleLockChange = (checked: boolean) => {
    setLockRatio(checked);
    if(checked) {
      setRatio(width / height);
    }
  };

  const getAspectRatio = () => {
    if (width === 0 || height === 0) return '0:0';
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  return (
    <CalculatorCard
      title="Canvas Size Optimizer"
      description="Find the perfect canvas dimensions with presets and an aspect ratio calculator."
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="presets">Common Presets</Label>
          <Select onValueChange={handlePresetChange}>
            <SelectTrigger id="presets">
              <SelectValue placeholder="Select a preset..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(presets).map(([group, options]) => (
                <div key={group}>
                  <Label className="px-2 py-1.5 text-sm font-semibold">{group}</Label>
                  {options.map(opt => <SelectItem key={opt.name} value={`${opt.w}x${opt.h}`}>{opt.name} - {opt.w}x{opt.h}px</SelectItem>)}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <Input id="width" type="number" value={width} onChange={handleWidthChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <Input id="height" type="number" value={height} onChange={handleHeightChange} />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Switch id="lock-ratio" checked={lockRatio} onCheckedChange={handleLockChange} />
            <Label htmlFor="lock-ratio" className="flex items-center cursor-pointer">
              {lockRatio ? <Lock className="mr-2" /> : <LockOpen className="mr-2 text-muted-foreground" />}
              Lock Aspect Ratio
            </Label>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">{getAspectRatio()}</p>
            <p className="text-sm text-muted-foreground">Aspect Ratio</p>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
