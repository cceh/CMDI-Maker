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
	var resources;
	var actors;
	
	my.parent = imdi_environment;
	var l = my.parent.l;
	
	my.identity = {
		id: "xml_output",
		title: "XML Output",
		icon: "data"
	};
	
	
	my.not_allowed_chars = " !\"§$%&/\\()=?^°`´'#*+~<>[]{}|²³,.;:";
	
	my.init = function(){
	
		corpus = imdi_environment.workflow[0];
		session = imdi_environment.workflow[3];
		resources = imdi_environment.workflow[1];
		actors = imdi_environment.workflow[2];
		
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
		dom.makeRadios(parent, formats, "output_format", "output_format_radio_", "title", "name", 0, undefined);

	};
	
	
	my.view = function(){
	
		APP.save();
	
		//when there is no corpus to be created and no sessions either, return
		if ((get("corpus_name") === "") && (session.sessions.length === 0)){
		
			APP.alert(l("output", "you_must_create_some_sessions_first"));
			APP.view(session);
			return;
			
		}
		
	
		//if corpus has a name, but an invalid one, return
		if (get("corpus_name") !== "" && (!corpus.isCorpusProperlyNamed())){   //show corpus
			APP.view(corpus);
			APP.alert(l("output", "corpus_must_have_proper_name") + "<br>" +
			l("output", "not_allowed_chars_are") + my.not_allowed_chars + "<br>" +
			l("output", "spaces_are_not_allowed_either"));
			return;
		}
		
		
		//if there are unnamed sessions, return!
		if (!session.areAllSessionsNamed()){
		
			APP.view(session);
			APP.alert(l("output", "sessions_must_have_name"));
			return;
		
		}
		
		
		//if not all sessions are properly named, return
		if (!session.areAllSessionsProperlyNamed()){
			
			APP.view(session);
			APP.alert(l("output", "sessions_must_have_proper_name") + "<br>" +
			l("output", "not_allowed_chars_are") + my.not_allowed_chars + "<br>" +
			l("output", "spaces_are_not_allowed_either"));
			return;

		}
		
		
		//if not all sessions have a project name, return
		if (!session.doesEverySessionHaveAProjectName()){

			APP.alert(l("output", "every_session_must_have_a_project_name"));
			APP.view(session);
			return;
			
		}
		
		
		my.generate();
		
		
	};
	

	my.functions = function() {
		return [
			{
				id: "link_export_corpus",
				icon: "download",
				label: l("output", "download_corpus_including_all_sessions"),
				onclick: function(){ APP.saveAllOutputFiles(); }
			},
			{
				id: "link_export_corpus_as_zip",
				icon: "download",
				label: l("output", "download_zip_archive"),
				onclick: function(){ APP.zipAllOutputFiles(); }
			}
		
		];
	};
	

	my.generate = function (){
		var filename;
		
		var xml_window = g('VIEW_xml_output');
		
		xml_window.innerHTML = "";
		
		//get index of selected output format
		var output_format_index = dom.getSelectedRadioIndex("output_format");
		
		var data = {
			corpus: {
				name: get("corpus_name"),
				title: get("corpus_title"),
				description: get("corpus_description")
			},
			content_languages: [],   //TO DO!!!
			resources: resources.resources.getAll(),
			sessions: session.sessions.getAll(),
			actors: actors.actors.getAll()
		}
		
		
		var format = my.formats()[output_format_index];
		
		// initiate object for imdi_structure class
		var xml_strings = new format.generator_object(data);
		var output_format = format.output_name;
		var file_ending = format.file_ending;
		
		//if corpus is to be created
		if (get("corpus_name") !== ""){

			filename = get("corpus_name") + "." + file_ending;
			APP.GUI.createXMLOutputDIV(xml_window, output_format + " Corpus", "textarea_corpus",
			xml_strings.corpus, filename);
			
		}
		
		session.sessions.forEach(function(sess, s){

			filename = sess.session.name + "." + file_ending;
			APP.GUI.createXMLOutputDIV(xml_window, output_format + " Session " + (s+1), "textarea_session_" + s,
			xml_strings.sessions[s], filename);
			
		});
		
	};


	return my;
	
})();