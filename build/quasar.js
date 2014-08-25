Quasar.am_farm = {
	jump : false,
	cicle : 0,
	rows : 0,
	init : function () {
		Quasar.am_farm.UI.init();
		if (!Quasar.am_farm.getStatus())
			return;
		Quasar.am_farm.doAttacks();
		Quasar.utils.setReload("&order=distance&dir=asc&screen=am_farm");
	},
	doAttacks : function () {
		var time = 0;
		var IS_BY_RATIO = Quasar.core.get("am_is_by_ratio", false);
		var MAXATTACK = Number(Quasar.core.get("max_am_attacks", 2));
		var RATIO = Number(Quasar.core.get("am_dis_ratio", 1));
		var ATTACK_CONTROL = Quasar.core.get("attack_control", true);
		var MAXDIS = Number(Quasar.core.get("max_am_dis", 20));
		var BLUE_SET = Quasar.core.get("blue_reports", false);
		var YELLOW_SET = Quasar.core.get("yellow_reports", true);
		var USE_C = Quasar.core.get("use_c_am", true);
		var MAXWALL = Number(Quasar.core.get("max_am_wall", 3));
		var RES_A = Quasar.am_farm.getTemplateRes("0");

		var $rows = $(".row_a:visible, .row_b:visible", "#am_widget_Farm");
		console.log("Ciclo : " + Quasar.am_farm.cicle);
		$rows.each(function (index) {
			var $this = $(this);
			//Adiciona uma quantidade de ms ao toal de time
			time += Quasar.utils.random(300, 500);

			//Agenda as checagens de envio
			setTimeout(function () {
				if ($(".error").length > 0) {
					Quasar.am_farm.jump = true;
				}

				if (Quasar.am_farm.jump) {
					return;
				}

				Quasar.am_farm.rows++;

				var cicle = Quasar.am_farm.cicle;

				if (index == $rows.length - 1 && (!(!IS_BY_RATIO && cicle > MAXATTACK) || !(IS_BY_RATIO && cicle > RATIO * MAXDIS))) {
					Quasar.am_farm.cicle++;
					setTimeout(Quasar.am_farm.doAttacks, 500);
				}

				var deleted = false,
				isHidden = true;
				var classText = $this.attr("class").split(" ")[0];
				var rep_id = "drop_" + classText;
				var deletelink = $this.find("td:eq(0) a");

				/* Get links of templates */
				var linkA = $this.find("a.farm_icon_a");
				var linkB = $this.find("a.farm_icon_b");
				var linkC = $this.find("a.farm_icon_c");

				var coord = $this.find("td:eq(3) a").text().split(")")[0].split("(")[1];
				var sumRes = 0; //Default sum of resources

				/* For each resource td...*/
				$this.find("td:eq(5) .res").each(function () {
					sumRes += Number($(this).text().replace(".", ""));
				});

				var wall = Number($this.find("td:eq(6)").text() == "?" ? 0 : $this.find("td:eq(6)").text());

				var full = false; // Default value of is full
				var img = $this.find("td:eq(2) img");

				if (img.length > 0) {
					full = img.attr("src").match(/1.png/g) !== null ? true : false;
				}

				/* Get last report color */
				var green = $this.find("td:eq(1) img").attr("src").match(/green.png/g) !== null ? true : false;
				var blue = $this.find("td:eq(1) img").attr("src").match(/blue.png/g) !== null ? true : false;
				var yellow = $this.find("td:eq(1) img").attr("src").match(/yellow.png/g) !== null ? true : false;
				var red = $this.find("td:eq(1) img").attr("src").match(/red.png/g) !== null ? true : false;

				/* Get how many attacks were sent */
				var atqs = Number($this.find("#attacks").text());

				/* Get distance */
				var dis = Number($this.find("td:eq(7)").text());

				//Se estiver ativo para controlar ataques, e a quantidade de ataques for maior que o dessa rotação
				if (ATTACK_CONTROL && atqs > Quasar.am_farm.cicle) {
					return false;
				}
				//Se a distancia é maior que o maximo configurado, não ataca
				else if (dis > MAXDIS) {
					return false;
				}
				//Calcula a quantidade de ataques maximos baseados na razao de distacia
				else if (IS_BY_RATIO && atqs >= (RATIO * dis) && atqs !== 0) {
					return false;
				}
				//Calcula ataques maximos baseado no padão consigurado
				else if (!IS_BY_RATIO && atqs >= MAXATTACK) {
					return false;
				}
				//Se o ultimo relatorio foi vermelho, deleta esse relatorio
				else if (red) {
					deletelink.click();
					return true;
				}
				//Se o ultimo relatorio foi azul e não esta configurado para atacar azuis, não ataca
				else if (blue && !BLUE_SET) {
					return false;
				}
				//Se o ultimo relatorio for amarelho e está configurado para nao atacar relatorios amarelhos
				//ou se a muralha for maior que o maximo aceito nas configurações
				//não ataca.
				else if ((yellow && YELLOW_SET) || wall > MAXWALL) {
					//Se a quantidade de ataques for igual a 0, envia a coordenada para o wall droper
					if (atqs === 0) {
						Quasar.wall.save(coord, $this.find("#wall").parent());
					}
					return false;
				}
				/* Checagens de envio com prioridade*/

				//Se o botão C está visivel
				//e esta configurado para atacar
				//com o templace C e não existem mensagens de erro na tela
				else if (linkC.length > 0 && USE_C) {
					//Só ataca com templace C, se não existirem ataques aquela aldeias
					// e se a soma dos recursos existentes for maior ou igual ao minimo configurado
					if (atqs === 0 && sumRes >= RES_A) {
						linkC.click();
						console.log("Attack C");
						Quasar.farm.addAttack();
					}
				}
				//Se o botão A esta visivel e existem tropas suficientes para atacar
				else if (linkA.length > 0 && Quasar.am_farm.hasTroop("0")) {
					linkA.click();
					console.log("Attack A");
					Quasar.farm.addAttack();
				}
				//Se o botão B esta visivel e existem tropas suficientes para atacar
				else if (linkB.length > 0 && Quasar.am_farm.hasTroop("1")) {
					linkB.click();
					console.log("Attack B");
					Quasar.farm.addAttack();
				}
				//Se não atacar por que nao possui tropas, esconde
				else {
					return true;
				}
				$this.hide();
			}, time);
		});
	},
	//Templace represents the number of the templace, A = 0, B = 1
	hasTroop : function (template) {
		var has = true;
		$("form:eq(" + template + ") tr:eq(1) input").each(function () {
			var unit = $(this).attr("name");
			var temp = Number($(this).val());
			var current = Number($("#units_home #" + unit).text());
			if (current < temp) {
				has = false;
			}
		});
		return has;
	},
	getTemplateRes : function (template) {
		return Number($("form:eq(" + template + ") tr:eq(1) td:eq(6)").text());
	},
	UI : {
		init : function () {
			$("#am_widget_Farm div table tbody tr:eq(1) ").append('<th><img src="/graphic/buildings/wall.png?"/></th><th><img src="/graphic/command/attack.png"/></th>');
			var time = 0;

			$(".row_a, .row_b").each(function () {
				time += 100;
				var $this = $(this);
				setTimeout(function () {
					var classText = $this.attr("class").split(" ")[0];

					var id = "drop_" + classText;

					var coord = $this.find("td:eq(3) a").text().split(")")[0].split("(")[1];
					var img = $this.find("td:eq(3) img");

					var ataques = 0;

					if (img.length > 0) {
						img.mouseover();
						ataques = $('#tooltip h3').text().replace(/\D/g, '');
						img.mouseout();
					}

					var $image = $('<td><img id="wall" src="/graphic/buildings/wall.png?"/></td>').on("click", function () {
							Quasar.wall.save(coord, $(this));
						});
					$this.append($image);
					$this.append('<td id="attacks">' + ataques + '</td>');

				}, time);
			});

		}
	},
	getStatus : function () {
		return Quasar.core.get('am_farm', false);
	},
	setStatus : function (status) {
		Quasar.core.set('am_farm', status);
	}
};

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
Quasar.dodge = {
	init : function () {
		//I think that it is not part of Dodge!
		if (game_data.player.premium) {
			this.renameAttacks();
		}

		if (Quasar.dodge.getStatus() && game_data.player.incomings > 0 && Quasar.dodge.getDodgeVillage() !== null) {
			this.UI.showAlert();
			this.attack();
		}

		this.cancel();
		Quasar.utils.setReload("&screen=overview");
	},
	//Rename comming attacks
	renameAttacks : function () {
		//Conta qts ataques estão vindo, se for maior do que o que tinha na ultima vez que renomeou,
		//renomeia e altera, se for menor, apenas atualiza a lista
		var atqs = Quasar.core.get("incoming_attacks", 0);

		if (atqs < game_data.player.incomings) {
			Quasar.interface.menu.popupBox("Incoming attacks", "Loading page...", 1200, null, function () {
				$("#quasar_popup").load("?village=" + game_data.village.id + "&mode=incomings&subtype=attacks&screen=overview_villages", function (html) {
					var $html = $(html);
					Quasar.core.set("before_identify_page", location.href);
					$html.find("#select_all").click();
					$html.find("#incomings_form input[name='label']").click();
				});
			});
		}

		if (atqs != game_data.player.incomings) {
			Quasar.core.set("incoming_attacks", game_data.player.incomings);
		}

	},
	//Cancel dodge attacks, if exists
	cancel : function () {},
	//Schedule a attack
	attack : function () {
		var time = Quasar.dodge.getAttackTime();
		if (time === null) {
			return;
		}
		//Send trops now!
		if (time <= 60) {
			Quasar.dodge.sendAttack();
		}
		//Schedule an attack
		else {
			setTimeout(function () {
				Quasar.dodge.sendAttack();
			}, (time - 60) * 1000);
		}
	},
	sendAttack : function () {
		Quasar.interface.menu.popupBox("Dodging", "Loading page...", 1200, null, function () {

			Quasar.core.set("before_dodge_page", location.href);
			$("#quasar_popup").load("?village=" + game_data.village.id + "&screen=place", function (html) {
				var $html = $(html);
				var target = Quasar.dodge.getAttackVillage();
				if (target === null) {
					return;
				}
				$html.find("input[name='input']").val(target);
				$html.find('.unitsInput').each(function () {
					var $this = $(this);
					var $maxUnits = $this.next('a').html();
					var maxUnits = $maxUnits.substr(1).substr(0, $maxUnits.length - 2);
					$this.val(maxUnits);
				});
				$html.find("#target_attack").click();
			});
		});
	},
	hasTroop : function () {
		var has = false;
		$('.unitsInput').each(function () {
			var $this = $(this);
			if ($this.val() !== "" && Number($this.val()) > 0) {
				has = true;
				return false;
			}
		});
		return has;
	},
	UI : {
		showAlert : function () {
			if (Quasar.dodge.getStatus() && game_data.player.incomings > 0) {
				var s = $("#dodge");
				if (!s.hasClass("alert"))
					s.addClass("alert");
				else
					s.removeClass("alert");
				setTimeout(Quasar.dodge.UI.showAlert, 1000);
			}
		}
	},
	getDodgeVillage : function () {
		return Quasar.core.get("dodge_target", null);
	},
	getAttackTime : function () {
		var $ele = $(".no_ignored_command:first");
		if ($ele.length > 0) {
			var timer = $ele.find("td:eq(2) span").text();
			return Quasar.utils.stringToSec(timer);
		}
		return null;
	},
	getStatus : function () {
		return Quasar.core.get('dodge', false);
	},
	setStatus : function (status) {
		Quasar.core.set('dodge', status);
	}
};

/*
 * Ataca as coordenadas predefinidas com os templates adicionados!
*/
Quasar.farm = {
	init : function () {
		if (!Quasar.farm.getStatus()) {
			return false;
		}
		var waiting_attack = false;
		$(".troop_template_selector").each(function () {
			if (waiting_attack) {
				return true;
			}
			$(this).click();
			if (Quasar.farm.canAttack()) {
				waiting_attack = Quasar.farm.doAttack();
			}
		});
		Quasar.utils.setReload("&screen=place");
		return false;
	},
	canAttack : function () {
		var can = true;
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);
		if (coords.length < 1)
			return false;
		$("input[class='unitsInput']").each(function () {
			var value = $(this).val();
			var qtd = $(this).parent().find("a").text();
			qtd = qtd.replaces("(", "");
			qtd = qtd.replaces(")", "");
			if (value === null || value === "")
				return;
			if (Number(qtd) < value) {
				can = false;
			}
		});
		return can;
	},
	doAttack : function () {
		var index = Quasar.core.get("index_" + game_data.village.id, 0) + 1;
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);
		if (coords.length < 1) {
			return false;
		}
		if (index > coords.length - 1) {
			var stop = Quasar.core.get("stop_end_farm", false);
			if (stop) {
				return;
			} else {
				index = 0;
			}
		}
		var current = coords[index];
		$("input[name='input']").val(current);
		Quasar.core.set("index_" + game_data.village.id, index);
		Quasar.farm.addAttack();
		//Wait a random time to prevent ban
		setTimeout(function () {
			$("#target_attack").click();
		}, Quasar.utils.random(500, 2500));
		return true;
	},
	doConfirm : function () {
		//Wait a random time to prevent ban and wait for JQuery load :)
		setTimeout(function () {
			$('#troop_confirm_go').click();
		}, Quasar.utils.random(500, 2500));
	},
	addAttack : function () {
		var qjson = new QJSON("attacks", true);
		var date = $("#serverDate").text();
		if (qjson.contains(date)) {
			var n = qjson.get(date) + 1;
			qjson.set(date, n);
		} else {
			qjson.add(date, 0);
		}
		Quasar.core.set("attacks", qjson.toJSON());
	},
	getStatus : function () {
		return Quasar.core.get("auto_farm", false);
	},
	setStatus : function (status) {
		Quasar.core.set("auto_farm", status);
		if (status) {
			Quasar.farm_post.setStatus(false);
			$("#auto_farm_post").removeClass("active");
		}
	}
};

/*
 * Informações gerais sobre unidades de construções do jogo.
 */
Quasar.game = {
	builds : {
		"main" : {
			"max" : 30,
			"name" : "Edifício principal",
			"wood" : 90,
			"stone" : 80,
			"iron" : 70,
			"pop" : 5,
			"fwood" : 1.26,
			"fstone" : 1.275,
			"firon" : 1.26,
			"fpop" : 1.17
		},
		"barracks" : {
			"max" : 25,
			"name" : "Quartel",
			"wood" : 200,
			"stone" : 170,
			"iron" : 90,
			"pop" : 7,
			"fwood" : 1.26,
			"fstone" : 1.28,
			"firon" : 1.26,
			"fpop" : 1.17
		},
		"stable" : {
			"max" : 20,
			"name" : "Estabulo",
			"wood" : 270,
			"stone" : 240,
			"iron" : 260,
			"pop" : 8,
			"fwood" : 1.26,
			"fstone" : 1.28,
			"firon" : 1.26,
			"fpop" : 1.17
		},
		"garage" : {
			"max" : 15,
			"name" : "Oficina",
			"wood" : 300,
			"stone" : 240,
			"iron" : 260,
			"pop" : 8,
			"fwood" : 1.26,
			"fstone" : 1.28,
			"firon" : 1.26,
			"fpop" : 1.17
		},
		"church" : {
			"max" : 3,
			"name" : "Igreja",
			"wood" : 16000,
			"stone" : 20000,
			"iron" : 5000,
			"pop" : 5000,
			"fwood" : 1.26,
			"fstone" : 1.28,
			"firon" : 1.26,
			"fpop" : 1.55
		},
		"church_f" : {
			"max" : 1,
			"name" : "Primeira Igreja",
			"wood" : 160,
			"stone" : 200,
			"iron" : 50,
			"pop" : 5,
			"fwood" : 1.26,
			"fstone" : 1.28,
			"firon" : 1.26,
			"fpop" : 1.55
		},
		"snob" : {
			"max" : 1,
			"name" : "Academia",
			"wood" : 15000,
			"stone" : 25000,
			"iron" : 10000,
			"pop" : 80,
			"fwood" : 2,
			"fstone" : 2,
			"firon" : 2,
			"fpop" : 1.17
		},
		"smith" : {
			"max" : 20,
			"name" : "Ferreiro",
			"wood" : 220,
			"stone" : 180,
			"iron" : 240,
			"pop" : 20,
			"fwood" : 1.26,
			"fstone" : 1.275,
			"firon" : 1.26,
			"fpop" : 1.17
		},
		"place" : {
			"max" : 1,
			"name" : "Praça",
			"wood" : 10,
			"stone" : 40,
			"iron" : 30,
			"pop" : 0,
			"fwood" : 1.26,
			"fstone" : 1.275,
			"firon" : 1.26,
			"fpop" : 1.17
		},
		"statue" : {
			"max" : 1,
			"name" : "Estabulo",
			"wood" : 220,
			"stone" : 220,
			"iron" : 220,
			"pop" : 10,
			"fwood" : 1.26,
			"fstone" : 1.275,
			"firon" : 1.26,
			"fpop" : 1.17
		},
		"market" : {
			"max" : 25,
			"name" : "Mercado",
			"wood" : 100,
			"stone" : 100,
			"iron" : 100,
			"pop" : 20,
			"fwood" : 1.26,
			"fstone" : 1.275,
			"firon" : 1.26,
			"fpop" : 1.17
		},
		"wood" : {
			"max" : 30,
			"name" : "Bosque",
			"wood" : 50,
			"stone" : 60,
			"iron" : 40,
			"pop" : 5,
			"fwood" : 1.25,
			"fstone" : 1.275,
			"firon" : 1.245,
			"fpop" : 1.155
		},
		"stone" : {
			"max" : 30,
			"name" : "Poço de argila",
			"wood" : 65,
			"stone" : 50,
			"iron" : 40,
			"pop" : 5,
			"fwood" : 1.27,
			"fstone" : 1.265,
			"firon" : 1.24,
			"fpop" : 1.14
		},
		"iron" : {
			"max" : 30,
			"name" : "Mina de ferro",
			"wood" : 75,
			"stone" : 65,
			"iron" : 70,
			"pop" : 10,
			"fwood" : 1.252,
			"fstone" : 1.275,
			"firon" : 1.24,
			"fpop" : 1.17
		},
		"farm" : {
			"max" : 30,
			"name" : "Fazenda",
			"wood" : 45,
			"stone" : 40,
			"iron" : 30,
			"pop" : 0,
			"fwood" : 1.3,
			"fstone" : 1.32,
			"firon" : 1.29,
			"fpop" : 1
		},
		"storage" : {
			"max" : 30,
			"name" : "Armazem",
			"wood" : 60,
			"stone" : 50,
			"iron" : 40,
			"pop" : 0,
			"fwood" : 1.265,
			"fstone" : 1.27,
			"firon" : 1.245,
			"fpop" : 1.15
		},
		"hide" : {
			"max" : 10,
			"name" : "Esconderijo",
			"wood" : 50,
			"stone" : 60,
			"iron" : 50,
			"pop" : 2,
			"fwood" : 1.25,
			"fstone" : 1.25,
			"firon" : 1.25,
			"fpop" : 1.17
		},
		"wall" : {
			"max" : 20,
			"name" : "Muralha",
			"wood" : 50,
			"stone" : 100,
			"iron" : 20,
			"pop" : 5,
			"fwood" : 1.26,
			"fstone" : 1.275,
			"firon" : 1.26,
			"fpop" : 1.17
		},
	},
	units : {
		"spear" : {
			"wood" : 50,
			"stone" : 30,
			"iron" : 10,
			"pop" : 1,
			"time" : 1020,
			"ed" : "barracks",
			"name" : "spear"
		},
		"sword" : {
			"wood" : 30,
			"stone" : 30,
			"iron" : 70,
			"pop" : 1,
			"time" : 1500,
			"ed" : "barracks",
			"name" : "sword"
		},
		"axe" : {
			"wood" : 60,
			"stone" : 30,
			"iron" : 40,
			"pop" : 1,
			"time" : 1320,
			"ed" : "barracks",
			"name" : "axe"
		},
		"archer" : {
			"wood" : 100,
			"stone" : 30,
			"iron" : 60,
			"pop" : 1,
			"time" : 1800,
			"ed" : "barracks",
			"name" : "archer"
		},
		"spy" : {
			"wood" : 50,
			"stone" : 50,
			"iron" : 20,
			"pop" : 2,
			"time" : 900,
			"ed" : "stable",
			"name" : "spy"
		},
		"light" : {
			"wood" : 100,
			"stone" : 125,
			"iron" : 250,
			"pop" : 4,
			"time" : 1800,
			"ed" : "stable",
			"name" : "light"
		},
		"marcher" : {
			"wood" : 250,
			"stone" : 100,
			"iron" : 150,
			"pop" : 5,
			"time" : 2700,
			"ed" : "stable",
			"name" : "marcher"
		},
		"heavy" : {
			"wood" : 200,
			"stone" : 150,
			"iron" : 600,
			"pop" : 6,
			"time" : 3600,
			"ed" : "stable",
			"name" : "heavy"
		},
		"ram" : {
			"wood" : 300,
			"stone" : 200,
			"iron" : 200,
			"pop" : 5,
			"time" : 4800,
			"ed" : "garage",
			"name" : "ram"
		},
		"catapult" : {
			"wood" : 320,
			"stone" : 400,
			"iron" : 100,
			"pop" : 8,
			"time" : 7200,
			"ed" : "garage",
			"name" : "catapult"
		}
	}
};
/*
 * Objeto de interface
 * Responsável pelo menu principal e todas as funções que alteram o HTML ou CSS original do jogo
 */
