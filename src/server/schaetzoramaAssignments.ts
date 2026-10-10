import type { SchaetzoramaAssignQuestion, SchaetzoramaAssignmentZone, SchaetzoramaSource } from "../protocol.js";
import type { SchaetzoramaEnglishQuestionText } from "./schaetzoramaContent.js";

type Text = readonly [de: string, en: string];
type Term = readonly [de: string, en: string, answer: SchaetzoramaAssignmentZone];

function assignment(id: string, prompt: Text, left: Text, right: Text, terms: readonly Term[], source: SchaetzoramaSource) {
  const question: SchaetzoramaAssignQuestion = {
    id: `overlap-${id}`, categoryId: "assign", kind: "assign", title: "Schnittmenge", shortLabel: "Zuordnung",
    prompt: `${prompt[0]} Wähle links, rechts oder beides.`, leftLabel: left[0], rightLabel: right[0],
    terms: terms.map(([label], index) => ({ id: `term-${index}`, label })),
    answers: Object.fromEntries(terms.map(([, , answer], index) => [`term-${index}`, answer])), source
  };
  const english: SchaetzoramaEnglishQuestionText = {
    title: "Overlap", shortLabel: "Assign", prompt: `${prompt[1]} Choose left, right or both.`,
    leftLabel: left[1], rightLabel: right[1],
    termLabels: Object.fromEntries(terms.map(([, label], index) => [`term-${index}`, label]))
  };
  return { question, english };
}

const sources = {
  computing: { label: "BBC Bitesize · Input and output devices", url: "https://www.bbc.co.uk/bitesize/topics/zs7s4wx" },
  instruments: { label: "Philharmonia · Instruments", url: "https://philharmonia.co.uk/resources/instruments/" },
  sports: { label: "Olympics · Sports", url: "https://olympics.com/en/sports/" },
  mammals: { label: "Australian Museum · Mammals", url: "https://australian.museum/learn/animals/mammals/" },
  birds: { label: "Australian Museum · Birds", url: "https://australian.museum/learn/animals/birds/" },
  insects: { label: "Australian Museum · Insects", url: "https://australian.museum/learn/animals/insects/" },
  turtles: { label: "NOAA · Sea turtles", url: "https://www.fisheries.noaa.gov/sea-turtles" },
  fruit: { label: "Kew · Tomato: botanical fruit, culinary vegetable", url: "https://www.kew.org/plants/tomato" },
  underwaterHockey: { label: "CMAS · Underwater hockey rules", url: "https://www.cmas.org/hockey/how-to-regulations.html" },
  geography: { label: "CIA World Factbook · Geography (2025 archive)", url: "https://www.cia.gov/the-world-factbook/about/archives/2025/" },
  languages: { label: "Swiss Confederation · Languages", url: "https://www.eda.admin.ch/aboutswitzerland/en/home/gesellschaft/sprachen.html" },
  flags: { label: "CIA World Factbook · Flags (2025 archive)", url: "https://www.cia.gov/the-world-factbook/about/archives/2025/references/flags-of-the-world/" },
  space: { label: "NASA · The Solar System", url: "https://science.nasa.gov/learn/basics-of-space-flight/chapter1-2/" },
  chemistry: { label: "Royal Society of Chemistry · Periodic table", url: "https://www.rsc.org/periodic-table" },
  molecules: { label: "PubChem · Molecular formulas", url: "https://pubchem.ncbi.nlm.nih.gov/" },
  genetics: { label: "NHGRI · DNA and RNA bases", url: "https://www.genome.gov/genetics-glossary/Nucleotide" },
  energy: { label: "US Department of Energy · Appliances", url: "https://www.energy.gov/energysaver/appliances-and-electronics" },
  rings: { label: "NASA · Chariklo and its rings", url: "https://science.nasa.gov/solar-system/asteroids/10199-chariklo/" },
  atmosphere: { label: "NASA · Titan facts", url: "https://science.nasa.gov/saturn/moons/titan/facts/" },
  electricity: { label: "US EIA · Electricity explained", url: "https://www.eia.gov/energyexplained/electricity/" },
  media: { label: "BBC Bitesize · Computing", url: "https://www.bbc.co.uk/bitesize/topics/zs7s4wx" },
  games: { label: "Hasbro · Game instructions", url: "https://instructions.hasbro.com/" }
} satisfies Record<string, SchaetzoramaSource>;

