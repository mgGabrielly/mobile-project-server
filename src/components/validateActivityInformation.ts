import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//// Funcção para verificar com relação as regras de negócio
async function validateActivityInformation(id: any, name: string, activityGroup: string, activityType: string, workload: number, activityPeriod: string, placeOfCourse: string): Promise<boolean> {
    // o id é o do estudante
    const activityExist = await prisma.activity.findMany({
        where: {
            name
        },
    });

    return activityExist.length > 0;
}

export default validateActivityInformation;