Quasar.interface = {
	menu : {
		$buttons : null,
		$infos : null,
		$menu : null,
		$countDown : $("#countDown"),
		ticker : [],
		init : function () {
			if (!premium) {
				Quasar.interface.menu.premiumChanges();
			}
			if ($("#quasar_menu").length > 0) {
				$("#quasar_menu").remove();
			}
			$('body').append('<section id="quasar_menu" class="quasar" style="display:none;"></section>');
			this.$menu = $("#quasar_menu");
			this.addHTML('<div id="quasarTitle" class="title">' + Quasar.core.name + '</br>v' + Quasar.core.version + '</div>');
			this.addHTML('<div id="quasarCount" class="section"><div id="countDown" class="timer" style="color: #9E0000; font-weight: 700; text-align: center; font-size: 14px;">00:00:00</div></div>');
			this.addHTML('<div id="quasarButtons" class="section"></div>');
			this.addHTML('<div id="quasarInfo" class="section"></div>');
			this.addHTML('<div id="quasarSlide" class="slider">&raquo;</div>');

			//Seleciona os elementos e armazena na cache
			this.$buttons = $("#quasarButtons");
			this.$infos = $("#quasarInfo");
			this.$countDown = $("#countDown");

			//Adiciona os botoes ao menu
			this.addButton(Quasar.core.getString("auto_farm"), "auto_farm", Quasar.farm.getStatus, Quasar.farm.setStatus);
			this.addButton(Quasar.core.getString("auto_farm_post"), "auto_farm_post", Quasar.farm_post.getStatus, Quasar.farm_post.setStatus);
			this.addButton(Quasar.core.getString("wall_drop"), "wall_drop", Quasar.wall.getStatus, Quasar.wall.setStatus);
			this.addButton(Quasar.core.getString("auto_recruit"), "auto_recuit", Quasar.train.getStatus, Quasar.train.setStatus);
			this.addButton(Quasar.core.getString("auto_build"), "auto_build", Quasar.main.getStatus, Quasar.main.setStatus);
			this.addButton(Quasar.core.getString("am_farm"), "am_farm", Quasar.am_farm.getStatus, Quasar.am_farm.setStatus);
			this.addButton(Quasar.core.getString("dodge"), "dodge", Quasar.dodge.getStatus, Quasar.dodge.setStatus);

			this.addActionButton(Quasar.core.getString("import_export"), "import", function () {
				var html = "";
				html += Quasar.core.getString("import_export_desc");
				html += '<input type="text" value="" id="import_val" placeholder="" size="20"><input type="button" value="' + Quasar.core.getString("import") + '" id="btn_import">';
				html += '<input type="text" value="" id="export_val" placeholder="" size="20"><input type="button" value="' + Quasar.core.getString("export") + '" id="btn_export">';
				var onDraw = function () {
					$("#btn_import").on("click", function () {
						var data = $("#import_val").val();
						if (data !== "") {
							Quasar.core.importData(data);
						}
					});
					$("#btn_export").on("click", function () {
						var data = Quasar.core.exportData();
						$("#export_val").val(data);
						$("#export_val").focus();
						$("#export_val").select();
					});
				};
				Quasar.interface.menu.popupBox(Quasar.core.getString("import_export"), html, 400, null, onDraw);
			});

			this.addActionButton(Quasar.core.getString("configuration"), "config", function () {
				var onDraw = Quasar.interface.menu.configDraw;
				var html = Quasar.interface.menu.configHtml();
				Quasar.interface.menu.popupBox(Quasar.core.getString("configuration"), html, 400, null, onDraw);
			});

			this.addInformation("Ping", "ping", function () {
				$("#ping").text(Number(Loader.timeEnd - Loader.timeStart) + "ms");
			});

			this.addInformation(Quasar.core.getString("attacks_today"), "attackcount", function () {
				var qjson = new QJSON("attacks", true);
				var date = $("#serverDate").text();
				if (!qjson.contains(date)) {
					qjson.add(date, 0);
					Quasar.core.set("attacks", qjson.toJSON());
				}
				var n = qjson.get(date);
				console.log(n);
				$("#attackcount").text(n);
			}, function () {
				var title = Quasar.core.getString("attacks_today");
				var html = "";
				html += '<table class="vis nowrap tall" style="width: 100%"><tbody><tr><th></th><th></th></tr>';
				var attacks = new QJSON("attacks", true);
				for (var chave in attacks.cache) {
					html += '<tr><td>' + chave + '</td><td>' + attacks.get(chave) + '</td></tr>';
				}
				html += '</tbody></table>';
				Quasar.interface.menu.popupBox(title, html, 400, null, null);
			});

			var slider = Quasar.core.get('slider', true);

			this.showHideMenu(slider);

			$("#quasarSlide").on('click', function () {
				var slider = Quasar.core.get('slider', true);
				Quasar.core.set('slider', !slider);
				Quasar.interface.menu.showHideMenu(!slider);
			});

			$("#quasarLoading").fadeOut("slow");

			$("#quasar_menu").show();

			this.tick();
		},
		//Adiciona um HTML ao menu
		addHTML : function (html) {
			this.$menu.append(html);
		},
		//Adiciona um Botão ao menu
		addButton : function (text, id, getStatus, setStatus) {
			this.$buttons.append('<div id="' + id + '" class="button">' + text + '</div>');
			var element = $("#" + id);
			var change = function () {
				if (getStatus()) {
					element.addClass("active");
				} else {
					element.removeClass("active");
				}
			};
			element.on('click', function () {
				var status = getStatus();
				setStatus(!status);
				change();
			});
			change();
		},
		//Adiciona um botão de ação ao menu
		addActionButton : function (text, id, action) {
			this.$buttons.append('<div id="' + id + '" class="button action">' + text + '</div>');
			var element = $("#" + id);
			element.on('click', action);
		},
		//Adiciona um texto de informação ao menu
		//As informaçoes podem ser tickaveis, ou seja, se atualizam
		addInformation : function (title, id, onTick, onClick) {
			if (typeof onClick == "undefined") {
				this.$infos.append('<div><b>' + title + '</b>: <span id="' + id + '"></span></div>');
			} else {
				this.$infos.append('<div><b>' + title + '</b>: <span id="' + id + '" style="font-weight: 700;color: #603000;"></span></div>');
				$("#" + id).on("click", onClick);
			}

			if (typeof onTick !== "undefined") {
				this.ticker.push(onTick);
			}
		},
		//Decrementa do contador regressivo e executa o callback
		countDown : function (time, callback) {
			if (time < 0) {
				callback();
				return;
			}
			this.$countDown.text(Quasar.utils.secToString(time));
			setTimeout(function () {
				Quasar.interface.menu.countDown(--time, callback);
			}, 1000);
		},
		//Cria um popup
		popupBox : function (title, html, width, height, callback) {
			var preele = $("#quasar_popup");
			//Se já existem um pop up,
			//Remove executa uma animação do antigo saindo e o novo aparecendo
			if (preele.length > 0) {
				preele.fadeTo(500, 0, function () {
					preele.remove();
					Quasar.interface.menu.popupBox(title, html, width, height, callback);
				});
				return;
			}

			$('body').append('<div id="quasar_popup" class="popup_style ui-draggable" style="position: fixed;"></div>');

			var $ele = $("#quasar_popup");

			$ele.append('<div class="popup_menu"><span style="float: left;">' + title + '</span><a href="javascript:void(0);" id="closePop">x</a></div>');
			$("#closePop").on("click", Quasar.interface.menu.closePop);

			$ele.draggable();
			$ele.append('<div class="popup_content">' + html + '</div>');

			//Realiza os ajustes de posição e tamanho
			if (width !== null) {
				$ele.css('width', width);
			} else {
				$ele.css('width', 'auto');
			}

			if (height !== null) {
				$ele.css('height', height);
			} else {
				$ele.css('height', 'auto');
			}

			//Centraliza o elemento
			var left = (window.innerWidth / 2) - (width / 2);
			var top = (window.innerHeight / 2) - (parseInt($ele.css("height")) / 2);

			$ele.css('left', left);
			$ele.css('top', top > 10 ? top : 10);

			if (callback !== null) {
				callback();
			}
			$ele.fadeTo(500, 1);
		},
		closePop : function () {
			var $ele = $("#quasar_popup");

			$ele.fadeTo(500, 0, function () {
				$ele.remove();
			});
		},
		//Mostra ou esconde o menu
		showHideMenu : function (show) {
			var element = $("#quasar_menu");
			var slider = $("#quasarSlide");
			if (show) {
				element.animate({
					left : "0px"
				}, 500);
			} else {
				element.animate({
					left : "-143px"
				}, 500);
			}
		},
		tick : function () {
			//Async loop
			setTimeout(function () {
				Quasar.interface.menu.tick();
			}, 1000);
			for (var i = 0; i < this.ticker.length; i++) {
				this.ticker[i]();
			}
		},
		premiumChanges : function () {
			var screen = game_data.screen;
			var nVillId = Quasar.utils.getNextVillage();
			var pVillId = Quasar.utils.getPrevVillage();
			$("#menu_row2").prepend('<td class="box-item icon-box separate arrowCell" style="display:none;"><a id="village_switch_left" class="village_switch_link" href="?village=' + pVillId + '&screen=' + screen + '" accesskey="a"><span class="arrowLeft"> </span></a></td><td class="box-item icon-box arrowCell" style="display:none;"><a id="village_switch_right" class="village_switch_link" href="?village=' + nVillId + '&screen=' + screen + '" accesskey="d"><span class="arrowRight"> </span></a></td>');
			$(".box-item").show(1000);
		},
		configDraw : function () {
			$("#langSelect").val(Quasar.core.get("language", "en"));
			$("#save").on("click", function () {
				Quasar.core.set("language", $("#langSelect").val());
				Quasar.core.set("min_rand", $("#min_rand").val());
				Quasar.core.set("max_rand", $("#max_rand").val());
				Quasar.core.set("max_recruit_time", $("#max_recruit_time").val());

				var limit = (premium ? 5 : 2);
				if (Number($("#max_build_queue").val()) <= limit) {
					Quasar.core.set("max_build_queue", $("#max_build_queue").val());
				}

				Quasar.core.set("am_is_by_ratio", $("#am_is_by_ratio").is(":checked"));
				Quasar.core.set("attack_control", $("#attack_control").is(":checked"));
				Quasar.core.set("am_dis_ratio", $("#am_dis_ratio").val());
				Quasar.core.set("max_am_dis", $("#max_am_dis").val());
				Quasar.core.set("max_am_attacks", $("#max_am_attacks").val());
				Quasar.core.set("blue_reports", $("#blue_reports").is(":checked"));
				Quasar.core.set("yellow_reports", $("#yellow_reports").is(":checked"));
				Quasar.core.set("use_c_am", $("#use_c_am").is(":checked"));
				Quasar.core.set("stop_end_farm", $("#stop_end_farm").is(":checked"));
				Quasar.core.set("max_am_wall", $("#max_am_wall").val());
				Quasar.core.set("wall_drop_spy", $("#wall_drop_spy").val());
				Quasar.core.set("wall_drop_ram", $("#wall_drop_ram").val());
				Quasar.core.set("wall_drop_axe", $("#wall_drop_axe").val());

				var dodge = $("#dodge_target").val();
				Quasar.core.set("dodge_target", dodge !== "" ? dodge : null);

				UI.SuccessMessage( Quasar.core.getString("success_configuration") );
			});
		},
		configHtml : function () {
			var html = "";
			html += '<div id="tab-general">';
			html += "<div><strong>"+ Quasar.core.getString("language_lang") +"</strong></br>";
			html += "<select style='width: 200px' id='langSelect'>";
			for (var i in Quasar.lang) {
				if (typeof Quasar.lang[i].language !== "undefined") {
					html += "<option value='" + i + "'>" + Quasar.lang[i].language + "</option>";
				}
			}
			html += "</select></div>";

			html += Quasar.core.getString( "ConfigPage" );
			return html;
		}
	},
	/*
	 * Cria a interface in-page da Praça de Reunioes
	 */
	praca : function () {
		tickTimer = Quasar.utils.tickTimer;

		var $main_table = $('<table class="content-border vis nowrap tall" width="100%" id="build_script" style="opacity:0">' + '<tr><th style="width: 66%">' + Quasar.core.getString("villages") + ' <a id="ordenar">' + Quasar.core.getString("order") + '</a> - <a id="limpar">' + Quasar.core.getString("clean") + '</a></th></tr>' + '<tr><td><input type="text" id="coords" name="name" value="" style="width: 90%;" placeholder="'+ Quasar.core.getString( "paste_coords" ) +'">(<span id="current">0</span>/<span id="number">0</span>)</td></tr>' + '<tr><td><input type="text" id="wall_coords" name="name" value="" style="width: 90%;" placeholder="'+ Quasar.core.getString("paste_wall_coords") +'">(<span id="wall_number">0</span>)</td></tr>' + '</table></br>');
		$("#contentContainer").before($main_table);

		var $coords = $("#coords");
		var $number = $("#number");
		var $wallcoords = $("#wall_coords");
		var $wallnumber = $("#wall_number");
		var current = Quasar.core.get("index_" + game_data.village.id, 0);

		$("#current").text(current);
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);

		$coords.val(coords.join(" "));

		$number.text(coords.length);
		$coords.on('change', function () {
			var coords = ele_coords.val().split(" ");
			$number.text(coords.length);
			Quasar.core.set("coords_" + game_data.village.id, coords);
		});
		var wall_coords = Quasar.core.get("wall_coords", []);
		$wallcoords.val(wall_coords.join(' '));

		$wallnumber.text(wall_coords.length);

		$wallcoords.on('change', function () {
			var coords = $wallcoords.val().split(" ");
			$wallnumber.text(coords.length);
			Quasar.core.set("wall_coords", coords);
		});

		$("#ordenar").on('click', function () {
			var mycoord = game_data.village.coord;
			var order = Quasar.utils.orderByDis(mycoord, $coords.val());
			$coords.val(order.join(" "));
			$number.text(order.length);
			Quasar.core.set("coords_" + game_data.village.id, order);
		});

		$("#limpar").on('click', function () {
			var clean = Quasar.utils.clean($coords.val());
			$coords.val(clean.join(" "));
			$number.text(clean.length);
			Quasar.core.set("coords_" + game_data.village.id, clean);
		});

		$("#btnOptions").on('click', function () {
			var title = Quasar.core.getString("option") + " - " + Quasar.core.getString("break_Wall");
			var html = '';
			Quasar.interface.menu.popupBox(title, html, 600, null, null);
		});

		$("#build_script").fadeTo(1000, 1);
	},
	/*
	 * Cria a interface in-page do Edificil principal
	 */
	main : {
		$sortable : null,
		init : function () {
			tickTimer = Quasar.utils.tickTimer;
			/*
			var bs = $("#build_script");
			if (bs.length > 0) {
				bs.remove();
				$("#img_addBuild").remove();
			}
			*/
			var first = true;
			$("#buildings tr").each(function () {
				var $this = $(this);
				if (first || $this.find("td:eq(1) .inactive").length > 0) {
					$this.append("<td></td>");
					first = false;
					return;
				}
				var edificil = $this.attr("id");
				$this.append("<td id='img_addBuild'><img data-ed='" + edificil + "' title='" + Quasar.lang.get('add_icon_title') + "' src='/graphic/overview/build.png'></img></td>");
			});

			var $main_table = $('<table style="opacity:0" class="content-border vis nowrap tall" width="100%"><tr><th style="width: 66%">' + Quasar.lang.get("builds") + '(<span id="number"></span>) <a id="mostrar">' + Quasar.lang.get("show_link") + '</a></th></tr><tr><td id="main_order"></td></tr></table>' +
					'<table id="sortable-list" class="content-border vis nowrap tall" width="100%" style="display:none; margin-top: 10px"></table><br>');
			$("#contentContainer").before($main_table);
			
			this.$sortable = $("#sortable-list");
			
			this.$sortable.find("tbody").sortable({
				forcePlaceholderSize : true,
				cursor : "move",
				revert : true,
				tolerance : "pointer",				
				placeholder : "ui_active",
				stop : function (event, ui) {
					var sorted = $(this).sortable("toArray");
					sorted.shift();
					Quasar.core.set("queue_" + game_data.village.id, sorted);
					Quasar.main.load();
				}
			}).disableSelection();			
			
			
			$("#mostrar").on('click', function () {
				var $this = $(this);
				if ($this.text() == Quasar.lang.get("show_link")) {
					Quasar.interface.main.$sortable.show(1000);
					$this.text(Quasar.lang.get("hide_link"));
				} else {
					Quasar.interface.main.$sortable.hide(1000);
					$this.text(Quasar.lang.get("show_link"));
				}
			});
						
			$("img#img_addBuild").on('click', function () {
				var queue = Quasar.core.get("queue_" + game_data.village.id, []);
				var ed = $(this).attr("data-ed").replace("main_buildrow_", "");
				var nivel;
				if (typeof Quasar.main.niveis[ed] !== "undefined") {
					nivel = Quasar.main.niveis[ed] + 1;
				} else {
					nivel = Quasar.main.getCurrentNivel(ed) + 1;
				}
				Quasar.main.niveis[ed] = nivel;
				if (nivel > Quasar.game.builds[ed].max) {
					return;
				}
				queue.push(ed);
				Quasar.core.set("queue_" + game_data.village.id, queue);
				Quasar.main.update();
			});
			
			$("#build_script").fadeTo(1000, 1);
		},
		addSortableItem : function (edificil, nivel) {
			var g = Quasar.game.builds[edificil];
			var build_name = g.name,
				wood = parseInt(g.wood * Math.pow(g.fwood, (nivel - 1))),
				stone = parseInt(g.stone * Math.pow(g.fstone, (nivel - 1))),
				iron = parseInt(g.iron * Math.pow(g.firon, (nivel - 1))),
				pop = parseInt(g.pop * Math.pow(g.fpop, (nivel - 1))) - parseInt(g.pop * Math.pow(g.fpop, (nivel - 2)));

			this.$sortable.append("<tr id='" + edificil + "' class='sortable_row'><td><a href='?village=43158&screen=" + edificil + "'><img src='graphic/buildings/mid/" + edificil + "1.png' title='" + ed + "' class='bmain_list_img' alt=''></a><a href='?village=43158&screen=" + edificil + "'>" + ed + "</a></td><td style='font-size: 0.9em'>" + Quasar.lang.get("build_level") + " " + nivel + "</td><td><span class='icon header wood'></span>" + wood + "<span class='icon header stone'></span>" + stone + "<span class='icon header iron'></span>" + iron + "<span class='icon header population'></span>" + pop + "</td><td><img class='tool_icon icon header' id='remove' data-ed='" + index + "' title='" + Quasar.lang.get('remove_icon_title') + "' src='/graphic/forum/thread_delete.png'></img><img src='/graphic/sorthandle.png' style='width: 11px; height:11px; ursor:pointer' id='move' data-ed='" + index + "'></span></td></tr>");
			
			$("#main_order").append('<img src="/graphic/buildings/mid/' + edificil + '1.png">');
			
			var row = $("#main_buildrow_" + edificil).find("span:eq(0)");
			if (row.find("#newNivel").length > 0) {
				row.find("#newNivel").text(' - (' + nivel + ')');
			} else {
				row.append('<span style="font-size: 0.9em; color: #FC0000;" id="newNivel"> - (' + nivel + ')</span>');
			}
			
			$("#sortable-list #remove").last().on('click', function () {
				var ed = Number($(this).attr("data-ed"));
				var queue = Quasar.core.get("queue_" + game_data.village.id, []);
				queue.splice(ed, 1);
				Quasar.core.set("queue_" + game_data.village.id, queue);
				Quasar.main.niveis[ed] = Quasar.main.niveis[ed] - 1;
				Quasar.main.update();
			});
		},		
		update : function () {
			var queue = Quasar.core.get("queue_" + game_data.village.id, []);
			this.niveis = {};
			
			this.$sortable.html("");
			this.$sortable.append('<tr><th style="width: 23%">' + Quasar.lang.get("build_queue") + '</th><th>' + Quasar.lang.get("build_level") + '</th><th>' + Quasar.lang.get("price") + '</th><th width="54px"></th></tr>');

			$("#main_order").html("");
			$("#number").text(queue.length);
			
			var nivel;
			var build;
			for (var i = 0; i < queue.length; i++) {
				build = queue[i];
				if (typeof this.niveis[build] !== "undefined") {
					nivel = this.niveis[build] + 1;
				} else {
					nivel = this.getCurrentNivel(build) + 1;
				}
				this.niveis[build] = nivel;
				this.addSortableItem(build, nivel);
			}
		}
	},
	map : {
		$quasar : null,
		init : function () {
			$("#map_config").after('<br><table class="vis" width="100%" style="border-spacing:0px;border-collapse:collapse;"><tbody id="quasarMap"><tr><th colspan="3">Quasar Options</th></tr></tbody></table><br/><table class="vis" width="100%" id="quasar-colector" style="display:none;"><tr><th>Coords(<span id="qtdCoords">0</span>)</th></tr><tr><td style="text-align:center"><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px;"></textarea></td></tr></table>');
			$('#fullscreen').attr('style', 'display: block;').attr('onclick', 'TWMap.premium = true; TWMap.goFullscreen();').attr('title', 'FullScreen - Quasar Bot');
			this.$quasar = $("#quasarMap");
			this.appendMenu('<a id="btn_colect" class="btn">' + Quasar.lang.get('colect_coords') + '</a>');
			this.appendMenu('<a id="btn_showcoords" class="btn">' + Quasar.lang.get('show_coords') + '</a>');
			$("#btn_colect").on('click', function () {
				var cl = $(this).attr("class");
				if (cl === "btn") {
					$("#quasar-colector").show(500);
					TWMap.map._handleClick = Quasar.map.handleClick;
					$(this).attr("class", "btn btn-confirm-yes");
				} else {
					$("#quasar-colector").hide(500);
					$(".map_icon_collect").remove();
					Quasar.map.coords = [];
					$("#quasar-colector textarea").val("");
					$("#qtdCoords").text(Quasar.map.coords.length);
					TWMap.map._handleClick = Quasar.map._handleClick;
					$(this).attr("class", "btn");
				}
			});
			$("#btn_showcoords").on('click', function () {
				var cl = $(this).attr("class");
				if (cl === "btn") {
					Quasar.map.doSC();
					$(this).attr("class", "btn btn-confirm-yes");
				} else {
					$(".map_icon_showcoord").remove();
					$(this).attr("class", "btn");
				}
			});
			Quasar.map.UI.premiumChanges();
		},
		appendMenu : function (html) {
			this.$quasar.append("<tr><td align='center'>" + html + "</td></tr>");
		},
		premiumChanges : function () {
			if (premium) {
				return;
			}
			this.appendMenu(Quasar.lang.get("map_size") + ': <select id="size-change" style="width: 65px"><option value="4">4x4</option><option value="5">5x5</option><option value="7">7x7</option><option value="9">9x9</option><option value="11">11x11</option><option value="13">13x13</option><option value="15">15x15</option><option value="20">20x20</option><option value="30">30x30</option></select>');
			var size = Quasar.core.get("map_size", 13);
			var size_change = $("#size-change");
			size_change.val(size);
			Quasar.map.resize(size);
			size_change.on('change', function () {
				var val = Number($(this).val());
				Quasar.map.resize(val);
			});
		}
	}
};

Quasar.lang.pt_br = {
	save : "Salvar",
	count : "Contador",
	language : "Portugues",
	language_lang : "Idioma",
	yes : "sim",
	no : "nao",
	auto_farm : "Farmador",
	auto_farm_post : "Farmador Silencioso",
	auto_recruit : "Recrutador",
	anti_afk : "Anti-Captcha",
	auto_build : "Construtor",
	dodge : "Dodge",
	planner : "Planejador (Preview)",
	update_notes : "Sobre",
	wall_drop : "Derrubar muralha",
	am_farm : "Auto AS",
	attacks_today : "Ataques hoje",
	order_recruit : "Ordem",
	option : "Opções",
	units : "Unidades",
	opt_title : "Opções de recrutamento",
	build_queue : "Fila de construção",
	build_level : "Nivel",
	price : "Custo",
	hide_link : "Esconder",
	show_link : "Mostrar",
	builds : "Contruções",
	add_icon_title : "Adicionar a fila",
	remove_icon_title : "Remover da fila",
	villages : "Aldeias",
	order : "Ordenar",
	clean : "Limpar",
	village_notes : "Notas da aldeia",
	colect_coords : "Coletar coordenadas",
	show_coords : "Mostrar coordenadas",
	map_size : "Tamanho do mapa",
	configuration : "Configuracoes",
	import_export : "Importar/Exportar",
	import : "Importar",
	export : "Exportar",
	import_export_desc : "Used to export and import your Data Storage.",
	welcome_message : this.getWelcomeMessage(),
	configPage : this.getConfigPage(),
	success_configuration : "Suas configurações foram salvas!",
	paste_coords : "Cole as coordenadas dos seus farm aqui! Exemplo: 666|666 666|666",
	paste_wall_coords : "Cole as coordenadas para derrumar muralha aqui! Exemplo: 666|666 666|666",

	/* Codigos em HTML */
	getWelcomeMessage : function () {
		var html = "";
		html += "<span style='size: 16px; font-weight: bold'>Sobre o Quasar.</span></br>";
		html += "Quasar é formado por um conjunto de ferramentas, cujo o intuito é fazer com que seja mais pratico jogar TribalWars.</br>";
		html += "Algumas dessas ferramentas são ilegais segundo as regras do jogo, esteja ciente que o mal uso ou uso excessivo pode causar o banimento de sua conta.</br>";
		html += "Quasar tem sido desenvolvido por <strong>Wesley Nascimento</strong> desde Novembro de 2013. E vem sido distribuido dentro da licensa Creative Commons.</br>";

		html += "<br><strong style='size: 16px; font-weight: bold'>Termos de uso e Politica de privacidade</strong></br>";
		html += "<ul>";
		html += "<li>O author não se resposabiliza por punições ou banimentos.</li>";
		html += "<li>Quasar envia informaçoes anonimas sobre seu uso para um servidor externo.</li>";
		html += "<li>O author não garante suporte ao projeto a longo prazo.</li>";
		html += "<li>O author se reserva ao direito de mudar esses termos a qualquer momento sem aviso previo ou posterior.</li>";
		html += "<li>Quasar armazena informações e configurações em seu navegador.</li>";
		html += "</ul>";
		html += "<span style='color:#c00; font-weight: bold'>Ao usar o Quasar você automaticamente está ciente e concorda com todos os termos listados acima.</span></br>";

		html += "<br><span style='size: 16px; font-weight: bold'>Terminando a instalação</span></br>";
		html += "Para que você possa executar o Quasar sem problemas ou conflitos é preciso que ele obtenha algumas informações da sua conta.</br>";
		html += "<ul>";
		html += "<li>Quantidade de aldeias.</li>";
		html += "<li>Identificação das aldeias.</li>";
		html += "<li>Se possui conta premium.</li>";
		html += "<li>Se possui assistente de saques.</li>";
		html += "<li>Quantidade de ataques chegando.</li>";
		html += "<li>Se está em modo de ferias.</li>";
		html += "<li>Se está como sitter.</li>";
		html += "</ul>";
		html += "<br>Essas informações serão obtidas automaticamente ao clicar no botão abaixo. Atenção você será redirecionado para outra pagina.</br>";
		html += "<center><a href='#' id='btn_first_use' class='evt-confirm btn'>Configurar</a></center></br>";
		return html;
	},

	getConfigPage : function () {
		var html = "";
		html += '<table class="vis" style="width:100%"><tbody>';
		html += '<tr><th>Descrição</th><th>Valor</th></tr>';
		html += '<tr><td colspan="2"><strong>Temporalizadores</strong></td></tr>';
		html += '<tr><td>Tempo minimo para operaçoes aleatorias: </td><td><input type="text" id="min_rand" size="2" value="' + Quasar.core.get("min_rand", 300) + '"/>seconds</td></tr>';
		html += '<tr><td>Tempo maximo para operações aleatorias: </td><td><input type="text" id="max_rand" size="2" value="' + Quasar.core.get("max_rand", 900) + '"/>seconds</td></tr>';
		html += '<tr><td>Tempo maximo de recrutamento: </td><td><input type="text" id="max_recruit_time" size="2" value="' + Quasar.core.get("max_recruit_time", 8) + '"/> hours</td></tr>';
		html += '<tr><td>Quantidade maxima de edificios na fila: </td><td><input type="text" id="max_build_queue" size="2" value="' + Quasar.core.get("max_build_queue", (premium ? 5 : 2)) + '"/></td></tr>';
		html += '<tr><td>Parar de farmar ao chegar no fim da lista: </td><td><input type="checkbox" id="stop_end_farm" ' + (Quasar.core.get("stop_end_farm", false) ? "checked" : "") + '/></td></tr>';

		html += '<tr><td colspan="2"><strong>Assistente de Saque</strong></td></tr>';
		html += '<tr><td><span title="Limita a distancia maxima a enviar um ataque.">Distancia de ataques maxima:</span></td><td><input type="text" id="max_am_dis" size="2" value="' + Quasar.core.get("max_am_dis", 20) + '"/>campos</td></tr>';
		html += '<tr><td><span title="Limita a quantidade de ataques que podem ser enviados a uma aldeia baseando-se na distancia.">Usar sistema de razão?</span></td><td><input type="checkbox" id="am_is_by_ratio" ' + (Quasar.core.get("am_is_by_ratio", false) ? "checked" : "") + '/></td></tr>';
		html += '<tr><td><span title="Quantidade de ataque para cada campo de distancia. Se configurado como 1, vai enviar 1 ataque para cada campo entre o alvo e a aldeia atual. (precisa que \"Usar sistema de razão\" esteja ativo)">Ataque por campo: </span></td><td><input type="text" id="am_dis_ratio" size="2" value="' + Quasar.core.get("am_dis_ratio", 1) + '"/>(Ex: 0.2)</td></tr>';
		html += '<tr><td><span title="O controlador de ataques prioriza atacar aldeias que tenham menos ataques a caminho, isso previne que as primeiras aldeias da pagina tenham muitos ataques enquanto outras da mesma pagina não tenhão nenhum.">Usar controlador de ataques? </span></td><td><input type="checkbox" id="attack_control" ' + (Quasar.core.get("attack_control", true) ? "checked" : "") + '/></td></tr>';
		html += '<tr><td><span title="Configura uma quantidade maxima de ataques a uma aldeia. (Funciona somente se \"Usar sistema de razão\" estiver desabilitado.)">Quantidade maxima de ataques: </span></td><td><input type="text" id="max_am_attacks" size="2" value="' + Quasar.core.get("max_am_attacks", 2) + '"/></td></tr>';
		html += '<tr><td><span title="Configura o nivel maximo de muralha permitido para um ataque.">Nivel maximo de muralha:</span></td><td><input type="text" id="max_am_wall" size="2" value="' + Quasar.core.get("max_am_wall", 3) + '"/></td></tr>';
		html += '<tr><td><span title="Permite atacar aldeias cujo o ultimo relatorio foi azuis.">Atacar relatorios azuis?: </span></td><td><input type="checkbox" id="blue_reports" ' + (Quasar.core.get("blue_reports", false) ? "checked" : "") + '/></td></tr>';
		html += '<tr><td><span title="Move os relatorios amarelho para o derrubador de muralha.">Mover relatorios amarelho?</span></td><td><input type="checkbox" id="yellow_reports" ' + (Quasar.core.get("yellow_reports", true) ? "checked" : "") + '/></td></tr>';
		html += '<tr><td><span title="Enviar ataque usando o templace C (Somente se a soma dos recursos for maior que 1000)">Usar o templace C?:</span></td><td><input type="checkbox" id="use_c_am" ' + (Quasar.core.get("use_c_am", true) ? "checked" : "") + '/></td></tr>';

		html += '<tr><td colspan="2"><strong>Configurações do Derrubador de Muralhas</strong></td></tr>';
		html += '<tr><td><span title="Quantidade de exploradores a enviar">Exploradores:</span></td><td><input type="text" id="wall_drop_spy" size="2" value="' + Quasar.core.get("wall_drop_spy", 1) + '"/></td></tr>';
		html += '<tr><td><span title="Quantidade de Arietes a enviar">Arietes:</span></td><td><input type="text" id="wall_drop_ram" size="2" value="' + Quasar.core.get("wall_drop_ram", 15) + '"/></td></tr>';
		html += '<tr><td><span title="Quantidade de Barbaros a enviar">Barbaros:</span></td><td><input type="text" id="wall_drop_axe" size="2" value="' + Quasar.core.get("wall_drop_axe", 30) + '"/></td></tr>';

		html += '<tr><td colspan="2"><strong>Outras</strong></td></tr>';
		html += '<tr><td>Alvo para dodge: </td><td><input type="text" id="dodge_target" size="3" value="' + Quasar.core.get("dodge_target", "") + '"/></td></tr>';

		html += '</tbody></table>';
		html += '<div>';
		html += '<input type="button" id="save" value="Salvar"/>';
		html += '</div>';

		return html;
	},
};

