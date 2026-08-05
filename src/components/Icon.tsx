import {
  Apple, ArrowRightLeft, AudioLines, AudioWaveform, Binary, BookMarked, BookOpen,
  Box, Bot, Braces, Briefcase, CalendarDays, Camera, Captions, CaseUpper, ChefHat,
  Clapperboard, Code, Coins, Combine, Contrast, Copy, Crop, Database, Diff, Dices,
  Droplets, Eraser, Eye, Feather, FileArchive, FileCode, FileDown, FileImage, FileOutput,
  FilePlus, FileSearch, FileSpreadsheet, FileText, FileUp, FileVideo, Film, Fingerprint,
  FolderArchive, Gauge, Ghost, Globe, Hash, IdCard, Image as ImageIcon, Keyboard, Languages,
  KeyRound, Link, Link2, Lock, LockKeyhole, Maximize2, Mic, Monitor, Music, Music2, Network,
  PaintBucket, Palette, PenLine, Percent, Pipette, QrCode, Radio, Rainbow, Receipt,
  Repeat, RotateCcw, RotateCw, Ruler, ScanText, Scissors, ScrollText, Server, Share2,
  Shapes, Shield, ShieldCheck, Shrink, Sigma, Slice, SlidersHorizontal, Smile, Sparkles,
  Speaker, Table2, Tags, Terminal, TextQuote, Timer, Type, Video, VolumeX,
  Wand2, Waves, Weight, Wind, Wrench, ZoomIn,
} from 'lucide-react'
import { useId } from 'react'
import type { LucideIcon } from 'lucide-react'

const TOOL_ICONS: Record<string, LucideIcon> = {
  'image-compressor': Shrink,
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
  'pdf-page-numbers': Hash,
  'pdf-watermark': Droplets,
  'pdf-protect': Lock,
  'word-to-pdf': FileDown,
  'pdf-to-word': FileUp,
  'pdf-viewer': BookOpen,
  'json-formatter': Braces,
  'regex-tester': Code,
  'jwt-tool': IdCard,
  'html-jsx': Code,
  'css-tailwind': Wind,
  'minify-beautify': Sparkles,
  'cron-generator': Timer,
  'hash-generator': Hash,
  'uuid-generator': Fingerprint,
  'env-generator': FileCode,
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
  'markdown-editor': FileCode,
  'diff-checker': Diff,
  'slug-generator': Link2,
  'whitespace-cleaner': Eraser,
  'invoice-generator': Receipt,
  'resume-builder': Briefcase,
  'text-reverser': ArrowRightLeft,
  'emoji-remover': Ghost,
  'palette-extractor': Palette,
  'color-picker': Pipette,
  'hex-rgb': PaintBucket,
  'gradient-generator': Rainbow,
  'shadow-generator': Box,
  'contrast-checker': Contrast,
  'blob-maker': Waves,
  'css-color-converter': Palette,
  'color-shades': Rainbow,
  'video-compressor': FileVideo,
  'video-to-mp3': Music,
  'video-to-gif': Film,
  'mp4-to-webm': Repeat,
  'video-trimmer': Slice,
  'video-muter': VolumeX,
  'video-rotator': RotateCw,
  'video-speed': Gauge,
  'gif-to-video': Clapperboard,
  'audio-converter': AudioLines,
  'audio-trimmer': Music2,
  'voice-recorder': Mic,
  'audio-transcriber': Captions,
  'tone-generator': AudioWaveform,
  'csv-json': Table2,
  'excel-to-pdf': FileSpreadsheet,
  'zip-tool': FileArchive,
  'bulk-renamer': PenLine,
  'txt-to-pdf': FilePlus,
  'meta-generator': Tags,
  'og-previewer': Eye,
  'og-generator': ImageIcon,
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
  'image-captioner': Smile,
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

export function CutoutIcon({ icon: C, className, strokeWidth = 2.2 }: { icon: LucideIcon, className?: string, strokeWidth?: number }) {
  const raw = useId()
  const id = `cutout-${raw.replace(/[^a-zA-Z0-9-]/g, '')}`
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <mask id={id}>
          <circle cx="12" cy="12" r="11" fill="#fff" />
          <C stroke="#000" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </mask>
      </defs>
      <circle cx="12" cy="12" r="11" fill="#fff" mask={`url(#${id})`} />
    </svg>
  )
}

export function CutoutToolIcon({ id, className }: { id: string, className?: string }) {
  return <CutoutIcon icon={TOOL_ICONS[id] || Wrench} className={className} />
}

export function CutoutCategoryIcon({ slug, className }: { slug: string, className?: string }) {
  return <CutoutIcon icon={CAT_ICONS[slug] || Wrench} className={className} />
}
