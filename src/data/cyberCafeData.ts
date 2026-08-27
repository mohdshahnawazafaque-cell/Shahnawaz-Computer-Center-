import { 
  FileText, Image, FileImage, FileCode, Calculator, 
  Keyboard, QrCode, FileCheck, Landmark, Flame, Shield, Users, 
  Car, Briefcase, GraduationCap, Heart, Scale, Zap, Crop, RefreshCcw, Sun, FileSearch, PenTool, Hash, Type, Smartphone
} from 'lucide-react';

export type CategoryType = 
  | 'PHOTO_TOOLS'
  | 'SIGNATURE_TOOLS'
  | 'PDF_TOOLS'
  | 'OCR_TOOLS'
  | 'QR_TOOLS'
  | 'APPLICATION_CENTER'
  | 'CALCULATOR_TOOLS'
  | 'TYPING_TOOLS';

export type ApplicationSubCategoryType = 
  | 'GENERAL'
  | 'CERTIFICATE'
  | 'RATION'
  | 'ELECTRICITY'
  | 'BANK'
  | 'EDUCATION'
  | 'FARMER'
  | 'LABOUR'
  | 'PENSION'
  | 'POLICE'
  | 'RTI'
  | 'YOJANA';

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  subCategory?: ApplicationSubCategoryType;
  icon: any;
  isQuickTool?: boolean;
  toolType: 'interactive' | 'application_form' | 'stub' | 'external_link';
  link?: string;
}

export const CYBER_CAFE_CATEGORIES: { id: CategoryType; label: string; icon: any }[] = [
  { id: 'PHOTO_TOOLS', label: '1. PHOTO TOOLS', icon: Image },
  { id: 'SIGNATURE_TOOLS', label: '2. SIGNATURE TOOLS', icon: PenTool },
  { id: 'PDF_TOOLS', label: '3. PDF TOOLS', icon: FileCode },
  { id: 'OCR_TOOLS', label: '4. OCR & SCANNER TOOLS', icon: FileSearch },
  { id: 'QR_TOOLS', label: '5. QR & BARCODE TOOLS', icon: QrCode },
  { id: 'APPLICATION_CENTER', label: '6. APPLICATION CENTER', icon: FileText },
  { id: 'CALCULATOR_TOOLS', label: '7. CALCULATOR TOOLS', icon: Calculator },
  { id: 'TYPING_TOOLS', label: '8. TYPING & TEXT TOOLS', icon: Keyboard },
];

export const APPLICATION_SUBCATEGORIES: { id: ApplicationSubCategoryType; label: string; icon: any }[] = [
  { id: 'GENERAL', label: 'सामान्य आवेदन', icon: FileText },
  { id: 'CERTIFICATE', label: 'प्रमाणपत्र आवेदन', icon: FileCheck },
  { id: 'RATION', label: 'राशन कार्ड', icon: Users },
  { id: 'ELECTRICITY', label: 'बिजली', icon: Zap },
  { id: 'BANK', label: 'बैंक', icon: Landmark },
  { id: 'EDUCATION', label: 'शिक्षा', icon: GraduationCap },
  { id: 'FARMER', label: 'किसान', icon: Car },
  { id: 'LABOUR', label: 'श्रमिक', icon: Briefcase },
  { id: 'PENSION', label: 'पेंशन', icon: Heart },
  { id: 'POLICE', label: 'पुलिस / प्रशासन', icon: Scale },
  { id: 'RTI', label: 'RTI', icon: Shield },
  { id: 'YOJANA', label: 'सरकारी योजना', icon: Landmark },
];

