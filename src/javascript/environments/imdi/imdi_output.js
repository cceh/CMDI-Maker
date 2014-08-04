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
	
	my.parent = imdi_environment;
	var l = my.parent.l;
	
	my.identity = {
		id: "xml_output",
		title: "XML Output",
		icon: "data"
	};
	
	
	my.init = function(){
	
		corpus = imdi_environment.workflow[0];
		session = imdi_environment.workflow[3];
		my.createOutputFormatSelect(my.formats());
	
	};
	
	
	my.formats = function(){
		return [
			{
				title: l("output", "imdi"),
				name: "imdi",
				file_ending: "imdi",
				output_name: "IMDI",
				generator_object: imdi_environment.imdi_generator,
			},
			{
				title: l("output", "cmdi_with_imdi_profile"),
				name: "cmdi-imdi",
				file_ending: "cmdi",
				output_name: "CMDI",
				generator_object: imdi_environment.cmdi_generator,
			}
		];
	};
	
	
	my.createOutputFormatSelect = function (formats){

		var parent = g("output_format_select");

		for (var f=0; f<formats.length; f++){
		
			var input = dom.input(parent,"output_format_radio_"+f, "", "output_format", "radio", f);
			
			dom.span(parent, "","", " " + formats[f].title);
			
			if (f === 0){
				input.checked = true;
			}
			
			dom.br(parent);
			
		}

	};
	
	
	my.view = function(){
	
		//if there is nothing to be done, return
		if ((get("corpus_name") === "") && (session.sessions.length === 0)){
		
			APP.alert(l("output", "you_must_create_some_sessions_first"));
			APP.view(session);
			return;
		}
		
		//corpus must have a proper name or no name at all
		if ((corpus.isCorpusProperlyNamed() || get("corpus_name") === "") && (session.areAllSessionsProperlyNamed())){
			
			if (session.doesEverySessionHaveAProjectName()){

				my.generate();
				
			}
			
			else {
				
				APP.alert(l("output", "every_session_must_have_a_project_name"));
			
				APP.view(session);
			
			}
			
		}
		
		else {
			
			//if corpus has a name, but an invalid one
			if (!corpus.isCorpusProperlyNamed() && get("corpus_name") !== ""){   //show corpus
				APP.view(corpus);
				APP.alert(l("output", "corpus_must_have_proper_name") + APP.CONF.not_allowed_chars);
			
			}
			
			else {  //show sessions
				APP.view(session);
				APP.alert(l("output", "sessions_must_have_proper_name") + APP.CONF.not_allowed_chars);
			}
		}
	};
	

	my.functions = function() {
		return [
			{
				id: "link_export_corpus",
				icon: "download",
				label: l("output", "download_corpus_including_all_sessions"),
				onclick: function(){APP.saveAllOutputFiles();}
			}
		
		];
	};
	

	my.generate = function (){
		var filename;
		
		var xml_window = g('VIEW_xml_output');
		
		xml_window.innerHTML = "";
		
		//get index of selected output format
		var output_format_index = dom.getSelectedRadioIndex(document.getElementsByName("output_format"));
		
		// initiate object for imdi_structure class
		var xml_strings = new my.formats()[output_format_index].generator_object();
		var output_format = my.formats()[output_format_index].output_name;
		var file_ending = my.formats()[output_format_index].file_ending;
		
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