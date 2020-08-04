import { promises as fs, read } from 'fs';
import { start } from 'repl';

let allStates = [];
let allCities = [];
let countCities = [];
let filterMoreCities = [];
let filterLessCities = [];
let listLargerName = [];
let listLessName = [];
let lessLetterName = [];
let moreLetterName = [];

init();

async function init() {
  await promiseState();
  await promiseCity();
  createFileState();
  await promiseReadFile();
  printStatesDecCities();
  printStateAscCities();
  listCitiesLessName();
  listCitiesMoreName();
  largerName();
  lessName();
}

function promiseState() {
  return new Promise(async (resolve, reject) => {
    const states = await readStateJsons();

    console.log('Promise State Resolvida!');
    resolve(states);
  });
}

function promiseCity() {
  return new Promise(async (resolve, reject) => {
    const cities = await readCityJsons();

    console.log('Promise City Revolvida');
    resolve(cities);
  });
}

async function readStateJsons() {
  const arrayState = await fs.readFile('Estados.json');
  allStates = JSON.parse(arrayState);
}

async function readCityJsons() {
  const arrayCities = await fs.readFile('Cidades.json');
  allCities = JSON.parse(arrayCities);
}

function createFileState() {
  let citiesForState = [];
  for (const state of allStates) {
    citiesForState = allCities.filter((city) => {
      return city.Estado === state.ID;
    });
    fs.writeFile(
      `./estados/${state.Sigla}.json`,
      JSON.stringify(citiesForState),
      'utf-8'
    );
  }
  console.log('Executado');
}

function promiseReadFile() {
  return new Promise(async (resolve, reject) => {
    const countStateCity = await readFileState();

    console.log('Arquivos Carregados!');
    resolve(countStateCity);
  });
}

async function readFileState() {
  const states = allStates;

  for (const state of states) {
    let obj = {
      sigla: null,
      countCity: null,
    };
    const data = await fs.readFile(`./estados/${state.Sigla}.json`);
    const jsondata = JSON.parse(data);
    obj = {
      sigla: state.Sigla,
      countCity: jsondata.length,
    };
    countCities.push(obj);
  }
}

function printStatesDecCities() {
  const printData = countCities.sort((a, b) => {
    return b.countCity - a.countCity;
  });
  console.log('Estados com Maior Quantidade de Cidades');
  for (let i = 0; i < 5; i++) {
    filterMoreCities.push(`${printData[i].sigla} - ${printData[i].countCity}`);
  }
  console.log(filterMoreCities);
}

function printStateAscCities() {
  const printData = countCities.sort((a, b) => {
    return a.countCity - b.countCity;
  });
  console.log('Estados com Menor Quantidade de Cidades');
  for (let i = 4; i >= 0; i--) {
    filterLessCities.push(`${printData[i].sigla} - ${printData[i].countCity}`);
  }
  console.log(filterLessCities);
}

function listCitiesLessName() {
  const state = allStates;
  state.forEach((stateData) => {
    const list = allCities
      .filter((city) => {
        return city.Estado === stateData.ID;
      })
      .sort((a, b) => {
        return a.Nome.length - b.Nome.length;
      })
      .sort((a, b) => {
        return a.Nome - b.Nome;
      });
    listLessName.push(list[0]);
    lessLetterName.push(`${list[0].Nome} - ${stateData.Sigla}`);
    //console.log(lessLetterName);
  });
  console.log('Cidade de Menor Nome Por Estado');
  console.log(lessLetterName);
}

function listCitiesMoreName() {
  const state = allStates;
  state.forEach((stateData) => {
    const list = allCities
      .filter((city) => {
        return city.Estado === stateData.ID;
      })
      .sort((a, b) => {
        return b.Nome.length - a.Nome.length;
      })
      .sort((a, b) => {
        return a.Nome - b.Nome;
      });
    listLargerName.push(list[0]);
    moreLetterName.push(`${list[0].Nome} - ${stateData.Sigla}`);
  });

  console.log('Cidade de Maior Nome Por Estado');
  console.log(moreLetterName);
}

function largerName() {
  const city = listLargerName
    .sort((a, b) => {
      return a.Nome.localeCompare(b.Nome);
    })
    .sort((a, b) => {
      return b.Nome.length - a.Nome.length;
    });
  console.log('Cidade de Maior Nome');
  const sigla = allStates.find((state) => {
    return state.ID === city[0].Estado;
  });
  console.log(`${city[0].Nome} - ${sigla.Sigla}`);
}

function lessName() {
  const city = listLessName
    .sort((a, b) => {
      return a.Nome.localeCompare(b.Nome);
    })
    .sort((a, b) => {
      return a.Nome.length - b.Nome.length;
    });
  console.log('Cidade de Menor Nome');
  const sigla = allStates.find((state) => {
    return state.ID === city[0].Estado;
  });
  console.log(`${city[0].Nome} - ${sigla.Sigla}`);
}
