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
      file.mimetype !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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
                email: allStudent.email || '',
                telephone: allStudent.telephone || '',
                matriculation: String(allStudent.matriculation) || '',
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
          message: 'Users Students created successfully',
        });
      } catch (error) {
        console.error('An error occurred while processing students:', error);
        return res.status(500).json({
          message: 'An error occurred while processing students',
          error: error,
        });
      }
      
    }
  }
}

export default new AddStudentsController();
