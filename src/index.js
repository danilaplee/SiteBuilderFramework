var SiteBuilderFramework = {
	//@INITIALIZE
	SiteBuilder:function(config) {
		this.config 	= config;
		this.dom 		= SiteBuilderFramework.DomWorker.bind(this)()
		this.storage 	= SiteBuilderFramework.StorageAdapter.bind(this)()
		this.controller = SiteBuilderFramework.Controller.bind(this)()
		return this;
	},
	//@CONTROLLER
	Controller:function() {
		var self = this
		self.dom.buildDefault()
	},
	//@VIEW
	DomWorker:function() {
		var self = this
		self.dom = {}
		self.dom.templates 	= new SiteBuilderTemplates(self.config)
		self.dom.top 		= document.getElementById(self.config.html._top)
		self.dom.first 		= document.getElementById(self.config.html._first)
		self.dom.second 	= document.getElementById(self.config.html._second)
		self.dom.third 		= document.getElementById(self.config.html._third)
		self.dom.fourth 	= document.getElementById(self.config.html._fourth)
		self.dom.fifth 		= document.getElementById(self.config.html._fifth)

		self.dom.buildDefault = function() {
			try{
				self.dom.top.innerHTML 		= self.dom.templates.topNav(self.config.data_structures.company)
				var first_row = JSON.parse(JSON.stringify(self.config.data_structures.cardRow))
					first_row.id = self.storage.uuid4()
				var second_row = JSON.parse(JSON.stringify(self.config.data_structures.imageRow3))
					second_row.id = self.storage.uuid4()
				var third_row = JSON.parse(JSON.stringify(self.config.data_structures.imageRow5))
					third_row.id = self.storage.uuid4()
				var fourth_row = JSON.parse(JSON.stringify(self.config.data_structures.imageRow3))
					fourth_row.id = self.storage.uuid4()
					fourth_row.title = "Работа с возражениями"
				self.dom.first.innerHTML 	= self.dom.templates.cardRow(first_row)
				self.dom.second.innerHTML 	= self.dom.templates.imageRow3(second_row)
				self.dom.third.innerHTML 	= self.dom.templates.imageRow5(third_row)
				self.dom.fourth.innerHTML 	= self.dom.templates.imageRow3(fourth_row)

				var cardRowWithTitle 		= JSON.parse(JSON.stringify(self.config.data_structures.cardRow))
					cardRowWithTitle.id 	= self.storage.uuid4()
					cardRowWithTitle.title  = "Подробная Техническая Информация"

					cardRowWithTitle.items[0].list[0] = "Совершенство"
					cardRowWithTitle.items[0].list[1] = "Технологии"
					cardRowWithTitle.items[0].list[2] = "Маркетинг"

					cardRowWithTitle.items[1].list[0] = "Совершенство"
					cardRowWithTitle.items[1].list[1] = "Технологии"
					cardRowWithTitle.items[1].list[2] = "Маркетинг"

					cardRowWithTitle.items[2].list[0] = "Совершенство"
					cardRowWithTitle.items[2].list[1] = "Технологии"
					cardRowWithTitle.items[2].list[2] = "Маркетинг"
				self.dom.fifth.innerHTML 	= self.dom.templates.cardRow(cardRowWithTitle)

				var rows = 
				{
					first:first_row,
					second:second_row,
					third:third_row,
					fourth:fourth_row,
					fifth:cardRowWithTitle
				}
				self.storage.cache.rows = rows;
				self.dom.bindDefault()
			}
			catch(err) {
				console.error(err)
			}
		}
		self.dom.toggleClass = function(el, change) {
			if(el.className.search(change) > -1) {
				el.className = el.className.replace(" "+change, "")
				el.className = el.className.replace(change, "")
			} else {
				el.className += " "+change
			}
			return el;
		}

		self.dom.bindTopNav = function() {
			
			var name 	= document.getElementById("company_name")
			var logo 	= document.getElementById("company_logo")
			var slogan  = document.getElementById("company_slogan")
			var contacts = {
				"phone" 		:document.getElementById("company_phone"),
				"address" 		:document.getElementById("company_address"),
				"email"			:document.getElementById("company_email"),
				"email_edit" 	:document.getElementById("company_email_input"),
				"address_edit" 	:document.getElementById("company_address_input"),
				"phone_edit" 	:document.getElementById("company_phone_input"),
				"email_c" 		:document.getElementById("company_email_container"),
				"address_c" 	:document.getElementById("company_address_container"),
				"phone_c" 		:document.getElementById("company_phone_container"),

			}

			var titles = {
				name:document.getElementById("company_name"),
				name_edit:document.getElementById("company_name_input"),
				slogan:document.getElementById("company_slogan"),
				slogan_edit:document.getElementById("company_slogan_input")
			}
			var enableEditingForContacts = function(contact) {

				contacts[contact].addEventListener("click", function(){
					contacts[contact+"_edit"].value = contacts[contact].innerHTML
					self.dom.toggleClass(contacts[contact+"_c"], "hidden")
					self.dom.toggleClass(contacts[contact+"_edit"], "hidden")
					contacts[contact+"_edit"].focus()
				})

				contacts[contact+"_edit"].addEventListener("focusout", function() {
					contacts[contact].innerHTML = contacts[contact+"_edit"].value
					self.dom.toggleClass(contacts[contact+"_edit"], "hidden")
					self.dom.toggleClass(contacts[contact+"_c"], "hidden")
				})

			}

			var enableEditingForTitles = function(title){
				titles[title].addEventListener("click", function(){
					titles[title+"_edit"].value = titles[title].innerHTML
					self.dom.toggleClass(titles[title], "hidden");
					self.dom.toggleClass(titles[title+"_edit"], "hidden");
					titles[title+"_edit"].focus()
				})

				titles[title+"_edit"].addEventListener("focusout", function() {
					titles[title].innerHTML = titles[title+"_edit"].value
					self.dom.toggleClass(titles[title+"_edit"], "hidden")
					self.dom.toggleClass(titles[title], "hidden")
				})
			}

			enableEditingForContacts("phone");
			enableEditingForContacts("address");
			enableEditingForContacts("email")

			enableEditingForTitles("name")
			enableEditingForTitles("slogan")
		}


		var bindCard = function(i, row_id) {
			var image 	= document.getElementById('card_'+i+'_image_edit_'+row_id)
			var title 	= document.getElementById('card_'+i+'_title_edit_'+row_id)
			var text  	= document.getElementById('card_'+i+'_text_edit_'+row_id)
			var image_i = document.getElementById('card_'+i+'_image_edit_'+row_id+'_input')
			var title_i = document.getElementById('card_'+i+'_title_edit_'+row_id+'_input')
			var text_i  = document.getElementById('card_'+i+'_text_edit_'+row_id+'_input')

			image.addEventListener("click", function(){
				image_i.value = image.src
				self.dom.toggleClass(image, "hidden")
				self.dom.toggleClass(image_i, "hidden")
				image_i.focus()
			})
			image_i.addEventListener("focusout", function(){
				image.src = image_i.value
				self.dom.toggleClass(image_i, "hidden")
				self.dom.toggleClass(image, "hidden")
			})
			title.addEventListener("click", function(){
				title_i.value = title.innerHTML
				self.dom.toggleClass(title, "hidden")
				self.dom.toggleClass(title_i, "hidden")
				title_i.focus()
			})
			title_i.addEventListener("focusout", function(){
				title.innerHTML = title_i.value
				self.dom.toggleClass(title_i, "hidden")
				self.dom.toggleClass(title, "hidden")
			})
			text.addEventListener("click", function(){
				text_i.innerHTML = text.innerHTML
				self.dom.toggleClass(text, "hidden")
				self.dom.toggleClass(text_i, "hidden")
				text_i.focus()
			})
			text_i.addEventListener("focusout", function(){
				text.innerHTML = text_i.innerHTML
				self.dom.toggleClass(text_i, "hidden")
				self.dom.toggleClass(text, "hidden")
			})
		}

		var bindImage = function(i, row_id) {
			try {
				var image 	= document.getElementById('iItem_'+i+'_image_edit_'+row_id)
				var title 	= document.getElementById('iItem_'+i+'_text_edit_'+row_id)
				var image_i = document.getElementById('iItem_'+i+'_image_edit_'+row_id+'_input')
				var title_i = document.getElementById('iItem_'+i+'_text_edit_'+row_id+'_input')
				image.addEventListener("click", function(){
					image_i.value = image.src
					self.dom.toggleClass(image, "hidden")
					self.dom.toggleClass(image_i, "hidden")
					image_i.focus()
				})
				image_i.addEventListener("focusout", function(){
					image.src = image_i.value
					self.dom.toggleClass(image_i, "hidden")
					self.dom.toggleClass(image, "hidden")
				})
				title.addEventListener("click", function(){
					title_i.value = title.innerHTML
					self.dom.toggleClass(title, "hidden")
					self.dom.toggleClass(title_i, "hidden")
					title_i.focus()
				})
				title_i.addEventListener("focusout", function(){
					title.innerHTML = title_i.value
					self.dom.toggleClass(title_i, "hidden")
					self.dom.toggleClass(title, "hidden")
				})
			}
			catch(err){
				console.error(err)
			}

		}

		self.dom.bindCardRow = function(row) {
			var row_id = row.id
			var d = [0,1,2]

			for (var i = 0; i < d.length; i++) bindCard(i, row_id)
		}

		self.dom.bindCardRows = function() {
			var rows = self.storage.cache.rows
			var r_keys = Object.keys(rows)
			for (var i = 0; i < r_keys.length; i++) if(rows[r_keys[i]].type == "card_row") self.dom.bindCardRow(rows[r_keys[i]])
		}
		self.dom.bindImageRow = function(row) {
			// var type = row.type
			var d = []
			if(row.type == "image_row_3") d = [0,1,2]
			if(row.type == "image_row_5") d = [0,1,2,3,4]

			for (var i = 0; i < d.length; i++) bindImage(i, row.id)
		}
		self.dom.bindImageRows = function() {
			var rows = self.storage.cache.rows
			var r_keys = Object.keys(rows)
			for (var i = 0; i < r_keys.length; i++) if(rows[r_keys[i]].type != "card_row") self.dom.bindImageRow(rows[r_keys[i]])

		}

		self.dom.bindDefault = function() {
			self.dom.bindTopNav()
			self.dom.bindCardRows()
			self.dom.bindImageRows()
		}

		return self.dom;

	},
	//@MODEL
	StorageAdapter:function() 
	{
		var self 				= this
		var gen_db_key 			= function(key) { return self.config.db_key+":"+self.config.db_version+":"+key }
		self.storage 			= {}
		self.storage.cache 		= {}
		self.storage.gen_db_key = gen_db_key
		self.storage.uuid4 = function () {
		    var uuid = '', ii;
		    for (ii = 0; ii < 32; ii += 1) {
		      switch (ii) {
		      case 8:
		      case 20:
		        uuid += '';
		        uuid += (Math.random() * 16 | 0).toString(16);
		        break;
		      case 12:
		        uuid += '';
		        uuid += '4';
		        break;
		      case 16:
		        uuid += '';
		        uuid += (Math.random() * 4 | 8).toString(16);
		        break;
		      default:
		        uuid += (Math.random() * 16 | 0).toString(16);
		      }
		    }
		    return uuid;
		};
		self.storage.set = function(key, value) {
			console.log("====== storage set =======")
			console.log(gen_db_key(key), value)
			console.log("====== storage set =======")
			localStorage.setItem(gen_db_key(key), JSON.stringify(value))
		}
		self.storage.get = function(key)
		{
			return new Promise(function(resolve,reject){
				try {
					var data = JSON.parse(localStorage.getItem(gen_db_key(key)))
					if(data == null) return reject("data is empty");
					resolve(data)
				}
				catch(err) {
					reject(err)
				}
			})
		}
		return self.storage;
	}
}

