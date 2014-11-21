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


eldp_environment.eldp_generator = function(data){
"use strict";


	var eldp_bundle_profile="clarin.eu:cr1:p_1271859438204";

	var insert_cmdi_header = function(MdCreator,MdCreationDate,MdProfile){
		
		var return_string = "";
		return_string+=xml.tag("Header",0);
		return_string+=xml.element("MdCreator",MdCreator);
		return_string+=xml.element("MdCreationDate",MdCreationDate);
		return_string+=xml.element("MdProfile",MdProfile);
		return_string+=xml.tag("Header",1);
		
		return return_string;
		
	};
	

	var createBundle = function(bundle, persons, resources){
		
		xml.reset();  //we're starting a new xml file here, so tabula rasa!
		//xml.setElementPrefix("cmd");

		var return_string = "";
		return_string += xml.header;	
		
		return_string += xml.open("CMD",[
			["xmlns:cmd","http://www.clarin.eu/cmd/"],
			["xmlns:dcr","http://www.isocat.org/ns/dcr"],
			["xmlns:ann","http://www.clarin.eu"],
			["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
			["xsi:schemaLocation","http://www.clarin.eu/cmd/ http://catalog.clarin.eu/ds/ComponentRegistry/rest/registry/profiles/" + eldp_bundle_profile + "/xsd"],
			["CMDVersion", "1.1"]
		]);
		

		//CMDI Header
		return_string += insert_cmdi_header(get("metadata_creator"),today()+"+01:00",eldp_bundle_profile);
		
		
		//in resources is nothing, as this is a session and no corpus. attached media files in a cmdi session are further down
		return_string+=xml.tag("Resources",0);
		return_string+=xml.tag("ResourceProxyList",2);
		return_string+=xml.tag("JournalFileProxyList",2);
		return_string+=xml.tag("ResourceRelationList",2);
		return_string+=xml.tag("Resources",1);
		
		return_string += xml.tag("Components",0);
		
		
		return_string += xml.open("ELDP-Bundle");

		return_string += xml.element("Title", bundle.bundle.title);		
		
		//return_string += xml.element("Name", bundle.bundle.name);
		//NO TypeofRecord!
		
		return_string += xml.open("StatusInfo");
		return_string += xml.close("StatusInfo");
		
		return_string += xml.open("Depositors");
		return_string += xml.close("Depositors");
		
		

		return_string += xml.element("Date", bundle.bundle.date.year + "-" + bundle.bundle.date.month + "-" + bundle.bundle.date.day);
		return_string += xml.element("Description", bundle.bundle.description);
		
		return_string += xml.open("Location");
		return_string += xml.element("Continent", bundle.bundle.location.continent);
		return_string += xml.element("Country", bundle.bundle.location.country);
		return_string += xml.element("Region", bundle.bundle.location.region);
		return_string += xml.element("Address", bundle.bundle.location.address);
		return_string += xml.close("Location")
		
		return_string += xml.open("Persons");
		return_string += insert_persons(bundle.persons.persons);
		return_string += xml.close("Persons");
		
		return_string += xml.close("ELDP-Bundle");
		
		return return_string;
		
	};
	
	
	var insertPersonLanguages = function(languages){
	
		return_string = "";
	
		forEach(languages, function(lang){
		
			return_string += xml.open("Language");
			return_string += xml.element("ID", lang.iso_code);
			return_string += xml.element("Name", lang.name);
			return_string += xml.close("Language");
		
		});
		
		return return_string;
	
	
	};
	
	
	var insert_persons = function(person_in_bundles){
	
		var return_string = "";
		
		forEach(person_in_bundles, function(person_in_bundle){
			var pers = person.getPersonByID(person_in_bundle.id);
			
			return_string += xml.open("Person")
			return_string += xml.element("Title", pers.title);
			return_string += xml.element("Role", person_in_bundle.role);
			//return_string += xml.element("Forenames", pers.forenames);
			//return_string += xml.element("Surname", pers.surname);
			
			
			return_string += xml.open("Languages");
			return_string += insertPersonLanguages(pers.languages);
			return_string += xml.close("Languages");
			return_string += xml.close("Person");
		
		});
	
		return return_string;
	
	
	}

	
	var insertContentLanguages = function (session_id) {

		var return_string = "";
		
		var languages = corpus.content_languages.content_languages;
	
		for (var l=0;l<languages.length;l++){  //for all content languages // no session separate languages yet
	
			return_string += xml.open("Content_Language");
			return_string += xml.element("Id",APP.CONF.LanguageCodePrefix+languages[l][0]);
			return_string += xml.element("Name",languages[l][3]);
			return_string += xml.close("Content_Language");
	
		}

		return return_string;
		
	};
	

	var insertResource = function(link,size){

		var return_string = "";
		
		return_string += xml.open("WrittenResource");

		return_string += xml.element("ResourceLink",link);
		return_string += xml.element("MediaResourceLink","");

		return_string += xml.element("Date","Unspecified");
		//no input yet, but should come soon
		
		return_string += xml.element("Type",resources.getFileType(link).type);
		return_string += xml.element("SubType",resources.getFileType(link).type);
		return_string += xml.element("Format",resources.getFileType(link).mimetype);
		return_string += xml.element("Size",size);
		
		return_string += xml.open("Validation");
		return_string += xml.element("Type","");
		return_string += xml.element("Methodology","");
		return_string += xml.element("Level","Unspecified");
		return_string += xml.element("Description","");
		return_string += xml.close("Validation");

		return_string += xml.element("Derivation","");

		return_string += xml.element("CharacterEncoding","");
		return_string += xml.element("ContentEncoding","");
		return_string += xml.element("LanguageId","");
		return_string += xml.element("Anonymized","Unspecified");

		return_string += xml.open("Access");
	  
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
		
	};


	var insertActor = function(session_id,actor_id){

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
			return_string += xml.element("Id",APP.CONF.LanguageCodePrefix+ac.languages[l].iso_code);
			return_string += xml.element("Name",ac.languages[l].name);
			
			return_string += xml.element("MotherTongue",(ac.languages[l].MotherTongue) ? "true" : "false");
			return_string += xml.element("PrimaryLanguage",(ac.languages[l].PrimaryLanguage) ? "true" : "false");		

			return_string += xml.tag("Actor_Language",1);
		
		}

		return_string += xml.tag("Actor_Languages",1);
		
		return_string+=xml.tag("Actor",1);
	  
		return return_string;
		
	}
	
	var my = {};
	

	my.bundles = map(data.bundles, function (bundle){
		xml.reset();
		return createBundle(bundle, data.persons, data.resources);
	});

	return my;

}



