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
