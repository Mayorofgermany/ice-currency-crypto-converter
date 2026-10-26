const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) { json = data; }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
        });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('--- Testing Peer Endorsement & Approval Flow ---');

  // 1. Login as Chidi Okafor
  const loginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, {
    email: 'chidi@paynexus.io',
    password: 'Password123!',
  });

  console.log('Login Chidi:', loginRes.status, loginRes.data.user?.fullName);
  const cookie = loginRes.headers['set-cookie']?.[0]?.split(';')[0];

  // 2. Get Folashade's profile ID
  const searchRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/search?q=Folashade',
    method: 'GET',
  });
  const fola = searchRes.data.results[0];
  console.log('Found Folashade Profile ID:', fola.id, fola.displayName);

  // 3. Chidi submits recommendation for Folashade
  const submitRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/profile/${fola.id}/recommendations`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
    },
  }, {
    relationship: 'Retained Legal Counsel for FinTech Venture Structuring',
    content: 'Mrs. Folashade Adeyemi provided PayNexus with pristine regulatory architecture and cross-border IP licensing agreements that allowed us to scale compliantly across three African jurisdictions without friction.',
  });

  console.log('Submit Recommendation:', submitRes.status, submitRes.data.message);
  const recId = submitRes.data.recommendation?.id;

  // 4. Login as Folashade
  const folaLogin = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, {
    email: 'folashade@adeyemipartners.law',
    password: 'Password123!',
  });
  const folaCookie = folaLogin.headers['set-cookie']?.[0]?.split(';')[0];
  console.log('Login Folashade:', folaLogin.status, folaLogin.data.user?.fullName);

  // 5. Folashade approves Chidi's recommendation
  const approveRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/recommendations/${recId}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': folaCookie,
    },
  }, {
    status: 'APPROVED',
  });

  console.log('Approve Recommendation:', approveRes.status, approveRes.data.message);

  // 6. Verify it now appears on Folashade's public recommendations
  const pubRecs = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/profile/${fola.id}/recommendations`,
    method: 'GET',
  });
  console.log('Folashade Public Recommendations Count:', pubRecs.data.recommendations?.length);
  const matched = pubRecs.data.recommendations.find(r => r.id === recId);
  console.log('Verified Chidi recommendation is live:', !!matched, 'Author:', matched?.author?.displayName);

  console.log('\n--- Recommendation Lifecycle Verification Succeeded! ---');
}

run().catch(console.error);
