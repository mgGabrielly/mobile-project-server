import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

class UserModel {
  async createUser(data: Omit<User, 'id'>): Promise<User> {
    return prisma.user.create({ data });
  }

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: number): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}

export default new UserModel();
