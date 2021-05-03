const form = document.querySelector('#form-robo');
const erros = [];

const posicoes = ['N', 'L', 'S', 'O'];
const movimentos = [];
const robo = {};

function limparErros() {
    document.querySelector('#erros').innerHTML = '';
    erros.length = 0;
}

function limparSaida() {
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
        erros.push('A posição escolhida para o Robo não é válida')
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
    })

    if (canteiros.length == 0 || !canteirosValidos) {
        erros.push('Os canteiros escolhidos não são válidos');
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

function irrigar(robo, canteiros) {
    canteiros.forEach(function(canteiro) {
        let irrigado = false;
        let i = 0;
        while (!irrigado && i < 1000) {
            if (canteiro[0]) {
                if(robo.x != canteiro[0]) {
                    movimentarX(canteiro[0]);
                } else {
                    canteiro[0] = null;
                }
            } else if (canteiro[1] ) {
                if (robo.y != canteiro[1]) {
                    movimentarY(canteiro[1]);
                } else {
                    canteiro[1] = null;
                }
            } else {
                movimentos.push('I');
                irrigado = true;
            }
            i++;
        }

    })
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    limparErros();
    limparSaida();
    movimentos.length = 0;
    const formData = getFormData();
    
    robo.x = formData.posicaoX;
    robo.y = formData.posicaoY;
    robo.direcao = formData.direcao;

    const canteiros = getPosicaoCanteiros(formData.canteiros);
    

    if(!validarForm(formData, canteiros)) {
        document.querySelector('#erros').innerHTML = erros;
        return;
    }
    
    irrigar(robo, canteiros);
    document.querySelector('#movimentos').innerHTML = 'Caminho: ' + movimentos;
    document.querySelector('#orientacao').innerHTML = 'Orientacao: ' + posicoes[robo.direcao];
});