import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkActivityExistence(id: number, name: string, activityType: string, workload: number, activityPeriod: string, placeOfCourse: string): Promise<boolean> {
    let idStudent = id;
    const activityExist = await prisma.activity.findMany({
        where: {
            name,
            activityType,
            workload,
            activityPeriod,
            placeOfCourse,
            idStudent,
        },
    });

    return activityExist.length > 0;
}

export default checkActivityExistence;