/*
 * Objeto de Edificil
 * Executado quando Quasar está na screen de Edificil principal
 */
Quasar.main = {
	niveis : {},
	init : function () {
		var get = Quasar.game.builds;
		this.load();

		var update_all = BuildingMain.update_all;
		BuildingMain.update_all = function (data) {
			update_all(data);
			Quasar.UI.init();
		};

		if (this.getStatus()) {
			this.build();
		}
		Quasar.utils.setReload("&screen=main");		
		Quasar.interface.main.init();
	},
	build : function () {
		var queue = Quasar.core.get("queue_" + game_data.village.id, []);

		if (queue.length > 0) {
			var building = queue[0];
			if ($("#main_buildlink_" + building).is(':visible') && BuildingMain.order_count < this.getMax()) {
				queue.shift();
				Quasar.core.set("queue_" + game_data.village.id, queue);
				this.load();
				BuildingMain.build(building);

				setTimeout(Quasar.build, 1000);
			}
		}
	},
	getMax : function () {
		if (typeof premium === "undefined" || premium === false) {
			return 2;
		} else {
			return Number(Quasar.core.get("max_build_queue", 5));
		}
	},
	getCurrentNivel : function (name) {
		var bq = $("#buildqueue .buildorder_" + name);
		if (bq.length > 0) {
			return Number(bq.last().find("td:eq(0)").text().match(/\d+/g)[0]);
		}
		var text = $("#main_buildrow_" + name).find("span:eq(0)").text().match(/\d+/g);
		if (text !== null) {
			return Number(text[0]);
		} else {
			return 0;
		}
	},
	getStatus : function () {
		return Quasar.core.get("auto_build", false);
	},
	setStatus : function (status) {
		Quasar.core.set("auto_build", status);
	}
};
Quasar.map = {
	size : 0,
	_handleClick : null,
	coords : [],
	init : function () {
		this._handleClick = TWMap.map._handleClick;
		var onResizeEnd = TWMap.mapHandler.onResizeEnd;
		TWMap.mapHandler.onResizeEnd = function () {
			onResizeEnd();
			this.doAr();
		};
		Quasar.interface.map.init();
		Quasar.map.doAR();
	},
	updateAR : function () {
		if (premium)
			return;
		var element;
		var re = [];
		var at = [];
		var first = true;
		var coord;
		if (game_data.screen !== "overview")
			element = $("table.vis").last().find("tbody tr");
		else
			element = $("table.vis").first().find("tbody tr");
		$(element).each(function () {
			if (first) {
				first = false;
				return;
			}
			var $this = $(this);
			var img = $this.find("img").attr("src");
			var col0 = $this.find("td:eq(0) span span").text();
			var col1 = $this.find("td:eq(1)").text();
			if (!col0.contains("("))
				return;
			coord = col0.split("(")[1].split(")")[0].replaces("|", "");
			if (img.indexOf("return") > -1) {
				if (re.indexOf(coord) == -1) {
					re.push(coord);
				}
			} else if (img.indexOf("attack") > -1) {
				if (at.indexOf(coord) == -1) {
					at.push(coord);
				}
			}
		});
		Quasar.core.set("map_attacks", at);
		Quasar.core.set("map_returns", re);
	},
	doSC : function () {
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);
		for (var i = 0; i < coords.length; i++) {
			coords[i] = Quasar.utils.coordToId(coords[i].replaces("|", ""));
		}
		$('[id*="map_village_"]').each(function () {
			var id = $(this).attr('id').replace('map_village_', '');
			if (coords.indexOf(id) > -1) {
				var m = $('#map_village_' + id);
				m.before('<img class="map_icon_showcoord" style="top: ' + m.css('top') + '; left: ' + m.css('left') + '; " id="map_icons_' + id + '" src="/graphic/dots/blue.png">');
			}
		});
	},
	doAR : function () {
		if (premium)
			return;
		var attacks = Quasar.core.get("map_attacks", []);
		var returns = Quasar.core.get("map_returns", []);
		var i = 0;
		for (i = 0; i < attacks.length; i++) {
			attacks[i] = Quasar.utils.coordToId(attacks[i]);
		}
		for (i = 0; i < returns.length; i++) {
			returns[i] = Quasar.utils.coordToId(returns[i]);
		}
		$('[id*="map_village_"]').each(function () {
			var id = $(this).attr('id').replace('map_village_', '');
			if ($('#map_icons_' + id + ".map_icon_3_1").length === 0) {
				var m;
				if (returns.indexOf(id) > -1) {
					m = $('#map_village_' + id);
					m.before('<img class="map_icon_return"style="top: ' + m.css('top') + '; left: ' + m.css('left') + ';" id="map_icons_' + id + '" src="/graphic/map/return.png">');
				}
				if (attacks.indexOf(id) > -1) {
					m = $('#map_village_' + id);
					m.before('<img class="map_icon_attack" style="position: absolute; top: ' + m.css('top') + '; left: ' + m.css('left') + '" id="map_icons_' + id + '" src="/graphic/map/attack.png">');
				}
			}
		});
	},
	handleClick : function (event) {
		var input = $('#quasar-colector textarea');
		var coord = this.coordByEvent(event);
		var village = TWMap.villages[coord.join('')];
		if (typeof village != "undefined") {
			coord = coord.join('|');
			if (Quasar.map.coords.indexOf(coord) < 0) {
				Quasar.map.coords.push(coord);
				input.val(Quasar.map.coords.join(' '));
				$("#qtdCoords").text(Quasar.map.coords.length);
				var m = $('#map_village_' + village.id);
				m.before('<img class="map_icon_collect" style="top: ' + m.css('top') + '; left: ' + m.css('left') + '; " id="map_icons_' + village.id + '" src="/graphic/dots/red.png">');
			} else {
				Quasar.map.coords.splice(coord, 1);
				input.val(Quasar.map.coords.join(' '));
				$("#qtdCoords").text(Quasar.map.coords.length);
				$('#map_icons_' + village.id + ".map_icon_collect").remove();
			}
		}
		return false;
	},
	resize : function (val) {
		if (premium)
			return;
		Quasar.core.set("map_size", val);
		TWMap.resize(val);
		this.size = val;
	}
};

Quasar.overview = {
	init : function () {
		Quasar.map.updateAR();
		Quasar.overview.UI.init();
	},
	UI : {
		init : function () {
			tickTimer = Quasar.utils.tickTimer;
			if (!premium) {
				this.premiumChanges();
			}
		},
		premiumChanges : function () {
			var html = '<div id="show_notes" class="vis moveable widget" style="display:none;"><h4 class="head"><img style="float: right; cursor: pointer;" src="graphic/minus.png">' + Quasar.lang.get("village_notes") + '</h4><div class="widget_content" style="display: block;"><table width="100%"><tbody><tr><td id="village_note"></td></tr><tr><td><a id="edit_notes_link" href="javascript:void(0);">» Editar</a></td></tr></tbody></table></div></div>';
			$("#show_summary").after(html);
			Quasar.overview.UI.load_notes();
			$("#show_notes").show(1000);
			$("#edit_notes_link").on("click", function () {
				Quasar.overview.UI.edit_notes($("#village_note"), Quasar.lang.get("village_notes"));
			});
		},
		load_notes : function () {
			var notes = new QJSON("notes", true);
			var vid = game_data.village.id;
			var content = (notes.get(vid) !== null ? notes.get(vid) : "");
			$("#village_note").html(content);
		},
		edit_notes : function (element, title) {
			var notes = new QJSON("notes", true);
			var vid = game_data.village.id;
			var content = (notes.get(vid) !== null ? notes.get(vid).replace(/<br>/g, '\n') : "");
			title = Quasar.lang.get("village_notes");
			var html = '<div><textarea id="message" name="note" rows="10" cols="40">' + content + '</textarea></div><div><input type="button" id="ok_note" value="OK" class="btn"></div>';
			var onDraw = function () {
				$('#ok_note').on('click', function () {
					var note = $('#message').val().replace(/\n/g, '<br>');
					var notes = new QJSON("notes", true);
					notes.set(game_data.village.id, note);
					Quasar.core.set("notes", notes);
					Quasar.overview.UI.load_notes();
				});
			};
			Quasar.interface.menu.popupBox(title, html, 400, null, onDraw);
		}
	}
};

Quasar.overview_villages = {
	init : function () {
		this.saveVillages();
	},
	saveVillages : function () {
		var villages = new QJSON("villages", true);
		$("#production_table .row_a, #production_table .row_b").each(function () {
			var span = $(this).find("td:eq(0) span a span");
			var coord = span.text().split("(")[1].split(")")[0];
			var id = span.attr("id").replace("label_text_", "");
			villages.set(coord, id);
		});
		Quasar.core.set("villages", villages.toJSON());
	},
	changeName : function (village, newName) {
		$.post("?village=" + village + "&action=change_name&h=ddbf&screen=main", {
			name : newName
		}, function (data) {
			console.log("FUN");
		});
	}
};

/*
 * Classe responsavel por enviar ataques usando o metodo post da praça de reunião
 */
Quasar.farm_post = {
	can : true,
	init : function () {
		if (!Quasar.farm_post.getStatus()) {
			return false;
		}
		$(".troop_template_selector").each(function () {
			$(this).click();
			if (Quasar.farm_post.canAttack()) {
				return Quasar.farm_post.doAttack();
			}
		});
		Quasar.utils.setReload("&screen=place");
		return false;
	},
	canAttack : function () {
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);
		if (coords.length < 1)
			return false;
		if (template === 0) {
			return false;
		}
		$("input[class='unitsInput']").each(function () {
			var value = $(this).val();
			var qtd = $(this).parent().find("a").text();
			qtd = qtd.replaces("(", "");
			qtd = qtd.replaces(")", "");
			qtd = Number(qtd);
			if (value === null || value === "") {
				return;
			}
			if (qtd < value) {
				Quasar.farm_post.can = false;
			}
		});
		return Quasar.farm_post.can;
	},
	cleanInputs : function () {
		$("input[class='unitsInput']").each(function () {
			var value = Number($(this).val());
			var qtd = $(this).parent().find("a:eq(1)").text();
			qtd = qtd.replaces("(", "");
			qtd = qtd.replaces(")", "");
			qtd = Number(qtd);
			if (value === null || value === "" || value === 0)
				return;
			if (qtd < value) {
				return;
			}
			$(this).parent().find("a:eq(1)").text("(" + (qtd - value) + ")");
		});
	},
	doAttack : function () {
		var index = Quasar.core.get("index_" + game_data.village.id, 0) + 1;
		var coords = Quasar.core.get("coords_" + game_data.village.id, []);
		if (coords.length < 1)
			return false;
		if (index > coords.length - 1) {
			var stop = Quasar.core.get("stop_end_farm", false);
			if (stop) {
				return;
			} else {
				index = 0;
			}
		}
		Quasar.core.set("index_" + game_data.village.id, index);
		Quasar.farm.addAttack();
		$("#current").text(index);
		var id = game_data.village.id;
		var data = {
			x : x,
			y : y,
			attack : true
		};
		for (var unit in Quasar.game.units) {
			var inputed = Number($("#unit_input_" + unit).val());
			data[unit] = inputed;
		}
		Quasar.farm_post.cleanInputs();
		$.ajax({
			url : "?village=" + id + "&try=confirm&screen=place",
			type : "post",
			data : data,
			success : function (html) {
				if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
					Quasar.farm_post.can = false;
					return false;
				}
				var form = $('form', html);
				$.post(form[0].action, form.serialize(), function (html2) {
					if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
						Quasar.farm_post.can = false;
						return false;
					}
				});
			}
		});
		return true;
	},
	getStatus : function () {
		return Quasar.core.get("auto_farm_post", false);
	},
	setStatus : function (status) {
		Quasar.core.set("auto_farm_post", status);
		if (status) {
			Quasar.farm.setStatus(false);
			$("#auto_farm").removeClass("active");
		}
	}
};

