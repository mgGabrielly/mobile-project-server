import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const nodeMailer = require('nodemailer');

async function emailEvaluationResult(activityUpdate: { idStudent: any; name: any; activityPeriod: any; workload: any; evaluation: any; }, observation: any) {
    const student = await prisma.user.findUnique({
        where: { id: activityUpdate.idStudent },
    });
    if (!student) {
        return ({ error: "Estudante não encontrado." });
    } else {
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
            to: student.email,
            subject: 'Avaliação - Atividades Complementares',
            text: 'Avaliação da atividade',
            html:
                `<h1>Avaliação da Atividade</h1> <p>Prezado(a) ${student.name}! </br> Esse e-mail é enviado automaticamente, por favor não responda.</p> <P>Sua atividade cadastrada foi avaliada!!!</P> <h2>Informações da atividade:</h2> <p>Atividade: ${activityUpdate.name} </p> <p>Período de realização: ${activityUpdate.activityPeriod} </p> <p>Carga horária: ${activityUpdate.workload} </p> Avaliação: ${activityUpdate.evaluation}</p> <p> - Observações: ${observation ? observation : 'Sem observações'} </p> </br> <p> - Qualquer dúvida, entre em contato com a Coordenação do curso!</p></b> <b><h4>Atenciosamente</h4> <h4>Equipe de suporte 💻</h4><b>`, 
            });
            return ({
                message: 'Email enviado com sucesso!'
            });

        } catch (error) {
            return ({
                message: 'Erro ao enviar email!',
                error: error
            });
        }
    }        
}

export default emailEvaluationResult;