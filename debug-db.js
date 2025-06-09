const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function debugDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Check if we can connect
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');

    // Check existing accounts
    const accounts = await prisma.accounts.findMany({
      select: {
        account_id: true,
        username: true,
        phone_number: true,
        created_at: true
      },
      orderBy: {
        account_id: 'desc'
      },
      take: 5
    });
    
    console.log('📊 Recent accounts:', accounts);
    console.log('📊 Total accounts:', accounts.length);

    // Check the sequence current value
    const sequenceResult = await prisma.$queryRaw`
      SELECT last_value, is_called 
      FROM accounts_account_id_seq
    `;
    console.log('🔢 Sequence info:', sequenceResult);

    // Try to get the max account_id
    const maxId = await prisma.$queryRaw`
      SELECT MAX(account_id) as max_id FROM accounts
    `;
    console.log('🔢 Max account_id:', maxId);

    // Reset sequence if needed
    console.log('🔧 Resetting sequence...');
    await prisma.$queryRaw`
      SELECT setval('accounts_account_id_seq', COALESCE((SELECT MAX(account_id) FROM accounts), 1), true)
    `;
    console.log('✅ Sequence reset complete');

    // Check roles
    const roles = await prisma.roles.findMany();
    console.log('👥 Available roles:', roles);

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugDatabase();
