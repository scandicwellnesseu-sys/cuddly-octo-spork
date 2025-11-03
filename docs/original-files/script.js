const suggestions = [
    "Tips för energi",
    "Immunförsvar",
    "Leveransalternativ",
    "Prenumeration",
    "Veganska produkter",
    "Återhämtning efter träning"
];

const productCatalog = [
    {
        name: "Nordic Energy+ Multivitamin",
        tags: ["energi", "multivitamin", "stress", "trött"],
        description: "Balanserad multivitamin med B12, järn och adaptogener för jämn energi.",
        usage: "1 tablett till frukost",
        price: "249 kr",
        benefits: ["Minskar trötthet", "Stödjer nervsystemet", "Passar vid stressiga perioder"]
    },
    {
        name: "Polar D3 Forte",
        tags: ["d-vitamin", "vitamin d", "immunförsvar", "skelett"],
        description: "D-vitamin i oljelösning för bästa upptag, idealiskt under mörka månader.",
        usage: "5 droppar dagligen tillsammans med måltid",
        price: "189 kr",
        benefits: ["Stödjer immunförsvar", "Bidrar till starkt skelett", "Innehåller MCT-olja"]
    },
    {
        name: "Scandic Omega-3 Pure",
        tags: ["omega", "hjärta", "fiskolja", "led"],
        description: "Renad omega-3 från hållbart fiskeri med EPA och DHA.",
        usage: "2 kapslar dagligen",
        price: "219 kr",
        benefits: ["Främjar hjärthälsa", "Stödjer hjärnans funktion", "Lindrar stela leder"]
    },
    {
        name: "Recovery Plant Protein",
        tags: ["protein", "träning", "återhämtning", "vegansk"],
        description: "Komplett växtbaserat protein med aminosyror och magnesium för muskler.",
        usage: "1 skopa i vatten eller smoothie efter träning",
        price: "299 kr",
        benefits: ["Snabb återhämtning", "Mjuk mot magen", "Berikat med vitamin C"]
    },
    {
        name: "Calm Focus Magnesium",
        tags: ["magnesium", "sömn", "stress", "återhämtning"],
        description: "Magnesiumbisglycinat som tas upp skonsamt och hjälper till att varva ned.",
        usage: "2 kapslar på kvällen",
        price: "199 kr",
        benefits: ["Avslappning i muskler", "Främjar god sömn", "Minskar stresskänslighet"]
    },
    {
        name: "Nordic Kids Multidrops",
        tags: ["barn", "familj", "vitamin", "drops"],
        description: "Smidiga droppar med vitamin A, C, D och zink för hela familjen.",
        usage: "5 droppar i dryck eller gröt",
        price: "159 kr",
        benefits: ["Stödjer immunförsvar", "Sockerfri", "Enkel dosering"]
    }
];

const knowledgeBase = [
    {
        triggers: ["hej", "hejsan", "hallå", "tjena"],
        response: () => "Hej! Jag är ScandicBot. Hur kan jag stötta dig i din hälsorutin idag?"
    },
    {
        triggers: ["frakt", "leverans", "shipping"],
        response: () => "Vi levererar inom 1-3 arbetsdagar med klimatkompenserad frakt. Fri frakt över 499 kr och du kan spåra paketet via din orderbekräftelse."
    },
    {
        triggers: ["öppet köp", "retur", "returer"],
        response: () => "Självklart! Du har 30 dagars öppet köp. Kontakta support@scandicwellness.se med ditt ordernummer så hjälper vi dig med en returfraktsedel."
    },
    {
        triggers: ["prenumeration", "subscription"],
        response: () => "Med en prenumeration får du 10% rabatt och leverans var 4:e eller 8:e vecka. Du kan pausa eller ändra i din kundprofil utan bindningstid."
    },
    {
        triggers: ["betalning", "klarna", "swish"],
        response: () => "Vi erbjuder betalning via kort, Swish och Klarna (faktura/delbetalning). Allt sker över krypterade betalningsflöden för din trygghet."
    },
    {
        triggers: ["kontakt", "kundtjänst", "support"],
        response: () => "Du når oss via chatten här, e-post support@scandicwellness.se eller telefon 010-123 45 67 vardagar 9-17."
    }
];

const fallbackMessages = [
    "Berätta gärna lite mer så ska jag guida dig rätt!",
    "Jag hittar inte exakt svar – kan du beskriva din fråga lite tydligare?",
    "Jag är ännu under upplärning. Vill du ha hjälp av en rådgivare kan jag ordna kontakt."
];

const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const suggestionsContainer = document.getElementById("chatSuggestions");

function formatTime(date) {
    return date.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function createMessageElement(text, author) {
    const wrapper = document.createElement("div");
    wrapper.className = `message message--${author}`;

    const bubble = document.createElement("div");
    bubble.className = "message__bubble";
    bubble.textContent = text;

    const time = document.createElement("time");
    time.className = "message__time";
    time.dateTime = new Date().toISOString();
    time.textContent = formatTime(new Date());

    wrapper.append(bubble, time);
    return wrapper;
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(text, author = "bot") {
    const element = createMessageElement(text, author);
    chatMessages.appendChild(element);
    scrollToBottom();
}

function matchKnowledgeBase(message) {
    const normalized = message.toLowerCase();
    for (const entry of knowledgeBase) {
        if (entry.triggers.some(trigger => normalized.includes(trigger))) {
            return entry.response();
        }
    }
    return null;
}

function findProductRecommendation(message) {
    const normalized = message.toLowerCase();
    const matches = productCatalog.filter(product =>
        product.tags.some(tag => normalized.includes(tag))
    );

    if (!matches.length) {
        return null;
    }

    const topProduct = matches[0];
    const benefits = topProduct.benefits.map(b => `• ${b}`).join("\n");

    return `Jag rekommenderar ${topProduct.name}. ${topProduct.description}\n\nSå använder du den: ${topProduct.usage}.\nPris: ${topProduct.price}.\n\nFördelar:\n${benefits}`;
}

function buildSuggestionButtons() {
    suggestions.forEach(text => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "suggestion";
        button.textContent = text;
        button.addEventListener("click", () => {
            userInput.value = text;
            userInput.focus();
        });
        suggestionsContainer.appendChild(button);
    });
}

function handleUserMessage(message) {
    addMessage(message, "user");

    const knowledgeReply = matchKnowledgeBase(message);
    if (knowledgeReply) {
        setTimeout(() => addMessage(knowledgeReply, "bot"), 400);
        return;
    }

    const productReply = findProductRecommendation(message);
    if (productReply) {
        setTimeout(() => addMessage(productReply, "bot"), 400);
        return;
    }

    const fallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    setTimeout(() => addMessage(fallback, "bot"), 400);
}

function handleFormSubmit(event) {
    event.preventDefault();
    const message = userInput.value.trim();
    if (!message) {
        return;
    }
    userInput.value = "";
    handleUserMessage(message);
}

function init() {
    buildSuggestionButtons();
    addMessage("Hej! Jag är ScandicBot – din guide till vitaminer och kosttillskott. Vad vill du veta idag?", "bot");
    chatForm.addEventListener("submit", handleFormSubmit);
}

init();
