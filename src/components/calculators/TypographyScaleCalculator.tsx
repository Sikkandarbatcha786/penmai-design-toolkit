'use client';

import { useState, useMemo } from 'react';
import { CalculatorCard } from './CalculatorCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const scales = [
  { name: 'Minor Second', value: '1.067' },
  { name: 'Major Second', value: '1.125' },
  { name: 'Minor Third', value: '1.200' },
  { name: 'Major Third', value: '1.250' },
  { name: 'Perfect Fourth', value: '1.333' },
  { name: 'Augmented Fourth', value: '1.414' },
  { name: 'Perfect Fifth', value: '1.500' },
  { name: 'Golden Ratio', value: '1.618' },
];

export default function TypographyScaleCalculator() {
  const [baseSize, setBaseSize] = useState(16);
  const [scale, setScale] = useState(1.250);
  const [steps, setSteps] = useState(5);
  const [lineHeightRatio, setLineHeightRatio] = useState(1.5);

  const typographyScale = useMemo(() => {
    const result = [];
    // From base size up
    for (let i = 0; i < steps; i++) {
      const size = baseSize * Math.pow(scale, i);
      result.push({
        step: i,
        size: parseFloat(size.toFixed(2)),
        lineHeight: parseFloat((size * lineHeightRatio).toFixed(2)),
      });
    }
    return result.reverse();
  }, [baseSize, scale, steps, lineHeightRatio]);
  
  return (
    <CalculatorCard
      title="Typography Scale Calculator"
      description="Create a harmonious modular scale for your typography."
    >
      <div className="space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="base-size">Base Size (px)</Label>
            <Input id="base-size" type="number" value={baseSize} onChange={(e) => setBaseSize(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scale">Scale</Label>
            <Select value={scale.toString()} onValueChange={(v) => setScale(Number(v))}>
              <SelectTrigger id="scale">
                <SelectValue placeholder="Select a scale" />
              </SelectTrigger>
              <SelectContent>
                {scales.map(s => <SelectItem key={s.name} value={s.value}>{s.name} ({s.value})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="steps">Steps ({steps})</Label>
            <Slider id="steps" min={2} max={10} step={1} value={[steps]} onValueChange={([v]) => setSteps(v)} />
          </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="line-height">Line Height Ratio ({lineHeightRatio.toFixed(2)})</Label>
            <Slider id="line-height" min={1} max={2} step={0.05} value={[lineHeightRatio]} onValueChange={([v]) => setLineHeightRatio(v)} />
        </div>
        
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead className="text-right">Font Size (px)</TableHead>
                <TableHead className="text-right">Line Height (px)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typographyScale.map((item) => (
                <TableRow key={item.step} className={item.step === 0 ? 'bg-primary/10' : ''}>
                  <TableCell className="font-medium">{item.step === 0 ? 'Base' : `Step ${item.step > 0 ? '+' : ''}${item.step}`}</TableCell>
                  <TableCell className="text-right font-mono">{item.size}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{item.lineHeight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </CalculatorCard>
  );
}
