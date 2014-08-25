/*
 * Nucleo do Quasar
 * Inicio do objeto, toma as decisoes mais complexas e contem os metodos mais usados
 */
Quasar.core = {
	version : "2.0.017",
	name : "Quasar",
	author : "Wesley Nascimento",
	contributors : [],
	/* Linguagem */
	language : this.get("language", "pt_br"),

	/* Metodos de armazenamento */
	get : function (chave, def) {
		var data = new QJSON(game_data.player.name);
		return data.get(chave) === null ? def : data.get(chave);
	},
	set : function (chave, value) {
		var data = new QJSON(game_data.player.name);
		data.set(chave, value);
		data.save();
	},
	
	/* Metodo de tradução */
	getString : function (string) {
		var result = Quasar.lang[this.cache][string];
		if (typeof result == "undefined") {
			result = string;
		}
		return result;
	},
	
	/* Metodos de importação e exportação */
	importData : function (data) {
		localStorage.setItem(game_data.player.name, data);
		Loader.goTo();
	},
	exportData : function () {
		return localStorage.getItem(game_data.player.name);
	},	
	
	/* Abre uma pagina aleatoria se o numero gerado aleatoriamente for 10 */
	randomPageRandomTime : function () {
		if ( Quasar.utils.random(0, 10) != 10 ) return;
		
		var base = '?village=' + game_data.village.id + '&screen=';
		
		var pages = ['forum', 'ally', 'ranking', 'ranking&mode=con_player', 'market', 'smith',
			'statue', 'farm', 'barracks', 'stable', 'garage', 'storage', 'hide', 'wall'];
			
		var index = Quasar.utils.random(0, pages.length - 1);
		
		/* Abre uma pagina "abstrada" usando o metodo get do jQuery */
		$.get(base + pages[index]);
	},
	
	/*
	 * Iniciador do nucleo, chamado quando a DOM esta pronta
	 */
	run : function () {	
		//Se for o primeiro uso, mostra a mensagem de boas vindas
		if ( this.get("last_version_used", null) === null) {
			var html = this.getString("welcome_message");

			html += '<center><a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Licença Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Quasar</span> de <a xmlns:cc="http://creativecommons.org/ns#" href="wesleynascimento.com/quasar" property="cc:attributionName" rel="cc:attributionURL">wesleynascimento.com/quasar</a> está licenciado com uma Licença <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons - Atribuição-NãoComercial 4.0 Internacional</a>.</center>';

			var callback = function () {
				$("#btn_first_use").on("click", function () {
					if (game_data.player.sitter === 0) {
						location.href = "?village=" + game_data.village.id + "&screen=overview_villages";
					} else {
						var sitter = location.href.match(/t=\d+/i);
						location.href = "?village=" + game_data.village.id + "&screen=overview_villages&" + sitter;
					}
					this.set("last_version_used", this.version);
				});
			};
			Quasar.interface.menu.popupBox("Bem vindo ao Quasar!", html, 600, null, callback);
		}		
		//Se não for o primeiro uso mas se for a primeira vez rodando uma versão mais recente, atualiza a variavel
		else if (this.get("last_version_used", "") !== this.version) {
			this.set("last_version_used", this.version);
		}
		//Atualiza esta aldeia na lista de aldeias do quasar
		else {
			var v = new QJSON("villages", true);
			var coord = game_data.village.coord;
			if (!v.contains(coord)) {
				v.set(coord, game_data.village.id);
				this.set("villages", v.toJSON());
			}
		}
		
		this.url = location.href;
		this.set('total_execucoes', this.get('total_execucoes', 0) + 1);

		/* Se estiver pedindo para completar o CAPTCHA, cancela a execução do Quasar */
		if ($("#bot_check_image").length > 0) {
			return;
		}

		this.randomPageRandomTime();

		/* Decide-se o que fazer na pagina atual */
		switch (game_data.screen) {
		case 'place':
		
			/* Se tiver a opção de confirmar envio, confirma */
			if ( $("#troop_confirm_go").length > 0 ) {
				Quasar.farm.doConfirm();
				return;
			}
			
			/* Se tiver um alvo selecionado, não faz nada */
			if (location.href.indexOf("target") > 0) return;
			
			/* Se estiver na pagina de enviar comandos */
			if (game_data.mode === null || game_data.mode == "command") {

				/* Se não for premium, atualiza a lista de ataques e retornos */
				if ( !game_data.premium ) {
					Quasar.map.updateAR();
				}
				
				
				/* Se estiver em modo de dodge */
				if (this.get("before_dodge_page", null) !== null) {
					this.set("before_dodge_page", null);
					return;
				}
				
				/* Tenta executar cada uma das funções respectivamente, quando alguma acontecer "cancela" as proximas */
				if (Quasar.farm.init()) return;
				
				if (Quasar.wall.init()) return;
				
				/* O farm por post, não cancela a interface :) */
				Quasar.farm_post.init();
				
				//Inicia a interface da praça
				Quasar.interface.praca();
			}
			break;
		case 'map':
			Quasar.map.init();
			break;
		case 'overview':
			Quasar.overview.init();
			Quasar.dodge.init();
			break;
		case 'train':
			Quasar.train.init();
			break;
		case 'main':
			Quasar.main.init();
			break;
		case 'am_farm':
			Quasar.am_farm.init();
			break;
		case 'overview_villages':
			Quasar.overview_villages.init();
			if (game_data.mode == "incomings" && location.href.indexOf("subtype=attacks") > 0) {
				var last_page = this.get("before_identify_page", null);
				if (last_page !== null) {
					this.set("before_identify_page", null);
					location.href = last_page;
				}
			}
			break;
		case 'report':
			if ( this.url.contains("&view=")) {
				Quasar.report.view();
			}
			break;
		default:
			break;
		}
		//Inicia a interface ao final para prover um melhor desempenho
		Quasar.interface.menu.init();
	}
};