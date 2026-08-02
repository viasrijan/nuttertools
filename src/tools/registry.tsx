import ImageCompressor from './implementations/ImageCompressor'
import HeicToJpg from './implementations/HeicToJpg'
import FormatConverter from './implementations/FormatConverter'
import ImageOCR from './implementations/ImageOCR'
import BgRemover from './implementations/BgRemover'
import QRGenerator from './implementations/QRGenerator'
import MergePDF from './implementations/MergePDF'
import SplitPDF from './implementations/SplitPDF'
import ImagesToPDF from './implementations/ImagesToPDF'
import PDFToImages from './implementations/PDFToImages'
import JSONFormatter from './implementations/JSONFormatter'
import Base64Tool from './implementations/Base64Tool'
import WordCounter from './implementations/WordCounter'
import PasswordGen from './implementations/PasswordGen'
import PaletteExtractor from './implementations/PaletteExtractor'

const registry: Record<string, any> = {
  "image-compressor": ImageCompressor,
  "heic-to-jpg": HeicToJpg,
  "format-converter": FormatConverter,
  "image-ocr": ImageOCR,
  "bg-remover": BgRemover,
  "qr-generator": QRGenerator,
  "merge-pdf": MergePDF,
  "split-pdf": SplitPDF,
  "images-to-pdf": ImagesToPDF,
  "pdf-to-images": PDFToImages,
  "json-formatter": JSONFormatter,
  "base64-tool": Base64Tool,
  "word-counter": WordCounter,
  "password-generator": PasswordGen,
  "palette-extractor": PaletteExtractor,
}
export default registry
