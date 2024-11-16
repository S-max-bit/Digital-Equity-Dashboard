import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const feedback = await prisma.communityFeedback.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return Response.json(feedback);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch community feedback' }, 
      { status: 500 }
    );
  }
}