String.prototype.replaces = function (a, b) {
	return this.replace(a, b);
};
String.prototype.replaceAll = function (de, para) {
	var str = this;
	var pos = str.indexOf(de);
	while (pos > -1) {
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
	return (str);
};
String.prototype.contains = function (a) {
	if (this.indexOf(a) > -1)
		return true;
	else
		return false;
};
(function() {

	Quasar = {
		config: {
			version: "2.0.017",
			name: "Quasar",
			author: "Wesley Nascimento",
			contributors: [],

			/* Metodos de armazenamento */
			get: function(chave, def) {
				var data = new QJSON(game_data.player.name);
				return data.get(chave) === null ? def : data.get(chave);
			},
			set: function(chave, value) {
				var data = new QJSON(game_data.player.name);
				data.set(chave, value);
				data.save();
			}
		},

		/*
		 * Objeto de interface
		 * Responsavel pelo menu principal e todas as funções que alteram o HTML ou CSS do jogo
		 */
		interface : {
			menu : {
				$buttons: null,
				$infos: null,
				$menu: null,
				$countDown: $("#countDown"),
				ticker: [],
				init: function() {
					if (!premium) {
						Quasar.interface.menu.premiumChanges();
					}
					if ($("#quasar_menu").length > 0) {
						$("#quasar_menu").remove();
					}
					$('body').append('<section id="quasar_menu" class="quasar" style="display:none;"></section>');
					this.$menu = $("#quasar_menu");
					this.addHTML('<div id="quasarTitle" class="title">' + Quasar.config.name + '</br>v' + Quasar.config.version + '</div>');
					this.addHTML('<div id="quasarCount" class="section"><div id="countDown" class="timer" style="color: #9E0000; font-weight: 700; text-align: center; font-size: 14px;">00:00:00</div></div>');
					this.addHTML('<div id="quasarButtons" class="section"></div>');
					this.addHTML('<div id="quasarInfo" class="section"></div>');
					this.addHTML('<div id="quasarSlide" class="slider">&raquo;</div>');

					//Seleciona os elementos e armazena na cache
					this.$buttons = $("#quasarButtons");
					this.$infos = $("#quasarInfo");
					this.$countDown = $("#countDown");

					//Adiciona os botoes ao menu
					this.addButton(Quasar.lang.get("auto_farm"), "auto_farm", Quasar.farm.getStatus, Quasar.farm.setStatus);
					this.addButton(Quasar.lang.get("auto_farm_post"), "auto_farm_post", Quasar.farm_post.getStatus, Quasar.farm_post.setStatus);
					this.addButton(Quasar.lang.get("wall_drop"), "wall_drop", Quasar.wall.getStatus, Quasar.wall.setStatus);
					this.addButton(Quasar.lang.get("auto_recruit"), "auto_recuit", Quasar.train.getStatus, Quasar.train.setStatus);
					this.addButton(Quasar.lang.get("auto_build"), "auto_build", Quasar.main.getStatus, Quasar.main.setStatus);
					this.addButton(Quasar.lang.get("am_farm"), "am_farm", Quasar.am_farm.getStatus, Quasar.am_farm.setStatus);
					this.addButton(Quasar.lang.get("dodge"), "dodge", Quasar.dodge.getStatus, Quasar.dodge.setStatus);
					this.addButton(Quasar.lang.get("anti_afk"), "anti_afk", Quasar.nucleo.getAFK, null);

					this.addActionButton(Quasar.lang.get("import_export"), "import", function() {
						var html = "";
						html += "Used to export and import your Data Storage.";
						html += '<input type="text" value="" id="import_val" placeholder="Paste your game data here" size="20"><input type="button" value="Import" id="btn_import">';
						html += '<input type="text" value="" id="export_val" placeholder="Click on export button" size="20"><input type="button" value="Export" id="btn_export">';
						var onDraw = function() {
							$("#btn_import").on("click", function() {
								var data = $("#import_val").val();
								if (data !== "") {
									Quasar.nucleo.importData(data);
								}
							});
							$("#btn_export").on("click", function() {
								var data = Quasar.nucleo.exportData();
								$("#export_val").val(data);
								$("#export_val").focus();
								$("#export_val").select();
							});
						};
						Quasar.interface.menu.popupBox(Quasar.lang.get("import_export"), html, 400, null, onDraw);
					});

					this.addActionButton(Quasar.lang.get("configuration"), "config", function() {
						var onDraw = Quasar.interface.menu.configDraw;
						var html = Quasar.interface.menu.configHtml();
						Quasar.interface.menu.popupBox(Quasar.lang.get("configuration"), html, 400, null, onDraw);
					});

					this.addInformation("Ping", "ping", function( ) {
						$("#ping").text(Number(Loader.timeEnd - Loader.timeStart) + "ms");
					});

					this.addInformation(Quasar.lang.get("attacks_today"), "attackcount", function() {
						var qjson = new QJSON("attacks", true);
						var date = $("#serverDate").text();
						if ( !qjson.contains(date) ) {
							qjson.add(date, 0);
							Quasar.config.set("attacks", qjson.toJSON());
						}
						var n = qjson.get(date);
						console.log( n );
						$("#attackcount").text(n);
					}, function() {
						var title = Quasar.lang.get("attacks_today");
						var html = "";
						html += '<table class="vis nowrap tall" style="width: 100%"><tbody><tr><th>Date</th><th>Attacks</th></tr>';
						var attacks = new QJSON("attacks", true);
						for (var chave in attacks.cache) {
							html += '<tr><td>' + chave + '</td><td>' + attacks.get(chave) + '</td></tr>';
						}
						html += '</tbody></table>';
						Quasar.interface.menu.popupBox(title, html, 400, null, null);
					});

					var slider = Quasar.config.get('slider', true);

					this.showHideMenu(slider);

					$("#quasarSlide").on('click', function() {
						var slider = Quasar.config.get('slider', true);
						Quasar.config.set('slider', !slider);
						Quasar.interface.menu.showHideMenu(!slider);
					});

					$("#quasarLoading").fadeOut("slow");

					$("#quasar_menu").show();

					this.tick();
				},
				//Adiciona um HTML ao menu
				addHTML: function(html) {
					this.$menu.append(html);
				},
				//Adiciona um Botão ao menu
				addButton: function(text, id, getStatus, setStatus) {
					this.$buttons.append('<div id="' + id + '" class="button">' + text + '</div>');
					var element = $("#" + id);
					var change = function() {
						if (getStatus()) {
							element.addClass("active");
						} else {
							element.removeClass("active");
						}
					};
					element.on('click', function() {
						var status = getStatus();
						setStatus(!status);
						change();
					});
					change();
				},
				//Adiciona um botão de ação ao menu
				addActionButton: function(text, id, action) {
					this.$buttons.append('<div id="' + id + '" class="button action">' + text + '</div>');
					var element = $("#" + id);
					element.on('click', action);
				},
				//Adiciona um texto de informação ao menu
				//As informaçoes podem ser tickaveis, ou seja, se atualizam
				addInformation: function(title, id, onTick, onClick) {
					if (typeof onClick == "undefined") {
						this.$infos.append('<div><b>' + title + '</b>: <span id="' + id + '"></span></div>');
					} else {
						this.$infos.append('<div><b>' + title + '</b>: <span id="' + id + '" style="font-weight: 700;color: #603000;"></span></div>');
						$("#" + id).on("click", onClick);
					}
					
					if (typeof onTick !== "undefined") {
						this.ticker.push(onTick);
					}
				},
				//Decrementa do contador regressivo e executa o callback
				countDown: function(time, callback) {
					if (time < 0) {
						callback();
						return;
					}
					this.$countDown.text(Quasar.utils.secToString(time));
					setTimeout(function() {
						Quasar.interface.menu.countDown(--time, callback);
					}, 1000);
				},
				//Cria um popup
				popupBox: function(title, html, width, height, callback) {
					var preele = $("#quasar_popup");
					//Se já existem um pop up,
					//Remove executa uma animação do antigo saindo e o novo aparecendo
					if (preele.length > 0) {
						preele.fadeTo(500, 0, function() {
							preele.remove();
							Quasar.interface.menu.popupBox(title, html, width, height, callback);
						});
						return;
					}

					$('body').append('<div id="quasar_popup" class="popup_style ui-draggable" style="position: fixed;"></div>');

					var $ele = $("#quasar_popup");

					$ele.append('<div class="popup_menu"><span style="float: left;">' + title + '</span><a href="javascript:void(0);" id="closePop">x</a></div>');
					$("#closePop").on("click", Quasar.interface.menu.closePop);

					$ele.draggable();
					$ele.append('<div class="popup_content">' + html + '</div>');

					//Realiza os ajustes de posição e tamanho
					if (width !== null) {
						$ele.css('width', width);
					} else {
						$ele.css('width', 'auto');
					}

					if (height !== null) {
						$ele.css('height', height);
					} else {
						$ele.css('height', 'auto');
					}

					//Centraliza o elemento
					var left = (window.innerWidth / 2) - (width / 2);
					var top = (window.innerHeight / 2) - (parseInt( $ele.css("height")) / 2);

					$ele.css('left', left);
					$ele.css('top', top > 10 ? top : 10);

					if (callback !== null) {
						callback();
					}
					$ele.fadeTo(500, 1);
				},
				closePop: function() {
					var $ele = $("#quasar_popup");

					$ele.fadeTo(500, 0, function() {
						$ele.remove();
					});
				},
				//Mostra ou esconde o menu
				showHideMenu: function(show) {
					var element = $("#quasar_menu");
					var slider = $("#quasarSlide");
					if (show) {
						element.animate({
							left: "0px"
						}, 500);
					} else {
						element.animate({
							left: "-143px"
						}, 500);
					}
				},
				tick: function() {
					//Async loop
					setTimeout(function() {
						Quasar.interface.menu.tick();
					}, 1000);
					for (var i = 0; i < this.ticker.length; i++) {
						this.ticker[i]();
					}
				},
				premiumChanges: function() {
					var screen = game_data.screen;
					var nVillId = Quasar.utils.getNextVillage();
					var pVillId = Quasar.utils.getPrevVillage();
					$("#menu_row2").prepend('<td class="box-item icon-box separate arrowCell" style="display:none;"><a id="village_switch_left" class="village_switch_link" href="?village=' + pVillId + '&screen=' + screen + '" accesskey="a"><span class="arrowLeft"> </span></a></td><td class="box-item icon-box arrowCell" style="display:none;"><a id="village_switch_right" class="village_switch_link" href="?village=' + nVillId + '&screen=' + screen + '" accesskey="d"><span class="arrowRight"> </span></a></td>');
					$(".box-item").show(1000);
				},
				configDraw: function() {
					$("#langSelect").val(Quasar.config.get("language", "en"));
					$("#save").on("click", function() {
						Quasar.config.set("language", $("#langSelect").val());
						Quasar.config.set("min_rand", $("#min_rand").val());
						Quasar.config.set("max_rand", $("#max_rand").val());
						Quasar.config.set("max_recruit_time", $("#max_recruit_time").val());

						var limit = (premium ? 5 : 2);
						if (Number($("#max_build_queue").val()) <= limit) {
							Quasar.config.set("max_build_queue", $("#max_build_queue").val());
						}

						Quasar.config.set("am_is_by_ratio", $("#am_is_by_ratio").is(":checked"));
						Quasar.config.set("attack_control", $("#attack_control").is(":checked"));
						Quasar.config.set("am_dis_ratio", $("#am_dis_ratio").val());
						Quasar.config.set("max_am_dis", $("#max_am_dis").val());
						Quasar.config.set("max_am_attacks", $("#max_am_attacks").val());
						Quasar.config.set("blue_reports", $("#blue_reports").is(":checked"));
						Quasar.config.set("yellow_reports", $("#yellow_reports").is(":checked"));
						Quasar.config.set("use_c_am", $("#use_c_am").is(":checked"));
						Quasar.config.set("stop_end_farm", $("#stop_end_farm").is(":checked"));
						Quasar.config.set("max_am_wall", $("#max_am_wall").val());
						Quasar.config.set("wall_drop_spy", $("#wall_drop_spy").val());
						Quasar.config.set("wall_drop_ram", $("#wall_drop_ram").val());
						Quasar.config.set("wall_drop_axe", $("#wall_drop_axe").val());

						var dodge = $("#dodge_target").val();
						Quasar.config.set("dodge_target", dodge !== "" ? dodge : null);
						
						UI.SuccessMessage("Suas configurações foram salvas!");
					});
				},
				configHtml: function() {
					var html = "";
					html += '<div id="tab-general">';
					html += "<div><strong>Linguagem</strong></br>";
					html +="<select style='width: 200px' id='langSelect'>";
					for (var i in Quasar.lang) {
						if (typeof Quasar.lang[i].language !== "undefined") {
							html += "<option value='" + i + "'>" + Quasar.lang[i].language + "</option>";
						}
					}
					html += "</select></div>";
					
					html += '<table class="vis" style="width:100%"><tbody>';
					html += '<tr><th>Descrição</th><th>Valor</th></tr>';
					html += '<tr><td colspan="2"><strong>Temporalizadores</strong></td></tr>';
					html += '<tr><td>Tempo minimo para operaçoes aleatorias: </td><td><input type="text" id="min_rand" size="2" value="' + Quasar.config.get("min_rand", 300) + '"/>seconds</td></tr>';
					html += '<tr><td>Tempo maximo para operações aleatorias: </td><td><input type="text" id="max_rand" size="2" value="' + Quasar.config.get("max_rand", 900) + '"/>seconds</td></tr>';
					html += '<tr><td>Tempo maximo de recrutamento: </td><td><input type="text" id="max_recruit_time" size="2" value="' + Quasar.config.get("max_recruit_time", 8) + '"/> hours</td></tr>';
					html += '<tr><td>Quantidade maxima de edificios na fila: </td><td><input type="text" id="max_build_queue" size="2" value="' + Quasar.config.get("max_build_queue", (premium ? 5 : 2)) + '"/></td></tr>';
					html += '<tr><td>Parar de farmar ao chegar no fim da lista: </td><td><input type="checkbox" id="stop_end_farm" ' + (Quasar.config.get("stop_end_farm", false) ? "checked" : "") + '/></td></tr>';
					
					html += '<tr><td colspan="2"><strong>Assistente de Saque</strong></td></tr>';
					html += '<tr><td><span title="Limita a distancia maxima a enviar um ataque.">Distancia de ataques maxima:</span></td><td><input type="text" id="max_am_dis" size="2" value="' + Quasar.config.get("max_am_dis", 20) + '"/>campos</td></tr>';
					html += '<tr><td><span title="Limita a quantidade de ataques que podem ser enviados a uma aldeia baseando-se na distancia.">Usar sistema de razão?</span></td><td><input type="checkbox" id="am_is_by_ratio" ' + (Quasar.config.get("am_is_by_ratio", false) ? "checked" : "") + '/></td></tr>';
					html += '<tr><td><span title="Quantidade de ataque para cada campo de distancia. Se configurado como 1, vai enviar 1 ataque para cada campo entre o alvo e a aldeia atual. (precisa que \"Usar sistema de razão\" esteja ativo)">Ataque por campo: </span></td><td><input type="text" id="am_dis_ratio" size="2" value="' + Quasar.config.get("am_dis_ratio", 1) + '"/>(Ex: 0.2)</td></tr>';
					html += '<tr><td><span title="O controlador de ataques prioriza atacar aldeias que tenham menos ataques a caminho, isso previne que as primeiras aldeias da pagina tenham muitos ataques enquanto outras da mesma pagina não tenhão nenhum.">Usar controlador de ataques? </span></td><td><input type="checkbox" id="attack_control" ' + (Quasar.config.get("attack_control", true) ? "checked" : "") + '/></td></tr>';
					html += '<tr><td><span title="Configura uma quantidade maxima de ataques a uma aldeia. (Funciona somente se \"Usar sistema de razão\" estiver desabilitado.)">Quantidade maxima de ataques: </span></td><td><input type="text" id="max_am_attacks" size="2" value="' + Quasar.config.get("max_am_attacks", 2) + '"/></td></tr>';
					html += '<tr><td><span title="Configura o nivel maximo de muralha permitido para um ataque.">Nivel maximo de muralha:</span></td><td><input type="text" id="max_am_wall" size="2" value="' + Quasar.config.get("max_am_wall", 3) + '"/></td></tr>';
					html += '<tr><td><span title="Permite atacar aldeias cujo o ultimo relatorio foi azuis.">Atacar relatorios azuis?: </span></td><td><input type="checkbox" id="blue_reports" ' + (Quasar.config.get("blue_reports", false) ? "checked" : "") + '/></td></tr>';
					html += '<tr><td><span title="Move os relatorios amarelho para o derrubador de muralha.">Mover relatorios amarelho?</span></td><td><input type="checkbox" id="yellow_reports" ' + (Quasar.config.get("yellow_reports", true) ? "checked" : "") + '/></td></tr>';
					html += '<tr><td><span title="Enviar ataque usando o templace C (Somente se a soma dos recursos for maior que 1000)">Usar o templace C?:</span></td><td><input type="checkbox" id="use_c_am" ' + (Quasar.config.get("use_c_am", true) ? "checked" : "") + '/></td></tr>';
					
					html += '<tr><td colspan="2"><strong>Configurações do Derrubador de Muralhas</strong></td></tr>';
					html += '<tr><td><span title="Quantidade de exploradores a enviar">Exploradores:</span></td><td><input type="text" id="wall_drop_spy" size="2" value="' + Quasar.config.get("wall_drop_spy", 1) + '"/></td></tr>';
					html += '<tr><td><span title="Quantidade de Arietes a enviar">Arietes:</span></td><td><input type="text" id="wall_drop_ram" size="2" value="' + Quasar.config.get("wall_drop_ram", 15) + '"/></td></tr>';
					html += '<tr><td><span title="Quantidade de Barbaros a enviar">Barbaros:</span></td><td><input type="text" id="wall_drop_axe" size="2" value="' + Quasar.config.get("wall_drop_axe", 30) + '"/></td></tr>';
					
					html += '<tr><td colspan="2"><strong>Outras</strong></td></tr>';
					html += '<tr><td>Alvo para dodge: </td><td><input type="text" id="dodge_target" size="3" value="' + Quasar.config.get("dodge_target", "") + '"/></td></tr>';
					
					html += '</tbody></table>';
					html += '<div>';
					html += '<input type="button" id="save" value="Salvar"/>';
					html += '</div>';
					return html;
				}
			},
			/*
			 * Cria a interface interna da Praça de Reunioes
			 */
			praca: function() {
				tickTimer = Quasar.utils.tickTimer;

				var $main_table = $('<table class="content-border vis nowrap tall" width="100%" id="build_script" style="opacity:0">' + '<tr><th style="width: 66%">' + Quasar.lang.get("villages") + ' <a id="ordenar">' + Quasar.lang.get("order") + '</a> - <a id="limpar">' + Quasar.lang.get("clean") + '</a></th></tr>' + '<tr><td><input type="text" id="coords" name="name" value="" style="width: 90%;" placeholder="Paste your farm coords here (e.g. 666|666 666|666)">(<span id="current">0</span>/<span id="number">0</span>)</td></tr>' + '<tr><td><input type="text" id="wall_coords" name="name" value="" style="width: 90%;" placeholder="Paste wall-drop coords here (e.g. 666|666 666|666)">(<span id="wall_number">0</span>)</td></tr>' + '</table></br>');
				$("#contentContainer").before($main_table);

				var $coords = $("#coords");
				var $number = $("#number");
				var $wallcoords = $("#wall_coords");
				var $wallnumber = $("#wall_number");
				var current = Quasar.config.get("index_" + game_data.village.id, 0);

				$("#current").text(current);
				var coords = Quasar.config.get("coords_" + game_data.village.id, []);

				$coords.val(coords.join(" "));

				$number.text(coords.length);
				$coords.on('change', function() {
					var coords = ele_coords.val().split(" ");
					$number.text(coords.length);
					Quasar.config.set("coords_" + game_data.village.id, coords);
				});
				var wall_coords = Quasar.config.get("wall_coords", []);
				$wallcoords.val(wall_coords.join(' '));

				$wallnumber.text(wall_coords.length);

				$wallcoords.on('change', function() {
					var coords = $wallcoords.val().split(" ");
					$wallnumber.text(coords.length);
					Quasar.config.set("wall_coords", coords);
				});

				$("#ordenar").on('click', function() {
					var mycoord = game_data.village.coord;
					var order = Quasar.utils.orderByDis(mycoord, $coords.val());
					$coords.val(order.join(" "));
					$number.text(order.length);
					Quasar.config.set("coords_" + game_data.village.id, order);
				});

				$("#limpar").on('click', function() {
					var clean = Quasar.utils.clean($coords.val());
					$coords.val(clean.join(" "));
					$number.text(clean.length);
					Quasar.config.set("coords_" + game_data.village.id, clean);
				});

				$("#btnOptions").on('click', function() {
					var title = Quasar.lang.get("option") + " - " + Quasar.lang.get("break_Wall");
					var html = '';
					Quasar.interface.menu.popupBox(title, html, 600, null, null);
				});

				$("#build_script").fadeTo(1000, 1);
			}
		},
		/*
		 * Nucleo do Quasar
		 * Inicia o objeto e toma as decisoes mais complexas
		 */
		nucleo: {
			/*
			 * Iniciador do nucleo, chamado quando a DOM esta pronta
			 */
			init: function() {
				//Inicia a linguagem
				Quasar.lang.init();

				//Se for o primeiro uso
				if (Quasar.config.get("last_version_used", null) === null) {					
						var html = "";
						html += "<span style='size: 16px; font-weight: bold'>Sobre o Quasar.</span></br>";
						html += "Quasar é formado por um conjunto de ferramentas, cujo o intuito é fazer com que seja mais pratico jogar TribalWars.</br>";
						html += "Algumas dessas ferramentas são ilegais segundo as regras do jogo, esteja ciente que o mal uso ou uso excessivo pode causar o banimento de sua conta.</br>";
						html += "Quasar tem sido desenvolvido por <strong>Wesley Nascimento</strong> desde Novembro de 2013. E vem sido distribuido dentro da licensa Creative Commons.</br>";
					
						html += "<br><strong style='size: 16px; font-weight: bold'>Termos de uso e Politica de privacidade</strong></br>";
						html += "<ul>";
						html += "<li>O author não se resposabiliza por punições ou banimentos.</li>";
						html += "<li>Quasar envia informaçoes anonimas sobre seu uso para um servidor externo.</li>";
						html += "<li>O author não garante suporte ao projeto a longo prazo.</li>";
						html += "<li>O author se reserva ao direito de mudar esses termos a qualquer momento sem aviso previo ou posterior.</li>";
						html += "<li>Quasar armazena informações e configurações em seu navegador.</li>";
						html += "</ul>";
						html += "<span style='color:#c00; font-weight: bold'>Ao usar o Quasar você automaticamente está ciente e concorda com todos os termos listados acima.</span></br>";
					
						html += "<br><span style='size: 16px; font-weight: bold'>Terminando a instalação</span></br>";
						html += "Para que você possa executar o Quasar sem problemas ou conflitos é preciso que ele obtenha algumas informações da sua conta.</br>";
						html += "<ul>";
						html += "<li>Quantidade de aldeias.</li>";
						html += "<li>Identificação das aldeias.</li>";
						html += "<li>Se possui conta premium.</li>";
						html += "<li>Se possui assistente de saques.</li>";
						html += "<li>Quantidade de ataques chegando.</li>";
						html += "<li>Se está em modo de ferias.</li>";
						html += "<li>Se está como sitter.</li>";
						html += "</ul>";
						html += "<br>Essas informações serão obtidas automaticamente ao clicar no botão abaixo. Atenção você será redirecionado para outra pagina.</br>";
						html += "<center><a href='#' id='btn_first_use' class='evt-confirm btn'>Configurar</a></center></br>";
					
						html += '<center><a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Licença Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Quasar</span> de <a xmlns:cc="http://creativecommons.org/ns#" href="wesleynascimento.com/quasar" property="cc:attributionName" rel="cc:attributionURL">wesleynascimento.com/quasar</a> está licenciado com uma Licença <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons - Atribuição-NãoComercial 4.0 Internacional</a>.</center>';
					
					var callback = function(){
						$("#btn_first_use").on("click", function(){
							if (game_data.player.sitter === 0) {
								location.href = "?village=" + game_data.village.id + "&screen=overview_villages";
							} else {
								var sitter = location.href.match(/t=\d+/i);
								location.href = "?village=" + game_data.village.id + "&screen=overview_villages&" + sitter;
							}
							Quasar.config.set("last_version_used", Quasar.config.version);
						});	
					};
					Quasar.interface.menu.popupBox("Bem vindo ao Quasar!", html, 600, null, callback);
				}
				//Se não for o primeiro uso, mas se for uma versão mais recente
				else if (Quasar.config.get("last_version_used", "") !== Quasar.config.version) {
					Quasar.config.set("last_version_used", Quasar.config.version);
				}
				//Atualiza esta aldeia a lista de aldeias
				else {
					var v = new QJSON("villages", true);
					var coord = game_data.village.coord;
					if (!v.contains(coord)) {
						v.set(coord, game_data.village.id);
						Quasar.config.set("villages", v.toJSON());
					}
				}

				var url = location.href; //URL atual

				//Incrementa a contagem de execuçoes
				Quasar.config.set('total_execucoes', Quasar.config.get('total_execucoes', 0) + 1);

				//Se estiver com o CAPTCHA do jogo na tela, nao faz nada.
				if ($("#bot_check_image").length > 0) {
					return;
				}

				//Pega um numero aleatorio, e se for igual a 10 abre uma pagina aleatoria
				if (Quasar.utils.random(0, 10) == 10) {
					Quasar.nucleo.abrirPaginaAleatoria();
				}

				//Decide qual Objeto irá abrir dependendo da tela que está aberta.
				switch (game_data.screen) {
					//Caso esteja a praça
					case 'place':
						//Se tiver a opção de confirmar envio. Então confirma
						if ($("#troop_confirm_go").length > 0) {
							Quasar.farm.doConfirm();
						}
						//Se tiver um alvo, não faz nada
						else if (location.href.indexOf("target") > 0) {

						}
						//Se o modo estiver vazio ou estiver como "command"
						else if (game_data.mode === null || game_data.mode == "command") {

							//Se não for premium, atualiza a lista de ataques e retornos	
							if (game_data.premium) {
								Quasar.map.updateAR();
							}
							//Toma decisoes conforme a prioridade
							if (Quasar.config.get("before_dodge_page", null) !== null) {
								Quasar.config.set("before_dodge_page", null);
							}
							//Se o farm retornar true, não executa as outras funcoes
							else if ( Quasar.farm.init() ) {

							}
							//Se wall retornar true, não executa as outras funcoes
							else if ( Quasar.wall.init() ) {

							}
							//Se chegar até aqui, tenta farmar usando o methodo de POST
							else {
								Quasar.farm_post.init();
							}
							//Inicia a interface da praça depois de todas as funcoes pra ganhar desempenho
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
							var last_page = Quasar.config.get("before_identify_page", null);
							if (last_page !== null) {
								Quasar.config.set("before_identify_page", null);
								location.href = last_page;
							}
						}
						break;
					case 'report':
						if (url.contains("&view=")) {
							Quasar.report.view();
						}
						break;
					default:
						break;
				}
				//Inicia a interface ao final para prover um melhor desempenho
				Quasar.interface.menu.init();
			},
			getAFK: function() {
				return Quasar.config.get('anti_afk', true);
			},
			setAFK: function(status) {
				Quasar.config.set('anti_afk', status);
			},
			abrirPaginaAleatoria: function() {
				var status = this.getAFK();
				Quasar.config.set('count', 0);
				if (!status)
					return;
				var base = '?village=' + game_data.village.id + '&screen=';
				var pages = ['forum', 'ally', 'ranking', 'ranking&mode=con_player', 'market', 'smith', 
							 'statue', 'farm', 'barracks', 'stable', 'garage', 'storage', 'hide', 'wall'];
				var index = Quasar.utils.random(0, pages.length - 1);
				var page = pages[index];
				$.get(base + page, function(html) {});
			},
			importData: function(data) {
				localStorage.setItem(game_data.player.name, data);
				Loader.goTo();
			},
			exportData: function() {
				return localStorage.getItem(game_data.player.name);
			}
		},
		main : {
			niveis: {},
			init: function() {
				this.UI.init();
				var get = Quasar.game.builds;
				this.load();

				var update_all = BuildingMain.update_all;
				BuildingMain.update_all = function(data) {
					update_all(data);
					Quasar.UI.init();
				};

				if (this.getStatus()) {
					this.build();
				}
				Quasar.utils.setReload("&screen=main");
			},
			build: function() {
				var queue = Quasar.config.get("queue_" + game_data.village.id, []);

				if (queue.length > 0) {
					var building = queue[0];
					if ($("#main_buildlink_" + building).is(':visible') && BuildingMain.order_count < this.getMax()) {
						queue.shift();
						Quasar.config.set("queue_" + game_data.village.id, queue);
						this.load();
						BuildingMain.build(building);

						setTimeout(Quasar.build, 1000);
					}
					/*
					var secs = Quasar.utils.stringToSec($("#countDown").text());
					if (secs <= 0) {
						Quasar.utils.setReload("&screen=main");
					}
					*/
				}
			},
			getMax: function() {
				if (typeof premium === "undefined" || premium === false) {
					return 2;
				} else {
					return Number(Quasar.config.get("max_build_queue", 5));
				}
			},
			getCurrentNivel: function(name) {
				var bq = $("#buildqueue .buildorder_" + name);
				if (bq.length > 0) {
					return Number(bq.last().find("td:eq(0)").text().match(/\d+/g)[0]);
				}
				var text = $("#main_buildrow_" + name).find("span:eq(0)").text().match(/\d+/g);
				if (text !== null) {
					return Number(text[0]);
				} else {
					return 0;
				}
			},
			getStatus: function() {
				return Quasar.config.get("auto_build", false);
			},
			setStatus: function(status) {
				Quasar.config.set("auto_build", status);
			},
			load: function() {
				var queue = Quasar.config.get("queue_" + game_data.village.id, []);
				this.niveis = {};
				var $sortable = $("#sortable-list");
				$sortable.html("");
				$sortable.append('<tr><th style="width: 23%">' + Quasar.lang.get("build_queue") + '</th><th>' + Quasar.lang.get("build_level") + '</th><th>' + Quasar.lang.get("price") + '</th><th width="54px"></th></tr>');

				$("#main_order").html("");
				$("#number").text(queue.length);
				var nivel;
				var build;
				for (var i = 0; i < queue.length; i++) {
					build = queue[i];
					if (typeof this.niveis[build] !== "undefined") {
						nivel = this.niveis[build] + 1;
					} else {
						nivel = this.getCurrentNivel(build) + 1;
					}
					this.niveis[build] = nivel;
					this.UI.addToList(build, nivel, i);
				}
				Quasar.main.UI.makeSortable();
			},
			UI: {
				init: function() {
					tickTimer = Quasar.utils.tickTimer;
					var bs = $("#build_script");
					if (bs.length > 0) {
						bs.remove();
						$("#img_addBuild").remove();
					}
					var first = true;
					$("#buildings tr").each(function() {
						var ele_this = $(this);
						if (first || ele_this.find("td:eq(1) .inactive").length > 0) {
							ele_this.append("<td></td>");
							first = false;
							return;
						}
						var edificil = ele_this.attr("id");
						ele_this.append("<td id='img_addBuild'><img class='build_cancel' data-ed='" + edificil + "' title='" + Quasar.lang.get('add_icon_title') + "' src='/graphic/overview/build.png'></img></td>");
					});

					var $main_table = $('<table id="build_script" style="opacity:0" class="content-border vis nowrap tall" width="100%"><tr><th style="width: 66%">' + Quasar.lang.get("builds") + '(<span id="number"></span>) <a id="mostrar">' + Quasar.lang.get("show_link") + '</a></th></tr><tr><td id="main_order"></td></tr></table>' +
						'<table id="sortable-list" class="content-border vis nowrap tall" width="100%" style="display:none; margin-top: 10px"></table><br>');
					$("#contentContainer").before($main_table);

					$("#mostrar").on('click', function() {
						var sortable = $("#sortable-list");
						var ele_this = $(this);
						if (ele_this.text() == Quasar.lang.get("show_link")) {
							sortable.show(1000);
							ele_this.text(Quasar.lang.get("hide_link"));
						} else {
							sortable.hide(1000);
							ele_this.text(Quasar.lang.get("show_link"));
						}
					});
					$("#build_script").fadeTo(1000, 1);
					$("img.build_cancel").on('click', function() {
						var queue = Quasar.config.get("queue_" + game_data.village.id, []);
						var ed = $(this).attr("data-ed").replace("main_buildrow_", "");
						var nivel;
						if (typeof Quasar.main.niveis[ed] !== "undefined") {
							nivel = Quasar.main.niveis[ed] + 1;
						} else {
							nivel = Quasar.main.getCurrentNivel(ed) + 1;
						}
						Quasar.main.niveis[ed] = nivel;
						if (nivel > Quasar.game.builds[ed].max) {
							return;
						}
						queue.push(ed);
						Quasar.config.set("queue_" + game_data.village.id, queue);
						Quasar.main.load();
						var secs = Quasar.utils.stringToSec($("#countDown").text());
						if (secs <= 0) {
							Quasar.utils.setReload("&screen=main");
						}
					});
				},
				makeSortable: function() {
						placeholder : "ui_active",
					$("#sortable-list tbody").sortable({
						forcePlaceholderSize : true,
						cursor : "move",
						revert : true,
						tolerance : "pointer",
						stop: function(event, ui) {
							var sorted = $(this).sortable("toArray");
							sorted.shift();
							Quasar.config.set("queue_" + game_data.village.id, sorted);
							Quasar.main.load();
						}
					}).disableSelection();
				},
				addToList: function(edificil, nivel, index) {
					var g = Quasar.game.builds[edificil];
					var ed = g.name,
						wood = parseInt(g.wood * Math.pow(g.fwood, (nivel - 1))),
						stone = parseInt(g.stone * Math.pow(g.fstone, (nivel - 1))),
						iron = parseInt(g.iron * Math.pow(g.firon, (nivel - 1))),
						pop = parseInt(g.pop * Math.pow(g.fpop, (nivel - 1))) - parseInt(g.pop * Math.pow(g.fpop, (nivel - 2)));

					$("#sortable-list").append("<tr id='" + edificil + "' class='sortable_row'><td><a href='?village=43158&screen=" + edificil + "'><img src='graphic/buildings/mid/" + edificil + "1.png' title='" + ed + "' class='bmain_list_img' alt=''></a><a href='?village=43158&screen=" + edificil + "'>" + ed + "</a></td><td style='font-size: 0.9em'>" + Quasar.lang.get("build_level") + " " + nivel + "</td><td><span class='icon header wood'></span>" + wood + "<span class='icon header stone'></span>" + stone + "<span class='icon header iron'></span>" + iron + "<span class='icon header population'></span>" + pop + "</td><td><img class='tool_icon icon header' id='remove' data-ed='" + index + "' title='" + Quasar.lang.get('remove_icon_title') + "' src='/graphic/forum/thread_delete.png'></img><img src='/graphic/sorthandle.png' style='width: 11px; height:11px; ursor:pointer' id='move' data-ed='" + index + "'></span></td></tr>");
					$("#main_order").append('<img src="/graphic/buildings/mid/' + edificil + '1.png">');
					var row = $("#main_buildrow_" + edificil).find("span:eq(0)");
					if (row.find("#newNivel").length > 0) {
						row.find("#newNivel").text(' - (' + nivel + ')');
					} else {
						row.append('<span style="font-size: 0.9em; color: #FC0000;" id="newNivel"> - (' + nivel + ')</span>');
					}
					$("#sortable-list #remove").last().on('click', function() {
						var ed = Number($(this).attr("data-ed"));
						var queue = Quasar.config.get("queue_" + game_data.village.id, []);
						queue.splice(ed, 1);
						Quasar.config.set("queue_" + game_data.village.id, queue);
						Quasar.main.niveis[ed] = Quasar.main.niveis[ed] - 1;
						Quasar.main.load();
					});
				}
			}
		},
		map: {
			size: 0,
			_handleClick: null,
			coords: [],
			init: function() {
				this._handleClick = TWMap.map._handleClick;
				var onResizeEnd = TWMap.mapHandler.onResizeEnd;
				TWMap.mapHandler.onResizeEnd = function() {
					onResizeEnd();
					this.doAr();
				};
				Quasar.map.UI.init();
				Quasar.map.doAR();
			},
			updateAR: function() {
				if (premium)
					return;
				var element;
				var re = [];
				var at = [];
				var first = true;
				var coord;
				if (game_data.screen !== "overview")
					element = $("table.vis").last().find("tbody tr");
				else
					element = $("table.vis").first().find("tbody tr");
				$(element).each(function() {
					if (first) {
						first = false;
						return;
					}
					var $this = $(this);
					var img = $this.find("img").attr("src");
					var col0 = $this.find("td:eq(0) span span").text();
					var col1 = $this.find("td:eq(1)").text();
					if (!col0.contains("("))
						return;
					coord = col0.split("(")[1].split(")")[0].replaces("|", "");
					if (img.indexOf("return") > -1 ) {
						if ( re.indexOf(coord) == -1 ){
							re.push(coord);
						}
					} else if (img.indexOf("attack") > -1) {
						if ( at.indexOf(coord) == -1){
							at.push(coord);
						}
					}
				});
				Quasar.config.set("map_attacks", at);
				Quasar.config.set("map_returns", re);
			},
			doSC: function() {
				var coords = Quasar.config.get("coords_" + game_data.village.id, []);
				for (var i = 0; i < coords.length; i++) {
					coords[i] = Quasar.utils.coordToId(coords[i].replaces("|", ""));
				}
				$('[id*="map_village_"]').each(function() {
					var id = $(this).attr('id').replace('map_village_', '');
					if (coords.indexOf(id) > -1) {
						var m = $('#map_village_' + id);
						m.before('<img class="map_icon_showcoord" style="top: ' + m.css('top') + '; left: ' + m.css('left') + '; " id="map_icons_' + id + '" src="/graphic/dots/blue.png">');
					}
				});
			},
			doAR: function() {
				if (premium)
					return;
				var attacks = Quasar.config.get("map_attacks", []);
				var returns = Quasar.config.get("map_returns", []);
				var i = 0;
				for (i = 0; i < attacks.length; i++) {
					attacks[i] = Quasar.utils.coordToId(attacks[i]);
				}
				for (i = 0; i < returns.length; i++) {
					returns[i] = Quasar.utils.coordToId(returns[i]);
				}
				$('[id*="map_village_"]').each(function() {
					var id = $(this).attr('id').replace('map_village_', '');
					if ($('#map_icons_' + id + ".map_icon_3_1").length === 0) {
						var m;
						if (returns.indexOf(id) > -1) {
							m = $('#map_village_' + id);
							m.before('<img class="map_icon_return"style="top: ' + m.css('top') + '; left: ' + m.css('left') + ';" id="map_icons_' + id + '" src="/graphic/map/return.png">');
						}
						if (attacks.indexOf(id) > -1) {
							m = $('#map_village_' + id);
							m.before('<img class="map_icon_attack" style="position: absolute; top: ' + m.css('top') + '; left: ' + m.css('left') + '" id="map_icons_' + id + '" src="/graphic/map/attack.png">');
						}
					}
				});
			},
			handleClick: function(event) {
				var input = $('#quasar-colector textarea');
				var coord = this.coordByEvent(event);
				var village = TWMap.villages[coord.join('')];
				if (typeof village != "undefined") {
					coord = coord.join('|');
					if (Quasar.map.coords.indexOf(coord) < 0) {
						Quasar.map.coords.push(coord);
						input.val(Quasar.map.coords.join(' '));
						$("#qtdCoords").text(Quasar.map.coords.length);
						var m = $('#map_village_' + village.id);
						m.before('<img class="map_icon_collect" style="top: ' + m.css('top') + '; left: ' + m.css('left') + '; " id="map_icons_' + village.id + '" src="/graphic/dots/red.png">');
					} else {
						Quasar.map.coords.splice(coord, 1);
						input.val(Quasar.map.coords.join(' '));
						$("#qtdCoords").text(Quasar.map.coords.length);
						$('#map_icons_' + village.id + ".map_icon_collect").remove();
					}
				}
				return false;
			},
			resize: function(val) {
				if (premium)
					return;
				Quasar.config.set("map_size", val);
				TWMap.resize(val);
				this.size = val;
			},
			UI: {
				ele_quasar: null,
				init: function() {
					$("#map_config").after('<br><table class="vis" width="100%" style="border-spacing:0px;border-collapse:collapse;"><tbody id="quasarMap"><tr><th colspan="3">Quasar Options</th></tr></tbody></table><br/><table class="vis" width="100%" id="quasar-colector" style="display:none;"><tr><th>Coords(<span id="qtdCoords">0</span>)</th></tr><tr><td style="text-align:center"><textarea style="width:100%;background:none;border:none;resize:none;font-size:11px;"></textarea></td></tr></table>');
					$('#fullscreen').attr('style', 'display: block;').attr('onclick', 'TWMap.premium = true; TWMap.goFullscreen();').attr('title', 'FullScreen - Quasar Bot');
					this.ele_quasar = $("#quasarMap");
					this.appendMenu('<a id="btn_colect" class="btn">' + Quasar.lang.get('colect_coords') + '</a>');
					this.appendMenu('<a id="btn_showcoords" class="btn">' + Quasar.lang.get('show_coords') + '</a>');
					$("#btn_colect").on('click', function() {
						var cl = $(this).attr("class");
						if (cl === "btn") {
							$("#quasar-colector").show(500);
							TWMap.map._handleClick = Quasar.map.handleClick;
							$(this).attr("class", "btn btn-confirm-yes");
						} else {
							$("#quasar-colector").hide(500);
							$(".map_icon_collect").remove();
							Quasar.map.coords = [];
							$("#quasar-colector textarea").val("");
							$("#qtdCoords").text(Quasar.map.coords.length);
							TWMap.map._handleClick = Quasar.map._handleClick;
							$(this).attr("class", "btn");
						}
					});
					$("#btn_showcoords").on('click', function() {
						var cl = $(this).attr("class");
						if (cl === "btn") {
							Quasar.map.doSC();
							$(this).attr("class", "btn btn-confirm-yes");
						} else {
							$(".map_icon_showcoord").remove();
							$(this).attr("class", "btn");
						}
					});
					Quasar.map.UI.premiumChanges();
				},
				appendMenu: function(html) {
					this.ele_quasar.append("<tr><td align='center'>" + html + "</td></tr>");
				},
				premiumChanges: function() {
					if (premium) {
						return;
					}
					this.appendMenu(Quasar.lang.get("map_size") + ': <select id="size-change" style="width: 65px"><option value="4">4x4</option><option value="5">5x5</option><option value="7">7x7</option><option value="9">9x9</option><option value="11">11x11</option><option value="13">13x13</option><option value="15">15x15</option><option value="20">20x20</option><option value="30">30x30</option></select>');
					var size = Quasar.config.get("map_size", 13);
					var size_change = $("#size-change");
					size_change.val(size);
					Quasar.map.resize(size);
					size_change.on('change', function() {
						var val = Number($(this).val());
						Quasar.map.resize(val);
					});
				}
			}
		},
		overview: {
			init: function() {
				Quasar.map.updateAR();
				Quasar.overview.UI.init();
			},
			UI: {
				init: function() {
					tickTimer = Quasar.utils.tickTimer;
					if (!premium) {
						this.premiumChanges();
					}
				},
				premiumChanges: function() {
					var html = '<div id="show_notes" class="vis moveable widget" style="display:none;"><h4 class="head"><img style="float: right; cursor: pointer;" src="graphic/minus.png">' + Quasar.lang.get("village_notes") + '</h4><div class="widget_content" style="display: block;"><table width="100%"><tbody><tr><td id="village_note"></td></tr><tr><td><a id="edit_notes_link" href="javascript:void(0);">» Editar</a></td></tr></tbody></table></div></div>';
					$("#show_summary").after(html);
					Quasar.overview.UI.load_notes();
					$("#show_notes").show(1000);
					$("#edit_notes_link").on("click", function() {
						Quasar.overview.UI.edit_notes($("#village_note"), Quasar.lang.get("village_notes"));
					});
				},
				load_notes: function() {
					var notes = new QJSON("notes", true);
					var vid = game_data.village.id;
					var content = (notes.get(vid) !== null ? notes.get(vid) : "");
					$("#village_note").html(content);
				},
				edit_notes: function(element, title) {
					var notes = new QJSON("notes", true);
					var vid = game_data.village.id;
					var content = (notes.get(vid) !== null ? notes.get(vid).replace(/<br>/g, '\n') : "");
					title = Quasar.lang.get("village_notes");
					var html = '<div><textarea id="message" name="note" rows="10" cols="40">' + content + '</textarea></div><div><input type="button" id="ok_note" value="OK" class="btn"></div>';
					var onDraw = function() {
						$('#ok_note').on('click', function() {
							var note = $('#message').val().replace(/\n/g, '<br>');
							var notes = new QJSON("notes", true);
							notes.set(game_data.village.id, note);
							Quasar.config.set("notes", notes);
							Quasar.overview.UI.load_notes();
						});
					};
					Quasar.interface.menu.popupBox(title, html, 400, null, onDraw);
				}
			}
		},
		overview_villages: {
			init: function() {
				this.UI.init();
				this.saveVillages();
			},
			saveVillages: function() {
				var villages = new QJSON("villages", true);
				$("#production_table .row_a, #production_table .row_b").each(function() {
					var span = $(this).find("td:eq(0) span a span");
					var coord = span.text().split("(")[1].split(")")[0];
					var id = span.attr("id").replace("label_text_", "");
					villages.set(coord, id);
				});
				Quasar.config.set("villages", villages.toJSON());
			},
			changeName: function(village, newName) {
				$.post("?village=" + village + "&action=change_name&h=ddbf&screen=main", {
					name: newName
				}, function(data) {
					console.log("FUN");
				});
			},
			UI: {
				init: function() {}

			}
		},
		farm_post: {
			can: true,
			init: function() {
				if (!Quasar.farm_post.getStatus()) {
					return false;
				}
				$(".troop_template_selector").each(function() {
					$(this).click();
					if (Quasar.farm_post.canAttack()) {
						return Quasar.farm_post.doAttack();
					}
				});
				Quasar.utils.setReload("&screen=place");
				return false;
			},
			canAttack: function() {
				var coords = Quasar.config.get("coords_" + game_data.village.id, []);
				if (coords.length < 1)
					return false;
				if (template === 0) {
					return false;
				}
				$("input[class='unitsInput']").each(function() {
					var value = $(this).val();
					var qtd = $(this).parent().find("a").text();
					qtd = qtd.replaces("(", "");
					qtd = qtd.replaces(")", "");
					qtd = Number(qtd);
					if (value === null || value === "") {
						return;
					}
					if (qtd < value) {
						Quasar.farm_post.can = false;
					}
				});
				return Quasar.farm_post.can;
			},
			cleanInputs: function() {
				$("input[class='unitsInput']").each(function() {
					var value = Number($(this).val());
					var qtd = $(this).parent().find("a:eq(1)").text();
					qtd = qtd.replaces("(", "");
					qtd = qtd.replaces(")", "");
					qtd = Number(qtd);
					if (value === null || value === "" || value === 0)
						return;
					if (qtd < value) {
						return;
					}
					$(this).parent().find("a:eq(1)").text("(" + (qtd - value) + ")");
				});
			},
			doAttack: function() {
				var index = Quasar.config.get("index_" + game_data.village.id, 0) + 1;
				var coords = Quasar.config.get("coords_" + game_data.village.id, []);
				if (coords.length < 1)
					return false;
				if (index > coords.length - 1) {
					var stop = Quasar.config.get("stop_end_farm", false);
					if (stop) {
						return;
					} else {
						index = 0;
					}
				}
				Quasar.config.set("index_" + game_data.village.id, index);
				Quasar.farm.addAttack();
				$("#current").text(index);
				var id = game_data.village.id;
				var data = {
					x: x,
					y: y,
					attack: true
				};
				for (var unit in Quasar.game.units) {
					var inputed = Number($("#unit_input_" + unit).val());
					data[unit] = inputed;
				}
				Quasar.farm_post.cleanInputs();
				$.ajax({
					url: "?village=" + id + "&try=confirm&screen=place",
					type: "post",
					data: data,
					success: function(html) {
						if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
							Quasar.farm_post.can = false;
							return false;
						}
						var form = $('form', html);
						$.post(form[0].action, form.serialize(), function(html2) {
							if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
								Quasar.farm_post.can = false;
								return false;
							}
						});
					}
				});
				return true;
			},
			getStatus: function() {
				return Quasar.config.get("auto_farm_post", false);
			},
			setStatus: function(status) {
				Quasar.config.set("auto_farm_post", status);
				if (status) {
					Quasar.farm.setStatus(false);
					$("#auto_farm").removeClass("active");
				}
			}
		},
		farm: {
			init: function() {
				if (!Quasar.farm.getStatus()) {
					return false;
				}
				var waiting_attack = false;
				$(".troop_template_selector").each(function() {
					if (waiting_attack) {
						return true;
					}
					$(this).click();
					if (Quasar.farm.canAttack()) {
						waiting_attack = Quasar.farm.doAttack();
					}
				});
				Quasar.utils.setReload("&screen=place");
				return false;
			},
			canAttack: function() {
				var can = true;
				var coords = Quasar.config.get("coords_" + game_data.village.id, []);
				if (coords.length < 1)
					return false;
				$("input[class='unitsInput']").each(function() {
					var value = $(this).val();
					var qtd = $(this).parent().find("a").text();
					qtd = qtd.replaces("(", "");
					qtd = qtd.replaces(")", "");
					if (value === null || value === "")
						return;
					if (Number(qtd) < value) {
						can = false;
					}
				});
				return can;
			},
			doAttack: function() {
				var index = Quasar.config.get("index_" + game_data.village.id, 0) + 1;
				var coords = Quasar.config.get("coords_" + game_data.village.id, []);
				if (coords.length < 1) {
					return false;
				}
				if (index > coords.length - 1) {
					var stop = Quasar.config.get("stop_end_farm", false);
					if (stop) {
						return;
					} else {
						index = 0;
					}
				}
				var current = coords[index];
				$("input[name='input']").val(current);
				Quasar.config.set("index_" + game_data.village.id, index);
				Quasar.farm.addAttack();
				//Wait a random time to prevent ban
				setTimeout(function() {
					$("#target_attack").click();
				}, Quasar.utils.random(500, 2500));
				return true;
			},
			doConfirm: function() {
				//Wait a random time to prevent ban and wait for JQuery load :)
				setTimeout(function() {
					$('#troop_confirm_go').click();
				}, Quasar.utils.random(500, 2500));
			},
			addAttack: function() {
				var qjson = new QJSON("attacks", true);
				var date = $("#serverDate").text();
				if (qjson.contains(date)) {
					var n = qjson.get(date) + 1;
					qjson.set(date, n);
				} else {
					qjson.add(date, 0);
				}
				Quasar.config.set("attacks", qjson.toJSON());
			},
			getStatus: function() {
				return Quasar.config.get("auto_farm", false);
			},
			setStatus: function(status) {
				Quasar.config.set("auto_farm", status);
				if (status) {
					Quasar.farm_post.setStatus(false);
					$("#auto_farm_post").removeClass("active");
				}
			}
		},
		planner: {
			init: function() {
				var plan = Quasar.config.get("plan", []);
				var row,
					now,
					want,
					hour,
					day,
					timeToExec;

				var attack_function = function() {
					Quasar.planner.attack(i);
				};

				for (var i = 0; i < plan.length; i++) {
					row = new QJSON(plan[i]);
					day = row.get("day");
					hour = row.get("hour");
					now = new Date();
					want = new Date(day.split("/")[2], day.split("/")[1], day.split("/")[0], hour.split(":")[0], hour.split(":")[1], hour.split(":")[2], hour.split(":")[3]);
					timeToExec = now - want;
					if (timeToExec > 0) {
						setTimout(attack_function, time);
					}
				}
			},
			attack: function(id) {},
			showPOP: function() {
				var head = '<h3>NOT WORKING YET</h3>';
				var add = '<table class="vis" width="100%"><tbody><tr>';
				add += '<td><table class="vis" width="100%"><tbody>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_spear.png" alt="" class=""> <input id="plan_input_spear" name="spear" type="text" style="width: 40px" tabindex="1" value="" class="unitsInput"></td></tr>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_sword.png" alt="" class=""> <input id="plan_input_sword" name="sword" type="text" style="width: 40px" tabindex="2" value="" class="unitsInput"></td></tr>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_axe.png" alt="" class=""> <input id="plan_input_axe" name="axe" type="text" style="width: 40px" tabindex="3" value="" class="unitsInput"></td></tr>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_archer.png" alt="" class=""> <input id="plan_input_archer" name="archer" type="text" style="width: 40px" tabindex="4" value="" class="unitsInput"></td></tr>';
				add += '</tbody></table></td>';
				add += '<td><table class="vis" width="100%"><tbody>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_spy.png" alt="" class=""> <input id="plan_input_spy" name="spy" type="text" style="width: 40px" tabindex="5" value="" class="unitsInput"></td></tr>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_light.png" alt="" class=""> <input id="plan_input_light" name="light" type="text" style="width: 40px" tabindex="6" value="" class="unitsInput"></td></tr>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_marcher.png" alt="" class=""> <input id="plan_input_marcher" name="marcher" type="text" style="width: 40px" tabindex="7" value="" class="unitsInput"></td></tr>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_heavy.png" alt="" class=""> <input id="plan_input_heavy" name="heavy" type="text" style="width: 40px" tabindex="8" value="" class="unitsInput"></td></tr>';
				add += '</tbody></table></td>';
				add += '<td><table class="vis" width="100%"><tbody>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_ram.png" alt="" class=""> <input id="plan_input_ram" name="ram" type="text" style="width: 40px" tabindex="9" value="" class="unitsInput"></td></tr>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_catapult.png" alt="" class=""> <input id="plan_input_catapult" name="catapult" type="text" style="width: 40px" tabindex="10" value="" class="unitsInput"></td></tr>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_knight.png" alt="" class=""> <input id="plan_input_knight" name="knight" type="text" style="width: 40px" tabindex="11" value="" class="unitsInput"></td></tr>';
				add += '<tr><td class="nowrap"><img src="/graphic/unit/unit_snob.png" alt="" class=""> <input id="plan_input_snob" name="snob" type="text" style="width: 40px" tabindex="12" value="" class="unitsInput"></td></tr>';
				add += '</tbody></table></td>';
				add += '<td><table class="vis" width="100%"><tbody>';
				add += '<tr><td class="nowrap">Day: <input id="input_day" type="text" style="width: 80px; float: right" tabindex="13" value="" class="unitsInput" size="10" placeholder="day/month/year"></td></tr>';
				add += '<tr><td class="nowrap">Hour: <input id="input_hour" type="text" style="width: 80px; float: right" tabindex="14" value="" class="unitsInput" size="12" placeholder="00:00:00:000"></td></tr>';
				add += '<tr><td class="nowrap">Coord: <input id="input_coord" type="text" style="width: 80px; float: right" tabindex="15" value="" class="unitsInput" placeholder="xxx|yyy"></td></tr>';
				add += '<tr><td class="nowrap">From: ' + game_data.village.coord + '<input id="button_save" type="button" tabindex="16" value="' + Quasar.lang.get("save") + '" style="float: right" class="unitsInput"></td></tr>';
				add += '</tbody></table></td>';
				add += '</tr></tbody></table>';
				var list = "";
				var plan = Quasar.config.get("plan", []);
				list += '<table class="vis" width="100%"><tbody>';
				for (var i = 0; i < plan.length; i++) {
					var row = new QJSON(plan[i]);
					list += '<tr>';
					for (var chave in row.cache) {
						if (chave !== "day" && chave !== "hour" && chave !== "coord" && row.get(chave) !== 0) {
							list += '<td><img src="/graphic/unit/unit_' + chave + '.png">' + row.get(chave) + '</td>';
						}
					}
					list += '<td>' + row.get("coord") + '</td>';
					list += '<td>' + row.get("day") + '</td>';
					list += '<td>' + row.get("hour") + '</td>';
					list += '<td><img class="tool_icon icon header" id="button_remove" data-ed="' + i + '" title="remove" src="/graphic/forum/thread_delete.png"></td>';
					list += '</tr>';
				}
				list += '</tbody></table>';
				var onDraw = function() {
					$("#button_save").on('click', function() {
						var allBlank = true;
						var value;
						var plan = Quasar.config.get("plan", []);
						var row = new QJSON("lastAttack");
						for (var unit in Quasar.game.units) {
							value = Number($("#plan_input_" + unit).val());
							row.set(unit, value);
							if (value !== 0) {
								allBlank = false;
							}
						}
						var day = $("#input_day").val();
						var hour = $("#input_hour").val();
						var coord = $("#input_coord").val();
						row.set("day", day);
						row.set("hour", hour);
						row.set("coord", coord);
						if (!allBlank && hour !== null && hour !== "" && day !== null && day !== "" && coord !== null && coord !== "") {
							if (hour.split(":").length == 4 && day.split("/").length == 3 && coord.split("|").length == 2) {
								plan.push(row.toJSON());
								Quasar.config.set("plan", plan);
								Quasar.interface.menu.closePop();
							} else {
								alert("Erro no formato de hora, data ou coord.");
							}
						} else {
							alert("Error algum campo necessario esta em branco.");
						}
					});
					$("#button_remove").on('click', function() {
						var id = $(this).attr("data-ed");
						var plan = Quasar.config.get("plan", []);
						plan.splice(id, 1);
						Quasar.config.set("plan", plan);
						$(this).parent().parent().remove();
					});
				};
				var html = head + add + list;
				Quasar.interface.menu.popupBox(Quasar.lang.get("planner"), html, 450, null, onDraw);
			},
		},
		report: {
			init: function() {
				Quasar.report.UI.init();
			},
			UI: {
				init: function() {
					$("#content_value").prepend('<div id="menu_script" style="display:none;"><table class="vis nowrap tall" style="width: 100%"><tr><th style="width: 66%">Menu</th></tr><tr><td><input id="clean" class="btn" type="button" value="Clean Villages"></td></tr></table></div>');
					var coord = "";
					$("btn_wall_drop").on("click", function() {
						Quasar.wall.attack(coord[0], coord[1]);
					});
					$("#menu_script").show(1000);
				}
			},
			view: function() {
				var coord_name = $("#attack_info_def .village_anchor a");
				if (coord_name.length < 1) {
					return;
				}
				var coord = coord_name.text().split("(")[1].split(")")[0];

				var wall = $('<td><img src="/graphic/buildings/wall.png" title="Add to drop list"/></td>').on("click", function() {
					Quasar.wall.save( coord, $(this));
				});
				var add = $('<td><img src="/graphic/map/attack.png" title="Add to farm list"/></td>').on("click", function() {
					var coords = Quasar.config.get("coords_" + game_data.village.id, []);
					if (!coords.indexOf(coord) > -1) {
						coords.push(coord);
						Quasar.config.set("coords_" + game_data.village.id, coords);
						$(this).addClass("success");
					} else {
						$(this).addClass("fail");
					}
				});

				var remove = $('<td><img src="/graphic/map/return.png" title="Remove from farm list"/></td>').on("click", function() {
					var coords = Quasar.config.get("coords_" + game_data.village.id, []);
					if (coords.indexOf(coord) > -1) {
						coords.splice(coord, 1);
						Quasar.config.set("coords_" + game_data.village.id, coords);
						$(this).addClass("success");
					} else {
						$(this).addClass("fail");
					}
				});

				var label = $("tr:first", "#attack_results ");
				label.append(wall);
				label.append(add);
				label.append(remove);
			}
		},
		wall : {
			init: function() {
				if (!Quasar.wall.getStatus())
					return false;
				var units = this.getUnits();
				var coordsStorage = Quasar.config.get("wall_coords", []);
				if (coordsStorage.length <= 0 || !Quasar.wall.hasUnits()) {
					return false;
				}
				Quasar.wall.cleanInputs();
				for (var i = 0; i < units.length; i++) {
					$("#unit_input_" + units[i][0]).val(units[i][1]);
				}
				var coords = Quasar.utils.orderByDis(game_data.village.coord, coordsStorage);
				var current = coords[0];
				$("input[name='input']").val(current);
				coords.shift();
				Quasar.config.set("wall_coords", coords);
				$("#target_attack").click();
				return true;
			},
			cleanInputs: function() {
				$('.unitsInput').each(function() {
					$(this).val(0);
				});
			},
			getUnits: function() {
				var units = [];
				units.push(["spy", Quasar.config.get("wall_drop_spy", 1)]);
				units.push(["ram", Quasar.config.get("wall_drop_ram", 15)]);
				units.push(["axe", Quasar.config.get("wall_drop_axe", 30)]);
				return units;
			},
			hasUnits: function() {
				var units = this.getUnits();
				for (var i = 0; i < units.length; i++) {
					var t = $("#unit_input_" + units[i][0]).next("a").text().match(/\d+/g)[0];
					if (Number(t) < Number(units[i][1])) {
						return false;
					}
				}
				return true;
			},
			canAttack: true,
			attack: function(x, y, report_id) {
				if (!Quasar.wall.canAttack) {
					$("#" + report_id).parent().addClass("fail");
					return;
				}
				var id = game_data.village.id;
				var data = {
					x: x,
					y: y,
					attack: true
				};
				for (var unit in Quasar.game.units) {
					data[unit] = 0;
				}
				data.spy = Quasar.config.get("wall_drop_spy", 1);
				data.ram = Quasar.config.get("wall_drop_ram", 15);
				data.axe = Quasar.config.get("wall_drop_axe", 45);
				$.ajax({
					url: "?village=" + id + "&try=confirm&screen=place",
					type: "post",
					data: data,
					success: function(html) {
						if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
							$("#" + report_id).parent().addClass("fail");
							Quasar.wall.canAttack = false;
							return false;
						}
						var form = $('form', html);
						$.post(form[0].action, form.serialize(), function(html2) {
							if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
								$("#" + report_id).parent().addClass("fail");
								Quasar.wall.canAttack = false;
								return false;
							}
							$("#" + report_id).parent().addClass("success");
						});
					}
				});
			},
			save: function(coord, $element) {
				var coords = Quasar.config.get("wall_coords", []);
				if ( coords.indexOf( coord ) === -1) {
					coords.push(coord);
					Quasar.config.set("wall_coords", coords);
					$element.addClass("success");
				} else {
					$element.addClass("fail");
				}
			},
			getStatus: function() {
				return Quasar.config.get("break_wall");
			},
			setStatus: function(status) {
				Quasar.config.set("break_wall", status);
			}
		},
		am_farm : {
			jump: false,
			cicle: 0,
			rows: 0,
			init: function() {
				Quasar.am_farm.UI.init();
				if (!Quasar.am_farm.getStatus())
					return;
				Quasar.am_farm.doAttacks();				
				Quasar.utils.setReload("&order=distance&dir=asc&screen=am_farm");
			},
			doAttacks: function() {
				var time = 0;
				var IS_BY_RATIO = Quasar.config.get("am_is_by_ratio", false);
				var MAXATTACK = Number(Quasar.config.get("max_am_attacks", 2));
				var RATIO = Number(Quasar.config.get("am_dis_ratio", 1));
				var ATTACK_CONTROL = Quasar.config.get("attack_control", true);
				var MAXDIS = Number(Quasar.config.get("max_am_dis", 20));
				var BLUE_SET = Quasar.config.get("blue_reports", false);
				var YELLOW_SET = Quasar.config.get("yellow_reports", true);
				var USE_C = Quasar.config.get("use_c_am", true);
				var MAXWALL = Number(Quasar.config.get("max_am_wall", 3));
				var RES_A = Quasar.am_farm.getTemplateRes("0");

				var $rows = $(".row_a:visible, .row_b:visible", "#am_widget_Farm");
				console.log("Ciclo : " + Quasar.am_farm.cicle);
				$rows.each(function(index) {
					var $this = $(this);
					//Adiciona uma quantidade de ms ao toal de time
					time += Quasar.utils.random(300, 500);

					//Agenda as checagens de envio
					setTimeout(function() {
						if ($(".error").length > 0) {
							Quasar.am_farm.jump = true;
						}

						if (Quasar.am_farm.jump) {
							return;
						}

						Quasar.am_farm.rows++;

						var cicle = Quasar.am_farm.cicle;
						
						if (index == $rows.length - 1 && ( !( !IS_BY_RATIO && cicle > MAXATTACK) || !(IS_BY_RATIO && cicle > RATIO * MAXDIS ) ) ) {
							Quasar.am_farm.cicle++;
							setTimeout(Quasar.am_farm.doAttacks, 500);
						}

						var deleted = false,
							isHidden = true;
						var classText = $this.attr("class").split(" ")[0];
						var rep_id = "drop_" + classText;
						var deletelink = $this.find("td:eq(0) a");

						/* Get links of templates */
						var linkA = $this.find("a.farm_icon_a");
						var linkB = $this.find("a.farm_icon_b");
						var linkC = $this.find("a.farm_icon_c");

						var coord = $this.find("td:eq(3) a").text().split(")")[0].split("(")[1];
						var sumRes = 0; //Default sum of resources

						/* For each resource td...*/
						$this.find("td:eq(5) .res").each(function() {
							sumRes += Number($(this).text().replace(".", ""));
						});

						var wall = Number($this.find("td:eq(6)").text() == "?" ? 0 : $this.find("td:eq(6)").text());

						var full = false; // Default value of is full
						var img = $this.find("td:eq(2) img");

						if (img.length > 0) {
							full = img.attr("src").match(/1.png/g) !== null ? true : false;
						}

						/* Get last report color */
						var green = $this.find("td:eq(1) img").attr("src").match(/green.png/g) !== null ? true : false;
						var blue = $this.find("td:eq(1) img").attr("src").match(/blue.png/g) !== null ? true : false;
						var yellow = $this.find("td:eq(1) img").attr("src").match(/yellow.png/g) !== null ? true : false;
						var red = $this.find("td:eq(1) img").attr("src").match(/red.png/g) !== null ? true : false;

						/* Get how many attacks were sent */
						var atqs = Number($this.find("#attacks").text());

						/* Get distance */
						var dis = Number($this.find("td:eq(7)").text());

						//Se estiver ativo para controlar ataques, e a quantidade de ataques for maior que o dessa rotação
						if (ATTACK_CONTROL && atqs > Quasar.am_farm.cicle) {
							return false;
						}
						//Se a distancia é maior que o maximo configurado, não ataca
						else if (dis > MAXDIS) {
							return false;
						}
						//Calcula a quantidade de ataques maximos baseados na razao de distacia
						else if (IS_BY_RATIO && atqs >= (RATIO * dis) && atqs !== 0) {
							return false;
						}
						//Calcula ataques maximos baseado no padão consigurado
						else if (!IS_BY_RATIO && atqs >= MAXATTACK) {
							return false;
						}
						//Se o ultimo relatorio foi vermelho, deleta esse relatorio
						else if (red) {
							deletelink.click();
							return true;
						}
						//Se o ultimo relatorio foi azul e não esta configurado para atacar azuis, não ataca
						else if (blue && !BLUE_SET) {
							return false;
						}
						//Se o ultimo relatorio for amarelho e está configurado para nao atacar relatorios amarelhos
						//ou se a muralha for maior que o maximo aceito nas configurações
						//não ataca.
						else if ((yellow && YELLOW_SET) || wall > MAXWALL) {
							//Se a quantidade de ataques for igual a 0, envia a coordenada para o wall droper
							if (atqs === 0) {
								Quasar.wall.save(coord, $this.find("#wall").parent() );
							}
							return false;
						}
						/* Checagens de envio com prioridade*/

						//Se o botão C está visivel 
						//e esta configurado para atacar
						//com o templace C e não existem mensagens de erro na tela
						else if (linkC.length > 0 && USE_C) {
							//Só ataca com templace C, se não existirem ataques aquela aldeias
							// e se a soma dos recursos existentes for maior ou igual ao minimo configurado 
							if (atqs === 0 && sumRes >= RES_A) {
								linkC.click();
								console.log("Attack C");
								Quasar.farm.addAttack();
							}
						}
						//Se o botão A esta visivel e existem tropas suficientes para atacar
						else if (linkA.length > 0 && Quasar.am_farm.hasTroop("0")) {
							linkA.click();
							console.log("Attack A");
							Quasar.farm.addAttack();
						}
						//Se o botão B esta visivel e existem tropas suficientes para atacar
						else if (linkB.length > 0 && Quasar.am_farm.hasTroop("1")) {
							linkB.click();
							console.log("Attack B");
							Quasar.farm.addAttack();
						}
						//Se não atacar por que nao possui tropas, esconde
						else {
							return true;
						}
						$this.hide();
					}, time);
				});
			},
			//Templace represents the number of the templace, A = 0, B = 1
			hasTroop: function(template) {
				var has = true;
				$("form:eq(" + template + ") tr:eq(1) input").each(function() {
					var unit = $(this).attr("name");
					var temp = Number($(this).val());
					var current = Number($("#units_home #" + unit).text());
					if (current < temp) {
						has = false;
					}
				});
				return has;
			},
			getTemplateRes: function(template) {
				return Number($("form:eq(" + template + ") tr:eq(1) td:eq(6)").text());
			},
			UI: {
				init: function() {
					$("#am_widget_Farm div table tbody tr:eq(1) ").append('<th><img src="/graphic/buildings/wall.png?"/></th><th><img src="/graphic/command/attack.png"/></th>');
					var time = 0;

					$(".row_a, .row_b").each(function() {
						time += 100;
						var $this = $(this);
						setTimeout(function() {
							var classText = $this.attr("class").split(" ")[0];

							var id = "drop_" + classText;

							var coord = $this.find("td:eq(3) a").text().split(")")[0].split("(")[1];
							var img = $this.find("td:eq(3) img");

							var ataques = 0;

							if (img.length > 0) {
								img.mouseover();
								ataques = $('#tooltip h3').text().replace(/\D/g, '');
								img.mouseout();
							}

							var $image = $('<td><img id="wall" src="/graphic/buildings/wall.png?"/></td>').on("click", function() {
								Quasar.wall.save(coord, $(this));
							});
							$this.append($image);
							$this.append('<td id="attacks">' + ataques + '</td>');

						}, time);
					});

				}
			},
			getStatus: function() {
				return Quasar.config.get('am_farm', false);
			},
			setStatus: function(status) {
				Quasar.config.set('am_farm', status);
			}
		},
		dodge : {
			init: function() {
				//I think that it is not part of Dodge!
				if (game_data.player.premium) {
					this.renameAttacks();
				}

				if (Quasar.dodge.getStatus() && game_data.player.incomings > 0 && Quasar.dodge.getDodgeVillage() !== null) {
					this.UI.showAlert();
					this.attack();
				}

				this.cancel();
				Quasar.utils.setReload("&screen=overview");
			},
			//Rename comming attacks
			renameAttacks: function() {
				//Conta qts ataques estão vindo, se for maior do que o que tinha na ultima vez que renomeou, 
				//renomeia e altera, se for menor, apenas atualiza a lista				
				var atqs = Quasar.config.get("incoming_attacks", 0);

				if (atqs < game_data.player.incomings) {
					Quasar.interface.menu.popupBox("Incoming attacks", "Loading page...", 1200, null, function() {
						$("#quasar_popup").load("?village=" + game_data.village.id + "&mode=incomings&subtype=attacks&screen=overview_villages", function(html) {
							var $html = $(html);
							Quasar.config.set("before_identify_page", location.href);
							$html.find("#select_all").click();
							$html.find("#incomings_form input[name='label']").click();
						});
					});
				}

				if (atqs != game_data.player.incomings) {
					Quasar.config.set("incoming_attacks", game_data.player.incomings);
				}

			},
			//Cancel dodge attacks, if exists
			cancel: function() {

			},
			//Schedule a attack
			attack: function() {
				var time = Quasar.dodge.getAttackTime();
				if (time === null) {
					return;
				}
				//Send trops now!
				if (time <= 60) {
					Quasar.dodge.sendAttack();
				}
				//Schedule an attack
				else {
					setTimeout(function() {
						Quasar.dodge.sendAttack();
					}, (time - 60) * 1000);
				}
			},
			sendAttack: function() {
				Quasar.interface.menu.popupBox("Dodging", "Loading page...", 1200, null, function() {

					Quasar.config.set("before_dodge_page", location.href);
					$("#quasar_popup").load("?village=" + game_data.village.id + "&screen=place", function(html) {
						var $html = $(html);
						var target = Quasar.dodge.getAttackVillage();
						if (target === null) {
							return;
						}
						$html.find("input[name='input']").val(target);
						$html.find('.unitsInput').each(function() {
							var $this = $(this);
							var $maxUnits = $this.next('a').html();
							var maxUnits = $maxUnits.substr(1).substr(0, $maxUnits.length - 2);
							$this.val(maxUnits);
						});
						$html.find("#target_attack").click();
					});
				});
			},
			hasTroop: function() {
				var has = false;
				$('.unitsInput').each(function() {
					var $this = $(this);
					if ($this.val() !== "" && Number($this.val()) > 0) {
						has = true;
						return false;
					}
				});
				return has;
			},
			UI: {
				showAlert: function() {
					if (Quasar.dodge.getStatus() && game_data.player.incomings > 0) {
						var s = $("#dodge");
						if (!s.hasClass("alert"))
							s.addClass("alert");
						else
							s.removeClass("alert");
						setTimeout(Quasar.dodge.UI.showAlert, 1000);
					}
				}
			},
			getDodgeVillage: function() {
				return Quasar.config.get("dodge_target", null);
			},
			getAttackTime: function() {
				var $ele = $(".no_ignored_command:first");
				if ($ele.length > 0) {
					var timer = $ele.find("td:eq(2) span").text();
					return Quasar.utils.stringToSec(timer);
				}
				return null;
			},
			getStatus: function() {
				return Quasar.config.get('dodge', false);
			},
			setStatus: function(status) {
				Quasar.config.set('dodge', status);
			}
		},
		game: {
			builds: {
				"main": {
					"max": 30,
					"name": "Edifício principal",
					"wood": 90,
					"stone": 80,
					"iron": 70,
					"pop": 5,
					"fwood": 1.26,
					"fstone": 1.275,
					"firon": 1.26,
					"fpop": 1.17
				},
				"barracks": {
					"max": 25,
					"name": "Quartel",
					"wood": 200,
					"stone": 170,
					"iron": 90,
					"pop": 7,
					"fwood": 1.26,
					"fstone": 1.28,
					"firon": 1.26,
					"fpop": 1.17
				},
				"stable": {
					"max": 20,
					"name": "Estabulo",
					"wood": 270,
					"stone": 240,
					"iron": 260,
					"pop": 8,
					"fwood": 1.26,
					"fstone": 1.28,
					"firon": 1.26,
					"fpop": 1.17
				},
				"garage": {
					"max": 15,
					"name": "Oficina",
					"wood": 300,
					"stone": 240,
					"iron": 260,
					"pop": 8,
					"fwood": 1.26,
					"fstone": 1.28,
					"firon": 1.26,
					"fpop": 1.17
				},
				"church": {
					"max": 3,
					"name": "Igreja",
					"wood": 16000,
					"stone": 20000,
					"iron": 5000,
					"pop": 5000,
					"fwood": 1.26,
					"fstone": 1.28,
					"firon": 1.26,
					"fpop": 1.55
				},
				"church_f": {
					"max": 1,
					"name": "Primeira Igreja",
					"wood": 160,
					"stone": 200,
					"iron": 50,
					"pop": 5,
					"fwood": 1.26,
					"fstone": 1.28,
					"firon": 1.26,
					"fpop": 1.55
				},
				"snob": {
					"max": 1,
					"name": "Academia",
					"wood": 15000,
					"stone": 25000,
					"iron": 10000,
					"pop": 80,
					"fwood": 2,
					"fstone": 2,
					"firon": 2,
					"fpop": 1.17
				},
				"smith": {
					"max": 20,
					"name": "Ferreiro",
					"wood": 220,
					"stone": 180,
					"iron": 240,
					"pop": 20,
					"fwood": 1.26,
					"fstone": 1.275,
					"firon": 1.26,
					"fpop": 1.17
				},
				"place": {
					"max": 1,
					"name": "Praça",
					"wood": 10,
					"stone": 40,
					"iron": 30,
					"pop": 0,
					"fwood": 1.26,
					"fstone": 1.275,
					"firon": 1.26,
					"fpop": 1.17
				},
				"statue": {
					"max": 1,
					"name": "Estabulo",
					"wood": 220,
					"stone": 220,
					"iron": 220,
					"pop": 10,
					"fwood": 1.26,
					"fstone": 1.275,
					"firon": 1.26,
					"fpop": 1.17
				},
				"market": {
					"max": 25,
					"name": "Mercado",
					"wood": 100,
					"stone": 100,
					"iron": 100,
					"pop": 20,
					"fwood": 1.26,
					"fstone": 1.275,
					"firon": 1.26,
					"fpop": 1.17
				},
				"wood": {
					"max": 30,
					"name": "Bosque",
					"wood": 50,
					"stone": 60,
					"iron": 40,
					"pop": 5,
					"fwood": 1.25,
					"fstone": 1.275,
					"firon": 1.245,
					"fpop": 1.155
				},
				"stone": {
					"max": 30,
					"name": "Poço de argila",
					"wood": 65,
					"stone": 50,
					"iron": 40,
					"pop": 5,
					"fwood": 1.27,
					"fstone": 1.265,
					"firon": 1.24,
					"fpop": 1.14
				},
				"iron": {
					"max": 30,
					"name": "Mina de ferro",
					"wood": 75,
					"stone": 65,
					"iron": 70,
					"pop": 10,
					"fwood": 1.252,
					"fstone": 1.275,
					"firon": 1.24,
					"fpop": 1.17
				},
				"farm": {
					"max": 30,
					"name": "Fazenda",
					"wood": 45,
					"stone": 40,
					"iron": 30,
					"pop": 0,
					"fwood": 1.3,
					"fstone": 1.32,
					"firon": 1.29,
					"fpop": 1
				},
				"storage": {
					"max": 30,
					"name": "Armazem",
					"wood": 60,
					"stone": 50,
					"iron": 40,
					"pop": 0,
					"fwood": 1.265,
					"fstone": 1.27,
					"firon": 1.245,
					"fpop": 1.15
				},
				"hide": {
					"max": 10,
					"name": "Esconderijo",
					"wood": 50,
					"stone": 60,
					"iron": 50,
					"pop": 2,
					"fwood": 1.25,
					"fstone": 1.25,
					"firon": 1.25,
					"fpop": 1.17
				},
				"wall": {
					"max": 20,
					"name": "Muralha",
					"wood": 50,
					"stone": 100,
					"iron": 20,
					"pop": 5,
					"fwood": 1.26,
					"fstone": 1.275,
					"firon": 1.26,
					"fpop": 1.17
				},
			},
			units: {
				"spear": {
					"wood": 50,
					"stone": 30,
					"iron": 10,
					"pop": 1,
					"time": 1020,
					"ed": "barracks",
					"name": "spear"
				},
				"sword": {
					"wood": 30,
					"stone": 30,
					"iron": 70,
					"pop": 1,
					"time": 1500,
					"ed": "barracks",
					"name": "sword"
				},
				"axe": {
					"wood": 60,
					"stone": 30,
					"iron": 40,
					"pop": 1,
					"time": 1320,
					"ed": "barracks",
					"name": "axe"
				},
				"archer": {
					"wood": 100,
					"stone": 30,
					"iron": 60,
					"pop": 1,
					"time": 1800,
					"ed": "barracks",
					"name": "archer"
				},
				"spy": {
					"wood": 50,
					"stone": 50,
					"iron": 20,
					"pop": 2,
					"time": 900,
					"ed": "stable",
					"name": "spy"
				},
				"light": {
					"wood": 100,
					"stone": 125,
					"iron": 250,
					"pop": 4,
					"time": 1800,
					"ed": "stable",
					"name": "light"
				},
				"marcher": {
					"wood": 250,
					"stone": 100,
					"iron": 150,
					"pop": 5,
					"time": 2700,
					"ed": "stable",
					"name": "marcher"
				},
				"heavy": {
					"wood": 200,
					"stone": 150,
					"iron": 600,
					"pop": 6,
					"time": 3600,
					"ed": "stable",
					"name": "heavy"
				},
				"ram": {
					"wood": 300,
					"stone": 200,
					"iron": 200,
					"pop": 5,
					"time": 4800,
					"ed": "garage",
					"name": "ram"
				},
				"catapult": {
					"wood": 320,
					"stone": 400,
					"iron": 100,
					"pop": 8,
					"time": 7200,
					"ed": "garage",
					"name": "catapult"
				}
			}
		},
		lang: {
			init: function() {
				this.cache = Quasar.config.get("language", "en");
			},
			cache: "en",
			get: function(string) {
				return Quasar.lang[this.cache][string];
			},
			br: {
				save: "Salvar",
				count: "Contador",
				language: "Portugues",
				yes: "sim",
				no: "nao",
				auto_farm: "Farmador",
				auto_farm_post: "Farmador Silencioso",
				auto_recruit: "Recrutador",
				anti_afk: "Anti-Captcha",
				auto_build: "Construtor",
				dodge: "Dodge",
				planner: "Planejador (Preview)",
				update_notes: "Sobre",
				wall_drop: "Derrubar muralha",
				am_farm: "Auto AS",
				attacks_today: "Ataques hoje",
				order_recruit: "Ordem",
				option: "Opções",
				units: "Unidades",
				opt_title: "Opções de recrutamento",
				build_queue: "Fila de construção",
				build_level: "Nivel",
				price: "Custo",
				hide_link: "Esconder",
				show_link: "Mostrar",
				builds: "Contruções",
				add_icon_title: "Adicionar a fila",
				remove_icon_title: "Remover da fila",
				villages: "Aldeias",
				order: "Ordenar",
				clean: "Limpar",
				anti_afk_msg: "Para o anti-captcha funcionar corretamente é necessario desbloquear os\npopups do site no seu navegador.",
				village_notes: "Notas da aldeia",
				colect_coords: "Coletar coordenadas",
				show_coords: "Mostrar coordenadas",
				map_size: "Tamanho do mapa",
				configuration: "Configuracoes",
				import_export: "Importar/Exportar"
			},
			en: {
				save: "Save",
				count: "Counter",
				language: "English",
				yes: "Yes",
				no: "No",
				auto_farm: "Farmer",
				auto_farm_post: "Silent farmer",
				auto_recruit: "Recruiter",
				anti_afk: "Anti-Captcha",
				auto_build: "Builder",
				dodge: "Dodge",
				planner: "Planner (Preview)",
				update_notes: "About",
				wall_drop: "Wall Dropper",
				am_farm: "Auto Farm Assist",
				attacks_today: "Attacks today",
				order_recruit: "Order",
				option: "Options",
				units: "Units",
				opt_title: "Recruitment options",
				build_queue: "Build queue",
				build_level: "Level",
				price: "Price",
				hide_link: "Hide",
				show_link: "Show",
				builds: "Builds",
				add_icon_title: "Add",
				remove_icon_title: "remove",
				villages: "Villages",
				order: "Order",
				clean: "Clean",
				anti_afk_msg: "Para o anti-captcha funcionar corretamente 頮ecessario desbloquear os\npopups do site no seu navegador.",
				village_notes: "Notes",
				colect_coords: "Collect coords",
				show_coords: "Show coords",
				map_size: "Map size",
				configuration: "Configs",
				import_export: "Import/Export"
			}
		},
		train : {
			init: function() {
				Quasar.train.UI.init();
				if (!Quasar.train.getStatus())
					return;
				if (this.isSequential()) {
					Quasar.train.sequentialRecruitment();
					Quasar.train.UI.updateType();
				} else {
					Quasar.train.numericalRecruitment(0);
					Quasar.train.UI.updateType();
					var recruitBtn = $("input[type='submit']");
					if (!recruitBtn.hasClass("btn-recruit-disabled")) {
						recruitBtn.click();
					}
				}
				Quasar.utils.setReload("&screen=train");
			},
			isSequential: function() {
				return Quasar.config.get("sequential_recruitment", true);
			},
			queueLimite: function() {
				return Number(Quasar.config.get("max_recruit_time", 8)) * 60 * 60;
			},
			numericalRecruitment: function(index) {
				var tropas = Quasar.config.get("recruitment_numerical_" + game_data.village.id, []);

				if (tropas.length < 1 || index > tropas.length - 1) {
					return;
				}

				var unitType = tropas[index][0];
				var unitAmmount = Number(tropas[index][1]);
				var build = Quasar.game.units[unitType].ed;
				var units;

				var ele_unit = $("#" + unitType + "_" + unit_build_block.village_id);
				if (ele_unit.length > 0) {
					var unitCount = Number($("#" + unitType + "_" + unit_build_block.village_id + "_a").text().replaces(")", "").replaces("(", ""));
					//Se existem unidades disponiveise o tempo limite para a fila for maior que 0
					if (unitCount > 0 && this.queueLimite() > 0) {
						if (unitCount >= unitAmmount) {
							units = unitAmmount;
						} else {
							units = unitCount;
						}
						var timeUnit = Quasar.utils.stringToSec(ele_unit.parent().parent().find("span.time").parent().text());
						var plusTime = timeUnit * units;

						//Enquanto o tempo de build for maior que o limite, tira uma unidade,
						//Sai do loop quando o numero de unidades for o suficiente pra manter a fila dentro do limite
						while (this.getQueueTime(build) + plusTime > this.queueLimite() && units > 0) {
							plusTime = timeUnit * (--units);
						}

						if (units > 0) {
							ele_unit.val(units);
							unit_build_block._onchange();


							if (units == unitAmmount) {
								var bkp_tropas = [];

								//Atualiza a array retirando este elemento dela :(
								for (var i = 0; i < tropas.length; i++) {
									if (i != index) {
										bkp_tropas.push(tropas[i]);
									}
								}
								//Decrementa um da var index pra corrigir o tamanho.
								--index;
								tropas = bkp_tropas;
							} else {
								tropas[index][1] = unitAmmount - units;
							}

							Quasar.config.set("recruitment_numerical_" + game_data.village.id, tropas);
						}
						
						//Tenta a proxima unidade independente do que acontecer	
						this.numericalRecruitment( ++index);
					}
				}
			},
			sequentialRecruitment: function() {
				var tropas = Quasar.config.get("recruitment_sequential_" + game_data.village.id, []);
				var index = Quasar.config.get("train_index_" + game_data.village.id, 0);
				if (tropas.length < 1)
					return;
				if (index > (tropas.length - 1))
					index = 0;
				var unitType = tropas[index];
				var build = Quasar.game.units[unitType].ed;
				var ele_unit = $("#" + unitType + "_" + unit_build_block.village_id);
				if (ele_unit.length > 0) {
					var unitCount = Number($("#" + unitType + "_" + unit_build_block.village_id + "_a").text().replaces(")", "").replaces("(", ""));
					//Se existem unidades disponiveis
					if (unitCount >= 1) {
						var troops = Number(ele_unit.val()) + 1;
						var timeUnit = Quasar.utils.stringToSec(ele_unit.parent().parent().find("span.time").parent().text());
						var plusTime = timeUnit * troops;
						console.log(build, " ", this.getQueueTime(build));
						if (this.getQueueTime(build) + plusTime < this.queueLimite()) {
							ele_unit.val(troops);
							Quasar.config.set("train_index_" + game_data.village.id, ++index);
							unit_build_block._onchange();
							this.sequentialRecruitment();
							var recruitBtn = $("input[type='submit']");
							if (!recruitBtn.hasClass("btn-recruit-disabled")) {
								recruitBtn.click();
								setTimeout(Loader.goTo, 2 * 1000);
							}
							return;
						}
					}
				}
			},
			getQueueTime: function( build ) {
				if ($("#trainqueue_" + build).length < 1)
					return 0;
				var time = 0;
				$("#trainqueue_" + build + " .sortable_row").each(function() {
					var stime = $(this).find("td:eq(1)").text();
					time += Quasar.utils.stringToSec(stime);
				});
				time += Quasar.utils.stringToSec($("#trainqueue_wrap_" + build + " td:eq(1)").text());
				return time;
			},			
			getStatus: function() {
				return Quasar.config.get("auto_train", false);
			},
			setStatus: function(status) {
				Quasar.config.set("auto_train", status);
			},
			updateRecruiment : function () {
				if (!Quasar.train.isSequential()) {
					var temp = [];
					$("#sortable1").find("span").each(function () {
						var $this = $(this);
						temp.push([$this.attr("id"), $this.attr("data-badge")]);
					});
					Quasar.config.set("recruitment_numerical_" + game_data.village.id, temp);
				}
				//Se é sequencial
				else {
					var sorted = $("#sortable1").sortable("toArray");
					sorted.shift();
					Quasar.config.set("recruitment_sequential_" + game_data.village.id, sorted);
				}
				this.UI.updateType();
			},
			UI: {
				init: function() {
					tickTimer = Quasar.utils.tickTimer;

					var $main_table = $('<table width="100%" class="content-border vis nowrap tall" style="opacity:0;"><tr><th style="width: 40%">' + Quasar.lang.get("order_recruit") + '( Limitado em ' + Quasar.config.get("max_recruit_time", 8) + ' horas)</th><th style="width: 40%" >' + Quasar.lang.get("units") + '</th><th style="width: 20%"></th></tr><tr><td><div id="sortable1" style="width: 100%"><img src="graphic/buildings/barracks.png"></div></td><td><div id="sortable2"></div></td><td id="recruitmentType"></td></tr></table></br>');

					$("#contentContainer").before($main_table);
					
					var status = Quasar.train.isSequential();
					
					$sequencial = $('<label><input type="radio" name="type" ' + (status ? 'checked' : '' )+ '>Sequêncial</label>').on('click', function(){						
						Quasar.config.set("sequential_recruitment", true);
						Quasar.train.UI.updateType(); 
					});
					
					$quantitativo = $('<label><input type="radio" name="type" ' + (status ? '' : 'checked' ) + '>Quantitativo</label>').on('click', function(){						
						Quasar.config.set("sequential_recruitment", false);
						Quasar.train.UI.updateType();
					});
					
					$recruitType = $("#recruitmentType");
					$recruitType.append( $sequencial );
					$recruitType.append("</br>");
					$recruitType.append( $quantitativo );					
				
					Quasar.train.UI.updateType();
					$main_table.fadeTo(1000, 1);					
				},
				updateType: function() {
					var $sortable1 = $("#sortable1");
					var $sortable2 = $("#sortable2");
					var unit = null;
					var tropas = null;
					var i;
					
					//Limpa o os dois campos
					$sortable1.html("");
					$sortable2.html("");

					//Adiciona itens a lista
					for (i in Quasar.game.units) {
						unit = Quasar.game.units[i].name;
						$sortable2.append('<span id="'+unit+'"><img src="/graphic/unit/recruit/' + unit + '.png"></span>');
					}
					
					$sortable1.append('<img src="graphic/buildings/barracks.png">');

					if (Quasar.train.isSequential()) {
						tropas = Quasar.config.get("recruitment_sequential_" + game_data.village.id, []);
						for (i in tropas) {
							unit = tropas[i];
							$sortable1.append('<span id="'+unit+'"><img src="/graphic/unit/recruit/' + unit + '.png"></span>');
						}
						$("#sequential").attr("checked", "checked");
					} else {
						tropas = Quasar.config.get("recruitment_numerical_" + game_data.village.id, []);
						for (i in tropas) {
							unit = tropas[i][0];
							var qtd = tropas[i][1];
							$sortable1.append('<span id="'+unit+'" class="badge1" data-badge="' + qtd + '"><img src="/graphic/unit/recruit/' + unit + '.png"></span>');
						}
						$("#numerical").attr("checked", "checked");
					}

					$sortable1.sortable({
						placeholder : "ui_active",
						forcePlaceholderSize : true,
						cursor : "move",
						revert : true,
						tolerance : "pointer",
						connectWith : "#sortable2",
						stop : function (event, ui) {
							$item = ui.item;
							if( $item.parent().attr("id") == "sortable2" ){
								$item.remove();
							}
							Quasar.train.updateRecruiment();
						}
					}).disableSelection();
					
					$sortable2.sortable({
						placeholder : "ui_active",
						forcePlaceholderSize : true,
						cursor : "move",
						revert : true,
						tolerance : "pointer",
						connectWith : "#sortable1",
						stop : function (event, ui) {						
							$item = ui.item;
							if( $item.parent().attr("id") != "sortable2" ){
								$item.clone().appendTo( $sortable2 );						
								if (!Quasar.train.isSequential() && $item.attr("data-badge") == null) {							
									var qtd = Number( prompt("Quantas unidades deseja recrutar?", 1) );
									if (qtd < 1 )
										qtd = 1;									
									$item.attr("data-badge", qtd);
									$item.addClass("badge1");
								}
							}
							Quasar.train.updateRecruiment();
						}
					}).disableSelection();
					
				}
			}
		},
		utils: {
			stringToSec: function(string) {
				if (typeof string === "undefined")
					return null;
				var str = string.split(":");
				if (str.length < 3)
					return null;
				var sec = 0;
				sec += Number(str[0]) * 60 * 60;
				sec += Number(str[1]) * 60;
				sec += Number(str[2]);
				return Number(sec);
			},
			secToString: function(secs) {
				var hours = Math.floor(secs / (60 * 60));
				var divisor_for_minutes = secs % (60 * 60);
				var minutes = Math.floor(divisor_for_minutes / 60);
				var divisor_for_seconds = divisor_for_minutes % 60;
				var seconds = Math.ceil(divisor_for_seconds);
				return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
			},
			getVillageByID: function(id) {
				for (var item = 0; item < TWMap.villages.length; item++) {
					if (typeof TWMap.villages[item] !== "undefined")
						if (TWMap.villages[item].id == id) {
							return TWMap.villages[item];
						}
				}
				return null;
			},
			random: function(a, b) {
				return Math.floor(Math.random() * (b - a + 1)) + a;
			},
			coordToId: function(coord) {
				if (TWMap === "undefined")
					return null;
				var v = TWMap.villages[coord];
				if (typeof v == "undefined")
					return null;
				return v.id;
			},
			getNextVillage: function() {
				var v = new QJSON("villages", true);
				var coord = game_data.village.coord;
				var ai = v.getIndexOf(coord) + 1;
				if (ai > v.length() - 1) {
					ai = 0;
				}
				return v.get(ai);
			},
			setReload: function(url) {
				var time = Quasar.utils.random(Number(Quasar.config.get("min_rand", 300)), Number(Quasar.config.get("max_rand", 900)));
				console.log("Reloading in " + time + " seconds");
				Quasar.interface.menu.countDown(time, function() {
					if (game_data.player.premium && game_data.player.villages > 1) {
						location.href = $("#village_switch_right").attr("href");
					} else if (game_data.player.villages > 1 && Quasar.utils.getNextVillage() != null) {
						var vid = Quasar.utils.getNextVillage();
						location.href = "?village=" + vid + url;
					} else {
						location.href = "";
					}
				});
			},
			getPrevVillage: function() {
				var v = new QJSON("villages", true);
				var coord = game_data.village.coord;
				var ai = v.getIndexOf(coord) - 1;
				if (ai < 0) {
					ai = v.length() - 1;
				}
				return v.get(ai);
			},
			getDataOld: function(name, defaultValue) {
				var value = localStorage.getItem(name);
				if (!value)
					if (defaultValue == undefined) {
						return '';
					} else {
						this.setData(name, defaultValue);
						return defaultValue;
					}
				var type = value[0];
				value = value.substring(1);
				switch (type) {
					case 'b':
						return value == 'true';
					case 'n':
						return Number(value);
					default:
						return value;
				}
			},
			setDataOld: function(name, value) {
				value = (typeof value)[0] + value;
				localStorage.setItem(name, value);
			},
			getData: function(chave, def) {
				var data = new QJSON(game_data.player.name);
				return data.get(chave) === null ? def : data.get(chave);
			},
			setData: function(chave, value) {
				var data = new QJSON(game_data.player.name);
				data.set(chave, value);
				data.save();
			},
			_GET: function(name, link) {
				if (link === null)
					link = location.href;
				url = link.replace(/.*?\?/, '');
				var itens = url.split("&");
				for (var n = 0; n < itens.length; n++) {
					if (n.match(name) !== null) {
						return decodeURIComponent(itens[n].replace(name + "=", ""));
					}
				}
				return null;
			},
			orderByDis: function(mycoord, coords) {
				var dis = [],
					xa = mycoord.split("|")[0],
					ya = mycoord.split("|")[1],
					xb,
					yb;
				var i;
				if (!(coords instanceof Array)) {
					coords = coords.split(" ");
				}
				for (i = 0; i < coords.length; i++) {
					xb = coords[i].split("|")[0];
					yb = coords[i].split("|")[1];
					dis[i] = Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
				}
				for (i = 0; i < coords.length; i++) {
					for (var a = i + 1; a < coords.length; a++) {
						if (dis[a] < dis[i]) {
							var temp = dis[a];
							dis[a] = dis[i];
							dis[i] = temp;
							var temp2 = coords[a];
							coords[a] = coords[i];
							coords[i] = temp2;
						}
					}
				}
				return coords;
			},
			clean: function(coords) {
				var temp = [];
				if (!(coords instanceof Array)) {
					coords = coords.split(" ");
				}
				for (var i = 0; i < coords.length; i++) {
					if (!temp.indexOf(coords[i]) > -1 && coords[i] !== "")
						temp.push(coords[i]);
				}
				return temp;
			},
			tickTimer: function(timer) {
				var time = timer.endTime - (getLocalTime() + timeDiff);
				if (time <= 0) {
					var parent = timer.element.parent().parent();
					var ele = parent.parent().parent().find("tr.sortable_row");
					parent.remove();
					if (game_data.screen == 'train' || game_data.screen == 'main') {
						Loader.goTo();
					}
					return true;
				}
				formatTime(timer.element, time, false);
				return false;
			}
		}
	};

	String.prototype.replaces = function(a, b) {
		return this.replace(a, b);
	};
	String.prototype.replaceAll = function(de, para) {
		var str = this;
		var pos = str.indexOf(de);
		while (pos > -1) {
			str = str.replace(de, para);
			pos = str.indexOf(de);
		}
		return (str);
	};
	String.prototype.contains = function(a) {
		if (this.indexOf(a) > -1)
			return true;
		else
			return false;
	};
	/*
	Array.prototype.contains = function (a) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == a)
				return true;
		}
		return false;
	};
	Array.prototype.remove = function (o) {
		var index = this.indexOf(o);
		if (index > -1) {
			this.splice(index, 1);
		}
	};
	Array.prototype.removei = function (i) {
		if (i > -1) {
			this.splice(i, 1);
		}
	};
	Array.prototype.swap = function (a, b) {
		var temp = this[a];
		this[a] = this[b];
		this[b] = temp;
	};
	*/
	QJSON = function(name, fromData) {
		if (fromData)
			this.initialize(Quasar.config.get(name, {}));
		else
			this.initialize(name);
	};
	QJSON.prototype = {
		dataname: "",
		cache: {},
		initialize: function(json) {
			if (json.constructor == "".constructor) {
				this.load(json);
			} else {
				this.cache = json;
			}
		},
		load: function(name) {
			this.dataname = name;
			this.cache = JSON.parse(localStorage.getItem(name));
			if (this.cache === null) {
				this.cache = {};
				this.save();
			}
		},
		save: function() {
			localStorage.setItem(this.dataname, JSON.stringify(this.cache));
		},
		get: function(index) {
			if (typeof this.cache[index] !== "undefined") {
				return this.cache[index];
			}
			if (index.constructor == new Number().constructor) {
				var i = 0;
				for (var chave in this.cache) {
					if (i == index) {
						return this.cache[chave];
					}
					i++;
				}
			}
			return null;
		},
		swap: function(chave1, chave2) {
			if (this.get(chave1) === null || this.get(chave2) === null)
				return;
			var temp = this.get(chave1);
			this.set(chave1, this.get(chave2));
			this.set(chave2, temp);
		},
		set: function(name, val) {
			this.cache[name] = val;
		},
		add: function(chave, val) {
			this.set(chave, val);
		},
		remove: function(name) {
			var n = {};
			for (var chave in this.cache) {
				if (chave !== name) {
					n[chave] = this.cache[chave];
				}
			}
			this.cache = n;
		},
		toString: function() {
			return JSON.stringify(this.cache);
		},
		toJSON: function() {
			return this.cache;
		},
		contains: function(chave) {
			if (typeof this.cache[chave] !== "undefined") {
				return true;
			}
			return false;
		},
		length: function() {
			var i = 0;
			for (var chave in this.cache) {
				i++;
			}
			return i;
		},
		first: function() {
			for (var chave in this.cache) {
				return this.cache[chave];
			}
		},
		firstKey: function() {
			for (var chave in this.cache) {
				return chave;
			}
		},
		getIndexOf: function(item) {
			var i = 0;
			for (var chave in this.cache) {
				if (chave == item)
					return i;
				i++;
			}
			return null;
		}
	};
})();
Quasar.report = {
	init : function () {
		Quasar.report.UI.init();
	},
	UI : {
		init : function () {
			$("#content_value").prepend('<div id="menu_script" style="display:none;"><table class="vis nowrap tall" style="width: 100%"><tr><th style="width: 66%">Menu</th></tr><tr><td><input id="clean" class="btn" type="button" value="Clean Villages"></td></tr></table></div>');
			var coord = "";
			$("btn_wall_drop").on("click", function () {
				Quasar.wall.attack(coord[0], coord[1]);
			});
			$("#menu_script").show(1000);
		}
	},
	view : function () {
		var coord_name = $("#attack_info_def .village_anchor a");
		if (coord_name.length < 1) {
			return;
		}
		var coord = coord_name.text().split("(")[1].split(")")[0];

		var wall = $('<td><img src="/graphic/buildings/wall.png" title="Add to drop list"/></td>').on("click", function () {
				Quasar.wall.save(coord, $(this));
			});
		var add = $('<td><img src="/graphic/map/attack.png" title="Add to farm list"/></td>').on("click", function () {
				var coords = Quasar.core.get("coords_" + game_data.village.id, []);
				if (!coords.indexOf(coord) > -1) {
					coords.push(coord);
					Quasar.core.set("coords_" + game_data.village.id, coords);
					$(this).addClass("success");
				} else {
					$(this).addClass("fail");
				}
			});

		var remove = $('<td><img src="/graphic/map/return.png" title="Remove from farm list"/></td>').on("click", function () {
				var coords = Quasar.core.get("coords_" + game_data.village.id, []);
				if (coords.indexOf(coord) > -1) {
					coords.splice(coord, 1);
					Quasar.core.set("coords_" + game_data.village.id, coords);
					$(this).addClass("success");
				} else {
					$(this).addClass("fail");
				}
			});

		var label = $("tr:first", "#attack_results ");
		label.append(wall);
		label.append(add);
		label.append(remove);
	}
};

