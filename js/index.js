const form = document.querySelector('#form-robo');
const divMapa = document.querySelector('#mapa');
const posicoes = ['N', 'L', 'S', 'O'];
const movimentos = [];
const robo = {};
let mapa = [];
let erros;
let rodando = false;

function mostrarErros() {
    document.querySelector('#erros').innerHTML = erros;
}

function limparErros() {
    document.querySelector('#erros').innerHTML = '';
    erros = '';
}

function limparSaida() {
    mapa = [];
    divMapa.innerHTML = '';
    document.querySelector('#movimentos').innerHTML = '';
    document.querySelector('#orientacao').innerHTML = '';
}

function getFormData() {
    const tamanhoX = document.querySelector('#tamanho-x').value;
    const tamanhoY = document.querySelector('#tamanho-y').value;
    const posicaoX = document.querySelector('#posicao-x').value;
    const posicaoY = document.querySelector('#posicao-y').value;
    const direcao = document.querySelector('#direcao').value;
    const canteiros = document.querySelector('#canteiros').value;

    return {
        tamanhoX: parseInt(tamanhoX),
        tamanhoY: parseInt(tamanhoY),
        posicaoX: parseInt(posicaoX),
        posicaoY: parseInt(posicaoY),
        canteiros: canteiros.split(';').pop(),
        direcao: parseInt(direcao),
    };
}

function validarForm(dataForm, canteiros) {
    const tamanhoX = dataForm.tamanhoX;
    const tamanhoY = dataForm.tamanhoY;
    const posicaoX = dataForm.posicaoX;
    const posicaoY = dataForm.posicaoY;

    if (posicaoX > tamanhoX || posicaoY > tamanhoY) {
        erros  = 'A posição escolhida para o Robo não é válida';
        return false;
    }

    const canteirosValidos = canteiros.every(function(canteiro) {
        if (canteiro[0] == NaN || canteiro[1] == NaN) {
            return false;
        }

        if (canteiro[0] < 1 || canteiro[1] < 1) {
            return false;
        }

        if(canteiro[0] > tamanhoX || canteiro[1] > tamanhoY) {
            return false;
        }
        
        return true;
    });

    if (canteiros.length == 0 || !canteirosValidos) {
        erros = 'Os canteiros escolhidos não são válidos';
        return false;
    }
    
    return true;
}

function getPosicaoCanteiros(canteiros) {
    canteiros = canteiros.replace(/ /g, '');
    canteiros = canteiros.replace(/\(/g, '');
    canteiros = canteiros.replace(/\)/g, ';');
    canteiros = canteiros.split(';');
    canteiros.pop();

    return canteiros.map(function(canteiro) {
        const posicao = canteiro.replace(/ /g, '').split(',');
        return [
            parseInt(posicao[0]),
            parseInt(posicao[1])
        ]
    });
}

function girarRoboDireita () {
    if (robo.direcao == 3) {
        robo.direcao = 0;
    } else {
        robo.direcao++;
    }
    return robo.direcao;
}

function girarRoboEsquerda () {
    if (robo.direcao == 0) {
        robo.direcao = 3;
    } else {
        robo.direcao--;
    }
}

function movimentarX(posicao) {
    if(robo.x < posicao) {
        switch(robo.direcao) {
            case 0:
                girarRoboDireita();
                movimentos.push('D');
                break;
            case 1:
                robo.x++;
                movimentos.push('M');
                break;
            case 2:
            case 3:
                girarRoboEsquerda();
                movimentos.push('E');
                break;
        }
    } else {
        switch(robo.direcao) {
            case 0:
            case 1:
                girarRoboEsquerda();
                movimentos.push('E');
                break;
            case 2:
                girarRoboDireita();
                movimentos.push('D');
                break;
            case 3:
                robo.x--;
                movimentos.push('M');
                break;
            
        }
    }
}

