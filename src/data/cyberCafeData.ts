import {
  Image, FileText, Printer, Scan, QrCode, Calculator, Folder, FileImage, 
  Settings, Grid, Type, Camera, Zap, Receipt, Crop, PaintBucket,
  Scissors, Shuffle, Copy, Eye, Clock, Divide, AlignLeft,
  FileCheck, Shield, Layers, Barcode, Phone, ImagePlus, Wifi, Link, 
  Smartphone, Trash, RefreshCcw, Edit2, Briefcase, Hash, ShieldOff, CreditCard, Expand, Sun, Edit
} from 'lucide-react';

export const CYBER_CAFE_CATEGORIES = [
  { id: 'PHOTO_IMAGE', name: 'PHOTO & IMAGE TOOLS', icon: Image },
  { id: 'PDF', name: 'PDF TOOLS', icon: FileText },
  { id: 'DOCUMENT', name: 'DOCUMENT TOOLS', icon: FileCheck },
  { id: 'PRINTING', name: 'PRINTING TOOLS', icon: Printer },
  { id: 'SCAN_OCR', name: 'SCAN & OCR', icon: Scan },
  { id: 'QR_BARCODE', name: 'QR & BARCODE', icon: QrCode },
  { id: 'DAILY_USE', name: 'DAILY USE TOOLS', icon: Calculator },
  { id: 'FILE', name: 'FILE TOOLS', icon: Folder }
] as const;

export type CategoryId = typeof CYBER_CAFE_CATEGORIES[number]['id'];

export interface ToolItem {
  id: string;
  categoryId: CategoryId;
  name: string;
  icon: any;
  componentKey: string;
}

