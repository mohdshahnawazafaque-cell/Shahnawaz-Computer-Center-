export interface GovernmentSchemeService {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  department: string;
  description: string;
  officialUrl: string;
  isCentral: boolean;
  tags: string[];
  isPopular?: boolean;
  state?: string;
  actionText?: string;
  statusCheckUrl?: string;
  statusText?: string;
  guidelineText?: string;
  note?: string;
  guidelinesUrl?: string;
}

export const SARKARI_CATEGORIES = [
  "All Schemes & Services",
  "1. CSC Services",
  "2. Uttar Pradesh (UP)",
  "3. Aadhaar Services",
  "4. PAN & Income Tax",
  "5. Voter ID & Election",
  "6. Passport Services",
  "7. Railway & IRCTC",
  "8. Driving Licence & Vahan",
  "9. DigiLocker & Documents",
  "10. Sarkari Yojana",
  "11. Pension & Kalyan",
  "12. Ration Card & Food",
  "13. Shramik & Labour",
  "14. Kisan & Agriculture",
  "15. Education & Scholarship",
  "16. Sarkari Naukri",
  "17. EPFO & PF",
  "18. Banking & Finance",
  "19. Vyapar & Business",
  "20. Swasthya & Health",
  "21. Bijli, Gas & Bills",
  "22. Zameen & Sampatti",
  "23. Nagrik Sevaye & Shikayat",
  "24. India Post & Yatra",
  "25. Cyber Cafe Digital Tools",
  "26. Farmer Registry (किसान रजिस्ट्री)"
] as const;

