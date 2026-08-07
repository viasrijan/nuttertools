import {
  Apple, ArrowRightLeft, AudioLines, AudioWaveform, Binary, BookMarked, BookOpen,
  Bot, Braces, Briefcase, CalendarDays, Camera, Captions, CaseUpper, ChefHat,
  CircleDot, Clapperboard, Clock, Code, Coins, Combine, Contrast, Copy, Crop, Database, Diff, Dices,
  Droplets,   Eraser, Eye, Feather, FileArchive, FileCog, FileCode, FileDown, FileImage, FileOutput,
  FilePlus, FileSearch, FileSpreadsheet, FileText, FileType, FileUp, FileVideo, Film,
  Fingerprint, FolderArchive, Gauge, Ghost, Globe, Hash, IdCard, Image as ImageIcon, ImagePlus,
  Keyboard, KeyRound, Languages, Link, Link2, ListOrdered, Lock, LockKeyhole, Maximize2,
  Mic, Minimize2, Monitor, Music, Music2, Network, PaintBucket, Palette, PenLine, Percent,
  Pipette, QrCode, Radio, Rainbow, Receipt, Regex, Repeat, Repeat2, Rotate3d, RotateCcw,
  RotateCw, Ruler, ScanText, Scissors, ScrollText, Server, Shapes, Share2, Shield,
  ShieldCheck, Sigma, Slice, SlidersHorizontal, Smile, SmilePlus, Speaker, Sparkles,
  SwatchBook, Table2, Tags, Terminal, TextQuote, Timer, Type, Undo2, Video, VolumeX,
  Wand2, Waves, Weight, Wind, Wrench, ZoomIn,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const TOOL_ICONS: Record<string, LucideIcon> = {
  'image-compressor': Minimize2,
  'heic-to-jpg': Apple,
  'format-converter': Repeat,
  'image-ocr': ScanText,
  'bg-remover': Wand2,
  'qr-generator': QrCode,
  'image-resizer': Maximize2,
  'image-cropper': Crop,
  'image-filters': SlidersHorizontal,
  'merge-pdf': Combine,
  'split-pdf': Scissors,
  'images-to-pdf': FileImage,
  'pdf-to-images': FileOutput,
  'compress-pdf': FileDown,
  'rotate-pdf': RotateCw,
  'pdf-text-extract': FileSearch,
  'pdf-page-numbers': ListOrdered,
  'pdf-watermark': Droplets,
  'pdf-protect': Lock,
  'word-to-pdf': FileType,
  'pdf-to-word': FileUp,
  'pdf-viewer': BookOpen,
  'json-formatter': Braces,
  'regex-tester': Regex,
  'jwt-tool': IdCard,
  'html-jsx': FileCode,
  'css-tailwind': Wind,
  'minify-beautify': Sparkles,
  'cron-generator': Clock,
  'hash-generator': Hash,
  'uuid-generator': Fingerprint,
  'env-generator': FileCog,
  'readme-generator': BookMarked,
  'curl-to-fetch': Terminal,
  'chmod-calc': Shield,
  'yaml-json': ArrowRightLeft,
  'html-preview': Eye,
  'sql-formatter': Database,
  'base64-tool': Binary,
  'password-generator': KeyRound,
  'bcrypt-tool': LockKeyhole,
  'url-encoder': Link,
  'morse-code': AudioWaveform,
  'binary-converter': Sigma,
  'caesar-cipher': RotateCcw,
  'text-encryptor': ShieldCheck,
  'word-counter': Type,
  'case-converter': CaseUpper,
  'dedupe-lines': Copy,
  'tts-stt': Speaker,
  'lorem-generator': TextQuote,
  'markdown-editor': FileText,
  'diff-checker': Diff,
  'slug-generator': Link2,
  'whitespace-cleaner': Eraser,
  'invoice-generator': Receipt,
  'resume-builder': Briefcase,
  'text-reverser': Undo2,
  'emoji-remover': Ghost,
  'palette-extractor': Palette,
  'color-picker': Pipette,
  'hex-rgb': PaintBucket,
  'gradient-generator': Rainbow,
  'shadow-generator': Shapes,
  'contrast-checker': Contrast,
  'blob-maker': Waves,
  'css-color-converter': SwatchBook,
  'color-shades': CircleDot,
  'video-compressor': FileVideo,
  'video-to-mp3': Music,
  'video-to-gif': Film,
  'mp4-to-webm': Repeat2,
  'video-trimmer': Slice,
  'video-muter': VolumeX,
  'video-rotator': Rotate3d,
  'video-speed': Gauge,
  'gif-to-video': Clapperboard,
  'audio-converter': AudioLines,
  'audio-trimmer': Music2,
  'voice-recorder': Mic,
  'audio-transcriber': Captions,
  'tone-generator': Radio,
  'csv-json': Table2,
  'excel-to-pdf': FileSpreadsheet,
  'zip-tool': FileArchive,
  'bulk-renamer': PenLine,
  'txt-to-pdf': FilePlus,
  'meta-generator': Tags,
  'og-previewer': Monitor,
  'og-generator': ImagePlus,
  'sitemap-gen': Network,
  'utm-builder': Share2,
  'ip-info': Globe,
  'robots-txt': Bot,
  'http-status': Server,
  'unit-converter': Ruler,
  'age-calc': CalendarDays,
  'percent-calc': Percent,
  'screen-recorder': Camera,
  'typing-test': Keyboard,
  'pomodoro': Timer,
  'bmi-calculator': Weight,
  'tip-calculator': Coins,
  'random-number': Dices,
  'image-upscaler': ZoomIn,
  'image-captioner': SmilePlus,
  'summarizer': ScrollText,
  'translator': Languages,
  'sentiment': Smile,
  'recipe-generator': ChefHat,
  'poem-generator': Feather,
}

const CAT_ICONS: Record<string, LucideIcon> = {
  'image-tools': ImageIcon,
  'pdf-tools': FileText,
  'developer-tools': Code,
  'encoding-security': Lock,
  'text-writing': PenLine,
  'color-design': Palette,
  'video-tools': Video,
  'audio-tools': Music,
  'file-tools': FolderArchive,
  'web-seo': Globe,
  'everyday-utilities': Wrench,
  'ai-tools': Sparkles,
}

export function ToolIcon({ id, className }: { id: string, className?: string }) {
  const C = TOOL_ICONS[id] || Wrench
  return <C className={className} strokeWidth={1.9} aria-hidden="true" />
}

export function CategoryIcon({ slug, className }: { slug: string, className?: string }) {
  const C = CAT_ICONS[slug] || Wrench
  return <C className={className} strokeWidth={1.9} aria-hidden="true" />
}

const base = new URL(import.meta.env.BASE_URL, window.location.href).toString()

export const toolIconUrl = (id: string) => `${base}icons/${id}.png`

export const catIconUrl = (slug: string) => `${base}icons/cat-${slug}.png`

export function CutoutToolIcon({ id, className, tone }: { id: string, className?: string, tone?: string }) {
  return <img src={toolIconUrl(id)} alt="" className={className} draggable={false} />
}

export function CutoutCategoryIcon({ slug, className, tone }: { slug: string, className?: string, tone?: string }) {
  return <img src={catIconUrl(slug)} alt="" className={className} draggable={false} />
}
