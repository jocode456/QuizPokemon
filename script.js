class Personagem {
    constructor(nome, descricao, imagem) {
        this.nome = nome;
        this.descricao = descricao;
        this.imagem = imagem;
        this.pontos = 0;
    }
}

class Quiz {
    constructor(personagens, perguntas) {
        this.personagens = personagens;
        this.perguntas = perguntas;
        this.indiceAtual = 0;
        this.historicoEscolhas = []; 

        
        this.telas = {
            inicio: document.getElementById('tela-inicial'),
            quiz: document.getElementById('tela-quiz'),
            resultado: document.getElementById('tela-resultado')
        };
        
        this.init();
    }

    init() {
        document.getElementById('btn-iniciar').onclick = () => this.trocarTela('quiz');
        document.getElementById('btn-voltar').onclick = () => this.voltar();
        document.getElementById('btn-reiniciar').onclick = () => this.reiniciar();
        this.atualizarPergunta();
    }

    trocarTela(telaNome) {
        Object.values(this.telas).forEach(t => t.classList.add('hidden'));
        this.telas[telaNome].classList.remove('hidden');
    }

    atualizarPergunta() {
        const pergunta = this.perguntas[this.indiceAtual];
        document.getElementById('pergunta-texto').textContent = pergunta.titulo;
        document.getElementById('progresso').textContent = `Pergunta ${this.indiceAtual + 1} de 10`;
        
        const container = document.getElementById('opcoes-container');
        container.innerHTML = ''; // limpa opções anteriores

        pergunta.opcoes.forEach((opcao, i) => {
            const btn = document.createElement('button');
            btn.className = 'btn-opcao';
            btn.textContent = opcao.texto;
            btn.onclick = () => this.responder(i);
            container.appendChild(btn);
        });

        // mostra e esconde botão voltar 
        document.getElementById('btn-voltar').classList.toggle('hidden', this.indiceAtual === 0);
    }

    responder(indiceOpcao) {
        this.historicoEscolhas.push(indiceOpcao);
        this.indiceAtual++;

        if (this.indiceAtual < this.perguntas.length) {
            this.atualizarPergunta();
        } else {
            this.finalizar();
        }
    }

    voltar() {
        if (this.indiceAtual > 0) {
            this.historicoEscolhas.pop();
            this.indiceAtual--;
            this.atualizarPergunta();
        }
    }

    finalizar() {
        // zera pontos e recalcula com base no histprico de escolhas
        this.personagens.forEach(p => p.pontos = 0);
        
        this.historicoEscolhas.forEach((escolhaIdx, perguntaIdx) => {
            const pesos = this.perguntas[perguntaIdx].opcoes[escolhaIdx].pesos;
            this.personagens[0].pontos += pesos.p1;
            this.personagens[1].pontos += pesos.p2;
            this.personagens[2].pontos += pesos.p3;
        });

        const vencedor = this.personagens.reduce((p, c) => p.pontos > c.pontos ? p : c);
        
        // atualiza tela de resultado 
        document.getElementById('resultado-titulo').textContent = `Você é o ${vencedor.nome}!`;
        document.getElementById('resultado-img').src = vencedor.imagem;
        document.getElementById('resultado-pontuacao').textContent = `Total: ${vencedor.pontos} pontos.`;
        document.getElementById('resultado-desc').textContent = vencedor.descricao;
        
        this.trocarTela('resultado');
    }

    reiniciar() {
        this.indiceAtual = 0;
        this.historicoEscolhas = [];
        this.atualizarPergunta();
        this.trocarTela('inicio');
    }
}


const listaPersonagens = [
    new Personagem("Pikachu", "Energético e leal!", "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png"),
    new Personagem("Squirtle", "Calmo e resiliente!", "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png"),
    new Personagem("Charizard", "Poderoso e focado!", "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png")
];

const listaPerguntas = [
    { titulo: "Qual seu passatempo favorito?", opcoes: [{texto: "Esportes", pesos:{p1:3,p2:1,p3:2}}, {texto: "Natação", pesos:{p1:1,p2:3,p3:1}}, {texto: "Trilhas", pesos:{p1:1,p2:1,p3:3}}] },
    { titulo: "Como resolve problemas?", opcoes: [{texto: "Rápido", pesos:{p1:3,p2:1,p3:2}}, {texto: "Com calma", pesos:{p1:1,p2:3,p3:1}}, {texto: "Com força", pesos:{p1:1,p2:1,p3:3}}] },
    { titulo: "Elemento favorito?", opcoes: [{texto: "Eletricidade", pesos:{p1:3,p2:1,p3:1}}, {texto: "Água", pesos:{p1:1,p2:3,p3:1}}, {texto: "Fogo", pesos:{p1:1,p2:1,p3:3}}] },
    { titulo: "Maior virtude?", opcoes: [{texto: "Amizade", pesos:{p1:3,p2:1,p3:1}}, {texto: "Paciência", pesos:{p1:1,p2:3,p3:1}}, {texto: "Coragem", pesos:{p1:1,p2:1,p3:3}}] },
    { titulo: "Clima ideal?", opcoes: [{texto: "Tempestade", pesos:{p1:3,p2:1,p3:1}}, {texto: "Chuva", pesos:{p1:1,p2:3,p3:1}}, {texto: "Calor", pesos:{p1:1,p2:1,p3:3}}] },
    { titulo: "Lugar para morar?", opcoes: [{texto: "Cidade", pesos:{p1:3,p2:1,p3:1}}, {texto: "Ilha", pesos:{p1:1,p2:3,p3:1}}, {texto: "Vulcão", pesos:{p1:1,p2:1,p3:3}}] },
    { titulo: "Cor favorita?", opcoes: [{texto: "Amarelo", pesos:{p1:3,p2:1,p3:1}}, {texto: "Azul", pesos:{p1:1,p2:3,p3:1}}, {texto: "Laranja", pesos:{p1:1,p2:1,p3:3}}] },
    { titulo: "Em um grupo você é o...", opcoes: [{texto: "Líder", pesos:{p1:2,p2:1,p3:3}}, {texto: "Diplomata", pesos:{p1:1,p2:3,p3:1}}, {texto: "Amigo", pesos:{p1:3,p2:1,p3:1}}] },
    { titulo: "Maior medo?", opcoes: [{texto: "Solidão", pesos:{p1:3,p2:1,p3:1}}, {texto: "Seca", pesos:{p1:1,p2:3,p3:1}}, {texto: "Frio", pesos:{p1:1,p2:1,p3:3}}] },
    { titulo: "Estilo de luta?", opcoes: [{texto: "Velocidade", pesos:{p1:3,p2:1,p3:1}}, {texto: "Defesa", pesos:{p1:1,p2:3,p3:1}}, {texto: "Ataque", pesos:{p1:1,p2:1,p3:3}}] }
];

const quiz = new Quiz(listaPersonagens, listaPerguntas);