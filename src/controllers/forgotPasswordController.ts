import { PrismaClient } from "@prisma/client";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

class ForgotPasswordController {
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).send({ error: 'Invalid email!' });
      } else {
        // Saving the token in the bank for comparison
        const token = crypto.randomBytes(10).toString('hex');

        await prisma.user.update({
          where: { email },
          data: {
            passwordResetToken: token,
            passwordResetAt: new Date(Date.now() + 15 * 60000),
          },
        });
        // Sending an email for password reset
        try {
          let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'mps.redefine@gmail.com',
              pass: 'fhjmqqgwwpzegpoi',
            },
          });

          let message = await transport.sendMail({
            from: '"MPS - Support" <mps.redefine@gmail.com>',
            to: user.email,
            subject: 'Reset Password - MPS System',
            text: 'Click the button to reset your password',
            html: `<h1>Password Recovery</h1> <p>Dear ${user.name}! </br> This email is sent automatically, please do not reply.</p> <p>Forgot your password? Use this<b> 👉 Token: ${token} 👈 <b> </p> <h2>Tips</h2> <p> - The token has a fifteen (15) minutes deadline to be used. If exceeded, a new request will be necessary 🕑</p> <p> - To change your password, enter the received token in the code field in the form 📜</p><p> - Your password is personal and cannot be shared 🤫</p></b> <b><h4>Kind regards</h4> <h4>Support Team 💻</h4><b>`,
          });
          res.status(200).json({
            message: 'Email sent successfully!',
          });
        } catch (error) {
          res.status(500).json({
            message: 'Error sending email!',
            error: error,
          });
        }
      }
    } catch (error) {
      res.status(405).json({
        message: 'Error, please try again!',
        error: error,
      });
    }
  }
}

export default new ForgotPasswordController();
