import { lazy } from 'react'

const registry: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  "image-compressor": lazy(() => import('./implementations/ImageCompressor')),
  "heic-to-jpg": lazy(() => import('./implementations/HeicToJpg')),
  "format-converter": lazy(() => import('./implementations/FormatConverter')),
  "image-ocr": lazy(() => import('./implementations/ImageOCR')),
  "bg-remover": lazy(() => import('./implementations/BgRemover')),
  "qr-generator": lazy(() => import('./implementations/QRGenerator')),
  "merge-pdf": lazy(() => import('./implementations/MergePDF')),
  "split-pdf": lazy(() => import('./implementations/SplitPDF')),
  "images-to-pdf": lazy(() => import('./implementations/ImagesToPDF')),
  "pdf-to-images": lazy(() => import('./implementations/PDFToImages')),
  "json-formatter": lazy(() => import('./implementations/JSONFormatter')),
  "base64-tool": lazy(() => import('./implementations/Base64Tool')),
  "word-counter": lazy(() => import('./implementations/WordCounter')),
  "password-generator": lazy(() => import('./implementations/PasswordGen')),
  "palette-extractor": lazy(() => import('./implementations/PaletteExtractor')),
}
export default registry
