let audioIniciado = false;

function iniciarAudio() {
  if (!audioIniciado) {
    musicaFundo.play();
    audioIniciado = true;
  }
}

let musicaFundo = new Audio("sounds/background.mp3");
musicaFundo.loop = true;
musicaFundo.volume = 0.3;

let somFinal = null; // 🔥 controle do som final

const cenas = {

  inicio: {
    imagem: "img/acordando.jpg",
    texto: "Dudu acordou e não viu a Bubu...",
    escolhas: [
      { texto: "Procurar Bubu", proxima: "sala" }
    ]
  },

  sala: {
    imagem: "img/sala.jpg",
    texto: "Dudu vê Bubu de costas... ela percebe e sai correndo!",
    escolhas: [
      { texto: "Seguir Bubu", proxima: "decisao1" }
    ]
  },

  decisao1: {
    imagem: "img/rua.jpg",
    texto: "Para onde a Bubu foi?",
    escolhas: [
      { texto: "Quintal 🌿", proxima: "quintal" },
      { texto: "Rua 🏙️", proxima: "goma" },
      { texto: "Praça 🌳", proxima: "goma" }
    ]
  },

  // 🌿 CAMINHO ROMÂNTICO
  quintal: {
    imagem: "img/duque.jpg",
    texto: "Duque diz que viu Bubu indo pro quarto da Arenosa...",
    escolhas: [
      { texto: "Insistir e ir ver o que ela está fazendo", proxima: "fim_ruim2" },
      { texto: "Fazer café ☕", proxima: "final_romantico" }
    ]
  },

  final_romantico: {
    imagem: "img/sueter.jpg",
    texto: "Enquanto Dudu prepara o café, Bubu aparece com um suéter lindo que ela estava fazendo para ele💖",
    escolhas: [],
    som: "romantico.mp3"
  },

  fim_ruim2:{
    imagem: "img/triste.jpg",
    texto: "Bubu fica triste pois ela não conseguiu terminar o suéter a tempo e o Dudu descobriu antes da hora...",
    escolhas: [],
    som: "ruim2.mp3"
  },

  // 🐱 CAMINHO GOMA
  goma: {
    imagem: "img/goma.jpg",
    texto: "Dudu encontra o Goma, ele o chama pra comer cachorro quente 🌭",
    escolhas: [
      { texto: "Aceitar, mas só depois de encontrar a Bubu", proxima: "ligar" },
      { texto: "Ir comer com Goma.", proxima: "evento" }
    ]
  },

  ligar: {
    imagem: "img/celular.jpg",
    texto: "Dudu liga para a Bubu, ela diz que está no quarto da Arenosa e já já aparece...",
    escolhas: [
      { texto: "Chamar o Duque para ir ao evento", proxima: "duque2" },
      { texto: "Ir sozinho com o Goma", proxima: "evento" }
    ]
  },

  duque2: {
    imagem: "img/duque2.jpg",
    texto: "Dudu convida o Duque para ir comer cachorro quente.",
    escolhas: [
      { texto: "Chamar o Duque", proxima: "final_engracado" },
    ]
  },

  final_engracado: {
    imagem: "img/vergonha.jpg",
    texto: "Bubu aparece com um suéter que ela estava fazendo pra ele e pede para usar... Goma e Duque começam a rir 😂",
    escolhas: [],
    som: "engracado.mp3"
  },

  // 🌭 EVENTO
  evento: {
    imagem: "img/hotdog.jpg",
    texto: "Dudu e Goma comem o cachorro quente juntos...",
    escolhas: [
      { texto: "Levar um pra Bubu", proxima: "final_ruim" },
      { texto: "Não levar nada", proxima: "final_muito_ruim" }
    ]
  },

  final_ruim: {
    imagem: "img/brava.jpg",
    texto: "Bubu está brava... mas aceita o cachorro quente 😬",
    escolhas: [],
    som: "ruim.mp3"
  },

  final_muito_ruim: {
    imagem: "img/correndo.jpg",
    texto: "Ao chegar em casa, Bubu está zangada, viu que o Dudu comeu cachorro quente e saiu furiosa atrás dele💀",
    escolhas: [],
    som: "muito_ruim.mp3"
  }

};

// FUNÇÃO PRINCIPAL
function mostrarCena(id) {
  const cena = cenas[id];

  document.getElementById("imagem").src = cena.imagem;
  document.getElementById("texto").innerText = cena.texto;

  const escolhasDiv = document.getElementById("escolhas");
  escolhasDiv.innerHTML = "";

  // tocar som final
  if (cena.som) {
  musicaFundo.pause(); // 🔥 PARA A MÚSICA PRINCIPAL

 // se já existir som final tocando, para ele
if (somFinal) {
  somFinal.pause();
  somFinal.currentTime = 0;
}

musicaFundo.pause();

somFinal = new Audio("sounds/" + cena.som);
somFinal.play();
}

  cena.escolhas.forEach(escolha => {
    const botao = document.createElement("button");
    botao.innerText = escolha.texto;

    botao.onclick = () => {
      iniciarAudio(); // 🔥 ativa áudio no primeiro clique

      new Audio("sounds/click.mp3").play();
      mostrarCena(escolha.proxima);
    };

    escolhasDiv.appendChild(botao);
  });

  if (cena.escolhas.length === 0) {
  const botaoReset = document.createElement("button");
  botaoReset.innerText = "🔄 Jogar novamente";

  botaoReset.onclick = () => {

  // 🔥 parar som final se estiver tocando
  if (somFinal) {
    somFinal.pause();
    somFinal.currentTime = 0;
  }

  // reiniciar música de fundo
  musicaFundo.currentTime = 0;
  musicaFundo.play();

  mostrarCena("inicio");
};

  document.getElementById("escolhas").appendChild(botaoReset);
}
}

function iniciarJogo() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("reset-btn").style.display = "block";

  musicaFundo.currentTime = 0;
  musicaFundo.play();

  mostrarCena("inicio");
}

document.getElementById("reset-btn").onclick = () => {

  // parar som final
  if (somFinal) {
    somFinal.pause();
    somFinal.currentTime = 0;
  }

  // reiniciar música
  musicaFundo.currentTime = 0;
  musicaFundo.play();

  // voltar para início
  mostrarCena("inicio");
};