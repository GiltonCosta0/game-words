
"use strict";

/* =====================================
   1. CONFIGURAÇÕES DA PARTIDA
===================================== */

const TOTAL_PALAVRAS = 20;
const PONTOS_POR_ACERTO = 10;
const CUSTO_DICA_LETRA = 20;

/* =====================================
   2. BANCO DE PALAVRAS
===================================== */

const categorias = {
    frutas: [
        "BANANA", "ABACAXI", "MORANGO", "LARANJA",
        "MELANCIA", "UVA", "PERA", "MANGA",
        "LIMAO", "PESSEGO", "CEREJA", "MAMAO",
        "KIWI", "AMEIXA", "COCO", "GOIABA",
        "JABUTICABA", "ABACATE", "MARACUJA", "TANGERINA"
    ],

    series: [
        "FRIENDS", "DARK", "LOST", "LUPIN",
        "BREAKINGBAD", "STRANGERTHINGS", "WEDNESDAY",
        "THEOFFICE", "SHERLOCK", "HOUSE",
        "SUPERNATURAL", "DEXTER", "VIKINGS",
        "THEBOYS", "LOKI", "ARROW",
        "SMALLVILLE", "SUITS", "GOTHAM", "CHERNOBYL"
    ],

    filmes: [
        "TITANIC", "AVATAR", "MATRIX", "GLADIADOR",
        "INTERESTELAR", "BATMAN", "DUNA", "JURASSIC",
        "ROCKY", "CORINGA", "INCEPTION", "ALIEN",
        "COCO", "FROZEN", "OPPENHEIMER", "BARBIE",
        "PREDADOR", "RAMBO", "TUBARAO", "CREED"
    ],

    jogos: [
        "MINECRAFT", "ROBLOX", "TETRIS", "FORTNITE",
        "POKEMON", "TERRARIA", "VALORANT",
        "OVERWATCH", "SONIC", "PACMAN",
        "GOD OF WAR", "HALO", "STARDEWVALLEY",
        "FIFA", "SKYRIM", "PORTAL", "CELESTE",
        "DOOM", "HADES", "UNDERTALE"
    ],

    tecnologia: [
        "JAVASCRIPT", "COMPUTADOR", "INTERNET",
        "TECLADO", "PROGRAMA", "ALGORITMO",
        "PYTHON", "SERVIDOR", "NAVEGADOR", "CODIGO",
        "VARIAVEL", "FUNCAO", "MEMORIA", "PROCESSADOR",
        "BANCODEDADOS", "INTERFACE", "BACKEND",
        "FRONTEND", "GITHUB", "TERMINAL"
    ],

    geografia: [
        "BRASIL", "PORTUGAL", "ARGENTINA", "JAPAO",
        "CANADA", "LISBOA", "MADRID", "LONDRES",
        "BERLIM", "AUSTRALIA", "CHILE", "MEXICO",
        "NORUEGA", "EGITO", "PARIS", "ROMA",
        "MANAUS", "GOIANIA", "LUZIÂNIA", "CURITIBA"
    ],

    animais: [
        "CAVALO", "GIRAFA", "ELEFANTE", "TIGRE",
        "CACHORRO", "GATO", "GOLFINHO",
        "BORBOLETA", "LEOPARDO", "TARTARUGA",
        "CROCODILO", "PANTERA", "COELHO", "RAPOSA",
        "PINGUIM", "BALEIA", "HAMSTER", "AGUIA",
        "CAPIVARA", "TAMANDUA"
    ],

    ciencia: [
        "PLANETA", "ATOMO", "ENERGIA", "MOLECULA",
        "GRAVIDADE", "CELULA", "GALAXIA",
        "ELETRON", "NEURONIO", "UNIVERSO",
        "FISICA", "QUIMICA", "BIOLOGIA", "GENETICA",
        "ECLIPSE", "COMETA", "SATELITE", "FOTON",
        "NEBULOSA", "COSMOLOGIA"
    ]
};

/* =====================================
   3. NOMES DAS CATEGORIAS
===================================== */

const nomesCategorias = {
    frutas: "Frutas",
    series: "Séries",
    filmes: "Filmes",
    jogos: "Jogos",
    tecnologia: "Tecnologia e programação",
    geografia: "Países e cidades",
    animais: "Animais",
    ciencia: "Ciência"
};

/* =====================================
   4. ESTADO DA PARTIDA
===================================== */

let palavraCorreta = "";
let pontuacao = 0;
let rodada = 1;
let acertos = 0;
let erros = 0;

let palavrasDaPartida = [];
let dicaUsadaNestaRodada = false;
let rodadaResolvida = false;
let partidaFinalizada = false;

let categoriaAtual = "frutas";

/* =====================================
   5. ELEMENTOS HTML
===================================== */

