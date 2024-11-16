import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const geoData = await prisma.geoData.findMany({
      include: {
        demographics: true,
        connectivity: true
      },
    });
    return Response.json(geoData);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch geographical data' }, 
      { status: 500 }
    );
  }
}