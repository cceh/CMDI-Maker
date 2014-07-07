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


imdi_environment.workflow[4] = (function (){
	'use strict';

	var my = {};
	var corpus;
	var session;
	
	my.identity = {
		id: "xml_output",
		title: "XML Output",
		icon: "data.png"
	};
	
	
	my.init = function(){
	
		corpus = imdi_environment.workflow[0];
		session = imdi_environment.workflow[3];
		my.createOutputFormatSelect(my.formats);
	
	};
	
	
	my.formats = [
		{
			title: "IMDI",
			name: "imdi",
			file_ending: "imdi",
			output_name: "IMDI",
			generator_object: imdi_environment.imdi_generator,
		},
		{
			title: "CMDI with IMDI Profile",
			name: "cmdi-imdi",
			file_ending: "cmdi",
			output_name: "CMDI",
			generator_object: imdi_environment.cmdi_generator,
		}
	];
	
	
	my.createOutputFormatSelect = function (formats){

		var parent = g("output_format_select");

		for (var f=0; f<formats.length; f++){
		
			var input = dom.newElement("input","output_format_radio_"+f, "", parent);
			input.type = "radio";
			input.name = "output_format";
			input.value = f;
			
			dom.newElement("span", "","",parent, " " + formats[f].title);
			
			if (f === 0){
				input.checked = true;
			}
			
			dom.newElement("br","","",parent);
			
		}

	};
	
	
	my.view = function(){
	
		//if there is nothing to be done, return
		if ((get("corpus_name") === "") && (session.sessions.length === 0)){
		
			alertify.set({ labels: {
				ok     : "OK"
			} });
			alertify.alert("You must create some sessions first!");
			APP.view(session);
			return;
		}
		
		//corpus must have a proper name or no name at all
		if ((corpus.isCorpusProperlyNamed() || get("corpus_name") === "") && (session.areAllSessionsProperlyNamed())){
			
			if (session.doesEverySessionHaveAProjectName()){

				my.generate();
				
			}
			
			else {
				
				alertify.set({ labels: {
					ok     : "OK"
				} });
				
				alertify.alert("Every session must have a project name!");
			
				APP.view(session);
			
			}
			
		}
		
		else {
			
			alertify.set({ labels: {
				ok     : "OK"
			} });
			
			//if corpus has a name, but an invalid one
			if (!corpus.isCorpusProperlyNamed() && get("corpus_name") !== ""){   //show corpus
				APP.view(corpus);
				alertify.alert("The corpus must have a proper name or no name at all.<br>Not allowed chars are: " + APP.CONF.not_allowed_chars);
			
			}
			
			else {  //show sessions
				APP.view(session);
				alertify.alert("Every session must have a proper name.<br>Unnamed sessions are not allowed.<br>Not allowed chars are: " + APP.CONF.not_allowed_chars);
			}
		}
	};
	

	my.functions = [
		{
			id: "link_export_corpus",
			icon: "download.png",
			label: "Download Corpus including all Sessions",
			onclick: function(){APP.saveAllOutputFiles();}
		}
	
	];
	

	my.generate = function (){
		var filename;
		
		var xml_window = g('VIEW_xml_output');
		
		xml_window.innerHTML = "";
		
		//get index of selected output format
		var output_format_index = dom.getSelectedRadioIndex(document.getElementsByName("output_format"));
		
		// initiate object for imdi_structure class
		var xml_strings = new my.formats[output_format_index].generator_object();
		var output_format = my.formats[output_format_index].output_name;
		var file_ending = my.formats[output_format_index].file_ending;
		
		//if corpus is to be created
		if (get("corpus_name") !== ""){

			filename = get("corpus_name")+"."+file_ending;
			dom.createXMLOutputDIV(xml_window, output_format + " Corpus", "textarea_corpus",
			xml_strings.corpus, filename);
		}
		
		for (var s=0;s<session.sessions.length;s++){

			filename = get("session_"+session.sessions[s].id+"_session_name")+"."+file_ending;
			dom.createXMLOutputDIV(xml_window, output_format + " Session " + (s+1), "textarea_session_"+s,
			xml_strings.sessions[s],filename);
			
		}
		
	};


	return my;
	
})();