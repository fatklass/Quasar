/*
	JSON Handle
*/
var JSONObject = Class.create({
	cache: {},/* cache to the true JSON representation */
	perfectSyntax: true,
	initialize : function( jsonString ){
		if( jsonString == null ){
			this.cache = {};
		}
		else { 
			try{
				this.cache = JSON.parse( jsonString );
			} catch( e ){
				this.cache = {};
				this.perfectSyntax = false;
			}
		}
	},
	/* Check if this Object could be load succefully */
	isValid : function(){
		return this.perfectSyntax;
	},
	/* Setter and Getter for and element*/
	get : function( key ){
		if( this.contains( key ) ){
			return this.cache[ key ];
		}		
		return null;
	},	
	set : function(key, value ){
		this.cache[key] = value;
	},
	/* remove an element from this Object */
	remove : function( key ){
		var newCache = {};
		
		for( var elementKey in this.cache){
			if( elementKey !== key ){
				newCache[ elementKey ] = this.cache[ elementKey ];
			}
		}
		
		this.cache = newCache;
	},
	/* return this string representation */
	toString : function () {
		return JSON.stringify(this.cache);
	},
	/* return this pure JSON*/
	toJSON : function () {
		return this.cache;
	},
	/* Check if an element exist in this Object */
	contains : function (key) {
		if (typeof this.cache[key] !== "undefined") {
			return true;
		}
		return false;
	},
});
/*
	Smart Plusar data storage control
*/
var DataControl = Class.create({
	initialize : function(){		
		this.playerName = game_data.player.name;
	},
	/* Get and Set data from Pulsar data storage structure */
	get : function (key, def) {
		var json = new JSONObject( this.loadPlayerData() );
		if( !json.isValid() ){
			return def;
		}
		var result = json.get( key );
		return result == null ? def : result;
	},
	set : function (key, value) {
		var json = new JSONObject( this.loadPlayerData() );
		json.set(key, value);
		this.savePlayerData( json.toString() );
	},
	/* Load and Save data from playerName storage slot */
	loadPlayerData : function(){
		return this.getFromStorage( this.playerName );
	},
	savePlayerData : function( jsonString ){		
		this.setFromStorage( this.playerName, jsonString);
	},
	/* Get and Set data directly from browser localStorage */
	getFromStorage : function( keyWord ){
		return localStorage.getItem( keyWord );
	},
	setFromStorage : function( keyWord, value ){
		localStorage.setItem( keyWord, value );
	}
});
/*
	Menu Object
*/
var Menu = Class.create({
	itens: [],
	$element: null,
	initialize: function() {
		
	},
	addItem: function( menuItem ){
		this.itens.push( menuItem );
		return this;
	},
	render : function(){
		this.$element = $('<section class="pulsar menu" style="display:none;">');
		//Passa por cada item do array, criando cada elemento e adicionado a si mesmo
		for(var menuItem in this.itens ){
			this.$element.append( menuItem.render() );
		}
		/* Can cast new Menu().render().show() */
		return this;
	},
	show : function(){
		if( this.$element == null ){
			throw "Primeiro você precisa executar o methodo render().";
		} else {
			$( 'body' ).append( this.$element );
			this.$element.show();
		}
		return this;
	}
});
/*
	MenuItem interface
*/
var MenuItem = Class.create({
	$element : null,
	initialize: function( itemText ) {
		this.itemText = itemText;
	},
	getText : function(){
		return this.itemText;
	},
	/* Abstract methods */
	onClick : function(){},
	onTooltipActiveRequest : function(){ return null; },
	render : function(){
		var $element = $('<div class="menuitem"></div>');
		$element.append( this.getText() );
		this.$element = $element;
		return this.$element;
	}
});
/*
	PluginMenuItem
*/
var PluginMenuItem = Class.create(MenuItem, {
	plugin : null,
	onClick : function(){
		this.plugin.toggleEnable();
	},
	onTooltipActiveRequest : function(){
		return "Plugin Menu Item";
	},
	setPlugin : function( quasarPlugin ){
		this.plugin = this;
	}
});
/*
	Pulsar Plugin Interface
*/
var PulsarPlugin = Class.create({
	menuItem: null,
	initialize: function(data_name, lang_string, pages ){
		this.lang_string = lang_string;
		this.data_name = data_name;
		this.pages = pages;
		
		this.menuItem = new PluginMenuItem( lang_string );
		this.menuItem.setPlugin( this );
	},
	getMenuItem : function(){
		return menuItem;
	},
	toggleEnable : function(){
		this.setEnable( !this.isEnable() );
	},
 	setEnable : function( status ){
		var dc = new DataControl();
		dc.set( this.data_name, status);
		
		if( status ){
			this.menuItem.$element.addClass("active");
		} else {
			this.menuItem.$element.removeClass("active");
		}
	},
	isEnable : function(){
		var dc = new DataControl();
		return dc.get(this.data_name, false);
	},
	pre_execute : function( current_page_url ){
		for(var page in this.pages ){
			if( current_page_url.indexOf( page ) > -1 ){
				this.pageInjection();
				this.execute();
				break;
			}
		}
	},
	/* Abstract methods */
	execute : function(){},
	pageInjection: function(){}
});



//Start the Plugins
var plugins = [];
plugins.push( new Farmador() );

var menu = new Menu();

//Add each plugins in menu
for( var plugin in plugins )
	menu.addItem( plugin.getMenuItem() );

//Render and show the mainMenu
menu.render().show();


var url = location.href;
// Execute each loaded plugin
for(var plugin in plugins )
	plugin.pre_execute( url );