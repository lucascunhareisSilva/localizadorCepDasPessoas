const enviar = document.getElementById("enviar");
//dados do form da pessoa cadastrada
const pessoa = document.getElementById("pessoa");
const nascimento = document.getElementById("nascimento");
const cpf = document.getElementById("cpf");
const cep = document.getElementById("cep");
const numeroCasa = document.getElementById("numeroCasa");
const message_body = document.querySelector(".message-body");
const message_header = document.querySelector(".message-header");
//buttons
const exibir = document.getElementById("exibir");
let baseDados = [
];
let id=1;//id incremento
pessoa.value = "";
nascimento.value = "";
cpf.value = "";
cep.value = "";
numeroCasa.value = "";

const salvarNoServidor = async (dados) => {
	try {
		const resposta = await fetch("/salvar", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(dados)
		});

		if (resposta.ok) {
			console.log("Enviado para o diretorio banco.json");
		}
	} catch (error) {
		console.error("Erro ao enviar para o servidor:", error);
	}
}

//função para cadastramento
const cadastraMentos = async (dados)=>{
	let pessoaDados = String(pessoa.value);
	let datanascimentoDados = String(nascimento.value);
	let cpfDados = String(cpf.value);
	let cepDados = String(cep.value);
	let numeroDados = Number(numeroCasa.value);
	let valorData = datanascimentoDados.split("-").reverse().join('-');//data invertida
	let cpfFormatado = cpfDados.replace(
		/^(\d{2})(\d{2})(\d{2})(\d{3})(\d{2})$/,"$1.$2.$3.$4-$5"
	);
	let cepFormatado = cepDados.replace(
		/^(\d{5})(\d{3})$/,"$1-$2"
	);
	if(isNaN(numeroDados)){
		alert("O numero da casa é numero e não pode conter letras");
	}else{
		dados.push({
		id:id,
		nome:pessoaDados,
		datanascimento:valorData,
		cpf:cpfFormatado,
		cep:[cepFormatado],
		numero:[numeroDados]
		});
		id++;
		if(dados.length >= 10){
			alert("Chegamos ao 10 de limite de dados");
		}
	}
	alert("Usuario criado !!!!");

}
const exibirHTML = (dados)=>{
	message_body.innerHTML = "";
	message_header.classList.add("message-body_two");
	message_body.classList.add("message-body_two");
	if(dados.length === 1){
		dados.forEach((itens)=>{
		message_body.innerHTML += `
			<p>${itens.id}) NOME: ${itens.nome.toUpperCase()}</p>
			<p>DATA-NASCIMENTO: ${itens.datanascimento}</p>
			<p>CPF: ${itens.cpf}</p>
			<p>CEP: ${itens.cep[0]}</p>
			<p>NUMERO CASA: ${itens.numero[0]}</p>
			
		`
		});
	}else if(dados.length > 1){
		dados.forEach((itens)=>{
		message_body.innerHTML += `
			<p>${itens.id}) NOME: ${itens.nome.toUpperCase()}</p>
			<p>DATA-NASCIMENTO: ${itens.datanascimento}</p>
			<p>CPF: ${itens.cpf}</p>
			<p>CEP: ${itens.cep[0]}</p>
			<p>NUMERO CASA: ${itens.numero[0]}</p>
			<p>==========================================</p>
			
		`
		});
	}
	
}
enviar.addEventListener("click", (e)=>{
	e.preventDefault();
	cadastraMentos(baseDados);
});
exibir.addEventListener("click",async (e)=>{
	e.preventDefault();
	if(baseDados.length === 0){
		alert("Insera os valores no formulario");
		return;
	}
	await salvarNoServidor(baseDados);
	exibirHTML(baseDados);
	
	
});
/*
export default baseDados;


export default baseDados;
*/
