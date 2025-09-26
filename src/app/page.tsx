import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Ratio, Palette, Type, FileBox } from "lucide-react"

import PrintResolutionCalculator from "@/components/calculators/PrintResolutionCalculator"
import CanvasSizeOptimizer from "@/components/calculators/CanvasSizeOptimizer"
import ColorPaletteGenerator from "@/components/calculators/ColorPaletteGenerator"
import TypographyScaleCalculator from "@/components/calculators/TypographyScaleCalculator"
import FileSizeEstimator from "@/components/calculators/FileSizeEstimator"


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 bg-background transition-colors duration-300">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-headline font-bold text-foreground">Design Toolkit</h1>
          <p className="text-muted-foreground mt-2">A comprehensive suite of tools for graphic designers.</p>
        </header>
        
        <Tabs defaultValue="resolution" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
            <TabsTrigger value="resolution" className="py-2"><Calculator className="mr-2" /> Resolution</TabsTrigger>
            <TabsTrigger value="canvas" className="py-2"><Ratio className="mr-2" /> Canvas</TabsTrigger>
            <TabsTrigger value="color" className="py-2"><Palette className="mr-2" /> Color</TabsTrigger>
            <TabsTrigger value="typography" className="py-2"><Type className="mr-2" /> Typography</TabsTrigger>
            <TabsTrigger value="filesize" className="py-2"><FileBox className="mr-2" /> File Size</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 animate-in fade-in-50 duration-500">
            <TabsContent value="resolution">
              <PrintResolutionCalculator />
            </TabsContent>
            <TabsContent value="canvas">
              <CanvasSizeOptimizer />
            </TabsContent>
            <TabsContent value="color">
              <ColorPaletteGenerator />
            </TabsContent>
            <TabsContent value="typography">
              <TypographyScaleCalculator />
            </TabsContent>
            <TabsContent value="filesize">
              <FileSizeEstimator />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}
