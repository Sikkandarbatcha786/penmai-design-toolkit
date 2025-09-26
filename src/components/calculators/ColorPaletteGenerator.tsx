'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generatePaletteAction, type ColorPaletteState } from '@/app/actions';
import { CalculatorCard } from './CalculatorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { hexToRgb, rgbToCmyk } from '@/lib/color-utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate Palette
    </Button>
  );
}

export default function ColorPaletteGenerator() {
  const initialState: ColorPaletteState = {};
  const [state, dispatch] = useActionState(generatePaletteAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state, toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!", description: text });
  };
  
  return (
    <CalculatorCard
      title="AI Color Palette Generator"
      description="Describe a theme or mood, and let AI generate a beautiful color palette for you."
    >
      <form action={dispatch} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input id="prompt" name="prompt" placeholder="e.g., 'calm sunset over a beach'" className="flex-grow" />
            <SubmitButton />
          </div>
          {state?.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}
        </div>
      </form>
      
      {state.palette && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-lg">Generated Palette</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {state.palette.map((color) => {
              const rgb = hexToRgb(color);
              const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;
              return (
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
                      {rgb && <p>RGB: {rgb.r}, {rgb.g}, {rgb.b}</p>}
                      {cmyk && <p>CMYK: {cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      )}
    </CalculatorCard>
  );
}
