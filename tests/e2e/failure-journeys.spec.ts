import { test, expect } from '@playwright/test';

test.describe('Failure Journeys', () => {
  const tenantId = 'e2e-tenant';
  const customerId = 'e2e-cust';

  test('Graceful Degradation on Out-of-Stock Item', async ({ request }) => {
    const initRes = await request.post('/api/ai/session', { headers: { 'x-tenant-id': tenantId }, data: { tenantId, customerId } });
    const sessionId = (await initRes.json()).session.id;

    const addRes = await request.post('/api/ai/tools/execute', {
      headers: { 'x-tenant-id': tenantId, 'x-session-id': sessionId, 'x-customer-id': customerId },
      data: { sessionId, actionName: 'add_to_cart', args: { dishId: 'dish-out-of-stock', quantity: 1 } }
    });
    
    // Server remains healthy (200), but returns a business logic error for the AI to handle
    expect(addRes.ok()).toBeTruthy();
    const data = await addRes.json();
    
    expect(data.result.error).toContain('is currently out of stock');
    
    // Verify no side effects occurred (Cart should be empty)
    const cartRes = await request.post('/api/ai/tools/execute', {
      headers: { 'x-tenant-id': tenantId, 'x-session-id': sessionId, 'x-customer-id': customerId },
      data: { sessionId, actionName: 'view_cart', args: {} }
    });
    const cartData = await cartRes.json();
    expect(cartData.result.items).toHaveLength(0);
  });

  test('Invalid Tool Request', async ({ request }) => {
    const initRes = await request.post('/api/ai/session', { headers: { 'x-tenant-id': tenantId }, data: { tenantId, customerId } });
    const sessionId = (await initRes.json()).session.id;

    const badToolRes = await request.post('/api/ai/tools/execute', {
      headers: { 'x-tenant-id': tenantId, 'x-session-id': sessionId, 'x-customer-id': customerId },
      data: { sessionId, actionName: 'non_existent_tool', args: {} }
    });
    
    expect(badToolRes.ok()).toBeTruthy(); // HTTP transport is fine
    const data = await badToolRes.json();
    expect(data.result.error).toContain('UNKNOWN_TOOL');
  });

});
