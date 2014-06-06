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


function create_output_format_select(){

	var parent = g("output_format_select");

	new_element("h2","","",parent, "Output Format");
	
	for (var f=0; f<output_formats.length; f++){
	
		var input = new_element("input","output_format_radio_"+f, "", parent);
		input.type = "radio";
		input.name = "output_format";
		
		new_element("span", "","",parent, " " + output_formats[f].title);
		
		if (f == 0){
			input.checked = true;
		}
		
		new_element("br","","",parent);
		
	}
	
	new_element("br","","",parent);

}


function make_input(parent, field, element_id_prefix, element_class_prefix, session_object){

	switch (field.type){
		
		case "text": {
		
			var input = make_text_input(parent, field.heading,
				element_id_prefix+field.name,
				element_id_prefix+field.name,
				(session_object && session_object[field.name] ? session_object[field.name] : ""),
				field.comment
			);
			
			break;
		}
		
		case "date": {
		
			var input = make_date_input(parent, field.heading,
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
		
			var input = make_textarea(
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
				
					make_input(parent, field.fields[f], element_id_prefix, element_class_prefix, session_object[field.name]);
			
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
		
			var td = new_element("td",element_id_prefix+td_name,element_class_prefix+td_name,parent);
			var h2 = new_element("h2","","",td,field.title);
			
			if (field.fields){
			
				if (field.name != ""){
			
					element_id_prefix += field.name + "_";
					
				}
			
				for (var f=0; f<field.fields.length; f++){
				
					make_input(td, field.fields[f], element_id_prefix, element_class_prefix, (session_object ? session_object[field.name] : undefined));
			
				}
			
			}
			
			break;
		}
		
		case "form": {
		
			var table = new_element("table",element_id_prefix+"_table","session_table",parent);
			var tr = new_element("tr","","",table);
			
			for (var f=0; f<field.fields.length; f++){
				
				make_input(tr, field.fields[f], element_id_prefix, element_class_prefix, session_object);
			
			}
			
			break;
		}
		
		case "special": {
		
			if (field.name == "actors"){
			
				new_element("br","","",parent);
				
				new_element("div",element_id_prefix+"actors", "actors", parent);
				new_element("div",element_id_prefix+"add_actors_div", "actors", parent);
			
			}
			
			if (field.name == "resources"){
			
				new_element("div",element_id_prefix+"resources", "mfs", parent);
				new_element("div",element_id_prefix+"add_mf_div", "", parent);
			
			}
			
			if (field.name == "actor_languages"){
			
				var p = new_element("p","", "", parent);

				var input = new_element("input","actor_language_select","",p);
				input.type = "text";
				input.size = 1;
				input.name = "actor_language_select";
				
				new_element("span","","",p," ");

				var input = new_element("input","actor_language_search_button","",p);
				input.type = "button";
				input.value = "Search";

				new_element("br","","",p);
				new_element("span","","",p,"or type in ISO code ");
				
				var input = new_element("input","actor_language_iso_input","",p);
				input.type = "text";
				input.size = 1;
				input.name = "actor_language_iso_input";
				
				new_element("span","","",p," ");
				
				var input = new_element("input","actor_language_iso_ok","",p);
				input.type = "button";
				input.value = "OK";			
				
				new_element("div","current_actor_languages_display", "", parent);									

			
			}
			
			break;
		
		}
		
		case "select": {
			var input = make_select(
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
			var input = open_vocabulary(
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
			var input = make_checkbox(
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


function display_metadata_languages(){

	for (var j=0;j<MetadataLanguageIDs.length;j++){

		NewOption = new Option(MetadataLanguageIDs[j][1], MetadataLanguageIDs[j][0], false, true);
		g("metadata_language_select").options[g("metadata_language_select").options.length] = NewOption;
	}
  
	g("metadata_language_select").selectedIndex = 0;

}


function check_if_first_start(){

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


function say_hello(){


	var index = Math.floor(Math.random() * hellos.length);

	g("hello").innerHTML = hellos[index][0];


}


function create_copy_session_options(){

	var div = g("copy_sessions_select");
	
	if (!session_form.fields_to_copy){
	
		new_element("span", "", "", div, "This function is currently unavailable!");
		return;
		
	}

	var options = session_form.fields_to_copy;

	for (var c=0; c<options.length; c++){
	
		var input = new_element("input", copy_checkbox_element_prefix+options[c].name, "", div);
		input.type = "checkbox";
		input.checked = true;
		
		new_element("span", "", "", div, " "+options[c].label);
		new_element("br", "", "", div);
	
	}


}

function reset_form(){
	
	
	g("corpus_name").value = "";
	g("corpus_title").value = "";
	g("corpus_description").value = "";
	
	session.erase_all();
	
	RemoveAllContentLanguages();
}



function view(id){
	
	if (id == "default"){
		id = "start";
	}
	
	var views = ["wait", "start", "corpus", "sessions", "media_files", "xml", "settings", "about", "actors"];
	
	if (views.indexOf(id) == -1){
		console.log("Error: Unkown view requested!");
		view("default");
		return;
	}
	
	active_view = id;
	
	for (var v=0; v<views.length; v++){
		g(views[v]).style.display = "none";
	}

	g("start_window_icon").style.backgroundColor = "";
	g("corpus_window_icon").style.backgroundColor = "";
	g("sessions_window_icon").style.backgroundColor = "";
	g("manage_actors_icon").style.backgroundColor = "";
	g("manage_media_files_icon").style.backgroundColor = "";
	g("xml_output_icon").style.backgroundColor = "";
	g("link_settings").style.backgroundColor = "";
	g("link_about").style.backgroundColor = "";

	
	g("link_new_session").style.display = "none";
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
	
	g(id).style.display = "block";
	
	switch (id){
	
		case "wait": {
			g("module_icons").style.display = "none";
		}
		
		case "start": {
		
			g("start_window_icon").style.backgroundColor = highlight_color;		
			break;			
		
		}
		
		
		case "corpus": {
		
			g("corpus_window_icon").style.backgroundColor = highlight_color;
			
			g("link_save_form").style.display = "inline";
			g("link_reset_form").style.display = "inline";

			break;
		}

		case "sessions": {
			g('sessions').scrollTop = 0;
			
			g("sessions_window_icon").style.backgroundColor = highlight_color;
			
			
			g("link_new_session").style.display = "inline";
			g("link_save_form").style.display = "inline";
			g("link_reset_form").style.display = "inline";
			g("link_copy_sessions").style.display = "inline";
			
			break;
		}

		case "actors": {
			
			g("manage_actors_icon").style.backgroundColor = highlight_color;
			
			g("link_save_active_actor").style.display = "inline";
			
			if (actor.active_actor != -1){
				g("link_delete_active_actor").style.display = "inline";
				g("link_duplicate_active_actor").style.display = "inline";
			}
			
			g("link_sort_actors_alphabetically").style.display = "inline";
			
			break;
		}
	
		case "xml": {
		
			if ((is_corpus_properly_named()) && (session.are_all_sessions_properly_named())){
			
				if (session.does_every_session_have_a_project_name()){

					g("xml_output_icon").style.backgroundColor = highlight_color;
				
					g("link_export_corpus").style.display = "inline";
		
					generate();
				
				}
				
				else {
				
					alertify.set({ labels: {
						ok     : "OK"
					} });
				
					alertify.alert("Every session must have a project name!");
				
					view("sessions");
				
				
				}
				
				
			}
			
			else {
				
				alertify.set({ labels: {
					ok     : "OK"
				} });
				
				alertify.alert("The corpus and every session must have a proper name.<br>An unnamed corpus or sessions are not allowed.<br>Not allowed chars are: " + not_allowed_chars);
				
				if (!is_corpus_properly_named()){   //show corpus
					view("corpus");
				}
				
				else {  //show sessions
					view("sessions");
				}
			}
			
			break;
			
		}

		case "media_files": {

			g('media_files').scrollTop = 0;
			
			g("manage_media_files_icon").style.backgroundColor = highlight_color;
			
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
