function parseResultado(result){
    if(r.resultado){
        return r.valoracao.concat(0).join(' ');
    }else{
        return 'UNSATISFIABLE';
    }
}

function resolver(id){
    var clausulas = $('#f'+id).val();
    $('#r'+id).html(parseResultado(DPLL(parse(clausulas))));
}

//https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
function download(id) {
    var clausulas = $('#f'+id).val();
    var r = DPLL(parse(clausulas));
    var text = parseResultado(r);

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'r'+id+'.txt');
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function parse(dimacs_cnf){
    var clausulas = [];
    //var cabecalho;

    dimacs_cnf = dimacs_cnf.split('\n');//quebra linhas
    /*
    dimacs_cnf = dimacs_cnf.filter(function(linha){
        return !linha.trim().startsWith('c');
    }); //tira todos os comentários

    cabecalho = dimacs_cnf.filter(function(linha){
        return linha.trim().startsWith('p');
    })[0].trim().split(' '); //seleciona o cabeçalho

    nliteral = cabecalho[2];
    nclausulas = cabecalho[3];
    */
    clausulas = dimacs_cnf.filter(function(linha){
        return linha.trim().endsWith('0');
    }).map(function(clausula){
        literal = clausula.trim().split(' ');
        literal.pop();
        return literal.map(Number);
    });

    return clausulas;
}

function pega_literal(clausulas){
    return clausulas[0][0];
}

function aplica(clausulas, valoracao){
    var novasClausulas = [];
    for(var i = 0; i < clausulas.length; i++){
        clausula = simplifica(clausulas[i], valoracao);
        if(clausula !== false){
            novasClausulas.push(clausula);
        }
    }
    return novasClausulas;
}

function simplifica(clausula, valoracao){
    var novaClausula = [];
    for(var i = 0; i < clausula.length; i++){
        if(valoracao.includes(clausula[i])){
            return false;
        }else if(!valoracao.includes(-clausula[i])){
            novaClausula.push(clausula[i]);
        }
    }
    return novaClausula;
}

function DPLL_rec(clausulas, valoracao){

    clausulas = aplica(clausulas, valoracao);

    console.log("clausulas:",clausulas);
    console.log("valoração:",valoracao);
    
    if(clausulas.length == 0){
        return {
            resultado: true,
            valoracao: valoracao
        }
    }

    if(!clausulas.every(function(clausula){
        return !clausula.length == 0
    })){
        return {
            resultado: false
        }
    }

    literal = pega_literal(clausulas);

    v1 = Array.from(valoracao);
    v1.push(literal);

    r = DPLL_rec(Array.from(clausulas), v1);

    if(r.resultado){
        return r;
    }

    v2 = Array.from(valoracao);
    v2.push(literal * -1);

    return DPLL_rec(Array.from(clausulas),v2);
}

function DPLL(clausulas){
    return DPLL_rec(clausulas, []);
}

