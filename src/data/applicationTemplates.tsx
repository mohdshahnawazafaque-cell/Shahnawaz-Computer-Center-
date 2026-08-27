import React from 'react';

export type FieldType = 'text' | 'textarea' | 'date' | 'select' | 'number';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  gridCols?: 1 | 2;
}

export interface AppTemplate {
  id: string;
  fields: FormField[];
  defaultValues: Record<string, string>;
  renderDocument: React.FC<{ data: Record<string, string> }>;
}

const BaseLetterRender = ({ data }: { data: Record<string, string> }) => (
  <div className="w-full leading-relaxed text-[14px]">
    <div className="mb-6">
      <p>सेवा में,</p>
      <p className="font-bold mt-2">{data.toOfficer || 'संबंधित अधिकारी / महोदय,'}</p>
      <p>{data.officeName || 'विभाग / कार्यालय का नाम ....................................'}</p>
      <p>{data.officeAddress || 'पता ..............................................................'}</p>
    </div>

    <div className="mb-6">
      <p className="font-bold underline text-center text-[16px]">
        विषय: {data.subject}
      </p>
    </div>

    <div className="mb-6">
      <p>महोदय,</p>
      <p className="mt-2 text-justify whitespace-pre-wrap leading-loose">
        {data.details}
      </p>
    </div>

    <div className="mb-8">
      <p className="font-bold">मेरा विवरण निम्न प्रकार है:</p>
      <table className="w-full mt-2 border-collapse">
        <tbody>
          <tr>
            <td className="py-1 w-[40%]">1. आवेदक का नाम</td>
            <td className="py-1">: {data.name ? <span className="font-bold">{data.name}</span> : '..........................'}</td>
          </tr>
          <tr>
            <td className="py-1">2. पिता/पति का नाम</td>
            <td className="py-1">: {data.fatherName ? <span className="font-bold">{data.fatherName}</span> : '..........................'}</td>
          </tr>
          {data.motherName !== undefined && (
          <tr>
            <td className="py-1">3. माता का नाम</td>
            <td className="py-1">: {data.motherName ? <span className="font-bold">{data.motherName}</span> : '..........................'}</td>
          </tr>
          )}
          <tr>
            <td className="py-1">4. आधार नंबर</td>
            <td className="py-1">: {data.aadhaar ? <span className="font-bold">{data.aadhaar}</span> : '..........................'}</td>
          </tr>
          <tr>
            <td className="py-1">5. पता (ग्राम/मोहल्ला)</td>
            <td className="py-1">: {data.village ? <span className="font-bold">{data.village}</span> : '..........................'}</td>
          </tr>
          <tr>
            <td className="py-1">6. ब्लॉक / तहसील</td>
            <td className="py-1">: {data.block ? <span className="font-bold">{data.block}</span> : '..........................'} / {data.tehsil ? <span className="font-bold">{data.tehsil}</span> : '..........................'}</td>
          </tr>
          <tr>
            <td className="py-1">7. जिला</td>
            <td className="py-1">: {data.district ? <span className="font-bold">{data.district}</span> : '..........................'}</td>
          </tr>
          <tr>
            <td className="py-1">8. मोबाइल नंबर</td>
            <td className="py-1">: {data.mobile ? <span className="font-bold">{data.mobile}</span> : '..........................'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="mb-6">
      <p className="text-justify leading-loose">
        {data.conclusion || 'अतः श्रीमान जी से विनम्र निवेदन है कि उपर्युक्त तथ्यों पर विचार करते हुए मेरे आवेदन को स्वीकार करने एवं उचित कार्यवाही करने की कृपा करें। मैं सदैव आपका आभारी रहूँगा/रहूँगी।'}
      </p>
    </div>

    <div className="flex justify-between items-end mt-16">
      <div>
        <p>दिनांक: {data.date}</p>
        <p>स्थान: {data.place}</p>
      </div>
      <div className="text-center">
        <p className="mb-8">भवदीय / प्रार्थी</p>
        <p className="border-t border-black border-dashed pt-1 inline-block min-w-[150px]">(हस्ताक्षर)</p>
        <p className="font-bold">{data.name}</p>
      </div>
    </div>
  </div>
);

const baseFields: FormField[] = [
  { name: 'toOfficer', label: 'अधिकारी का पद (To Officer)', type: 'text', gridCols: 2, placeholder: 'उदा. श्रीमान शाखा प्रबंधक / श्रीमान थानाध्यक्ष' },
  { name: 'officeName', label: 'कार्यालय का नाम', type: 'text', gridCols: 1, placeholder: 'उदा. भारतीय स्टेट बैंक' },
  { name: 'officeAddress', label: 'कार्यालय का पता', type: 'text', gridCols: 1, placeholder: 'उदा. ताम्बौर, सीतापुर' },
  { name: 'subject', label: 'विषय (Subject)', type: 'text', gridCols: 2 },
  { name: 'details', label: 'विवरण (Details)', type: 'textarea', gridCols: 2 },
  { name: 'name', label: 'आवेदक का नाम', type: 'text', gridCols: 1 },
  { name: 'fatherName', label: 'पिता/पति का नाम', type: 'text', gridCols: 1 },
  { name: 'aadhaar', label: 'आधार नंबर', type: 'text', gridCols: 1 },
  { name: 'mobile', label: 'मोबाइल नंबर', type: 'text', gridCols: 1 },
  { name: 'village', label: 'ग्राम / मोहल्ला', type: 'text', gridCols: 1 },
  { name: 'block', label: 'ब्लॉक', type: 'text', gridCols: 1 },
  { name: 'tehsil', label: 'तहसील', type: 'text', gridCols: 1 },
  { name: 'district', label: 'जिला', type: 'text', gridCols: 1 },
  { name: 'place', label: 'स्थान', type: 'text', gridCols: 1 },
  { name: 'date', label: 'दिनांक', type: 'date', gridCols: 1 },
];

export const TEMPLATES: Record<string, AppTemplate> = {
  app_samanya: {
    id: 'app_samanya',
    fields: baseFields,
    defaultValues: {
      subject: 'सामान्य प्रार्थना पत्र',
      details: 'सविनय निवेदन है कि...',
      date: new Date().toISOString().split('T')[0],
      place: 'ताम्बौर'
    },
    renderDocument: BaseLetterRender,
  },
  app_income_cert: {
    id: 'app_income_cert',
    fields: [
      { name: 'toOfficer', label: 'अधिकारी का पद (To Officer)', type: 'text', gridCols: 2 },
      { name: 'officeName', label: 'कार्यालय का नाम', type: 'text', gridCols: 1 },
      { name: 'officeAddress', label: 'कार्यालय का पता', type: 'text', gridCols: 1 },
      { name: 'subject', label: 'विषय (Subject)', type: 'text', gridCols: 2 },
      { name: 'details', label: 'विवरण (Details)', type: 'textarea', gridCols: 2 },
      { name: 'name', label: 'आवेदक का नाम', type: 'text', gridCols: 1 },
      { name: 'fatherName', label: 'पिता/पति का नाम', type: 'text', gridCols: 1 },
      { name: 'annualIncome', label: 'वार्षिक आय (रुपये में)', type: 'number', gridCols: 1 },
      { name: 'incomeSource', label: 'आय का साधन', type: 'text', gridCols: 1, placeholder: 'उदा. कृषि / मजदूरी' },
      { name: 'aadhaar', label: 'आधार नंबर', type: 'text', gridCols: 1 },
      { name: 'mobile', label: 'मोबाइल नंबर', type: 'text', gridCols: 1 },
      { name: 'village', label: 'ग्राम / मोहल्ला', type: 'text', gridCols: 1 },
      { name: 'tehsil', label: 'तहसील', type: 'text', gridCols: 1 },
      { name: 'district', label: 'जिला', type: 'text', gridCols: 1 },
      { name: 'place', label: 'स्थान', type: 'text', gridCols: 1 },
      { name: 'date', label: 'दिनांक', type: 'date', gridCols: 1 },
    ],
    defaultValues: {
      toOfficer: 'श्रीमान तहसीलदार महोदय',
      officeName: 'तहसील कार्यालय',
      officeAddress: 'ताम्बौर, सीतापुर',
      subject: 'आय प्रमाण-पत्र बनवाने हेतु प्रार्थना पत्र',
      details: 'सविनय निवेदन है कि प्रार्थी एक गरीब व्यक्ति है और प्रार्थी की वार्षिक आय बहुत कम है। प्रार्थी को सरकारी योजना/छात्रवृत्ति का लाभ लेने के लिए आय प्रमाण-पत्र की आवश्यकता है। प्रार्थी के परिवार की कुल वार्षिक आय मात्र ________ रुपये है।',
      annualIncome: '36000',
      incomeSource: 'मजदूरी',
      date: new Date().toISOString().split('T')[0],
      place: 'ताम्बौर'
    },
    renderDocument: ({ data }) => (
      <div className="w-full leading-relaxed text-[14px]">
        <div className="mb-6">
          <p>सेवा में,</p>
          <p className="font-bold mt-2">{data.toOfficer}</p>
          <p>{data.officeName}</p>
          <p>{data.officeAddress}</p>
        </div>

        <div className="mb-6">
          <p className="font-bold underline text-center text-[16px]">
            विषय: {data.subject}
          </p>
        </div>

        <div className="mb-6">
          <p>महोदय,</p>
          <p className="mt-2 text-justify whitespace-pre-wrap leading-loose">
            {data.details.replace('________', data.annualIncome || '________')}
          </p>
        </div>

        <div className="mb-8">
          <p className="font-bold">प्रार्थी का विवरण निम्न प्रकार है:</p>
          <table className="w-full mt-2 border-collapse">
            <tbody>
              <tr><td className="py-1 w-[40%]">1. आवेदक का नाम</td><td className="py-1">: {data.name ? <span className="font-bold">{data.name}</span> : '..........................'}</td></tr>
              <tr><td className="py-1">2. पिता/पति का नाम</td><td className="py-1">: {data.fatherName ? <span className="font-bold">{data.fatherName}</span> : '..........................'}</td></tr>
              <tr><td className="py-1">3. वार्षिक आय</td><td className="py-1">: {data.annualIncome ? <span className="font-bold">₹ {data.annualIncome}/-</span> : '..........................'}</td></tr>
              <tr><td className="py-1">4. आय का साधन</td><td className="py-1">: {data.incomeSource ? <span className="font-bold">{data.incomeSource}</span> : '..........................'}</td></tr>
              <tr><td className="py-1">5. आधार नंबर</td><td className="py-1">: {data.aadhaar ? <span className="font-bold">{data.aadhaar}</span> : '..........................'}</td></tr>
              <tr><td className="py-1">6. पूरा पता</td><td className="py-1">: ग्राम - {data.village || '.......'}, तहसील - {data.tehsil || '.......'}, जिला - {data.district || '.......'}</td></tr>
              <tr><td className="py-1">7. मोबाइल नंबर</td><td className="py-1">: {data.mobile ? <span className="font-bold">{data.mobile}</span> : '..........................'}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <p className="text-justify leading-loose">
            अतः श्रीमान जी से विनम्र निवेदन है कि प्रार्थी के उपरोक्त तथ्यों की जाँच करवाकर आय प्रमाण-पत्र जारी करने की कृपा करें।
          </p>
        </div>

        <div className="flex justify-between items-end mt-16">
          <div><p>दिनांक: {data.date}</p><p>स्थान: {data.place}</p></div>
          <div className="text-center"><p className="mb-8">भवदीय / प्रार्थी</p><p className="border-t border-black border-dashed pt-1 inline-block min-w-[150px]">(हस्ताक्षर)</p><p className="font-bold">{data.name}</p></div>
        </div>
      </div>
    )
  },
  app_bank_account: {
    id: 'app_bank_account',
    fields: [
      { name: 'toOfficer', label: 'अधिकारी का पद', type: 'text', gridCols: 2 },
      { name: 'officeName', label: 'बैंक का नाम', type: 'text', gridCols: 1 },
      { name: 'officeAddress', label: 'शाखा का पता', type: 'text', gridCols: 1 },
      { name: 'subject', label: 'विषय', type: 'text', gridCols: 2 },
      { name: 'details', label: 'विवरण', type: 'textarea', gridCols: 2 },
      { name: 'name', label: 'खाताधारक का नाम', type: 'text', gridCols: 1 },
      { name: 'fatherName', label: 'पिता/पति का नाम', type: 'text', gridCols: 1 },
      { name: 'aadhaar', label: 'आधार नंबर', type: 'text', gridCols: 1 },
      { name: 'panCard', label: 'पैन कार्ड नंबर', type: 'text', gridCols: 1 },
      { name: 'mobile', label: 'मोबाइल नंबर', type: 'text', gridCols: 1 },
      { name: 'address', label: 'पूरा पता', type: 'textarea', gridCols: 1 },
      { name: 'place', label: 'स्थान', type: 'text', gridCols: 1 },
      { name: 'date', label: 'दिनांक', type: 'date', gridCols: 1 },
    ],
    defaultValues: {
      toOfficer: 'श्रीमान शाखा प्रबंधक महोदय',
      officeName: 'भारतीय स्टेट बैंक',
      officeAddress: 'शाखा - ताम्बौर, सीतापुर',
      subject: 'नया बचत खाता खोलने हेतु प्रार्थना पत्र',
      details: 'सविनय निवेदन है कि प्रार्थी आपके बैंक क्षेत्र का निवासी है और आपके बैंक में अपना एक नया बचत खाता (Saving Account) खोलना चाहता है, ताकि बैंक की सुविधाओं का लाभ उठा सके। प्रार्थी ने खाते के लिए आवश्यक सभी दस्तावेज़ (आधार कार्ड, पैन कार्ड, फोटो) आवेदन के साथ संलग्न कर दिए हैं।',
      date: new Date().toISOString().split('T')[0],
      place: 'ताम्बौर'
    },
    renderDocument: ({ data }) => (
      <div className="w-full leading-relaxed text-[14px]">
        <div className="mb-6">
          <p>सेवा में,</p>
          <p className="font-bold mt-2">{data.toOfficer}</p>
          <p>{data.officeName}</p>
          <p>{data.officeAddress}</p>
        </div>

        <div className="mb-6">
          <p className="font-bold underline text-center text-[16px]">विषय: {data.subject}</p>
        </div>

        <div className="mb-6">
          <p>महोदय,</p>
          <p className="mt-2 text-justify whitespace-pre-wrap leading-loose">{data.details}</p>
        </div>

        <div className="mb-8">
          <p className="font-bold">मेरा विवरण निम्न प्रकार है:</p>
          <table className="w-full mt-2 border-collapse">
            <tbody>
              <tr><td className="py-1 w-[40%]">1. नाम</td><td className="py-1">: {data.name ? <span className="font-bold">{data.name}</span> : '..........................'}</td></tr>
              <tr><td className="py-1">2. पिता/पति का नाम</td><td className="py-1">: {data.fatherName ? <span className="font-bold">{data.fatherName}</span> : '..........................'}</td></tr>
              <tr><td className="py-1">3. पता</td><td className="py-1">: {data.address ? <span className="font-bold">{data.address}</span> : '..........................'}</td></tr>
              <tr><td className="py-1">4. आधार नंबर</td><td className="py-1">: {data.aadhaar ? <span className="font-bold">{data.aadhaar}</span> : '..........................'}</td></tr>
              <tr><td className="py-1">5. पैन नंबर</td><td className="py-1">: {data.panCard ? <span className="font-bold">{data.panCard}</span> : '..........................'}</td></tr>
              <tr><td className="py-1">6. मोबाइल नंबर</td><td className="py-1">: {data.mobile ? <span className="font-bold">{data.mobile}</span> : '..........................'}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <p className="text-justify leading-loose">
            अतः आपसे विनम्र निवेदन है कि कृपया मेरे नाम से एक नया बचत खाता खोलने की कृपा करें।
          </p>
        </div>

        <div className="flex justify-between items-end mt-16">
          <div><p>दिनांक: {data.date}</p><p>स्थान: {data.place}</p></div>
          <div className="text-center"><p className="mb-8">भवदीय / प्रार्थी</p><p className="border-t border-black border-dashed pt-1 inline-block min-w-[150px]">(हस्ताक्षर)</p><p className="font-bold">{data.name}</p></div>
        </div>
      </div>
    )
  },
  app_police_thana: {
    id: 'app_police_thana',
    fields: baseFields,
    defaultValues: {
      toOfficer: 'श्रीमान थाना प्रभारी महोदय',
      officeName: 'थाना - _________',
      officeAddress: 'जिला - _________',
      subject: '________ के संबंध में शिकायत दर्ज कराने हेतु प्रार्थना पत्र।',
      details: 'सविनय निवेदन है कि प्रार्थी _________ (अपना नाम) पुत्र/पत्नी श्री ________ (पिता/पति का नाम) ग्राम _________ का निवासी है।\n\nप्रार्थी के साथ दिनांक __/__/____ को ________ (घटना का समय) बजे _________ (घटना का स्थान) पर यह घटना घटी है कि (पूरी घटना का विवरण विस्तार से लिखें)...\n\nइस घटना के कारण प्रार्थी को भारी नुकसान/परेशानी का सामना करना पड़ रहा है।',
      date: new Date().toISOString().split('T')[0],
      place: ''
    },
    renderDocument: BaseLetterRender,
  }
};

export const getTemplate = (id: string): AppTemplate => {
  return TEMPLATES[id] || {
    id,
    fields: baseFields,
    defaultValues: {
      subject: 'प्रार्थना पत्र',
      details: 'सविनय निवेदन है कि...',
      date: new Date().toISOString().split('T')[0],
      place: ''
    },
    renderDocument: BaseLetterRender
  };
};

// Additional configs...
TEMPLATES['app_ration_new'] = {
  id: 'app_ration_new',
  fields: [
    { name: 'toOfficer', label: 'अधिकारी का पद', type: 'text', gridCols: 2 },
    { name: 'officeName', label: 'कार्यालय का नाम', type: 'text', gridCols: 1 },
    { name: 'officeAddress', label: 'कार्यालय का पता', type: 'text', gridCols: 1 },
    { name: 'subject', label: 'विषय', type: 'text', gridCols: 2 },
    { name: 'details', label: 'विवरण', type: 'textarea', gridCols: 2 },
    { name: 'name', label: 'मुखिया (महिला) का नाम', type: 'text', gridCols: 1 },
    { name: 'fatherName', label: 'पति/पिता का नाम', type: 'text', gridCols: 1 },
    { name: 'aadhaar', label: 'आधार नंबर', type: 'text', gridCols: 1 },
    { name: 'mobile', label: 'मोबाइल नंबर', type: 'text', gridCols: 1 },
    { name: 'familyMembers', label: 'परिवार के कुल सदस्य संख्या', type: 'number', gridCols: 1 },
    { name: 'address', label: 'पूरा पता (ग्राम, पोस्ट, ब्लॉक, तहसील, जिला)', type: 'textarea', gridCols: 2 },
    { name: 'place', label: 'स्थान', type: 'text', gridCols: 1 },
    { name: 'date', label: 'दिनांक', type: 'date', gridCols: 1 },
  ],
  defaultValues: {
    toOfficer: 'श्रीमान आपूर्ति निरीक्षक महोदय',
    officeName: 'खाद्य एवं रसद विभाग',
    officeAddress: 'तहसील - _________',
    subject: 'नया राशन कार्ड बनवाने हेतु प्रार्थना पत्र।',
    details: 'सविनय निवेदन है कि प्रार्थी एक अत्यंत गरीब परिवार से संबंधित है। प्रार्थी के परिवार में कुल _______ सदस्य हैं। प्रार्थी के पास आय का कोई सुनिश्चित साधन नहीं है, जिसके कारण परिवार का भरण-पोषण करने में अत्यधिक कठिनाई हो रही है। प्रार्थी के नाम पर अभी तक कोई राशन कार्ड जारी नहीं हुआ है।',
    date: new Date().toISOString().split('T')[0],
    place: ''
  },
  renderDocument: ({ data }) => (
    <div className="w-full leading-relaxed text-[14px]">
      <div className="mb-6">
        <p>सेवा में,</p>
        <p className="font-bold mt-2">{data.toOfficer}</p>
        <p>{data.officeName}</p>
        <p>{data.officeAddress}</p>
      </div>
      <div className="mb-6">
        <p className="font-bold underline text-center text-[16px]">विषय: {data.subject}</p>
      </div>
      <div className="mb-6">
        <p>महोदय,</p>
        <p className="mt-2 text-justify whitespace-pre-wrap leading-loose">
          {data.details.replace('_______', data.familyMembers || '_______')}
        </p>
      </div>
      <div className="mb-8">
        <p className="font-bold">प्रार्थी का विवरण निम्न प्रकार है:</p>
        <table className="w-full mt-2 border-collapse">
          <tbody>
            <tr><td className="py-1 w-[40%]">1. मुखिया का नाम</td><td className="py-1">: {data.name ? <span className="font-bold">{data.name}</span> : '..........................'}</td></tr>
            <tr><td className="py-1">2. पति/पिता का नाम</td><td className="py-1">: {data.fatherName ? <span className="font-bold">{data.fatherName}</span> : '..........................'}</td></tr>
            <tr><td className="py-1">3. सदस्यों की कुल संख्या</td><td className="py-1">: {data.familyMembers ? <span className="font-bold">{data.familyMembers}</span> : '..........................'}</td></tr>
            <tr><td className="py-1">4. आधार नंबर</td><td className="py-1">: {data.aadhaar ? <span className="font-bold">{data.aadhaar}</span> : '..........................'}</td></tr>
            <tr><td className="py-1">5. मोबाइल नंबर</td><td className="py-1">: {data.mobile ? <span className="font-bold">{data.mobile}</span> : '..........................'}</td></tr>
            <tr><td className="py-1">6. पूरा पता</td><td className="py-1">: {data.address ? <span className="font-bold">{data.address}</span> : '..........................'}</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mb-6">
        <p className="text-justify leading-loose">
          अतः श्रीमान जी से विनम्र निवेदन है कि प्रार्थी की आर्थिक स्थिति को ध्यान में रखते हुए नया राशन कार्ड जारी करने की कृपा करें।
        </p>
      </div>
      <div className="flex justify-between items-end mt-16">
        <div><p>दिनांक: {data.date}</p><p>स्थान: {data.place}</p></div>
        <div className="text-center"><p className="mb-8">भवदीय / प्रार्थी</p><p className="border-t border-black border-dashed pt-1 inline-block min-w-[150px]">(हस्ताक्षर/अंगूठा)</p><p className="font-bold">{data.name}</p></div>
      </div>
    </div>
  )
};
