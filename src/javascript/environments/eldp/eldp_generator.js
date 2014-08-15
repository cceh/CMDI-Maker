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


eldp_environment.eldp_generator = function(){
"use strict";
	
	var resources = eldp_environment.workflow[0];
	var actor = eldp_environment.workflow[1];
	var bundle = eldp_environment.workflow[2];


	var create_cmdi_session = function(session_id){
		
		var return_string = "";
		return_string+=xml.header;
		//return_string+=insert_cmdi_header("session");
		//return_string+=insert_header(get("metadata_creator"),today()+"+01:00",imdi_session_profile);
		
		//in resources is nothing, as this is a session and no corpus. attached media files in a cmdi session are further down
		return_string+=xml.tag("Resources",0);
		return_string+=xml.tag("ResourceProxyList",2);
		return_string+=xml.tag("JournalFileProxyList",2);
		return_string+=xml.tag("ResourceRelationList",2);
		return_string+=xml.tag("Resources",1);
		
		return_string += xml.tag("Components",0);
		
		//return_string += insert_cmdi_session_data(session_id);
		
		return_string += xml.tag("Components",1);
		
		return_string += xml.tag("CMD",1);
		
		return return_string;
		
	}


	
	var insert_content_languages = function (session_id) {

		var return_string = "";
		
		var languages = corpus.content_languages.content_languages;
	
		for (var l=0;l<languages.length;l++){  //for all content languages // no session separate languages yet
	
			return_string += xml.tag("Content_Language",0);
			return_string += xml.element("Id",APP.CONF.LanguageCodePrefix+languages[l][0]);
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
			return_string += xml.element("Id",APP.CONF.LanguageCodePrefix+ac.languages[l].LanguageObject[0]);
			return_string += xml.element("Name",ac.languages[l].LanguageObject[3]);
			
			return_string += xml.element("MotherTongue",(ac.languages[l].MotherTongue) ? "true" : "false");
			return_string += xml.element("PrimaryLanguage",(ac.languages[l].PrimaryLanguage) ? "true" : "false");		

			
			return_string += xml.tag("Actor_Language",1);
		
		}

		return_string += xml.tag("Actor_Languages",1);
		
		return_string+=xml.tag("Actor",1);
	  
		return return_string;
		
	}
	
	var my = {};
	my.bundles = map(bundle.bundles, function (bundle){
		return create_cmdi_session(bundle.id);
	});

	return my;

}