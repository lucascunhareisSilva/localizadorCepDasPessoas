import Stats from "./web.js"; //base para dados pessoas
import promptSync from "prompt-sync"; //leitura de pesquisa
import baseDados from "./dados.js"; //base de dados
import {guessGender}  from "name-to-gender";
//entrada
const prompt = promptSync();

//hora do computador 
let dataHoras = new Date(); //horas atual
dataHoras.setMinutes(0); //minutos em zeros
let dataLocal = dataHoras.toLocaleTimeString("pt-br",{
	hour:"2-digit",
	minute:"2-digit"
});

//função da temperaTuraDoDia
async function temperaturaDias(lat,long){
	try{
		const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m&timezone=America%2FSao_Paulo&forecast_days=1`);
		if(!response.ok){
			console.log(response.status);
		}
		let data = await response.json();
		return data;
	}catch(error){
		console.error(error);
	}
}


let dadosPessoais = await baseDados;
//painel de exibição
dadosPessoais.forEach((itens)=>{
	console.log("========================================");
	console.log(`${itens.id}) NOME: ${itens.nome}`);
	console.log(`DATA-NASCIMENTO: ${itens.datanascimento}`);
	console.log(`CPF: ${itens.cpf}`);
});
//escolha uma pessoa
console.log("========================================");
//inserir busca
let buscarPessoa = Number(prompt("ESOLHA UMA PESSOA :"));

async function buscandoPessoa(id,dados){
	let pessoa = dados.find((pessoa)=> pessoa.id === id);
	if(pessoa){
		let sexo = await guessGender(pessoa.nome);//cebeçalho sexo
		let pbSexo = Math.floor(sexo.probability * 100);//probabilidade sexual
		let genero = sexo.gender === "male" ? "Masculino" : sexo.gender === "female" ? "Feminino" : "Não identificado";
		console.log(`NOME: ${pessoa.nome}`);
		console.log(`DATA-NASCIMENTO: ${pessoa.datanascimento}`);
		console.log(`SEXO: ${genero}`);
		console.log(`PROBABILIDADE: ${pbSexo}% DO GENERO ${genero.toUpperCase()}`);	
		console.log(`CPF: ${pessoa.cpf}`);
		console.log("BUSCANDO ENDEREÇOS....");
		let num = 1;
		pessoa.cep.forEach((cep,index)=>{
			console.log(`${num++}) CEP: ${cep} | NUMEROS: ${pessoa.numero[index]}`);
		});

		let escolhaCep = Number(prompt("ESCOLHA UM CEP: "));
		let cep;//cep escolhido
		let numeroCasa; //numero da casa escolhido
		if(escolhaCep >= 1 && escolhaCep <= pessoa.cep.length){
			cep = pessoa.cep[escolhaCep - 1];
			numeroCasa = pessoa.numero[escolhaCep - 1];
		}
		let acheiEndereco = await Stats(cep);
		console.log(`BUSCA DE DADOS DO ENDEREÇO ->`);
		console.log(`ESTADO: ${acheiEndereco.state}`);
		console.log(`CIDADE: ${acheiEndereco.city}`);
		console.log(`CEP: ${acheiEndereco.cep}`);
		console.log(`ENDEREÇO: ${acheiEndereco.address} - COMPLEMENTO: ${numeroCasa}`);
		console.log(`BAIRRO: ${acheiEndereco.district}`);
		console.log(`DDD-LOCAL: ${acheiEndereco.ddd}`);
		let latCep = acheiEndereco.lat;//latitude local
		let longCep = acheiEndereco.lng;//longtutide local
		let linkGoogle = `https://www.google.com/maps/search/?api=1&query=${latCep},${longCep}`;
		let dadosDOsLocal = await temperaturaDias(latCep,longCep);
		let horarios = dadosDOsLocal.hourly.time; //horarios
		let temperaTurasLocal = dadosDOsLocal.hourly.temperature_2m;
		let grau = horarios.findIndex((hora)=>{
			return hora.split("T")[1] === dataLocal;
		});
		let graus;
		if(grau !== -1){
			graus = `${temperaTurasLocal[grau]}°C`;
		}
		console.log(`TEMPERATURA LOCAL: ${graus}`);
		console.log(`LINK PARA GOOGLE: ${linkGoogle}`);

	}else{
		console.log("VALOR INSERIDO INCORRETO, PESSOA NÃO ENCONTRADA NA BASE DE DADOS!!!!");
	}
}
buscandoPessoa(buscarPessoa,dadosPessoais);