Quasar.train = {
	init : function () {
		Quasar.train.UI.init();
		if (!Quasar.train.getStatus())
			return;
		if (this.isSequential()) {
			Quasar.train.sequentialRecruitment();
			Quasar.train.UI.updateType();
		} else {
			Quasar.train.numericalRecruitment(0);
			Quasar.train.UI.updateType();
			var recruitBtn = $("input[type='submit']");
			if (!recruitBtn.hasClass("btn-recruit-disabled")) {
				recruitBtn.click();
			}
		}
		Quasar.utils.setReload("&screen=train");
	},
	isSequential : function () {
		return Quasar.core.get("sequential_recruitment", true);
	},
	queueLimite : function () {
		return Number(Quasar.core.get("max_recruit_time", 8)) * 60 * 60;
	},
	numericalRecruitment : function (index) {
		var tropas = Quasar.core.get("recruitment_numerical_" + game_data.village.id, []);

		if (tropas.length < 1 || index > tropas.length - 1) {
			return;
		}

		var unitType = tropas[index][0];
		var unitAmmount = Number(tropas[index][1]);
		var build = Quasar.game.units[unitType].ed;
		var units;

		var ele_unit = $("#" + unitType + "_" + unit_build_block.village_id);
		if (ele_unit.length > 0) {
			var unitCount = Number($("#" + unitType + "_" + unit_build_block.village_id + "_a").text().replaces(")", "").replaces("(", ""));
			//Se existem unidades disponiveise o tempo limite para a fila for maior que 0
			if (unitCount > 0 && this.queueLimite() > 0) {
				if (unitCount >= unitAmmount) {
					units = unitAmmount;
				} else {
					units = unitCount;
				}
				var timeUnit = Quasar.utils.stringToSec(ele_unit.parent().parent().find("span.time").parent().text());
				var plusTime = timeUnit * units;

				//Enquanto o tempo de build for maior que o limite, tira uma unidade,
				//Sai do loop quando o numero de unidades for o suficiente pra manter a fila dentro do limite
				while (this.getQueueTime(build) + plusTime > this.queueLimite() && units > 0) {
					plusTime = timeUnit * (--units);
				}

				if (units > 0) {
					ele_unit.val(units);
					unit_build_block._onchange();

					if (units == unitAmmount) {
						var bkp_tropas = [];

						//Atualiza a array retirando este elemento dela :(
						for (var i = 0; i < tropas.length; i++) {
							if (i != index) {
								bkp_tropas.push(tropas[i]);
							}
						}
						//Decrementa um da var index pra corrigir o tamanho.
						--index;
						tropas = bkp_tropas;
					} else {
						tropas[index][1] = unitAmmount - units;
					}

					Quasar.core.set("recruitment_numerical_" + game_data.village.id, tropas);
				}

				//Tenta a proxima unidade independente do que acontecer
				this.numericalRecruitment(++index);
			}
		}
	},
	sequentialRecruitment : function () {
		var tropas = Quasar.core.get("recruitment_sequential_" + game_data.village.id, []);
		var index = Quasar.core.get("train_index_" + game_data.village.id, 0);
		if (tropas.length < 1)
			return;
		if (index > (tropas.length - 1))
			index = 0;
		var unitType = tropas[index];
		var build = Quasar.game.units[unitType].ed;
		var ele_unit = $("#" + unitType + "_" + unit_build_block.village_id);
		if (ele_unit.length > 0) {
			var unitCount = Number($("#" + unitType + "_" + unit_build_block.village_id + "_a").text().replaces(")", "").replaces("(", ""));
			//Se existem unidades disponiveis
			if (unitCount >= 1) {
				var troops = Number(ele_unit.val()) + 1;
				var timeUnit = Quasar.utils.stringToSec(ele_unit.parent().parent().find("span.time").parent().text());
				var plusTime = timeUnit * troops;
				console.log(build, " ", this.getQueueTime(build));
				if (this.getQueueTime(build) + plusTime < this.queueLimite()) {
					ele_unit.val(troops);
					Quasar.core.set("train_index_" + game_data.village.id, ++index);
					unit_build_block._onchange();
					this.sequentialRecruitment();
					var recruitBtn = $("input[type='submit']");
					if (!recruitBtn.hasClass("btn-recruit-disabled")) {
						recruitBtn.click();
						setTimeout(Loader.goTo, 2 * 1000);
					}
					return;
				}
			}
		}
	},
	getQueueTime : function (build) {
		if ($("#trainqueue_" + build).length < 1)
			return 0;
		var time = 0;
		$("#trainqueue_" + build + " .sortable_row").each(function () {
			var stime = $(this).find("td:eq(1)").text();
			time += Quasar.utils.stringToSec(stime);
		});
		time += Quasar.utils.stringToSec($("#trainqueue_wrap_" + build + " td:eq(1)").text());
		return time;
	},
	getStatus : function () {
		return Quasar.core.get("auto_train", false);
	},
	setStatus : function (status) {
		Quasar.core.set("auto_train", status);
	},
	updateRecruiment : function () {
		if (!Quasar.train.isSequential()) {
			var temp = [];
			$("#sortable1").find("span").each(function () {
				var $this = $(this);
				temp.push([$this.attr("id"), $this.attr("data-badge")]);
			});
			Quasar.core.set("recruitment_numerical_" + game_data.village.id, temp);
		}
		//Se é sequencial
		else {
			var sorted = $("#sortable1").sortable("toArray");
			sorted.shift();
			Quasar.core.set("recruitment_sequential_" + game_data.village.id, sorted);
		}
		this.UI.updateType();
	},
	UI : {
		init : function () {
			tickTimer = Quasar.utils.tickTimer;

			var $main_table = $('<table width="100%" class="content-border vis nowrap tall" style="opacity:0;"><tr><th style="width: 40%">' + Quasar.lang.get("order_recruit") + '( Limitado em ' + Quasar.core.get("max_recruit_time", 8) + ' horas)</th><th style="width: 40%" >' + Quasar.lang.get("units") + '</th><th style="width: 20%"></th></tr><tr><td><div id="sortable1" style="width: 100%"><img src="graphic/buildings/barracks.png"></div></td><td><div id="sortable2"></div></td><td id="recruitmentType"></td></tr></table></br>');

			$("#contentContainer").before($main_table);

			var status = Quasar.train.isSequential();

			$sequencial = $('<label><input type="radio" name="type" ' + (status ? 'checked' : '') + '>Sequêncial</label>').on('click', function () {
					Quasar.core.set("sequential_recruitment", true);
					Quasar.train.UI.updateType();
				});

			$quantitativo = $('<label><input type="radio" name="type" ' + (status ? '' : 'checked') + '>Quantitativo</label>').on('click', function () {
					Quasar.core.set("sequential_recruitment", false);
					Quasar.train.UI.updateType();
				});

			$recruitType = $("#recruitmentType");
			$recruitType.append($sequencial);
			$recruitType.append("</br>");
			$recruitType.append($quantitativo);

			Quasar.train.UI.updateType();
			$main_table.fadeTo(1000, 1);
		},
		updateType : function () {
			var $sortable1 = $("#sortable1");
			var $sortable2 = $("#sortable2");
			var unit = null;
			var tropas = null;
			var i;

			//Limpa o os dois campos
			$sortable1.html("");
			$sortable2.html("");

			//Adiciona itens a lista
			for (i in Quasar.game.units) {
				unit = Quasar.game.units[i].name;
				$sortable2.append('<span id="' + unit + '"><img src="/graphic/unit/recruit/' + unit + '.png"></span>');
			}

			$sortable1.append('<img src="graphic/buildings/barracks.png">');

			if (Quasar.train.isSequential()) {
				tropas = Quasar.core.get("recruitment_sequential_" + game_data.village.id, []);
				for (i in tropas) {
					unit = tropas[i];
					$sortable1.append('<span id="' + unit + '"><img src="/graphic/unit/recruit/' + unit + '.png"></span>');
				}
				$("#sequential").attr("checked", "checked");
			} else {
				tropas = Quasar.core.get("recruitment_numerical_" + game_data.village.id, []);
				for (i in tropas) {
					unit = tropas[i][0];
					var qtd = tropas[i][1];
					$sortable1.append('<span id="' + unit + '" class="badge1" data-badge="' + qtd + '"><img src="/graphic/unit/recruit/' + unit + '.png"></span>');
				}
				$("#numerical").attr("checked", "checked");
			}

			$sortable1.sortable({
				placeholder : "ui_active",
				forcePlaceholderSize : true,
				cursor : "move",
				revert : true,
				tolerance : "pointer",
				connectWith : "#sortable2",
				stop : function (event, ui) {
					$item = ui.item;
					if ($item.parent().attr("id") == "sortable2") {
						$item.remove();
					}
					Quasar.train.updateRecruiment();
				}
			}).disableSelection();

			$sortable2.sortable({
				placeholder : "ui_active",
				forcePlaceholderSize : true,
				cursor : "move",
				revert : true,
				tolerance : "pointer",
				connectWith : "#sortable1",
				stop : function (event, ui) {
					$item = ui.item;
					if ($item.parent().attr("id") != "sortable2") {
						$item.clone().appendTo($sortable2);
						if (!Quasar.train.isSequential() && $item.attr("data-badge") == null) {
							var qtd = Number(prompt("Quantas unidades deseja recrutar?", 1));
							if (qtd < 1)
								qtd = 1;
							$item.attr("data-badge", qtd);
							$item.addClass("badge1");
						}
					}
					Quasar.train.updateRecruiment();
				}
			}).disableSelection();

		}
	}
};