/*
<?xml version="1.0" encoding="UTF-8"?>
<CMD xmlns="http://www.clarin.eu/cmd/"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     CMDVersion="1.1"
     xsi:schemaLocation="http://www.clarin.eu/cmd/ http://catalog.clarin.eu/ds/ComponentRegistry/rest/registry/profiles/clarin.eu:cr1:p_1407745711992/xsd">
   <Header>
      <MdCreator>Sebastian</MdCreator>
      <MdCreationDate>2014-11-19+01:00</MdCreationDate>
      <MdProfile>clarin.eu:cr1:p_1407745711992</MdProfile>
   </Header>
   <Resources>
      <ResourceProxyList/>
      <JournalFileProxyList/>
      <ResourceRelationList/>
   </Resources>
   <Components>
      <ELDP_Bundle>
         <Title xml:lang="fra">b_title</Title>
         <TypeofRecord>umbrella</TypeofRecord>
         <ID>001</ID>
         <StatusInfo>
            <Status>stable</Status>
            <ChangeDate>2014-11-19</ChangeDate>
         </StatusInfo>
         <Depositor>
            <Role>dep role</Role>
            <AdditionalInformation>ad</AdditionalInformation>
            <PersonalData>
               <Name>
                  <Name>asd</Name>
               </Name>
               <BiographicalData>
                  <DeathYear>asd</DeathYear>
               </BiographicalData>
            </PersonalData>
            <Gender/>
            <Languages>
               <Language>
                  <Name>German</Name>
                  <Autoglottonym>deutsch</Autoglottonym>
               </Language>
            </Languages>
         </Depositor>
         <ContentLanguage>
            <Name>German</Name>
            <Use>Working</Use>
            <History/>
            <AdditionalInformation>this is some additional information</AdditionalInformation>
         </ContentLanguage>
         <Person>
            <Age_at_Time_of_Recording>12</Age_at_Time_of_Recording>
            <Role>data_inputter</Role>
            <BiographicalNote/>
            <Ethnicity>
               <EthnicAffiliation>ui</EthnicAffiliation>
               <AdditionalInformation>addinfo</AdditionalInformation>
            </Ethnicity>
            <PersonalData>
               <Name>
                  <Name>Guy Stone</Name>
               </Name>
               <BiographicalData>
                  <BirthYear>1922</BirthYear>
                  <DeathYear>2999</DeathYear>
               </BiographicalData>
            </PersonalData>
            <Gender>
               <GenderIdentification>huhu</GenderIdentification>
               <AdditionalInformation/>
            </Gender>
            <Education>
               <Level/>
               <AdditionalInformation/>
               <AdditionalInformation/>
               <AdditionalInformation/>
            </Education>
            <Nationality/>
         </Person>
         <ProjectLocation>
            <ProjectGeographic/>
         </ProjectLocation>
         <AccessInformation>
            <Restricitons xml:lang="aom">res_of_access</Restricitons>
            <ConditionsofAccess>cond of access</ConditionsofAccess>
            <oURCS>User</oURCS>
         </AccessInformation>
         <Resource>
            <Title/>
            <TypeofRecord/>
            <ID/>
            <Host/>
            <StatusInfo>
               <Status/>
               <ChangeDate/>
            </StatusInfo>
            <Depositor>
               <Role/>
               <AdditionalInformation/>
               <PersonalData>
                  <Name>
                     <Name/>
                  </Name>
                  <BiographicalData>
                     <DeathYear/>
                  </BiographicalData>
               </PersonalData>
               <Gender/>
               <Languages>
                  <Language>
                     <Name/>
                     <Autoglottonym/>
                  </Language>
               </Languages>
            </Depositor>
            <ContentLanguage>
               <Name/>
               <Use/>
               <History/>
               <AdditionalInformation/>
            </ContentLanguage>
            <Location/>
            <AccessInformation>
               <Restricitons/>
               <ConditionsofAccess/>
               <oURCS/>
            </AccessInformation>
            <VideoFile>
               <General>
                  <Name/>
                  <Date/>
               </General>
               <MediaInformations/>
               <ImageInformations/>
               <VideoInformations/>
               <Checksum/>
            </VideoFile>
         </Resource>
      </ELDP_Bundle>
   </Components>
</CMD>
*/