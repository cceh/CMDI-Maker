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

function get_session_name(session_index){

	if (sessions[session_index].name == ""){
	
		return "Unnamed Session";
		
	}
	
	else {
		return "Session: " + sessions[session_index].name;
	
	}
	
}



function getOptionValuesOfSelect(select){

	var option_values = [];

	for (var o=0; o<select.options.length; o++){
		
		option_values.push(select.options[o].value);
	
	}

	return option_values;


}



function GetFileTypeFromFilename(filename){

	var pos_of_dot = filename.lastIndexOf(".");
	
	return filename.slice(pos_of_dot+1,filename.length).toLowerCase();

}



function GetLanguageObjectIndexFromID(cl_id){

	for (var l=0; l<content_languages.length; l++){
	
		if (content_languages[l][4] == cl_id){
			return l;
		}
	
	}

}

function GetActorLanguageObjectIndexFromID(al_id){

	for (var l=0; l<languages_of_active_actor.length; l++){
	
		if (languages_of_active_actor[l].id == al_id){
			return l;
		}
	
	}




}



function get(name){

	var elem = document.getElementsByName(name)[0];
	
	switch (elem.nodeName){
	
		case "INPUT": return elem.value;
	
		case "TEXTAREA": return elem.value;
	
		case "SELECT": {
			
			if (elem.selectedIndex != -1){
				return elem.options[elem.selectedIndex].value;
			}
			
			else {
				return "";
			}
		}
		
		default: console.log("Function \"get\" has been misused with a "+elem.nodeName+" element. This should not have happened!");
	
	}
}



function g_value(id){

	return document.getElementById(id).options[document.getElementById(id).options.selectedIndex].value;

}


function getActorsIndexFromID(actor_id) {

    for(var i = 0, len = actors.length; i < len; i++) {
        if (actors[i].id == actor_id) return i;
    }
	
    return alert("An error has occured.\nCould not find actors cache index from actor id!\n\nactor_id = " + actor_id);
}




function GetSessionIndexFromID(session_id){

    for(var i = 0; i < sessions.length; i++) {
        if (sessions[i].id == session_id) {
			return i;
		}
    }
	
    alert("An error has occured.\nCould not find session index from session_id!\n\nsession_id = " + session_id);
	console.log(sessions);
	

}


function GetIndexFromResourceID(resource_id){

	for (var s=0;s<sessions.length;s++){
	
		for (var r=0; r<sessions[s].resources.writtenResources.length; r++){
	
			if (sessions[s].resources.writtenResources[r].id == resource_id){
				return r;
			}
		
		}
		
		for (var r=0; r<sessions[s].resources.mediaFiles.length; r++){
	
			if (sessions[s].resources.mediaFiles[r].id == resource_id){
				return r;
			}
		
		}
	
	
	
	}


}


function g(id){

	return document.getElementById(id);

}