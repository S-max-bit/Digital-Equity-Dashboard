import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {  // Make sure to include the request parameter
  try {
    const broadbandData = await prisma.broadbandConnectivity.findMany();
    return new Response(JSON.stringify(broadbandData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch broadband data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}