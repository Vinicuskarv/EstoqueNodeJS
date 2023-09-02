const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@projetoestoque.b65m7hj.mongodb.net/ProjetoEstoque?retryWrites=true&w=majority`
        );
        console.log('Conexão com o banco de dados realizada com sucesso');
    } catch (error) {
        console.error('Erro na conexão com o banco de dados:', error);
    }
}

module.exports = connectToDatabase;
