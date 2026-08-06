fetch('http://localhost:3000/api/auth/sign-up/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test1@mbglebak.id', password: 'password123', name: 'Test 1', username: 'test1', role: 'operator_sppg', sppgId: 1 })
}).then(r => r.json()).then(console.log).catch(console.error);
