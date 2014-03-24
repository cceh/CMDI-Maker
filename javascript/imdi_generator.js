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


function get_metadata_language(){

	var return_string = LanguageCodePrefix;	
	return_string += g("metadata_language_select").options[g("metadata_language_select").options.selectedIndex].value;

	return return_string;

}
	


function get_actors_age(session, actor_id){

	var i = getActorsIndexFromID(actor_id);
	
	if (actors[i].age == ""){   //at first, check, if actor's age hasn't been specified yet
	
		if (document.metadata_form.radio_age_calc[0].checked == true){  //then, check if auto calculate feature in settings is activated
			
			var birthDate = actors[i].birth_date.year + "-" + actors[i].birth_date.month + "-" + actors[i].birth_date.day;
			var sessionDate = get("session_"+session+"_date_year") + "-" + get("session_"+session+"_date_month") + "-" + get("session_"+session+"_date_day"); 
			var age_calc_result = calcAgeAtDate(sessionDate,birthDate);
			
			if (age_calc_result != 0){
			
				console.log("Actor's age successfully calculated");			
				return age_calc_result;
		
			}
			
			else {  //if age calc = 0, age could not be calculated
			
				return "Unspecified";
			
			}
			
		}
		
		else {	//if feature is activated, but age has not been specified
		
			return "Unspecified";
		
		}
	}
	
	else { //if actor's age has been specified
	
		return actors[i].age;
	
	}

}