Quasar.utils = {
	stringToSec : function (string) {
		if (typeof string === "undefined")
			return null;
		var str = string.split(":");
		if (str.length < 3)
			return null;
		var sec = 0;
		sec += Number(str[0]) * 60 * 60;
		sec += Number(str[1]) * 60;
		sec += Number(str[2]);
		return Number(sec);
	},
	secToString : function (secs) {
		var hours = Math.floor(secs / (60 * 60));
		var divisor_for_minutes = secs % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);
		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);
		return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
	},
	getVillageByID : function (id) {
		for (var item = 0; item < TWMap.villages.length; item++) {
			if (typeof TWMap.villages[item] !== "undefined")
				if (TWMap.villages[item].id == id) {
					return TWMap.villages[item];
				}
		}
		return null;
	},
	random : function (a, b) {
		return Math.floor(Math.random() * (b - a + 1)) + a;
	},
	coordToId : function (coord) {
		if (TWMap === "undefined")
			return null;
		var v = TWMap.villages[coord];
		if (typeof v == "undefined")
			return null;
		return v.id;
	},
	getNextVillage : function () {
		var v = new QJSON("villages", true);
		var coord = game_data.village.coord;
		var ai = v.getIndexOf(coord) + 1;
		if (ai > v.length() - 1) {
			ai = 0;
		}
		return v.get(ai);
	},
	setReload : function (url) {
		var time = Quasar.utils.random(Number(Quasar.core.get("min_rand", 300)), Number(Quasar.core.get("max_rand", 900)));
		console.log("Reloading in " + time + " seconds");
		Quasar.interface.menu.countDown(time, function () {
			if (game_data.player.premium && game_data.player.villages > 1) {
				location.href = $("#village_switch_right").attr("href");
			} else if (game_data.player.villages > 1 && Quasar.utils.getNextVillage() != null) {
				var vid = Quasar.utils.getNextVillage();
				location.href = "?village=" + vid + url;
			} else {
				location.href = "";
			}
		});
	},
	getPrevVillage : function () {
		var v = new QJSON("villages", true);
		var coord = game_data.village.coord;
		var ai = v.getIndexOf(coord) - 1;
		if (ai < 0) {
			ai = v.length() - 1;
		}
		return v.get(ai);
	},
	getDataOld : function (name, defaultValue) {
		var value = localStorage.getItem(name);
		if (!value)
			if (defaultValue == undefined) {
				return '';
			} else {
				this.setData(name, defaultValue);
				return defaultValue;
			}
		var type = value[0];
		value = value.substring(1);
		switch (type) {
		case 'b':
			return value == 'true';
		case 'n':
			return Number(value);
		default:
			return value;
		}
	},
	setDataOld : function (name, value) {
		value = (typeof value)[0] + value;
		localStorage.setItem(name, value);
	},
	getData : function (chave, def) {
		var data = new QJSON(game_data.player.name);
		return data.get(chave) === null ? def : data.get(chave);
	},
	setData : function (chave, value) {
		var data = new QJSON(game_data.player.name);
		data.set(chave, value);
		data.save();
	},
	_GET : function (name, link) {
		if (link === null)
			link = location.href;
		url = link.replace(/.*?\?/, '');
		var itens = url.split("&");
		for (var n = 0; n < itens.length; n++) {
			if (n.match(name) !== null) {
				return decodeURIComponent(itens[n].replace(name + "=", ""));
			}
		}
		return null;
	},
	orderByDis : function (mycoord, coords) {
		var dis = [],
		xa = mycoord.split("|")[0],
		ya = mycoord.split("|")[1],
		xb,
		yb;
		var i;
		if (!(coords instanceof Array)) {
			coords = coords.split(" ");
		}
		for (i = 0; i < coords.length; i++) {
			xb = coords[i].split("|")[0];
			yb = coords[i].split("|")[1];
			dis[i] = Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
		}
		for (i = 0; i < coords.length; i++) {
			for (var a = i + 1; a < coords.length; a++) {
				if (dis[a] < dis[i]) {
					var temp = dis[a];
					dis[a] = dis[i];
					dis[i] = temp;
					var temp2 = coords[a];
					coords[a] = coords[i];
					coords[i] = temp2;
				}
			}
		}
		return coords;
	},
	clean : function (coords) {
		var temp = [];
		if (!(coords instanceof Array)) {
			coords = coords.split(" ");
		}
		for (var i = 0; i < coords.length; i++) {
			if (!temp.indexOf(coords[i]) > -1 && coords[i] !== "")
				temp.push(coords[i]);
		}
		return temp;
	},
	tickTimer : function (timer) {
		var time = timer.endTime - (getLocalTime() + timeDiff);
		if (time <= 0) {
			var parent = timer.element.parent().parent();
			var ele = parent.parent().parent().find("tr.sortable_row");
			parent.remove();
			if (game_data.screen == 'train' || game_data.screen == 'main') {
				Loader.goTo();
			}
			return true;
		}
		formatTime(timer.element, time, false);
		return false;
	}
};

