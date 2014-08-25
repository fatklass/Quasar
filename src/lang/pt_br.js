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
