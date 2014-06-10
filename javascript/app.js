/*
Copyright 2014 Sebastian Zimmer

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


var APP = (function () {

	var my = {};
	
	my.active_view;

	my.create_output_format_select = function (){

		var parent = g("output_format_select");

		dom.newElement("h2","","",parent, "Output Format");
		
		for (var f=0; f<output_formats.length; f++){
		
			var input = dom.newElement("input","output_format_radio_"+f, "", parent);
			input.type = "radio";
			input.name = "output_format";
			
			dom.newElement("span", "","",parent, " " + output_formats[f].title);
			
			if (f == 0){
				input.checked = true;
			}
			
			dom.newElement("br","","",parent);
			
		}
		
		dom.newElement("br","","",parent);

	}


	my.makeInput = function (parent, field, element_id_prefix, element_class_prefix, session_object){

		switch (field.type){
			
			case "text": {
			
				var input = dom.makeTextInput(parent, field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					(session_object && session_object[field.name] ? session_object[field.name] : ""),
					field.comment
				);
				
				break;
			}
			
			case "date": {
			
				var input = dom.makeDateInput(parent, field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					(session_object && session_object[field.name] ? session_object[field.name]["year"] : ""),
					(session_object && session_object[field.name] ? session_object[field.name]["month"] : ""),				
					(session_object && session_object[field.name] ? session_object[field.name]["day"] : ""),					
					field.comment
				);
				
				break;
			}
			
			case "textarea": {
			
				var input = dom.makeTextarea(
					form_textarea_rows,
					form_textarea_columns,
					parent,
					field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					(session_object && session_object[field.name] ? session_object[field.name] : ""),
					field.comment
				);
				break;
			}			
			
			case "subarea": {
			
				var h3 = document.createElement("h3");
				h3.innerHTML = field.heading;
				parent.title = field.comment;
				parent.appendChild(h3);
				
				if (field.fields){
				
					element_id_prefix += field.name + "_";
			
					for (var f=0; f<field.fields.length; f++){
					
						my.makeInput(parent, field.fields[f], element_id_prefix, element_class_prefix, session_object[field.name]);
				
					}
				
				}
				
				break;
			}
			
			case "column": {
			
				if (field.name != ""){
				
					var td_name = field.name+"_td";
				
				}
				
				else {
				
					var td_name = "td";
				
				}
			
				var td = dom.newElement("td",element_id_prefix+td_name,element_class_prefix+td_name,parent);
				var h2 = dom.newElement("h2","","",td,field.title);
				
				if (field.fields){
				
					if (field.name != ""){
				
						element_id_prefix += field.name + "_";
						
					}
				
					for (var f=0; f<field.fields.length; f++){
					
						my.makeInput(td, field.fields[f], element_id_prefix, element_class_prefix, (session_object ? session_object[field.name] : undefined));
				
					}
				
				}
				
				break;
			}
			
			case "form": {
			
				var table = dom.newElement("table",element_id_prefix+"_table","session_table",parent);
				var tr = dom.newElement("tr","","",table);
				
				for (var f=0; f<field.fields.length; f++){
					
					my.makeInput(tr, field.fields[f], element_id_prefix, element_class_prefix, session_object);
				
				}
				
				break;
			}
			
			case "special": {
			
				if (field.name == "actors"){
				
					dom.newElement("br","","",parent);
					
					dom.newElement("div",element_id_prefix+"actors", "actors", parent);
					dom.newElement("div",element_id_prefix+"addActors_div", "actors", parent);
				
				}
				
				if (field.name == "resources"){
				
					dom.newElement("div",element_id_prefix+"resources", "mfs", parent);
					dom.newElement("div",element_id_prefix+"add_mf_div", "", parent);
				
				}
				
				if (field.name == "actor_languages"){
				
					var p = dom.newElement("p","", "", parent);

					var input = dom.newElement("input","actor_language_select","",p);
					input.type = "text";
					input.size = 1;
					input.name = "actor_language_select";
					
					dom.newElement("span","","",p," ");

					var input = dom.newElement("input","actor_language_search_button","",p);
					input.type = "button";
					input.value = "Search";

					dom.newElement("br","","",p);
					dom.newElement("span","","",p,"or type in ISO code ");
					
					var input = dom.newElement("input","actor_language_iso_input","",p);
					input.type = "text";
					input.size = 1;
					input.name = "actor_language_iso_input";
					
					dom.newElement("span","","",p," ");
					
					var input = dom.newElement("input","actor_language_iso_ok","",p);
					input.type = "button";
					input.value = "OK";			
					
					dom.newElement("div","current_actor_languages_display", "", parent);									

				
				}
				
				break;
			
			}
			
			case "select": {
				var input = dom.makeSelect(
					parent, field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					field.size,
					field.vocabulary,
					(session_object && session_object[field.name] ? session_object[field.name] : ""),
					field.comment
				);
				break;
			}

			case "open_vocabulary": {
				var input = dom.openVocabulary(
					parent, field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					field.size,
					field.vocabulary,
					(session_object && session_object[field.name] ? session_object[field.name] : ""),
					field.comment
				);
				break;
			}
			
			case "check": {
				var input = dom.makeCheckbox(
					parent, field.heading,
					element_id_prefix+field.name,
					element_id_prefix+field.name,
					(session_object && session_object[field.name] ? session_object[field.name] : false),
					field.comment
				);
				break;
			}
			
		}

		if (field.onkeypress){
			input.onkeypress = field.onkeypress;
		}

	}


	my.display_metadata_languages = function (){

		for (var j=0;j<MetadataLanguageIDs.length;j++){

			NewOption = new Option(MetadataLanguageIDs[j][1], MetadataLanguageIDs[j][0], false, true);
			g("metadata_language_select").options[g("metadata_language_select").options.length] = NewOption;
		}
	  
		g("metadata_language_select").selectedIndex = 0;

	}


	my.check_if_first_start = function (){

		var first_start = localStorage.getItem("first_start");
		
		if (first_start == null){  //if there's no data, assume it's the first start
			first_start = true;
		}
		
		
		if (first_start == true){

			localStorage.setItem("first_start", false);
			console.log("First start! Hey there and welcome to CMDI Maker!");
		
		}
		
		else {
		
			alertify.log("Welcome back!", "", 5000);
		
		}

	}


	my.say_hello = function (){


		var index = Math.floor(Math.random() * hellos.length);

		g("hello").innerHTML = hellos[index][0];
		
		g("hello").addEventListener("click", function () {
			alertify.log("This is " + hellos[index][1] + "!");
		});


	}
	
	
	my.hard_reset = function(){

		localStorage.removeItem("actors");
		localStorage.removeItem("form");
		localStorage.removeItem("first_start");
		location.reload();

	}


	my.create_copy_session_options = function (){

		var div = g("copy_sessions_select");
		
		if (!session_form.fields_to_copy){
		
			dom.newElement("span", "", "", div, "This function is currently unavailable!");
			return;
			
		}

		var options = session_form.fields_to_copy;

		for (var c=0; c<options.length; c++){
		
			var input = dom.newElement("input", copy_checkbox_element_prefix+options[c].name, "", div);
			input.type = "checkbox";
			input.checked = true;
			
			dom.newElement("span", "", "", div, " "+options[c].label);
			dom.newElement("br", "", "", div);
		
		}


	}

	
	my.reset_form = function (){
		
		
		g("corpus_name").value = "";
		g("corpus_title").value = "";
		g("corpus_description").value = "";
		
		session.eraseAll();
		content_languages.removeAll();
	}


	my.view = function (id){
		
		if (id == "default"){
			id = "start";
		}
		
		var views = ["wait", "start", "VIEW_corpus", "VIEW_sessions",
		"VIEW_resources", "VIEW_xml_output", "settings", "about", "VIEW_actors"];
		
		if (views.indexOf(id) == -1){
			console.log("Error: Unkown view requested (" + id +")!");
			my.view("default");
			return;
		}
		
		my.active_view = id;
		
		//make all views invisible
		for (var v=0; v<views.length; v++){
			g(views[v]).style.display = "none";
		}

		g("start_window_icon").style.backgroundColor = "";
		
		//unhighlight all workflow icons
		for (var w=0; w<workflow.length; w++){
			g(view_id_prefix + workflow[w].id).style.backgroundColor = "";
		}
		
		g("link_settings").style.backgroundColor = "";
		g("link_about").style.backgroundColor = "";

		g("link_newSession").style.display = "none";
		g("link_save_form").style.display = "none";
		g("link_reset_form").style.display = "none";
		g("link_copy_sessions").style.display = "none";
		g("link_export_corpus").style.display = "none";
		g("link_clear_file_list").style.display = "none";
		g("link_sort_alphabetically").style.display = "none";
		g("link_save_active_actor").style.display = "none";
		g("link_delete_active_actor").style.display = "none";
		g("link_sort_actors_alphabetically").style.display = "none";
		g("link_duplicate_active_actor").style.display = "none";
		g("crps_icon").style.display = "none";
		
		g("module_icons").style.display = "block";
		
		//make the selected view visible
		g(id).style.display = "block";
		
		switch (id){
		
			case "wait": {
				g("module_icons").style.display = "none";
			}
			
			case "start": {
			
				g("start_window_icon").style.backgroundColor = highlight_color;		
				break;			
			
			}
			
			
			case "VIEW_corpus": {
			
				g(view_id_prefix + "corpus").style.backgroundColor = highlight_color;
				
				g("link_save_form").style.display = "inline";
				g("link_reset_form").style.display = "inline";

				break;
			}

			case "VIEW_sessions": {
				g('VIEW_sessions').scrollTop = 0;
				
				g(view_id_prefix + "sessions").style.backgroundColor = highlight_color;
				
				g("link_newSession").style.display = "inline";
				g("link_save_form").style.display = "inline";
				g("link_reset_form").style.display = "inline";
				g("link_copy_sessions").style.display = "inline";
				
				break;
			}

			case "VIEW_actors": {
				
				g(view_id_prefix + "actors").style.backgroundColor = highlight_color;
				
				g("link_save_active_actor").style.display = "inline";
				
				if (actor.active_actor != -1){
					g("link_delete_active_actor").style.display = "inline";
					g("link_duplicate_active_actor").style.display = "inline";
				}
				
				g("link_sort_actors_alphabetically").style.display = "inline";
				
				break;
			}
		
			case "VIEW_xml_output": {
			
				if ((is_corpus_properly_named()) && (session.areAllSessionsProperlyNamed())){
				
					if (session.doesEverySessionHaveAProjectName()){

						g(view_id_prefix + "xml_output").style.backgroundColor = highlight_color;
					
						g("link_export_corpus").style.display = "inline";
			
						output.generate();
					
					}
					
					else {
					
						alertify.set({ labels: {
							ok     : "OK"
						} });
					
						alertify.alert("Every session must have a project name!");
					
						my.view("VIEW_sessions");
					
					
					}
					
					
				}
				
				else {
					
					alertify.set({ labels: {
						ok     : "OK"
					} });
					
					alertify.alert("The corpus and every session must have a proper name.<br>An unnamed corpus or sessions are not allowed.<br>Not allowed chars are: " + not_allowed_chars);
					
					if (!is_corpus_properly_named()){   //show corpus
						my.view("VIEW_corpus");
					}
					
					else {  //show sessions
						my.view("VIEW_sessions");
					}
				}
				
				break;
				
			}

			case "VIEW_resources": {

				g('VIEW_resources').scrollTop = 0;
				
				g(view_id_prefix + "resources").style.backgroundColor = highlight_color;
				
				g("crps_icon").style.display = "inline";
				g("link_clear_file_list").style.display = "inline";
				g("link_sort_alphabetically").style.display = "inline";
				
				break;
			}
			
			case "settings": {
			
				g("link_settings").style.backgroundColor = highlight_color;
				
				break;

			}
			
			
			case "about": {
				
				g("link_about").style.backgroundColor = highlight_color;

				break;
			}
			
		}
	}
	
	
	my.save_file = function (text, filename, mime_type){

		var clean_filename = remove_invalid_chars(filename);

		var blob = new Blob([text], {type: mime_type});
		saveAs(blob, clean_filename);

	}
	
	my.createWorkflow = function (workflow){
	
		var div = g("module_icons");
	
		for (var w=0; w<workflow.length; w++){
		
			if (w!=0){
			
				var arrow = dom.newElement("div","","wizard_arrow",div);
				var image = dom.newElement("img","","wizard_icon",arrow);
				image.src = path_to_icons + "right2.png";
			
			}
			
			var icon = dom.newElement("div",view_id_prefix + workflow[w].id,"icon_div",div);
			var image = dom.newElement("img","","module_icon",icon);
			image.src = path_to_icons + workflow[w].icon;

			dom.newElement("br","","",icon);
			dom.newElement("span","","",icon,workflow[w].title);
			
			icon.addEventListener('click', function(num) {
				return function(){
					APP.view(num);
				}
			}(workflow[w].view));
		}
	
	}
	
	return my;
	
})();