var imdi_generator = function(){
	
	var create_imdi_corpus = function () {
    
		return_string = "";
		return_string += xml.header;
		return_string += create_imdi_header("CORPUS",originator,"1.0",today());
		return_string += xml.tag("Corpus",0);
        return_string += xml.element("Name",get('corpus_name'));
		return_string += xml.element("Title",get('corpus_title'));   
		return_string += xml.element("Description",get('corpus_description'),[["LanguageId",get_metadata_language()]]);       
    
        for (var i=0; i<sessions.length; i++){
			return_string += xml.element("CorpusLink","Session"+(i+1)+"_"+get("session_"+sessions[i].id+"_name")+".imdi",[["Name",get("session_"+sessions[i].id+"_name")]]);
		}
    
		return_string += xml.tag("Corpus",1);
		return_string += xml.tag("METATRANSCRIPT",1);
    
		return return_string;
    
	}

	
	var create_imdi_session = function (session) {
    
		var return_string = "";
    
		return_string+=xml.header;
		return_string+=create_imdi_header("SESSION",originator,"1.0",today());
		return_string+=xml.tag("Session",0);
		return_string+=xml.element("Name",get("session_"+session+"_name"));
		return_string+=xml.element("Title",get("session_"+session+"_title"));


		if ((get("session_"+session+"_date_year") != "") && (get("session_"+session+"_date_year") != "YYYY")){
	
			return_string += xml.tag("Date",0);
			return_string += get("session_"+session+"_date_year") + "-" + get("session_"+session+"_date_month") + "-" + get("session_"+session+"_date_day");
			return_string += xml.tag("Date",1);
		
		}	

		else {
			return_string+=xml.element("Date","Unspecified");
		}
   
		return_string+=xml.element("Description",get("session_"+session+"_description"),[["LanguageId",get_metadata_language()],["Link",""]]);
   
		return_string+=xml.tag("MDGroup",0);
		return_string+=xml.tag("Location",0);
		return_string+=xml.element("Continent",get("session_"+session+"_location_continent"),[["Link","http://www.mpi.nl/IMDI/Schema/Continents.xml"],["Type","ClosedVocabulary"]]);
		return_string+=xml.element("Country",get("session_"+session+"_location_country"),[["Link","http://www.mpi.nl/IMDI/Schema/Countries.xml"],["Type","OpenVocabulary"]]);
		return_string+=xml.element("Region",get("session_"+session+"_location_region"));
		return_string+=xml.element("Address",get("session_"+session+"_location_address"));
		return_string+=xml.tag("Location",1);

		return_string+=xml.tag("Project",0);
		return_string+=xml.element("Name",get("session_"+session+"_project_name"));
		return_string+=xml.element("Title",get("session_"+session+"_project_title"));
		return_string+=xml.element("Id",get("session_"+session+"_project_id"));
		return_string+=xml.tag("Contact",0);
		return_string+=xml.element("Name",get("session_"+session+"_contact_name"));
		return_string+=xml.element("Address",get("session_"+session+"_contact_address"));
		return_string+=xml.element("Email",get("session_"+session+"_contact_email"));
		return_string+=xml.element("Organisation",get("session_"+session+"_contact_organisation"));
		return_string+=xml.tag("Contact",1);
		return_string+=xml.element("Description",get("session_"+session+"_project_description"),[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string+=xml.tag("Project",1);
		return_string+=xml.tag("Keys",0);
		return_string+=xml.tag("Keys",1);
		return_string+=insert_session_content(session);

		//Actors
		return_string+=xml.tag("Actors",0);
    
		for (var a=0;a<sessions[GetSessionIndexFromID(session)].actors.length;a++){
			return_string += insert_actor(session,sessions[GetSessionIndexFromID(session)].actors[a]);
		}

		return_string+=xml.tag("Actors",1);
		return_string+=xml.tag("MDGroup",1);
		return_string+=xml.tag("Resources",0);

		for (var r=0;r<sessions[GetSessionIndexFromID(session)].mediaFiles.length;r++){  
	
			var id = sessions[GetSessionIndexFromID(session)].mediaFiles[r].id;
			return_string += insert_mediafile(get('session_'+session+'_mediafile_'+id+"_name"),get('session_'+session+'_mediafile_'+id+"_size"));
		}
	
		for (var r=0;r<sessions[GetSessionIndexFromID(session)].writtenResources.length;r++){  

			var id = sessions[GetSessionIndexFromID(session)].writtenResources[r].id;	
			return_string += insert_written_resource(get('session_'+session+'_mediafile_'+id+"_name"),get('session_'+session+'_mediafile_'+id+"_size"));
		}
    
		return_string+=xml.tag("Resources",1);
		return_string+=xml.tag("References",0);
		return_string+=xml.tag("References",1);
		return_string+=xml.tag("Session",1);
		return_string+=xml.tag("METATRANSCRIPT",1);
   
		return return_string;
    
	}	
	
	
	var insert_session_content = function (session) {

		return_string = "";
		return_string += xml.tag("Content",0);
		return_string += xml.element("Genre",get("session_"+session+"_content_genre"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Genre.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("SubGenre",get("session_"+session+"_content_subgenre"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-SubGenre.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.element("Task",get("session_"+session+"_content_task"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Task.xml"],["Type","OpenVocabulary"]]);
	
		return_string += xml.element("Modalities","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Modalities.xml"],["Type","OpenVocabulary"]]);
		//no input yet
		return_string += xml.element("Subject","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Subject.xml"],["Type","OpenVocabularyList"]]);
		//no input yet

		return_string += xml.tag("CommunicationContext",0);
		return_string += xml.element("Interactivity",get("session_"+session+"_content_interactivity"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Interactivity.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("PlanningType",get("session_"+session+"_content_planningtype"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-PlanningType.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Involvement",get("session_"+session+"_content_involvement"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-Involvement.xml"],["Type","ClosedVocabulary"]]);	
		return_string += xml.element("SocialContext",get("session_"+session+"_content_socialcontext"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-SocialContext.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("EventStructure",get("session_"+session+"_content_eventstructure"),[["Link","http://www.mpi.nl/IMDI/Schema/Content-EventStructure.xml"],["Type","ClosedVocabulary"]]);

		return_string += xml.element("Channel","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Channel.xml"],["Type","ClosedVocabulary"]]);
		//no input yet

		return_string += xml.tag("CommunicationContext",1);
		return_string += xml.tag("Languages",0);
	
		return_string+=xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
		//no input yet

		return_string += insert_content_languages(session);
		return_string += xml.tag("Languages",1);
		return_string += xml.element("Keys","");
		return_string += xml.element("Description",get("session_"+session+"_content_description"),[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.tag("Content",1);

		return return_string;

	}
	

	var insert_content_languages = function (session) {

		var return_string = "";
	
		for (var l=0;l<content_languages.length;l++){  //for all content languages // no session separate languages yet
	
			return_string += xml.tag("Language",0);
			return_string += xml.element("Id",LanguageCodePrefix+content_languages[l][0]);
			return_string += xml.element("Name",content_languages[l][3],[["Link","http://www.mpi.nl/IMDI/Schema/MPI-Languages.xml"],["Type","OpenVocabulary"]]);
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
	    return_string += xml.element("Type",get_file_type(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Type.xml"],["Type","OpenVocabulary"]]);
		return_string += xml.element("SubType",get_file_type(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-SubType.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.element("Format",get_file_type(link).mimetype,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Format.xml"],["Type","OpenVocabulary"]]);
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
		return_string += xml.element("Type",get_file_type(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/MediaFile-Type.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Format",get_file_type(link).mimetype,[["Link","http://www.mpi.nl/IMDI/Schema/MediaFile-Format.xml"],["Type","OpenVocabulary"]]);
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


	var insert_actor = function (session, actor_id) {

		var i = getActorsIndexFromID(actor_id);

		var return_string = "";
		return_string += xml.tag("Actor",0);
		return_string += xml.element("Role",actors[i].role,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-Role.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.element("Name",actors[i].name);
		return_string += xml.element("FullName",actors[i].full_name);
		return_string += xml.element("Code",actors[i].code);
		return_string += xml.element("FamilySocialRole",actors[i].family_social_role,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-FamilySocialRole.xml"],["Type","OpenVocabularyList"]]);
		return_string += xml.tag("Languages",0);
		return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
	
		for (var l=0; l<actors[i].languages.length; l++){
	
			return_string += xml.tag("Language",0);
			return_string += xml.element("Id",LanguageCodePrefix+actors[i].languages[l].LanguageObject[0]);
			return_string += xml.element("Name",actors[i].languages[l].LanguageObject[3],[["Link","http://www.mpi.nl/IMDI/Schema/MPI-Languages.xml"],["Type","OpenVocabulary"]]);
			return_string += xml.element("MotherTongue",(actors[i].languages[l].MotherTongue) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			return_string += xml.element("PrimaryLanguage",(actors[i].languages[l].PrimaryLanguage) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);		
			return_string += xml.element("Description","",[["LanguageId",get_metadata_language()],["Link",""]]);
			return_string += xml.tag("Language",1);
	
		}
	
		return_string += xml.tag("Languages",1);
		return_string += xml.element("EthnicGroup",actors[i].ethnic_group);   
	
		//Age field
		return_string += xml.tag("Age",0);
		return_string += get_actors_age(session,actor_id);
		return_string += xml.tag("Age",1);	
		//End of age field
	
		return_string+=xml.tag("BirthDate",0);
	
		if ((actors[i].birth_date.year != "") && (actors[i].birth_date.year != "YYYY")){
			return_string += actors[i].birth_date.year + "-" + actors[i].birth_date.month + "-" + actors[i].birth_date.day;
		}	
	
		else {
			return_string += "Unspecified";
		}
	
		return_string += xml.tag("BirthDate",1);	
	    return_string += xml.element("Sex",actors[i].sex,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-Sex.xml"],["Type","ClosedVocabulary"]]);
		return_string += xml.element("Education",(actors[i].education != "") ? actors[i].education : "Unspecified" );
		return_string += xml.element("Anonymized",(actors[i].anonymized) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]); 
		return_string += xml.tag("Contact",0);
		return_string += xml.element("Name",actors[i].contact.name);   
		return_string += xml.element("Address",actors[i].contact.address);   
		return_string += xml.element("Email",actors[i].contact.email);   
		return_string += xml.element("Organisation",actors[i].contact.organisation);   
	    return_string += xml.tag("Contact",1);
		return_string += xml.tag("Keys",2);
    	return_string += xml.element("Description",actors[i].description,[["LanguageId",get_metadata_language()],["Link",""]]);
		return_string += xml.tag("Actor",1);
		return return_string;
    
	}
	
	var my = {};
    my.sessions = [];           
    my.corpus = create_imdi_corpus();
    
	for (var s=0;s<sessions.length;s++){   
		my.sessions.push(create_imdi_session(sessions[s].id));
	}

	return my;
	
}