const fs = require('fs');
let code = fs.readFileSync('src/components/ServicesFAQSection.tsx', 'utf8');

code = code.replace(
  /'Our service charges are highly transparent and minimal. You pay the exact official government portal fee plus a small service charge \(ranging from ₹30 to ₹100 depending on form complexity and scanning requirements\). We accept UPI \(Google Pay, PhonePe, Paytm\), Net Banking, and Cash.',/,
  "'All our guidance and online form filling assistance services are provided absolutely free of cost to help the community.',"
);

fs.writeFileSync('src/components/ServicesFAQSection.tsx', code);
