import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import readDataStudents from '../components/readDataStudents';
import extractClass from "../components/extractClass";
import extractUserType from "../components/extractUserType";
import generatePassword from "../components/generatePassword";

const prisma = new PrismaClient();

class AddStudentsController {
  async addDatasStudents(req: Request, res: Response, next: NextFunction) {
    const file = req.file;

    if (
      !file ||
      !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/octet-stream'].includes(file.mimetype)
    ) {
      return res.status(401).json({
        message: 'No file uploaded',
      });
      
    } else {
      try {
        const allStudents = readDataStudents(file.path);
      
        for (const allStudent of allStudents) {
          const studentExists = await prisma.user.findUnique({
            where: {
              email: allStudent.email,
            },
          });
      
          if (!studentExists) {
            const turma = extractClass(allStudent.matriculation);
            const type = extractUserType(allStudent.email);
            const hashpassword = generatePassword();
            
            await prisma.user.create({
              data: {
                name: allStudent.name || '',
                matriculation: String(allStudent.matriculation) || '',
                email: allStudent.email || '',
                telephone: "81989890707",
                status: 'ativo',
                password: String(hashpassword),
                class: turma,
                userType: type,
              },
            });
          } else {
            continue;
          }
        }
      
        return res.status(200).json({
          message: 'Usuários cadastrados com sucesso',
        });
      } catch (error) {
        console.error('Ocorreu um erro ao processar os usuários', error);
        return res.status(500).json({
          message: 'Ocorreu um erro ao processar os usuários',
          error: error,
        });
      }
      
    }
  }
}

export default new AddStudentsController();