// Each task has real examples in all three zones. Counts vary between tasks;
// the server shuffles terms so order cannot give away the solution.
const entries = [
  assignment("input-output", ["Welche Computergeräte dienen zur Eingabe, zur Ausgabe oder zu beidem? Gemeint sind die genannten Standardgeräte.", "Which computer devices provide input, output or both? Consider the named standard devices."], ["Eingabe", "Input"], ["Ausgabe", "Output"], [
    ["Touchscreen", "Touchscreen", "both"], ["Headset mit Mikrofon", "Headset with microphone", "both"],
    ["Tastatur", "Keyboard", "left"], ["Scanner", "Scanner", "left"],
    ["Lautsprecher", "Loudspeaker", "right"], ["Bildschirm ohne Touchfunktion", "Non-touch monitor", "right"]
  ], sources.computing),
  assignment("strings-keys", ["Welche Instrumente haben Saiten, werden mit Tasten gespielt oder erfüllen beides?", "Which instruments have strings, are played using a keyboard, or both?"], ["Hat Saiten", "Has strings"], ["Hat Spieltasten", "Has a keyboard"], [
    ["Akustisches Klavier", "Acoustic piano", "both"], ["Cembalo", "Harpsichord", "both"],
    ["Geige", "Violin", "left"], ["Harfe", "Harp", "left"], ["Pfeifenorgel", "Pipe organ", "right"], ["Akkordeon", "Accordion", "right"]
  ], sources.instruments),
  assignment("ball-racket", ["Bei welchen Sportarten gehört ein Ball, ein Schläger oder beides zur normalen Ausrüstung? Ein Federball zählt hier als Shuttle, nicht als Ball.", "Which sports normally use a ball, a racket or both? A shuttlecock counts as a shuttle, not a ball."], ["Ball", "Ball"], ["Schläger", "Racket"], [
    ["Tennis", "Tennis", "both"], ["Squash", "Squash", "both"], ["Basketball", "Basketball", "left"], ["Fußball", "Football", "left"], ["Badminton", "Badminton", "right"]
  ], sources.sports),
  assignment("water-team", ["Welche Wettbewerbe finden im Wasser statt, werden als Mannschaft gegeneinander gespielt oder erfüllen beides?", "Which events take place in water, are played by opposing teams, or both?"], ["Im Wasser", "In water"], ["Mannschaftsspiel", "Team game"], [
    ["Wasserball", "Water polo", "both"], ["Unterwasserhockey", "Underwater hockey", "both"],
    ["100 m Freistil (Einzel)", "100 m freestyle (individual)", "left"], ["Turmspringen (Einzel)", "Platform diving (individual)", "left"],
    ["Basketball", "Basketball", "right"], ["Eishockey", "Ice hockey", "right"]
  ], sources.underwaterHockey),
  assignment("mammals-eggs", ["Welche Tiere sind Säugetiere, legen Eier oder erfüllen beides?", "Which animals are mammals, lay eggs, or both?"], ["Säugetier", "Mammal"], ["Legt Eier", "Lays eggs"], [
    ["Schnabeltier", "Platypus", "both"], ["Ameisenigel", "Echidna", "both"], ["Delfin", "Dolphin", "left"], ["Katze", "Cat", "left"], ["Huhn", "Chicken", "right"], ["Krokodil", "Crocodile", "right"]
  ], sources.mammals),
  assignment("birds-flight", ["Welche Tiere sind Vögel, können aus eigener Kraft fliegen oder erfüllen beides? Gemeint sind gesunde erwachsene Tiere.", "Which animals are birds, can fly under their own power, or both? Consider healthy adults."], ["Vogel", "Bird"], ["Kann fliegen", "Can fly"], [
    ["Adler", "Eagle", "both"], ["Schwalbe", "Swallow", "both"], ["Pinguin", "Penguin", "left"], ["Strauß", "Ostrich", "left"], ["Fledermaus", "Bat", "right"], ["Schmetterling", "Butterfly", "right"]
  ], sources.birds),
  assignment("insects-flight", ["Welche Tiere sind Insekten, können aus eigener Kraft fliegen oder erfüllen beides? Gemeint ist die ausdrücklich genannte erwachsene Form.", "Which animals are insects, can fly under their own power, or both? Consider the explicitly named adult form."], ["Insekt", "Insect"], ["Kann fliegen", "Can fly"], [
    ["Honigbiene (Arbeiterin)", "Honeybee worker", "both"], ["Libelle", "Dragonfly", "both"], ["Silberfischchen", "Silverfish", "left"], ["Floh", "Flea", "left"], ["Fledermaus", "Bat", "right"], ["Taube", "Pigeon", "right"]
  ], sources.insects),
  assignment("lungs-eggs", ["Welche Tiere atmen als Erwachsene mit Lungen, legen Eier oder erfüllen beides?", "Which animals breathe using lungs as adults, lay eggs, or both?"], ["Lungenatmung", "Breathes with lungs"], ["Legt Eier", "Lays eggs"], [
    ["Meeresschildkröte", "Sea turtle", "both"], ["Kormoran", "Cormorant", "both"], ["Delfin", "Dolphin", "left"], ["Blauwal", "Blue whale", "left"], ["Atlantischer Lachs", "Atlantic salmon", "right"], ["Hering", "Herring", "right"]
  ], sources.turtles),
  assignment("fruit-vegetable", ["Welche essbaren Pflanzenteile sind botanisch eine Frucht, werden in der deutschen Alltagsküche als Gemüse verwendet oder erfüllen beides?", "Which edible plant parts are botanical fruits, are usually used as vegetables in everyday German cooking, or both?"], ["Botanische Frucht", "Botanical fruit"], ["Küchengemüse", "Culinary vegetable"], [
    ["Tomate", "Tomato", "both"], ["Gurke", "Cucumber", "both"], ["Paprika", "Bell pepper", "both"], ["Apfel", "Apple", "left"], ["Birne", "Pear", "left"], ["Kopfsalatblätter", "Lettuce leaves", "right"]
  ], sources.fruit),
  assignment("borders-germany-france", ["Welche Staaten haben eine gemeinsame Landgrenze mit Deutschland, mit dem europäischen Festland Frankreichs oder mit beidem?", "Which countries share a land border with Germany, mainland European France, or both?"], ["Grenzt an Deutschland", "Borders Germany"], ["Grenzt an Frankreich", "Borders France"], [
    ["Schweiz", "Switzerland", "both"], ["Luxemburg", "Luxembourg", "both"], ["Belgien", "Belgium", "both"], ["Polen", "Poland", "left"], ["Tschechien", "Czechia", "left"], ["Spanien", "Spain", "right"]
  ], sources.geography),
  assignment("borders-austria-italy", ["Welche Staaten haben eine gemeinsame Landgrenze mit Österreich, mit Italien oder mit beidem?", "Which countries share a land border with Austria, Italy, or both?"], ["Grenzt an Österreich", "Borders Austria"], ["Grenzt an Italien", "Borders Italy"], [
    ["Schweiz", "Switzerland", "both"], ["Slowenien", "Slovenia", "both"], ["Deutschland", "Germany", "left"], ["Ungarn", "Hungary", "left"], ["Frankreich", "France", "right"], ["San Marino", "San Marino", "right"]
  ], sources.geography),
  assignment("europe-asia", ["Welche Staaten liegen mit ihrem Kerngebiet in Europa, in Asien oder auf beiden Kontinenten? Überseegebiete bleiben unberücksichtigt; die Türkei gilt entlang des Bosporus als geteilt.", "Which countries have their core territory in Europe, Asia, or both? Ignore overseas territories; the Bosporus divides Turkey between the continents."], ["Europa", "Europe"], ["Asien", "Asia"], [
    ["Russland", "Russia", "both"], ["Türkei", "Turkey", "both"], ["Deutschland", "Germany", "left"], ["Frankreich", "France", "left"], ["Japan", "Japan", "right"], ["Thailand", "Thailand", "right"]
  ], sources.geography),
  assignment("atlantic-indian", ["Welche Staaten haben eine Küste am Atlantik, am Indischen Ozean oder an beiden? Randmeere zählen mit; Überseegebiete nicht.", "Which countries have a coastline on the Atlantic, Indian Ocean, or both? Include marginal seas; exclude overseas territories."], ["Atlantik", "Atlantic"], ["Indischer Ozean", "Indian Ocean"], [
    ["Südafrika", "South Africa", "both"], ["Brasilien", "Brazil", "left"], ["Portugal", "Portugal", "left"], ["Indien", "India", "right"], ["Sri Lanka", "Sri Lanka", "right"]
  ], sources.geography),
  assignment("atlantic-pacific", ["Welche Staaten haben eine Küste am Atlantik, am Pazifik oder an beiden? Randmeere zählen mit; Überseegebiete nicht.", "Which countries have a coastline on the Atlantic, Pacific, or both? Include marginal seas; exclude overseas territories."], ["Atlantik", "Atlantic"], ["Pazifik", "Pacific"], [
    ["USA", "United States", "both"], ["Kanada", "Canada", "both"], ["Mexiko", "Mexico", "both"], ["Brasilien", "Brazil", "left"], ["Japan", "Japan", "right"], ["Peru", "Peru", "right"]
  ], sources.geography),
  assignment("german-french", ["In welchen Staaten ist Deutsch, Französisch oder beides auf nationaler beziehungsweise föderaler Ebene Amtssprache?", "In which countries is German, French, or both an official language at national or federal level?"], ["Deutsch", "German"], ["Französisch", "French"], [
    ["Schweiz", "Switzerland", "both"], ["Belgien", "Belgium", "both"], ["Österreich", "Austria", "left"], ["Liechtenstein", "Liechtenstein", "left"], ["Frankreich", "France", "right"], ["Monaco", "Monaco", "right"]
  ], sources.languages),
  assignment("flag-red-white", ["Welche Nationalflaggen enthalten Rot, Weiß oder beides? Gemeint ist die übliche Flagge ohne zusätzliches Staatswappen.", "Which national flags contain red, white, or both? Consider the standard flag without an additional state coat of arms."], ["Rot", "Red"], ["Weiß", "White"], [
    ["Japan", "Japan", "both"], ["Niederlande", "Netherlands", "both"], ["China", "China", "left"], ["Vietnam", "Vietnam", "left"], ["Finnland", "Finland", "right"], ["Griechenland", "Greece", "right"]
  ], sources.flags),
  assignment("flag-blue-yellow", ["Welche Nationalflaggen enthalten Blau, Gelb oder beides? Gold zählt als Gelb; gemeint ist die übliche Flagge ohne zusätzliches Staatswappen.", "Which national flags contain blue, yellow, or both? Gold counts as yellow; consider the standard flag without an additional state coat of arms."], ["Blau", "Blue"], ["Gelb", "Yellow"], [
    ["Ukraine", "Ukraine", "both"], ["Schweden", "Sweden", "both"], ["Frankreich", "France", "left"], ["Niederlande", "Netherlands", "left"], ["Deutschland", "Germany", "right"], ["China", "China", "right"]
  ], sources.flags),
  assignment("flag-black-green", ["Welche Nationalflaggen enthalten Schwarz, Grün oder beides? Gemeint ist die übliche Nationalflagge.", "Which national flags contain black, green, or both? Consider the standard national flag."], ["Schwarz", "Black"], ["Grün", "Green"], [
    ["Kenia", "Kenya", "both"], ["Jamaika", "Jamaica", "both"], ["Deutschland", "Germany", "left"], ["Belgien", "Belgium", "left"], ["Brasilien", "Brazil", "right"], ["Nigeria", "Nigeria", "right"]
  ], sources.flags),
  assignment("planet-surface", ["Welche Himmelskörper sind Planeten unseres Sonnensystems, besitzen eine feste äußere Oberfläche oder erfüllen beides? Ein möglicher Kern unter einer Gasatmosphäre zählt nicht als Oberfläche.", "Which bodies are Solar System planets, have a solid outer surface, or both? A possible core beneath a gas atmosphere does not count as a surface."], ["Planet", "Planet"], ["Feste Oberfläche", "Solid surface"], [
    ["Erde", "Earth", "both"], ["Mars", "Mars", "both"], ["Jupiter", "Jupiter", "left"], ["Saturn", "Saturn", "left"], ["Erdmond", "Earth's Moon", "right"], ["Titan", "Titan", "right"]
  ], sources.space),
  assignment("wind-metal", ["Welche Instrumente sind Blasinstrumente, bestehen in ihrer üblichen Bauform überwiegend aus Metall oder erfüllen beides?", "Which instruments are wind instruments, are usually made mainly of metal, or both?"], ["Blasinstrument", "Wind instrument"], ["Überwiegend Metall", "Mainly metal"], [
    ["Trompete", "Trumpet", "both"], ["Saxofon", "Saxophone", "both"], ["Oboe", "Oboe", "left"], ["Fagott", "Bassoon", "left"], ["Triangel", "Triangle", "right"], ["Becken", "Cymbals", "right"]
  ], sources.instruments),
  assignment("element-gas", ["Welche Stoffe sind chemische Elemente, bei 20 °C und normalem Luftdruck gasförmig oder erfüllen beides?", "Which substances are chemical elements, are gases at 20 °C and normal atmospheric pressure, or both?"], ["Element", "Element"], ["Gas bei 20 °C", "Gas at 20 °C"], [
    ["Sauerstoff", "Oxygen", "both"], ["Stickstoff", "Nitrogen", "both"], ["Eisen", "Iron", "left"], ["Kupfer", "Copper", "left"], ["Kohlendioxid", "Carbon dioxide", "right"], ["Methan", "Methane", "right"]
  ], sources.chemistry),
  assignment("carbon-oxygen", ["Welche Moleküle enthalten Kohlenstoffatome, Sauerstoffatome oder beides? Gemeint ist jeweils der reine Stoff, nicht ein Gemisch.", "Which molecules contain carbon atoms, oxygen atoms, or both? Consider each pure substance, not a mixture."], ["Kohlenstoff", "Carbon"], ["Sauerstoff", "Oxygen"], [
    ["Kohlendioxid", "Carbon dioxide", "both"], ["Glucose (Traubenzucker)", "Glucose", "both"], ["Methan", "Methane", "left"], ["Propan", "Propane", "left"], ["Wasser", "Water", "right"], ["Wasserstoffperoxid", "Hydrogen peroxide", "right"]
  ], sources.molecules),
  assignment("dna-rna", ["Welche Basen gehören zu den üblichen Bausteinen der DNA, der RNA oder beider? Seltene chemisch veränderte Basen bleiben unberücksichtigt.", "Which bases are standard building blocks of DNA, RNA, or both? Ignore rare chemically modified bases."], ["DNA", "DNA"], ["RNA", "RNA"], [
    ["Adenin", "Adenine", "both"], ["Guanin", "Guanine", "both"], ["Cytosin", "Cytosine", "both"], ["Thymin", "Thymine", "left"], ["Uracil", "Uracil", "right"]
  ], sources.genetics),
  assignment("electric-heat", ["Welche Geräte brauchen im normalen Betrieb Strom, erzeugen absichtlich Nutzwärme oder erfüllen beides? Unbeabsichtigte Abwärme zählt nicht.", "Which devices normally require electricity, intentionally produce useful heat, or both? Incidental waste heat does not count."], ["Braucht Strom", "Requires electricity"], ["Erzeugt Nutzwärme", "Produces useful heat"], [
    ["Elektrischer Wasserkocher", "Electric kettle", "both"], ["Toaster", "Toaster", "both"], ["Elektrischer Ventilator", "Electric fan", "left"], ["LED-Taschenlampe", "LED torch", "left"], ["Holzkohlegrill", "Charcoal barbecue", "right"], ["Holzofen ohne Elektrik", "Wood stove without electrics", "right"]
  ], sources.energy),
  assignment("borders-spain-france", ["Welche Staaten haben eine Landgrenze mit Spanien, mit dem europäischen Festland Frankreichs oder mit beidem?", "Which countries share a land border with Spain, mainland European France, or both?"], ["Grenzt an Spanien", "Borders Spain"], ["Grenzt an Frankreich", "Borders France"], [
    ["Andorra", "Andorra", "both"], ["Portugal", "Portugal", "left"], ["Deutschland", "Germany", "right"], ["Belgien", "Belgium", "right"], ["Schweiz", "Switzerland", "right"]
  ], sources.geography),
  assignment("borders-germany-poland", ["Welche Staaten haben eine Landgrenze mit Deutschland, mit Polen oder mit beidem?", "Which countries share a land border with Germany, Poland, or both?"], ["Grenzt an Deutschland", "Borders Germany"], ["Grenzt an Polen", "Borders Poland"], [
    ["Tschechien", "Czechia", "both"], ["Dänemark", "Denmark", "left"], ["Niederlande", "Netherlands", "left"], ["Litauen", "Lithuania", "right"], ["Belarus", "Belarus", "right"]
  ], sources.geography),
  assignment("borders-austria-germany", ["Welche Staaten haben eine Landgrenze mit Österreich, mit Deutschland oder mit beidem?", "Which countries share a land border with Austria, Germany, or both?"], ["Grenzt an Österreich", "Borders Austria"], ["Grenzt an Deutschland", "Borders Germany"], [
    ["Schweiz", "Switzerland", "both"], ["Tschechien", "Czechia", "both"], ["Ungarn", "Hungary", "left"], ["Slowenien", "Slovenia", "left"], ["Niederlande", "Netherlands", "right"], ["Dänemark", "Denmark", "right"]
  ], sources.geography),
  assignment("borders-france-italy", ["Welche Staaten haben eine Landgrenze mit dem europäischen Festland Frankreichs, mit Italien oder mit beidem?", "Which countries share a land border with mainland European France, Italy, or both?"], ["Grenzt an Frankreich", "Borders France"], ["Grenzt an Italien", "Borders Italy"], [
    ["Schweiz", "Switzerland", "both"], ["Belgien", "Belgium", "left"], ["Spanien", "Spain", "left"], ["Österreich", "Austria", "right"], ["San Marino", "San Marino", "right"]
  ], sources.geography),
  assignment("borders-brazil-argentina", ["Welche Staaten haben eine Landgrenze mit Brasilien, mit Argentinien oder mit beidem?", "Which countries share a land border with Brazil, Argentina, or both?"], ["Grenzt an Brasilien", "Borders Brazil"], ["Grenzt an Argentinien", "Borders Argentina"], [
    ["Bolivien", "Bolivia", "both"], ["Paraguay", "Paraguay", "both"], ["Uruguay", "Uruguay", "both"], ["Kolumbien", "Colombia", "left"], ["Venezuela", "Venezuela", "left"], ["Chile", "Chile", "right"]
  ], sources.geography),
  assignment("borders-romania-serbia", ["Welche Staaten haben eine Landgrenze mit Rumänien, mit Serbien oder mit beidem?", "Which countries share a land border with Romania, Serbia, or both?"], ["Grenzt an Rumänien", "Borders Romania"], ["Grenzt an Serbien", "Borders Serbia"], [
    ["Ungarn", "Hungary", "both"], ["Bulgarien", "Bulgaria", "both"], ["Ukraine", "Ukraine", "left"], ["Moldau", "Moldova", "left"], ["Bosnien und Herzegowina", "Bosnia and Herzegovina", "right"], ["Montenegro", "Montenegro", "right"]
  ], sources.geography),
  assignment("africa-mediterranean", ["Welche Staaten liegen in Afrika, haben eine Küste am Mittelmeer oder erfüllen beides?", "Which countries are in Africa, have a Mediterranean coastline, or both?"], ["Afrika", "Africa"], ["Mittelmeerküste", "Mediterranean coast"], [
    ["Ägypten", "Egypt", "both"], ["Algerien", "Algeria", "both"], ["Kenia", "Kenya", "left"], ["Angola", "Angola", "left"], ["Griechenland", "Greece", "right"], ["Italien", "Italy", "right"]
  ], sources.geography),
  assignment("europe-mediterranean", ["Welche Staaten liegen mit ihrem Kerngebiet in Europa, haben eine Mittelmeerküste oder erfüllen beides? Überseegebiete zählen nicht.", "Which countries have their core territory in Europe, a Mediterranean coastline, or both? Exclude overseas territories."], ["Europa", "Europe"], ["Mittelmeerküste", "Mediterranean coast"], [
    ["Spanien", "Spain", "both"], ["Italien", "Italy", "both"], ["Schweden", "Sweden", "left"], ["Deutschland", "Germany", "left"], ["Tunesien", "Tunisia", "right"], ["Algerien", "Algeria", "right"]
  ], sources.geography),
  assignment("asia-indian-ocean", ["Welche Staaten liegen in Asien, haben eine Küste am Indischen Ozean oder erfüllen beides? Randmeere zählen mit.", "Which countries are in Asia, have an Indian Ocean coastline, or both? Include marginal seas."], ["Asien", "Asia"], ["Indischer Ozean", "Indian Ocean"], [
    ["Indien", "India", "both"], ["Sri Lanka", "Sri Lanka", "both"], ["Mongolei", "Mongolia", "left"], ["Laos", "Laos", "left"], ["Tansania", "Tanzania", "right"], ["Mosambik", "Mozambique", "right"]
  ], sources.geography),
  assignment("south-america-atlantic", ["Welche Staaten liegen in Südamerika, haben eine Atlantikküste oder erfüllen beides? Überseegebiete bleiben unberücksichtigt.", "Which countries are in South America, have an Atlantic coastline, or both? Exclude overseas territories."], ["Südamerika", "South America"], ["Atlantikküste", "Atlantic coast"], [
    ["Brasilien", "Brazil", "both"], ["Argentinien", "Argentina", "both"], ["Peru", "Peru", "left"], ["Ecuador", "Ecuador", "left"], ["Portugal", "Portugal", "right"], ["Marokko", "Morocco", "right"]
  ], sources.geography),
  assignment("islands-europe", ["Welche Staaten liegen ausschließlich auf Inseln, gehören geografisch zu Europa oder erfüllen beides? Gemeint sind die genannten Staaten, ohne abhängige Überseegebiete.", "Which countries lie entirely on islands, are geographically in Europe, or both? Consider the named countries without dependent overseas territories."], ["Nur auf Inseln", "Entirely on islands"], ["Europa", "Europe"], [
    ["Irland", "Ireland", "both"], ["Malta", "Malta", "both"], ["Madagaskar", "Madagascar", "left"], ["Sri Lanka", "Sri Lanka", "left"], ["Deutschland", "Germany", "right"], ["Polen", "Poland", "right"]
  ], sources.geography),
  assignment("landlocked-africa", ["Welche Staaten sind Binnenstaaten ohne Meeresküste, liegen in Afrika oder erfüllen beides?", "Which countries are landlocked without a sea coast, are in Africa, or both?"], ["Binnenstaat", "Landlocked"], ["Afrika", "Africa"], [
    ["Tschad", "Chad", "both"], ["Mali", "Mali", "both"], ["Österreich", "Austria", "left"], ["Mongolei", "Mongolia", "left"], ["Ghana", "Ghana", "right"], ["Kenia", "Kenya", "right"]
  ], sources.geography),
  assignment("mammals-water", ["Welche Tiere sind Säugetiere, verbringen ihr gesamtes Erwachsenenleben im Wasser oder erfüllen beides?", "Which animals are mammals, spend their entire adult lives in water, or both?"], ["Säugetier", "Mammal"], ["Immer im Wasser", "Always in water"], [
    ["Blauwal", "Blue whale", "both"], ["Delfin", "Dolphin", "both"], ["Katze", "Cat", "left"], ["Pferd", "Horse", "left"], ["Weißer Hai", "Great white shark", "right"], ["Gewöhnlicher Krake", "Common octopus", "right"]
  ], sources.mammals),
  assignment("birds-swimming", ["Welche Tiere sind Vögel, schwimmen regelmäßig als Teil ihrer natürlichen Lebensweise oder erfüllen beides?", "Which animals are birds, regularly swim as part of their natural way of life, or both?"], ["Vogel", "Bird"], ["Schwimmt regelmäßig", "Regularly swims"], [
    ["Stockente", "Mallard", "both"], ["Kaiserpinguin", "Emperor penguin", "both"], ["Haussperling", "House sparrow", "left"], ["Mauersegler", "Common swift", "left"], ["Seehund", "Harbour seal", "right"], ["Delfin", "Dolphin", "right"]
  ], sources.birds),
  assignment("reptiles-water", ["Welche Tiere sind Reptilien, leben natürlicherweise regelmäßig im Wasser oder erfüllen beides?", "Which animals are reptiles, naturally spend time in water regularly, or both?"], ["Reptil", "Reptile"], ["Regelmäßig im Wasser", "Regularly in water"], [
    ["Meeresschildkröte", "Sea turtle", "both"], ["Nilkrokodil", "Nile crocodile", "both"], ["Griechische Landschildkröte", "Hermann's tortoise", "left"], ["Leopardgecko", "Leopard gecko", "left"], ["Bachforelle", "Brown trout", "right"], ["Delfin", "Dolphin", "right"]
  ], sources.turtles),
  assignment("backbone-eggs", ["Welche Tiere haben eine Wirbelsäule, legen Eier oder erfüllen beides? Die Fortpflanzungsweise bezieht sich auf die Tierart.", "Which animals have a backbone, lay eggs, or both? Reproduction refers to the species."], ["Wirbelsäule", "Backbone"], ["Legt Eier", "Lays eggs"], [
    ["Huhn", "Chicken", "both"], ["Grasfrosch", "Common frog", "both"], ["Hund", "Dog", "left"], ["Katze", "Cat", "left"], ["Zitronenfalter", "Brimstone butterfly", "right"], ["Honigbiene", "Honeybee", "right"]
  ], sources.mammals),
  assignment("metal-liquid", ["Welche reinen Stoffe sind Metalle, bei 20 °C und normalem Luftdruck flüssig oder erfüllen beides?", "Which pure substances are metals, are liquid at 20 °C and normal atmospheric pressure, or both?"], ["Metall", "Metal"], ["Flüssig bei 20 °C", "Liquid at 20 °C"], [
    ["Quecksilber", "Mercury", "both"], ["Eisen", "Iron", "left"], ["Silber", "Silver", "left"], ["Wasser", "Water", "right"], ["Ethanol", "Ethanol", "right"]
  ], sources.chemistry),
  assignment("hydrogen-oxygen", ["Welche Moleküle enthalten Wasserstoffatome, Sauerstoffatome oder beides? Gemeint ist jeweils der reine Stoff.", "Which molecules contain hydrogen atoms, oxygen atoms, or both? Consider each pure substance."], ["Wasserstoff", "Hydrogen"], ["Sauerstoff", "Oxygen"], [
    ["Wasser", "Water", "both"], ["Wasserstoffperoxid", "Hydrogen peroxide", "both"], ["Ethanol", "Ethanol", "both"], ["Methan", "Methane", "left"], ["Ammoniak", "Ammonia", "left"], ["Kohlendioxid", "Carbon dioxide", "right"]
  ], sources.molecules),
  assignment("planets-rings", ["Welche Himmelskörper gehören zu den acht Planeten unseres Sonnensystems, haben ein Ringsystem oder erfüllen beides? Zwergplaneten zählen nicht zu den acht Planeten.", "Which bodies are among the eight Solar System planets, have a ring system, or both? Dwarf planets are not among the eight planets."], ["Einer der 8 Planeten", "One of the 8 planets"], ["Hat Ringe", "Has rings"], [
    ["Saturn", "Saturn", "both"], ["Jupiter", "Jupiter", "both"], ["Uranus", "Uranus", "both"], ["Erde", "Earth", "left"], ["Mars", "Mars", "left"], ["Chariklo", "Chariklo", "right"]
  ], sources.rings),
  assignment("moons-atmosphere", ["Welche Himmelskörper sind natürliche Monde, besitzen eine dichte Atmosphäre oder erfüllen beides? Eine äußerst dünne Exosphäre zählt nicht als dichte Atmosphäre.", "Which bodies are natural moons, have a dense atmosphere, or both? An extremely thin exosphere does not count as a dense atmosphere."], ["Natürlicher Mond", "Natural moon"], ["Dichte Atmosphäre", "Dense atmosphere"], [
    ["Titan", "Titan", "both"], ["Erdmond", "Earth's Moon", "left"], ["Phobos", "Phobos", "left"], ["Erde", "Earth", "right"], ["Venus", "Venus", "right"]
  ], sources.atmosphere),
  assignment("renewable-electricity", ["Welche Anlagen nutzen eine erneuerbare Energiequelle, erzeugen direkt Strom oder erfüllen beides? Gemeint ist die jeweilige Hauptfunktion.", "Which installations use a renewable energy source, directly generate electricity, or both? Consider their main function."], ["Erneuerbare Quelle", "Renewable source"], ["Erzeugt Strom", "Generates electricity"], [
    ["Photovoltaikanlage", "Photovoltaic installation", "both"], ["Windkraftanlage", "Wind turbine", "both"], ["Holzofen", "Wood stove", "left"], ["Solarthermischer Warmwasserkollektor", "Solar thermal hot-water collector", "left"], ["Kohlekraftwerk", "Coal-fired power station", "right"], ["Kernkraftwerk", "Nuclear power station", "right"]
  ], sources.electricity),
  assignment("compound-carbon", ["Welche reinen Stoffe sind chemische Verbindungen aus mehreren Elementen, enthalten Kohlenstoff oder erfüllen beides?", "Which pure substances are chemical compounds made from multiple elements, contain carbon, or both?"], ["Chemische Verbindung", "Chemical compound"], ["Enthält Kohlenstoff", "Contains carbon"], [
    ["Ethanol", "Ethanol", "both"], ["Glucose", "Glucose", "both"], ["Wasser", "Water", "left"], ["Natriumchlorid", "Sodium chloride", "left"], ["Reiner Graphit", "Pure graphite", "right"], ["Reiner Diamant", "Pure diamond", "right"]
  ], sources.molecules),
  assignment("element-metal", ["Welche Materialien sind reine chemische Elemente, sind Metalle beziehungsweise Metalllegierungen oder erfüllen beides?", "Which materials are pure chemical elements, are metals or metal alloys, or both?"], ["Reines Element", "Pure element"], ["Metall oder Legierung", "Metal or alloy"], [
    ["Reines Eisen", "Pure iron", "both"], ["Reines Kupfer", "Pure copper", "both"], ["Reiner Sauerstoff", "Pure oxygen", "left"], ["Reiner Schwefel", "Pure sulfur", "left"], ["Messing", "Brass", "right"], ["Zinnbronze", "Tin bronze", "right"]
  ], sources.chemistry),
  assignment("liquid-flammable", ["Welche Stoffe sind bei 20 °C flüssig, können als Brennstoff brennen oder erfüllen beides? Gemeint ist normaler Luftdruck; Feststoffe dürfen zum Brennen erhitzt werden.", "Which substances are liquid at 20 °C, can burn as fuels, or both? Assume normal atmospheric pressure; solids may be heated to burn."], ["Flüssig bei 20 °C", "Liquid at 20 °C"], ["Brennbar", "Combustible"], [
    ["Reines Ethanol", "Pure ethanol", "both"], ["Benzin", "Petrol", "both"], ["Wasser", "Water", "left"], ["Quecksilber", "Mercury", "left"], ["Kerzenwachs", "Candle wax", "right"], ["Holzkohle", "Charcoal", "right"]
  ], sources.chemistry),
  assignment("rail-electric", ["Welche Fahrzeuge fahren auf Schienen, werden im genannten Betrieb elektrisch angetrieben oder erfüllen beides?", "Which vehicles run on rails, use electric propulsion in the named configuration, or both?"], ["Auf Schienen", "Runs on rails"], ["Elektroantrieb", "Electric propulsion"], [
    ["Elektrische Straßenbahn", "Electric tram", "both"], ["Elektrische U-Bahn", "Electric metro", "both"], ["Kohlebefeuerte Dampflok", "Coal-fired steam locomotive", "left"], ["Rein dieselmechanischer Triebwagen", "Diesel-mechanical railcar", "left"], ["Batterie-Elektroauto", "Battery electric car", "right"], ["E-Bike", "E-bike", "right"]
  ], sources.energy),
  assignment("time-electric", ["Welche Geräte messen beziehungsweise zeigen Zeit, benötigen dafür elektrischen Strom oder erfüllen beides?", "Which devices measure or display time, require electricity for their named function, or both?"], ["Zeitmessung", "Measures time"], ["Braucht Strom", "Requires electricity"], [
    ["Batteriebetriebene Quarzuhr", "Battery-powered quartz clock", "both"], ["Digitale Stoppuhr", "Digital stopwatch", "both"], ["Sonnenuhr", "Sundial", "left"], ["Sanduhr", "Hourglass", "left"], ["Elektrischer Ventilator", "Electric fan", "right"], ["Elektrischer Wasserkocher ohne Uhr", "Electric kettle without a clock", "right"]
  ], sources.energy),
  assignment("light-heat", ["Welche Gegenstände erzeugen absichtlich sichtbares Licht, geben bei normalem Gebrauch deutlich Wärme ab oder erfüllen beides? Geringe Abwärme von LEDs zählt nicht.", "Which objects intentionally produce visible light, give off substantial heat during normal use, or both? Ignore minor LED waste heat."], ["Sichtbares Licht", "Visible light"], ["Deutlich Wärme", "Substantial heat"], [
    ["Brennende Kerze", "Burning candle", "both"], ["Eingeschaltete Glühlampe", "Switched-on incandescent bulb", "both"], ["Leuchtender Knicklichtstab", "Glowing chemical light stick", "left"], ["LED-Kontrollleuchte", "LED indicator", "left"], ["Warme Wärmflasche", "Hot-water bottle", "right"], ["Warmwasser-Heizkörper", "Hot-water radiator", "right"]
  ], sources.energy),
  assignment("battery-internet", ["Welche Geräte können im genannten Betrieb mit Akku oder Batterie laufen, auf das Internet zugreifen oder erfüllen beides?", "Which devices can run on a battery in the named configuration, access the internet, or both?"], ["Akku oder Batterie", "Battery-powered"], ["Internetzugang", "Internet access"], [
    ["Smartphone", "Smartphone", "both"], ["Laptop mit WLAN", "Laptop with Wi-Fi", "both"], ["Einfacher Batterie-Taschenrechner", "Basic battery-powered calculator", "left"], ["Batterie-Taschenlampe ohne Funk", "Battery torch without wireless features", "left"], ["Stationärer PC am Stromnetz mit LAN", "Mains-powered desktop PC with Ethernet", "right"], ["Smart-TV am Stromnetz mit WLAN", "Mains-powered smart TV with Wi-Fi", "right"]
  ], sources.computing),
  assignment("team-net", ["Welche Wettbewerbe werden als Mannschaftsspiel ausgetragen, verwenden ein Netz zwischen den Gegnern oder erfüllen beides?", "Which events are team games, use a net between opponents, or both?"], ["Mannschaftsspiel", "Team game"], ["Trennendes Netz", "Net between opponents"], [
    ["Hallenvolleyball", "Indoor volleyball", "both"], ["Beachvolleyball", "Beach volleyball", "both"], ["Handball", "Handball", "left"], ["Rugby", "Rugby", "left"], ["Badminton-Einzel", "Badminton singles", "right"], ["Tennis-Einzel", "Tennis singles", "right"]
  ], sources.sports),
  assignment("winter-team", ["Welche Wettbewerbe gehören zu den olympischen Wintersportarten, werden als direktes Mannschaftsspiel gegeneinander gespielt oder erfüllen beides?", "Which events are Olympic winter sports, are direct team games against opponents, or both?"], ["Wintersport", "Winter sport"], ["Mannschaftsspiel", "Team game"], [
    ["Eishockey", "Ice hockey", "both"], ["Curling", "Curling", "both"], ["Ski-Abfahrt (Einzel)", "Downhill skiing (individual)", "left"], ["Eiskunstlauf (Einzel)", "Figure skating (singles)", "left"], ["Basketball", "Basketball", "right"], ["Hallenvolleyball", "Indoor volleyball", "right"]
  ], sources.sports),
  assignment("ball-helmet", ["Welche Sportarten verwenden einen Ball, schreiben für mindestens eine Spielerposition einen Schutzhelm vor oder erfüllen beides? Gemeint ist der reguläre Erwachsenen-Wettkampf.", "Which sports use a ball, require a protective helmet for at least one player position, or both? Consider standard adult competition."], ["Verwendet Ball", "Uses a ball"], ["Helmpflicht", "Helmet required"], [
    ["Baseball", "Baseball", "both"], ["American Football", "American football", "both"], ["Basketball", "Basketball", "left"], ["Fußball", "Association football", "left"], ["Bahnradrennen", "Track cycling", "right"], ["Eishockey", "Ice hockey", "right"]
  ], sources.sports),
  assignment("racket-net", ["Welche Sportarten verwenden einen Schläger, ein Netz zwischen den Gegnern oder beides?", "Which sports use a racket, a net between opponents, or both?"], ["Schläger", "Racket"], ["Trennendes Netz", "Net between opponents"], [
    ["Tennis", "Tennis", "both"], ["Badminton", "Badminton", "both"], ["Squash", "Squash", "left"], ["Racquetball", "Racquetball", "left"], ["Hallenvolleyball", "Indoor volleyball", "right"], ["Beachvolleyball", "Beach volleyball", "right"]
  ], sources.sports),
  assignment("strings-plucked", ["Welche Instrumente haben Saiten, werden üblicherweise durch Zupfen gespielt oder erfüllen beides? Gemeint ist die normale Spielweise, nicht eine Spezialtechnik.", "Which instruments have strings, are normally played by plucking, or both? Consider their normal playing technique, not special techniques."], ["Hat Saiten", "Has strings"], ["Wird gezupft", "Played by plucking"], [
    ["Akustische Gitarre", "Acoustic guitar", "both"], ["Harfe", "Harp", "both"], ["Geige mit Bogen", "Bowed violin", "left"], ["Cello mit Bogen", "Bowed cello", "left"], ["Kalimba", "Kalimba", "right"], ["Mbira", "Mbira", "right"]
  ], sources.instruments),
  assignment("keys-air", ["Welche Instrumente haben Spieltasten, benötigen einen Luftstrom zur Klangerzeugung oder erfüllen beides? Gemeint ist die übliche akustische Bauform.", "Which instruments have a keyboard, require airflow to produce sound, or both? Consider the usual acoustic design."], ["Hat Spieltasten", "Has a keyboard"], ["Benötigt Luftstrom", "Requires airflow"], [
    ["Pfeifenorgel", "Pipe organ", "both"], ["Akkordeon", "Accordion", "both"], ["Akustisches Klavier", "Acoustic piano", "left"], ["Celesta", "Celesta", "left"], ["Trompete", "Trumpet", "right"], ["Querflöte", "Flute", "right"]
  ], sources.instruments),
  assignment("media-picture-sound", ["Welche Medien enthalten im genannten Format sichtbare Bilder, hörbaren Ton oder beides?", "Which media contain visible images, audible sound, or both in the named format?"], ["Bild", "Images"], ["Ton", "Sound"], [
    ["Kinofilm mit Ton", "Cinema film with sound", "both"], ["Video mit Ton", "Video with sound", "both"], ["Gedrucktes Foto", "Printed photograph", "left"], ["Aquarellbild", "Watercolour painting", "left"], ["Reiner Audio-Podcast", "Audio-only podcast", "right"], ["Radiointerview ohne Video", "Radio interview without video", "right"]
  ], sources.media),
  assignment("games-dice-cards", ["Welche Spiele verwenden in ihrer klassischen Grundversion Würfel, Spielkarten oder beides? Ereignis- und Besitzkarten zählen als Spielkarten.", "Which games use dice, playing cards, or both in their classic base versions? Event and property cards count as playing cards."], ["Würfel", "Dice"], ["Spielkarten", "Playing cards"], [
    ["Monopoly", "Monopoly", "both"], ["Catan", "Catan", "both"], ["Mensch ärgere Dich nicht", "Ludo", "left"], ["Kniffel", "Yahtzee", "left"], ["Skat", "Skat", "right"], ["Poker (klassisch mit Karten)", "Poker (classic card game)", "right"]
  ], sources.games)
];

export const schaetzoramaAssignments = entries.map(({ question }) => question);
export const schaetzoramaAssignmentEnglishText: Record<string, SchaetzoramaEnglishQuestionText> = Object.fromEntries(entries.map(({ question, english }) => [question.id, english]));