export const ALL_TOOLS: ToolItem[] = [
  // --- 1. PHOTO TOOLS ---
  { id: 'photo_resize', title: 'Photo Resize', description: 'फोटो का साइज (KB/MB) और पिक्सल बदलें।', category: 'PHOTO_TOOLS', icon: Image, isQuickTool: true, toolType: 'interactive' },
  { id: 'photo_compress', title: 'Photo Compress', description: 'फोटो की क्वालिटी बिना घटाए साइज कम करें।', category: 'PHOTO_TOOLS', icon: Image, toolType: 'stub' },
  { id: 'photo_crop', title: 'Photo Crop', description: 'फोटो का अतिरिक्त हिस्सा काटें।', category: 'PHOTO_TOOLS', icon: Crop, toolType: 'stub' },
  { id: 'photo_bg_remove', title: 'Background Remove', description: 'फोटो का बैकग्राउंड हटाएँ।', category: 'PHOTO_TOOLS', icon: Image, toolType: 'stub' },
  { id: 'passport_maker', title: 'Passport Photo Maker', description: 'A4 पेज पर कई पासपोर्ट साइज फोटो सेट करें।', category: 'PHOTO_TOOLS', icon: Users, isQuickTool: true, toolType: 'stub' },
  { id: 'multiple_passport', title: 'Multiple Passport Photos', description: 'एक ही पेज पर कई फोटो लगाएं।', category: 'PHOTO_TOOLS', icon: Users, toolType: 'stub' },
  { id: 'photo_dpi', title: 'Photo DPI Changer', description: 'फोटो का DPI बदलें।', category: 'PHOTO_TOOLS', icon: Image, toolType: 'stub' },
  { id: 'photo_kb', title: 'Photo KB Reducer', description: 'फोटो का KB कम करें।', category: 'PHOTO_TOOLS', icon: Image, toolType: 'stub' },
  { id: 'photo_format', title: 'Photo Format Converter', description: 'JPG/PNG/WEBP में बदलें।', category: 'PHOTO_TOOLS', icon: RefreshCcw, toolType: 'stub' },
  { id: 'photo_rotate', title: 'Photo Rotate', description: 'फोटो को घुमाएं।', category: 'PHOTO_TOOLS', icon: RefreshCcw, toolType: 'stub' },
  { id: 'photo_brightness', title: 'Brightness/Contrast', description: 'फोटो की रोशनी व कंट्रास्ट सेट करें।', category: 'PHOTO_TOOLS', icon: Sun, toolType: 'stub' },
  { id: 'photo_to_pdf', title: 'Photo to PDF', description: 'फोटो को PDF बनाएं।', category: 'PHOTO_TOOLS', icon: FileCode, toolType: 'stub' },

  // --- 2. SIGNATURE TOOLS ---
  { id: 'sig_resize', title: 'Signature Resize', description: 'हस्ताक्षर (Signature) को सही साइज में बनाएं।', category: 'SIGNATURE_TOOLS', icon: PenTool, isQuickTool: true, toolType: 'stub' },
  { id: 'sig_compress', title: 'Signature Compress', description: 'हस्ताक्षर का साइज कम करें।', category: 'SIGNATURE_TOOLS', icon: PenTool, toolType: 'stub' },
  { id: 'sig_crop', title: 'Signature Crop', description: 'अतिरिक्त हिस्सा काटें।', category: 'SIGNATURE_TOOLS', icon: Crop, toolType: 'stub' },
  { id: 'sig_kb', title: 'Signature KB Reducer', description: 'हस्ताक्षर का KB कम करें।', category: 'SIGNATURE_TOOLS', icon: PenTool, toolType: 'stub' },
  { id: 'sig_bg_remove', title: 'Signature Background Remove', description: 'पीछे का हिस्सा साफ करें।', category: 'SIGNATURE_TOOLS', icon: PenTool, toolType: 'stub' },
  { id: 'sig_jpg', title: 'Signature JPG Converter', description: 'किसी भी फॉर्मेट से JPG बनाएं।', category: 'SIGNATURE_TOOLS', icon: RefreshCcw, toolType: 'stub' },
  { id: 'sig_pdf', title: 'Signature to PDF', description: 'हस्ताक्षर को PDF बनाएं।', category: 'SIGNATURE_TOOLS', icon: FileCode, toolType: 'stub' },

  // --- 3. PDF TOOLS ---
  { id: 'jpg_to_pdf', title: 'JPG to PDF', description: 'इमेज (JPG/PNG) को PDF में बदलें।', category: 'PDF_TOOLS', icon: FileCode, isQuickTool: true, toolType: 'stub' },
  { id: 'pdf_to_jpg', title: 'PDF to JPG', description: 'PDF के पेजों को इमेज (JPG) में बदलें।', category: 'PDF_TOOLS', icon: FileImage, toolType: 'stub' },
  { id: 'pdf_merge', title: 'PDF Merge', description: 'कई PDF फाइलों को एक साथ जोड़ें।', category: 'PDF_TOOLS', icon: FileCode, isQuickTool: true, toolType: 'stub' },
  { id: 'pdf_split', title: 'PDF Split', description: 'PDF के पेजों को अलग-अलग करें।', category: 'PDF_TOOLS', icon: FileCode, toolType: 'stub' },
  { id: 'pdf_compress', title: 'PDF Compress', description: 'PDF फाइल का साइज कम करें।', category: 'PDF_TOOLS', icon: FileCode, isQuickTool: true, toolType: 'stub' },
  { id: 'pdf_extract', title: 'PDF Page Extract', description: 'PDF से कोई खास पेज निकालें।', category: 'PDF_TOOLS', icon: FileCode, toolType: 'stub' },
  { id: 'pdf_rotate', title: 'PDF Rotate', description: 'PDF के पेज घुमाएं।', category: 'PDF_TOOLS', icon: RefreshCcw, toolType: 'stub' },
  { id: 'pdf_delete', title: 'PDF Delete Pages', description: 'PDF से पेज हटाएं।', category: 'PDF_TOOLS', icon: FileCode, toolType: 'stub' },
  { id: 'pdf_rearrange', title: 'PDF Rearrange Pages', description: 'पेजों का क्रम बदलें।', category: 'PDF_TOOLS', icon: FileCode, toolType: 'stub' },
  { id: 'pdf_watermark', title: 'PDF Watermark', description: 'PDF पर वॉटरमार्क लगाएं।', category: 'PDF_TOOLS', icon: FileCode, toolType: 'stub' },
  { id: 'pdf_to_text', title: 'PDF to Text', description: 'PDF से टेक्स्ट निकालें।', category: 'PDF_TOOLS', icon: FileText, toolType: 'stub' },
  { id: 'text_to_pdf', title: 'Text to PDF', description: 'टेक्स्ट को PDF बनाएं।', category: 'PDF_TOOLS', icon: FileCode, toolType: 'stub' },
  { id: 'pdf_protect', title: 'PDF Password Protect', description: 'PDF में पासवर्ड लगाएं।', category: 'PDF_TOOLS', icon: Shield, toolType: 'stub' },
  { id: 'pdf_unlock', title: 'PDF Unlock', description: 'PDF से पासवर्ड हटाएं।', category: 'PDF_TOOLS', icon: Shield, toolType: 'stub' },
  { id: 'pdf_print_ready', title: 'PDF Print Ready', description: 'PDF को प्रिंट के लिए तैयार करें।', category: 'PDF_TOOLS', icon: FileCode, toolType: 'stub' },
  { id: 'pdf_page_num', title: 'PDF Page Number', description: 'पेज नंबर डालें।', category: 'PDF_TOOLS', icon: Hash, toolType: 'stub' },

  // --- 4. OCR & SCANNER TOOLS ---
  { id: 'ocr_tool', title: 'Image to Text (OCR)', description: 'फोटो या स्कैन कॉपी से टेक्स्ट निकालें।', category: 'OCR_TOOLS', icon: FileSearch, isQuickTool: true, toolType: 'stub' },
  { id: 'ocr_hindi', title: 'Hindi OCR', description: 'हिंदी फोटो से टेक्स्ट।', category: 'OCR_TOOLS', icon: FileSearch, toolType: 'stub' },
  { id: 'ocr_english', title: 'English OCR', description: 'अंग्रेजी फोटो से टेक्स्ट।', category: 'OCR_TOOLS', icon: FileSearch, toolType: 'stub' },
  { id: 'doc_scanner', title: 'Document Scanner', description: 'दस्तावेज़ स्कैन करें।', category: 'OCR_TOOLS', icon: FileSearch, toolType: 'stub' },
  { id: 'img_scanner', title: 'Image Scanner', description: 'इमेज स्कैन करें।', category: 'OCR_TOOLS', icon: FileSearch, toolType: 'stub' },
  { id: 'scan_to_pdf', title: 'Scan to PDF', description: 'स्कैन करके PDF बनाएं।', category: 'OCR_TOOLS', icon: FileCode, toolType: 'stub' },
  { id: 'scan_to_jpg', title: 'Scan to JPG', description: 'स्कैन करके JPG बनाएं।', category: 'OCR_TOOLS', icon: Image, toolType: 'stub' },
  { id: 'multi_img_pdf', title: 'Multiple Images to PDF', description: 'कई इमेज से एक PDF।', category: 'OCR_TOOLS', icon: FileCode, toolType: 'stub' },

  // --- 5. QR & BARCODE TOOLS ---
  { id: 'qr_generator', title: 'QR Code Generator', description: 'टेक्स्ट या लिंक का QR कोड बनाएं।', category: 'QR_TOOLS', icon: QrCode, isQuickTool: true, toolType: 'stub' },
  { id: 'qr_scanner', title: 'QR Code Scanner', description: 'QR कोड स्कैन करें।', category: 'QR_TOOLS', icon: QrCode, toolType: 'stub' },
  { id: 'barcode_generator', title: 'Barcode Generator', description: 'नंबर या टेक्स्ट का बारकोड बनाएं।', category: 'QR_TOOLS', icon: QrCode, toolType: 'stub' },
  { id: 'text_to_qr', title: 'Text to QR', description: 'टेक्स्ट का QR बनाएं।', category: 'QR_TOOLS', icon: QrCode, toolType: 'stub' },
  { id: 'url_to_qr', title: 'URL to QR', description: 'लिंक का QR बनाएं।', category: 'QR_TOOLS', icon: QrCode, toolType: 'stub' },
  { id: 'wifi_qr', title: 'Wi-Fi QR Generator', description: 'Wi-Fi पासवर्ड का QR बनाएं।', category: 'QR_TOOLS', icon: QrCode, toolType: 'stub' },
  { id: 'contact_qr', title: 'Contact QR Generator', description: 'संपर्क विवरण का QR बनाएं।', category: 'QR_TOOLS', icon: QrCode, toolType: 'stub' },

  // --- 6. APPLICATION CENTER (SUB-CATEGORIES) ---
  
  // GENERAL
  { id: 'app_samanya', title: 'सामान्य प्रार्थना पत्र', description: 'किसी भी अधिकारी को सामान्य आवेदन पत्र।', category: 'APPLICATION_CENTER', subCategory: 'GENERAL', icon: FileText, toolType: 'application_form' },
  { id: 'app_swaghoshna', title: 'स्वघोषणा पत्र', description: 'स्वघोषणा पत्र का प्रारूप।', category: 'APPLICATION_CENTER', subCategory: 'GENERAL', icon: FileText, toolType: 'application_form' },
  { id: 'app_ghoshna', title: 'घोषणा पत्र', description: 'सामान्य घोषणा पत्र।', category: 'APPLICATION_CENTER', subCategory: 'GENERAL', icon: FileText, toolType: 'application_form' },
  { id: 'app_sahmati', title: 'सहमति पत्र', description: 'सहमति पत्र का प्रारूप।', category: 'APPLICATION_CENTER', subCategory: 'GENERAL', icon: FileText, toolType: 'application_form' },
  { id: 'app_anurodh', title: 'अनुरोध पत्र', description: 'अनुरोध पत्र का प्रारूप।', category: 'APPLICATION_CENTER', subCategory: 'GENERAL', icon: FileText, toolType: 'application_form' },
  { id: 'app_shapath', title: 'शपथ पत्र का प्रारूप', description: 'सामान्य शपथ पत्र का प्रारूप।', category: 'APPLICATION_CENTER', subCategory: 'GENERAL', icon: FileText, toolType: 'application_form' },
  { id: 'app_name_correct', title: 'नाम सुधार आवेदन', description: 'नाम में सुधार हेतु आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'GENERAL', icon: FileText, toolType: 'application_form' },
  { id: 'app_name_change', title: 'नाम परिवर्तन आवेदन', description: 'नाम बदलने हेतु आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'GENERAL', icon: FileText, toolType: 'application_form' },
  { id: 'app_dob_correct', title: 'जन्मतिथि सुधार आवेदन', description: 'जन्मतिथि सुधारने हेतु आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'GENERAL', icon: FileText, toolType: 'application_form' },
  { id: 'app_address_change', title: 'पता परिवर्तन आवेदन', description: 'पता बदलने हेतु आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'GENERAL', icon: FileText, toolType: 'application_form' },

  // CERTIFICATE
  { id: 'app_income_cert', title: 'आय प्रमाणपत्र आवेदन', description: 'आय प्रमाणपत्र बनवाने हेतु प्रार्थना पत्र।', category: 'APPLICATION_CENTER', subCategory: 'CERTIFICATE', icon: FileCheck, toolType: 'application_form' },
  { id: 'app_caste_cert', title: 'जाति प्रमाणपत्र आवेदन', description: 'जाति प्रमाणपत्र बनवाने हेतु प्रार्थना पत्र।', category: 'APPLICATION_CENTER', subCategory: 'CERTIFICATE', icon: FileCheck, toolType: 'application_form' },
  { id: 'app_domicile_cert', title: 'निवास प्रमाणपत्र आवेदन', description: 'निवास प्रमाणपत्र बनवाने हेतु प्रार्थना पत्र।', category: 'APPLICATION_CENTER', subCategory: 'CERTIFICATE', icon: FileCheck, toolType: 'application_form' },
  { id: 'app_birth_cert', title: 'जन्म प्रमाणपत्र आवेदन', description: 'जन्म प्रमाणपत्र बनवाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'CERTIFICATE', icon: FileCheck, toolType: 'application_form' },
  { id: 'app_death_cert', title: 'मृत्यु प्रमाणपत्र आवेदन', description: 'मृत्यु प्रमाणपत्र बनवाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'CERTIFICATE', icon: FileCheck, toolType: 'application_form' },
  { id: 'app_charitra_cert', title: 'चरित्र प्रमाणपत्र आवेदन', description: 'चरित्र प्रमाणपत्र बनवाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'CERTIFICATE', icon: FileCheck, toolType: 'application_form' },
  { id: 'app_bonafide_cert', title: 'बोनाफाइड प्रमाणपत्र आवेदन', description: 'मूल निवास/बोनाफाइड प्रमाणपत्र।', category: 'APPLICATION_CENTER', subCategory: 'CERTIFICATE', icon: FileCheck, toolType: 'application_form' },
  { id: 'app_parivar_register', title: 'परिवार रजिस्टर संबंधी आवेदन', description: 'परिवार रजिस्टर नकल हेतु।', category: 'APPLICATION_CENTER', subCategory: 'CERTIFICATE', icon: FileCheck, toolType: 'application_form' },

  // RATION
  { id: 'app_ration_new', title: 'नया राशन कार्ड आवेदन', description: 'नया राशन कार्ड बनवाने हेतु प्रार्थना पत्र।', category: 'APPLICATION_CENTER', subCategory: 'RATION', icon: Users, toolType: 'application_form' },
  { id: 'app_ration_add_member', title: 'सदस्य जोड़ने का आवेदन', description: 'राशन कार्ड में नाम जोड़ने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'RATION', icon: Users, toolType: 'application_form' },
  { id: 'app_ration_remove_member', title: 'सदस्य हटाने का आवेदन', description: 'राशन कार्ड से नाम हटाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'RATION', icon: Users, toolType: 'application_form' },
  { id: 'app_ration_name_correct', title: 'नाम सुधार आवेदन', description: 'राशन कार्ड में नाम सुधारने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'RATION', icon: Users, toolType: 'application_form' },
  { id: 'app_ration_address_correct', title: 'पता सुधार आवेदन', description: 'राशन कार्ड में पता सुधारने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'RATION', icon: Users, toolType: 'application_form' },
  { id: 'app_ration_complaint', title: 'राशन कार्ड शिकायत आवेदन', description: 'राशन संबंधी शिकायत हेतु।', category: 'APPLICATION_CENTER', subCategory: 'RATION', icon: Users, toolType: 'application_form' },

  // ELECTRICITY
  { id: 'app_bijli_new', title: 'नया बिजली कनेक्शन', description: 'नया बिजली कनेक्शन लेने हेतु प्रार्थना पत्र।', category: 'APPLICATION_CENTER', subCategory: 'ELECTRICITY', icon: Zap, toolType: 'application_form' },
  { id: 'app_bijli_meter_install', title: 'मीटर लगाने का आवेदन', description: 'नया मीटर लगवाने हेतु आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'ELECTRICITY', icon: Zap, toolType: 'application_form' },
  { id: 'app_bijli_meter_defect', title: 'मीटर खराब होने का आवेदन', description: 'खराब बिजली मीटर बदलवाने हेतु आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'ELECTRICITY', icon: Zap, toolType: 'application_form' },
  { id: 'app_bijli_meter_change', title: 'मीटर बदलने का आवेदन', description: 'मीटर बदलने हेतु आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'ELECTRICITY', icon: Zap, toolType: 'application_form' },
  { id: 'app_bijli_bill_correct', title: 'बिजली बिल सुधार आवेदन', description: 'गलत बिल सही कराने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'ELECTRICITY', icon: Zap, toolType: 'application_form' },
  { id: 'app_bijli_high_bill', title: 'अधिक बिल शिकायत', description: 'ज्यादा बिल आने पर शिकायत।', category: 'APPLICATION_CENTER', subCategory: 'ELECTRICITY', icon: Zap, toolType: 'application_form' },
  { id: 'app_bijli_name_change', title: 'नाम परिवर्तन आवेदन', description: 'बिजली बिल में नाम बदलने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'ELECTRICITY', icon: Zap, toolType: 'application_form' },
  { id: 'app_bijli_disconnect', title: 'कनेक्शन विच्छेदन आवेदन', description: 'बिजली कनेक्शन कटवाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'ELECTRICITY', icon: Zap, toolType: 'application_form' },

  // BANK
  { id: 'app_bank_account', title: 'बैंक खाता संबंधी आवेदन', description: 'नया खाता खोलने हेतु प्रार्थना पत्र।', category: 'APPLICATION_CENTER', subCategory: 'BANK', icon: Landmark, toolType: 'application_form' },
  { id: 'app_bank_mobile', title: 'मोबाइल नंबर बदलने का आवेदन', description: 'खाते में मोबाइल नंबर बदलवाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'BANK', icon: Landmark, toolType: 'application_form' },
  { id: 'app_bank_address', title: 'पता बदलने का आवेदन', description: 'बैंक खाते में पता बदलवाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'BANK', icon: Landmark, toolType: 'application_form' },
  { id: 'app_bank_name', title: 'नाम सुधार आवेदन', description: 'खाते में नाम सुधार हेतु।', category: 'APPLICATION_CENTER', subCategory: 'BANK', icon: Landmark, toolType: 'application_form' },
  { id: 'app_bank_passbook', title: 'पासबुक आवेदन', description: 'नई पासबुक जारी करने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'BANK', icon: Landmark, toolType: 'application_form' },
  { id: 'app_bank_atm', title: 'ATM/डेबिट कार्ड आवेदन', description: 'नया ATM कार्ड बनवाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'BANK', icon: Landmark, toolType: 'application_form' },
  { id: 'app_bank_cheque', title: 'चेकबुक आवेदन', description: 'नई चेकबुक जारी करने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'BANK', icon: Landmark, toolType: 'application_form' },
  { id: 'app_bank_close', title: 'बैंक खाता बंद करने का आवेदन', description: 'खाता हमेशा के लिए बंद कराने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'BANK', icon: Landmark, toolType: 'application_form' },

  // EDUCATION
  { id: 'app_edu_school_admission', title: 'विद्यालय प्रवेश आवेदन', description: 'स्कूल में एडमिशन हेतु।', category: 'APPLICATION_CENTER', subCategory: 'EDUCATION', icon: GraduationCap, toolType: 'application_form' },
  { id: 'app_edu_college_admission', title: 'कॉलेज प्रवेश आवेदन', description: 'कॉलेज में एडमिशन हेतु।', category: 'APPLICATION_CENTER', subCategory: 'EDUCATION', icon: GraduationCap, toolType: 'application_form' },
  { id: 'app_edu_fee_waiver', title: 'फीस माफी आवेदन', description: 'फीस माफ कराने हेतु प्रार्थना पत्र।', category: 'APPLICATION_CENTER', subCategory: 'EDUCATION', icon: GraduationCap, toolType: 'application_form' },
  { id: 'app_edu_scholarship', title: 'छात्रवृत्ति आवेदन', description: 'स्कॉलरशिप संबंधी आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'EDUCATION', icon: GraduationCap, toolType: 'application_form' },
  { id: 'app_edu_bonafide', title: 'बोनाफाइड प्रमाणपत्र आवेदन', description: 'स्कूल/कॉलेज से बोनाफाइड।', category: 'APPLICATION_CENTER', subCategory: 'EDUCATION', icon: GraduationCap, toolType: 'application_form' },
  { id: 'app_edu_character', title: 'चरित्र प्रमाणपत्र आवेदन', description: 'स्कूल से चरित्र प्रमाणपत्र।', category: 'APPLICATION_CENTER', subCategory: 'EDUCATION', icon: GraduationCap, toolType: 'application_form' },
  { id: 'app_edu_tc', title: 'ट्रांसफर सर्टिफिकेट आवेदन', description: 'TC/Migration निकालने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'EDUCATION', icon: GraduationCap, toolType: 'application_form' },
  { id: 'app_edu_correction', title: 'नाम/जन्मतिथि सुधार आवेदन', description: 'स्कूल रिकॉर्ड में सुधार हेतु।', category: 'APPLICATION_CENTER', subCategory: 'EDUCATION', icon: GraduationCap, toolType: 'application_form' },
  { id: 'app_edu_docs', title: 'स्कूल से दस्तावेज़ प्राप्त करने का आवेदन', description: 'मार्कशीट आदि निकलवाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'EDUCATION', icon: GraduationCap, toolType: 'application_form' },

  // FARMER
  { id: 'app_farmer_general', title: 'किसान संबंधी आवेदन', description: 'सामान्य किसान आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'FARMER', icon: Car, toolType: 'application_form' },
  { id: 'app_farmer_registry', title: 'Farmer Registry आवेदन', description: 'रजिस्ट्री संबंधी आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'FARMER', icon: Car, toolType: 'application_form' },
  { id: 'app_farmer_land', title: 'भूमि संबंधी आवेदन', description: 'खतौनी/पैमाइश संबंधी।', category: 'APPLICATION_CENTER', subCategory: 'FARMER', icon: Car, toolType: 'application_form' },
  { id: 'app_farmer_pmkisan', title: 'PM-Kisan संबंधी आवेदन', description: 'PM किसान सम्मान निधि शिकायत/सुधार।', category: 'APPLICATION_CENTER', subCategory: 'FARMER', icon: Car, toolType: 'application_form' },
  { id: 'app_farmer_agridept', title: 'कृषि विभाग आवेदन', description: 'कृषि विभाग को आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'FARMER', icon: Car, toolType: 'application_form' },
  { id: 'app_farmer_yojana', title: 'किसान योजना आवेदन', description: 'सरकारी किसान योजना लाभ हेतु।', category: 'APPLICATION_CENTER', subCategory: 'FARMER', icon: Car, toolType: 'application_form' },

  // LABOUR
  { id: 'app_labour_eshram', title: 'e-Shram संबंधी आवेदन', description: 'ई-श्रम कार्ड सुधार/शिकायत।', category: 'APPLICATION_CENTER', subCategory: 'LABOUR', icon: Briefcase, toolType: 'application_form' },
  { id: 'app_labour_reg', title: 'श्रमिक पंजीकरण आवेदन', description: 'लेबर कार्ड बनवाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'LABOUR', icon: Briefcase, toolType: 'application_form' },
  { id: 'app_labour_yojana', title: 'श्रमिक योजना आवेदन', description: 'मजदूर योजना लाभ हेतु।', category: 'APPLICATION_CENTER', subCategory: 'LABOUR', icon: Briefcase, toolType: 'application_form' },
  { id: 'app_labour_help', title: 'श्रमिक सहायता आवेदन', description: 'सरकारी सहायता राशि हेतु।', category: 'APPLICATION_CENTER', subCategory: 'LABOUR', icon: Briefcase, toolType: 'application_form' },

  // PENSION
  { id: 'app_pension_oldage', title: 'वृद्धावस्था पेंशन आवेदन', description: 'वृद्धावस्था पेंशन स्वीकृति हेतु।', category: 'APPLICATION_CENTER', subCategory: 'PENSION', icon: Heart, toolType: 'application_form' },
  { id: 'app_pension_widow', title: 'विधवा पेंशन आवेदन', description: 'निराश्रित महिला पेंशन हेतु।', category: 'APPLICATION_CENTER', subCategory: 'PENSION', icon: Heart, toolType: 'application_form' },
  { id: 'app_pension_divyang', title: 'दिव्यांग पेंशन आवेदन', description: 'विकलांग पेंशन हेतु।', category: 'APPLICATION_CENTER', subCategory: 'PENSION', icon: Heart, toolType: 'application_form' },
  { id: 'app_pension_verify', title: 'पेंशन सत्यापन आवेदन', description: 'पेंशन केवाईसी/सत्यापन हेतु।', category: 'APPLICATION_CENTER', subCategory: 'PENSION', icon: Heart, toolType: 'application_form' },
  { id: 'app_pension_complaint', title: 'पेंशन शिकायत आवेदन', description: 'रुकी हुई पेंशन चालू कराने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'PENSION', icon: Heart, toolType: 'application_form' },

  // POLICE / ADMIN
  { id: 'app_police_thana', title: 'थाना प्रार्थना पत्र', description: 'थाने में शिकायत या सूचना दर्ज कराने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'POLICE', icon: Shield, toolType: 'application_form' },
  { id: 'app_police_complaint', title: 'पुलिस शिकायत आवेदन', description: 'विवाद/लड़ाई की शिकायत।', category: 'APPLICATION_CENTER', subCategory: 'POLICE', icon: Shield, toolType: 'application_form' },
  { id: 'app_police_lost', title: 'खोए हुए दस्तावेज़ की सूचना', description: 'कोई ज़रूरी दस्तावेज़ खोने पर पुलिस सूचना।', category: 'APPLICATION_CENTER', subCategory: 'POLICE', icon: Shield, toolType: 'application_form' },
  { id: 'app_admin_tehsil', title: 'तहसील प्रार्थना पत्र', description: 'तहसीलदार/लेखपाल को प्रार्थना पत्र।', category: 'APPLICATION_CENTER', subCategory: 'POLICE', icon: Scale, toolType: 'application_form' },
  { id: 'app_admin_dm', title: 'जिलाधिकारी को प्रार्थना पत्र', description: 'DM को आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'POLICE', icon: Scale, toolType: 'application_form' },
  { id: 'app_admin_sdm', title: 'उपजिलाधिकारी को प्रार्थना पत्र', description: 'SDM को आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'POLICE', icon: Scale, toolType: 'application_form' },
  { id: 'app_admin_bdo', title: 'खंड विकास अधिकारी को आवेदन', description: 'BDO को आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'POLICE', icon: Scale, toolType: 'application_form' },
  { id: 'app_admin_panchayat', title: 'ग्राम पंचायत आवेदन', description: 'प्रधान/सचिव को आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'POLICE', icon: Scale, toolType: 'application_form' },
  { id: 'app_admin_nagar', title: 'नगर पालिका/नगर पंचायत आवेदन', description: 'नगर पंचायत अध्यक्ष/EO को आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'POLICE', icon: Scale, toolType: 'application_form' },

  // RTI
  { id: 'app_rti_req', title: 'RTI आवेदन', description: 'सूचना का अधिकार के तहत जानकारी।', category: 'APPLICATION_CENTER', subCategory: 'RTI', icon: FileText, toolType: 'application_form' },
  { id: 'app_rti_appeal', title: 'RTI प्रथम अपील', description: 'RTI का जवाब न मिलने पर अपील।', category: 'APPLICATION_CENTER', subCategory: 'RTI', icon: FileText, toolType: 'application_form' },
  { id: 'app_rti_info', title: 'सूचना प्राप्ति आवेदन', description: 'किसी विभाग से सूचना प्राप्ति हेतु।', category: 'APPLICATION_CENTER', subCategory: 'RTI', icon: FileText, toolType: 'application_form' },

  // YOJANA
  { id: 'app_yojana_general', title: 'सरकारी योजना आवेदन', description: 'योजना लाभ हेतु आवेदन।', category: 'APPLICATION_CENTER', subCategory: 'YOJANA', icon: Landmark, toolType: 'application_form' },
  { id: 'app_yojana_complaint', title: 'लाभार्थी शिकायत', description: 'लाभ न मिलने पर शिकायत।', category: 'APPLICATION_CENTER', subCategory: 'YOJANA', icon: Landmark, toolType: 'application_form' },
  { id: 'app_yojana_add', title: 'योजना में नाम जोड़ने का आवेदन', description: 'योजना सूची में नाम डलवाने हेतु।', category: 'APPLICATION_CENTER', subCategory: 'YOJANA', icon: Landmark, toolType: 'application_form' },
  { id: 'app_yojana_not_received', title: 'योजना का लाभ न मिलने की शिकायत', description: 'पात्र होने पर भी लाभ न मिलना।', category: 'APPLICATION_CENTER', subCategory: 'YOJANA', icon: Landmark, toolType: 'application_form' },

  // --- 7. CALCULATOR TOOLS ---
  { id: 'age_calc', title: 'Age Calculator', description: 'जन्म तिथि से आज तक की सटीक उम्र निकालें।', category: 'CALCULATOR_TOOLS', icon: Calculator, isQuickTool: true, toolType: 'interactive' },
  { id: 'date_diff', title: 'Date Difference', description: 'दो तारीखों के बीच का अंतर।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },
  { id: 'percentage_calc', title: 'Percentage Calculator', description: 'प्रतिशत (Percentage) निकालें।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'interactive' },
  { id: 'gst_calc', title: 'GST Calculator', description: 'GST जोड़ें या घटाएं।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },
  { id: 'emi_calc', title: 'EMI Calculator', description: 'लोन की मासिक किस्त जानें।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },
  { id: 'loan_calc', title: 'Loan Calculator', description: 'लोन अमाउंट और ब्याज दर।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },
  { id: 'simple_interest', title: 'Simple Interest', description: 'साधारण ब्याज निकालें।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },
  { id: 'compound_interest', title: 'Compound Interest', description: 'चक्रवृद्धि ब्याज निकालें।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },
  { id: 'discount_calc', title: 'Discount Calculator', description: 'छूट के बाद की कीमत।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },
  { id: 'profit_loss', title: 'Profit & Loss Calculator', description: 'लाभ और हानि निकालें।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },
  { id: 'area_calc', title: 'Area Calculator', description: 'जमीन या प्लॉट का क्षेत्रफल।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },
  { id: 'bmi_calc', title: 'BMI Calculator', description: 'बॉडी मास इंडेक्स (BMI)।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },
  { id: 'unit_converter', title: 'Unit Converter', description: 'मीटर, फीट, इंच, किलो बदलें।', category: 'CALCULATOR_TOOLS', icon: Calculator, toolType: 'stub' },

  // --- 8. TYPING & TEXT TOOLS ---
  { id: 'hindi_typing', title: 'Hindi Typing', description: 'हिंदी में टाइपिंग करें (Mangal/Kruti Dev)।', category: 'TYPING_TOOLS', icon: Keyboard, isQuickTool: true, toolType: 'stub' },
  { id: 'eng_typing', title: 'English Typing', description: 'अंग्रेजी टाइपिंग प्रैक्टिस।', category: 'TYPING_TOOLS', icon: Keyboard, toolType: 'stub' },
  { id: 'hindi_unicode', title: 'Hindi Unicode Converter', description: 'Kruti Dev to Unicode।', category: 'TYPING_TOOLS', icon: Type, toolType: 'stub' },
  { id: 'unicode_mangal', title: 'Unicode to Mangal', description: 'Unicode से Mangal फॉन्ट।', category: 'TYPING_TOOLS', icon: Type, toolType: 'stub' },
  { id: 'case_converter', title: 'Text Case Converter', description: 'UPPER, lower, Title Case।', category: 'TYPING_TOOLS', icon: Type, toolType: 'stub' },
  { id: 'word_counter', title: 'Word Counter', description: 'शब्दों की संख्या गिनें।', category: 'TYPING_TOOLS', icon: FileText, toolType: 'stub' },
  { id: 'char_counter', title: 'Character Counter', description: 'अक्षरों की संख्या गिनें।', category: 'TYPING_TOOLS', icon: FileText, toolType: 'stub' },
  { id: 'text_cleaner', title: 'Text Cleaner', description: 'अतिरिक्त स्पेस व लाइन हटाएं।', category: 'TYPING_TOOLS', icon: FileText, toolType: 'stub' },
  { id: 'text_to_pdf2', title: 'Text to PDF', description: 'सीधे टेक्स्ट लिखकर PDF बनाएं।', category: 'TYPING_TOOLS', icon: FileCode, toolType: 'stub' },
];
