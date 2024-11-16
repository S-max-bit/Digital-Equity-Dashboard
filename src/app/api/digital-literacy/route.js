import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {  // Make sure to include the request parameter
  try {
    const literacyPrograms = await prisma.digitalLiteracyProgram.findMany({
      orderBy: {
        startDate: 'asc',
      },
    });
    return new Response(JSON.stringify(literacyPrograms), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch literacy programs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}