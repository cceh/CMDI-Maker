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


var elar_output = (function (){

	var my = {};
	
	my.identity = {
		id: "elar_output",
		title: "XML Output",
		icon: "data.png"
	}
	
	
	my.init = function(){
	
		return;
	
	}
	
	
	my.view = function(){
		
		//corpus must have a proper name or no name at all
		if ((elar_project.isCorpusProperlyNamed() || get("corpus_name") == "") && (elar_bundles.areAllSessionsProperlyNamed())){
			
			if (elar_bundles.doesEverySessionHaveAProjectName()){

				my.generate();
				
			}
			
			else {
				
				alertify.set({ labels: {
					ok     : "OK"
				} });
				
				alertify.alert("Every session must have a project name!");
			
				APP.view(elar_bundle);
			
			}
			
		}
		
		else {
			
			alertify.set({ labels: {
				ok     : "OK"
			} });
			
			//if corpus has a name, but an invalid one
			if (!elar_project.isCorpusProperlyNamed() && get("corpus_name") != ""){   //show corpus
				APP.view(elar_project);
				alertify.alert("The corpus must have a proper name or no name at all.<br>Not allowed chars are: " + not_allowed_chars);
			
			}
			
			else {  //show sessions
				APP.view(elar_bundle);
				alertify.alert("Every session must have a proper name.<br>Unnamed sessions are not allowed.<br>Not allowed chars are: " + not_allowed_chars);
			}
		}
	}
	

	my.functions = [
		{
			id: "link_export_corpus",
			icon: "download.png",
			label: "Download Corpus including all Sessions",
			onclick: function() { elar_output.export_corpus(); }
		}
	
	];
	

	my.generate = function (){	
		
		var xml_window = g('VIEW_elar_output');
		
		xml_window.innerHTML = "";
		
		// initiate object for imdi_structure class
		xml_strings = new elar_cmdi_generator();
		var output_format = "CMDI";

		//if corpus is to be created
		if (get("corpus_name") != ""){
			dom.createXMLOutputDIV(xml_window, output_format + " Corpus", "textarea_corpus", xml_strings.corpus,
				function(num){
					return function(){
						output.save_corpus();
					}
				}(s)
			);
		}
		
		for (var s=0;s<session.sessions.length;s++){
			
			dom.createXMLOutputDIV(xml_window, output_format + " Session " + (s+1), "textarea_session_"+s, xml_strings.sessions[s],
				function(num){
					return function(){
						output.save_session(num);
					}
				}(s)
			);
			
		}
		
	}


	my.export_corpus = function (){
	 
		my.save_corpus();
	 
		for (var s=0;s<session.sessions.length;s++){
			my.save_session(s);
		}
	 
	}


	my.save_corpus = function (){

		var output_format_index = dom.getSelectedRadioIndex(document.metadata_form.output_format);
		var file_ending = my.formats[output_format_index].file_ending;

		APP.save_file(g("textarea_corpus").value,get("corpus_name")+"."+file_ending, file_download_header);

	}


	my.save_session = function (session_index){

		var output_format_index = dom.getSelectedRadioIndex(document.metadata_form.output_format);
		var file_ending = my.formats[output_format_index].file_ending;

		APP.save_file(g("textarea_session_"+session_index).value,get("session_"+session.sessions[session_index].id+"_session_name")+"."+file_ending, file_download_header);

	}

	
	return my;
	
})();