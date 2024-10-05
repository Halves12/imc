const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para interpretar o corpo das requisições como JSON
app.use(express.json());


// Servir arquivos estáticos (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, '../public')));


// Array para armazenar os registros de IMC
let registrosIMC = [];

// Função para calcular o IMC
const calcularIMC = (peso, altura) => {
    return (peso / (altura * altura)).toFixed(2);
};


// Função para calcular o peso ideal
const calcularPesoIdeal = (altura) => {
    const IMC_IDEAL = 22; // Valor médio do IMC ideal
    return (IMC_IDEAL * altura * altura).toFixed(2);
};


// Rota GET - Retorna todos os registros de IMC
app.get('/imc', (req, res) => {
    res.json(registrosIMC);
});


// Rota GET - Retorna o peso, altura e peso ideal para um registro por ID
app.get('/imc/:id', (req, res) => {
    const {id} = req.params;
    const registro = registrosIMC.find(registro => registro.id == id);

    if (!registro) {
        return res.status(404).json({ message: 'Registro do IMC não encontrado'});
    }
    const pesoIdeal = calcularPesoIdeal(registro.altura);

    res.json({
        id: registro.id,
        nome: registro.nome,
        peso: registro.peso,
        altura: registro.altura,
        pesoIdeal: pesoIdeal,
        imc: registro.imc
    });
})

// Rota POST - Adiciona um novo registro de IMC
app.post('/imc', (req, res) => {
    const { nome, peso, altura } = req.body;

    // Verificar se os parâmetros estão presentes
    if (!nome || !peso || !altura) {
        return res.status(400).json({ message: 'Nome, peso e altura são obrigatórios!' });
    }

    const imc = calcularIMC(peso, altura);

    const novoRegistro = {
        id: registrosIMC.length + 1, // Gerar ID automático
        nome,
        peso,
        altura,
        imc,
    };

    registrosIMC.push(novoRegistro); // Adicionar o novo registro
    res.status(201).json({ message: 'Registro de IMC criado com sucesso!', registro: novoRegistro });
});

// Rota PUT - Atualiza um registro de IMC por ID
app.put('/imc/:id', (req, res) => {
    const { id } = req.params;
    const { nome, peso, altura } = req.body;

    // Verificar se os parâmetros estão presentes
    if (!nome || !peso || !altura) {
        return res.status(400).json({ message: 'Nome, peso e altura são obrigatórios!' });
    }

    // Encontrar o índice do registro com o ID correspondente
    const index = registrosIMC.findIndex(registro => registro.id == id);

    if (index !== -1) {
        // Calcular o novo IMC com os dados fornecidos
        const imc = calcularIMC(peso, altura);

        // Atualizar o registro com os novos valores
        registrosIMC[index] = {
            id: parseInt(id),
            nome,
            peso,
            altura,
            imc,
        };

        res.json({ message: 'Registro de IMC atualizado com sucesso!', registro: registrosIMC[index] });
    } else {
        res.status(404).json({ message: 'Registro de IMC não encontrado' });
    }
});

// Rota DELETE - Remove um registro de IMC por ID
app.delete('/imc/:id', (req, res) => {
    const { id } = req.params;

    const index = registrosIMC.findIndex(registro => registro.id == id);

    if (index !== -1) {
        const registroDeletado = registrosIMC.splice(index, 1);
        res.json({ message: 'Registro de IMC deletado com sucesso!', registro: registroDeletado });
    } else {
        res.status(404).json({ message: 'Registro de IMC não encontrado' });
    }
});

// Rota raiz
app.get('/', (req, res) => {
    res.send('Bora Codar!');
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
