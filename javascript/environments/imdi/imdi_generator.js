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


"use strict";


imdi_environment.imdi_generator = function(){

	var corpus = imdi_environment.workflow[0];
	var resources = imdi_environment.workflow[1];
	var actor = imdi_environment.workflow[2];
	var session = imdi_environment.workflow[3];

	var imdi_version = "IMDI 3.04";
	
	var get_metadata_language = function(){

		var return_string = APP.CONF.LanguageCodePrefix;	
		return_string += g("metadata_language_select").options[g("metadata_language_select").options.selectedIndex].value;

		return return_string;

	}
	
	var create_imdi_corpus = function () {
    
		var return_string = "";
		return_string += xml.header;
		return_string += create_imdi_header("CORPUS",APP.CONF.originator,"1.0",today());
		return_string += xml.tag("Corpus",0);
        return_string += xml.element("Name",get('corpus_name'));
		return_string += xml.element("Title",get('corpus_title'));   
		return_string += xml.element("Description",get('corpus_description'),[["LanguageId",get_metadata_language()]]);       
    
        for (var i=0; i<session.sessions.length; i++){
			return_string += xml.element("CorpusLink",get(APP.CONF.session_dom_element_prefix+session.sessions[i].id+"_session_name")+".imdi",
			[["Name",get(APP.CONF.session_dom_element_prefix+session.sessions[i].id+"_session_name")]]);
		}
    
		return_string += xml.tag("Corpus",1);
		return_string += xml.tag("METATRANSCRIPT",1);
    
		return return_string;
    
	}

	
	var create_imdi_session = function (session_id) {
    
		var return_string = "";
    
		return_string+=xml.header;
		return_string+=create_imdi_header("SESSION",APP.CONF.originator,"1.0",today());
		return_string+=xml.tag("Session",0);
		return_string+=xml.element("Name",get(APP.CONF.session_dom_element_prefix+session_id+"_session_name"));
		return_string+=xml.element("Title",get(APP.CONF.session_dom_element_prefix+session_id+"_session_title"));


		if ((get(APP.CONF.session_dom_element_prefix+session_id+"_session_date_year") != "") && (get(APP.CONF.session_dom_element_prefix+session_id+"_session_date_year") != "YYYY")){
	
			return_string += xml.tag("Date",0);
			return_string += get(APP.CONF.session_dom_element_prefix+session_id+"_session_date_year") + "-" + get(APP.CONF.session_dom_element_prefix+session_id+"_session_date_month") + "-" + get(APP.CONF.session_dom_element_prefix+session_id+"_session_date_day");
			return_string += xml.tag("Date",1);
		
		}	

		else {
			return_string+=xml.element("Date","Unspecified");
		}
   
		return_string+=xml.element("Description",get(APP.CONF.session_dom_element_prefix+session_id+"_session_description"),[["LanguageId",get_metadata_language()],["Link",""]]);
   
		return_string+=xml.tag("MDGroup",0);
		return_string+=xml.tag("Location",0);
		return_string+=xml.element("Continent",get(APP.CONF.session_dom_element_prefix+session_id+"_session_location_continent"),[["Link","http://www.mpi.nl/IMDI/Schema/Continents.xml"],["Type","ClosedVocabulary"]]);
		return_string+=xml.element("Country",get(APP.CONF.session_dom_element_prefix+session_id+"_session_location_country"),[["Link","http://www.mpi.nl/IMDI/Schema/Countries.xml"],["Type","OpenVocabulary"]]);
		return_string+=xml.element("Region",get(APP.CONF.session_dom_element_prefix+session_id+"_session_location_region"));
		return_string+=xml.element("Address",get(APP.CONF.session_dom_element_prefix+session_id+"_session_location_address"));
		return_string+=xml.tag("Location",1);

		return_string+=xml.tag("Project",0);
		return_string+=xml.element("Name",get(APP.CONF.session_dom_element_prefix+session_id+"_project_name"));
		return_string+=xml.element("Title",get(APP.CONF.session_dom_element_prefix+session_id+"_project_title"));
		return_string+=xml.element("Id",get(APP.CONF.session_dom_element_prefix+session_id+"_project_id"));
		return_string+=xml.tag("Contact",0);
		return_string+=xml.element("Name",get(APP.CONF.session_dom_element_prefix+session_id+"_project_contact_name"));
		return_string+=xml.element("Address",get(APP.CONF.session_dom_element_prefix+session_id+"_project_contact_address"));
		return_string+=xml.element("Email",get(APP.CONF.session_dom_element_prefix+session_id+"_project_contact_email"));
		return_string+=xml.element("Organisation",get(APP.CONF.session_dom_element_prefix+session_id+"_project_contact_organisation"));
		return_string+=xml.tag("Contact",1);
		return_string+=xml.element("Description",get(APP.CONF.session_dom_element_prefix+session_id+"_project_description"),[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string+=xml.tag("Project",1);
		return_string+=xml.tag("Keys",0);
		return_string+=xml.tag("Keys",1);
		return_string+=insert_session_content(session_id);

		//Actors
		return_string+=xml.tag("Actors",0);
    
		for (var a=0;a<session.sessions[session.getSessionIndexFromID(session_id)].actors.actors.length;a++){
			return_string += insert_actor(session_id,session.sessions[session.getSessionIndexFromID(session_id)].actors.actors[a]);
		}

		return_string+=xml.tag("Actors",1);
		return_string+=xml.tag("MDGroup",1);
		return_string+=xml.tag("Resources",0);

		for (var r=0; r<session.sessions[session.getSessionIndexFromID(session_id)].resources.mediaFiles.length; r++){  
	
			var id = session.sessions[session.getSessionIndexFromID(session_id)].resources.mediaFiles[r].id;
			console.log("looking for mediafile with id " + id);
			return_string += insert_mediafile(get(APP.CONF.session_dom_element_prefix+session_id+'_mediafile_'+id+"_name"),get(APP.CONF.session_dom_element_prefix+session_id+'_mediafile_'+id+"_size"));
		
		}
	
		for (var r=0; r<session.sessions[session.getSessionIndexFromID(session_id)].resources.writtenResources.length; r++){  

			var id = session.sessions[session.getSessionIndexFromID(session_id)].resources.writtenResources[r].id;	
			console.log("looking for wr with id " + id);
			return_string += insert_written_resource(get(APP.CONF.session_dom_element_prefix+session_id+'_mediafile_'+id+"_name"),get(APP.CONF.session_dom_element_prefix+session_id+'_mediafile_'+id+"_size"));
		
		}
    
		return_string+=xml.tag("Resources",1);
		return_string+=xml.tag("References",0);
		return_string+=xml.tag("References",1);
		return_string+=xml.tag("Session",1);
		return_string+=xml.tag("METATRANSCRIPT",1);
   
		return return_string;
    
	}	
	
	
	var insert_session_content = function (session_id) {

		var return_string = "";
		return_string += xml.tag("Content",0);
		return_string += xml.element("Genre",get(APP.CONF.session_dom_element_prefix+session_id+"_content_genre"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Genre.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("SubGenre",get(APP.CONF.session_dom_element_prefix+session_id+"_content_subgenre"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-SubGenre.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.element("Task",get(APP.CONF.session_dom_element_prefix+session_id+"_content_task"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Task.xml"],["Type","OpenVocabulary"]]);
	
		return_string += xml.element("Modalities","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Modalities.xml"],["Type","OpenVocabulary"]]);
		//no input yet
		return_string += xml.element("Subject","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Subject.xml"],["Type","OpenVocabularyList"]]);
		//no input yet

		return_string += xml.tag("CommunicationContext",0);
		return_string += xml.element("Interactivity",get(APP.CONF.session_dom_element_prefix+session_id+"_content_communication_context_interactivity"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Interactivity.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("PlanningType",get(APP.CONF.session_dom_element_prefix+session_id+"_content_communication_context_planningtype"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-PlanningType.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Involvement",get(APP.CONF.session_dom_element_prefix+session_id+"_content_communication_context_involvement"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Involvement.xml"],["Type","ClosedVocabulary"]]);	
		return_string += xml.element("SocialContext",get(APP.CONF.session_dom_element_prefix+session_id+"_content_communication_context_socialcontext"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-SocialContext.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("EventStructure",get(APP.CONF.session_dom_element_prefix+session_id+"_content_communication_context_eventstructure"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-EventStructure.xml"],["Type","ClosedVocabulary"]]);

		return_string += xml.element("Channel","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Channel.xml"],["Type","ClosedVocabulary"]]);
		//no input yet

		return_string += xml.tag("CommunicationContext",1);
		return_string += xml.tag("Languages",0);
	
		return_string+=xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		//no input yet

		return_string += insert_content_languages(session);
		return_string += xml.tag("Languages",1);
		return_string += xml.element("Keys","");
		return_string += xml.element("Description",get(APP.CONF.session_dom_element_prefix+session_id+"_content_description"),[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.tag("Content",1);

		return return_string;

	}
	

	var insert_content_languages = function () {

		var return_string = "";
		
		var languages = corpus.content_languages.content_languages;
	
		for (var l=0;l<languages.length;l++){  //for all content languages // no session separate languages yet
	
			return_string += xml.tag("Language",0);
			return_string += xml.element("Id",APP.CONF.LanguageCodePrefix+languages[l][0]);
			return_string += xml.element("Name",languages[l][3],[["Link","http://www.mpi.nl/IMDI/Schema/MPI-Languages.xml"],["Type","OpenVocabulary"]]);
			//return_string += xml.element("Dominant","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			//return_string += xml.element("SourceLanguage","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			//return_string += xml.element("TargetLanguage","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			return_string+=xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
			//no input yet
			return_string += xml.tag("Language",1);
	
		}

		return return_string;
		
	}
	
	
	var create_imdi_header = function (imdi_type,originator,version,date) {
    
		return xml.tag("METATRANSCRIPT",0,[["xmlns","http://www.mpi.nl/IMDI/Schema/IMDI"],["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
		["Date",date],["FormatId",imdi_version],["Originator",originator],["Type",imdi_type],
		["Version",version],["xsi:schemaLocation","http://www.mpi.nl/IMDI/Schema/IMDI ./IMDI_3.0.xsd"]]);

	}
	
	
	
	var insert_written_resource = function (link,size) {

		var return_string = "";
		return_string += xml.tag("WrittenResource",0);
		return_string += xml.element("ResourceLink",link);
		return_string += xml.element("MediaResourceLink","");
		return_string += xml.element("Date","Unspecified");
		//no input yet, but should come soon
	    return_string += xml.element("Type",resources.getFileType(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Type.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("SubType",resources.getFileType(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-SubType.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.element("Format",resources.getFileType(link).mimetype,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Format.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("Size",size);
		return_string += xml.tag("Validation",0);
		return_string += xml.element("Type","",[["Link","http://www.mpi.nl/IMDI/Schema/Validation-Type.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Methodology","",[["Link","http://www.mpi.nl/IMDI/Schema/Validation-Methodology.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Level","Unspecified");
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.tag("Validation",1);
		return_string += xml.element("Derivation","",[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Derivation.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("CharacterEncoding","");
		return_string += xml.element("ContentEncoding","");
		return_string += xml.element("LanguageId","");
		return_string += xml.element("Anonymized","Unspecified",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.tag("Access",0);
		return_string += xml.tag("Availability",2);
		return_string += xml.tag("Date",2);
		return_string += xml.tag("Owner",2);
		return_string += xml.tag("Publisher",2);
		return_string += xml.tag("Contact",0);
		return_string += xml.tag("Name",2);
		return_string += xml.tag("Address",2);
		return_string += xml.tag("Email",2);
		return_string += xml.tag("Organisation",2);
		return_string += xml.tag("Contact",1);
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.tag("Access",1);
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.element("Keys","");
		return_string += xml.tag("WrittenResource",1);
		return return_string;
	
	}
	
	
	var insert_mediafile = function (link,size) {

		var return_string = "";
		return_string += xml.tag("MediaFile",0);
		return_string += xml.element("ResourceLink",link);
		return_string += xml.element("Type",resources.getFileType(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/MediaFile-Type.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Format",resources.getFileType(link).mimetype,[["Link","http://www.mpi.nl/IMDI/Schema/MediaFile-Format.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("Size",size);
		return_string += xml.element("Quality","Unspecified",[["Link","http://www.mpi.nl/IMDI/Schema/Quality.xml"],["Type","ClosedVocabulary"]]);
		// no input yet
		return_string += xml.tag("RecordingConditions",2);
		return_string += xml.tag("TimePosition",0);
		return_string += xml.element("Start","Unspecified");
		return_string += xml.element("End","Unspecified");
		//no input yet
		return_string += xml.tag("TimePosition",1);
		return_string += xml.tag("Access",0);
		return_string += xml.tag("Availability",2);
		return_string += xml.tag("Date",2);
		return_string += xml.tag("Owner",2);
		return_string += xml.tag("Publisher",2);
		return_string += xml.tag("Contact",0);
		return_string += xml.tag("Name",2);
		return_string += xml.tag("Address",2);
		return_string += xml.tag("Email",2);
		return_string += xml.tag("Organisation",2); 
		return_string += xml.tag("Contact",1);
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.tag("Access",1);
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.element("Keys","");
		return_string += xml.tag("MediaFile",1);
		return return_string;
		
	}


	var insert_actor = function (session_id, actor_id) {

		var i = actor.getActorsIndexFromID(actor_id);

		var return_string = "";
		return_string += xml.tag("Actor",0);
		return_string += xml.element("Role",actor.actors[i].role,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-Role.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.element("Name",actor.actors[i].name);
		return_string += xml.element("FullName",actor.actors[i].full_name);
		return_string += xml.element("Code",actor.actors[i].code);
		return_string += xml.element("FamilySocialRole",actor.actors[i].family_social_role,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-FamilySocialRole.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.tag("Languages",0);
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
	
		for (var l=0; l<actor.actors[i].languages.length; l++){
	
			return_string += xml.tag("Language",0);
			return_string += xml.element("Id",APP.CONF.LanguageCodePrefix+actor.actors[i].languages[l].LanguageObject[0]);
			return_string += xml.element("Name",actor.actors[i].languages[l].LanguageObject[3],[["Link","http://www.mpi.nl/IMDI/Schema/MPI-Languages.xml"],["Type","OpenVocabulary"]]);
			return_string += xml.element("MotherTongue",(actor.actors[i].languages[l].MotherTongue) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			return_string += xml.element("PrimaryLanguage",(actor.actors[i].languages[l].PrimaryLanguage) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);		
			return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
			return_string += xml.tag("Language",1);
	
		}
	
		return_string += xml.tag("Languages",1);
		return_string += xml.element("EthnicGroup",actor.actors[i].ethnic_group);   
	
		//Age field
		return_string += xml.tag("Age",0);
		return_string += actor.getAge(session_id,actor_id);
		return_string += xml.tag("Age",1);	
		//End of age field
	
		return_string+=xml.tag("BirthDate",0);
	
		if ((actor.actors[i].birth_date.year != "") && (actor.actors[i].birth_date.year != "YYYY")){
			return_string += actor.actors[i].birth_date.year + "-" + actor.actors[i].birth_date.month + "-" + actor.actors[i].birth_date.day;
		}	
	
		else {
			return_string += "Unspecified";
		}
	
		return_string += xml.tag("BirthDate",1);	
		return_string += xml.element("Sex",actor.actors[i].sex,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-Sex.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Education",(actor.actors[i].education != "") ? actor.actors[i].education : "Unspecified" );
		return_string += xml.element("Anonymized",(actor.actors[i].anonymized) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]); 
		return_string += xml.tag("Contact",0);
		return_string += xml.element("Name",actor.actors[i].contact.name);   
		return_string += xml.element("Address",actor.actors[i].contact.address);   
		return_string += xml.element("Email",actor.actors[i].contact.email);   
		return_string += xml.element("Organisation",actor.actors[i].contact.organisation);   
		return_string += xml.tag("Contact",1);
		return_string += xml.tag("Keys",2);
		return_string += xml.element("Description",actor.actors[i].description,[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.tag("Actor",1);
		return return_string;
    
	}
	
	var my = {};
	my.sessions = [];           
	my.corpus = create_imdi_corpus();
    
	for (var s=0;s<session.sessions.length;s++){   
		my.sessions.push(create_imdi_session(session.sessions[s].id));
	}

	return my;
	
}