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


imdi_environment.cmdi_generator = function(){
	"use strict";
	
	var corpus = imdi_environment.workflow[0];
	var resources = imdi_environment.workflow[1];
	var actor = imdi_environment.workflow[2];
	var session = imdi_environment.workflow[3];
	
	var parent = imdi_environment;
	
	var already_warned_for_invalid_dates = false;
	var already_warned_for_invalid_birth_dates = false;

	var imdi_corpus_profile="clarin.eu:cr1:p_1274880881885";
	var imdi_session_profile="clarin.eu:cr1:p_1271859438204";

	var createIDREFS = function(){

		var rString1 = strings.randomString(8, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString2 = strings.randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString3 = strings.randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString4 = strings.randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString5 = strings.randomString(12, '0123456789abcdefghijklmnopqrstuvwxyz');

		return "res_"+rString1+"_"+rString2+"_"+rString3+"_"+rString4+"_"+rString5;

	};


	var insert_cmdi_header = function(corpus_or_session){
		var profile_id;
		
		if ((corpus_or_session === 0) || (corpus_or_session == "corpus")){
			profile_id = imdi_corpus_profile;
		}

		else if ((corpus_or_session == 1) || (corpus_or_session == "session")){
			profile_id = imdi_session_profile;
		}
		
		else {
			return APP.error("An error has occurred! Cannot insert CMDI header without knowing if session or corpus is wanted.");
		}
		
		return xml.open("CMD",[["xmlns","http://www.clarin.eu/cmd/"],["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
		["CMDVersion","1.1"],["xsi:schemaLocation","http://www.clarin.eu/cmd/ http://catalog.clarin.eu/ds/ComponentRegistry/rest/registry/profiles/"+profile_id+"/xsd "]]);

	};


	var create_cmdi_session = function(session_id){
		
		xml.header();
		insert_cmdi_header("session");
		insert_header(get("metadata_creator"),today()+"+01:00",imdi_session_profile);
		
		//in resources is nothing, as this is a session and no corpus. attached media files in a cmdi session are further down
		xml.open("Resources");
		xml.element("ResourceProxyList", "");
		xml.element("JournalFileProxyList", "");
		xml.element("ResourceRelationList", "");
		xml.close("Resources");
		
		xml.open("Components");
		
		/*
		all imdi session metadata is in between the components tag, declared with tag <Session>
		sadly, the structure of an imdi session is a little bit different in cmdi files
		that is why there needs to be an extra method for creating cmdi sessions
		luckily, it is here:
		*/
		insert_cmdi_session_data(session_id);
		
		xml.close("Components");
		
		xml.close("CMD");
		
		
		
	};


	var insert_header = function(MdCreator, MdCreationDate, MdProfile){
		
		xml.open("Header");
		xml.element("MdCreator",MdCreator);
		xml.element("MdCreationDate",MdCreationDate);
		xml.element("MdProfile",MdProfile);
		xml.close("Header");
		
	};


	var insert_cmdi_session_data = function(session_id){
		
		xml.open("Session");
		xml.element("Name", get(session.dom_element_prefix+session_id+"_session_name"));
		xml.element("Title", get(session.dom_element_prefix+session_id+"_session_title"));
		
		xml.element("Date", APP.forms.getDateStringByDateInput(session.dom_element_prefix+session_id+"_session_date") || "Unspecified");
		
		// if a valid session date cannot be parsed from the form BUT there has been some input by the user
		// AND the user has not been warned before about that, warn him or her
		if (
			APP.forms.isUserDefinedDateInvalid(session.dom_element_prefix+session_id+"_session_date")
			&& (already_warned_for_invalid_dates == false)
		){
		
			APP.alert(
				parent.l("warning") +
				parent.l("output", "invalid_date_entered_in_session") + "<br>" +
				parent.l("output", "correct_or_ignore_warning")
			);
			
			already_warned_for_invalid_dates = true;
		}
		

		xml.open("MDGroup");
		xml.open("Location");
		xml.element("Continent", get(session.dom_element_prefix+session_id+"_session_location_continent"));
		xml.element("Country", get(session.dom_element_prefix+session_id+"_session_location_country"));
		xml.element("Region", get(session.dom_element_prefix+session_id+"_session_location_region"));
		xml.element("Address", get(session.dom_element_prefix+session_id+"_session_location_address"));
		xml.close("Location");
		
		
		xml.open("Project");
		xml.element("Name",get(session.dom_element_prefix+session_id+"_project_name"));
		xml.element("Title",get(session.dom_element_prefix+session_id+"_project_title"));
		xml.element("Id",get(session.dom_element_prefix+session_id+"_project_id"));
		
		xml.open("Contact");
		xml.element("Name",get(session.dom_element_prefix+session_id+"_project_contact_name"));
		xml.element("Address",get(session.dom_element_prefix+session_id+"_project_contact_address"));
		xml.element("Email",get(session.dom_element_prefix+session_id+"_project_contact_email"));
		xml.element("Organisation",get(session.dom_element_prefix+session_id+"_project_contact_organisation"));
		xml.close("Contact");
		xml.close("Project");
		xml.element("Keys", "");
		
		
		xml.open("Content");
		
		xml.element("Genre",get(session.dom_element_prefix+session_id+"_content_genre"));
		xml.element("SubGenre",get(session.dom_element_prefix+session_id+"_content_subgenre"));
		xml.element("Task",get(session.dom_element_prefix+session_id+"_content_task"));
		
		xml.element("Modalities", "");
		//no input yet
		
		xml.element("Subject", "");
		//no input yet
		
		xml.open("CommunicationContext");
		xml.element("Interactivity",get(session.dom_element_prefix+session_id+"_content_communication_context_interactivity"));
		xml.element("PlanningType",get(session.dom_element_prefix+session_id+"_content_communication_context_interactivity"));
		xml.element("Involvement",get(session.dom_element_prefix+session_id+"_content_communication_context_involvement"));	
		xml.element("SocialContext",get(session.dom_element_prefix+session_id+"_content_communication_context_socialcontext"));
		xml.element("EventStructure",get(session.dom_element_prefix+session_id+"_content_communication_context_eventstructure"));
		xml.element("Channel","Unknown");
		/* no input yet. channel must be one of
		<item ConceptLink="http://www.isocat.org/datcat/DC-2591">Unknown</item>
		<item ConceptLink="http://www.isocat.org/datcat/DC-2592">Unspecified</item>
		<item ConceptLink="http://www.isocat.org/datcat/DC-2593">Face to Face</item>
		<item ConceptLink="http://www.isocat.org/datcat/DC-2594">Experimental setting</item>
		<item ConceptLink="http://www.isocat.org/datcat/DC-2595">Broadcasting</item>
		<item ConceptLink="http://www.isocat.org/datcat/DC-2596">Telephone</item>
		<item ConceptLink="http://www.isocat.org/datcat/DC-2597">wizard-of-oz</item>
		<item ConceptLink="http://www.isocat.org/datcat/DC-2598">Human-machine dialogue</item>
		<item ConceptLink="http://www.isocat.org/datcat/DC-2599">Other</item>
		*/
		
		xml.close("CommunicationContext");
		
		xml.open("Content_Languages");
		insert_content_languages(session_id);
		xml.close("Content_Languages");
		
		
		
		xml.element("Keys", "");
	 
		xml.close("Content");
		
		xml.open("Actors");
		
		xml.open("descriptions");
			xml.element("Description", get(session.dom_element_prefix+session_id+"_actors_description"));
		xml.close("descriptions");
		
		for (var a=0;a<session.sessions[session.getSessionIndexFromID(session_id)].actors.actors.length;a++){
			insert_cmdi_actor(session_id,session.sessions[session.getSessionIndexFromID(session_id)].actors.actors[a]);
		}
		
		xml.close("Actors");  
		xml.close("MDGroup");
		
		xml.open("Resources");
		
		var id;
		
		for (var r = 0; r < session.sessions[session.getSessionIndexFromID(session_id)].resources.resources.mediaFiles.length;r++){  
		
			id = session.sessions[session.getSessionIndexFromID(session_id)].resources.resources.mediaFiles[r].id;
		
			insert_cmdi_mediafile(get(session.dom_element_prefix+session_id+'_mediafile_'+id+"_name"),get(session.dom_element_prefix+session_id+'_mediafile_'+id+"_size"));
		}
		
		for (r=0;r<session.sessions[session.getSessionIndexFromID(session_id)].resources.resources.writtenResources.length;r++){  

			id = session.sessions[session.getSessionIndexFromID(session_id)].resources.resources.writtenResources[r].id;	

			insert_cmdi_written_resource(get(session.dom_element_prefix+session_id+'_mediafile_'+id+"_name"),get(session.dom_element_prefix+session_id+'_mediafile_'+id+"_size"));
		}
		
		//more resource stuff
		xml.close("Resources");
		
		xml.close("Session");

		
		
	};

	
	var insert_content_languages = function (session_id) {

		
		
		var languages = corpus.content_languages.content_languages;
	
		for (var l=0;l<languages.length;l++){  //for all content languages // no session separate languages yet
	
			xml.open("Content_Language");
			xml.element("Id",APP.CONF.LanguageCodePrefix+languages[l][0]);
			xml.element("Name",languages[l][3]);
			xml.close("Content_Language");
	
		}

		
		
	};
	

	var insert_cmdi_written_resource = function(link,size){

		
		
		xml.open("WrittenResource");

		xml.element("ResourceLink",link);
		xml.element("MediaResourceLink","");

		xml.element("Date","Unspecified");
		//no input yet, but should come soon
		
		xml.element("Type",resources.getFileType(link).type);
		xml.element("SubType",resources.getFileType(link).type);
		xml.element("Format",resources.getFileType(link).mimetype);
		xml.element("Size",size);
		
		xml.open("Validation");
		xml.element("Type","");
		xml.element("Methodology","");
		xml.element("Level","Unspecified");
		xml.element("Description","");
		xml.close("Validation");

		xml.element("Derivation","");

		xml.element("CharacterEncoding","");
		xml.element("ContentEncoding","");
		xml.element("LanguageId","");
		xml.element("Anonymized","Unspecified");

		xml.open("Access");

		xml.element("Availability", "");
		xml.element("Date", "");
		xml.element("Owner", "");
		xml.element("Publisher", "");
		
		xml.open("Contact");
		xml.element("Name", "");
		xml.element("Address", "");
		xml.element("Email", "");
		xml.element("Organisation", "");
		xml.close("Contact");

		xml.element("Description","");

		xml.close("Access");

		xml.element("Description","");
		xml.element("Keys","");
		xml.close("WrittenResource");

		
		
	};


	var insert_cmdi_mediafile = function(link,size){

		
		xml.open("MediaFile");
		xml.element("ResourceLink",link);
		xml.element("Type",resources.getFileType(link).type);
		xml.element("Format",resources.getFileType(link).mimetype);
		xml.element("Size",size);
		
		xml.element("Quality","Unspecified");
		// no input yet
		
		xml.tag("RecordingConditions", "");
		
		xml.open("TimePosition");
		
		xml.element("Start","Unspecified");
		xml.element("End","Unspecified");
		//no input yet
		
		xml.close("TimePosition");
		

		xml.open("Access");

		xml.element("Availability", "");
		xml.element("Date", "");
		xml.element("Owner", "");
		xml.element("Publisher", "");
		
		xml.open("Contact");
		xml.element("Name", "");
		xml.element("Address", "");
		xml.element("Email", "");
		xml.element("Organisation", "");
		xml.close("Contact");

		xml.close("Access");

		xml.element("Keys","");
		
		xml.close("MediaFile");

		
	};


	var insert_cmdi_actor = function(session_id,actor_id){

		var i = actor.getIndexByID(actor_id);
		var ac = actor.actors[i];

		
		xml.open("Actor");
		xml.element("Role",ac.role);
		xml.element("Name",ac.name);
		xml.element("FullName",ac.full_name);
		xml.element("Code",ac.code);
		xml.element("FamilySocialRole",ac.family_social_role);
		xml.element("EthnicGroup",ac.ethnic_group);   
		
		//Age field
		xml.open("Age");
		actor.getAge(session_id,actor_id);
		xml.close("Age");	
		//End of age field
		
		xml.element("BirthDate", APP.forms.getDateStringByDateObject(ac.birth_date) || "Unspecified");
		

		if (
			APP.forms.isUserDefinedDateInvalid(ac.birth_date)
			&& (already_warned_for_invalid_birth_dates == false)
		){

			APP.alert(
				parent.l("warning") +
				parent.l("output", "invalid_birth_date_entered") + "<br>" +
				parent.l("output", "correct_or_ignore_warning")
			);
			
			already_warned_for_invalid_birth_dates = true;
		}
		
		
		xml.element("Sex",ac.sex);
		xml.element("Education",(ac.education !== "") ? ac.education : "Unspecified" );
		xml.element("Anonymized",(ac.anonymized) ? "true" : "false"); 
		
		xml.open("Contact");
		xml.element("Name",ac.contact.name);   
		xml.element("Address",ac.contact.address);   
		xml.element("Email",ac.contact.email);   
		xml.element("Organisation",ac.contact.organisation);   
		xml.close("Contact");

		xml.element("Keys", "");
		
		xml.open("descriptions");
		xml.element("Description",ac.description);
		xml.close("descriptions");	
		
		xml.open("Actor_Languages");
		//xml.element("Description","");
		
		for (var l=0; l<ac.languages.length; l++){
		
			xml.open("Actor_Language");
			xml.element("Id",APP.CONF.LanguageCodePrefix+ac.languages[l].LanguageObject[0]);
			xml.element("Name",ac.languages[l].LanguageObject[3]);
			
			xml.element("MotherTongue",(ac.languages[l].MotherTongue) ? "true" : "false");
			xml.element("PrimaryLanguage",(ac.languages[l].PrimaryLanguage) ? "true" : "false");		

			
			xml.close("Actor_Language");
		
		}

		xml.close("Actor_Languages");
		
		xml.close("Actor");

		
		
	};


	var create_cmdi_corpus = function(){
		
		var IDREFS = [];
		
		
		xml.header;

		insert_cmdi_header("corpus");

		insert_header(get("metadata_creator"),today()+"+01:00",imdi_corpus_profile);

		xml.open("Resources");

		//Resource Proxy List contains other CMDI files, e.g. CMDI sessions, if this is a corpus
		if (session.sessions.length > 0){
			xml.open("ResourceProxyList");
			
			for (var i=1;i<=session.sessions.length;i++){  
			
				IDREFS.push(createIDREFS());
				
				xml.open("ResourceProxy",[["id",IDREFS[i-1]]]);
				xml.element("ResourceType","Metadata");
				xml.element("ResourceRef",get(session.dom_element_prefix+session.sessions[i-1].id+"_session_name")+".cmdi");
				xml.close("ResourceProxy");
			}
			
			xml.close("ResourceProxyList");
		}
		
		else {
			xml.element("ResourceProxyList", "");
		}
		
		xml.element("JournalFileProxyList", "");
		xml.element("ResourceRelationList", "");
		xml.close("Resources");
		xml.open("Components");

		var IDREFS_string = IDREFS.join(" ");
		
		xml.open("imdi-corpus",[["ref",IDREFS_string]]);
		xml.open("Corpus");
		
		xml.element("Name",get("corpus_name"));
		xml.element("Title",get("corpus_title"));
		//seems like there is no field for description here!
		
		xml.close("Corpus");
		xml.close("imdi-corpus");
		xml.close("Components");
		xml.close("CMD");

	};
	
	var my = {};
	my.sessions = [];
	
	var xml = new XMLString();
	my.corpus = create_cmdi_corpus();
    
	for (var s = 0; s < session.sessions.length; s++){
	
		xml = new XMLString();
		my.sessions.push(create_cmdi_session(session.sessions[s].id));
		
	}

	return my;

};