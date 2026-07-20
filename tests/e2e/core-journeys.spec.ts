import { test, expect } from '@playwright/test';

test.describe('Core Customer Journeys', () => {
  const tenantId = 'e2e-tenant';
  const customerId = 'e2e-cust';

  test('Complete Ordering Flow: Recommend -> Add to Cart -> Checkout', async ({ request }) => {
    // 1. Initialize Session
    const initRes = await request.post('/api/ai/session', {
      headers: { 'x-tenant-id': tenantId },
      data: { tenantId, customerId }
    });
    if (!initRes.ok()) console.log(await initRes.text());
    expect(initRes.ok()).toBeTruthy();
    const initData = await initRes.json();
    expect(initData.session).toBeDefined();
    expect(initData.session.id).toBeDefined();
    
    const sessionId = initData.session.id;

    // 2. Execute Tool: Add to Cart
    const addRes = await request.post('/api/ai/tools/execute', {
      headers: {
        'x-tenant-id': tenantId,
        'x-session-id': sessionId,
        'x-customer-id': customerId,
      },
      data: {
        sessionId,
        actionName: 'add_to_cart',
        args: { dishId: 'dish-burger', quantity: 2 }
      }
    });
    if (!addRes.ok()) console.log("ADD RES ERROR:", await addRes.text());
    expect(addRes.ok()).toBeTruthy();
    const cartData = await addRes.json();
    
    // State Verification: Cart Contents
    expect(cartData.result.items).toHaveLength(1);
    expect(cartData.result.items[0].dishId).toBe('dish-burger');
    expect(cartData.result.items[0].quantity).toBe(2);
    expect(cartData.result.total).toBe(15.99 * 2);

    // 3. Execute Tool: Checkout
    const checkoutRes = await request.post('/api/ai/tools/execute', {
      headers: {
        'x-tenant-id': tenantId,
        'x-session-id': sessionId,
        'x-customer-id': customerId,
      },
      data: {
        sessionId,
        actionName: 'checkout',
        args: {}
      }
    });
    expect(checkoutRes.ok()).toBeTruthy();
    const checkoutData = await checkoutRes.json();
    expect(checkoutData.result.status).toBe('CHECKOUT_INITIATED');

    // 4. Terminate Session
    const endRes = await request.post('/api/ai/session/end', {
      data: {
        sessionId,
        transcript: [{ role: 'user', content: 'hello' }],
        finalIntent: 'DECIDED',
        escalatedToHuman: false,
      }
    });
    expect(endRes.ok()).toBeTruthy();
    
    // State Verification: Duplicate Session Termination (Idempotency)
    const endRes2 = await request.post('/api/ai/session/end', {
      data: { sessionId }
    });
    expect(endRes2.ok()).toBeTruthy();
    const endData2 = await endRes2.json();
    expect(endData2.status).toBe('ALREADY_PROCESSED');
  });
});