var SiteBuilderTemplates = function(config) {
	var self = this;
	this.config = config
	this.topNav = function(params) {
		var html = '<div class="row">'
			html +=	'<!-- LEFT -->'
			html += '<div class="col-xs-4 col-sm-4 col-lg-3 text-center">'
			html +=	'	<img id="company_logo" src="'+params.logo+'" class="mainLogo">'
			html +=	'	<h4 class="logoText" id="company_name">'+params.logoText+'</h4>'
			if(self.config.env == "dev") html += '	<input class="base-input hidden" type="text" id="company_name_input" value="'+params.logoText+'">'
			html +=	'</div>'
			html +=	'<!-- CENTER -->'
			html +=	'<div class="col-xs-4 col-sm-4 col-lg-6 text-center slogan-container">'
			html +=	'	<h1 class="slogan" id="company_slogan">'+params.slogan+'</h1>'
			if(self.config.env == "dev") html += '	<input class="base-input hidden" type="text" id="company_slogan_input" value="'+params.slogan+'">'
			html +=	'</div>'

			html +=	'<!-- RIGHT -->'
			html +=	'<div class="col-xs-4 col-sm-4 col-lg-3 headContact">'
			html +=	'	<p id="company_phone_container">Телефон:<span id="company_phone">'+params.phone+'</span></p>'
			if(self.config.env == "dev") html += '	<input class="base-input hidden" type="text" id="company_phone_input" value="'+params.phone+'">'
			html +=	'	<p id="company_email_container">Email:	<span id="company_email">'+params.email+'</span></p>'
			if(self.config.env == "dev") html += '	<input class="base-input hidden" type="text" id="company_email_input" value="'+params.email+'">'
			html +=	'	<p id="company_address_container">Адрес:	<span id="company_address">'+params.address+'</span></p>'
			if(self.config.env == "dev") html += '	<input class="base-input hidden" type="text" id="company_address_input" value="'+params.address+'">'
			html +=	'</div>'
			html +='</div>'

			return html;
	}
	this.card = function(params) {
		var row_id 	= params.id
		var n 		= params.n
		var html = '<div class="col-xs-12 col-sm-4 col-lg-4 text-center">'
			html +=	'<div class="card project-card">'
			html +=	'	  <img class="card-img-top" id="card_'+n+'_image_edit_'+row_id+'" src="'+params.img+'" alt="Проект 1">'
			if(self.config.env == "dev") html += '	<input class="base-input hidden" type="text" id="card_'+n+'_image_edit_'+row_id+'_input" value="'+params.img+'">'
			html +=	'	  <div class="card-block">'
			html +=	'	    <h4 class="card-title" id="card_'+n+'_title_edit_'+row_id+'">'+params.title+'</h4>'
			if(self.config.env == "dev") html += '	<input class="base-input hidden" type="text" id="card_'+n+'_title_edit_'+row_id+'_input" value="'+params.title+'">'
			html +=	'	    <p class="card-text" id="card_'+n+'_text_edit_'+row_id+'">'+params.text+'</p>'
			if(self.config.env == "dev") html += '	<textarea class="base-input hidden" type="text" id="card_'+n+'_text_edit_'+row_id+'_input">'+params.text+'</textarea>'
			html +=	'	  </div>'
			html +=	'	  <ul class="list-group list-group-flush">'
					for (var i = params.list.length - 1; i >= 0; i--) {
			html +=	'<li class="list-group-item">'+params.list[i]+'</li>'
					}
			html +=	'	  </ul>'
			html +=	'	  <div class="card-block">'
					for (var i = 0; i < params.links.length; i++) {
			html +=	'<a href="'+params.links[i].href+'" class="card-link">'+params.links[i].text+'</a><br>'
					}
			html +=	'	  </div>'
			html +=	'	</div>'
			html +=	'</div>'

			return html;
	}

	this.imageItem = function(params) {
		var row_id = params.id
		var n = params.n
		var html  ='<div class="col-xs-12 '+params.column+' text-center process-feature">'
			html +=	'<img id="iItem_'+n+'_image_edit_'+row_id+'" src="'+params.img+'">'
			if(self.config.env == "dev") html += '	<input class="base-input hidden" type="text" id="iItem_'+n+'_image_edit_'+row_id+'_input" value="'+params.img+'">'
			html +=	'<h4 id="iItem_'+n+'_text_edit_'+row_id+'">'+params.text+'</h4>'
			if(self.config.env == "dev") html += '	<input class="base-input hidden text-input" type="text" id="iItem_'+n+'_text_edit_'+row_id+'_input" value="'+params.text+'">'
			html +='</div>'
		return html;
	}


	this.slideTitle = function(params) {

		var html  ='<div class="row">'
			html += '<div class="col-xs-12 text-center">'
			html += '	<hr>'
			html += '	<h4 style="text-transform: uppercase;">'+params.title+'</h4>'
			html += '	<hr>'
			html += '</div>'
			html +='</div>'
		return html

	}

	this.imageRow3 = function(params) {
		var html  =""
		if(params.title) html += self.slideTitle(params)

			html +='<div class="row max-1000" id="row_container_'+params.id+'">'
			for (var i = 0; i < params.items.length; i++) {
				params.items[i].column = "col-lg-4"
				params.items[i].n = i
				params.items[i].id = params.id
				html += self.imageItem(params.items[i])
			}
			html +='</div>'
		return html;

	}

	this.imageRow5 = function(params) {
		var html  = ""
		if(params.title) html += self.slideTitle(params)

			html +='<div class="row max-1000" id="row_container_'+params.id+'">'

			for (var i = 0; i < params.items.length; i++) {
				if(i == 0 || i == 2 || i == 4) params.items[i].column = 'col-lg-2'
				else params.items[i].column = 'col-lg-3'
				params.items[i].n = i
				params.items[i].id = params.id	
				html += self.imageItem(params.items[i])
			}
			html +='</div>'

		return html;
	}

	this.cardRow = function(params) {
		var html = ''
		if(params.title) html += self.slideTitle(params)

			html += '<div class="row max-1000" id="row_container_'+params.id+'">'
			for (var i = 0; i < params.items.length; i++) {
				var p    = params.items[i]
					p.id = params.id
					p.n  = i
				html += self.card(p)
			}
			html += '</div>'

		return html;
	}
}


