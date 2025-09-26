'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalculatorCard } from './CalculatorCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const presets = [
  { name: 'Business Card (US)', w_in: 3.5, h_in: 2 },
  { name: 'A4', w_in: 8.27, h_in: 11.69 },
  { name: 'US Letter', w_in: 8.5, h_in: 11 },
  { name: '1080p Screen', w_px: 1920, h_px: 1080, dpi: 72 },
];

const round = (num: number) => Math.round(num * 100) / 100;

export default function PrintResolutionCalculator() {
  const [width, setWidth] = useState('1050');
  const [height, setHeight] = useState('600');
  const [dpi, setDpi] = useState('300');
  const [unit, setUnit] = useState('px');
  const [lastChanged, setLastChanged] = useState('px');

  const calculateValues = useCallback((value: string, currentUnit: string, currentDpi: string, field: 'width' | 'height') => {
    const numValue = parseFloat(value) || 0;
    const numDpi = parseFloat(currentDpi) || 72;

    if (currentUnit === 'px') {
      const inValue = numValue / numDpi;
      const cmValue = inValue * 2.54;
      return { px: numValue, in: round(inValue), cm: round(cmValue) };
    } else if (currentUnit === 'in') {
      const pxValue = numValue * numDpi;
      const cmValue = numValue * 2.54;
      return { px: round(pxValue), in: numValue, cm: round(cmValue) };
    } else { // cm
      const inValue = numValue / 2.54;
      const pxValue = inValue * numDpi;
      return { px: round(pxValue), in: round(inValue), cm: numValue };
    }
  }, []);

  const values = {
    width: calculateValues(width, lastChanged === 'width' ? unit : 'px', dpi, 'width'),
    height: calculateValues(height, lastChanged === 'height' ? unit : 'px', dpi, 'height')
  };

  const getDisplayValue = (dimension: 'width' | 'height') => {
    if (unit === 'px') return values[dimension].px.toString();
    if (unit === 'in') return values[dimension].in.toString();
    return values[dimension].cm.toString();
  };
  
  const handlePreset = (preset: typeof presets[0]) => {
    const newDpi = preset.dpi || 300;
    setDpi(newDpi.toString());
    if (preset.w_px) {
      setWidth(preset.w_px.toString());
      setHeight(preset.h_px.toString());
      setUnit('px');
      setLastChanged('px');
    } else {
      setWidth(preset.w_in.toString());
      setHeight(preset.h_in.toString());
      setUnit('in');
      setLastChanged('in');
    }
  };


  return (
    <CalculatorCard
      title="Print Resolution Calculator"
      description="Calculate dimensions in pixels, inches, or centimeters based on DPI/PPI."
    >
      <div className="space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dpi">DPI / PPI</Label>
            <Input id="dpi" value={dpi} onChange={(e) => setDpi(e.target.value)} placeholder="e.g., 300" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <Input id="width" value={width} onChange={(e) => { setWidth(e.target.value); setLastChanged('width'); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input id="height" value={height} onChange={(e) => { setHeight(e.target.value); setLastChanged('height'); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Select value={unit} onValueChange={(value) => {
              const currentW = getDisplayValue('width');
              const currentH = getDisplayValue('height');
              setUnit(value);
              setWidth(currentW);
              setHeight(currentH);
            }}>
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">Pixels (px)</SelectItem>
                <SelectItem value="in">Inches (in)</SelectItem>
                <SelectItem value="cm">Centimeters (cm)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Presets</Label>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => <Button key={p.name} variant="outline" onClick={() => handlePreset(p)}>{p.name}</Button>)}
          </div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h3 className="font-semibold text-lg">Calculated Dimensions</h3>
            <p className="text-sm text-muted-foreground">
              {calculateValues(width, unit, dpi, 'width').px}px × {calculateValues(height, unit, dpi, 'height').px}px
            </p>
            <p className="text-sm text-muted-foreground">
              {calculateValues(width, unit, dpi, 'width').in}" × {calculateValues(height, unit, dpi, 'height').in}"
            </p>
            <p className="text-sm text-muted-foreground">
              {calculateValues(width, unit, dpi, 'width').cm}cm × {calculateValues(height, unit, dpi, 'height').cm}cm
            </p>
        </div>
      </div>
    </CalculatorCard>
  );
}