const palavraElemento = document.getElementById("scrambled-word");
const campoResposta = document.getElementById("answer");
const mensagem = document.getElementById("message");

const botaoDica = document.getElementById("hint-button");
const pontuacaoElemento = document.getElementById("score");
const rodadaElemento = document.getElementById("round");
const categoriaElemento = document.getElementById("category-name");

const formulario = document.getElementById("answer-form");
const botaoVerificar = document.getElementById("check-button");
const botaoProxima = document.getElementById("next-button");

const seletorCategoria = document.getElementById("category-select");
const telaInicial = document.getElementById("start-screen");
const telaJogo = document.getElementById("game-screen");
const botaoComecar = document.getElementById("start-button");
const botaoVoltar = document.getElementById("back-button");

/* =====================================
   6. VALIDAR ELEMENTOS HTML
===================================== */

const elementos = [
    palavraElemento,
    campoResposta,
    mensagem,
    botaoDica,
    pontuacaoElemento,
    rodadaElemento,
    categoriaElemento,
    formulario,
    botaoVerificar,
    botaoProxima,
    seletorCategoria,
    telaInicial,
    telaJogo,
    botaoComecar,
    botaoVoltar
];

if (elementos.some(elemento => elemento === null)) {
    throw new Error(
        "WordRush: confira os IDs dos elementos no index.html."
    );
}

/* =====================================
   7. EMBARALHAR UMA LISTA
===================================== */

function embaralharLista(lista) {
    const resultado = [...lista];

    for (let i = resultado.length - 1; i > 0; i--) {
        const indiceAleatorio = Math.floor(
            Math.random() * (i + 1)
        );

        [
            resultado[i],
            resultado[indiceAleatorio]
        ] = [
            resultado[indiceAleatorio],
            resultado[i]
        ];
    }

    return resultado;
}

/* =====================================
   8. PREPARAR AS PALAVRAS DA PARTIDA
===================================== */

function prepararPalavrasDaPartida(categoria) {
    const palavras = categorias[categoria];

    if (!palavras || palavras.length < TOTAL_PALAVRAS) {
        throw new Error(
            "A categoria precisa ter pelo menos 20 palavras."
        );
    }

    palavrasDaPartida = embaralharLista(palavras)
        .slice(0, TOTAL_PALAVRAS);
}

/* =====================================
   9. EMBARALHAR AS LETRAS
===================================== */

function embaralharPalavra(palavra) {
    const letras = palavra.replace(/\s/g, "").split("");
    let resultado = [...letras];
    let tentativas = 0;

    do {
        resultado = [...letras];

        for (let i = resultado.length - 1; i > 0; i--) {
            const indiceAleatorio = Math.floor(
                Math.random() * (i + 1)
            );

            [
                resultado[i],
                resultado[indiceAleatorio]
            ] = [
                resultado[indiceAleatorio],
                resultado[i]
            ];
        }

        tentativas++;
    } while (
        resultado.join("") === letras.join("") &&
        new Set(letras).size > 1 &&
        tentativas < 20
    );

    return resultado.join("");
}

/* =====================================
   10. NORMALIZAR RESPOSTAS
===================================== */

function normalizarTexto(texto) {
    return texto
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .toUpperCase();
}
function shuffleWord(word) {
    return word
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
}

console.log(shuffleWord("javascript"));
/* =====================================
   11. INICIAR UMA RODADA
===================================== */

function iniciarJogo() {
    if (partidaFinalizada) {
        return;
    }

    palavraCorreta = palavrasDaPartida[rodada - 1];

    if (!palavraCorreta) {
        throw new Error(
            "Não foi encontrada uma palavra para esta rodada."
        );
    }

    const palavraMisturada = embaralharPalavra(palavraCorreta);

    palavraElemento.textContent = palavraMisturada
        .split("")
        .join(" ");

    categoriaElemento.textContent = nomesCategorias[categoriaAtual];
    pontuacaoElemento.textContent = pontuacao;
    rodadaElemento.textContent = `${rodada}/${TOTAL_PALAVRAS}`;

    campoResposta.value = "";
    campoResposta.disabled = false;
    botaoVerificar.disabled = false;
    botaoDica.disabled = false;

    mensagem.textContent = "Boa sorte! Descubra a palavra.";
    mensagem.className = "message";

    botaoProxima.hidden = true;

    rodadaResolvida = false;
    dicaUsadaNestaRodada = false;

    campoResposta.focus();
}

/* =====================================
   12. VERIFICAR A RESPOSTA
===================================== */

