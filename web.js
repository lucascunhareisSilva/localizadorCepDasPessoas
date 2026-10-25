//API do CEP
export default async function Stats(cep){
	const dados = cep.replace(/\D/g,"");
	try{
		const response = await fetch(`https://cep.awesomeapi.com.br/json/${dados}`);
		if(!response.ok){
			const errorData = await response.json().catch(()=>({message:"Error desconhecido"}));
			switch(response.status){
				case 400:
					console.warn("Status 400 (Bad Request) : O CEP informado é inválido.");
					break;
				case 404:
					console.warn("Status 404 (Not Found) : CEP não encontrado na base de dados.");
					break;
				case 500:
					console.error("Status 500 (Internal Server Error): Erro interno nos servidores");
					break;
				default:
					console.error(`Status HTTP não esperado: ${response.status}`);
					break;
			}
			console.log("Detalhes do erro retornado pela API:",errorData);
			return;
		}
		const data = await response.json();
		return data;
		
	}catch(error){
		console.error(`Falha de conexão/rede:`,error.message);
	}
}
//Stats("65061-680");//buscador de cep correto