Quasar.wall = {
	init : function () {
		if (!Quasar.wall.getStatus())
			return false;
		var units = this.getUnits();
		var coordsStorage = Quasar.core.get("wall_coords", []);
		if (coordsStorage.length <= 0 || !Quasar.wall.hasUnits()) {
			return false;
		}
		Quasar.wall.cleanInputs();
		for (var i = 0; i < units.length; i++) {
			$("#unit_input_" + units[i][0]).val(units[i][1]);
		}
		var coords = Quasar.utils.orderByDis(game_data.village.coord, coordsStorage);
		var current = coords[0];
		$("input[name='input']").val(current);
		coords.shift();
		Quasar.core.set("wall_coords", coords);
		$("#target_attack").click();
		return true;
	},
	cleanInputs : function () {
		$('.unitsInput').each(function () {
			$(this).val(0);
		});
	},
	getUnits : function () {
		var units = [];
		units.push(["spy", Quasar.core.get("wall_drop_spy", 1)]);
		units.push(["ram", Quasar.core.get("wall_drop_ram", 15)]);
		units.push(["axe", Quasar.core.get("wall_drop_axe", 30)]);
		return units;
	},
	hasUnits : function () {
		var units = this.getUnits();
		for (var i = 0; i < units.length; i++) {
			var t = $("#unit_input_" + units[i][0]).next("a").text().match(/\d+/g)[0];
			if (Number(t) < Number(units[i][1])) {
				return false;
			}
		}
		return true;
	},
	canAttack : true,
	attack : function (x, y, report_id) {
		if (!Quasar.wall.canAttack) {
			$("#" + report_id).parent().addClass("fail");
			return;
		}
		var id = game_data.village.id;
		var data = {
			x : x,
			y : y,
			attack : true
		};
		for (var unit in Quasar.game.units) {
			data[unit] = 0;
		}
		data.spy = Quasar.core.get("wall_drop_spy", 1);
		data.ram = Quasar.core.get("wall_drop_ram", 15);
		data.axe = Quasar.core.get("wall_drop_axe", 45);
		$.ajax({
			url : "?village=" + id + "&try=confirm&screen=place",
			type : "post",
			data : data,
			success : function (html) {
				if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
					$("#" + report_id).parent().addClass("fail");
					Quasar.wall.canAttack = false;
					return false;
				}
				var form = $('form', html);
				$.post(form[0].action, form.serialize(), function (html2) {
					if ($('img[src="?captcha"]', html).length || $('#error', html).length) {
						$("#" + report_id).parent().addClass("fail");
						Quasar.wall.canAttack = false;
						return false;
					}
					$("#" + report_id).parent().addClass("success");
				});
			}
		});
	},
	save : function (coord, $element) {
		var coords = Quasar.core.get("wall_coords", []);
		if (coords.indexOf(coord) === -1) {
			coords.push(coord);
			Quasar.core.set("wall_coords", coords);
			$element.addClass("success");
		} else {
			$element.addClass("fail");
		}
	},
	getStatus : function () {
		return Quasar.core.get("break_wall");
	},
	setStatus : function (status) {
		Quasar.core.set("break_wall", status);
	}
};

