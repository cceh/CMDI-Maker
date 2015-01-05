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
	var actors = data.actors;
	var sessions = data.sessions;
	
	var parent = imdi_environment;
	
	
	var already_warned_for_invalid_dates = false;
	var already_warned_for_invalid_birth_dates = false;

	var imdi_version = "IMDI 3.04";
	
	var getMetadataLanguage = function(){

		var rs = APP.CONF.LanguageCodePrefix;	
		rs += g("metadata_language_select").options[g("metadata_language_select").options.selectedIndex].value;

		return rs;

	}
	
	var create_imdi_corpus = function (corpus, sessions) {
    
		var rs = "";
		rs += xml.header;
		rs += create_imdi_header("CORPUS", APP.CONF.originator, "1.0", today());
		rs += xml.open("Corpus");
        rs += xml.element("Name", corpus.name);
		rs += xml.element("Title", corpus.title);   
		rs += xml.element("Description", corpus.description, [["LanguageId",getMetadataLanguage()]]);       
    
        for (var i = 0; i < sessions.length; i++){
			rs += xml.element("CorpusLink", sessions[i].session.name + ".imdi",
			[["Name", sessions[i].session.name]]);
		}
    
		rs += xml.close("Corpus");
		rs += xml.close("METATRANSCRIPT");
    
		return rs;
    
	};
	
	
	var createIMDISession = function (session, content_languages) {
	
		var rs = "";
    
		rs += xml.header;
		rs += create_imdi_header("SESSION",APP.CONF.originator,"1.0",today());
		rs += xml.open("Session");
		rs += xml.element("Name", session.session.name);
		rs += xml.element("Title", session.session.title);


		rs += xml.open("Date");
		rs += APP.forms.getDateStringByDateObject(session.session.date) || "Unspecified";
		rs += xml.close("Date");
		
		
		// if a valid session date cannot be parsed from the form BUT there has been some input by the user
		// AND the user has not been warned before about that, warn him or her
		if (
			APP.forms.isUserDefinedDateInvalid(session_prefix+"_session_date")  //TO DO: CHECK NOT BY ELEMENT; BUT BY OBJECT!!!
			&& (already_warned_for_invalid_dates == false)
		){
		
			APP.alert(
				parent.l("warning") +
				parent.l("output", "invalid_date_entered_in_session") + "<br>" +
				parent.l("output", "correct_or_ignore_warning")
			);
			
			already_warned_for_invalid_dates = true;
		}
		
		
		rs += xml.element("Description", session.session.description,[["LanguageId",getMetadataLanguage()],["Link",""]]);

		rs += xml.open("MDGroup");
		rs += xml.open("Location");
		rs += xml.element("Continent", session.session.location.continent, [["Link","http://www.mpi.nl/IMDI/Schema/Continents.xml"],["Type","ClosedVocabulary"]]);
		rs += xml.element("Country", session.session.location.country, [["Link","http://www.mpi.nl/IMDI/Schema/Countries.xml"],["Type","OpenVocabulary"]]);
		rs += xml.element("Region", session.session.location.region);
		rs += xml.element("Address", session.session.location.address);
		rs += xml.close("Location");

		rs += xml.open("Project");
		rs += xml.element("Name", session.project.name);
		rs += xml.element("Title", session.project.title);
		rs += xml.element("Id", session.project.id);
		rs += xml.open("Contact");
		rs += xml.element("Name", session.project.contact.name);
		rs += xml.element("Address", session.project.contact.address);
		rs += xml.element("Email", session.project.contact.email);
		rs += xml.element("Organisation", session.project.contact.organisation);
		rs += xml.close("Contact");
		rs += xml.element("Description", session.project.description, [["LanguageId",getMetadataLanguage()],["Link",""]]);
		rs += xml.close("Project");
		
		rs += xml.open("Keys");
		rs += xml.close("Keys");
		
		rs += insertSessionContent(session.content, content_languages);

		//Actors
		rs += xml.open("Actors");
		
		//Actors Description
		rs += xml.element("Description", session.actors.description, [["LanguageId", getMetadataLanguage()], ["Link", ""]]);
    
		forEach(session.actors.actors, function(actor){
			rs += insertActor(actor);
		});

		rs += xml.close("Actors");
		rs += xml.close("MDGroup");
		rs += xml.open("Resources");

		forEach(session.resources.resources.mediaFiles, function(mf){
			rs += insertMediafile(mf.name, mf.size);
		});
	
		forEach(session.resources.resources.writtenResources, function(wr){
			rs += insertWrittenResource(wr.name, wr.size);
		});
    
		rs += xml.close("Resources");
		rs += xml.element("References", "");
		rs += xml.close("Session");
		rs += xml.close("METATRANSCRIPT");
   
		return rs;
    
	};
	
	
	var insertSessionContent = function (content, content_languages) {

		var rs = "";
		rs += xml.open("Content");
		rs += xml.element("Genre", content.genre, [["Link","http://www.mpi.nl/IMDI/Schema/Content-Genre.xml"],["Type","OpenVocabulary"]]);
		rs += xml.element("SubGenre", content.subgenre, [["Link","http://www.mpi.nl/IMDI/Schema/Content-SubGenre.xml"],["Type","OpenVocabularyList"]]);
		rs += xml.element("Task", content.task, [["Link","http://www.mpi.nl/IMDI/Schema/Content-Task.xml"],["Type","OpenVocabulary"]]);
	
		rs += xml.element("Modalities", "", [["Link","http://www.mpi.nl/IMDI/Schema/Content-Modalities.xml"],["Type","OpenVocabulary"]]);
		//no input
		rs += xml.element("Subject","",[["Link","http://www.mpi.nl/IMDI/Schema/Content-Subject.xml"],["Type","OpenVocabularyList"]]);
		//no input

		rs += xml.open("CommunicationContext");
		rs += xml.element(
			"Interactivity",
			content.communication_context.interactivity,
			[
				["Link","http://www.mpi.nl/IMDI/Schema/Content-Interactivity.xml"],
				["Type","ClosedVocabulary"]
			]
		);
		rs += xml.element("PlanningType", content.communication_context.planningtype, [["Link","http://www.mpi.nl/IMDI/Schema/Content-PlanningType.xml"],["Type","ClosedVocabulary"]]);
		rs += xml.element("Involvement", content.communication_context.involvement, [["Link","http://www.mpi.nl/IMDI/Schema/Content-Involvement.xml"],["Type","ClosedVocabulary"]]);	
		rs += xml.element("SocialContext", content.communication_context.socialcontext, [["Link","http://www.mpi.nl/IMDI/Schema/Content-SocialContext.xml"],["Type","ClosedVocabulary"]]);
		rs += xml.element("EventStructure", content.communication_context.eventstructure, [["Link","http://www.mpi.nl/IMDI/Schema/Content-EventStructure.xml"],["Type","ClosedVocabulary"]]);

		rs += xml.element("Channel", "", [["Link","http://www.mpi.nl/IMDI/Schema/Content-Channel.xml"],["Type","ClosedVocabulary"]]);
		//no input

		rs += xml.close("CommunicationContext");
		rs += xml.open("Languages");
	
		rs += xml.element("Description", "", [["LanguageId", getMetadataLanguage()], ["Link",""]]);
		//no input

		rs += insertContentLanguages(content_languages);
		rs += xml.close("Languages");
		rs += xml.element("Keys", "");
		rs += xml.element(
			"Description",
			content.description,
			[
				["LanguageId", getMetadataLanguage()],
				["Link",""]
			]
		);
		rs += xml.close("Content");

		return rs;

	}
	

	var insertContentLanguages = function (CLs) {

		var rs = "";
	
		forEach(CLs, function(CL){  //for all content languages // no session separate languages yet
	
			rs += xml.open("Language");
			rs += xml.element("Id", APP.CONF.LanguageCodePrefix + CL[0]);
			rs += xml.element("Name", CL[3], [["Link","http://www.mpi.nl/IMDI/Schema/MPI-Languages.xml"],["Type","OpenVocabulary"]]);
			//rs += xml.element("Dominant","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			//rs += xml.element("SourceLanguage","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			//rs += xml.element("TargetLanguage","###true or false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			rs += xml.element("Description","",[["LanguageId", getMetadataLanguage()], ["Link",""]]);
			//no input yet
			rs += xml.close("Language");
	
		});

		return rs;
		
	}
	
	
	var create_imdi_header = function (imdi_type, originator, version, date) {
    
		return xml.open("METATRANSCRIPT", [
			["xmlns", "http://www.mpi.nl/IMDI/Schema/IMDI"],
			["xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance"],
			["Date", date],
			["FormatId", imdi_version],
			["Originator", originator],
			["Type", imdi_type],
			["Version", version],
			["xsi:schemaLocation","http://www.mpi.nl/IMDI/Schema/IMDI ./IMDI_3.0.xsd"]
		]);

	}
	
	
	
	var insertWrittenResource = function (link, size) {

		var rs = "";
		rs += xml.open("WrittenResource");
		rs += xml.element("ResourceLink", link);
		rs += xml.element("MediaResourceLink","");
		rs += xml.element("Date","Unspecified"); //no input yet
	    rs += xml.element("Type", resources.getFileType(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Type.xml"],["Type","OpenVocabulary"]]);
		rs += xml.element("SubType", resources.getFileType(link).type,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-SubType.xml"],["Type","OpenVocabularyList"]]);
		rs += xml.element("Format", resources.getFileType(link).mimetype,[["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Format.xml"],["Type","OpenVocabulary"]]);
		rs += xml.element("Size", size);
		rs += xml.open("Validation");
		rs += xml.element("Type", "", [["Link","http://www.mpi.nl/IMDI/Schema/Validation-Type.xml"],["Type","ClosedVocabulary"]]);
		rs += xml.element("Methodology", "",[["Link","http://www.mpi.nl/IMDI/Schema/Validation-Methodology.xml"],["Type","ClosedVocabulary"]]);
		rs += xml.element("Level","Unspecified");
		rs += xml.element("Description", "", [["LanguageId", getMetadataLanguage()],["Link",""]]);
		rs += xml.close("Validation");
		rs += xml.element("Derivation", "", [["Link","http://www.mpi.nl/IMDI/Schema/WrittenResource-Derivation.xml"],["Type","ClosedVocabulary"]]);
		rs += xml.element("CharacterEncoding", "");
		rs += xml.element("ContentEncoding", "");
		rs += xml.element("LanguageId", "");
		rs += xml.element("Anonymized", "Unspecified", [["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
		
		rs += xml.open("Access");
		rs += xml.element("Availability", "");
		rs += xml.element("Date", "");
		rs += xml.element("Owner", "");
		rs += xml.element("Publisher", "");
		
		rs += xml.open("Contact");
		rs += xml.element("Name", "");
		rs += xml.element("Address", "");
		rs += xml.element("Email", "");
		rs += xml.element("Organisation", "");
		rs += xml.close("Contact");
		
		rs += xml.element("Description","",[["LanguageId", getMetadataLanguage()],["Link",""]]);
		rs += xml.close("Access");
		
		rs += xml.element("Description","",[["LanguageId", getMetadataLanguage()],["Link",""]]);
		rs += xml.element("Keys","");
		rs += xml.close("WrittenResource");
		return rs;
	
	}
	
	
	var insertMediafile = function (link, size) {

		var rs = "";
		rs += xml.open("MediaFile");
		rs += xml.element("ResourceLink", link);
		rs += xml.element("Type", resources.getFileType(link).type, [["Link","http://www.mpi.nl/IMDI/Schema/MediaFile-Type.xml"],["Type","ClosedVocabulary"]]);
		rs += xml.element("Format", resources.getFileType(link).mimetype, [["Link","http://www.mpi.nl/IMDI/Schema/MediaFile-Format.xml"],["Type","OpenVocabulary"]]);
		rs += xml.element("Size", size);
		rs += xml.element("Quality","Unspecified",[["Link","http://www.mpi.nl/IMDI/Schema/Quality.xml"],["Type","ClosedVocabulary"]]); // no input
		rs += xml.element("RecordingConditions", "");
		rs += xml.open("TimePosition");
		rs += xml.element("Start","Unspecified");
		rs += xml.element("End","Unspecified"); //no input
		rs += xml.close("TimePosition");
		rs += xml.open("Access");
		rs += xml.element("Availability", "");
		rs += xml.element("Date", "");
		rs += xml.element("Owner", "");
		rs += xml.element("Publisher", "");
		rs += xml.open("Contact");
		rs += xml.element("Name", "");
		rs += xml.element("Address", "");
		rs += xml.element("Email", "");
		rs += xml.element("Organisation", ""); 
		rs += xml.close("Contact");
		rs += xml.element("Description","",[["LanguageId", getMetadataLanguage()],["Link",""]]);
		rs += xml.close("Access");
		rs += xml.element("Description","",[["LanguageId", getMetadataLanguage()],["Link",""]]);
		rs += xml.element("Keys","");
		rs += xml.close("MediaFile");
		return rs;
		
	}


	var insertActor = function (actor, session_id) {

		var rs = "";
		rs += xml.open("Actor");
		rs += xml.element("Role", actor.role, [["Link","http://www.mpi.nl/IMDI/Schema/Actor-Role.xml"],["Type","OpenVocabularyList"]]);
		rs += xml.element("Name", actor.name);
		rs += xml.element("FullName", actor.full_name);
		rs += xml.element("Code", actor.code);
		rs += xml.element("FamilySocialRole", actor.family_social_role, [["Link","http://www.mpi.nl/IMDI/Schema/Actor-FamilySocialRole.xml"], ["Type","OpenVocabularyList"]]);
		rs += xml.open("Languages");
		rs += xml.element("Description", "", [["LanguageId", getMetadataLanguage()], ["Link",""]]);
	
		forEach(actor.languages.actor_languages, function(lang){
	
			rs += xml.open("Language");
			rs += xml.element("Id", APP.CONF.LanguageCodePrefix + lang.LanguageObject[0]);
			rs += xml.element("Name", lang.LanguageObject[3],[["Link","http://www.mpi.nl/IMDI/Schema/MPI-Languages.xml"],["Type","OpenVocabulary"]]);
			rs += xml.element("MotherTongue",(lang.MotherTongue) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);
			rs += xml.element("PrimaryLanguage",(lang.PrimaryLanguage) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]);		
			rs += xml.element("Description","",[["LanguageId", getMetadataLanguage()],["Link",""]]);
			rs += xml.close("Language");
	
		});
	
		rs += xml.close("Languages");
		rs += xml.element("EthnicGroup", actor.ethnic_group);   
	
		//Age field
		rs += xml.open("Age");
		rs += actor.getAge(session_id, actor_id);
		rs += xml.close("Age");	
		//End of age field
	
		rs += xml.open("BirthDate");
		rs += APP.forms.getDateStringByDateObject(actor.birth_date) || "Unspecified";
		rs += xml.close("BirthDate");
		
		
		if (
			APP.forms.isUserDefinedDateInvalid(actor.birth_date)
			&& (already_warned_for_invalid_birth_dates == false)
		){
		
			APP.alert(
				parent.l("warning") +
				parent.l("output", "invalid_birth_date_entered") + "<br>" +
				parent.l("output", "correct_or_ignore_warning")
			);
			
			already_warned_for_invalid_birth_dates = true;
		}
		
		rs += xml.element("Sex", actor.sex,[["Link","http://www.mpi.nl/IMDI/Schema/Actor-Sex.xml"],["Type","ClosedVocabulary"]]);
		rs += xml.element("Education",(actor.education != "") ? actor.education : "Unspecified" );
		rs += xml.element("Anonymized",(actor.anonymized) ? "true" : "false",[["Link","http://www.mpi.nl/IMDI/Schema/Boolean.xml"],["Type","ClosedVocabulary"]]); 
		rs += xml.open("Contact");
		rs += xml.element("Name", actor.contact.name);   
		rs += xml.element("Address", actor.contact.address);   
		rs += xml.element("Email", actor.contact.email);   
		rs += xml.element("Organisation", actor.contact.organisation);   
		rs += xml.close("Contact");
		rs += xml.element("Keys", "");
		rs += xml.element("Description", actor.description, [["LanguageId",getMetadataLanguage()],["Link",""]]);
		rs += xml.close("Actor");
		return rs;
    
	}
	
	var my = {};
	my.sessions = [];    

	xml.reset();
	
	my.corpus = create_imdi_corpus(data.corpus, data.sessions);
	
	forEach(data.sessions, function(session){   
		xml.reset();
		my.sessions.push(createIMDISession(session, data.actors, data.resources, data.content_languages));
	});

	return my;
	
}