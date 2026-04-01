import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing connection to Neon PostgreSQL...');
  try {
    const userCount = await prisma.user.count();
    console.log(`Successfully connected! Total users in DB: ${userCount}`);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