var SiteBuilderFrameworkConfiguration = function(params) {
	//@SITEBUILDER CONFIGURATION
	this.db_key 		= "SiteBuilder"
	this.db_version 	= "0.5.2"
	this.env 			= "dev"
 
	// //@HTML INTEGRATION
	this.html = 
	{
		_first: 	"first_slide",
		_second: 	"second_slide",
		_third: 	"third_slide",
		_fourth: 	"fourth_slide",
		_fifth: 	"fifth_slide",
		_add_slide: "add_slide",
		_top: 		"top_nav"
	}

	this.params = params;


	/////////@MODEL/////////

	var card = {
			title:"Card title",
			img:"http://media.rightmove.co.uk/dir/crop/10:9-16:9/69k/68839/48031953/68839_7381294_IMG_01_0000_max_476x317.jpg",
			text:"Some quick example text to build on the card title and make up the bulk of the card`s content.",
			links:[
				{
				 	"href":"#",
				 	"text":"Card link",
				},
				{
				 	"href":"#",
				 	"text":"Another link",
				}
			],
			list:[]
	}
	var image_w_text  = {
		img:"http://media.rightmove.co.uk/dir/crop/10:9-16:9/69k/68839/48031953/68839_7381294_IMG_01_0000_max_476x317.jpg",
		text:"Hello World!"
	}
	var image_w_n_text  = {
		img:"http://media.rightmove.co.uk/dir/crop/10:9-16:9/69k/68839/48031953/68839_7381294_IMG_01_0000_max_476x317.jpg",
		text:""
	}

	this.data_structures = 
	{
		company:{
			logo:"logo1.svg",
			logoText:"СтройДом <br> Технологии",
			slogan:"Строим наверняка!",
			phone:"+79991119999",
			email:"admin@domplanstroi",
			address:"Москва, ул. Домовая 15"
		},
		card: card,
		cardRow: {
			type:"card_row",
			items:[
				card,
				card,
				card
			],
		},
		image_w_text: image_w_text,
		imageRow3: {
			title:"Построенные обьекты",
			type:"image_row_3",
			items: [
				image_w_text,
				image_w_text,
				image_w_text
			]
		},
		imageRow5: {
			title:"Технология",
			type:"image_row_5",
			items: [
				image_w_n_text,
				image_w_n_text,
				image_w_n_text,
				image_w_n_text,
				image_w_n_text
			]
		}
	}

	/////////@MODEL/////////
}
var siteEngine = new SiteBuilderFramework.SiteBuilder(new SiteBuilderFrameworkConfiguration())