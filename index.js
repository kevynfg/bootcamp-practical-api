import { promises as fs } from 'fs';

let listaEstados = [];
let listaCidades = [];

main();

async function main() {
  await criarJsons();
  //await QtdCidadesPorUF('TO');
  //await cidadeComMaisLetras();
  //Tire o comentário da function debaixo se quiser cidades com menos letras
  await cidadeComMaisLetras('menor');
  await estadosComMaisCidades('menos');
  await cidadeComMaisLetrasDeTodas('menor');
}

async function criarJsons() {
  try {
    listaEstados = JSON.parse(await fs.readFile('Estados.json'));
    //console.log(listaEstados);
    listaCidades = JSON.parse(await fs.readFile('Cidades.json'));
    //console.log(listaCidades);

    for (let i = 0; i < listaEstados.length; i++) {
      let index = listaCidades.filter(
        (cidade) => cidade.Estado === listaEstados[i].ID
      );
      //console.log(index);
      await fs.writeFile(
        `./UF/${listaEstados[i].Sigla}.json`,
        JSON.stringify(index)
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function QtdCidadesPorUF(string) {
  try {
    const data = JSON.parse(await fs.readFile(`./UF/${string}.json`));
    //console.log(data.length);
    return data.length;
  } catch (error) {
    console.log(error);
  }
}

async function BuscarCidadesPorUF(string) {
  try {
    let cidades = [];
    const data = JSON.parse(await fs.readFile(`./UF/${string}.json`));
    //console.log(data.length);
    for (let cidade of data) {
      cidades.push(cidade.Nome);
    }
    return cidades;
  } catch (error) {
    console.log(error);
  }
}

async function estadosComMaisCidades(mais) {
  try {
    const estados = JSON.parse(await fs.readFile('Estados.json'));
    const lista = [];

    for (let estado of estados) {
      //busco a quantidade de cidades de cada estado
      //passando a sigla para a function que traz a quantidade
      const count = await QtdCidadesPorUF(estado.Sigla);
      lista.push({ uf: estado.Sigla, count });
    }

    lista.sort((a, b) => {
      return a.count - b.count;
    });
    console.log(lista);

    const resultados = [];
    if (mais) {
      lista
        //Extrai os primeiros valores da lista
        .slice(0, 5)
        .forEach((item) => resultados.push(item.uf + ' - ' + item.count));
    } else {
      lista
        //Extrai os últimos valores da lista
        .slice(-5)
        .forEach((item) => resultados.push(item.uf + ' - ' + item.count));
    }
    console.log('5 cidades com mais ou menos estados', resultados.reverse());
  } catch (error) {
    console.log(error);
  }
}
//prettier-ignore
async function cidadeComMaisLetras(menor) {
  try {
    const estados = JSON.parse(await fs.readFile('Estados.json'));
    const results = []
    for (let estado of estados) {
      const JsonEstados = JSON.parse(
        await fs.readFile(`./UF/${estado.Sigla}.json`)
      );

      const arrayCidade = []

      JsonEstados.map((cidade) => {
        arrayCidade.push(cidade.Nome)
      })

      arrayCidade.sort((a, b) => a.Nome - b.Nome)
      const Nome = arrayCidade.reduce((prevCidade, CurrentCidade) => {
        if (!menor) {
          if (prevCidade.length >= CurrentCidade.length)
            return prevCidade;
          return CurrentCidade;
        } else {
          if (prevCidade.length <= CurrentCidade.length)
            return prevCidade;
          return CurrentCidade;
        }
      })
      results.push({ Cidade: Nome, Sigla: estado.Sigla })
    }
    console.log(`Cidades com maior ou menor número de letras no nome: `, results)
  } catch (error) {
    console.error('Deu ruim', error);
  }
}
//prettier-ignore
async function cidadeComMaisLetrasDeTodas(menor) {
  try {
    const estados = JSON.parse(await fs.readFile('Estados.json'));
    const cidadeDeMaiorOuMenorNome = [];
    for (let estado of estados) {
      const JsonEstados = JSON.parse(
        await fs.readFile(`./UF/${estado.Sigla}.json`)
      );
      const arrayDeCidades = [];
      JsonEstados.map((cidade) => arrayDeCidades.push(cidade.Nome));
      arrayDeCidades.sort((a, b) => a.Nome - b.Nome);
      const Nome = arrayDeCidades.reduce((prevCidade, CurrentCidade) => {
        if (!menor) {
          if (prevCidade.length >= CurrentCidade.length) return prevCidade;
          return CurrentCidade;
        } else {
          if (prevCidade.length <= CurrentCidade.length) return prevCidade;
          return CurrentCidade;
        }
      });
      cidadeDeMaiorOuMenorNome.push({ Nome: Nome, Sigla: estado.Sigla });
    }
    cidadeDeMaiorOuMenorNome.sort((a, b) => a.Nome - b.Nome);

    //Pega a única cidade com o menor nome dentre todas
    const menorNome = cidadeDeMaiorOuMenorNome.reduce(
      (prevCidade, CurrentCidade) => {
        if (!menor) {
          if (prevCidade.Nome.length >= CurrentCidade.Nome.length)
            return prevCidade;
          return CurrentCidade;
        } else {
          if (prevCidade.Nome.length <= CurrentCidade.Nome.length)
            return prevCidade;
          return CurrentCidade;
        }
      }
    );

    if (!menor) {
      console.log(`Menor número de letras dentre todas as cidades: \n`, menorNome);
    } else {
      console.log(`Menor número de letras dentre todas as cidades: \n`, menorNome);
    }

  } catch (error) {
    console.error('Deu ruim', error);
  }
}