export const CYBER_CAFE_TOOLS: ToolItem[] = [
  // PHOTO & IMAGE TOOLS
  { id: 'photo-resize', categoryId: 'PHOTO_IMAGE', name: 'Photo Resize', icon: Image, componentKey: 'IMAGE_EDITOR' },
  { id: 'photo-crop', categoryId: 'PHOTO_IMAGE', name: 'Photo Crop', icon: Crop, componentKey: 'IMAGE_EDITOR' },
  { id: 'photo-compress', categoryId: 'PHOTO_IMAGE', name: 'Photo Compress', icon: Zap, componentKey: 'IMAGE_EDITOR' },
  { id: 'kb-size', categoryId: 'PHOTO_IMAGE', name: 'KB Size Converter', icon: Settings, componentKey: 'IMAGE_EDITOR' },
  { id: 'dpi-converter', categoryId: 'PHOTO_IMAGE', name: 'DPI Converter', icon: Settings, componentKey: 'IMAGE_EDITOR' },
  { id: 'res-changer', categoryId: 'PHOTO_IMAGE', name: 'Resolution Changer', icon: Grid, componentKey: 'IMAGE_EDITOR' },
  { id: 'passport-maker', categoryId: 'PHOTO_IMAGE', name: 'Passport Photo Maker', icon: FileImage, componentKey: 'IMAGE_EDITOR' },
  { id: 'passport-sheet', categoryId: 'PHOTO_IMAGE', name: 'Passport Photo Sheet', icon: Layers, componentKey: 'PRINT_LAYOUT' },
  { id: 'a4-sheet', categoryId: 'PHOTO_IMAGE', name: 'A4 Photo Sheet Maker', icon: Layers, componentKey: 'PRINT_LAYOUT' },
  { id: 'bg-remove', categoryId: 'PHOTO_IMAGE', name: 'Background Remover', icon: Scissors, componentKey: 'IMAGE_EDITOR' },
  { id: 'bg-change', categoryId: 'PHOTO_IMAGE', name: 'Background Changer', icon: PaintBucket, componentKey: 'IMAGE_EDITOR' },
  { id: 'sign-crop', categoryId: 'PHOTO_IMAGE', name: 'Signature Crop', icon: Crop, componentKey: 'IMAGE_EDITOR' },
  { id: 'sign-bg', categoryId: 'PHOTO_IMAGE', name: 'Signature Background Remover', icon: Scissors, componentKey: 'IMAGE_EDITOR' },
  { id: 'jpg-png', categoryId: 'PHOTO_IMAGE', name: 'JPG ↔ PNG', icon: Shuffle, componentKey: 'IMAGE_EDITOR' },
  { id: 'jpg-webp', categoryId: 'PHOTO_IMAGE', name: 'JPG ↔ WebP', icon: Shuffle, componentKey: 'IMAGE_EDITOR' },
  { id: 'img-rotate', categoryId: 'PHOTO_IMAGE', name: 'Image Rotate', icon: RefreshCcw, componentKey: 'IMAGE_EDITOR' },
  { id: 'img-flip', categoryId: 'PHOTO_IMAGE', name: 'Image Flip', icon: Shuffle, componentKey: 'IMAGE_EDITOR' },
  { id: 'img-ocr', categoryId: 'PHOTO_IMAGE', name: 'Image to Text (OCR)', icon: Type, componentKey: 'SCAN_OCR' },
  { id: 'color-bw', categoryId: 'PHOTO_IMAGE', name: 'Color Photo to Black & White', icon: PaintBucket, componentKey: 'IMAGE_EDITOR' },
  { id: 'img-bright', categoryId: 'PHOTO_IMAGE', name: 'Image Brightness/Contrast', icon: Sun, componentKey: 'IMAGE_EDITOR' },
  { id: 'img-combine', categoryId: 'PHOTO_IMAGE', name: 'Multiple Images Combine', icon: ImagePlus, componentKey: 'IMAGE_EDITOR' },

  // PDF TOOLS
  { id: 'jpg-pdf', categoryId: 'PDF', name: 'JPG to PDF', icon: FileText, componentKey: 'PDF_TOOL' },
  { id: 'png-pdf', categoryId: 'PDF', name: 'PNG to PDF', icon: FileText, componentKey: 'PDF_TOOL' },
  { id: 'pdf-jpg', categoryId: 'PDF', name: 'PDF to JPG', icon: Image, componentKey: 'PDF_TOOL' },
  { id: 'pdf-png', categoryId: 'PDF', name: 'PDF to PNG', icon: Image, componentKey: 'PDF_TOOL' },
  { id: 'pdf-merge', categoryId: 'PDF', name: 'PDF Merge', icon: Layers, componentKey: 'PDF_TOOL' },
  { id: 'pdf-split', categoryId: 'PDF', name: 'PDF Split', icon: Scissors, componentKey: 'PDF_TOOL' },
  { id: 'pdf-compress', categoryId: 'PDF', name: 'PDF Compress', icon: Zap, componentKey: 'PDF_TOOL' },
  { id: 'pdf-delete', categoryId: 'PDF', name: 'Delete PDF Pages', icon: Trash, componentKey: 'PDF_TOOL' },
  { id: 'pdf-reorder', categoryId: 'PDF', name: 'Reorder PDF Pages', icon: Shuffle, componentKey: 'PDF_TOOL' },
  { id: 'pdf-rotate', categoryId: 'PDF', name: 'Rotate PDF', icon: RefreshCcw, componentKey: 'PDF_TOOL' },
  { id: 'pdf-text', categoryId: 'PDF', name: 'Add Text to PDF', icon: Type, componentKey: 'PDF_TOOL' },
  { id: 'pdf-sign', categoryId: 'PDF', name: 'Add Signature to PDF', icon: Edit2, componentKey: 'PDF_TOOL' },
  { id: 'pdf-img', categoryId: 'PDF', name: 'Add Image to PDF', icon: ImagePlus, componentKey: 'PDF_TOOL' },
  { id: 'pdf-pagenum', categoryId: 'PDF', name: 'PDF Page Number', icon: Hash, componentKey: 'PDF_TOOL' },
  { id: 'pdf-totext', categoryId: 'PDF', name: 'PDF to Text', icon: AlignLeft, componentKey: 'PDF_TOOL' },
  { id: 'pdf-protect', categoryId: 'PDF', name: 'Password Protect PDF', icon: Shield, componentKey: 'PDF_TOOL' },
  { id: 'pdf-unlock', categoryId: 'PDF', name: 'Remove PDF Password', icon: ShieldOff, componentKey: 'PDF_TOOL' },
  { id: 'img-topdf', categoryId: 'PDF', name: 'Multiple Images to Single PDF', icon: FileText, componentKey: 'PDF_TOOL' },

  // DOCUMENT TOOLS
  { id: 'app-maker', categoryId: 'DOCUMENT', name: 'Application Maker', icon: FileText, componentKey: 'DOCUMENT_MAKER' },
  { id: 'prarthana-maker', categoryId: 'DOCUMENT', name: 'Prarthana Patra Maker', icon: FileText, componentKey: 'DOCUMENT_MAKER' },
  { id: 'dec-maker', categoryId: 'DOCUMENT', name: 'Declaration Maker', icon: FileCheck, componentKey: 'DOCUMENT_MAKER' },
  { id: 'consent-maker', categoryId: 'DOCUMENT', name: 'Consent Letter Maker', icon: FileCheck, componentKey: 'DOCUMENT_MAKER' },
  { id: 'receipt-maker', categoryId: 'DOCUMENT', name: 'Receipt Maker', icon: Receipt, componentKey: 'DOCUMENT_MAKER' },
  { id: 'bill-maker', categoryId: 'DOCUMENT', name: 'Bill Maker', icon: Receipt, componentKey: 'DOCUMENT_MAKER' },
  { id: 'invoice-maker', categoryId: 'DOCUMENT', name: 'Invoice Maker', icon: Receipt, componentKey: 'DOCUMENT_MAKER' },
  { id: 'idcard-maker', categoryId: 'DOCUMENT', name: 'ID Card Maker', icon: Shield, componentKey: 'DOCUMENT_MAKER' },
  { id: 'visit-card-maker', categoryId: 'DOCUMENT', name: 'Visiting Card Maker', icon: Briefcase, componentKey: 'DOCUMENT_MAKER' },
  { id: 'letterhead-maker', categoryId: 'DOCUMENT', name: 'Letterhead Maker', icon: FileText, componentKey: 'DOCUMENT_MAKER' },
  { id: 'cert-maker', categoryId: 'DOCUMENT', name: 'Certificate Maker', icon: Shield, componentKey: 'DOCUMENT_MAKER' },
  { id: 'label-maker', categoryId: 'DOCUMENT', name: 'Name & Address Label Maker', icon: Type, componentKey: 'DOCUMENT_MAKER' },
  { id: 'a4-doc-maker', categoryId: 'DOCUMENT', name: 'A4 Document Maker', icon: FileText, componentKey: 'DOCUMENT_MAKER' },

  // PRINTING TOOLS
  { id: 'print-layout', categoryId: 'PRINTING', name: 'Print Layout Maker', icon: Grid, componentKey: 'PRINT_LAYOUT' },
  { id: 'a4-layout', categoryId: 'PRINTING', name: 'A4 Layout', icon: FileText, componentKey: 'PRINT_LAYOUT' },
  { id: 'a3-layout', categoryId: 'PRINTING', name: 'A3 Layout', icon: FileText, componentKey: 'PRINT_LAYOUT' },
  { id: 'multi-sheet', categoryId: 'PRINTING', name: 'Multiple Pages per Sheet', icon: Layers, componentKey: 'PRINT_LAYOUT' },
  { id: '2-photo', categoryId: 'PRINTING', name: '2 Photos per Page', icon: Grid, componentKey: 'PRINT_LAYOUT' },
  { id: '4-photo', categoryId: 'PRINTING', name: '4 Photos per Page', icon: Grid, componentKey: 'PRINT_LAYOUT' },
  { id: '6-photo', categoryId: 'PRINTING', name: '6 Photos per Page', icon: Grid, componentKey: 'PRINT_LAYOUT' },
  { id: '8-photo', categoryId: 'PRINTING', name: '8 Photos per Page', icon: Grid, componentKey: 'PRINT_LAYOUT' },
  { id: '16-photo', categoryId: 'PRINTING', name: '16 Photos per Page', icon: Grid, componentKey: 'PRINT_LAYOUT' },
  { id: 'idcard-layout', categoryId: 'PRINTING', name: 'ID Card Front/Back Print Layout', icon: CreditCard, componentKey: 'PRINT_LAYOUT' },
  { id: 'passport-layout', categoryId: 'PRINTING', name: 'Passport Photo Print Layout', icon: FileImage, componentKey: 'PRINT_LAYOUT' },
  { id: 'margin-set', categoryId: 'PRINTING', name: 'Print Margin Setting', icon: Settings, componentKey: 'PRINT_LAYOUT' },
  { id: 'port-land', categoryId: 'PRINTING', name: 'Portrait/Landscape', icon: RefreshCcw, componentKey: 'PRINT_LAYOUT' },
  { id: 'page-size', categoryId: 'PRINTING', name: 'Page Size Converter', icon: Expand, componentKey: 'PRINT_LAYOUT' },

  // SCAN & OCR
  { id: 'doc-scan', categoryId: 'SCAN_OCR', name: 'Document Scanner', icon: Scan, componentKey: 'SCAN_OCR' },
  { id: 'cam-scan', categoryId: 'SCAN_OCR', name: 'Camera Scanner', icon: Camera, componentKey: 'SCAN_OCR' },
  { id: 'scan-pdf', categoryId: 'SCAN_OCR', name: 'Scan to PDF', icon: FileText, componentKey: 'SCAN_OCR' },
  { id: 'scan-jpg', categoryId: 'SCAN_OCR', name: 'Scan to JPG', icon: Image, componentKey: 'SCAN_OCR' },
  { id: 'scan-text', categoryId: 'SCAN_OCR', name: 'Scan to Text', icon: AlignLeft, componentKey: 'SCAN_OCR' },
  { id: 'hindi-ocr', categoryId: 'SCAN_OCR', name: 'Hindi OCR', icon: Type, componentKey: 'SCAN_OCR' },
  { id: 'eng-ocr', categoryId: 'SCAN_OCR', name: 'English OCR', icon: Type, componentKey: 'SCAN_OCR' },
  { id: 'multi-scan-pdf', categoryId: 'SCAN_OCR', name: 'Multiple Scan Pages to PDF', icon: Layers, componentKey: 'SCAN_OCR' },
  { id: 'scan-crop', categoryId: 'SCAN_OCR', name: 'Scan Crop', icon: Crop, componentKey: 'SCAN_OCR' },
  { id: 'scan-clean', categoryId: 'SCAN_OCR', name: 'Scan Cleanup', icon: Zap, componentKey: 'SCAN_OCR' },

  // QR & BARCODE
  { id: 'qr-gen', categoryId: 'QR_BARCODE', name: 'QR Code Generator', icon: QrCode, componentKey: 'QR_BARCODE' },
  { id: 'wifi-qr', categoryId: 'QR_BARCODE', name: 'Wi-Fi QR Code', icon: Wifi, componentKey: 'QR_BARCODE' },
  { id: 'text-qr', categoryId: 'QR_BARCODE', name: 'Text QR Code', icon: QrCode, componentKey: 'QR_BARCODE' },
  { id: 'url-qr', categoryId: 'QR_BARCODE', name: 'URL QR Code', icon: Link, componentKey: 'QR_BARCODE' },
  { id: 'contact-qr', categoryId: 'QR_BARCODE', name: 'Contact QR Code', icon: Phone, componentKey: 'QR_BARCODE' },
  { id: 'upi-qr', categoryId: 'QR_BARCODE', name: 'UPI QR Code', icon: Smartphone, componentKey: 'QR_BARCODE' },
  { id: 'barcode-gen', categoryId: 'QR_BARCODE', name: 'Barcode Generator', icon: Barcode, componentKey: 'QR_BARCODE' },
  { id: 'barcode-scan', categoryId: 'QR_BARCODE', name: 'Barcode Scanner', icon: Scan, componentKey: 'QR_BARCODE' },

  // DAILY USE TOOLS
  { id: 'calc', categoryId: 'DAILY_USE', name: 'Calculator', icon: Calculator, componentKey: 'DAILY_USE' },
  { id: 'age-calc', categoryId: 'DAILY_USE', name: 'Age Calculator', icon: Clock, componentKey: 'DAILY_USE' },
  { id: 'date-diff', categoryId: 'DAILY_USE', name: 'Date Difference Calculator', icon: Clock, componentKey: 'DAILY_USE' },
  { id: 'percent-calc', categoryId: 'DAILY_USE', name: 'Percentage Calculator', icon: Divide, componentKey: 'DAILY_USE' },
  { id: 'gst-calc', categoryId: 'DAILY_USE', name: 'GST Calculator', icon: Receipt, componentKey: 'DAILY_USE' },
  { id: 'emi-calc', categoryId: 'DAILY_USE', name: 'EMI Calculator', icon: Calculator, componentKey: 'DAILY_USE' },
  { id: 'num-words', categoryId: 'DAILY_USE', name: 'Number to Words', icon: Type, componentKey: 'DAILY_USE' },
  { id: 'amt-words', categoryId: 'DAILY_USE', name: 'Amount to Words', icon: Receipt, componentKey: 'DAILY_USE' },
  { id: 'hindi-type', categoryId: 'DAILY_USE', name: 'Hindi Typing', icon: Type, componentKey: 'DAILY_USE' },
  { id: 'eng-type', categoryId: 'DAILY_USE', name: 'English Typing', icon: Type, componentKey: 'DAILY_USE' },
  { id: 'word-count', categoryId: 'DAILY_USE', name: 'Word Counter', icon: AlignLeft, componentKey: 'DAILY_USE' },
  { id: 'case-conv', categoryId: 'DAILY_USE', name: 'Text Case Converter', icon: Type, componentKey: 'DAILY_USE' },
  { id: 'text-clean', categoryId: 'DAILY_USE', name: 'Text Cleaner', icon: Scissors, componentKey: 'DAILY_USE' },
  { id: 'text-pdf', categoryId: 'DAILY_USE', name: 'Text to PDF', icon: FileText, componentKey: 'DAILY_USE' },
  { id: 'text-img', categoryId: 'DAILY_USE', name: 'Text to Image', icon: Image, componentKey: 'DAILY_USE' },

  // FILE TOOLS
  { id: 'file-rename', categoryId: 'FILE', name: 'File Rename', icon: Edit, componentKey: 'FILE_TOOL' },
  { id: 'multi-rename', categoryId: 'FILE', name: 'Multiple File Rename', icon: Copy, componentKey: 'FILE_TOOL' },
  { id: 'size-check', categoryId: 'FILE', name: 'File Size Checker', icon: Zap, componentKey: 'FILE_TOOL' },
  { id: 'zip-create', categoryId: 'FILE', name: 'ZIP Create', icon: Folder, componentKey: 'FILE_TOOL' },
  { id: 'zip-extract', categoryId: 'FILE', name: 'ZIP Extract', icon: Folder, componentKey: 'FILE_TOOL' },
  { id: 'format-check', categoryId: 'FILE', name: 'File Format Checker', icon: FileCheck, componentKey: 'FILE_TOOL' },
  { id: 'dup-find', categoryId: 'FILE', name: 'Duplicate File Finder', icon: Layers, componentKey: 'FILE_TOOL' }
];
