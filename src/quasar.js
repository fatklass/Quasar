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