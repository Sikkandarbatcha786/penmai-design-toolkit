'use client';

import { useState, useMemo, useCallback } from 'react';
import { CalculatorCard } from './CalculatorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, RefreshCw, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { hexToRgb, hexToHsl, hslToHex, rgbToCmyk, hslToRgb } from '@/lib/color-utils';

const popularPalettes = {
  "Material": ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5"],
  "Flat UI": ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e"],
  "Pastel": ["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"],
  "Vibrant": ["#FF3E4D", "#FFC900", "#00A7FF", "#00E096", "#9D00FF"],
  "Neutral": ["#232323", "#4f4f4f", "#828282", "#bdbdbd", "#f2f2f2"],
};

type HarmonyType = 'complementary' | 'triadic' | 'analogous' | 'tetradic' | 'monochromatic';

const generateHarmony = (baseColor: string, type: HarmonyType): string[] => {
    const baseHsl = hexToHsl(baseColor);
    if (!baseHsl) return [baseColor];

    const { h, s, l } = baseHsl;
    let palette: string[] = [baseColor];

    switch (type) {
        case 'complementary':
            palette.push(hslToHex((h + 180) % 360, s, l));
            break;
        case 'triadic':
            palette.push(hslToHex((h + 120) % 360, s, l));
            palette.push(hslToHex((h + 240) % 360, s, l));
            break;
        case 'analogous':
            palette.push(hslToHex((h + 30) % 360, s, l));
            palette.push(hslToHex((h - 30 + 360) % 360, s, l));
            break;
        case 'tetradic':
            palette.push(hslToHex((h + 90) % 360, s, l));
            palette.push(hslToHex((h + 180) % 360, s, l));
            palette.push(hslToHex((h + 270) % 360, s, l));
            break;
        case 'monochromatic':
            palette.push(hslToHex(h, s, Math.min(100, l + 20)));
            palette.push(hslToHex(h, s, Math.max(0, l - 20)));
            palette.push(hslToHex(h, s, Math.min(100, l + 40)));
            palette.push(hslToHex(h, s, Math.max(0, l - 40)));
            break;
    }
    return palette.slice(0, 5);
};

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#2E9AFE');
  const [harmony, setHarmony] = useState<HarmonyType>('analogous');
  const [currentPalette, setCurrentPalette] = useState<string[]>(generateHarmony(baseColor, harmony));
  const { toast } = useToast();

  const handleBaseColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBaseColor(newColor);
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      setCurrentPalette(generateHarmony(newColor, harmony));
    }
  };

  const handleHarmonyChange = (value: HarmonyType) => {
    setHarmony(value);
    setCurrentPalette(generateHarmony(baseColor, value));
  };
  
  const handlePopularPaletteChange = (value: string) => {
    const palette = popularPalettes[value as keyof typeof popularPalettes];
    setCurrentPalette(palette);
    setBaseColor(palette[0]);
  };

  const handleRandomPalette = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    setBaseColor(randomColor);
    setCurrentPalette(generateHarmony(randomColor, harmony));
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!", description: text });
  };

  const ColorInfo = ({ color }: { color: string }) => {
    const rgb = hexToRgb(color);
    const hsl = hexToHsl(color);
    const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;
    return (
      <div className="space-y-1">
        {rgb && <p>RGB: {rgb.r}, {rgb.g}, {rgb.b}</p>}
        {hsl && <p>HSL: {hsl.h}, {hsl.s}%, {hsl.l}%</p>}
        {cmyk && <p>CMYK: {cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}</p>}
      </div>
    );
  };
  
  return (
    <CalculatorCard
      title="Color Palette Generator"
      description="Create beautiful color palettes based on harmonies or popular presets."
    >
        <Tabs defaultValue="harmony" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="harmony">Color Harmony</TabsTrigger>
                <TabsTrigger value="popular">Popular Palettes</TabsTrigger>
            </TabsList>
            <TabsContent value="harmony" className="mt-4 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="base-color">Base Color</Label>
                        <div className="flex items-center gap-2">
                            <Input type="color" value={baseColor} onChange={handleBaseColorChange} className="w-12 h-10 p-1"/>
                            <Input id="base-color" value={baseColor} onChange={handleBaseColorChange} className="font-mono"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="harmony-type">Harmony</Label>
                        <Select value={harmony} onValueChange={handleHarmonyChange}>
                            <SelectTrigger id="harmony-type">
                                <SelectValue placeholder="Select harmony type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="analogous">Analogous</SelectItem>
                                <SelectItem value="monochromatic">Monochromatic</SelectItem>
                                <SelectItem value="complementary">Complementary</SelectItem>
                                <SelectItem value="triadic">Triadic</SelectItem>
                                <SelectItem value="tetradic">Tetradic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <Button onClick={handleRandomPalette} variant="outline">
                    <RefreshCw className="mr-2" />
                    Random Palette
                </Button>
            </TabsContent>
            <TabsContent value="popular" className="mt-4 space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="popular-palette">Select a Popular Palette</Label>
                     <Select onValueChange={handlePopularPaletteChange}>
                        <SelectTrigger id="popular-palette">
                            <SelectValue placeholder="Select a popular palette..." />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(popularPalettes).map(name => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </TabsContent>
        </Tabs>
      
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-lg">Generated Palette</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {currentPalette.map((color) => (
              <TooltipProvider key={color}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group flex flex-col items-center justify-center aspect-square rounded-lg transition-transform hover:scale-105" style={{ backgroundColor: color }}>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button onClick={() => copyToClipboard(color)} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40">
                        <Copy size={14} />
                      </button>
                      <p className="font-mono text-sm font-semibold mix-blend-difference text-white">{color.toUpperCase()}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <ColorInfo color={color} />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
           <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Palette Preview</h4>
                <div className="flex h-20 w-full rounded-md overflow-hidden">
                    {currentPalette.map(color => (
                        <div key={color} style={{ backgroundColor: color, width: `${100 / currentPalette.length}%` }} />
                    ))}
                </div>
            </div>
        </div>
    </CalculatorCard>
  );
}
