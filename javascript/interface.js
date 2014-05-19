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


function display(session_id){
	if (document.getElementById("session"+session_id+"_content").style.display != "none"){
		document.getElementById("session"+session_id+"_content").style.display = "none";
		document.getElementById(session_dom_element_prefix+session_id+"_expand_img").src=path_to_images+"icons/up.png";
		sessions[GetSessionIndexFromID(session_id)].expanded = false;
	}
	
	else {
		document.getElementById("session"+session_id+"_content").style.display = "block";
		document.getElementById(session_dom_element_prefix+session_id+"_expand_img").src=path_to_images+"icons/down.png";
		sessions[GetSessionIndexFromID(session_id)].expanded = true;
	}
}



function display_metadata_languages(){

	for (var j=0;j<MetadataLanguageIDs.length;j++){

		NewOption = new Option(MetadataLanguageIDs[j][1], MetadataLanguageIDs[j][0], false, true);
		g("metadata_language_select").options[g("metadata_language_select").options.length] = NewOption;
	}
  
	g("metadata_language_select").selectedIndex = 0;

}




function reset_form(){
	
	
	g("corpus_name").value = "";
	g("corpus_title").value = "";
	g("corpus_description").value = "";
	
	erase_all_sessions();
	
	RemoveAllContentLanguages();
}



function view(id){
	//0=metadata editor 1=actors, 2=xml output, 3=resource files, 4=settings, 5=about, 6=start
	
	if (id == "default"){
		id = "start";
	}
	
	var views = ["wait", "start", "sessions", "media_files", "xml", "settings", "about", "actors"];
	
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
			
			if (active_actor != -1){
				g("link_delete_active_actor").style.display = "inline";
				g("link_duplicate_active_actor").style.display = "inline";
			}
			
			g("link_sort_actors_alphabetically").style.display = "inline";
			
			break;
		}
	
		case "xml": {
		
			if ((is_corpus_properly_named()) && (are_all_sessions_properly_named())){
			
				if (does_every_session_have_a_project_name()){

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
					view("start");
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
		
		case "start": {
		
			g("start_window_icon").style.backgroundColor = highlight_color;
			
			g("link_save_form").style.display = "inline";
			g("link_reset_form").style.display = "inline";

			break;
		}
		
	}
}
