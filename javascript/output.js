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


function generate(){	
	
	var xml_window = g('xml');
	
	xml_window.innerHTML = "";
	
	if (document.metadata_form.output_format[0].checked == true){   // if output format is imdi
	
		// initiate object for imdi_structure class
		xml_strings = new imdi_generator();
		var output_format = "IMDI";
	}
	
	else if (document.metadata_form.output_format[1].checked == true){
	
		xml_strings = new cmdi_generator();
		var output_format = "CMDI";
	}
	
	else { 
		return alertify.alert("No output format has been specified. Sorry, this should not have happened.");
	}
	
	var div = document.createElement("div");
	div.className = "output_div";
	xml_window.appendChild(div);

	div.innerHTML = "<h1>"+output_format+" Corpus</h1><br>";

	var h3 = document.createElement("h3");
	div.appendChild(h3);
	
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
	
		var div = document.createElement("div");
		div.className = "output_div";
		xml_window.appendChild(div);
		
		var h1 = document.createElement("h1");
		h1.innerHTML = output_format + " Session " + (s+1);
		div.appendChild(h1);
		
		var h3 = document.createElement("h3");
		div.appendChild(h3);	
		
		var a = document.createElement("a");
		a.href = "#";
		a.innerHTML = "<img class=\"module_icon\" src=\"img/icons/save.png\"> Download";
		
		a.addEventListener("click", function(num){
			return function(){
				save_session(num);
			}
		}(s) );
		
		h3.appendChild(a);
		
		var textarea = document.createElement("textarea");
		textarea.id = "textarea_session_"+s;
		textarea.className = "xml_textarea";
		textarea.cols = output_textarea_columns;
		textarea.rows = output_textarea_rows;
	
		textarea.innerHTML = xml_strings.sessions[s];
	
		div.appendChild(textarea);
	}
	
}


function getOutputFormat(){


	if (document.metadata_form.output_format[0].checked == true){   // if output format is imdi
		return "IMDI";	
	} 

	else if (document.metadata_form.output_format[1].checked == true){
		return "CMDI";
	}
	
	else { 
		document.write("No output format has been specified. Sorry, this should not have happened."); 
	}
}

 
function export_corpus(){
 
	save_corpus();
 
	for (var s=0;s<sessions.length;s++){
		save_session(s);
	}
 
}
  

  
function save_corpus(){

	save_file(g("textarea_corpus").value,get("corpus_name")+"."+getOutputFormat().toLowerCase(), "text/xml;charset=utf-8");

}


function save_session(session){

	save_file(g("textarea_session_"+session).value,get("session_"+sessions[session].id+"_session_name")+"."+getOutputFormat().toLowerCase(), "text/xml;charset=utf-8");

}


function save_file(text, filename, mime_type){

	var clean_filename = remove_invalid_chars(filename);

	var blob = new Blob([text], {type: mime_type});
	saveAs(blob, clean_filename);

}


function remove_invalid_chars(string){

	var text = string;
	
	text = text.replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/Ä/g,"Ae").replace(/Ö/g,"Oe").replace(/Ü/g,"Ue").replace(/ß/g,"ss");
	
	text = text.replace(/á/g,"a").replace(/à/g,"a").replace(/Á/g,"A").replace(/À/g,"A");
	text = text.replace(/é/g,"e").replace(/è/g,"e").replace(/É/g,"E").replace(/È/g,"E");
	
	text = text.replace(/\s+/g, '_');


	return text;
}