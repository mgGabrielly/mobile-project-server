import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//// Função para verificar com relação a carga horária total permitida no curso
async function checkTotalWorkload(id: any, workload: number ): Promise<{ success: boolean; message: string; status: number }> {
    // o id é o do estudante
    try { 
        // Extraindo as informações do usuário
        const studentExist = await prisma.user.findUnique({
            where: { 
                id: Number(id),
            },
        });
        if(!studentExist || studentExist.status === "desativado") {
            return { success: false, message: 'Estudante não encontrado.', status: 400 };
        }

        // Extraindo todas atividades do usuário
        const activitiesStudent = await prisma.activity.findMany({
            where: { 
                idStudent: studentExist.id,
            },
        });
        if(activitiesStudent.length <= 0) {
            return { success: true, message: 'Atividade pode ser cadastrada.', status: 200 };
        }

        // Somando todas as horas das atividades já cadastradas para comparar com a carga total permitida no curso
        let totalWorkloadActivities = 0;
        for(const activityStudent of activitiesStudent) {
            if(activityStudent.evaluation == "Deferida"){
                totalWorkloadActivities += Number(activityStudent.workload);
            }
        }
        
        let adjustedWorkload = workload;
        if(Number(totalWorkloadActivities) < 120) {
            if (Number(totalWorkloadActivities) + workload > 120) {
                adjustedWorkload = (120 - Number(totalWorkloadActivities));
                return { 
                    //Carga total durante o curso não foi atingida. Atividade pode ser cadastrada. 
                    success: true, 
                    message: `${adjustedWorkload}.`, 
                    status: 200 
                };
            } else {
                return { 
                    //Carga total durante o curso não foi atingida. Atividade pode ser cadastrada.
                    success: true, 
                    message: `${adjustedWorkload}.`, 
                    status: 200 
                };
            }
        } else {
            return { success: false, message: 'Carga horária do curso já foi atingida.', status: 406 };
        }
        
    } catch (error) {
        return { success: false, message: 'Erro ao validar informações de atividade.', status: 500 };
    }
}

export default checkTotalWorkload;