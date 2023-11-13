import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import readStudents from '../components/readDataStudents';

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
                id: allStudent.id,
              },
            });
            if (studentExists) {
              continue;
            } else {
              const student = await prisma.user.create({
                data: {
                  id: allStudent.id,
                  name: allStudent.name,
                  client: allStudent.client,
                  market: allStudent.market,
                  box_type: allStudent.box_type,
                  mold_family: allStudent.mold_family,
                  lid_type: allStudent.lid_type,
                  box_id: allStudent.box_id,
                  box_quantity: allStudent.box_quantity,
                  lid_id: allStudent.lid_id,
                },
              });
            }
          } catch (studentError) {
            return res.status(500).json({
              message: 'An error occurred while working with orders in the database',
              error: studentError,
            });
          }
        }

        return res.status(200).json({
          message: 'Orders created successfully',
        });
      } catch (processingError) {
        return res.status(500).json({
          message: 'An error occurred while processing orders',
          error: processingError,
        });
      }
    }
  }
}

export default AddStudentsController;
