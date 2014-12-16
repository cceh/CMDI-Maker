lido_environment.lido_generator = function(data){
"use strict";

	xml.reset();
	xml.setElementPrefix("lido");
	
	var parent = lido_environment;

	var digitalisat = lido_environment.workflow[0];	

	var rs = ""; //Return string

	var create_lido_digitalisat = function () {
		var rs = "";
		xml.reset();
		create_lido_entry();
	}

	var create_lido_term = function (term,entity,etype) {
		if (etype=="search") {
			rs += xml.element("term", term , [["addedSearchTerm",entity]]);
		}
		else if (etype=="lang") {
			rs += xml.element("term", term , [["xml:lang",entity]]);
		}
		else if (etype=="encoding") {
			rs += xml.element("term", term , [["encodinganalog",entity]]);
		}
		else if (etype=="encoding_search") {
			rs += xml.element("term", term , [["addedSearchTerm",entity[0]],["encodinganalog",entity[1]]]);
		}
		else {
			rs += xml.element("term", term);
		};
		return rs;
	}

	var create_lido_entry = function () {
    
		rs += xml.header;	
		rs += xml.open("lido",[
			["xmlns:lido", "http://www.lido-schema.org"],
			["xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance"],
			["xsi:schemaLocation","http://www.lido-schema.org http://www.lido-schema.org/schema/v1.0/lido-v1.0.xsd"]
		]);

		rs += xml.open("lidoRecID", [["source","Theaterwissenschaftliche Sammlung, Universität zu Köln"],["type","locale"]]);
		rs += "???";
		rs += xml.close("lidoRecID");
		rs += xml.open("category");
			rs += xml.element("conceptID","300117127",[["type","???"]]);
			create_lido_term("Artefakt","de","lang");
		rs += xml.close("category");
		rs += xml.open("descriptiveMetadata", [["xml:lang","de"]]);
			rs += xml.open("objectClassificationWrap");
				rs += xml.open("objectWorkTypeWrap");
					rs += xml.open("objectWorkType");
						rs += xml.element("conceptID", "300264387" , [["type","AAT"]]);
						var entity = new Array("yes","300264387");
						create_lido_term("Gemälde / Painting", entity ,"encoding_search");
					rs += xml.close("objectWorkType");
				rs += xml.close("objectWorkTypeWrap");
				rs += xml.open("classificationWrap");
					rs += xml.open("classification", [["type","AAT:type"]]);
						rs += xml.element("conceptID", "300264387" , [["type","AAT:type"]]);
						rs += xml.element("term","Bühnenbildentwurf",[["addedSearchTerm","yes"]]);
					rs += xml.close("classification");
				rs += xml.close("classificationWrap");
			rs += xml.close("objectClassificationWrap");
			rs += xml.open("objectIdentificationWrap");
				rs += xml.open("titleWrap");
					rs += xml.open("titleSet");
						rs += xml.element("appellationValue","Gralstempel Parsifal",[["pref","preferred"],["xml:lang","de"]]);
					rs += xml.close("titleSet");
				rs += xml.close("titleWrap");
				rs += xml.open("repositoryWrap");
					rs += xml.open("repositorySet", [["type","current"]]);
						rs += xml.open("repositoryName");
							rs += xml.open("legalBodyName");
							rs += xml.element("appellationValue","Theaterwissenschaftlichesammlung, Universität zu Köln");
							rs += xml.close("legalBodyName");
						rs += xml.close("repositoryName");
						rs += xml.element("workID","G43952");
						rs += xml.element("workID","G43952",[["type","inventory number"]]);
					rs += xml.close("repositorySet");
				rs += xml.close("repositoryWrap");
				rs += xml.open("objectDescriptionWrap");
					rs += xml.open("objectDescriptionSet");
						rs += xml.element("descriptiveNoteValue","Tempera");
					rs += xml.close("objectDescriptionSet");
				rs += xml.close("objectDescriptionWrap");
				rs += xml.open("objectMeasurementsWrap");
					rs += xml.open("objectMeasurementsSet");
						rs += xml.element("displayObjectMeasurements","10 x 10 x 10");
					rs += xml.close("objectMeasurementsSet");
				rs += xml.close("objectMeasurementsWrap");
			rs += xml.close("objectIdentificationWrap");
			rs += xml.open("eventWrap");
				rs += xml.open("eventSet");
					rs += xml.element("displayEvent","Anfertigung im Auftrag Richard Wagners");
					rs += xml.open("event");
						rs += xml.open("eventType");
							create_lido_term("creation","en","lang");
							create_lido_term("Herstellung","de","lang");
						rs += xml.close("eventType");
						rs += xml.open("eventActor");
							rs += xml.open("actorInRole");
								rs += xml.open("actor", [["type","person"]]);
									rs += xml.element("actorID","p118713248",[["type","d-nb.info"],["source","http://d-nb.info/gnd/118713248"]]);
									rs += xml.open("nameActorSet");
										rs += xml.element("appellationValue","Joukowsky, Paul von",[["pref","preferred"]]);
										//rs += xml.element("sourceAppellation","http://d-nb.info/gnd/118713248");
									rs += xml.close("nameActorSet");
									rs += xml.open("vitalDatesActor");
										rs += xml.element("earliestDate","1845");
										rs += xml.element("latestDate","1912");
									rs += xml.close("vitalDatesActor");
								rs += xml.close("actor");
								rs += xml.open("roleActor");
									create_lido_term("Bühnenbildner");
								rs += xml.close("roleActor");
							rs += xml.close("actorInRole");
						rs += xml.close("eventActor");
						rs += xml.open("culture");
							create_lido_term("Europa");
						rs += xml.close("culture");
						rs += xml.open("eventDate");
							rs += xml.open("date");
								rs += xml.element("earliestDate","1845");
								rs += xml.element("latestDate","1912");
							rs += xml.close("date");
						rs += xml.close("eventDate");
						rs += xml.open("eventPlace");
							rs += xml.open("displayPlace");
							rs += xml.close("displayPlace");
							rs += xml.open("place");
								rs += xml.open("namePlaceSet");
									rs += xml.element("appellationValue","");
								rs += xml.close("namePlaceSet");
								rs += xml.open("gml");
								rs += xml.close("gml");
							rs += xml.close("place");
						rs += xml.close("eventPlace");
					rs += xml.close("event");
				rs += xml.close("eventSet");
			rs += xml.close("eventWrap");

		rs += xml.close("descriptiveMetadata");




		
			

	};

	create_lido_digitalisat();
	
	//TO DO: LIDO GENERIEREN :-)
	
	return rs;

};