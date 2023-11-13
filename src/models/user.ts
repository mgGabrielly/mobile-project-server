// import { PrismaClient, User } from '@prisma/client';

// interface UserData {
//   name: string,
//   email: string,
//   password : string,
//   userType: string,
//   status: string,
//   matriculation: string,         
//   telephone: string
// }

// const prisma = new PrismaClient();

// class UserModel {
//   async createUser(data: UserData ): Promise<User> {
//     return prisma.user.create({ data });
//   }

//   async getAllUsers(): Promise<User[]> {
//     return prisma.user.findMany();
//   }

//   async getUserById(id: number): Promise<User | null> {
//     return prisma.user.findUnique({ where: { id } });
//   }

//   async updateUser(id: number, data: { /* Defina os tipos para os dados necessários */ }): Promise<User> {
//     return prisma.user.update({ where: { id }, data });
//   }

//   async deleteUser(id: number): Promise<User> {
//     return prisma.user.delete({ where: { id } });
//   }
// }

// export default new UserModel();
