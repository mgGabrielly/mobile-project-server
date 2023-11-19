import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const nodeMailer = require('nodemailer');

async function activityCreateNotificationEmail(activity: { id: number; idStudent: number; name: string; activityGroup: string; activityType: string; workload: number; activityPeriod: string; placeOfCourse: string; }) {

    const admins = await prisma.user.findMany({
        where: { 
            userType: "admin", 
            status: "ativo"
        },
    });

    if (!admins) {
        return ({ error: "Administrador não encontrado." });
    } else {

        const student = await prisma.user.findUnique({
            where: { id: Number(activity.idStudent) },
        });
        if (!student) {
            return ({ error: "Estudante não encontrado." });
        }
        
        for (const admin of admins) {
            console.log(admin.name)
            try {
                let transport = nodeMailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASS
                    }
                });
                
                let message = await transport.sendMail({
                from: '"Atividades Complementares - Support" <atividades.comp.suporte@gmail.com>',    
                to: admin.email,
                subject: 'Cadastro de Atividade Complementar',
                text: 'Atividade Cadastrada para Avaliação',
                html:
                    `<h1>Atividade cadastrada para avaliação</h1> <p>Prezado(a) ${admin.name}! </br> Esse e-mail é enviado automaticamente, por favor não responda.</p> <P>Uma atividade foi cadastrada para ser avaliada!!!</P> <h2>Informações da atividade:</h2> <p>Estudante: ${student?.name} </p> <p>Atividade: ${activity.name} </p> <p>Período de realização: ${activity.activityPeriod} </p> <p>Carga horária: ${activity.workload} </p> <p>Grupo da atividade: ${activity.activityGroup} </p> <p>Tipo de atividade: ${activity.activityType} </p> <p>Local de reaização da atividade: ${activity.placeOfCourse}</p>  </br> </b> <b><h4>Atenciosamente</h4> <h4>Equipe de suporte 💻</h4><b>`, 
                });
            } catch (error) {
                return ({
                    message: 'Erro ao enviar email!',
                    error: error
                });
            }
        }
    } 
    return {
        message: 'E-mails enviados com sucesso!'
    };       
}

export default activityCreateNotificationEmail;