function verificarResposta(evento) {
    evento.preventDefault();

    if (rodadaResolvida || partidaFinalizada) {
        return;
    }

    const respostaJogador = normalizarTexto(campoResposta.value);
    const respostaEsperada = normalizarTexto(palavraCorreta);

    if (respostaJogador === "") {
        mensagem.textContent = "Digite uma resposta primeiro!";
        mensagem.className = "message error";
        campoResposta.focus();
        return;
    }

    rodadaResolvida = true;

    if (respostaJogador === respostaEsperada) {
        pontuacao += PONTOS_POR_ACERTO;
        acertos++;

        mensagem.textContent =
            `Correto! Você ganhou ${PONTOS_POR_ACERTO} pontos! 🎉`;

        mensagem.className = "message success";
    } else {
        erros++;

        mensagem.textContent =
            `Não foi dessa vez! A palavra era ${palavraCorreta}.`;

        mensagem.className = "message error";
    }

    pontuacaoElemento.textContent = pontuacao;

    campoResposta.disabled = true;
    botaoVerificar.disabled = true;
    botaoDica.disabled = true;

    botaoProxima.hidden = false;

    botaoProxima.textContent =
        rodada === TOTAL_PALAVRAS
            ? "Ver resultado"
            : "Próxima palavra";
}

/* =====================================
   13. DICA: REVELAR UMA LETRA
===================================== */

function revelarLetra() {
    if (rodadaResolvida || partidaFinalizada) {
        return;
    }

    if (dicaUsadaNestaRodada) {
        mensagem.textContent =
            "Você já usou a dica nesta rodada.";

        mensagem.className = "message error";
        return;
    }

    if (pontuacao < CUSTO_DICA_LETRA) {
        mensagem.textContent =
            `Você precisa de ${CUSTO_DICA_LETRA} pontos para usar esta dica.`;

        mensagem.className = "message error";
        return;
    }

    const respostaAtual = normalizarTexto(campoResposta.value);
    const palavraNormalizada = normalizarTexto(palavraCorreta);

    let indiceLetra = -1;

    for (let i = 0; i < palavraNormalizada.length; i++) {
        if (respostaAtual[i] !== palavraNormalizada[i]) {
            indiceLetra = i;
            break;
        }
    }

    if (indiceLetra === -1) {
        mensagem.textContent = "Não há mais letras para revelar.";
        mensagem.className = "message error";
        return;
    }

    pontuacao -= CUSTO_DICA_LETRA;
    pontuacaoElemento.textContent = pontuacao;

    dicaUsadaNestaRodada = true;
    botaoDica.disabled = true;

    const letra = palavraNormalizada[indiceLetra];

    mensagem.textContent =
        `Dica: a letra da posição ${indiceLetra + 1} é "${letra}".`;

    mensagem.className = "message";
}

/* =====================================
   14. AVANÇAR OU FINALIZAR
===================================== */

function proximaRodada() {
    if (!rodadaResolvida || partidaFinalizada) {
        return;
    }

    if (rodada >= TOTAL_PALAVRAS) {
        finalizarPartida();
        return;
    }

    rodada++;
    iniciarJogo();
}

/* =====================================
   15. RESULTADO FINAL
===================================== */

function finalizarPartida() {
    partidaFinalizada = true;

    palavraElemento.textContent = "🏆";

    mensagem.textContent =
        `Partida concluída! Você acertou ${acertos} de ` +
        `${TOTAL_PALAVRAS} palavras, errou ${erros} e fez ` +
        `${pontuacao} pontos.`;

    mensagem.className = "message success";

    campoResposta.disabled = true;
    botaoVerificar.disabled = true;
    botaoDica.disabled = true;

    botaoProxima.hidden = false;
    botaoProxima.textContent = "Jogar novamente";
}

/* =====================================
   16. REINICIAR A PARTIDA
===================================== */

function reiniciarPartida() {
    pontuacao = 0;
    rodada = 1;
    acertos = 0;
    erros = 0;

    rodadaResolvida = false;
    partidaFinalizada = false;
    dicaUsadaNestaRodada = false;

    categoriaAtual = seletorCategoria.value;

    prepararPalavrasDaPartida(categoriaAtual);
    iniciarJogo();
}

/* =====================================
   17. TROCAR DE CATEGORIA
===================================== */

function trocarCategoria() {
    reiniciarPartida();
}

/* =====================================
   18. EVENTOS
===================================== */

formulario.addEventListener("submit", verificarResposta);

botaoDica.addEventListener("click", revelarLetra);

botaoProxima.addEventListener("click", () => {
    if (partidaFinalizada) {
        reiniciarPartida();
    } else {
        proximaRodada();
    }
});

botaoComecar.addEventListener("click", () => {
    categoriaAtual = seletorCategoria.value;
    reiniciarPartida();
    telaInicial.hidden = true;
    telaJogo.hidden = false;
});
botaoVoltar.addEventListener("click", () => {
    telaJogo.hidden = true;
    telaInicial.hidden = false;
});

// A partida inicia quando o jogador clicar no botao.
