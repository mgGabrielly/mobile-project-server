import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkActivityExistence(name: string, activityType: string, workload: number, activityPeriod: string, placeOfCourse: string): Promise<boolean> {
    const activityExist = await prisma.activity.findMany({
        where: {
            name,
            activityType,
            workload,
            activityPeriod,
            placeOfCourse,
        },
    });

    return activityExist.length > 0;
}

export default checkActivityExistence;