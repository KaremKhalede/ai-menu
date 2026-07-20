import { test, expect } from '@playwright/test';

test.describe('Security Journeys', () => {
  const tenantId = 'e2e-tenant';
  const customerId = 'e2e-cust';

  test('Cross-Tenant Manipulation Attack', async ({ request }) => {
    const initRes = await request.post('/api/ai/session', { headers: { 'x-tenant-id': tenantId }, data: { tenantId, customerId } });
    const sessionId = (await initRes.json()).session.id;

    // Try to add to cart but spoofing a different restaurant ID in the payload arguments
    const addRes = await request.post('/api/ai/tools/execute', {
      headers: { 'x-tenant-id': tenantId, 'x-session-id': sessionId, 'x-customer-id': customerId },
      data: { sessionId, actionName: 'add_to_cart', args: { dishId: 'dish-burger', quantity: 1, restaurantId: 'hacked-tenant' } }
    });
    
    expect(addRes.ok()).toBeTruthy();
    const data = await addRes.json();
    
    // Safety & Policy Engine should block it
    expect(data.result.error).toContain('Cross-tenant manipulation');
  });

  test('Unauthorized Checkout Attempt', async ({ request }) => {
    // Session without customer ID (Guest)
    const initRes = await request.post('/api/ai/session', { headers: { 'x-tenant-id': tenantId }, data: { tenantId } });
    const sessionId = (await initRes.json()).session.id;

    const checkoutRes = await request.post('/api/ai/tools/execute', {
      headers: { 'x-tenant-id': tenantId, 'x-session-id': sessionId }, // Missing customer-id
      data: { sessionId, actionName: 'checkout', args: {} }
    });
    
    expect(checkoutRes.ok()).toBeTruthy();
    const data = await checkoutRes.json();
    
    // Safety & Policy Engine should block it
    expect(data.result.error).toContain('Unauthorized checkout');
  });

  test('Malformed Payload Schema Rejection', async ({ request }) => {
    const initRes = await request.post('/api/ai/session', { headers: { 'x-tenant-id': tenantId }, data: { tenantId, customerId } });
    const sessionId = (await initRes.json()).session.id;

    // Send a totally malformed quantity
    const addRes = await request.post('/api/ai/tools/execute', {
      headers: { 'x-tenant-id': tenantId, 'x-session-id': sessionId, 'x-customer-id': customerId },
      data: { sessionId, actionName: 'add_to_cart', args: { dishId: 'dish-burger', quantity: -999 } }
    });
    
    expect(addRes.ok()).toBeTruthy();
    const data = await addRes.json();
    console.log("MALFORMED PAYLOAD RES:", data);
    
    // Safety & Policy Engine should block it due to business logic (or schema)
    expect(data.result?.error || data.error).toContain('Invalid quantity');
  });
});
