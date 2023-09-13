const mongoose = require('mongoose');

const estoqueSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    preco: {
        type: Number,
        required: true,
    },
    quantidade: {
        type: Number,
        required: true,
    },
    localizacao: {
        type: String,
        required: true,
    },
});

const EstoqueModel = mongoose.model("Estoque", estoqueSchema);

module.exports = EstoqueModel;
