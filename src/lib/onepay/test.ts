import { signRequest } from './signing';
import fetch from 'node-fetch';

const baseUrl = 'https://mtf.onepay.vn/paycollect/api/v1';
const clientId = 'TESTPC2';
const partnerId = 'TESTPC2';
const accessKeyId = 'TESTPC2';
const secretKey = 'PC7525892B2E41A8845E210BF0114BA2';

async function testBatch() {
  const method = 'POST';
  const url = `${baseUrl}/batchs`;
  
  const payload = [
    {
      name: "user",
      do_on: "always",
      method: "PUT",
      href: `/partners/${partnerId}/users/test-user-3`,
      body: {
        name: "Test User",
        gender: "MALE",
        address: "194 Tran Quang Khai, Hoan Kiem, Ha Noi",
        mobile_number: "090622148",
        email: "anv@onepay.vn",
        id_card: "0129120102",
        issue_date: "10/05/2010",
        issue_by: "CA.TP Ha Noi",
        description: "",
      }
    },
    {
      name: "invoice",
      do_on: "$user.response.status == 201",
      method: "PUT",
      href: `/partners/${partnerId}/users/test-user-3/invoices/test-inv-3`,
      body: {
        amount: "10000",
        description: "Test invoice"
      }
    }
  ];
  
  const bodyStr = JSON.stringify(payload);
  
  const sigHeaders = signRequest({
    method,
    url,
    body: bodyStr,
    accessKeyId,
    secretKey,
    clientId,
  });
  
  console.log('Headers:', sigHeaders);
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...sigHeaders,
      },
      body: bodyStr,
    });
    
    const text = await response.text();
    console.log(`Status: ${response.status} -> ${text}`);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testBatch();
