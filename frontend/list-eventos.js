// Abrir modal
document.getElementById("openModalBtn").addEventListener("click", function() {
    document.getElementById("modal").style.display = "block";
});

// Fechar modal
document.getElementById("closeModalBtn").addEventListener("click", function() {
    document.getElementById("modal").style.display = "none";
});

// Adicionar um novo evento
document.getElementById("addMovieForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Obter os valores do formulário
    const nomeEvento = document.getElementById("nomeEvento").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const sR = document.getElementById("sR").value;
    const local = document.getElementById("local").value;
    const duracao = document.getElementById("duracao").value;
    const valor = document.getElementById("valor").value;
    const limitePessoas = document.getElementById("limitePessoas").value;
    const programacao = document.getElementById("programacao").value;
    const convidados = document.getElementById("convidados").value;
    
    
    // Crie uma nova linha na tabela com os valores do novo evento
    const table = document.querySelector("table tbody");
    const newRow = table.insertRow(table.rows.length);
    const nomeEventoCell = newRow.insertCell(0);
    const dataCell = newRow.insertCell(1);
    const horarioCell = newRow.insertCell(2);
    const sRCell = newRow.insertCell(3);
    const localCell = newRow.insertCell(4);
    const duracaoCell = newRow.insertCell(5);
    const valorCell = newRow.insertCell(6);
    const limitePessoasCell = newRow.insertCell(7);
    const programacaoCell = newRow.insertCell(8);
    const convidadosCell = newRow.insertCell(9);
    
    nomeEventoCell.innerHTML = nomeEvento;
    dataCell.innerHTML = data;
    horarioCell.innerHTML = horario;
    sRCell.innerHTML = sR;
    localCell.innerHTML = local;
    duracaoCell.innerHTML = duracao;
    valorCell.innerHTML = valor;
    limitePessoasCell.innerHTML = limitePessoas;
    programacaoCell.innerHTML = programacao;
    convidadosCell.innerHTML = convidados;
    
    // Feche o modal
    document.getElementById("modal").style.display = "none";
    
    // Limpe os campos do formulário
    document.getElementById("addMovieForm").reset();
});

import * as PIXI from "https://cdn.skypack.dev/pixi.js@5.x";
import { KawaseBlurFilter } from "https://cdn.skypack.dev/@pixi/filter-kawase-blur@3.2.0";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@3.0.0";
import hsl from "https://cdn.skypack.dev/hsl-to-hex";
import debounce from "https://cdn.skypack.dev/debounce";

