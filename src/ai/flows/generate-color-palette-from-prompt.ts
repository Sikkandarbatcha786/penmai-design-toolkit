'use server';
/**
 * @fileOverview Generates a color palette from a text prompt using AI.
 *
 * - generateColorPalette - A function that generates a color palette based on a text prompt.
 * - GenerateColorPaletteInput - The input type for the generateColorPalette function.
 * - GenerateColorPaletteOutput - The return type for the generateColorPalette function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateColorPaletteInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired aesthetic or mood for the color palette.'),
});
export type GenerateColorPaletteInput = z.infer<typeof GenerateColorPaletteInputSchema>;

const GenerateColorPaletteOutputSchema = z.object({
  palette: z.array(
    z.string().regex(/^#([0-9a-f]{3}){1,2}$/i)
      .describe('An array of color hex codes that represent the generated color palette.')
  ).describe('The color palette generated from the prompt.'),
});
export type GenerateColorPaletteOutput = z.infer<typeof GenerateColorPaletteOutputSchema>;

export async function generateColorPalette(input: GenerateColorPaletteInput): Promise<GenerateColorPaletteOutput> {
  return generateColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateColorPalettePrompt',
  input: {schema: GenerateColorPaletteInputSchema},
  output: {schema: GenerateColorPaletteOutputSchema},
  prompt: `You are an experienced graphic designer. Generate a color palette based on the following description: {{{prompt}}}. Return an array of hex codes. Return no more than 6 colors in the palette.

Output:
`,
});

const generateColorPaletteFlow = ai.defineFlow(
  {
    name: 'generateColorPaletteFlow',
    inputSchema: GenerateColorPaletteInputSchema,
    outputSchema: GenerateColorPaletteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
