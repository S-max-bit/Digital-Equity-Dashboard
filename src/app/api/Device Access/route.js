import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const deviceData = await prisma.deviceAccess.findMany({
      orderBy: {
        region: 'asc',
      },
    });
    return Response.json(deviceData);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch device access data' }, 
      { status: 500 }
    );
  }
}