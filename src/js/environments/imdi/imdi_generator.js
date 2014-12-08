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


imdi_environment.imdi_generator = function(data){
	"use strict";

	var corpus = imdi_environment.workflow[0];
	
	var resources = data.resources;
	var actors = data.actors;;
	var sessions = data.sessions;
	
	var parent = imdi_environment;
	
	
	var already_warned_for_invalid_dates = false;
	var already_warned_for_invalid_birth_dates = false;

	var imdi_version = "IMDI 3.04";
	
	var get_metadata_language = function(){

		var return_string = APP.CONF.LanguageCodePrefix;	
		return_string += g("metadata_language_select").options[g("metadata_language_select").options.selectedIndex].value;

		return return_string;

	}
	
	var create_imdi_corpus = function () {
    
		var return_string = "";
		return_string += xml.header;
		return_string += create_imdi_header("CORPUS", APP.CONF.originator, "1.0", today());
		return_string += xml.open("Corpus");
        return_string += xml.element("Name", get('corpus_name'));
		return_string += xml.element("Title", get('corpus_title'));   
		return_string += xml.element("Description",get('corpus_description'),[["LanguageId",get_metadata_language()]]);       
    
        for (var i=0; i<session.sessions.length; i++){
			return_string += xml.element("CorpusLink", get(session.dom_element_prefix+session.sessions[i].id + "_session_name") + ".imdi",
			[["Name", get(session.dom_element_prefix + session.sessions[i].id+"_session_name")]]);
		}
    
		return_string += xml.close("Corpus");
		return_string += xml.close("METATRANSCRIPT");
    
		return return_string;
    
	};
	
	
	var create_imdi_session = function (session_id) {
	
		var session_prefix = session.dom_element_prefix + session_id;
    
		var return_string = "";
    
		return_string += xml.header;
		return_string += create_imdi_header("SESSION",APP.CONF.originator,"1.0",today());
		return_string += xml.open("Session");
		return_string += xml.element("Name",get(session_prefix+"_session_name"));
		return_string += xml.element("Title",get(session_prefix+"_session_title"));


		return_string += xml.open("Date");
		return_string += APP.forms.getDateStringByDateInput(session_prefix+"_session_date") || "Unspecified";
		return_string += xml.close("Date");
		
		
		
		// if a valid session date cannot be parsed from the form BUT there has been some input by the user
		// AND the user has not been warned before about that, warn him or her
		if (
			APP.forms.isUserDefinedDateInvalid(session_prefix+"_session_date")
			&& (already_warned_for_invalid_dates == false)
		){
		
			APP.alert(
				parent.l("warning") +
				parent.l("output", "invalid_date_entered_in_session") + "<br>" +
				parent.l("output", "correct_or_ignore_warning")
			);
			
			already_warned_for_invalid_dates = true;
		}
		
		
		return_string += xml.element("Description",get(session_prefix+"_session_description"),[["LanguageId",get_metadata_language()],["Link",""]]);

		return_string += xml.open("MDGroup");
		return_string += xml.open("Location");
		return_string += xml.element("Continent",get(session_prefix+"_session_location_continent"),[["Link","http://www.mpi.nl/IMDI/Schema/Continents.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Country",get(session_prefix+"_session_location_country"),[["Link","http://www.mpi.nl/IMDI/Schema/Countries.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("Region",get(session_prefix+"_session_location_region"));
		return_string += xml.element("Address",get(session_prefix+"_session_location_address"));
		return_string += xml.close("Location");

		return_string += xml.open("Project");
		return_string += xml.element("Name",get(session_prefix+"_project_name"));
		return_string += xml.element("Title",get(session_prefix+"_project_title"));
		return_string += xml.element("Id",get(session_prefix+"_project_id"));
		return_string += xml.open("Contact");
		return_string += xml.element("Name",get(session_prefix+"_project_contact_name"));
		return_string += xml.element("Address",get(session_prefix+"_project_contact_address"));
		return_string += xml.element("Email",get(session_prefix+"_project_contact_email"));
		return_string += xml.element("Organisation",get(session_prefix+"_project_contact_organisation"));
		return_string += xml.close("Contact");
		return_string += xml.element("Description",get(session_prefix+"_project_description"),[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.close("Project");
		
		return_string += xml.open("Keys");
		return_string += xml.close("Keys");
		
		return_string += insert_session_content(session_id);

		//Actors
		return_string += xml.open("Actors");
		
		//Actors Description
		return_string += xml.element("Description",get(session_prefix+"_actors_description"),[["LanguageId",get_metadata_language()],["Link",""]]);
    
		forEach(session.sessions[session.getSessionIndexFromID(session_id)].actors.actors, function(actor){
			return_string += insert_actor(session_id, actor);
		});

		return_string += xml.close("Actors");
		return_string += xml.close("MDGroup");
		return_string += xml.open("Resources");

		forEach(session.sessions[session.getSessionIndexFromID(session_id)].resources.resources.mediaFiles, function(mediaFile){
	
			var id = mediaFile.id;
			console.log("looking for mediafile with id " + id);
			return_string += insert_mediafile(get(session_prefix+'_mediafile_'+id+"_name"),get(session_prefix+'_mediafile_'+id+"_size"));
		
		});
	
		forEach(session.sessions[session.getSessionIndexFromID(session_id)].resources.resources.writtenResources, function(writtenResource){

			var id = writtenResource.id;	
			console.log("looking for wr with id " + id);
			return_string += insert_written_resource(get(session_prefix+'_mediafile_'+id+"_name"),get(session_prefix+'_mediafile_'+id+"_size"));
		
		});
    
		return_string+=xml.close("Resources");
		return_string+=xml.tag("References",2);
		return_string+=xml.close("Session");
		return_string+=xml.close("METATRANSCRIPT");
   
		return return_string;
    
	}	
	
	
	var insert_session_content = function (session_id) {

		var return_string = "";
		return_string += xml.open("Content");
		return_string += xml.element("Genre",get(session.dom_element_prefix+session_id+"_content_genre"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Genre.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("SubGenre",get(session.dom_element_prefix+session_id+"_content_subgenre"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-SubGenre.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.element("Task",get(session.dom_element_prefix+session_id+"_content_task"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Task.xml"],["Type","OpenVocabulary"]]);
	
		return_string += xml.element("Modalities","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Modalities.xml"],["Type","OpenVocabulary"]]);
		//no input yet
		return_string += xml.element("Subject","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Subject.xml"],["Type","OpenVocabularyList"]]);
		//no input yet

		return_string += xml.open("CommunicationContext");
		return_string += xml.element(
			"Interactivity",
			get(session.dom_element_prefix + session_id + "_content_communication_context_interactivity"),
			[
				["Link","http://www.mpi.nl/IMDI/Schema/Content-Interactivity.xml"],
				["Type","ClosedVocabulary"]
			]
		);
		return_string += xml.element("PlanningType", get(session.dom_element_prefix+session_id+"_content_communication_context_planningtype"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-PlanningType.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Involvement", get(session.dom_element_prefix+session_id+"_content_communication_context_involvement"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Involvement.xml"],["Type","ClosedVocabulary"]]);	
		return_string += xml.element("SocialContext", get(session.dom_element_prefix+session_id+"_content_communication_context_socialcontext"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-SocialContext.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("EventStructure", get(session.dom_element_prefix+session_id+"_content_communication_context_eventstructure"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-EventStructure.xml"],["Type","ClosedVocabulary"]]);

		return_string += xml.element("Channel","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Channel.xml"],["Type","ClosedVocabulary"]]);
		//no input yet

		return_string += xml.close("CommunicationContext");
		return_string += xml.open("Languages");
	
		return_string+=xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		//no input yet

		return_string += insert_content_languages(session);
		return_string += xml.close("Languages");
		return_string += xml.element("Keys", "");
		return_string += xml.element(
			"Description",
			get(session.dom_element_prefix + session_id + "_content_description"),
			[
				["LanguageId", get_metadata_language()],
				["Link",""]
			]
		);
		return_string += xml.close("Content");

		return return_string;

	}
	

	var insert_content_languages = function () {

		var return_string = "";
		
		var languages = corpus.content_languages.content_languages;
	
		for (var l=0; l<languages.length; l++){  //for all content languages // no session separate languages yet
	
			return_string += xml.open("Language");
			return_string += xml.element("Id",APP.CONF.LanguageCodePrefix+languages[l][0]);
			return_string += xml.element("Name",languages[l][3],[["Link","http://www.mpi.nl/IMDI/Schema/MPI-Languages.xml"],["Type","OpenVocabulary"]]);
			//return_string += xml.element("Dominant","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			//return_string += xml.element("SourceLanguage","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			//return_string += xml.element("TargetLanguage","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			return_string+=xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
			//no input yet
			return_string += xml.close("Language");
	
		}

		return return_string;
		
	}
	
	
	var create_imdi_header = function (imdi_type, originator, version, date) {
    
		return xml.open("METATRANSCRIPT",[
			["xmlns","http://www.mpi.nl/IMDI/Schema/IMDI"],
			["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
			["Date",date],
			["FormatId",imdi_version],
			["Originator",originator],
			["Type",imdi_type],
			["Version",version],
			["xsi:schemaLocation","http://www.mpi.nl/IMDI/Schema/IMDI ./IMDI_3.0.xsd"]
		]);

	}
	
	
	
	var insert_written_resource = function (link,size) {

		var return_string = "";
		return_string += xml.open("WrittenResource");
		return_string += xml.element("ResourceLink",link);
		return_string += xml.element("MediaResourceLink","");
		return_string += xml.element("Date","Unspecified"); //no input yet
	    return_string += xml.element("Type", resources.getFileType(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Type.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("SubType", resources.getFileType(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-SubType.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.element("Format", resources.getFileType(link).mimetype,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Format.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("Size", size);
		return_string += xml.open("Validation");
		return_string += xml.element("Type","",[["Link","http://www.mpi.nl/IMDI/Schema/Validation-Type.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Methodology","",[["Link","http://www.mpi.nl/IMDI/Schema/Validation-Methodology.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Level","Unspecified");
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.close("Validation");
		return_string += xml.element("Derivation","",[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Derivation.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("CharacterEncoding","");
		return_string += xml.element("ContentEncoding","");
		return_string += xml.element("LanguageId","");
		return_string += xml.element("Anonymized","Unspecified",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
		
		return_string += xml.open("Access");
		return_string += xml.tag("Availability",2);
		return_string += xml.tag("Date",2);
		return_string += xml.tag("Owner",2);
		return_string += xml.tag("Publisher",2);
		
		return_string += xml.open("Contact");
		return_string += xml.tag("Name",2);
		return_string += xml.tag("Address",2);
		return_string += xml.tag("Email",2);
		return_string += xml.tag("Organisation",2);
		return_string += xml.close("Contact");
		
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.close("Access");
		
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.element("Keys","");
		return_string += xml.close("WrittenResource");
		return return_string;
	
	}
	
	
	var insert_mediafile = function (link,size) {

		var return_string = "";
		return_string += xml.open("MediaFile");
		return_string += xml.element("ResourceLink",link);
		return_string += xml.element("Type",resources.getFileType(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/MediaFile-Type.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Format",resources.getFileType(link).mimetype,[["Link","http://www.mpi.nl/IMDI/Schema/MediaFile-Format.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("Size",size);
		return_string += xml.element("Quality","Unspecified",[["Link","http://www.mpi.nl/IMDI/Schema/Quality.xml"],["Type","ClosedVocabulary"]]); // no input
		return_string += xml.tag("RecordingConditions",2);
		return_string += xml.open("TimePosition");
		return_string += xml.element("Start","Unspecified");
		return_string += xml.element("End","Unspecified"); //no input
		return_string += xml.close("TimePosition");
		return_string += xml.open("Access");
		return_string += xml.tag("Availability",2);
		return_string += xml.tag("Date",2);
		return_string += xml.tag("Owner",2);
		return_string += xml.tag("Publisher",2);
		return_string += xml.open("Contact");
		return_string += xml.tag("Name",2);
		return_string += xml.tag("Address",2);
		return_string += xml.tag("Email",2);
		return_string += xml.tag("Organisation",2); 
		return_string += xml.close("Contact");
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.close("Access");
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.element("Keys","");
		return_string += xml.close("MediaFile");
		return return_string;
		
	}


	var insert_actor = function (session_id, actor_id) {

		var i = actor.getIndexByID(actor_id);

		var return_string = "";
		return_string += xml.open("Actor");
		return_string += xml.element("Role",actor.actors[i].role,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-Role.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.element("Name",actor.actors[i].name);
		return_string += xml.element("FullName",actor.actors[i].full_name);
		return_string += xml.element("Code",actor.actors[i].code);
		return_string += xml.element("FamilySocialRole",actor.actors[i].family_social_role,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-FamilySocialRole.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.open("Languages");
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
	
		for (var l=0; l<actor.actors[i].languages.length; l++){
	
			return_string += xml.open("Language");
			return_string += xml.element("Id",APP.CONF.LanguageCodePrefix+actor.actors[i].languages[l].LanguageObject[0]);
			return_string += xml.element("Name",actor.actors[i].languages[l].LanguageObject[3],[["Link","http://www.mpi.nl/IMDI/Schema/MPI-Languages.xml"],["Type","OpenVocabulary"]]);
			return_string += xml.element("MotherTongue",(actor.actors[i].languages[l].MotherTongue) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			return_string += xml.element("PrimaryLanguage",(actor.actors[i].languages[l].PrimaryLanguage) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);		
			return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
			return_string += xml.close("Language");
	
		}
	
		return_string += xml.close("Languages");
		return_string += xml.element("EthnicGroup",actor.actors[i].ethnic_group);   
	
		//Age field
		return_string += xml.open("Age");
		return_string += actor.getAge(session_id,actor_id);
		return_string += xml.close("Age");	
		//End of age field
	
		return_string += xml.open("BirthDate");
		return_string += APP.forms.getDateStringByDateObject(actor.actors[i].birth_date) || "Unspecified";
		return_string += xml.close("BirthDate");
		
		
		if (
			APP.forms.isUserDefinedDateInvalid(actor.actors[i].birth_date)
			&& (already_warned_for_invalid_birth_dates == false)
		){
		
			APP.alert(
				parent.l("warning") +
				parent.l("output", "invalid_birth_date_entered") + "<br>" +
				parent.l("output", "correct_or_ignore_warning")
			);
			
			already_warned_for_invalid_birth_dates = true;
		}
		
		return_string += xml.element("Sex",actor.actors[i].sex,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-Sex.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Education",(actor.actors[i].education != "") ? actor.actors[i].education : "Unspecified" );
		return_string += xml.element("Anonymized",(actor.actors[i].anonymized) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]); 
		return_string += xml.open("Contact");
		return_string += xml.element("Name",actor.actors[i].contact.name);   
		return_string += xml.element("Address",actor.actors[i].contact.address);   
		return_string += xml.element("Email",actor.actors[i].contact.email);   
		return_string += xml.element("Organisation",actor.actors[i].contact.organisation);   
		return_string += xml.close("Contact");
		return_string += xml.tag("Keys",2);
		return_string += xml.element("Description",actor.actors[i].description,[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.close("Actor");
		return return_string;
    
	}
	
	var my = {};
	my.sessions = [];    

	xml.reset();
	
	my.corpus = create_imdi_corpus();
	
	forEach(session.sessions, function(session){   
		xml.reset();
		my.sessions.push(create_imdi_session(session.id));
	});

	return my;
	
}