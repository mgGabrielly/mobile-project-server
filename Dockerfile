# Use a imagem oficial do Node.js como base
FROM node:18

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/appBackend

# Copie os arquivos necessários para o contêiner (package.json e package-lock.json)
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Instale as dependências do projeto
RUN npm install

# Instale a CLI dotenv globalmente
RUN npm install -g dotenv-cli

# Copie todos os arquivos do diretório atual para o diretório de trabalho do contêiner
COPY . .

# Execute as migrações do Prisma e gere os artefatos necessários
RUN npx prisma migrate dev && npx prisma generate

# Exponha a porta que a aplicação estará ouvindo
EXPOSE 8080

# Comando para executar a aplicação quando o contêiner for iniciado
CMD ["npm", "run", "dev"]