function movimentarY (posicao) {
    if(robo.y < posicao) {
        switch(robo.direcao) {
            case 0:
                robo.y++;
                movimentos.push('M');
                break;
            case 1:
            case 2:
                girarRoboEsquerda();
                movimentos.push('E');
                break;
            case 3:
                girarRoboDireita();
                movimentos.push('D');
                break;
        }
    } else {
        switch(robo.direcao) {
            case 0:
            case 3:
                girarRoboEsquerda();
                movimentos.push('E');
                break;
            case 2:
                robo.y--;
                movimentos.push('M');
                break;
            case 1:
                girarRoboDireita();
                movimentos.push('D');
                break;
        }
    }
}

function delay() {
    return new Promise(function(done) {
        setTimeout(function(){
            done();
        }, 1000);
    });
}

function gerarMapa(tamanhoX, tamanhoY) {
    for(let i = 0; i <= tamanhoX; i++) {
        mapa[i] = [];
        for(let j = 0; j <= tamanhoY; j++) {
            mapa[i][j] = {
                x: false,
                y: false
            }
        }
    }
}

function posicionarCanteiros(canteiros) {
    canteiros.forEach(function(canteiro){
        mapa[canteiro[0]][canteiro[1]] = {
            x: true,
            y: true
        }
    })
}

function desenharMapa() {
    divMapa.innerHTML = '';
    const tamanhoX = mapa.length;
    const tamanhoY = mapa[0].length;
    const table = document.createElement('table');
    for(let i = tamanhoY - 1; i >= 0; i--) {
        const tr = document.createElement('tr');
        for(let j = 0; j < tamanhoX; j++) {
            const td = document.createElement('td');
            if(i == 0 && j > 0) {
                td.innerHTML = j;
                td.className = 'td-indice';
            } else if (j == 0 && i > 0) {
                td.innerHTML = i;
                td.className = 'td-indice';
            } else if (j == 0 && i == 0) {
                td.className = 'td-indice';
            } else if (robo.x == j && robo.y == i) {
                td.className = 'robo-' + posicoes[robo.direcao];
            } else if (mapa[j][i].x || mapa[j][i].y){
                td.className = 'canteiro';
            }

            tr.append(td);
        }

        table.append(tr);
    }

    divMapa.append(table);
    document.querySelector('#movimentos').innerHTML = movimentos;
    document.querySelector('#orientacao').innerHTML = posicoes[robo.direcao];
}


async function irrigar(canteiros) {
    let i = 0;
    
    while(i < canteiros.length) {
        const canteiro = canteiros[i];
        let irrigado = false;
        const canteiroMapa = mapa[canteiro[0]][canteiro[1]];
        while (!irrigado) {
            await delay();
            if (canteiroMapa.x) {
                if(robo.x != canteiro[0]) {
                    movimentarX(canteiro[0]);
                } else {
                    canteiroMapa.x = false;
                }
            } else if (canteiroMapa.y) {
                if (robo.y != canteiro[1]) {
                    movimentarY(canteiro[1]);
                } else {
                    canteiroMapa.y = false;
                }
            } else {
                movimentos.push('I');
                irrigado = true;
            }

            desenharMapa();
        }

        i++;
    }

    rodando = false;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (rodando) {
        erros = 'Aguarde o fim da simulação atual';
        mostrarErros();
        return;
    }

    limparErros();
    limparSaida();
    movimentos.length = 0;
    const formData = getFormData();
    
    robo.x = formData.posicaoX;
    robo.y = formData.posicaoY;
    robo.direcao = formData.direcao;

    const canteiros = getPosicaoCanteiros(formData.canteiros);
    
    if(!validarForm(formData, canteiros)) {
        mostrarErros();
        return;
    }

    gerarMapa(formData.tamanhoX, formData.tamanhoY);
    posicionarCanteiros(canteiros);
    desenharMapa();
    rodando = true;
    irrigar(canteiros);
});