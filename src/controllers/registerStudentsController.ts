import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import readStudents from '../components/readDataStudents';
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
        const allStudents = readStudents(file.path);
        for (const allStudent of allStudents) {
          try {
            const studentExists = await prisma.user.findUnique({
              where: {
                email: allStudent.email,
              },
            });
            if (studentExists) {
              continue;
            } else {
              // Extraindo a turma pela matricula
              const turma = extractClass(allStudent.matriculation);

              // Extraindo o tipo de usuario pelo email
              const type = extractUserType(allStudent.email);

              // Criar senha aleatoria
              const hashpassword = generatePassword();
              const student = await prisma.user.create({
                data: {
                  name: allStudent.name,
                  email: allStudent.email,
                  telephone: allStudent.telephone,
                  matriculation: allStudent.matriculation,
                  status: "ativo",
                  password: String(hashpassword),
                  class: turma,
                  userType: type,
                },
              });
              continue;
            }
          } catch (studentError) {
            return res.status(500).json({
              message: 'An error occurred while working with orders in the database',
              error: studentError,
            });
          }
        }

        return res.status(200).json({
          message: 'Users Students created successfully',
        });
      } catch (processingError) {
        return res.status(500).json({
          message: 'An error occurred while processing students',
          error: processingError,
        });
      }
    }
  }
}

export default new AddStudentsController();