// Retorna um número aleatório dentro de um intervalo
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Mapeia um número de um intervalo para outro
function map(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

// Cria uma nova instância de ruído simplex
const simplex = new SimplexNoise();

// Classe ColorPalette
class ColorPalette {
  constructor() {
    this.setColors();
    this.setCustomProperties();
  }

  setColors() {
    // Escolhe um matiz (hue) aleatório entre 220 e 360
    this.hue = ~~random(220, 360);
    this.complimentaryHue1 = this.hue + 30;
    this.complimentaryHue2 = this.hue + 60;
    // Define uma saturação e luminosidade fixas
    this.saturation = 95;
    this.lightness = 50;

    // Define uma cor base
    this.baseColor = hsl(this.hue, this.saturation, this.lightness);
    // Define uma cor complementar, a 30 graus da base
    this.complimentaryColor1 = hsl(
      this.complimentaryHue1,
      this.saturation,
      this.lightness
    );
    // Define uma segunda cor complementar, a 60 graus da base
    this.complimentaryColor2 = hsl(
      this.complimentaryHue2,
      this.saturation,
      this.lightness
    );

    // Armazena as escolhas de cores em um array para que uma possa ser escolhida aleatoriamente posteriormente
    this.colorChoices = [
      this.baseColor,
      this.complimentaryColor1,
      this.complimentaryColor2
    ];
  }

  randomColor() {
    // Escolhe uma cor aleatória
    return this.colorChoices[~~random(0, this.colorChoices.length)].replace(
      "#",
      "0x"
    );
  }

  setCustomProperties() {
    // Define propriedades personalizadas CSS para que as cores definidas aqui possam ser usadas em toda a interface do usuário
    document.documentElement.style.setProperty("--hue", this.hue);
    document.documentElement.style.setProperty(
      "--hue-complimentary1",
      this.complimentaryHue1
    );
    document.documentElement.style.setProperty(
      "--hue-complimentary2",
      this.complimentaryHue2
    );
  }
}

// Classe Orb
class Orb {
  // O PixiJS usa cores hexadecimais como literais hexadecimais (0x em vez de uma string com '#')
  constructor(fill = 0x000000) {
    // bounds = a área dentro da qual um orb pode se mover
    this.bounds = this.setBounds();
    // inicializa os valores { x, y } do orb para um ponto aleatório dentro de seus limites
    this.x = random(this.bounds["x"].min, this.bounds["x"].max);
    this.y = random(this.bounds["y"].min, this.bounds["y"].max);

    // quão grande o orb é em relação ao seu raio original (isso será modulado ao longo do tempo)
    this.scale = 1;

    // qual é a cor do orb?
    this.fill = fill;

    // o raio original do orb, definido em relação à altura da janela
    this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

    // pontos de partida no "tempo" para os valores aleatórios de ruído/auto-similares
    this.xOff = random(0, 1000);
    this.yOff = random(0, 1000);
    // quão rapidamente os valores de ruído/auto-similares avançam no tempo
    this.inc = 0.002;

    // PIXI.Graphics é usado para desenhar primitivas 2D (neste caso, um círculo) no canvas
    this.graphics = new PIXI.Graphics();
    this.graphics.alpha = 0.825;

    // 250ms após o último evento de redimensionamento da janela, recalcule as posições dos orbs.
    window.addEventListener(
      "resize",
      debounce(() => {
        this.bounds = this.setBounds();
      }, 250)
    );
  }

  setBounds() {
    // quão longe da origem { x, y } cada orb pode se mover
    const maxDist =
      window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
    // a origem { x, y } para cada orb (canto inferior direito da tela)
    const originX = window.innerWidth / 1.25;
    const originY =
      window.innerWidth < 1000
        ? window.innerHeight
        : window.innerHeight / 1.375;

    // permitir que cada orb se mova a uma distância x da sua origem x / y
    return {
      x: {
        min: originX - maxDist,
        max: originX + maxDist
      },
      y: {
        min: originY - maxDist,
        max: originY + maxDist
      }
    };
  }

  update() {
    // valores "pseudo-aleatórios" ou de ruído auto-similar em um determinado ponto no "tempo"
    const xNoise = simplex.noise2D(this.xOff, this.xOff);
    const yNoise = simplex.noise2D(this.yOff, this.yOff);
    const scaleNoise = simplex.noise2D(this.xOff, this.yOff);

    // mapeia os valores xNoise/yNoise (entre -1 e 1) para um ponto dentro dos limites do orb
    this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
    this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
    // mapeia scaleNoise (entre -1 e 1) para um valor de escala entre metade do tamanho original do orb e 100% do tamanho original
    this.scale = map(scaleNoise, -1, 1, 0.5, 1);

    // avance no "tempo"
    this.xOff += this.inc;
    this.yOff += this.inc;
  }

  render() {
    // atualiza as posições e valores de escala do PIXI.Graphics
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    this.graphics.scale.set(this.scale);

    // limpa tudo o que foi desenhado no PIXI.Graphics
    this.graphics.clear();

    // informa ao PIXI.Graphics para preencher quaisquer formas desenhadas após isso com a cor de preenchimento do orb
    this.graphics.beginFill(this.fill);
    // desenha um círculo em { 0, 0 } com seu tamanho definido por this.radius
    this.graphics.drawCircle(0, 0, this.radius);
    // avisa ao PIXI.Graphics que não iremos mais preencher formas
    this.graphics.endFill();
  }
}

// Crie a aplicação PixiJS
const app = new PIXI.Application({
  // renderizar para <canvas class="orb-canvas"></canvas>
  view: document.querySelector(".orb-canvas"),
  // ajuste automaticamente o tamanho para caber na janela atual
  resizeTo: window,
  // fundo transparente, criaremos um fundo degradê posteriormente usando CSS
  transparent: true
});

app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

// Crie paleta de cores
const colorPalette = new ColorPalette();

// Crie orbs
const orbs = [];

for (let i = 0; i < 10; i++) {
  const orb = new Orb(colorPalette.randomColor());

  app.stage.addChild(orb.graphics);

  orbs.push(orb);
}

// Animação!
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  app.ticker.add(() => {
    orbs.forEach((orb) => {
      orb.update();
      orb.render();
    });
  });
} else {
  orbs.forEach((orb) => {
    orb.update();
    orb.render();
  });
}

document
  .querySelector(".overlay__btn--colors")
  .addEventListener("click", () => {
    colorPalette.setColors();
    colorPalette.setCustomProperties();

    orbs.forEach((orb) => {
      orb.fill = colorPalette.randomColor();
    });
  });
