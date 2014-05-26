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


function get_selected_radio_index(radios){


	for (var r=0; r< radios.length; r++){
	
		if (radios[r].checked == true){
		
			return r;
		
		}
	
	}
	
	return 0;

}

function set_radio_index(radios, index){

	if ((!index) || (typeof index == "undefined")){
		var index = 0;
	}

	radios[index].checked = true;

}


function generate(){	
	
	var xml_window = g('xml');
	
	xml_window.innerHTML = "";
	
	//get index of selected output format
	var output_format_index = get_selected_radio_index(document.metadata_form.output_format);
	
	// initiate object for imdi_structure class
	xml_strings = new output_formats[output_format_index].generator_object();
	var output_format = output_formats[output_format_index].output_name;

	var div = new_element("div", "", "output_div", xml_window, "<h1>"+output_format+" Corpus</h1><br>");
	var h3 = new_element("h3", "", "", div);
	
	var a = document.createElement("a");
	a.href = "#";
	a.addEventListener("click", function() {save_corpus();});
	a.innerHTML = "<img class=\"module_icon\" src=\"img/icons/save.png\"> Download";
	
	h3.appendChild(a);

	// Call the imdi corpus, that has just been created by initializing the imdi_structure object
	var textarea = new_element("textarea", "textarea_corpus", "xml_textarea", div, xml_strings.corpus);
	textarea.cols = output_textarea_columns;
	textarea.rows = output_textarea_rows;
	
	for (var s=0;s<sessions.length;s++){
	
		var div = new_element("div", "", "output_div", xml_window);
		var h1 = new_element("h1", "", "", div, output_format + " Session " + (s+1));
		var h3 = new_element("h3", "", "", div);
		
		var a = document.createElement("a");
		a.href = "#";
		a.innerHTML = "<img class=\"module_icon\" src=\"img/icons/save.png\"> Download";
		
		a.addEventListener("click", function(num){
			return function(){
				save_session(num);
			}
		}(s) );
		
		h3.appendChild(a);
		
		var textarea = new_element("textarea", "textarea_session_"+s, "xml_textarea", div, xml_strings.sessions[s]);
		textarea.cols = output_textarea_columns;
		textarea.rows = output_textarea_rows;
	
	}
	
}


function export_corpus(){
 
	save_corpus();
 
	for (var s=0;s<sessions.length;s++){
		save_session(s);
	}
 
}
  

function save_corpus(){

	var output_format_index = get_selected_radio_index(document.metadata_form.output_format);
	var file_ending = output_formats[output_format_index].file_ending;

	save_file(g("textarea_corpus").value,get("corpus_name")+"."+file_ending, file_download_header);

}


function save_session(session){

	var output_format_index = get_selected_radio_index(document.metadata_form.output_format);
	var file_ending = output_formats[output_format_index].file_ending;

	save_file(g("textarea_session_"+session).value,get("session_"+sessions[session].id+"_session_name")+"."+file_ending, file_download_header);

}


function save_file(text, filename, mime_type){

	var clean_filename = remove_invalid_chars(filename);

	var blob = new Blob([text], {type: mime_type});
	saveAs(blob, clean_filename);

}


function get_actors_age(session, actor_id){

	var i = getActorsIndexFromID(actor_id);
	
	if (actors[i].age == ""){   //at first, check, if actor's age hasn't been specified yet
	
		if (document.metadata_form.radio_age_calc[0].checked == true){  //then, check if auto calculate feature in settings is activated
			
			var birthDate = actors[i].birth_date.year + "-" + actors[i].birth_date.month + "-" + actors[i].birth_date.day;
			var sessionDate = get(session_dom_element_prefix+session+"_session_date_year") + "-" + get(session_dom_element_prefix+session+"_session_date_month") + "-" + get(session_dom_element_prefix+session+"_session_date_day"); 
			var age_calc_result = calcAgeAtDate(sessionDate,birthDate);
			
			if (age_calc_result != 0){
			
				console.log("Actor's age successfully calculated");			
				return age_calc_result;
		
			}
			
			else {  //if age calc = 0, age could not be calculated
			
				return "Unspecified";
			
			}
			
		}
		
		else {	//if feature is activated, but age has not been specified
		
			return "Unspecified";
		
		}
	}
	
	else { //if actor's age has been specified
	
		return actors[i].age;
	
	}

}


function remove_invalid_chars(string){

	var text = string;
	text = text.replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/Ä/g,"Ae").replace(/Ö/g,"Oe").replace(/Ü/g,"Ue").replace(/ß/g,"ss");
	text = text.replace(/á/g,"a").replace(/à/g,"a").replace(/Á/g,"A").replace(/À/g,"A");
	text = text.replace(/é/g,"e").replace(/è/g,"e").replace(/É/g,"E").replace(/È/g,"E");
	text = text.replace(/\s+/g, '_');

	return text;
}