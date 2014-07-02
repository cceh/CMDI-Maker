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


imdi_environment.cmdi_generator = function(){
	
	var corpus = imdi_environment.workflow[0];
	var resources = imdi_environment.workflow[1];
	var actor = imdi_environment.workflow[2];
	var session = imdi_environment.workflow[3];

	var imdi_corpus_profile="clarin.eu:cr1:p_1274880881885";
	var imdi_session_profile="clarin.eu:cr1:p_1271859438204";

	var createIDREFS = function(){

		var rString1 = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString2 = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString3 = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString4 = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyz');
		var rString5 = randomString(12, '0123456789abcdefghijklmnopqrstuvwxyz');

		return "res_"+rString1+"_"+rString2+"_"+rString3+"_"+rString4+"_"+rString5;

	}


	var insert_cmdi_header = function(corpus_or_session){
		
		if ((corpus_or_session == 0) || (corpus_or_session == "corpus")){
			var profile_id = imdi_corpus_profile;
		}

		else if ((corpus_or_session == 1) || (corpus_or_session == "session")){
			var profile_id = imdi_session_profile;
		}
		
		else {
			return alert("An error has occurred! Cannot insert CMDI header without knowing if session or corpus is wanted.");
		}
		
		return xml.tag("CMD",0,[["xmlns","http://www.clarin.eu/cmd/"],["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
		["CMDVersion","1.1"],["xsi:schemaLocation","http://www.clarin.eu/cmd/ http://catalog.clarin.eu/ds/ComponentRegistry/rest/registry/profiles/"+profile_id+"/xsd "]]);

	}


	var create_cmdi_session = function(session_id){
		
		var return_string = "";
		return_string+=xml.header;
		return_string+=insert_cmdi_header("session");
		return_string+=insert_header(get("metadata_creator"),today()+"+01:00",imdi_session_profile);
		
		//in resources is nothing, as this is a session and no corpus. attached media files in a cmdi session are further down
		return_string+=xml.tag("Resources",0);
		return_string+=xml.tag("ResourceProxyList",2);
		return_string+=xml.tag("JournalFileProxyList",2);
		return_string+=xml.tag("ResourceRelationList",2);
		return_string+=xml.tag("Resources",1);
		
		return_string += xml.tag("Components",0);
		
		/*
		all imdi session metadata is in between the components tag, declared with tag <Session>
		sadly, the structure of an imdi session is a little bit different in cmdi files
		that is why there needs to be an extra method for creating cmdi sessions
		luckily, it is here:
		*/
		return_string += insert_cmdi_session_data(session_id);
		
		return_string += xml.tag("Components",1);
		
		return_string += xml.tag("CMD",1);
		
		return return_string;
		
	}


	var insert_header = function(MdCreator,MdCreationDate,MdProfile){
		
		var return_string = "";
		return_string+=xml.tag("Header",0);
		return_string+=xml.element("MdCreator",MdCreator);
		return_string+=xml.element("MdCreationDate",MdCreationDate);
		return_string+=xml.element("MdProfile",MdProfile);
		return_string+=xml.tag("Header",1);
		
		return return_string;
		
	}


	var insert_cmdi_session_data = function(session_id){
		
		var return_string = "";
		
		return_string += xml.tag("Session",0);
		return_string += xml.element("Name",get(APP_CONF.session_dom_element_prefix+session_id+"_session_name"));
		return_string += xml.element("Title",get(APP_CONF.session_dom_element_prefix+session_id+"_session_title"));
		
		
		if ((get(APP_CONF.session_dom_element_prefix+session_id+"_session_date_year") != "") && (get(APP_CONF.session_dom_element_prefix+session_id+"_session_date_year") != "YYYY")){
		
			return_string += xml.element("Date",get(APP_CONF.session_dom_element_prefix+session_id+"_session_date_year")+"-"+get(APP_CONF.session_dom_element_prefix+session_id+"_session_date_month")+"-"+get(APP_CONF.session_dom_element_prefix+session_id+"_session_date_day"));
			
		}
		
		else {
		
			return_string += xml.element("Date","Unspecified");
		
		}
		
		
		return_string += xml.tag("MDGroup",0);
		return_string += xml.tag("Location",0);
		return_string += xml.element("Continent",get(APP_CONF.session_dom_element_prefix+session_id+"_session_location_continent"));
		return_string += xml.element("Country",get(APP_CONF.session_dom_element_prefix+session_id+"_session_location_country"));
		return_string += xml.element("Region",get(APP_CONF.session_dom_element_prefix+session_id+"_session_location_region"));
		return_string += xml.element("Address",get(APP_CONF.session_dom_element_prefix+session_id+"_session_location_address"));
		return_string += xml.tag("Location",1);
		
		
		return_string += xml.tag("Project",0);
		return_string += xml.element("Name",get(APP_CONF.session_dom_element_prefix+session_id+"_project_name"));
		return_string += xml.element("Title",get(APP_CONF.session_dom_element_prefix+session_id+"_project_title"));
		return_string += xml.element("Id",get(APP_CONF.session_dom_element_prefix+session_id+"_project_id"));
		
		return_string += xml.tag("Contact",0);
		return_string += xml.element("Name",get(APP_CONF.session_dom_element_prefix+session_id+"_project_contact_name"));
		return_string += xml.element("Address",get(APP_CONF.session_dom_element_prefix+session_id+"_project_contact_address"));
		return_string += xml.element("Email",get(APP_CONF.session_dom_element_prefix+session_id+"_project_contact_email"));
		return_string += xml.element("Organisation",get(APP_CONF.session_dom_element_prefix+session_id+"_project_contact_organisation"));
		return_string += xml.tag("Contact",1);
		return_string += xml.tag("Project",1);
		return_string += xml.tag("Keys",2);
		return_string += xml.tag("Content",0);
		
		return_string += xml.element("Genre",get(APP_CONF.session_dom_element_prefix+session_id+"_content_genre"));
		return_string += xml.element("SubGenre",get(APP_CONF.session_dom_element_prefix+session_id+"_content_subgenre"));
		return_string += xml.element("Task",get(APP_CONF.session_dom_element_prefix+session_id+"_content_task"));
		
		return_string += xml.element("Modalities","");
		//no input yet
		
		return_string += xml.element("Subject","");
		//no input yet
		
		return_string += xml.tag("CommunicationContext",0);
		return_string += xml.element("Interactivity",get(APP_CONF.session_dom_element_prefix+session_id+"_content_communication_context_interactivity"));
		return_string += xml.element("PlanningType",get(APP_CONF.session_dom_element_prefix+session_id+"_content_communication_context_interactivity"));
		return_string += xml.element("Involvement",get(APP_CONF.session_dom_element_prefix+session_id+"_content_communication_context_involvement"));	
		return_string += xml.element("SocialContext",get(APP_CONF.session_dom_element_prefix+session_id+"_content_communication_context_socialcontext"));
		return_string += xml.element("EventStructure",get(APP_CONF.session_dom_element_prefix+session_id+"_content_communication_context_eventstructure"));
		return_string += xml.element("Channel","Unknown");
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
		
		return_string += xml.tag("CommunicationContext",1);
		
		return_string += xml.tag("Content_Languages",0);
		return_string += insert_content_languages(session_id);
		return_string += xml.tag("Content_Languages",1);
		
		
		
		return_string += xml.tag("Keys",2);
	 
		return_string += xml.tag("Content",1);
		
		return_string += xml.tag("Actors",0);
		
		for (var a=0;a<session.sessions[session.getSessionIndexFromID(session_id)].actors.actors.length;a++){
			return_string += insert_cmdi_actor(session_id,session.sessions[session.getSessionIndexFromID(session_id)].actors.actors[a]);
		}
		
		return_string += xml.tag("Actors",1);  
		return_string += xml.tag("MDGroup",1);
		
		return_string += xml.tag("Resources",0);
		
		for (var r=0;r<session.sessions[session.getSessionIndexFromID(session_id)].resources.mediaFiles.length;r++){  
		
			var id = session.sessions[session.getSessionIndexFromID(session_id)].resources.mediaFiles[r].id;
		
			return_string += insert_cmdi_mediafile(get(APP_CONF.session_dom_element_prefix+session_id+'_mediafile_'+id+"_name"),get(APP_CONF.session_dom_element_prefix+session_id+'_mediafile_'+id+"_size"));
		}
		
		for (var r=0;r<session.sessions[session.getSessionIndexFromID(session_id)].resources.writtenResources.length;r++){  

			var id = session.sessions[session.getSessionIndexFromID(session_id)].resources.writtenResources[r].id;	

			return_string += insert_cmdi_written_resource(get(APP_CONF.session_dom_element_prefix+session_id+'_mediafile_'+id+"_name"),get(APP_CONF.session_dom_element_prefix+session_id+'_mediafile_'+id+"_size"));
		}
		
		//more resource stuff
		return_string += xml.tag("Resources",1);
		
		return_string += xml.tag("Session",1);
	   
		return return_string;
		
	}

	
	var insert_content_languages = function (session_id) {

		var return_string = "";
		
		var languages = corpus.content_languages.content_languages;
	
		for (var l=0;l<languages.length;l++){  //for all content languages // no session separate languages yet
	
			return_string += xml.tag("Content_Language",0);
			return_string += xml.element("Id",APP_CONF.LanguageCodePrefix+languages[l][0]);
			return_string += xml.element("Name",languages[l][3]);
			return_string += xml.tag("Content_Language",1);
	
		}

		return return_string;
		
	}
	

	var insert_cmdi_written_resource = function(link,size){

		var return_string = "";
		
		return_string += xml.tag("WrittenResource",0);

		return_string += xml.element("ResourceLink",link);
		return_string += xml.element("MediaResourceLink","");

		return_string += xml.element("Date","Unspecified");
		//no input yet, but should come soon
		
		return_string += xml.element("Type",resources.getFileType(link).type);
		return_string += xml.element("SubType",resources.getFileType(link).type);
		return_string += xml.element("Format",resources.getFileType(link).mimetype);
		return_string += xml.element("Size",size);
		
		return_string += xml.tag("Validation",0);
		return_string += xml.element("Type","");
		return_string += xml.element("Methodology","");
		return_string += xml.element("Level","Unspecified");
		return_string += xml.element("Description","");
		return_string += xml.tag("Validation",1);

		return_string += xml.element("Derivation","");

		return_string += xml.element("CharacterEncoding","");
		return_string += xml.element("ContentEncoding","");
		return_string += xml.element("LanguageId","");
		return_string += xml.element("Anonymized","Unspecified");

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

		return_string += xml.element("Description","");

		return_string += xml.tag("Access",1);

		return_string += xml.element("Description","");
		return_string += xml.element("Keys","");
		return_string += xml.tag("WrittenResource",1);

		return return_string;
		
	}


	var insert_cmdi_mediafile = function(link,size){

		var return_string = "";
		return_string += xml.tag("MediaFile",0);
		return_string += xml.element("ResourceLink",link);
		return_string += xml.element("Type",resources.getFileType(link).type);
		return_string += xml.element("Format",resources.getFileType(link).mimetype);
		return_string += xml.element("Size",size);
		
		return_string += xml.element("Quality","Unspecified");
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

		return_string += xml.tag("Access",1);

		return_string += xml.element("Keys","");
		
		return_string += xml.tag("MediaFile",1);

		return return_string;
	}


	var insert_cmdi_actor = function(session_id,actor_id){

		var i = actor.getActorsIndexFromID(actor_id);
		var ac = actor.actors[i];

		var return_string = "";
		return_string+=xml.tag("Actor",0);
		return_string+=xml.element("Role",ac.role);
		return_string+=xml.element("Name",ac.name);
		return_string+=xml.element("FullName",ac.full_name);
		return_string+=xml.element("Code",ac.code);
		return_string+=xml.element("FamilySocialRole",ac.family_social_role);
		return_string+=xml.element("EthnicGroup",ac.ethnic_group);   
		
		//Age field
		return_string += xml.tag("Age",0);
		return_string += actor.getAge(session_id,actor_id);
		return_string += xml.tag("Age",1);	
		//End of age field
		
		if ((ac.birth_date.year != "") && (ac.birth_date.year != "YYYY")){
		
			return_string += xml.element("BirthDate",ac.birth_date.year+"-"+ac.birth_date.month+"-"+ac.birth_date.day);
			
		}
		
		else {
		
			return_string += xml.element("BirthDate","Unspecified");
		
		}
		
		return_string+=xml.element("Sex",ac.sex);
		return_string+=xml.element("Education",(ac.education != "") ? ac.education : "Unspecified" );
		return_string+=xml.element("Anonymized",(ac.anonymized) ? "true" : "false"); 
		
		return_string+=xml.tag("Contact",0);
		return_string+=xml.element("Name",ac.contact.name);   
		return_string+=xml.element("Address",ac.contact.address);   
		return_string+=xml.element("Email",ac.contact.email);   
		return_string+=xml.element("Organisation",ac.contact.organisation);   
		return_string+=xml.tag("Contact",1);

		return_string += xml.tag("Keys",2);
		
		return_string += xml.tag("descriptions",0);
		return_string += xml.element("Description",ac.description);
		return_string += xml.tag("descriptions",1);	
		
		return_string += xml.tag("Actor_Languages",0);
		//return_string += xml.element("Description","");
		
		for (var l=0; l<ac.languages.length; l++){
		
			return_string += xml.tag("Actor_Language",0);
			return_string += xml.element("Id",APP_CONF.LanguageCodePrefix+ac.languages[l].LanguageObject[0]);
			return_string += xml.element("Name",ac.languages[l].LanguageObject[3]);
			
			return_string += xml.element("MotherTongue",(ac.languages[l].MotherTongue) ? "true" : "false");
			return_string += xml.element("PrimaryLanguage",(ac.languages[l].PrimaryLanguage) ? "true" : "false");		

			
			return_string += xml.tag("Actor_Language",1);
		
		}

		return_string += xml.tag("Actor_Languages",1);
		
		return_string+=xml.tag("Actor",1);
	  
		return return_string;
		
	}


	var create_cmdi_corpus = function(){
		
		var IDREFS = [];
		
		var return_string = "";
		return_string+=xml.header;

		return_string+=insert_cmdi_header("corpus");

		return_string+=insert_header(get("metadata_creator"),today()+"+01:00",imdi_corpus_profile);

		return_string+=xml.tag("Resources",0);

		//Resource Proxy List contains other CMDI files, e.g. CMDI sessions, if this is a corpus
		if (session.sessions.length > 0){
			return_string+=xml.tag("ResourceProxyList",0);
			
			for (var i=1;i<=session.sessions.length;i++){  
			
				IDREFS.push(createIDREFS());
				
				return_string+=xml.tag("ResourceProxy",0,[["id",IDREFS[i-1]]]);
				return_string+=xml.element("ResourceType","Metadata");
				return_string+=xml.element("ResourceRef",get(APP_CONF.session_dom_element_prefix+session.sessions[i-1].id+"_session_name")+".cmdi");
				return_string+=xml.tag("ResourceProxy",1);
			}
			
			return_string+=xml.tag("ResourceProxyList",1)
		}
		
		else {
			return_string+=xml.element("ResourceProxyList",2);
		}
		
		return_string+=xml.tag("JournalFileProxyList",2);
		return_string+=xml.tag("ResourceRelationList",2);
		return_string+=xml.tag("Resources",1);
		return_string+=xml.tag("Components",0);

		var IDREFS_string = IDREFS.join(" ");
		
		return_string+=xml.tag("imdi-corpus",0,[["ref",IDREFS_string]]);
		return_string+=xml.tag("Corpus",0);
		
		return_string+=xml.element("Name",get("corpus_name"));
		return_string+=xml.element("Title",get("corpus_title"));
		//seems like there is no field for description here!
		
		return_string+=xml.tag("Corpus",1);
		return_string+=xml.tag("imdi-corpus",1);
		return_string+=xml.tag("Components",1);
		return_string+=xml.tag("CMD",1);

		return return_string;

	}
	
	var my = {};
	my.sessions = [];           
	my.corpus = create_cmdi_corpus();
    
	for (var s=0;s<session.sessions.length;s++){
		my.sessions.push(create_cmdi_session(session.sessions[s].id));
	}

	return my;

}