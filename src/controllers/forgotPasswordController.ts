import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();
const crypto = require('crypto');
const nodeMailer = require('nodemailer');

export class ForgotPasswordController {
  async forgotPassword (req: Request, res: Response, next: NextFunction) {
      const {email} = req.body
      try {
          const user = await prisma.user.findUnique({ where: {email} })
          if(!user){
            res.status(400).send({ erro: 'Invalid email!'})
          } else {
            // Saving the token in the bank for comparison
            const token = crypto.randomBytes(10).toString('hex')

            await prisma.user.update({
              where: {email},
                data: {
                  passwordResetToken: token,
                  passwordResetAt: new Date(Date.now() + 15 * 60000)
                }
            })
            // Sending email for password reset
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
                to: user.email, 
                subject: 'Redefinir senha - Atividades Complementares',
                text: 'Redefinição de sua senha',
                html:
                  `<h1>Recuperação de Senha</h1> <p>Prezado(a) ${user.name}! </br> Esse e-mail é enviado automaticamente, por favor não responda.</p> <P>Esqueceu a senha? Utilize esse<b> 👉 Token: ${ token } 👈 <b> </P> <h2>Dicas</h2> <p> - O token tem um prazo de quinze (15) minutos para ser ultilizado. Sendo ultrapassado, será necessário fazer uma nova solicitação 🕑</p> <p> - Para alterar a senha insira o token recebido no campo código no formulário 📜</p><p> - Sua senha é pessoal e não pode ser compartilhada 🤫</p></b> <b><h4>Atenciosamente</h4> <h4>Equipe de suporte 💻</h4><b>`,
                      
              });
              res.status(200).json({
                  message: 'Email send to sucess!'
              });

            } catch (error) {
              res.status(500).json({
                message: 'Error to send email!',
                error: error
              });
            }
          }
      } catch (error) {
          res.status(405).json({
              message: 'Erro, try again!',
              error: error
          });
      }

  }
}
export default new ForgotPasswordController();
