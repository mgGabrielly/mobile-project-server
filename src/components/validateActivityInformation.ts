import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//// Função para verificar com relação as regras de negócio
async function validateActivityInformation(id: any, activityGroup: string, activityType: string, workload: number, activityPeriod: string ): Promise<{ success: boolean; message: string; status: number }> {
    // o id é o do estudante
    try {    
        // Extraindo as informações do tipo de atividade de acordo com o activityType da atividade a ser cadastrada
        const activityTypeExist = await prisma.typeOfActivity.findUnique({
            where: { 
                description: activityType,
                activityGroup: activityGroup,
            },
        });
        if(!activityTypeExist || activityTypeExist.status === "desativado") {
            return { success: false, message: 'Tipo de atividade inválido.', status: 400 };
        }

        // Extraindo as informações do usuário
        const studentExist = await prisma.user.findUnique({
            where: { 
                id: Number(id),
            },
        });
        if(!studentExist || studentExist.status === "desativado") {
            return { success: false, message: 'Estudante não encontrado.', status: 400 };
        }

        // Extraindo todas atividades do usuário que tem o mesmo tipo de atividade a ser cadastrada
        const activitiesStudent = await prisma.activity.findMany({
            where: { 
                idStudent: studentExist.id,
                activityType: activityType,
            },
        });
        if(activitiesStudent.length <= 0) {
            return { success: true, message: 'Atividade pode ser cadastrada.', status: 200 };
        }

        // Somando todas as horas das atividades já cadastradas com a que se quer cadastrar pelo tipo de atividade para comparar com a carga total do curso
        // E Somando todas as horas das atividades já cadastras com a que se ser cadastrar pelo tipo de atividade e pelo o semestre para comparar com a carga semestral permitida
        let totalWorkloadOfActivities = 0;
        let totalWorkloadOfActivitiesForTheSemester = 0;
        for(const activityStudent of activitiesStudent) {
            totalWorkloadOfActivities += activityStudent.workload;

            if(activityStudent.activityPeriod == activityPeriod){
                totalWorkloadOfActivitiesForTheSemester += activityStudent.workload;
            }
        }
        
        // Para verificação
        // activityTypeExist.courseWorkload;  Carga horária permitida durante todo o curso
        // activityTypeExist.semesterWorkload;  Carga horária permitida por semestre
        if(totalWorkloadOfActivitiesForTheSemester < activityTypeExist.semesterWorkload) {
            if(totalWorkloadOfActivities < activityTypeExist.courseWorkload){
                return { 
                    success: true, 
                    message: 'Informações da atividade válidas para cadastro. E carga total durante o curso não foi atingida para o tipo de atividade.', 
                    status: 200 
                }; 
            } else {
                return { 
                    success: true, 
                    message: 'Informações da atividade válidas para cadastro. E carga total durante o curso já foi atingida para o tipo de atividade.', 
                    status: 200 
                };
            }
        } else {
            return { success: false, message: 'Informações da atividade válidas. Mas carga horária semestral já foi atingida.', status: 402 };
        }
        
    } catch (error) {
        return { success: false, message: 'Erro ao validar informações de atividade.', status: 500 };
    }
}

export default validateActivityInformation;