export const SARKARI_YOJANA_SERVICES_DATA: GovernmentSchemeService[] = [
  {
    id: 'service-1',
    name: 'CSC Digital Seva',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC Digital Seva official online service portal.',
    officialUrl: 'https://digitalseva.csc.gov.in/',
    tags: ['csc digital seva'],
    isCentral: true
  },
  {
    id: 'service-2',
    name: 'CSC Registration',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC Registration official online service portal.',
    officialUrl: 'https://register.csc.gov.in/',
    tags: ['csc registration'],
    isCentral: true
  },
  {
    id: 'service-3',
    name: 'CSC Login',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC Login official online service portal.',
    officialUrl: 'https://digitalseva.csc.gov.in/',
    tags: ['csc login'],
    isCentral: true
  },
  {
    id: 'service-4',
    name: 'CSC DigiPay',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC DigiPay official online service portal.',
    officialUrl: 'https://digipay.csccloud.in/',
    tags: ['csc digipay'],
    isCentral: true
  },
  {
    id: 'service-5',
    name: 'CSC Banking',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC Banking official online service portal.',
    officialUrl: 'https://bankmitra.csccloud.in/',
    tags: ['csc banking'],
    isCentral: true
  },
  {
    id: 'service-6',
    name: 'CSC Insurance',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC Insurance official online service portal.',
    officialUrl: 'https://insurance.csccloud.in/',
    tags: ['csc insurance'],
    isCentral: true
  },
  {
    id: 'service-7',
    name: 'CSC Pension',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC Pension official online service portal.',
    officialUrl: 'https://digitalseva.csc.gov.in/',
    tags: ['csc pension'],
    isCentral: true
  },
  {
    id: 'service-8',
    name: 'CSC Telemedicine',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC Telemedicine official online service portal.',
    officialUrl: 'https://telehealth.csc.gov.in/',
    tags: ['csc telemedicine'],
    isCentral: true
  },
  {
    id: 'service-9',
    name: 'CSC Tele-Law',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC Tele-Law official online service portal.',
    officialUrl: 'https://www.tele-law.in/',
    tags: ['csc tele-law'],
    isCentral: true
  },
  {
    id: 'service-10',
    name: 'CSC Education',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC Education official online service portal.',
    officialUrl: 'https://cscacademy.org/',
    tags: ['csc education'],
    isCentral: true
  },
  {
    id: 'service-11',
    name: 'CSC सरकारी सेवाएँ',
    category: '1. CSC Services',
    department: 'Government Portal / Online Tool',
    description: 'Access CSC सरकारी सेवाएँ official online service portal.',
    officialUrl: 'https://digitalseva.csc.gov.in/',
    tags: ['csc सरकारी सेवाएँ'],
    isCentral: true
  },
  {
    id: 'service-12',
    name: 'UP e-District',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP e-District official online service portal.',
    officialUrl: 'https://edistrict.up.gov.in/',
    tags: ['up e-district'],
    isCentral: true
  },
  {
    id: 'service-13',
    name: 'e-Sathi UP',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access e-Sathi UP official online service portal.',
    officialUrl: 'https://esathi.up.gov.in/',
    tags: ['e-sathi up'],
    isCentral: true
  },
  {
    id: 'service-14',
    name: 'जनसुनवाई UP',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access जनसुनवाई UP official online service portal.',
    officialUrl: 'https://jansunwai.up.nic.in/',
    tags: ['जनसुनवाई up'],
    isCentral: true
  },
  {
    id: 'service-15',
    name: 'UP भूलेख',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP भूलेख official online service portal.',
    officialUrl: 'https://upbhulekh.gov.in/',
    tags: ['up भूलेख'],
    isCentral: true
  },
  {
    id: 'service-16',
    name: 'UP भू-नक्शा',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP भू-नक्शा official online service portal.',
    officialUrl: 'https://upbhunaksha.gov.in/',
    tags: ['up भू-नक्शा'],
    isCentral: true
  },
  {
    id: 'service-17',
    name: 'UP परिवार ID',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP परिवार ID official online service portal.',
    officialUrl: 'https://familyid.up.gov.in/',
    tags: ['up परिवार id'],
    isCentral: true
  },
  {
    id: 'service-18',
    name: 'UP राशन कार्ड',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP राशन कार्ड official online service portal.',
    officialUrl: 'https://fcs.up.gov.in/',
    tags: ['up राशन कार्ड'],
    isCentral: true
  },
  {
    id: 'service-19',
    name: 'UP रोजगार संगम',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP रोजगार संगम official online service portal.',
    officialUrl: 'https://sewayojan.up.nic.in/',
    tags: ['up रोजगार संगम'],
    isCentral: true
  },
  {
    id: 'service-20',
    name: 'UP सेवायोजन',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP सेवायोजन official online service portal.',
    officialUrl: 'https://sewayojan.up.nic.in/',
    tags: ['up सेवायोजन'],
    isCentral: true
  },
  {
    id: 'service-21',
    name: 'UP Scholarship',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP Scholarship official online service portal.',
    officialUrl: 'https://scholarship.up.gov.in/',
    tags: ['up scholarship'],
    isCentral: true
  },
  {
    id: 'service-22',
    name: 'UP जन्म प्रमाण पत्र',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP जन्म प्रमाण पत्र official online service portal.',
    officialUrl: 'https://crsorgi.gov.in/',
    tags: ['up जन्म प्रमाण पत्र'],
    isCentral: true
  },
  {
    id: 'service-23',
    name: 'UP मृत्यु प्रमाण पत्र',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP मृत्यु प्रमाण पत्र official online service portal.',
    officialUrl: 'https://crsorgi.gov.in/',
    tags: ['up मृत्यु प्रमाण पत्र'],
    isCentral: true
  },
  {
    id: 'service-24',
    name: 'UP विवाह पंजीकरण',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP विवाह पंजीकरण official online service portal.',
    officialUrl: 'https://igrsup.gov.in/',
    tags: ['up विवाह पंजीकरण'],
    isCentral: true
  },
  {
    id: 'service-25',
    name: 'UP जाति प्रमाण पत्र',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP जाति प्रमाण पत्र official online service portal.',
    officialUrl: 'https://edistrict.up.gov.in/',
    tags: ['up जाति प्रमाण पत्र'],
    isCentral: true
  },
  {
    id: 'service-26',
    name: 'UP आय प्रमाण पत्र',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP आय प्रमाण पत्र official online service portal.',
    officialUrl: 'https://edistrict.up.gov.in/',
    tags: ['up आय प्रमाण पत्र'],
    isCentral: true
  },
  {
    id: 'service-27',
    name: 'UP निवास प्रमाण पत्र',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP निवास प्रमाण पत्र official online service portal.',
    officialUrl: 'https://edistrict.up.gov.in/',
    tags: ['up निवास प्रमाण पत्र'],
    isCentral: true
  },
  {
    id: 'service-28',
    name: 'UP EWS प्रमाण पत्र',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP EWS प्रमाण पत्र official online service portal.',
    officialUrl: 'https://edistrict.up.gov.in/',
    tags: ['up ews प्रमाण पत्र'],
    isCentral: true
  },
  {
    id: 'service-29',
    name: 'UP दिव्यांग प्रमाण पत्र',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP दिव्यांग प्रमाण पत्र official online service portal.',
    officialUrl: 'https://edistrict.up.gov.in/',
    tags: ['up दिव्यांग प्रमाण पत्र'],
    isCentral: true
  },
  {
    id: 'service-30',
    name: 'UP चरित्र प्रमाण पत्र',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP चरित्र प्रमाण पत्र official online service portal.',
    officialUrl: 'https://cctnsup.gov.in/',
    tags: ['up चरित्र प्रमाण पत्र'],
    isCentral: true
  },
  {
    id: 'service-31',
    name: 'UP हैसियत प्रमाण पत्र',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP हैसियत प्रमाण पत्र official online service portal.',
    officialUrl: 'https://edistrict.up.gov.in/',
    tags: ['up हैसियत प्रमाण पत्र'],
    isCentral: true
  },
  {
    id: 'service-32',
    name: 'UP परिवार रजिस्टर',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP परिवार रजिस्टर official online service portal.',
    officialUrl: 'https://edistrict.up.gov.in/',
    tags: ['up परिवार रजिस्टर'],
    isCentral: true
  },
  {
    id: 'service-33',
    name: 'UP वरासत',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP वरासत official online service portal.',
    officialUrl: 'https://vaad.up.nic.in/',
    tags: ['up वरासत'],
    isCentral: true
  },
  {
    id: 'service-34',
    name: 'UP नामांतरण',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP नामांतरण official online service portal.',
    officialUrl: 'https://vaad.up.nic.in/',
    tags: ['up नामांतरण'],
    isCentral: true
  },
  {
    id: 'service-35',
    name: 'UP संपत्ति पंजीकरण',
    category: '2. Uttar Pradesh (UP)',
    department: 'Government Portal / Online Tool',
    description: 'Access UP संपत्ति पंजीकरण official online service portal.',
    officialUrl: 'https://igrsup.gov.in/',
    tags: ['up संपत्ति पंजीकरण'],
    isCentral: true
  },
  {
    id: 'service-36',
    name: 'UIDAI',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access UIDAI official online service portal.',
    officialUrl: 'https://uidai.gov.in/',
    tags: ['uidai'],
    isCentral: true
  },
  {
    id: 'service-37',
    name: 'Aadhaar Download',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar Download official online service portal.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/genricDownloadAadhaar',
    tags: ['aadhaar download'],
    isCentral: true
  },
  {
    id: 'service-38',
    name: 'Aadhaar PVC Card',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar PVC Card official online service portal.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/genricPVC',
    tags: ['aadhaar pvc card'],
    isCentral: true
  },
  {
    id: 'service-39',
    name: 'Aadhaar Update',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar Update official online service portal.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/',
    tags: ['aadhaar update'],
    isCentral: true
  },
  {
    id: 'service-40',
    name: 'Aadhaar Address Update',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar Address Update official online service portal.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/',
    tags: ['aadhaar address update'],
    isCentral: true
  },
  {
    id: 'service-41',
    name: 'Aadhaar Mobile Update',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar Mobile Update official online service portal.',
    officialUrl: 'https://appointments.uidai.gov.in/',
    tags: ['aadhaar mobile update'],
    isCentral: true
  },
  {
    id: 'service-42',
    name: 'Aadhaar Enrolment Status',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar Enrolment Status official online service portal.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/CheckAadhaarStatus',
    tags: ['aadhaar enrolment status'],
    isCentral: true
  },
  {
    id: 'service-43',
    name: 'Aadhaar Authentication',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar Authentication official online service portal.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/',
    tags: ['aadhaar authentication'],
    isCentral: true
  },
  {
    id: 'service-44',
    name: 'Aadhaar Verification',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar Verification official online service portal.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/verifyAadhaar',
    tags: ['aadhaar verification'],
    isCentral: true
  },
  {
    id: 'service-45',
    name: 'Aadhaar Lock/Unlock',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar Lock/Unlock official online service portal.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/lock-unlock-aadhaar',
    tags: ['aadhaar lock/unlock'],
    isCentral: true
  },
  {
    id: 'service-46',
    name: 'Aadhaar VID',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar VID official online service portal.',
    officialUrl: 'https://myaadhaar.uidai.gov.in/vid-generator',
    tags: ['aadhaar vid'],
    isCentral: true
  },
  {
    id: 'service-47',
    name: 'Aadhaar Centre Locator',
    category: '3. Aadhaar Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar Centre Locator official online service portal.',
    officialUrl: 'https://appointments.uidai.gov.in/easearch.aspx',
    tags: ['aadhaar centre locator'],
    isCentral: true
  },
  {
    id: 'service-48',
    name: 'PAN Card',
    category: '4. PAN & Income Tax',
    department: 'Government Portal / Online Tool',
    description: 'Access PAN Card official online service portal.',
    officialUrl: 'https://www.pan.utiitsl.com/',
    tags: ['pan card'],
    isCentral: true
  },
  {
    id: 'service-49',
    name: 'New PAN',
    category: '4. PAN & Income Tax',
    department: 'Government Portal / Online Tool',
    description: 'Access New PAN official online service portal.',
    officialUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    tags: ['new pan'],
    isCentral: true
  },
  {
    id: 'service-50',
    name: 'PAN Correction',
    category: '4. PAN & Income Tax',
    department: 'Government Portal / Online Tool',
    description: 'Access PAN Correction official online service portal.',
    officialUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    tags: ['pan correction'],
    isCentral: true
  },
  {
    id: 'service-51',
    name: 'PAN Reprint',
    category: '4. PAN & Income Tax',
    department: 'Government Portal / Online Tool',
    description: 'Access PAN Reprint official online service portal.',
    officialUrl: 'https://www.onlineservices.nsdl.com/paam/ReprintEPan.html',
    tags: ['pan reprint'],
    isCentral: true
  },
  {
    id: 'service-52',
    name: 'e-PAN Download',
    category: '4. PAN & Income Tax',
    department: 'Government Portal / Online Tool',
    description: 'Access e-PAN Download official online service portal.',
    officialUrl: 'https://www.onlineservices.nsdl.com/paam/requestAndDownloadEPAN.html',
    tags: ['e-pan download'],
    isCentral: true
  },
  {
    id: 'service-53',
    name: 'PAN Status',
    category: '4. PAN & Income Tax',
    department: 'Government Portal / Online Tool',
    description: 'Access PAN Status official online service portal.',
    officialUrl: 'https://tin.tin.nsdl.com/pantan/StatusTrack.html',
    tags: ['pan status'],
    isCentral: true
  },
  {
    id: 'service-54',
    name: 'PAN-Aadhaar Link',
    category: '4. PAN & Income Tax',
    department: 'Government Portal / Online Tool',
    description: 'Access PAN-Aadhaar Link official online service portal.',
    officialUrl: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar',
    tags: ['pan-aadhaar link'],
    isCentral: true
  },
  {
    id: 'service-55',
    name: 'Income Tax',
    category: '4. PAN & Income Tax',
    department: 'Government Portal / Online Tool',
    description: 'Access Income Tax official online service portal.',
    officialUrl: 'https://eportal.incometax.gov.in/',
    tags: ['income tax'],
    isCentral: true
  },
  {
    id: 'service-56',
    name: 'Income Tax Return',
    category: '4. PAN & Income Tax',
    department: 'Government Portal / Online Tool',
    description: 'Access Income Tax Return official online service portal.',
    officialUrl: 'https://eportal.incometax.gov.in/',
    tags: ['income tax return'],
    isCentral: true
  },
  {
    id: 'service-57',
    name: 'Income Tax Refund',
    category: '4. PAN & Income Tax',
    department: 'Government Portal / Online Tool',
    description: 'Access Income Tax Refund official online service portal.',
    officialUrl: 'https://eportal.incometax.gov.in/',
    tags: ['income tax refund'],
    isCentral: true
  },
  {
    id: 'service-58',
    name: 'Election Commission',
    category: '5. Voter ID & Election',
    department: 'Government Portal / Online Tool',
    description: 'Access Election Commission official online service portal.',
    officialUrl: 'https://eci.gov.in/',
    tags: ['election commission'],
    isCentral: true
  },
  {
    id: 'service-59',
    name: 'New Voter Registration',
    category: '5. Voter ID & Election',
    department: 'Government Portal / Online Tool',
    description: 'Access New Voter Registration official online service portal.',
    officialUrl: 'https://voters.eci.gov.in/',
    tags: ['new voter registration'],
    isCentral: true
  },
  {
    id: 'service-60',
    name: 'Voter ID Download',
    category: '5. Voter ID & Election',
    department: 'Government Portal / Online Tool',
    description: 'Access Voter ID Download official online service portal.',
    officialUrl: 'https://voters.eci.gov.in/',
    tags: ['voter id download'],
    isCentral: true
  },
  {
    id: 'service-61',
    name: 'Voter ID Correction',
    category: '5. Voter ID & Election',
    department: 'Government Portal / Online Tool',
    description: 'Access Voter ID Correction official online service portal.',
    officialUrl: 'https://voters.eci.gov.in/',
    tags: ['voter id correction'],
    isCentral: true
  },
  {
    id: 'service-62',
    name: 'Address Change',
    category: '5. Voter ID & Election',
    department: 'Government Portal / Online Tool',
    description: 'Access Address Change official online service portal.',
    officialUrl: 'https://voters.eci.gov.in/',
    tags: ['address change'],
    isCentral: true
  },
  {
    id: 'service-63',
    name: 'Voter Transfer',
    category: '5. Voter ID & Election',
    department: 'Government Portal / Online Tool',
    description: 'Access Voter Transfer official online service portal.',
    officialUrl: 'https://voters.eci.gov.in/',
    tags: ['voter transfer'],
    isCentral: true
  },
  {
    id: 'service-64',
    name: 'Voter Search',
    category: '5. Voter ID & Election',
    department: 'Government Portal / Online Tool',
    description: 'Access Voter Search official online service portal.',
    officialUrl: 'https://electoralsearch.eci.gov.in/',
    tags: ['voter search'],
    isCentral: true
  },
  {
    id: 'service-65',
    name: 'Electoral Roll',
    category: '5. Voter ID & Election',
    department: 'Government Portal / Online Tool',
    description: 'Access Electoral Roll official online service portal.',
    officialUrl: 'https://electoralsearch.eci.gov.in/',
    tags: ['electoral roll'],
    isCentral: true
  },
  {
    id: 'service-66',
    name: 'Voter Slip',
    category: '5. Voter ID & Election',
    department: 'Government Portal / Online Tool',
    description: 'Access Voter Slip official online service portal.',
    officialUrl: 'https://electoralsearch.eci.gov.in/',
    tags: ['voter slip'],
    isCentral: true
  },
  {
    id: 'service-67',
    name: 'Application Status',
    category: '5. Voter ID & Election',
    department: 'Government Portal / Online Tool',
    description: 'Access Application Status official online service portal.',
    officialUrl: 'https://voters.eci.gov.in/',
    tags: ['application status'],
    isCentral: true
  },
  {
    id: 'service-68',
    name: 'Passport Seva',
    category: '6. Passport Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Passport Seva official online service portal.',
    officialUrl: 'https://www.passportindia.gov.in/',
    tags: ['passport seva'],
    isCentral: true
  },
  {
    id: 'service-69',
    name: 'New Passport',
    category: '6. Passport Services',
    department: 'Government Portal / Online Tool',
    description: 'Access New Passport official online service portal.',
    officialUrl: 'https://www.passportindia.gov.in/',
    tags: ['new passport'],
    isCentral: true
  },
  {
    id: 'service-70',
    name: 'Passport Renewal',
    category: '6. Passport Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Passport Renewal official online service portal.',
    officialUrl: 'https://www.passportindia.gov.in/',
    tags: ['passport renewal'],
    isCentral: true
  },
  {
    id: 'service-71',
    name: 'Passport Correction',
    category: '6. Passport Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Passport Correction official online service portal.',
    officialUrl: 'https://www.passportindia.gov.in/',
    tags: ['passport correction'],
    isCentral: true
  },
  {
    id: 'service-72',
    name: 'Passport Appointment',
    category: '6. Passport Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Passport Appointment official online service portal.',
    officialUrl: 'https://www.passportindia.gov.in/',
    tags: ['passport appointment'],
    isCentral: true
  },
  {
    id: 'service-73',
    name: 'Passport Status',
    category: '6. Passport Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Passport Status official online service portal.',
    officialUrl: 'https://www.passportindia.gov.in/AppOnlineProject/statusTracker/trackStatusInpNew',
    tags: ['passport status'],
    isCentral: true
  },
  {
    id: 'service-74',
    name: 'Police Verification',
    category: '6. Passport Services',
    department: 'Government Portal / Online Tool',
    description: 'Access Police Verification official online service portal.',
    officialUrl: 'https://www.passportindia.gov.in/',
    tags: ['police verification'],
    isCentral: true
  },
  {
    id: 'service-75',
    name: 'IRCTC',
    category: '7. Railway & IRCTC',
    department: 'Government Portal / Online Tool',
    description: 'Access IRCTC official online service portal.',
    officialUrl: 'https://www.irctc.co.in/',
    tags: ['irctc'],
    isCentral: true
  },
  {
    id: 'service-76',
    name: 'Railway Ticket Booking',
    category: '7. Railway & IRCTC',
    department: 'Government Portal / Online Tool',
    description: 'Access Railway Ticket Booking official online service portal.',
    officialUrl: 'https://www.irctc.co.in/',
    tags: ['railway ticket booking'],
    isCentral: true
  },
  {
    id: 'service-77',
    name: 'Railway Ticket Cancellation',
    category: '7. Railway & IRCTC',
    department: 'Government Portal / Online Tool',
    description: 'Access Railway Ticket Cancellation official online service portal.',
    officialUrl: 'https://www.irctc.co.in/',
    tags: ['railway ticket cancellation'],
    isCentral: true
  },
  {
    id: 'service-78',
    name: 'PNR Status',
    category: '7. Railway & IRCTC',
    department: 'Government Portal / Online Tool',
    description: 'Access PNR Status official online service portal.',
    officialUrl: 'https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html',
    tags: ['pnr status'],
    isCentral: true
  },
  {
    id: 'service-79',
    name: 'Train Running Status',
    category: '7. Railway & IRCTC',
    department: 'Government Portal / Online Tool',
    description: 'Access Train Running Status official online service portal.',
    officialUrl: 'https://enquiry.indianrail.gov.in/',
    tags: ['train running status'],
    isCentral: true
  },
  {
    id: 'service-80',
    name: 'Train Schedule',
    category: '7. Railway & IRCTC',
    department: 'Government Portal / Online Tool',
    description: 'Access Train Schedule official online service portal.',
    officialUrl: 'https://enquiry.indianrail.gov.in/',
    tags: ['train schedule'],
    isCentral: true
  },
  {
    id: 'service-81',
    name: 'Railway Reservation',
    category: '7. Railway & IRCTC',
    department: 'Government Portal / Online Tool',
    description: 'Access Railway Reservation official online service portal.',
    officialUrl: 'https://www.irctc.co.in/',
    tags: ['railway reservation'],
    isCentral: true
  },
  {
    id: 'service-82',
    name: 'Railway Recruitment',
    category: '7. Railway & IRCTC',
    department: 'Government Portal / Online Tool',
    description: 'Access Railway Recruitment official online service portal.',
    officialUrl: 'https://indianrailways.gov.in/',
    tags: ['railway recruitment'],
    isCentral: true
  },
  {
    id: 'service-83',
    name: 'Railway Result',
    category: '7. Railway & IRCTC',
    department: 'Government Portal / Online Tool',
    description: 'Access Railway Result official online service portal.',
    officialUrl: 'https://indianrailways.gov.in/',
    tags: ['railway result'],
    isCentral: true
  },
  {
    id: 'service-84',
    name: 'Railway Admit Card',
    category: '7. Railway & IRCTC',
    department: 'Government Portal / Online Tool',
    description: 'Access Railway Admit Card official online service portal.',
    officialUrl: 'https://indianrailways.gov.in/',
    tags: ['railway admit card'],
    isCentral: true
  },
  {
    id: 'service-85',
    name: 'Parivahan',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access Parivahan official online service portal.',
    officialUrl: 'https://parivahan.gov.in/',
    tags: ['parivahan'],
    isCentral: true
  },
  {
    id: 'service-86',
    name: 'Learning Licence',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access Learning Licence official online service portal.',
    officialUrl: 'https://sarathi.parivahan.gov.in/',
    tags: ['learning licence'],
    isCentral: true
  },
  {
    id: 'service-87',
    name: 'Driving Licence',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access Driving Licence official online service portal.',
    officialUrl: 'https://sarathi.parivahan.gov.in/',
    tags: ['driving licence'],
    isCentral: true
  },
  {
    id: 'service-88',
    name: 'DL Renewal',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access DL Renewal official online service portal.',
    officialUrl: 'https://sarathi.parivahan.gov.in/',
    tags: ['dl renewal'],
    isCentral: true
  },
  {
    id: 'service-89',
    name: 'DL Correction',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access DL Correction official online service portal.',
    officialUrl: 'https://sarathi.parivahan.gov.in/',
    tags: ['dl correction'],
    isCentral: true
  },
  {
    id: 'service-90',
    name: 'DL Download',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access DL Download official online service portal.',
    officialUrl: 'https://sarathi.parivahan.gov.in/',
    tags: ['dl download'],
    isCentral: true
  },
  {
    id: 'service-91',
    name: 'Vehicle Registration',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access Vehicle Registration official online service portal.',
    officialUrl: 'https://vahan.parivahan.gov.in/',
    tags: ['vehicle registration'],
    isCentral: true
  },
  {
    id: 'service-92',
    name: 'RC Download',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access RC Download official online service portal.',
    officialUrl: 'https://vahan.parivahan.gov.in/',
    tags: ['rc download'],
    isCentral: true
  },
  {
    id: 'service-93',
    name: 'RC Transfer',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access RC Transfer official online service portal.',
    officialUrl: 'https://vahan.parivahan.gov.in/',
    tags: ['rc transfer'],
    isCentral: true
  },
  {
    id: 'service-94',
    name: 'Vehicle Tax',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access Vehicle Tax official online service portal.',
    officialUrl: 'https://vahan.parivahan.gov.in/',
    tags: ['vehicle tax'],
    isCentral: true
  },
  {
    id: 'service-95',
    name: 'Vehicle Insurance',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access Vehicle Insurance official online service portal.',
    officialUrl: 'https://vahan.parivahan.gov.in/',
    tags: ['vehicle insurance'],
    isCentral: true
  },
  {
    id: 'service-96',
    name: 'Fitness Certificate',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access Fitness Certificate official online service portal.',
    officialUrl: 'https://vahan.parivahan.gov.in/',
    tags: ['fitness certificate'],
    isCentral: true
  },
  {
    id: 'service-97',
    name: 'Permit',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access Permit official online service portal.',
    officialUrl: 'https://vahan.parivahan.gov.in/',
    tags: ['permit'],
    isCentral: true
  },
  {
    id: 'service-98',
    name: 'PUC',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access PUC official online service portal.',
    officialUrl: 'https://puc.parivahan.gov.in/',
    tags: ['puc'],
    isCentral: true
  },
  {
    id: 'service-99',
    name: 'e-Challan',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access e-Challan official online service portal.',
    officialUrl: 'https://echallan.parivahan.gov.in/',
    tags: ['e-challan'],
    isCentral: true
  },
  {
    id: 'service-100',
    name: 'FASTag',
    category: '8. Driving Licence & Vahan',
    department: 'Government Portal / Online Tool',
    description: 'Access FASTag official online service portal.',
    officialUrl: 'https://www.npci.org.in/what-we-do/netc-fastag/product-overview',
    tags: ['fastag'],
    isCentral: true
  },
  {
    id: 'service-101',
    name: 'DigiLocker',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access DigiLocker official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['digilocker'],
    isCentral: true
  },
  {
    id: 'service-102',
    name: 'DigiLocker Login',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access DigiLocker Login official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['digilocker login'],
    isCentral: true
  },
  {
    id: 'service-103',
    name: 'Aadhaar Document',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access Aadhaar Document official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['aadhaar document'],
    isCentral: true
  },
  {
    id: 'service-104',
    name: 'PAN Document',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access PAN Document official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['pan document'],
    isCentral: true
  },
  {
    id: 'service-105',
    name: 'Driving Licence',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access Driving Licence official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['driving licence'],
    isCentral: true
  },
  {
    id: 'service-106',
    name: 'RC',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access RC official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['rc'],
    isCentral: true
  },
  {
    id: 'service-107',
    name: 'Marksheet',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access Marksheet official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['marksheet'],
    isCentral: true
  },
  {
    id: 'service-108',
    name: 'Degree Certificate',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access Degree Certificate official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['degree certificate'],
    isCentral: true
  },
  {
    id: 'service-109',
    name: 'Birth Certificate',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access Birth Certificate official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['birth certificate'],
    isCentral: true
  },
  {
    id: 'service-110',
    name: 'Caste Certificate',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access Caste Certificate official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['caste certificate'],
    isCentral: true
  },
  {
    id: 'service-111',
    name: 'Income Certificate',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access Income Certificate official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['income certificate'],
    isCentral: true
  },
  {
    id: 'service-112',
    name: 'Residence Certificate',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access Residence Certificate official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['residence certificate'],
    isCentral: true
  },
  {
    id: 'service-113',
    name: 'अन्य सरकारी दस्तावेज',
    category: '9. DigiLocker & Documents',
    department: 'Government Portal / Online Tool',
    description: 'Access अन्य सरकारी दस्तावेज official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['अन्य सरकारी दस्तावेज'],
    isCentral: true
  },
  {
    id: 'service-114',
    name: 'PM Kisan',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access PM Kisan official online service portal.',
    officialUrl: 'https://pmkisan.gov.in/',
    tags: ['pm kisan'],
    isCentral: true
  },
  {
    id: 'service-115',
    name: 'PM Awas Yojana',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access PM Awas Yojana official online service portal.',
    officialUrl: 'https://pmayg.nic.in/',
    tags: ['pm awas yojana'],
    isCentral: true
  },
  {
    id: 'service-116',
    name: 'Ayushman Bharat',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access Ayushman Bharat official online service portal.',
    officialUrl: 'https://beneficiary.nha.gov.in/',
    tags: ['ayushman bharat'],
    isCentral: true
  },
  {
    id: 'service-117',
    name: 'PM Ujjwala Yojana',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access PM Ujjwala Yojana official online service portal.',
    officialUrl: 'https://www.pmuy.gov.in/',
    tags: ['pm ujjwala yojana'],
    isCentral: true
  },
  {
    id: 'service-118',
    name: 'PM Jan Dhan Yojana',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access PM Jan Dhan Yojana official online service portal.',
    officialUrl: 'https://pmjdy.gov.in/',
    tags: ['pm jan dhan yojana'],
    isCentral: true
  },
  {
    id: 'service-119',
    name: 'PM Mudra Yojana',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access PM Mudra Yojana official online service portal.',
    officialUrl: 'https://www.mudra.org.in/',
    tags: ['pm mudra yojana'],
    isCentral: true
  },
  {
    id: 'service-120',
    name: 'PM Vishwakarma',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access PM Vishwakarma official online service portal.',
    officialUrl: 'https://pmvishwakarma.gov.in/',
    tags: ['pm vishwakarma'],
    isCentral: true
  },
  {
    id: 'service-121',
    name: 'PM SVANidhi',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access PM SVANidhi official online service portal.',
    officialUrl: 'https://pmsvanidhi.mohua.gov.in/',
    tags: ['pm svanidhi'],
    isCentral: true
  },
  {
    id: 'service-122',
    name: 'PM Fasal Bima',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access PM Fasal Bima official online service portal.',
    officialUrl: 'https://pmfby.gov.in/',
    tags: ['pm fasal bima'],
    isCentral: true
  },
  {
    id: 'service-123',
    name: 'PM Jeevan Jyoti Bima',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access PM Jeevan Jyoti Bima official online service portal.',
    officialUrl: 'https://jansuraksha.gov.in/',
    tags: ['pm jeevan jyoti bima'],
    isCentral: true
  },
  {
    id: 'service-124',
    name: 'PM Suraksha Bima',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access PM Suraksha Bima official online service portal.',
    officialUrl: 'https://jansuraksha.gov.in/',
    tags: ['pm suraksha bima'],
    isCentral: true
  },
  {
    id: 'service-125',
    name: 'Atal Pension Yojana',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access Atal Pension Yojana official online service portal.',
    officialUrl: 'https://npscra.nsdl.co.in/',
    tags: ['atal pension yojana'],
    isCentral: true
  },
  {
    id: 'service-126',
    name: 'Sukanya Samriddhi',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access Sukanya Samriddhi official online service portal.',
    officialUrl: 'https://www.indiapost.gov.in/',
    tags: ['sukanya samriddhi'],
    isCentral: true
  },
  {
    id: 'service-127',
    name: 'myScheme',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access myScheme official online service portal.',
    officialUrl: 'https://www.myscheme.gov.in/',
    tags: ['myscheme'],
    isCentral: true
  },
  {
    id: 'service-128',
    name: 'National Government Services',
    category: '10. Sarkari Yojana',
    department: 'Government Portal / Online Tool',
    description: 'Access National Government Services official online service portal.',
    officialUrl: 'https://services.india.gov.in/',
    tags: ['national government services'],
    isCentral: true
  },
  {
    id: 'service-129',
    name: 'वृद्धावस्था पेंशन',
    category: '11. Pension & Kalyan',
    department: 'Government Portal / Online Tool',
    description: 'Access वृद्धावस्था पेंशन official online service portal.',
    officialUrl: 'https://sspy-up.gov.in/',
    tags: ['वृद्धावस्था पेंशन'],
    isCentral: true
  },
  {
    id: 'service-130',
    name: 'विधवा पेंशन',
    category: '11. Pension & Kalyan',
    department: 'Government Portal / Online Tool',
    description: 'Access विधवा पेंशन official online service portal.',
    officialUrl: 'https://sspy-up.gov.in/',
    tags: ['विधवा पेंशन'],
    isCentral: true
  },
  {
    id: 'service-131',
    name: 'दिव्यांग पेंशन',
    category: '11. Pension & Kalyan',
    department: 'Government Portal / Online Tool',
    description: 'Access दिव्यांग पेंशन official online service portal.',
    officialUrl: 'https://sspy-up.gov.in/',
    tags: ['दिव्यांग पेंशन'],
    isCentral: true
  },
  {
    id: 'service-132',
    name: 'राष्ट्रीय पारिवारिक लाभ',
    category: '11. Pension & Kalyan',
    department: 'Government Portal / Online Tool',
    description: 'Access राष्ट्रीय पारिवारिक लाभ official online service portal.',
    officialUrl: 'https://sspy-up.gov.in/',
    tags: ['राष्ट्रीय पारिवारिक लाभ'],
    isCentral: true
  },
  {
    id: 'service-133',
    name: 'कन्या सुमंगला',
    category: '11. Pension & Kalyan',
    department: 'Government Portal / Online Tool',
    description: 'Access कन्या सुमंगला official online service portal.',
    officialUrl: 'https://mksy.up.gov.in/',
    tags: ['कन्या सुमंगला'],
    isCentral: true
  },
  {
    id: 'service-134',
    name: 'मुख्यमंत्री सामूहिक विवाह',
    category: '11. Pension & Kalyan',
    department: 'Government Portal / Online Tool',
    description: 'Access मुख्यमंत्री सामूहिक विवाह official online service portal.',
    officialUrl: 'https://shadianudan.upsdc.gov.in/',
    tags: ['मुख्यमंत्री सामूहिक विवाह'],
    isCentral: true
  },
  {
    id: 'service-135',
    name: 'महिला कल्याण योजनाएँ',
    category: '11. Pension & Kalyan',
    department: 'Government Portal / Online Tool',
    description: 'Access महिला कल्याण योजनाएँ official online service portal.',
    officialUrl: 'https://wcd.nic.in/',
    tags: ['महिला कल्याण योजनाएँ'],
    isCentral: true
  },
  {
    id: 'service-136',
    name: 'बाल कल्याण योजनाएँ',
    category: '11. Pension & Kalyan',
    department: 'Government Portal / Online Tool',
    description: 'Access बाल कल्याण योजनाएँ official online service portal.',
    officialUrl: 'https://wcd.nic.in/',
    tags: ['बाल कल्याण योजनाएँ'],
    isCentral: true
  },
  {
    id: 'service-137',
    name: 'किसान योजनाएँ',
    category: '11. Pension & Kalyan',
    department: 'Government Portal / Online Tool',
    description: 'Access किसान योजनाएँ official online service portal.',
    officialUrl: 'https://agricoop.nic.in/',
    tags: ['किसान योजनाएँ'],
    isCentral: true
  },
  {
    id: 'service-138',
    name: 'श्रमिक योजनाएँ',
    category: '11. Pension & Kalyan',
    department: 'Government Portal / Online Tool',
    description: 'Access श्रमिक योजनाएँ official online service portal.',
    officialUrl: 'https://upbocw.in/',
    tags: ['श्रमिक योजनाएँ'],
    isCentral: true
  },
  {
    id: 'service-139',
    name: 'NFSA',
    category: '12. Ration Card & Food',
    department: 'Government Portal / Online Tool',
    description: 'Access NFSA official online service portal.',
    officialUrl: 'https://nfsa.gov.in/',
    tags: ['nfsa'],
    isCentral: true
  },
  {
    id: 'service-140',
    name: 'राशन कार्ड आवेदन',
    category: '12. Ration Card & Food',
    department: 'Government Portal / Online Tool',
    description: 'Access राशन कार्ड आवेदन official online service portal.',
    officialUrl: 'https://fcs.up.gov.in/',
    tags: ['राशन कार्ड आवेदन'],
    isCentral: true
  },
  {
    id: 'service-141',
    name: 'राशन कार्ड डाउनलोड',
    category: '12. Ration Card & Food',
    department: 'Government Portal / Online Tool',
    description: 'Access राशन कार्ड डाउनलोड official online service portal.',
    officialUrl: 'https://nfsa.gov.in/',
    tags: ['राशन कार्ड डाउनलोड'],
    isCentral: true
  },
  {
    id: 'service-142',
    name: 'राशन कार्ड संशोधन',
    category: '12. Ration Card & Food',
    department: 'Government Portal / Online Tool',
    description: 'Access राशन कार्ड संशोधन official online service portal.',
    officialUrl: 'https://fcs.up.gov.in/',
    tags: ['राशन कार्ड संशोधन'],
    isCentral: true
  },
  {
    id: 'service-143',
    name: 'नाम जोड़ना',
    category: '12. Ration Card & Food',
    department: 'Government Portal / Online Tool',
    description: 'Access नाम जोड़ना official online service portal.',
    officialUrl: 'https://fcs.up.gov.in/',
    tags: ['नाम जोड़ना'],
    isCentral: true
  },
  {
    id: 'service-144',
    name: 'नाम हटाना',
    category: '12. Ration Card & Food',
    department: 'Government Portal / Online Tool',
    description: 'Access नाम हटाना official online service portal.',
    officialUrl: 'https://fcs.up.gov.in/',
    tags: ['नाम हटाना'],
    isCentral: true
  },
  {
    id: 'service-145',
    name: 'परिवार सदस्य जोड़ना',
    category: '12. Ration Card & Food',
    department: 'Government Portal / Online Tool',
    description: 'Access परिवार सदस्य जोड़ना official online service portal.',
    officialUrl: 'https://fcs.up.gov.in/',
    tags: ['परिवार सदस्य जोड़ना'],
    isCentral: true
  },
  {
    id: 'service-146',
    name: 'राशन कार्ड स्थिति',
    category: '12. Ration Card & Food',
    department: 'Government Portal / Online Tool',
    description: 'Access राशन कार्ड स्थिति official online service portal.',
    officialUrl: 'https://nfsa.gov.in/',
    tags: ['राशन कार्ड स्थिति'],
    isCentral: true
  },
  {
    id: 'service-147',
    name: 'राशन वितरण स्थिति',
    category: '12. Ration Card & Food',
    department: 'Government Portal / Online Tool',
    description: 'Access राशन वितरण स्थिति official online service portal.',
    officialUrl: 'https://nfsa.gov.in/',
    tags: ['राशन वितरण स्थिति'],
    isCentral: true
  },
  {
    id: 'service-148',
    name: 'e-Shram',
    category: '13. Shramik & Labour',
    department: 'Government Portal / Online Tool',
    description: 'Access e-Shram official online service portal.',
    officialUrl: 'https://eshram.gov.in/',
    tags: ['e-shram'],
    isCentral: true
  },
  {
    id: 'service-149',
    name: 'Labour Card',
    category: '13. Shramik & Labour',
    department: 'Government Portal / Online Tool',
    description: 'Access Labour Card official online service portal.',
    officialUrl: 'https://upbocw.in/',
    tags: ['labour card'],
    isCentral: true
  },
  {
    id: 'service-150',
    name: 'Construction Worker Registration',
    category: '13. Shramik & Labour',
    department: 'Government Portal / Online Tool',
    description: 'Access Construction Worker Registration official online service portal.',
    officialUrl: 'https://upbocw.in/',
    tags: ['construction worker registration'],
    isCentral: true
  },
  {
    id: 'service-151',
    name: 'Labour Renewal',
    category: '13. Shramik & Labour',
    department: 'Government Portal / Online Tool',
    description: 'Access Labour Renewal official online service portal.',
    officialUrl: 'https://upbocw.in/',
    tags: ['labour renewal'],
    isCentral: true
  },
  {
    id: 'service-152',
    name: 'Labour Welfare Schemes',
    category: '13. Shramik & Labour',
    department: 'Government Portal / Online Tool',
    description: 'Access Labour Welfare Schemes official online service portal.',
    officialUrl: 'https://upbocw.in/',
    tags: ['labour welfare schemes'],
    isCentral: true
  },
  {
    id: 'service-153',
    name: 'Labour Scholarship',
    category: '13. Shramik & Labour',
    department: 'Government Portal / Online Tool',
    description: 'Access Labour Scholarship official online service portal.',
    officialUrl: 'https://upbocw.in/',
    tags: ['labour scholarship'],
    isCentral: true
  },
  {
    id: 'service-154',
    name: 'Labour Marriage Assistance',
    category: '13. Shramik & Labour',
    department: 'Government Portal / Online Tool',
    description: 'Access Labour Marriage Assistance official online service portal.',
    officialUrl: 'https://upbocw.in/',
    tags: ['labour marriage assistance'],
    isCentral: true
  },
  {
    id: 'service-155',
    name: 'Labour Medical Assistance',
    category: '13. Shramik & Labour',
    department: 'Government Portal / Online Tool',
    description: 'Access Labour Medical Assistance official online service portal.',
    officialUrl: 'https://upbocw.in/',
    tags: ['labour medical assistance'],
    isCentral: true
  },
  {
    id: 'service-156',
    name: 'PM Kisan',
    category: '14. Kisan & Agriculture',
    department: 'Government Portal / Online Tool',
    description: 'Access PM Kisan official online service portal.',
    officialUrl: 'https://pmkisan.gov.in/',
    tags: ['pm kisan'],
    isCentral: true
  },
  {
    id: 'service-157',
    name: 'Kisan Registration',
    category: '14. Kisan & Agriculture',
    department: 'Government Portal / Online Tool',
    description: 'Access Kisan Registration official online service portal.',
    officialUrl: 'https://upagriculture.com/',
    tags: ['kisan registration'],
    isCentral: true
  },
  {
    id: 'fr-1',
    name: 'Farmer Registry Registration',
    hindiName: 'किसान रजिस्ट्री पंजीकरण',
    category: '26. Farmer Registry (किसान रजिस्ट्री)',
    department: 'UP Agriculture Dept / AgriStack',
    description: 'Register as a new farmer on the official UP Agristack portal.',
    officialUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    actionText: 'पंजीकरण करें',
    statusCheckUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    statusText: 'स्थिति देखें',
    guidelinesUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    guidelineText: 'आधिकारिक पोर्टल',
    tags: ['farmer registry', 'किसान रजिस्ट्री', 'किसान रजिस्ट्रेशन', 'agristack', 'up farmer registry', 'किसान पंजीकरण'],
    isCentral: false,
    state: 'UP State',
    note: 'आगे की प्रक्रिया आधिकारिक सरकारी पोर्टल पर होगी।',
    isPopular: true
  },
  {
    id: 'fr-2',
    name: 'Farmer Registry Status',
    hindiName: 'पंजीकरण की स्थिति',
    category: '26. Farmer Registry (किसान रजिस्ट्री)',
    department: 'UP Agriculture Dept / AgriStack',
    description: 'Check the live status of your Farmer Registry application.',
    officialUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    actionText: 'स्थिति देखें',
    statusCheckUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    statusText: 'पंजीकरण करें',
    guidelinesUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    guidelineText: 'आधिकारिक पोर्टल',
    tags: ['farmer registry status', 'किसान रजिस्ट्री', 'स्थिति', 'agristack'],
    isCentral: false,
    state: 'UP State',
    note: 'आगे की प्रक्रिया आधिकारिक सरकारी पोर्टल पर होगी।'
  },
  {
    id: 'fr-3',
    name: 'Farmer ID / Registration Details',
    hindiName: 'किसान आईडी / विवरण',
    category: '26. Farmer Registry (किसान रजिस्ट्री)',
    department: 'UP Agriculture Dept / AgriStack',
    description: 'Search and download your official Farmer ID and registration details.',
    officialUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    actionText: 'Farmer ID',
    statusCheckUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    statusText: 'स्थिति देखें',
    guidelinesUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    guidelineText: 'आधिकारिक पोर्टल',
    tags: ['farmer id', 'किसान आईडी', 'किसान रजिस्ट्रेशन', 'agristack'],
    isCentral: false,
    state: 'UP State',
    note: 'आगे की प्रक्रिया आधिकारिक सरकारी पोर्टल पर होगी।'
  },
  {
    id: 'fr-4',
    name: 'Farmer Details',
    hindiName: 'किसान का विवरण',
    category: '26. Farmer Registry (किसान रजिस्ट्री)',
    department: 'UP Agriculture Dept / AgriStack',
    description: 'View comprehensive farmer details and demographic information.',
    officialUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    actionText: 'विवरण देखें',
    statusCheckUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    statusText: 'स्थिति देखें',
    guidelinesUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    guidelineText: 'आधिकारिक पोर्टल',
    tags: ['farmer details', 'किसान का विवरण', 'किसान रजिस्ट्री'],
    isCentral: false,
    state: 'UP State',
    note: 'आगे की प्रक्रिया आधिकारिक सरकारी पोर्टल पर होगी।'
  },
  {
    id: 'fr-5',
    name: 'Land / Account Info',
    hindiName: 'भूमि/खाता संबंधी जानकारी',
    category: '26. Farmer Registry (किसान रजिस्ट्री)',
    department: 'UP Agriculture Dept / AgriStack',
    description: 'Link and verify your land records (Bhulekh) and bank account details.',
    officialUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    actionText: 'भूमि जानकारी',
    statusCheckUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    statusText: 'स्थिति देखें',
    guidelinesUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    guidelineText: 'आधिकारिक पोर्टल',
    tags: ['land record', 'भूमि', 'खाता', 'किसान रजिस्ट्री', 'bhulekh', 'farmer registry'],
    isCentral: false,
    state: 'UP State',
    note: 'आगे की प्रक्रिया आधिकारिक सरकारी पोर्टल पर होगी।'
  },
  {
    id: 'fr-6',
    name: 'e-KYC / Farmer Verification',
    hindiName: 'e-KYC / किसान सत्यापन',
    category: '26. Farmer Registry (किसान रजिस्ट्री)',
    department: 'UP Agriculture Dept / AgriStack',
    description: 'Complete your Aadhaar based e-KYC for Farmer Registry.',
    officialUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    actionText: 'e-KYC करें',
    statusCheckUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    statusText: 'स्थिति देखें',
    guidelinesUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    guidelineText: 'आधिकारिक पोर्टल',
    tags: ['ekyc', 'e-kyc', 'किसान सत्यापन', 'farmer verification', 'agristack'],
    isCentral: false,
    state: 'UP State',
    note: 'आगे की प्रक्रिया आधिकारिक सरकारी पोर्टल पर होगी।'
  },
  {
    id: 'fr-7',
    name: 'CSC Farmer Registry Service',
    hindiName: 'CSC से किसान रजिस्ट्री सेवा',
    category: '26. Farmer Registry (किसान रजिस्ट्री)',
    department: 'UP Agriculture Dept / AgriStack',
    description: 'Login via CSC VLE to provide Farmer Registry services to citizens.',
    officialUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    actionText: 'CSC Login',
    statusCheckUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    statusText: 'स्थिति देखें',
    guidelinesUrl: 'https://upfr.agristack.gov.in/farmer-registry-up/',
    guidelineText: 'आधिकारिक पोर्टल',
    tags: ['csc', 'vle', 'csc farmer registry', 'agristack'],
    isCentral: false,
    state: 'UP State',
    note: 'आगे की प्रक्रिया आधिकारिक सरकारी पोर्टल पर होगी।'
  },
  {
    id: 'service-158',
    name: 'Kisan Credit Card',
    category: '14. Kisan & Agriculture',
    department: 'Government Portal / Online Tool',
    description: 'Access Kisan Credit Card official online service portal.',
    officialUrl: 'https://pmkisan.gov.in/KCC.aspx',
    tags: ['kisan credit card'],
    isCentral: true
  },
  {
    id: 'service-159',
    name: 'Crop Insurance',
    category: '14. Kisan & Agriculture',
    department: 'Government Portal / Online Tool',
    description: 'Access Crop Insurance official online service portal.',
    officialUrl: 'https://pmfby.gov.in/',
    tags: ['crop insurance'],
    isCentral: true
  },
  {
    id: 'service-160',
    name: 'Crop Registration',
    category: '14. Kisan & Agriculture',
    department: 'Government Portal / Online Tool',
    description: 'Access Crop Registration official online service portal.',
    officialUrl: 'https://upagriculture.com/',
    tags: ['crop registration'],
    isCentral: true
  },
  {
    id: 'service-161',
    name: 'Agriculture Subsidy',
    category: '14. Kisan & Agriculture',
    department: 'Government Portal / Online Tool',
    description: 'Access Agriculture Subsidy official online service portal.',
    officialUrl: 'https://upagriculture.com/',
    tags: ['agriculture subsidy'],
    isCentral: true
  },
  {
    id: 'service-162',
    name: 'कृषि उपकरण अनुदान',
    category: '14. Kisan & Agriculture',
    department: 'Government Portal / Online Tool',
    description: 'Access कृषि उपकरण अनुदान official online service portal.',
    officialUrl: 'https://upagriculture.com/',
    tags: ['कृषि उपकरण अनुदान'],
    isCentral: true
  },
  {
    id: 'service-163',
    name: 'बीज/कृषि अनुदान',
    category: '14. Kisan & Agriculture',
    department: 'Government Portal / Online Tool',
    description: 'Access बीज/कृषि अनुदान official online service portal.',
    officialUrl: 'https://upagriculture.com/',
    tags: ['बीज/कृषि अनुदान'],
    isCentral: true
  },
  {
    id: 'service-164',
    name: 'किसान सम्मान निधि Status',
    category: '14. Kisan & Agriculture',
    department: 'Government Portal / Online Tool',
    description: 'Access किसान सम्मान निधि Status official online service portal.',
    officialUrl: 'https://pmkisan.gov.in/',
    tags: ['किसान सम्मान निधि status'],
    isCentral: true
  },
  {
    id: 'service-165',
    name: 'National Scholarship Portal',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access National Scholarship Portal official online service portal.',
    officialUrl: 'https://scholarships.gov.in/',
    tags: ['national scholarship portal'],
    isCentral: true
  },
  {
    id: 'service-166',
    name: 'UP Scholarship',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access UP Scholarship official online service portal.',
    officialUrl: 'https://scholarship.up.gov.in/',
    tags: ['up scholarship'],
    isCentral: true
  },
  {
    id: 'service-167',
    name: 'NTA',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access NTA official online service portal.',
    officialUrl: 'https://nta.ac.in/',
    tags: ['nta'],
    isCentral: true
  },
  {
    id: 'service-168',
    name: 'JEE',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access JEE official online service portal.',
    officialUrl: 'https://jeemain.nta.nic.in/',
    tags: ['jee'],
    isCentral: true
  },
  {
    id: 'service-169',
    name: 'NEET',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access NEET official online service portal.',
    officialUrl: 'https://neet.nta.nic.in/',
    tags: ['neet'],
    isCentral: true
  },
  {
    id: 'service-170',
    name: 'CUET',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access CUET official online service portal.',
    officialUrl: 'https://cuet.samarth.ac.in/',
    tags: ['cuet'],
    isCentral: true
  },
  {
    id: 'service-171',
    name: 'UGC',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access UGC official online service portal.',
    officialUrl: 'https://ugc.ac.in/',
    tags: ['ugc'],
    isCentral: true
  },
  {
    id: 'service-172',
    name: 'AICTE',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access AICTE official online service portal.',
    officialUrl: 'https://aicte-india.org/',
    tags: ['aicte'],
    isCentral: true
  },
  {
    id: 'service-173',
    name: 'University Admission',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access University Admission official online service portal.',
    officialUrl: 'https://www.education.gov.in/',
    tags: ['university admission'],
    isCentral: true
  },
  {
    id: 'service-174',
    name: 'College Admission',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access College Admission official online service portal.',
    officialUrl: 'https://www.education.gov.in/',
    tags: ['college admission'],
    isCentral: true
  },
  {
    id: 'service-175',
    name: 'ITI',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access ITI official online service portal.',
    officialUrl: 'https://www.scvtup.in/',
    tags: ['iti'],
    isCentral: true
  },
  {
    id: 'service-176',
    name: 'Polytechnic',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access Polytechnic official online service portal.',
    officialUrl: 'https://jeecup.admissions.nic.in/',
    tags: ['polytechnic'],
    isCentral: true
  },
  {
    id: 'service-177',
    name: 'परीक्षा आवेदन',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access परीक्षा आवेदन official online service portal.',
    officialUrl: 'https://www.education.gov.in/',
    tags: ['परीक्षा आवेदन'],
    isCentral: true
  },
  {
    id: 'service-178',
    name: 'Admit Card',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access Admit Card official online service portal.',
    officialUrl: 'https://www.education.gov.in/',
    tags: ['admit card'],
    isCentral: true
  },
  {
    id: 'service-179',
    name: 'Result',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access Result official online service portal.',
    officialUrl: 'https://www.education.gov.in/',
    tags: ['result'],
    isCentral: true
  },
  {
    id: 'service-180',
    name: 'Marksheet',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access Marksheet official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['marksheet'],
    isCentral: true
  },
  {
    id: 'service-181',
    name: 'Degree',
    category: '15. Education & Scholarship',
    department: 'Government Portal / Online Tool',
    description: 'Access Degree official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['degree'],
    isCentral: true
  },
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  {
    id: 'service-198',
    name: 'EPFO',
    category: '17. EPFO & PF',
    department: 'Government Portal / Online Tool',
    description: 'Access EPFO official online service portal.',
    officialUrl: 'https://epfindia.gov.in/',
    tags: ['epfo'],
    isCentral: true
  },
  {
    id: 'service-199',
    name: 'UAN',
    category: '17. EPFO & PF',
    department: 'Government Portal / Online Tool',
    description: 'Access UAN official online service portal.',
    officialUrl: 'https://unifiedportal-mem.epfindia.gov.in/',
    tags: ['uan'],
    isCentral: true
  },
  {
    id: 'service-200',
    name: 'PF Balance',
    category: '17. EPFO & PF',
    department: 'Government Portal / Online Tool',
    description: 'Access PF Balance official online service portal.',
    officialUrl: 'https://passbook.epfindia.gov.in/',
    tags: ['pf balance'],
    isCentral: true
  },
  {
    id: 'service-201',
    name: 'PF Claim',
    category: '17. EPFO & PF',
    department: 'Government Portal / Online Tool',
    description: 'Access PF Claim official online service portal.',
    officialUrl: 'https://unifiedportal-mem.epfindia.gov.in/',
    tags: ['pf claim'],
    isCentral: true
  },
  {
    id: 'service-202',
    name: 'PF Passbook',
    category: '17. EPFO & PF',
    department: 'Government Portal / Online Tool',
    description: 'Access PF Passbook official online service portal.',
    officialUrl: 'https://passbook.epfindia.gov.in/',
    tags: ['pf passbook'],
    isCentral: true
  },
  {
    id: 'service-203',
    name: 'ESIC',
    category: '17. EPFO & PF',
    department: 'Government Portal / Online Tool',
    description: 'Access ESIC official online service portal.',
    officialUrl: 'https://www.esic.in/',
    tags: ['esic'],
    isCentral: true
  },
  {
    id: 'service-204',
    name: 'Pension Services',
    category: '17. EPFO & PF',
    department: 'Government Portal / Online Tool',
    description: 'Access Pension Services official online service portal.',
    officialUrl: 'https://pensionersportal.gov.in/',
    tags: ['pension services'],
    isCentral: true
  },
  {
    id: 'service-205',
    name: 'AEPS',
    category: '18. Banking & Finance',
    department: 'Government Portal / Online Tool',
    description: 'Access AEPS official online service portal.',
    officialUrl: 'https://www.npci.org.in/',
    tags: ['aeps'],
    isCentral: true
  },
  {
    id: 'service-206',
    name: 'BBPS',
    category: '18. Banking & Finance',
    department: 'Government Portal / Online Tool',
    description: 'Access BBPS official online service portal.',
    officialUrl: 'https://www.bharatbillpay.com/',
    tags: ['bbps'],
    isCentral: true
  },
  {
    id: 'service-207',
    name: 'Banking Services',
    category: '18. Banking & Finance',
    department: 'Government Portal / Online Tool',
    description: 'Access Banking Services official online service portal.',
    officialUrl: 'https://www.rbi.org.in/',
    tags: ['banking services'],
    isCentral: true
  },
  {
    id: 'service-208',
    name: 'Money Transfer',
    category: '18. Banking & Finance',
    department: 'Government Portal / Online Tool',
    description: 'Access Money Transfer official online service portal.',
    officialUrl: 'https://www.npci.org.in/',
    tags: ['money transfer'],
    isCentral: true
  },
  {
    id: 'service-209',
    name: 'Bill Payment',
    category: '18. Banking & Finance',
    department: 'Government Portal / Online Tool',
    description: 'Access Bill Payment official online service portal.',
    officialUrl: 'https://www.bharatbillpay.com/',
    tags: ['bill payment'],
    isCentral: true
  },
  {
    id: 'service-210',
    name: 'Insurance',
    category: '18. Banking & Finance',
    department: 'Government Portal / Online Tool',
    description: 'Access Insurance official online service portal.',
    officialUrl: 'https://irdai.gov.in/',
    tags: ['insurance'],
    isCentral: true
  },
  {
    id: 'service-211',
    name: 'NPS',
    category: '18. Banking & Finance',
    department: 'Government Portal / Online Tool',
    description: 'Access NPS official online service portal.',
    officialUrl: 'https://enps.nsdl.com/',
    tags: ['nps'],
    isCentral: true
  },
  {
    id: 'service-212',
    name: 'Pension',
    category: '18. Banking & Finance',
    department: 'Government Portal / Online Tool',
    description: 'Access Pension official online service portal.',
    officialUrl: 'https://pensionersportal.gov.in/',
    tags: ['pension'],
    isCentral: true
  },
  {
    id: 'service-213',
    name: 'Bank Account Services',
    category: '18. Banking & Finance',
    department: 'Government Portal / Online Tool',
    description: 'Access Bank Account Services official online service portal.',
    officialUrl: 'https://www.pmjdy.gov.in/',
    tags: ['bank account services'],
    isCentral: true
  },
  {
    id: 'service-214',
    name: 'GST',
    category: '19. Vyapar & Business',
    department: 'Government Portal / Online Tool',
    description: 'Access GST official online service portal.',
    officialUrl: 'https://www.gst.gov.in/',
    tags: ['gst'],
    isCentral: true
  },
  {
    id: 'service-215',
    name: 'GST Registration',
    category: '19. Vyapar & Business',
    department: 'Government Portal / Online Tool',
    description: 'Access GST Registration official online service portal.',
    officialUrl: 'https://reg.gst.gov.in/',
    tags: ['gst registration'],
    isCentral: true
  },
  {
    id: 'service-216',
    name: 'GST Return',
    category: '19. Vyapar & Business',
    department: 'Government Portal / Online Tool',
    description: 'Access GST Return official online service portal.',
    officialUrl: 'https://return.gst.gov.in/',
    tags: ['gst return'],
    isCentral: true
  },
  {
    id: 'service-217',
    name: 'Udyam Registration',
    category: '19. Vyapar & Business',
    department: 'Government Portal / Online Tool',
    description: 'Access Udyam Registration official online service portal.',
    officialUrl: 'https://udyamregistration.gov.in/',
    tags: ['udyam registration'],
    isCentral: true
  },
  {
    id: 'service-218',
    name: 'MSME',
    category: '19. Vyapar & Business',
    department: 'Government Portal / Online Tool',
    description: 'Access MSME official online service portal.',
    officialUrl: 'https://msme.gov.in/',
    tags: ['msme'],
    isCentral: true
  },
  {
    id: 'service-219',
    name: 'FSSAI',
    category: '19. Vyapar & Business',
    department: 'Government Portal / Online Tool',
    description: 'Access FSSAI official online service portal.',
    officialUrl: 'https://foscos.fssai.gov.in/',
    tags: ['fssai'],
    isCentral: true
  },
  {
    id: 'service-220',
    name: 'Nivesh Mitra',
    category: '19. Vyapar & Business',
    department: 'Government Portal / Online Tool',
    description: 'Access Nivesh Mitra official online service portal.',
    officialUrl: 'https://niveshmitra.up.nic.in/',
    tags: ['nivesh mitra'],
    isCentral: true
  },
  {
    id: 'service-221',
    name: 'Trade Licence',
    category: '19. Vyapar & Business',
    department: 'Government Portal / Online Tool',
    description: 'Access Trade Licence official online service portal.',
    officialUrl: 'https://niveshmitra.up.nic.in/',
    tags: ['trade licence'],
    isCentral: true
  },
  {
    id: 'service-222',
    name: 'Digital Signature',
    category: '19. Vyapar & Business',
    department: 'Government Portal / Online Tool',
    description: 'Access Digital Signature official online service portal.',
    officialUrl: 'https://cca.gov.in/',
    tags: ['digital signature'],
    isCentral: true
  },
  {
    id: 'service-223',
    name: 'DSC',
    category: '19. Vyapar & Business',
    department: 'Government Portal / Online Tool',
    description: 'Access DSC official online service portal.',
    officialUrl: 'https://cca.gov.in/',
    tags: ['dsc'],
    isCentral: true
  },
  {
    id: 'service-224',
    name: 'ABHA',
    category: '20. Swasthya & Health',
    department: 'Government Portal / Online Tool',
    description: 'Access ABHA official online service portal.',
    officialUrl: 'https://abha.abdm.gov.in/',
    tags: ['abha'],
    isCentral: true
  },
  {
    id: 'service-225',
    name: 'Ayushman Card',
    category: '20. Swasthya & Health',
    department: 'Government Portal / Online Tool',
    description: 'Access Ayushman Card official online service portal.',
    officialUrl: 'https://beneficiary.nha.gov.in/',
    tags: ['ayushman card'],
    isCentral: true
  },
  {
    id: 'service-226',
    name: 'Health Insurance',
    category: '20. Swasthya & Health',
    department: 'Government Portal / Online Tool',
    description: 'Access Health Insurance official online service portal.',
    officialUrl: 'https://pmjay.gov.in/',
    tags: ['health insurance'],
    isCentral: true
  },
  {
    id: 'service-227',
    name: 'Vaccination Certificate',
    category: '20. Swasthya & Health',
    department: 'Government Portal / Online Tool',
    description: 'Access Vaccination Certificate official online service portal.',
    officialUrl: 'https://cowin.gov.in/',
    tags: ['vaccination certificate'],
    isCentral: true
  },
  {
    id: 'service-228',
    name: 'Health Scheme',
    category: '20. Swasthya & Health',
    department: 'Government Portal / Online Tool',
    description: 'Access Health Scheme official online service portal.',
    officialUrl: 'https://mohfw.gov.in/',
    tags: ['health scheme'],
    isCentral: true
  },
  {
    id: 'service-229',
    name: 'Hospital Services',
    category: '20. Swasthya & Health',
    department: 'Government Portal / Online Tool',
    description: 'Access Hospital Services official online service portal.',
    officialUrl: 'https://ors.gov.in/',
    tags: ['hospital services'],
    isCentral: true
  },
  {
    id: 'service-230',
    name: 'बिजली बिल',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access बिजली बिल official online service portal.',
    officialUrl: 'https://uppcl.mpower.in/',
    tags: ['बिजली बिल'],
    isCentral: true
  },
  {
    id: 'service-231',
    name: 'नया बिजली कनेक्शन',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access नया बिजली कनेक्शन official online service portal.',
    officialUrl: 'https://jhatpat.uppcl.org/',
    tags: ['नया बिजली कनेक्शन'],
    isCentral: true
  },
  {
    id: 'service-232',
    name: 'बिजली बिल डाउनलोड',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access बिजली बिल डाउनलोड official online service portal.',
    officialUrl: 'https://uppcl.mpower.in/',
    tags: ['बिजली बिल डाउनलोड'],
    isCentral: true
  },
  {
    id: 'service-233',
    name: 'बिजली शिकायत',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access बिजली शिकायत official online service portal.',
    officialUrl: 'https://uppcl.org/',
    tags: ['बिजली शिकायत'],
    isCentral: true
  },
  {
    id: 'service-234',
    name: 'मीटर शिकायत',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access मीटर शिकायत official online service portal.',
    officialUrl: 'https://uppcl.org/',
    tags: ['मीटर शिकायत'],
    isCentral: true
  },
  {
    id: 'service-235',
    name: 'पानी बिल',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access पानी बिल official online service portal.',
    officialUrl: 'https://e-nagarsewaup.gov.in/',
    tags: ['पानी बिल'],
    isCentral: true
  },
  {
    id: 'service-236',
    name: 'गैस बुकिंग',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access गैस बुकिंग official online service portal.',
    officialUrl: 'https://my.ebharatgas.com/',
    tags: ['गैस बुकिंग'],
    isCentral: true
  },
  {
    id: 'service-237',
    name: 'गैस सब्सिडी',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access गैस सब्सिडी official online service portal.',
    officialUrl: 'https://mylpg.in/',
    tags: ['गैस सब्सिडी'],
    isCentral: true
  },
  {
    id: 'service-238',
    name: 'मोबाइल रिचार्ज',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access मोबाइल रिचार्ज official online service portal.',
    officialUrl: 'https://www.bharatbillpay.com/',
    tags: ['मोबाइल रिचार्ज'],
    isCentral: true
  },
  {
    id: 'service-239',
    name: 'DTH Recharge',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access DTH Recharge official online service portal.',
    officialUrl: 'https://www.bharatbillpay.com/',
    tags: ['dth recharge'],
    isCentral: true
  },
  {
    id: 'service-240',
    name: 'FASTag Recharge',
    category: '21. Bijli, Gas & Bills',
    department: 'Government Portal / Online Tool',
    description: 'Access FASTag Recharge official online service portal.',
    officialUrl: 'https://www.bharatbillpay.com/',
    tags: ['fastag recharge'],
    isCentral: true
  },
  {
    id: 'service-241',
    name: 'भूलेख',
    category: '22. Zameen & Sampatti',
    department: 'Government Portal / Online Tool',
    description: 'Access भूलेख official online service portal.',
    officialUrl: 'https://upbhulekh.gov.in/',
    tags: ['भूलेख'],
    isCentral: true
  },
  {
    id: 'service-242',
    name: 'खतौनी',
    category: '22. Zameen & Sampatti',
    department: 'Government Portal / Online Tool',
    description: 'Access खतौनी official online service portal.',
    officialUrl: 'https://upbhulekh.gov.in/',
    tags: ['खतौनी'],
    isCentral: true
  },
  {
    id: 'service-243',
    name: 'खसरा',
    category: '22. Zameen & Sampatti',
    department: 'Government Portal / Online Tool',
    description: 'Access खसरा official online service portal.',
    officialUrl: 'https://upbhulekh.gov.in/',
    tags: ['खसरा'],
    isCentral: true
  },
  {
    id: 'service-244',
    name: 'गाटा विवरण',
    category: '22. Zameen & Sampatti',
    department: 'Government Portal / Online Tool',
    description: 'Access गाटा विवरण official online service portal.',
    officialUrl: 'https://upbhulekh.gov.in/',
    tags: ['गाटा विवरण'],
    isCentral: true
  },
  {
    id: 'service-245',
    name: 'भू-नक्शा',
    category: '22. Zameen & Sampatti',
    department: 'Government Portal / Online Tool',
    description: 'Access भू-नक्शा official online service portal.',
    officialUrl: 'https://upbhunaksha.gov.in/',
    tags: ['भू-नक्शा'],
    isCentral: true
  },
  {
    id: 'service-246',
    name: 'भूमि रिकॉर्ड',
    category: '22. Zameen & Sampatti',
    department: 'Government Portal / Online Tool',
    description: 'Access भूमि रिकॉर्ड official online service portal.',
    officialUrl: 'https://upbhulekh.gov.in/',
    tags: ['भूमि रिकॉर्ड'],
    isCentral: true
  },
  {
    id: 'service-247',
    name: 'वरासत',
    category: '22. Zameen & Sampatti',
    department: 'Government Portal / Online Tool',
    description: 'Access वरासत official online service portal.',
    officialUrl: 'https://vaad.up.nic.in/',
    tags: ['वरासत'],
    isCentral: true
  },
  {
    id: 'service-248',
    name: 'नामांतरण',
    category: '22. Zameen & Sampatti',
    department: 'Government Portal / Online Tool',
    description: 'Access नामांतरण official online service portal.',
    officialUrl: 'https://vaad.up.nic.in/',
    tags: ['नामांतरण'],
    isCentral: true
  },
  {
    id: 'service-249',
    name: 'संपत्ति पंजीकरण',
    category: '22. Zameen & Sampatti',
    department: 'Government Portal / Online Tool',
    description: 'Access संपत्ति पंजीकरण official online service portal.',
    officialUrl: 'https://igrsup.gov.in/',
    tags: ['संपत्ति पंजीकरण'],
    isCentral: true
  },
  {
    id: 'service-250',
    name: 'स्टाम्प एवं रजिस्ट्रेशन',
    category: '22. Zameen & Sampatti',
    department: 'Government Portal / Online Tool',
    description: 'Access स्टाम्प एवं रजिस्ट्रेशन official online service portal.',
    officialUrl: 'https://igrsup.gov.in/',
    tags: ['स्टाम्प एवं रजिस्ट्रेशन'],
    isCentral: true
  },
  {
    id: 'service-251',
    name: 'RTI',
    category: '23. Nagrik Sevaye & Shikayat',
    department: 'Government Portal / Online Tool',
    description: 'Access RTI official online service portal.',
    officialUrl: 'https://rtionline.gov.in/',
    tags: ['rti'],
    isCentral: true
  },
  {
    id: 'service-252',
    name: 'जनसुनवाई',
    category: '23. Nagrik Sevaye & Shikayat',
    department: 'Government Portal / Online Tool',
    description: 'Access जनसुनवाई official online service portal.',
    officialUrl: 'https://jansunwai.up.nic.in/',
    tags: ['जनसुनवाई'],
    isCentral: true
  },
  {
    id: 'service-253',
    name: 'सरकारी शिकायत',
    category: '23. Nagrik Sevaye & Shikayat',
    department: 'Government Portal / Online Tool',
    description: 'Access सरकारी शिकायत official online service portal.',
    officialUrl: 'https://pgportal.gov.in/',
    tags: ['सरकारी शिकायत'],
    isCentral: true
  },
  {
    id: 'service-254',
    name: 'पुलिस शिकायत',
    category: '23. Nagrik Sevaye & Shikayat',
    department: 'Government Portal / Online Tool',
    description: 'Access पुलिस शिकायत official online service portal.',
    officialUrl: 'https://cctnsup.gov.in/',
    tags: ['पुलिस शिकायत'],
    isCentral: true
  },
  {
    id: 'service-255',
    name: 'FIR Status',
    category: '23. Nagrik Sevaye & Shikayat',
    department: 'Government Portal / Online Tool',
    description: 'Access FIR Status official online service portal.',
    officialUrl: 'https://cctnsup.gov.in/',
    tags: ['fir status'],
    isCentral: true
  },
  {
    id: 'service-256',
    name: 'Police Verification',
    category: '23. Nagrik Sevaye & Shikayat',
    department: 'Government Portal / Online Tool',
    description: 'Access Police Verification official online service portal.',
    officialUrl: 'https://cctnsup.gov.in/',
    tags: ['police verification'],
    isCentral: true
  },
  {
    id: 'service-257',
    name: 'Character Verification',
    category: '23. Nagrik Sevaye & Shikayat',
    department: 'Government Portal / Online Tool',
    description: 'Access Character Verification official online service portal.',
    officialUrl: 'https://cctnsup.gov.in/',
    tags: ['character verification'],
    isCentral: true
  },
  {
    id: 'service-258',
    name: 'Cyber Crime Complaint',
    category: '23. Nagrik Sevaye & Shikayat',
    department: 'Government Portal / Online Tool',
    description: 'Access Cyber Crime Complaint official online service portal.',
    officialUrl: 'https://cybercrime.gov.in/',
    tags: ['cyber crime complaint'],
    isCentral: true
  },
  {
    id: 'service-259',
    name: 'Consumer Complaint',
    category: '23. Nagrik Sevaye & Shikayat',
    department: 'Government Portal / Online Tool',
    description: 'Access Consumer Complaint official online service portal.',
    officialUrl: 'https://consumerhelpline.gov.in/',
    tags: ['consumer complaint'],
    isCentral: true
  },
  {
    id: 'service-260',
    name: 'India Post',
    category: '24. India Post & Yatra',
    department: 'Government Portal / Online Tool',
    description: 'Access India Post official online service portal.',
    officialUrl: 'https://www.indiapost.gov.in/',
    tags: ['india post'],
    isCentral: true
  },
  {
    id: 'service-261',
    name: 'Speed Post Tracking',
    category: '24. India Post & Yatra',
    department: 'Government Portal / Online Tool',
    description: 'Access Speed Post Tracking official online service portal.',
    officialUrl: 'https://www.indiapost.gov.in/',
    tags: ['speed post tracking'],
    isCentral: true
  },
  {
    id: 'service-262',
    name: 'Postal Services',
    category: '24. India Post & Yatra',
    department: 'Government Portal / Online Tool',
    description: 'Access Postal Services official online service portal.',
    officialUrl: 'https://www.indiapost.gov.in/',
    tags: ['postal services'],
    isCentral: true
  },
  {
    id: 'service-263',
    name: 'Post Office Banking',
    category: '24. India Post & Yatra',
    department: 'Government Portal / Online Tool',
    description: 'Access Post Office Banking official online service portal.',
    officialUrl: 'https://www.ippbonline.com/',
    tags: ['post office banking'],
    isCentral: true
  },
  {
    id: 'service-264',
    name: 'Ticket Booking',
    category: '24. India Post & Yatra',
    department: 'Government Portal / Online Tool',
    description: 'Access Ticket Booking official online service portal.',
    officialUrl: 'https://www.irctc.co.in/',
    tags: ['ticket booking'],
    isCentral: true
  },
  {
    id: 'service-265',
    name: 'Bus Ticket',
    category: '24. India Post & Yatra',
    department: 'Government Portal / Online Tool',
    description: 'Access Bus Ticket official online service portal.',
    officialUrl: 'https://upsrtc.up.gov.in/',
    tags: ['bus ticket'],
    isCentral: true
  },
  {
    id: 'service-266',
    name: 'Flight Ticket',
    category: '24. India Post & Yatra',
    department: 'Government Portal / Online Tool',
    description: 'Access Flight Ticket official online service portal.',
    officialUrl: 'https://www.airindia.com/',
    tags: ['flight ticket'],
    isCentral: true
  },
  {
    id: 'service-267',
    name: 'Online Form Filling',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access Online Form Filling official online service portal.',
    officialUrl: 'https://www.sarkariresult.com/',
    tags: ['online form filling'],
    isCentral: true
  },
  {
    id: 'service-268',
    name: 'सरकारी फॉर्म डाउनलोड',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access सरकारी फॉर्म डाउनलोड official online service portal.',
    officialUrl: 'https://www.sarkariresult.com/',
    tags: ['सरकारी फॉर्म डाउनलोड'],
    isCentral: true
  },
  {
    id: 'service-269',
    name: 'दस्तावेज स्कैन',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access दस्तावेज स्कैन official online service portal.',
    officialUrl: 'https://www.ilovepdf.com/',
    tags: ['दस्तावेज स्कैन'],
    isCentral: true
  },
  {
    id: 'service-270',
    name: 'फोटो Resize',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access फोटो Resize official online service portal.',
    officialUrl: 'https://www.iloveimg.com/resize-image',
    tags: ['फोटो resize'],
    isCentral: true
  },
  {
    id: 'service-271',
    name: 'Signature Resize',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access Signature Resize official online service portal.',
    officialUrl: 'https://www.iloveimg.com/resize-image',
    tags: ['signature resize'],
    isCentral: true
  },
  {
    id: 'service-272',
    name: 'फोटो/सिग्नेचर बनाना',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access फोटो/सिग्नेचर बनाना official online service portal.',
    officialUrl: 'https://www.remove.bg/',
    tags: ['फोटो/सिग्नेचर बनाना'],
    isCentral: true
  },
  {
    id: 'service-273',
    name: 'PDF बनाना',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access PDF बनाना official online service portal.',
    officialUrl: 'https://www.ilovepdf.com/',
    tags: ['pdf बनाना'],
    isCentral: true
  },
  {
    id: 'service-274',
    name: 'PDF Merge',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access PDF Merge official online service portal.',
    officialUrl: 'https://www.ilovepdf.com/merge_pdf',
    tags: ['pdf merge'],
    isCentral: true
  },
  {
    id: 'service-275',
    name: 'PDF Compress',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access PDF Compress official online service portal.',
    officialUrl: 'https://www.ilovepdf.com/compress_pdf',
    tags: ['pdf compress'],
    isCentral: true
  },
  {
    id: 'service-276',
    name: 'PDF से JPG',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access PDF से JPG official online service portal.',
    officialUrl: 'https://www.ilovepdf.com/pdf_to_jpg',
    tags: ['pdf से jpg'],
    isCentral: true
  },
  {
    id: 'service-277',
    name: 'JPG से PDF',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access JPG से PDF official online service portal.',
    officialUrl: 'https://www.ilovepdf.com/jpg_to_pdf',
    tags: ['jpg से pdf'],
    isCentral: true
  },
  {
    id: 'service-278',
    name: 'प्रिंटिंग',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access प्रिंटिंग official online service portal.',
    officialUrl: 'https://www.google.com/cloudprint',
    tags: ['प्रिंटिंग'],
    isCentral: true
  },
  {
    id: 'service-279',
    name: 'आवेदन स्थिति जांचना',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access आवेदन स्थिति जांचना official online service portal.',
    officialUrl: 'https://www.sarkariresult.com/',
    tags: ['आवेदन स्थिति जांचना'],
    isCentral: true
  },
  {
    id: 'service-280',
    name: 'Admit Card Download',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access Admit Card Download official online service portal.',
    officialUrl: 'https://www.sarkariresult.com/',
    tags: ['admit card download'],
    isCentral: true
  },
  {
    id: 'service-281',
    name: 'Result Download',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access Result Download official online service portal.',
    officialUrl: 'https://www.sarkariresult.com/',
    tags: ['result download'],
    isCentral: true
  },
  {
    id: 'service-282',
    name: 'सरकारी दस्तावेज Download',
    category: '25. Cyber Cafe Digital Tools',
    department: 'Government Portal / Online Tool',
    description: 'Access सरकारी दस्तावेज Download official online service portal.',
    officialUrl: 'https://www.digilocker.gov.in/',
    tags: ['सरकारी दस्तावेज download'],
    isCentral: true
  }
];