QJSON = function (name, fromData) {
	if (fromData)
		this.initialize(Quasar.core.get(name, {}));
	else
		this.initialize(name);
};
QJSON.prototype = {
	dataname : "",
	cache : {},
	initialize : function (json) {
		if (json.constructor == "".constructor) {
			this.load(json);
		} else {
			this.cache = json;
		}
	},
	load : function (name) {
		this.dataname = name;
		this.cache = JSON.parse(localStorage.getItem(name));
		if (this.cache === null) {
			this.cache = {};
			this.save();
		}
	},
	save : function () {
		localStorage.setItem(this.dataname, JSON.stringify(this.cache));
	},
	get : function (index) {
		if (typeof this.cache[index] !== "undefined") {
			return this.cache[index];
		}
		if (index.constructor == new Number().constructor) {
			var i = 0;
			for (var chave in this.cache) {
				if (i == index) {
					return this.cache[chave];
				}
				i++;
			}
		}
		return null;
	},
	swap : function (chave1, chave2) {
		if (this.get(chave1) === null || this.get(chave2) === null)
			return;
		var temp = this.get(chave1);
		this.set(chave1, this.get(chave2));
		this.set(chave2, temp);
	},
	set : function (name, val) {
		this.cache[name] = val;
	},
	add : function (chave, val) {
		this.set(chave, val);
	},
	remove : function (name) {
		var n = {};
		for (var chave in this.cache) {
			if (chave !== name) {
				n[chave] = this.cache[chave];
			}
		}
		this.cache = n;
	},
	toString : function () {
		return JSON.stringify(this.cache);
	},
	toJSON : function () {
		return this.cache;
	},
	contains : function (chave) {
		if (typeof this.cache[chave] !== "undefined") {
			return true;
		}
		return false;
	},
	length : function () {
		var i = 0;
		for (var chave in this.cache) {
			i++;
		}
		return i;
	},
	first : function () {
		for (var chave in this.cache) {
			return this.cache[chave];
		}
	},
	firstKey : function () {
		for (var chave in this.cache) {
			return chave;
		}
	},
	getIndexOf : function (item) {
		var i = 0;
		for (var chave in this.cache) {
			if (chave == item)
				return i;
			i++;
		}
		return null;
	}
};

/*! jQuery UI - v1.11.0 - 2014-08-06
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, sortable.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {
/*!
 * jQuery UI Core 1.11.0
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */


// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.11.0",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	scrollParent: function() {
		var position = this.css( "position" ),
			excludeStaticParent = position === "absolute",
			scrollParent = this.parents().filter( function() {
				var parent = $( this );
				if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
					return false;
				}
				return (/(auto|scroll)/).test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
			}).eq( 0 );

		return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
	},

	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return this.each(function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			});
		};
	})(),

	removeUniqueId: function() {
		return this.each(function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	disableSelection: (function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.bind( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
		};
	})(),

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};


/*!
 * jQuery UI Widget 1.11.0
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */


var widget_uuid = 0,
	widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
	return function( elems ) {
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			try {
				$( elem ).triggerHandler( "remove" );
			// http://bugs.jquery.com/ticket/8235
			} catch( e ) {}
		}
		orig( elems );
	};
})( $.cleanData );

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widget_slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = widget_slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( options === "instance" ) {
					returnValue = instance;
					return false;
				}
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widget_uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled", !!value );

			// If the widget is becoming disabled, then nothing is interactive
			if ( value ) {
				this.hoverable.removeClass( "ui-state-hover" );
				this.focusable.removeClass( "ui-state-focus" );
			}
		}

		return this;
	},

	enable: function() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

var widget = $.widget;


/*!
 * jQuery UI Mouse 1.11.0
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 */


var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

var mouse = $.widget("ui.mouse", {
	version: "1.11.0",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown." + this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click." + this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("." + this.widgetName);
		if ( this._mouseMoveDelegate ) {
			this.document
				.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if ( mouseHandled ) {
			return;
		}

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};

		this.document
			.bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
			return this._mouseUp(event);

		// Iframe mouseup check - mouseup occurred in another document
		} else if ( !event.which ) {
			return this._mouseUp( event );
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		this.document
			.unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
			.unbind( "mouseup." + this.widgetName, this._mouseUpDelegate );

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		mouseHandled = false;
		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});


/*!
 * jQuery UI Sortable 1.11.0
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/sortable/
 */


var sortable = $.widget("ui.sortable", $.ui.mouse, {
	version: "1.11.0",
	widgetEventPrefix: "sort",
	ready: false,
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: "> *",
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000,

		// callbacks
		activate: null,
		beforeStop: null,
		change: null,
		deactivate: null,
		out: null,
		over: null,
		receive: null,
		remove: null,
		sort: null,
		start: null,
		stop: null,
		update: null
	},

	_isOverAxis: function( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	},

	_isFloating: function( item ) {
		return (/left|right/).test(item.css("float")) || (/inline|table-cell/).test(item.css("display"));
	},

	_create: function() {

		var o = this.options;
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine if the items are being displayed horizontally
		this.floating = this.items.length ? o.axis === "x" || this._isFloating(this.items[0].item) : false;

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

		this._setHandleClassName();

		//We're ready to go
		this.ready = true;

	},

	_setOption: function( key, value ) {
		this._super( key, value );

		if ( key === "handle" ) {
			this._setHandleClassName();
		}
	},

	_setHandleClassName: function() {
		this.element.find( ".ui-sortable-handle" ).removeClass( "ui-sortable-handle" );
		$.each( this.items, function() {
			( this.instance.options.handle ?
				this.item.find( this.instance.options.handle ) : this.item )
				.addClass( "ui-sortable-handle" );
		});
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-sortable ui-sortable-disabled" )
			.find( ".ui-sortable-handle" )
				.removeClass( "ui-sortable-handle" );
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- ) {
			this.items[i].item.removeData(this.widgetName + "-item");
		}

		return this;
	},

	_mouseCapture: function(event, overrideHandle) {
		var currentItem = null,
			validHandle = false,
			that = this;

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type === "static") {
			return false;
		}

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		$(event.target).parents().each(function() {
			if($.data(this, that.widgetName + "-item") === that) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, that.widgetName + "-item") === that) {
			currentItem = $(event.target);
		}

		if(!currentItem) {
			return false;
		}
		if(this.options.handle && !overrideHandle) {
			$(this.options.handle, currentItem).find("*").addBack().each(function() {
				if(this === event.target) {
					validHandle = true;
				}
			});
			if(!validHandle) {
				return false;
			}
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var i, body,
			o = this.options;

		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] !== this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment) {
			this._setContainment();
		}

		if( o.cursor && o.cursor !== "auto" ) { // cursor option
			body = this.document.find( "body" );

			// support: IE
			this.storedCursor = body.css( "cursor" );
			body.css( "cursor", o.cursor );

			this.storedStylesheet = $( "<style>*{ cursor: "+o.cursor+" !important; }</style>" ).appendTo( body );
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) {
				this._storedOpacity = this.helper.css("opacity");
			}
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) {
				this._storedZIndex = this.helper.css("zIndex");
			}
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {
			this.overflowOffset = this.scrollParent.offset();
		}

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions) {
			this._cacheHelperProportions();
		}


		//Post "activate" events to possible containers
		if( !noActivation ) {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
			}
		}

		//Prepare possible droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {
		var i, item, itemElement, intersection,
			o = this.options,
			scrolled = false;

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			if(this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
				}

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
				}

			} else {

				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				} else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}

				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				} else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
				$.ui.ddmanager.prepareOffsets(this, event);
			}
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}

		//Rearrange
		for (i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			item = this.items[i];
			itemElement = item.item[0];
			intersection = this._intersectsWithPointer(item);
			if (!intersection) {
				continue;
			}

			// Only put the placeholder inside the current Container, skip all
			// items from other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			//
			// Without this, moving items in "sub-sortables" can cause
			// the placeholder to jitter between the outer and inner container.
			if (item.instance !== this.currentContainer) {
				continue;
			}

			// cannot intersect with itself
			// no useless actions that have been done before
			// no action if the item moved is the parent of the item checked
			if (itemElement !== this.currentItem[0] &&
				this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement &&
				!$.contains(this.placeholder[0], itemElement) &&
				(this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)
			) {

				this.direction = intersection === 1 ? "down" : "up";

				if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		//Call callbacks
		this._trigger("sort", event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) {
			return;
		}

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			$.ui.ddmanager.drop(this, event);
		}

		if(this.options.revert) {
			var that = this,
				cur = this.placeholder.offset(),
				axis = this.options.axis,
				animation = {};

			if ( !axis || axis === "x" ) {
				animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft);
			}
			if ( !axis || axis === "y" ) {
				animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop);
			}
			this.reverting = true;
			$(this.helper).animate( animation, parseInt(this.options.revert, 10) || 500, function() {
				that._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper === "original") {
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			} else {
				this.currentItem.show();
			}

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, this._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) {
				this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			}
			if(this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
				this.helper.remove();
			}

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			str = [];
		o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[\-=_](.+)/));
			if (res) {
				str.push((o.key || res[1]+"[]")+"="+(o.key && o.expression ? res[1] : res[2]));
			}
		});

		if(!str.length && o.key) {
			str.push(o.key + "=");
		}

		return str.join("&");

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			ret = [];

		o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || "id") || ""); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height,
			l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height,
			dyClick = this.offset.click.top,
			dxClick = this.offset.click.left,
			isOverElementHeight = ( this.options.axis === "x" ) || ( ( y1 + dyClick ) > t && ( y1 + dyClick ) < b ),
			isOverElementWidth = ( this.options.axis === "y" ) || ( ( x1 + dxClick ) > l && ( x1 + dxClick ) < r ),
			isOverElement = isOverElementHeight && isOverElementWidth;

		if ( this.options.tolerance === "pointer" ||
			this.options.forcePointerForContainers ||
			(this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) && // Right Half
				x2 - (this.helperProportions.width / 2) < r && // Left Half
				t < y1 + (this.helperProportions.height / 2) && // Bottom Half
				y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = (this.options.axis === "x") || this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = (this.options.axis === "y") || this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement) {
			return false;
		}

		return this.floating ?
			( ((horizontalDirection && horizontalDirection === "right") || verticalDirection === "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection === "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection === "right" && isOverRightHalf) || (horizontalDirection === "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection === "down" && isOverBottomHalf) || (verticalDirection === "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta !== 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta !== 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this._setHandleClassName();
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
	},

	_getItemsAsjQuery: function(connected) {

		var i, j, cur, inst,
			items = [],
			queries = [],
			connectWith = this._connectWith();

		if(connectWith && connected) {
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i]);
				for ( j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
					}
				}
			}
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

		function addItems() {
			items.push( this );
		}
		for (i = queries.length - 1; i >= 0; i--){
			queries[i][0].each( addItems );
		}

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		this.items = $.grep(this.items, function (item) {
			for (var j=0; j < list.length; j++) {
				if(list[j] === item.item[0]) {
					return false;
				}
			}
			return true;
		});

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];

		var i, j, cur, inst, targetData, _queries, item, queriesLength,
			items = this.items,
			queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]],
			connectWith = this._connectWith();

		if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i]);
				for (j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				}
			}
		}

		for (i = queries.length - 1; i >= 0; i--) {
			targetData = queries[i][1];
			_queries = queries[i][0];

			for (j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				item = $(_queries[j]);

				item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			}
		}

	},

	refreshPositions: function(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		var i, item, t, p;

		for (i = this.items.length - 1; i >= 0; i--){
			item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
				continue;
			}

			t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			p = t.offset();
			item.left = p.left;
			item.top = p.top;
		}

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (i = this.containers.length - 1; i >= 0; i--){
				p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			}
		}

		return this;
	},

	_createPlaceholder: function(that) {
		that = that || this;
		var className,
			o = that.options;

		if(!o.placeholder || o.placeholder.constructor === String) {
			className = o.placeholder;
			o.placeholder = {
				element: function() {

					var nodeName = that.currentItem[0].nodeName.toLowerCase(),
						element = $( "<" + nodeName + ">", that.document[0] )
							.addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
							.removeClass("ui-sortable-helper");

					if ( nodeName === "tr" ) {
						that.currentItem.children().each(function() {
							$( "<td>&#160;</td>", that.document[0] )
								.attr( "colspan", $( this ).attr( "colspan" ) || 1 )
								.appendTo( element );
						});
					} else if ( nodeName === "img" ) {
						element.attr( "src", that.currentItem.attr( "src" ) );
					}

					if ( !className ) {
						element.css( "visibility", "hidden" );
					}

					return element;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) {
						return;
					}

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop")||0, 10) - parseInt(that.currentItem.css("paddingBottom")||0, 10)); }
					if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft")||0, 10) - parseInt(that.currentItem.css("paddingRight")||0, 10)); }
				}
			};
		}

		//Create the placeholder
		that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

		//Append it after the actual current item
		that.currentItem.after(that.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(that, that.placeholder);

	},

	_contactContainers: function(event) {
		var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, cur, nearBottom, floating, axis,
			innermostContainer = null,
			innermostIndex = null;

		// get innermost container that intersects with item
		for (i = this.containers.length - 1; i >= 0; i--) {

			// never consider a container that's located within the item itself
			if($.contains(this.currentItem[0], this.containers[i].element[0])) {
				continue;
			}

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue
				if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
					continue;
				}

				innermostContainer = this.containers[i];
				innermostIndex = i;

			} else {
				// container doesn't intersect. trigger "out" event if necessary
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		// if no intersecting containers found, return
		if(!innermostContainer) {
			return;
		}

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			if (!this.containers[innermostIndex].containerCache.over) {
				this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
				this.containers[innermostIndex].containerCache.over = 1;
			}
		} else {

			//When entering a new container, we will find the item with the least distance and append our item near it
			dist = 10000;
			itemWithLeastDistance = null;
			floating = innermostContainer.floating || this._isFloating(this.currentItem);
			posProperty = floating ? "left" : "top";
			sizeProperty = floating ? "width" : "height";
			axis = floating ? "clientX" : "clientY";

			for (j = this.items.length - 1; j >= 0; j--) {
				if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
					continue;
				}
				if(this.items[j].item[0] === this.currentItem[0]) {
					continue;
				}

				cur = this.items[j].item.offset()[posProperty];
				nearBottom = false;
				if ( event[ axis ] - cur > this.items[ j ][ sizeProperty ] / 2 ) {
					nearBottom = true;
				}

				if ( Math.abs( event[ axis ] - cur ) < dist ) {
					dist = Math.abs( event[ axis ] - cur );
					itemWithLeastDistance = this.items[ j ];
					this.direction = nearBottom ? "up": "down";
				}
			}

			//Check if dropOnEmpty is enabled
			if(!itemWithLeastDistance && !this.options.dropOnEmpty) {
				return;
			}

			if(this.currentContainer === this.containers[innermostIndex]) {
				return;
			}

			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
			this._trigger("change", event, this._uiHash());
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
			this.currentContainer = this.containers[innermostIndex];

			//Update the placeholder
			this.options.placeholder.update(this.currentContainer, this.placeholder);

			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		}


	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper === "clone" ? this.currentItem.clone() : this.currentItem);

		//Add the helper to the DOM if that didn't happen already
		if(!helper.parents("body").length) {
			$(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
		}

		if(helper[0] === this.currentItem[0]) {
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };
		}

		if(!helper[0].style.width || o.forceHelperSize) {
			helper.width(this.currentItem.width());
		}
		if(!helper[0].style.height || o.forceHelperSize) {
			helper.height(this.currentItem.height());
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		// This needs to be actually done for all browsers, since pageX/pageY includes this information
		// with an ugly IE fix
		if( this.offsetParent[0] === document.body || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var ce, co, over,
			o = this.options;
		if(o.containment === "parent") {
			o.containment = this.helper[0].parentNode;
		}
		if(o.containment === "document" || o.containment === "window") {
			this.containment = [
				0 - this.offset.relative.left - this.offset.parent.left,
				0 - this.offset.relative.top - this.offset.parent.top,
				$(o.containment === "document" ? document : window).width() - this.helperProportions.width - this.margins.left,
				($(o.containment === "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
			];
		}

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			ce = $(o.containment)[0];
			co = $(o.containment).offset();
			over = ($(ce).css("overflow") !== "hidden");

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}
		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
			scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -											// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var top, left,
			o = this.options,
			pageX = event.pageX,
			pageY = event.pageY,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition === "relative" && !(this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) {
					pageX = this.containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < this.containment[1]) {
					pageY = this.containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > this.containment[2]) {
					pageX = this.containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > this.containment[3]) {
					pageY = this.containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? ( (top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3]) ? top : ((top - this.offset.click.top >= this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? ( (left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2]) ? left : ((left - this.offset.click.left >= this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																// The absolute mouse position
				this.offset.click.top -													// Click offset (relative to the element)
				this.offset.relative.top	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX -																// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay(function() {
			if(counter === this.counter) {
				this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
			}
		});

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var i,
			delayedTriggers = [];

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) {
			this.placeholder.before(this.currentItem);
		}
		this._noFinalSort = null;

		if(this.helper[0] === this.currentItem[0]) {
			for(i in this._storedCSS) {
				if(this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
					this._storedCSS[i] = "";
				}
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		}
		if((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		}

		// Check if the items Container has Changed and trigger appropriate
		// events.
		if (this !== this.currentContainer) {
			if(!noPropagation) {
				delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
				delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
				delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
			}
		}


		//Post events to containers
		function delayEvent( type, instance, container ) {
			return function( event ) {
				container._trigger( type, event, instance._uiHash( instance ) );
			};
		}
		for (i = this.containers.length - 1; i >= 0; i--){
			if (!noPropagation) {
				delayedTriggers.push( delayEvent( "deactivate", this, this.containers[ i ] ) );
			}
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push( delayEvent( "out", this, this.containers[ i ] ) );
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if ( this.storedCursor ) {
			this.document.find( "body" ).css( "cursor", this.storedCursor );
			this.storedStylesheet.remove();
		}
		if(this._storedOpacity) {
			this.helper.css("opacity", this._storedOpacity);
		}
		if(this._storedZIndex) {
			this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
		}

		this.dragging = false;
		if(this.cancelHelperRemoval) {
			if(!noPropagation) {
				this._trigger("beforeStop", event, this._uiHash());
				for (i=0; i < delayedTriggers.length; i++) {
					delayedTriggers[i].call(this, event);
				} //Trigger all delayed events
				this._trigger("stop", event, this._uiHash());
			}

			this.fromOutside = false;
			return false;
		}

		if(!noPropagation) {
			this._trigger("beforeStop", event, this._uiHash());
		}

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if(this.helper[0] !== this.currentItem[0]) {
			this.helper.remove();
		}
		this.helper = null;

		if(!noPropagation) {
			for (i=0; i < delayedTriggers.length; i++) {
				delayedTriggers[i].call(this, event);
			} //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return true;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(_inst) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || $([]),
			position: inst.position,
			originalPosition: inst.originalPosition,
			offset: inst.positionAbs,
			item: inst.currentItem,
			sender: _inst ? _inst.element : null
		};
	}

});



}));