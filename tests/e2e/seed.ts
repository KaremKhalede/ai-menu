import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenantId = 'e2e-tenant';
  
  // Create Restaurant (Tenant)
  await prisma.restaurant.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      name: 'E2E Test Restaurant',
      theme: 'light',
      currency: 'USD',
    },
  });

  // Create Category
  await prisma.category.upsert({
    where: { id: 'cat-1' },
    update: {},
    create: {
      id: 'cat-1',
      restaurantId: tenantId,
      name: 'E2E Category',
    },
  });

  // Create Customer
  await prisma.customer.upsert({
    where: { id: 'e2e-cust' },
    update: {},
    create: {
      id: 'e2e-cust',
      restaurantId: tenantId,
      fullName: 'E2E User',
      phone: '1234567890',
    },
  });

  // Create Dishes
  await prisma.dish.upsert({
    where: { id: 'dish-burger' },
    update: {},
    create: {
      id: 'dish-burger',
      name: 'E2E Burger',
      description: 'Test Burger',
      price: 15.99,
      isAvailable: true,
      categoryId: 'cat-1',
    },
  });

  await prisma.dish.upsert({
    where: { id: 'dish-out-of-stock' },
    update: {},
    create: {
      id: 'dish-out-of-stock',
      name: 'E2E Out of Stock Item',
      description: 'Test item out of stock',
      price: 5.99,
      isAvailable: false,
      categoryId: 'cat-1',
    },
  });

  console.log('E2E DB Seeded');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
