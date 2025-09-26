'use server';

import { generateColorPalette } from "@/ai/flows/generate-color-palette-from-prompt";
import { z } from "zod";

const colorPaletteSchema = z.object({
  prompt: z.string().min(3, { message: "Prompt must be at least 3 characters long." }),
});

export type ColorPaletteState = {
  palette?: string[];
  error?: string;
  message?: string;
};

export async function generatePaletteAction(
  prevState: ColorPaletteState,
  formData: FormData
): Promise<ColorPaletteState> {
  const validatedFields = colorPaletteSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.prompt?.[0],
    };
  }

  try {
    const result = await generateColorPalette({ prompt: validatedFields.data.prompt });
    if (result.palette && result.palette.length > 0) {
      return { palette: result.palette, message: "Palette generated successfully." };
    } else {
      return { error: "The AI could not generate a palette from this prompt. Please try a different one." };
    }
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred while contacting the AI. Please try again later." };
  }
}
