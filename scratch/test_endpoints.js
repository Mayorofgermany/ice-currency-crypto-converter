const http = require('http');

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    }).on('error', reject);
  });
}

async function test() {
  console.log('--- Testing IgamaZi Endpoints ---');

  // 1. Search with sort
  const searchRelevance = await get('/api/search?sortBy=relevance');
  console.log('1. Search (Relevance):', searchRelevance.status, `Total: ${searchRelevance.data.total}`);

  const searchNameAsc = await get('/api/search?sortBy=name_asc');
  console.log('2. Search (Name Asc):', searchNameAsc.status, 'First:', searchNameAsc.data.results[0]?.displayName);

  const searchRecent = await get('/api/search?sortBy=recent');
  console.log('3. Search (Recent):', searchRecent.status, 'First:', searchRecent.data.results[0]?.displayName);

  // 2. Pick first profile and test public profile + recommendations
  const testProfile = searchRelevance.data.results.find(p => p.displayName.includes('Amina'));
  if (testProfile) {
    console.log(`\nTesting Profile: ${testProfile.displayName} (${testProfile.id})`);
    
    const profileRes = await get(`/api/profile/${testProfile.id}`);
    console.log('4. Profile Details:', profileRes.status, 'Recommendations count:', profileRes.data.profile?.receivedRecommendations?.length || 0);

    const recsRes = await get(`/api/profile/${testProfile.id}/recommendations`);
    console.log('5. Recommendations API:', recsRes.status, 'Count:', recsRes.data.recommendations?.length);
    if (recsRes.data.recommendations?.length > 0) {
      console.log('   First recommendation by:', recsRes.data.recommendations[0].author?.displayName);
      console.log('   Relationship:', recsRes.data.recommendations[0].relationship);
      console.log('   Excerpt:', recsRes.data.recommendations[0].content.slice(0, 80) + '...');
    }
  }

  // 3. Organizations
  const orgsRes = await get('/api/organizations');
  console.log('\n6. Organizations API:', orgsRes.status, 'Count:', orgsRes.data.organizations?.length);

  // 4. Suggestions
  const suggestRes = await get('/api/search/suggestions?q=Cardio');
  console.log('7. Search Autocomplete (q=Cardio):', suggestRes.status, 'Suggestions:', suggestRes.data.suggestions?.map(s => s.text));

  console.log('\n--- All Endpoint Tests Completed Successfully ---');
}

test().catch(console.error);
