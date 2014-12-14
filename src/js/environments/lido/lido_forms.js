lido_environment.start_form = {

	title: "lido-start",
	type: "form",
	fields: [
		{
			heading: "Type",
			name: "type",
			type: "select",
			comment: "Select the type of record.",
			vocabulary: ["Programmhefte", "Kritiken", "Noten", "Libretti", "Szenische Grafik", "Porträtgrafik",
			"Theaterbaugrafik", "Papiertheater", "Gemälde", "Theaterplakate", "Inszenierungsfotografien",
			"Personenfotografien", "Theaterbaufotografien", "Tanzfotografien", "Glasplattennegative", "Fotoalben",
			"Bühnenmodelle", "Masken", "Puppen", "Schattenspielfiguren", "Marionetten", "Plastiken", "Filmfotos",
			"Filmplakate"],
		},
		{
			heading: "Classification",
			name: "classification",
			type: "text",
		},
		{
			heading: "Legal Body",
			name: "legal_body",
			type: "textarea",
			default_value: "Theaterwissenschaftliche Sammlung, Universität zu Köln\nGrafikabteilung, Theaterwissenschaftliche Sammlung, Universität zu Köln\nSzenische Grafik ,Grafikabteilung, Theaterwissenschaftliche Sammlung, Universität zu Köln"
		},
	]

};