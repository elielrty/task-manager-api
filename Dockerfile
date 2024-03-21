# Use a imagem base do Node.js
FROM node:18.17.1

ENV TZ=America/Sao_Paulo

# Crie um diretório de trabalho no contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências com npm install
RUN npm install --only=production

# Copie o código fonte para o diretório de trabalho
COPY . .

# Exponha a porta que o servidor api está ouvindo (defina a mesma porta que você usa localmente)
EXPOSE 5000

# Inicie o servidor api quando o contêiner for iniciado
CMD [ "node", "server.js" ]
