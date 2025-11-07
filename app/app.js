(function () {
    const root = document.querySelector('[data-app-root]');
    if (!root) return;

    const authPanel = root.querySelector('[data-auth-panel]');
    const dashboard = root.querySelector('[data-dashboard]');
    const editor = root.querySelector('[data-editor]');
    const itemForm = editor?.querySelector('[data-item-form]');
    const itemList = root.querySelector('[data-item-list]');
    const shareList = root.querySelector('[data-share-list]');
    const greeting = root.querySelector('[data-greeting]');
    const createEmptyBtn = root.querySelector('[data-create-empty]');
    const createTemplateBtn = root.querySelector('[data-create-template]');
    const cancelEditBtn = root.querySelector('[data-cancel-edit]');
    const logoutBtn = root.querySelector('[data-logout]');

    const narrativeLab = root.querySelector('[data-narrative-lab]');
    const labForm = narrativeLab?.querySelector('[data-lab-form]');
    const labRefreshBtn = narrativeLab?.querySelector('[data-lab-refresh]');
    const labCopyBtn = narrativeLab?.querySelector('[data-lab-copy]');
    const labStatus = narrativeLab?.querySelector('[data-lab-status]');
    const labSegment = narrativeLab?.querySelector('[data-lab-segment]');
    const labHeadline = narrativeLab?.querySelector('[data-lab-headline]');
    const labMessage = narrativeLab?.querySelector('[data-lab-message]');
    let labFocus = narrativeLab?.querySelector('[data-lab-focus]');
    const labFields = narrativeLab?.querySelectorAll('[data-lab-field]') || [];
    let labStatusTimeout = null;

    const metricItems = root.querySelector('[data-metric-items]');
    const metricShares = root.querySelector('[data-metric-shares]');
    const metricConversion = root.querySelector('[data-metric-conversion]');
    const metricForecast = root.querySelector('[data-metric-forecast]');
    const metricBoosts = root.querySelector('[data-metric-boosts]');
    const metricAvgValue = root.querySelector('[data-metric-avg-value]');
    const metricLastShare = root.querySelector('[data-metric-last-share]');

    const growthConsole = root.querySelector('[data-growth-console]');
    const consoleProgramButtons = growthConsole?.querySelectorAll('[data-console-program]') || [];
    const consoleSegment = growthConsole?.querySelector('[data-console-segment]');
    const consoleRange = growthConsole?.querySelector('[data-console-range]');
    const consoleLevel = growthConsole?.querySelector('[data-console-level]');
    const consoleSwitches = growthConsole?.querySelectorAll('[data-console-switch]') || [];
    const consoleTag = growthConsole?.querySelector('[data-console-tag]');
    const consoleTitle = growthConsole?.querySelector('[data-console-title]');
    const consoleSummary = growthConsole?.querySelector('[data-console-summary]');
    const consoleBoost = growthConsole?.querySelector('[data-console-boost]');
    const consoleImpact = growthConsole?.querySelector('[data-console-impact]');
    const consoleCadence = growthConsole?.querySelector('[data-console-cadence]');
    const consoleNext = growthConsole?.querySelector('[data-console-next]');
    const consoleApply = growthConsole?.querySelector('[data-console-apply]');
    const consoleStatus = growthConsole?.querySelector('[data-console-status]');

    const apexConsole = root.querySelector('[data-apex-console]');
    const apexApply = apexConsole?.querySelector('[data-apex-apply]');
    const apexTitleNode = apexConsole?.querySelector('[data-apex-title]');
    const apexSummaryNode = apexConsole?.querySelector('[data-apex-summary]');
    const apexScoreNode = apexConsole?.querySelector('[data-apex-score]');
    const apexDeltaNode = apexConsole?.querySelector('[data-apex-delta]');
    const apexFocusNode = apexConsole?.querySelector('[data-apex-focus]');
    const apexWindowNode = apexConsole?.querySelector('[data-apex-window]');
    const apexStatus = apexConsole?.querySelector('[data-apex-status]');

    const capitalConsole = root.querySelector('[data-capital-console]');
    const capitalApply = capitalConsole?.querySelector('[data-capital-apply]');
    const capitalStatus = capitalConsole?.querySelector('[data-capital-status]');

    const supremacyConsole = root.querySelector('[data-supremacy-console]');
    const supremacyApply = supremacyConsole?.querySelector('[data-supremacy-apply]');
    const supremacyTitleNode = supremacyConsole?.querySelector('[data-supremacy-title]');
    const supremacySummaryNode = supremacyConsole?.querySelector('[data-supremacy-summary]');
    const supremacyScoreNode = supremacyConsole?.querySelector('[data-supremacy-score]');
    const supremacyDeltaNode = supremacyConsole?.querySelector('[data-supremacy-delta]');
    const supremacyFocusNode = supremacyConsole?.querySelector('[data-supremacy-focus]');
    const supremacyWindowNode = supremacyConsole?.querySelector('[data-supremacy-window]');
    const supremacyEffectNode = supremacyConsole?.querySelector('[data-supremacy-effect]');
    const supremacyStatus = supremacyConsole?.querySelector('[data-supremacy-status]');

    const orchestrator = root.querySelector('[data-orchestrator]');
    const orchestratorScenario = orchestrator?.querySelector('[data-orchestrator-scenario]');
    const orchestratorRegion = orchestrator?.querySelector('[data-orchestrator-region]');
    const orchestratorRhythm = orchestrator?.querySelector('[data-orchestrator-rhythm]');
    const orchestratorIntensity = orchestrator?.querySelector('[data-orchestrator-intensity]');
    const orchestratorLevel = orchestrator?.querySelector('[data-orchestrator-level]');
    const orchestratorSignals = orchestrator?.querySelectorAll('[data-orchestrator-signal]') || [];
    const orchestratorTag = orchestrator?.querySelector('[data-orchestrator-tag]');
    const orchestratorTitle = orchestrator?.querySelector('[data-orchestrator-title]');
    const orchestratorSummary = orchestrator?.querySelector('[data-orchestrator-summary]');
    const orchestratorScore = orchestrator?.querySelector('[data-orchestrator-score]');
    const orchestratorWindow = orchestrator?.querySelector('[data-orchestrator-window]');
    const orchestratorFocus = orchestrator?.querySelector('[data-orchestrator-focus]');
    const orchestratorActions = orchestrator?.querySelector('[data-orchestrator-actions]');
    const orchestratorEffect = orchestrator?.querySelector('[data-orchestrator-effect]');
    const orchestratorCopy = orchestrator?.querySelector('[data-orchestrator-copy]');
    const orchestratorApply = orchestrator?.querySelector('[data-orchestrator-apply]');
    const orchestratorStatus = orchestrator?.querySelector('[data-orchestrator-status]');

    const reactor = root.querySelector('[data-reactor]');
    const reactorOutcome = reactor?.querySelector('[data-reactor-outcome]');
    const reactorModeButtons = reactor?.querySelectorAll('[data-reactor-mode]') || [];
    const reactorSpan = reactor?.querySelector('[data-reactor-span]');
    const reactorLevel = reactor?.querySelector('[data-reactor-level]');
    const reactorBoosts = reactor?.querySelectorAll('[data-reactor-boost]') || [];
    const reactorTag = reactor?.querySelector('[data-reactor-tag]');
    const reactorTitle = reactor?.querySelector('[data-reactor-title]');
    const reactorSummary = reactor?.querySelector('[data-reactor-summary]');
    const reactorScore = reactor?.querySelector('[data-reactor-score]');
    const reactorWindow = reactor?.querySelector('[data-reactor-window]');
    const reactorFocus = reactor?.querySelector('[data-reactor-focus]');
    const reactorActions = reactor?.querySelector('[data-reactor-actions]');
    const reactorEffect = reactor?.querySelector('[data-reactor-effect]');
    const reactorCopy = reactor?.querySelector('[data-reactor-copy]');
    const reactorApply = reactor?.querySelector('[data-reactor-apply]');
    const reactorStatus = reactor?.querySelector('[data-reactor-status]');

    const visionLab = root.querySelector('[data-design-lab]');
    const visionPersonaButtons = visionLab?.querySelectorAll('[data-vision-persona]') || [];
    const visionChannel = visionLab?.querySelector('[data-vision-channel]');
    const visionCadence = visionLab?.querySelector('[data-vision-cadence]');
    const visionLevel = visionLab?.querySelector('[data-vision-level]');
    const visionModuleInputs = visionLab?.querySelectorAll('[data-vision-module]') || [];
    const visionTag = visionLab?.querySelector('[data-vision-tag]');
    const visionTitle = visionLab?.querySelector('[data-vision-title]');
    const visionSummary = visionLab?.querySelector('[data-vision-summary]');
    const visionFocus = visionLab?.querySelector('[data-vision-focus]');
    const visionWindow = visionLab?.querySelector('[data-vision-window]');
    const visionScore = visionLab?.querySelector('[data-vision-score]');
    const visionActions = visionLab?.querySelector('[data-vision-actions]');
    const visionEffect = visionLab?.querySelector('[data-vision-effect]');
    const visionCopy = visionLab?.querySelector('[data-vision-copy]');
    const visionApply = visionLab?.querySelector('[data-vision-apply]');
    const visionStatus = visionLab?.querySelector('[data-vision-status]');

    const dominanceConsole = root.querySelector('[data-dominance-console]');
    const dominanceCompetitorButtons = dominanceConsole?.querySelectorAll('[data-dominance-competitor]') || [];
    const dominanceScenario = dominanceConsole?.querySelector('[data-dominance-scenario]');
    const dominanceStage = dominanceConsole?.querySelector('[data-dominance-stage]');
    const dominanceTempo = dominanceConsole?.querySelector('[data-dominance-tempo]');
    const dominanceLevel = dominanceConsole?.querySelector('[data-dominance-level]');
    const dominanceSignals = dominanceConsole?.querySelectorAll('[data-dominance-signal]') || [];
    const dominanceTag = dominanceConsole?.querySelector('[data-dominance-tag]');
    const dominanceTitle = dominanceConsole?.querySelector('[data-dominance-title]');
    const dominanceSummary = dominanceConsole?.querySelector('[data-dominance-summary]');
    const dominanceScore = dominanceConsole?.querySelector('[data-dominance-score]');
    const dominanceDelta = dominanceConsole?.querySelector('[data-dominance-delta]');
    const dominanceFocus = dominanceConsole?.querySelector('[data-dominance-focus]');
    const dominanceEdges = dominanceConsole?.querySelector('[data-dominance-edges]');
    const dominanceActions = dominanceConsole?.querySelector('[data-dominance-actions]');
    const dominanceEffect = dominanceConsole?.querySelector('[data-dominance-effect]');
    const dominanceCopy = dominanceConsole?.querySelector('[data-dominance-copy]');
    const dominanceApply = dominanceConsole?.querySelector('[data-dominance-apply]');
    const dominanceStatus = dominanceConsole?.querySelector('[data-dominance-status]');

    const consoleState = {
        program: growthConsole?.querySelector('[data-console-program].is-active')?.getAttribute('data-console-program') ||
            'velocity',
        segment: consoleSegment?.value || 'product',
        intensity: Number(consoleRange?.value || 3),
        boosters: new Set(
            Array.from(consoleSwitches)
                .filter((input) => input.checked)
                .map((input) => input.getAttribute('data-console-switch'))
                .filter(Boolean)
        )
    };

    const visionState = {
        persona:
            visionLab?.querySelector('[data-vision-persona].is-active')?.getAttribute('data-vision-persona') || 'founder',
        channel: visionChannel?.value || 'landing',
        cadence: Number(visionCadence?.value || 3),
        modules: new Set(
            Array.from(visionModuleInputs)
                .filter((input) => input.checked)
                .map((input) => input.getAttribute('data-vision-module'))
                .filter(Boolean)
        )
    };

    const dominanceState = {
        competitor:
            dominanceConsole?.querySelector('[data-dominance-competitor].is-active')?.getAttribute(
                'data-dominance-competitor'
            ) || 'atlas',
        scenario: dominanceScenario?.value || 'launch',
        focus: dominanceStage?.value || 'acquisition',
        tempo: Number(dominanceTempo?.value || 4),
        signals: new Set(
            Array.from(dominanceSignals)
                .filter((input) => input.checked)
                .map((input) => input.getAttribute('data-dominance-signal'))
                .filter(Boolean)
        )
    };

    let consoleMetrics = {
        items: 0,
        shares: 0,
        views: 0,
        signups: 0,
        boosts: 0,
        conversion: 0
    };
    let consoleStatusTimeout = null;
    let apexStatusTimeout = null;
    let capitalStatusTimeout = null;
    let supremacyStatusTimeout = null;
    let visionStatusTimeout = null;
    let dominanceStatusTimeout = null;

    const orchestratorProfiles = {
        launch: {
            label: 'Launch Surge',
            base: 204,
            window: 4,
            title: 'Skapa momentum före konkurrenterna hinner reagera',
            summary:
                'Kombinera signalspeglar med automation för att upptäcka köpintention, paketera erbjudanden och trycka ut snabbare än någon annan i segmentet.',
            focus: 'Activation burst',
            actions: [
                'Skapa triggers i Signals för konton som ökar aktivitet.',
                'Bygg automationer som skickar pitch från Narrative Lab.',
                'Planera partner raid för de tre största kontona.'
            ],
            effect: {
                emea: 'Öka pipeline-täckningen med 38% och stäng första vågen på 21 dagar.',
                namer: 'Ta ledningen i top-of-funnel och lås 3 flaggskeppskonton.',
                apac: 'Säkra lokal närvaro med 30% snabbare expansion.'
            }
        },
        scale: {
            label: 'Scale Armor',
            base: 218,
            window: 5,
            title: 'Skala hållbar tillväxt utan att tappa precision',
            summary:
                'Växla upp experiment, revenue-sync och partnerkedjor samtidigt – varje steg mätt och förstärkt i realtid.',
            focus: 'Expansion velocity',
            actions: [
                'Kedja experiment i Growth Console och automatisera utvärdering.',
                'Synka RevOps dashboards med operationsautomation.',
                'Förstärk partner raids kring konton med hög signalscore.'
            ],
            effect: {
                emea: 'Multiplicera återkommande intäkter med 32% på två kvartal.',
                namer: 'Lyft expansion ARR med 27% och korta ramp-tiden för nya team.',
                apac: 'Öka multi-region konvertering med 24% genom lokaliserade flows.'
            }
        },
        defend: {
            label: 'Defence Halo',
            base: 192,
            window: 6,
            title: 'Skapa ett ogenomträngligt försvar mot churn',
            summary:
                'Sätt upp tidiga varningssystem, personaliserade återaktiveringar och ledningsrapporter som håller varje konto engagerat.',
            focus: 'Retention shield',
            actions: [
                'Aktivera signalspeglar som larmar vid riskbeteenden.',
                'Automatisera win-back flows med narrativa recept.',
                'Koordinera partner och customer success i veckovisa raids.'
            ],
            effect: {
                emea: 'Halvera riskexponeringen och säkra kontrakt innan förnyelse.',
                namer: 'Minska churn med 18% och lås expansionsavtal samtidigt.',
                apac: 'Förläng kundlivscykeln med 22% genom proaktiva program.'
            }
        }
    };

    const orchestratorRegions = {
        emea: { label: 'EMEA', multiplier: 1, window: 0 },
        namer: { label: 'Nordamerika', multiplier: 1.08, window: -1 },
        apac: { label: 'APAC', multiplier: 0.96, window: 1 }
    };

    const orchestratorRhythms = {
        pulse: { label: 'Pulse Weekly', multiplier: 1, window: 0, cadence: 'Veckovis puls' },
        blitz: { label: 'Blitz 48h', multiplier: 1.18, window: -1, cadence: '48h blitz' },
        summit: { label: 'Executive Summit', multiplier: 1.12, window: 1, cadence: 'Executive review' }
    };

    const orchestratorSignalData = {
        intel: {
            lift: 28,
            focus: 'Signal mirrors',
            action: 'Synka signal mirrors mot top accounts och skapa varningskoder.'
        },
        ops: {
            lift: 24,
            focus: 'Ops automation',
            action: 'Automatisera experimentkedjor och routing till rätt team.'
        },
        alliances: {
            lift: 18,
            focus: 'Partner raids',
            action: 'Koordinera partner raids med gemensamma mål och dashboards.'
        },
        narrative: {
            lift: 16,
            focus: 'Narrative uplink',
            action: 'Koppla Narrative Lab till varje touchpoint för hypersnabb copy.'
        }
    };

    const reactorOutcomes = {
        activation: {
            label: 'Aktivering',
            base: 240,
            noun: 'aktiverade konton',
            summary: 'Säkerställ att varje ny användare når sitt aha-ögonblick och ser värdet direkt.',
            focus: 'Activation storm',
            actions: [
                'Designa onboardingritualer kopplade till signalscore.',
                'Mät aktiveringskurvan i Profitpanelen varje morgon.'
            ],
            effect: 'Lyft aktiveringsgraden över 45 % och skapa ett stabilt inflöde.'
        },
        expansion: {
            label: 'Expansion',
            base: 256,
            noun: 'expansionsintäkter',
            summary: 'Förvandla nöjda kunder till premiumintäkter genom riktade uppgraderingsprogram.',
            focus: 'Expansion wave',
            actions: [
                'Skapa segmenterade upsell-spår i Revenue Resonance.',
                'Synka kampanjdata mot expansionsmål i dashboarden.'
            ],
            effect: 'Öka expansion ARR och korta tiden mellan uppgraderingar.'
        },
        retention: {
            label: 'Retention',
            base: 232,
            noun: 'lojala kunder',
            summary: 'Bygg ett försvar mot churn med proaktiva program och personaliserade signaler.',
            focus: 'Retention shield',
            actions: [
                'Aktivera risklarm i Signals och planera åtgärdsloopar.',
                'Planera win-back kampanjer tillsammans med success-teamet.'
            ],
            effect: 'Säkra behållning och frigör utrymme för nettotillväxt.'
        }
    };

    const reactorModes = {
        ignite: {
            label: 'Ignite',
            lift: 52,
            window: -1,
            focus: 'Momentum spark',
            summary: 'Ignite accelererar top-of-funnel och håller flödet av nya konton igång.',
            actions: [
                'Lansera mikro-kampanjer via Profit Command Center.',
                'Synka marknad och produkt i dagliga alignment-ritualer.'
            ],
            effect: 'Driver en aggressiv start på varje cykel.',
            title: (noun) => `Skapa ett kontinuerligt inflöde av ${noun}`
        },
        fortify: {
            label: 'Fortify',
            lift: 44,
            window: 0,
            focus: 'Stability shield',
            summary: 'Fortify stabiliserar mid-funnel och blockerar läckage mellan teamen.',
            actions: [
                'Inför veckovisa pipeline-kontroller med hela teamet.',
                'Bygg riskdashboards som triggar åtgärder innan problem uppstår.'
            ],
            effect: 'Ger kontroll över varje steg utan att bromsa innovation.',
            title: (noun) => `Stabilisera ${noun} utan att tappa momentum`
        },
        harvest: {
            label: 'Harvest',
            lift: 48,
            window: 1,
            focus: 'Value capture',
            summary: 'Harvest maximerar värdet från befintliga relationer och landar expansion.',
            actions: [
                'Automatisera upsell-kampanjer baserat på beteende.',
                'Integrera customer success i varje uppföljning.'
            ],
            effect: 'Förvandlar insikter till återkommande intäkter.',
            title: (noun) => `Maximera ${noun} varje cykel`
        }
    };

    const reactorBoosters = {
        signals: {
            label: 'Signals autoprioritering',
            lift: 18,
            focus: 'Signal intelligence',
            action: 'Prioritera konton via Signals autoprioritering.',
            effect: 'Säkerställer att resurser hamnar på de hetaste kontona.'
        },
        product: {
            label: 'Produkt ritualer',
            lift: 16,
            focus: 'Product rituals',
            action: 'Inför produkt ritualer med dagliga micro-wins.',
            effect: 'Bygger kultur kring snabb leverans.'
        },
        sales: {
            label: 'Sälj sync',
            lift: 14,
            focus: 'Revenue sync',
            action: 'Synka säljsekvenser med labbscenarier och blueprints.',
            effect: 'Ökar win-rate genom koordinerad outreach.'
        },
        success: {
            label: 'Success storm',
            lift: 15,
            focus: 'Success surge',
            action: 'Kör success storm med proaktiv kundkontakt.',
            effect: 'Håller kunderna engagerade efter köpet.'
        }
    };

    let orchestratorStatusTimeout = null;
    let reactorStatusTimeout = null;

    const consolePrograms = {
        velocity: {
            label: 'Velocity Sprint',
            baseLift: 30,
            perLevel: 7,
            titles: {
                product: 'Skapa momentum från 0 till 50 delningar',
                sales: 'Snabba kampanjer mot heta konton',
                leadership: 'Synliggör aktiveringskurvan i realtid'
            },
            summary: {
                product:
                    'Koppla ihop Profitpanelen med Signals för att identifiera vinnande objekt och trigga automations direkt.',
                sales: 'Ge revenue-teamet en prioriterad lista med aktiva konton och tidsatta uppföljningar.',
                leadership: 'Leverera en vecka-för-vecka scoreboard med fokus på nya aktiveringar och pipeline.'
            },
            cadence: {
                product: '14-dagars loop',
                sales: 'Veckovis pipeline-sync',
                leadership: 'Executive pulse varannan vecka'
            },
            steps: {
                product: [
                    'Identifiera tre objekt med högst visningar men låg konvertering.',
                    'Skapa förbättrade mallar i editorn och lansera A/B-test.',
                    'Följ upp i Profitpanelen varje morgon.'
                ],
                sales: [
                    'Markera heta konton och schemalägg demos i Revenue Collaboration.',
                    'Synka kampanjcopy med pitch-generatorn för varje persona.',
                    'Stäng feedback-loop med produktteamet efter varje demo.'
                ],
                leadership: [
                    'Skapa realtidsdashboard över aktiveringar och delningar.',
                    'Schemalägg Executive Brief varje fredag.',
                    'Fatta beslut om resursallokering baserat på signalerna.'
                ]
            },
            blueprint: {
                product: {
                    title: 'Velocity sprint-plan',
                    steps: [
                        'Lista objekt med högst potential i Profitpanelen.',
                        'Använd pitch-labbet för att skriva ny copy till topp 2 objekt.',
                        'Schemalägg automatiska nudges efter varje delning.',
                        'Sätt dagliga check-ins och mät aktivering mot målet 35 %.'
                    ]
                },
                sales: {
                    title: 'Velocity revenue-protokoll',
                    steps: [
                        'Välj konton med signalscore >70 och skapa gemensamma deal rooms.',
                        'Generera personlig demo med pitch-generatorn.',
                        'Trigga multi-channel nudges vid varje nytt engagemang.',
                        'Sammanfatta resultat i en fredagspulse till ledningen.'
                    ]
                },
                leadership: {
                    title: 'Velocity executive-överblick',
                    steps: [
                        'Bygg ett kompakt ledningsdashboard med aktivering, ARR och boosts.',
                        'Definiera beslutspunkter för resursfördelning vecka 1 och 2.',
                        'Planera kommunikation till styrelsen baserat på sprintmålen.'
                    ]
                }
            }
        },
        expansion: {
            label: 'Expansion Orbit',
            baseLift: 36,
            perLevel: 6,
            titles: {
                product: 'Öka expansionen från befintliga kunder',
                sales: 'Skala uppgraderingar utan friktion',
                leadership: 'Visa ARR-tillväxt innan kvartalet är slut'
            },
            summary: {
                product: 'Kartlägg vilka features som driver expansion och automatisera nästa-bästa-åtgärd.',
                sales: 'Ge revenue-teamet färdiga uppgraderingskampanjer och signalstyrda cadencer.',
                leadership: 'Visualisera förväntad ARR-effekt och resursbehov i ett expansionscockpit.'
            },
            cadence: {
                product: '21-dagars releasecykel',
                sales: 'Tvåveckors expansionsloop',
                leadership: 'Månadsvis ARR-review'
            },
            steps: {
                product: [
                    'Segmentera användare baserat på funktionell adoption.',
                    'Bygg expansionskampanj via Profit Automations.',
                    'Kör experimentlogg för varje ny premiumfeature.'
                ],
                sales: [
                    'Identifiera konton med hög NPS men låg ARPU.',
                    'Planera uppgraderingssamtal med revenue playbooks.',
                    'Spåra utfall i revenue dashboards och automatisera uppföljning.'
                ],
                leadership: [
                    'Prognostisera ARR-effekten i Profitpanelen.',
                    'Allokera specialist-team till högpotentialsegment.',
                    'Rapportera expansionsutfall i månadsrapporten.'
                ]
            },
            blueprint: {
                product: {
                    title: 'Expansion Orbit-plan',
                    steps: [
                        'Identifiera expansionstriggers i PostHog och märk upp i appen.',
                        'Skapa automatiserade uppgraderingsflöden med Revenue Resonance.',
                        'Sätt mål på +20 % ARPU och följ upp veckovis.'
                    ]
                },
                sales: {
                    title: 'Expansion Orbit playbook',
                    steps: [
                        'Bygg sekvens för uppgraderingskampanj med tre kontaktytor.',
                        'Använd pitch-generatorn för att skapa ROI-brev till beslutsfattare.',
                        'Logga resultat och uppdatera pipeline-prognosen.'
                    ]
                },
                leadership: {
                    title: 'Expansion Orbit executive-plan',
                    steps: [
                        'Sätt gemensamt expansionsmål i Profitpanelen.',
                        'Schemalägg styrgruppsmöte varannan vecka.',
                        'Förbered rapporter för att visa ARPU-lyft och kundhälsa.'
                    ]
                }
            }
        },
        defense: {
            label: 'Defence Grid',
            baseLift: 28,
            perLevel: 5,
            titles: {
                product: 'Stabilisera retention innan större lansering',
                sales: 'Skydda pipeline mot churn och konkurrens',
                leadership: 'Få tidig varning på riskkonton'
            },
            summary: {
                product: 'Aktivera varningssignaler och uppdatera produktupplevelsen innan kunder lämnar.',
                sales: 'Ge säljteamet realtidsvarningar när beteendet pekar mot churn och agera proaktivt.',
                leadership: 'Få en gemensam kontrollpanel för risk, svarstid och retention.'
            },
            cadence: {
                product: 'Veckovisa risk-reviews',
                sales: '3-dagars reaktionscykel',
                leadership: 'Ledningsrapport varje måndag'
            },
            steps: {
                product: [
                    'Mappa riskpersonor och koppla till specifika delningar.',
                    'Inför feedbackformulär direkt i appen.',
                    'Gör hotfix-lista och åtgärda högsta risk inom 48 timmar.'
                ],
                sales: [
                    'Flagga konton med fallande engagemang och kontakta inom 24 timmar.',
                    'Använd partnercoaching för att förlänga kontrakt.',
                    'Dokumentera varje åtgärd i Revenue Collaboration.'
                ],
                leadership: [
                    'Samla risk, support och ekonomidata i ett riskkort.',
                    'Sätt policies för svarstid och eskalering.',
                    'Följ retention mot månadsmål och justera resurser.'
                ]
            },
            blueprint: {
                product: {
                    title: 'Defence Grid produktplan',
                    steps: [
                        'Bygg en riskdashboard över användarbeteenden.',
                        'Skapa nudge flows för konton med låg aktivitet.',
                        'Planera förbättringssprint för mest påverkade sektioner.'
                    ]
                },
                sales: {
                    title: 'Defence Grid kundplan',
                    steps: [
                        'Lista riskkonton och tilldela ägare.',
                        'Förbered retention-argument via pitch-generatorn.',
                        'Sätt upp trestegs åtgärdsplan och följ upp varje steg.'
                    ]
                },
                leadership: {
                    title: 'Defence Grid executive-brief',
                    steps: [
                        'Definiera risk KPI:er (t.ex. WAU drop, NPS).',
                        'Planera veckomöten med support, produkt och revenue.',
                        'Kommunicera status till styrelse och investerare.'
                    ]
                }
            }
        }
    };

    const consoleBoosters = {
        signals: {
            lift: 9,
            steps: {
                product: 'Markera hotspots i Signals och auto-tagga dem i listan.',
                sales: 'Push deals med signalscore >80 till säljsekvens.',
                leadership: 'Skicka signalrapport innan varje ledningsmöte.'
            },
            blueprint: 'Inför signalscore som fält i blueprinten och skapa veckovis review.'
        },
        automation: {
            lift: 7,
            steps: {
                product: 'Aktivera automatiserade nudges efter varje delning.',
                sales: 'Synka mail, sms och in-app i ett koordinerat flöde.',
                leadership: 'Visa automationseffekt i veckorapporten.'
            },
            blueprint: 'Lägg till automation-checklista med ansvariga och SLA.'
        },
        expansion: {
            lift: 8,
            steps: {
                product: 'Planera expansionskampanjer för kunder med hög aktivering.',
                sales: 'Fokusera på uppgraderingssignaler och skapa next-best-offer.',
                leadership: 'Koppla expansionsmål till kvartalsplanen.'
            },
            blueprint: 'Addera expansionsmål och rapportmall till blueprinten.'
        }
    };

    if (orchestrator) {
        const orchestratorLabels = {
            launch: 'Launch Surge',
            scale: 'Scale Armor',
            defend: 'Defence Halo'
        };

        const showOrchestratorStatus = (message) => {
            if (!orchestratorStatus) return;
            orchestratorStatus.textContent = message;
            if (orchestratorStatusTimeout) window.clearTimeout(orchestratorStatusTimeout);
            orchestratorStatusTimeout = window.setTimeout(() => {
                orchestratorStatus.textContent = '';
            }, 2600);
        };

        const buildActions = (baseActions, activeSignals) => {
            const actions = [...baseActions];
            activeSignals.forEach((signal) => {
                const action = orchestratorSignalData[signal]?.action;
                if (action && !actions.includes(action)) actions.push(action);
            });
            return actions;
        };

        const updateOrchestrator = () => {
            const scenario = orchestratorScenario?.value || 'launch';
            const regionKey = orchestratorRegion?.value || 'emea';
            const rhythmKey = orchestratorRhythm?.value || 'pulse';
            const intensity = Number(orchestratorIntensity?.value || 3);
            if (orchestratorLevel) orchestratorLevel.textContent = String(intensity);

            const profile = orchestratorProfiles[scenario] || orchestratorProfiles.launch;
            const regionProfile = orchestratorRegions[regionKey] || orchestratorRegions.emea;
            const rhythmProfile = orchestratorRhythms[rhythmKey] || orchestratorRhythms.pulse;

            const activeSignals = Array.from(orchestratorSignals)
                .filter((input) => input.checked)
                .map((input) => input.getAttribute('data-orchestrator-signal'))
                .filter(Boolean);

            const signalLift = activeSignals.reduce((total, key) => total + (orchestratorSignalData[key]?.lift || 0), 0);
            const intensityLift = (intensity - 3) * 20;
            const baseScore = profile.base + signalLift + intensityLift;
            const score = Math.max(
                120,
                Math.round(baseScore * regionProfile.multiplier * rhythmProfile.multiplier)
            );

            const windowBase = profile.window + regionProfile.window + rhythmProfile.window;
            const windowAdjustment = intensity >= 4 ? -1 : intensity <= 2 ? 1 : 0;
            const windowValue = Math.max(2, windowBase + windowAdjustment);

            const focusParts = activeSignals
                .map((key) => orchestratorSignalData[key]?.focus)
                .filter(Boolean);
            const focusText = focusParts.length ? focusParts.join(' + ') : profile.focus;

            const actions = buildActions(profile.actions, activeSignals);
            const effectText = profile.effect[regionKey];
            const tagText = `${orchestratorLabels[scenario]} · ${regionProfile.label}`;

            if (orchestratorTag) orchestratorTag.textContent = tagText;
            if (orchestratorTitle) orchestratorTitle.textContent = profile.title;
            if (orchestratorSummary) orchestratorSummary.textContent = profile.summary;
            if (orchestratorScore) orchestratorScore.textContent = String(score);
            if (orchestratorWindow) orchestratorWindow.textContent = `${windowValue} veckor`;
            if (orchestratorFocus) orchestratorFocus.textContent = focusText;
            if (orchestratorEffect) orchestratorEffect.textContent = effectText;

            if (orchestratorActions) {
                orchestratorActions.innerHTML = '';
                actions.forEach((action) => {
                    const li = document.createElement('li');
                    li.textContent = action;
                    orchestratorActions.appendChild(li);
                });
            }

            const payload = `${profile.title}\nDominansscore: ${score}\nFönster: ${windowValue} veckor\nFokus: ${focusText}\nNyckeldrag: ${actions.join(
                ' | '
            )}`;
            orchestratorCopy?.setAttribute('data-orchestrator-payload', payload);
            orchestratorApply?.setAttribute(
                'data-orchestrator-blueprint',
                JSON.stringify({
                    scenario,
                    region: regionKey,
                    rhythm: rhythmKey,
                    score,
                    window: windowValue,
                    focus: focusText,
                    actions,
                    effect: effectText,
                    cadence: rhythmProfile.cadence,
                    label: orchestratorLabels[scenario]
                })
            );
        };

        orchestratorScenario?.addEventListener('change', updateOrchestrator);
        orchestratorRegion?.addEventListener('change', updateOrchestrator);
        orchestratorRhythm?.addEventListener('change', updateOrchestrator);
        orchestratorIntensity?.addEventListener('input', updateOrchestrator);
        orchestratorSignals.forEach((input) => input.addEventListener('change', updateOrchestrator));

        orchestratorCopy?.addEventListener('click', () => {
            const payload = orchestratorCopy.getAttribute('data-orchestrator-payload');
            if (!payload) return;
            navigator.clipboard
                ?.writeText(payload)
                .then(() => showOrchestratorStatus('Blueprint kopierad.'))
                .catch(() => showOrchestratorStatus('Kunde inte kopiera – markera texten manuellt.'));
        });

        orchestratorApply?.addEventListener('click', () => {
            const raw = orchestratorApply.getAttribute('data-orchestrator-blueprint');
            if (!raw) return;
            try {
                const data = JSON.parse(raw);
                const regionProfile = orchestratorRegions[data.region] || orchestratorRegions.emea;
                const rhythmProfile = orchestratorRhythms[data.rhythm] || orchestratorRhythms.pulse;
                const lines = [
                    `Scenario: ${data.label}`,
                    `Region: ${regionProfile.label}`,
                    `Cadence: ${rhythmProfile.cadence}`,
                    `Dominansscore: ${data.score}`,
                    `Fönster: ${data.window} veckor`,
                    `Fokus: ${data.focus}`,
                    '',
                    'Nyckeldrag:'
                ];
                data.actions.forEach((action) => lines.push(`- ${action}`));
                if (data.effect) {
                    lines.push('', `Förväntad effekt: ${data.effect}`);
                }
                openEditor({
                    id: null,
                    title: `Blueprint · ${data.label}`,
                    content: lines.join('\n'),
                    visibility: 'private',
                    password: ''
                });
                showOrchestratorStatus('Blueprint laddad i editorn.');
            } catch (error) {
                showOrchestratorStatus('Kunde inte skapa blueprint.');
            }
        });

        updateOrchestrator();
    }

    if (reactor) {
        const showReactorStatus = (message) => {
            if (!reactorStatus) return;
            reactorStatus.textContent = message;
            if (reactorStatusTimeout) window.clearTimeout(reactorStatusTimeout);
            reactorStatusTimeout = window.setTimeout(() => {
                reactorStatus.textContent = '';
            }, 2600);
        };

        const updateReactor = () => {
            const outcomeKey = reactorOutcome?.value || 'activation';
            const outcome = reactorOutcomes[outcomeKey] || reactorOutcomes.activation;
            const modeButton = Array.from(reactorModeButtons).find((btn) => btn.classList.contains('is-active'));
            const modeKey = modeButton?.getAttribute('data-reactor-mode') || 'ignite';
            const mode = reactorModes[modeKey] || reactorModes.ignite;
            const span = Number(reactorSpan?.value || 5);
            if (reactorLevel) reactorLevel.textContent = String(span);

            const activeBoosters = Array.from(reactorBoosts)
                .filter((input) => input.checked)
                .map((input) => input.getAttribute('data-reactor-boost'))
                .filter(Boolean);

            const boosterLift = activeBoosters.reduce((total, key) => total + (reactorBoosters[key]?.lift || 0), 0);
            const score = Math.max(200, Math.round(outcome.base + mode.lift + span * 20 + boosterLift));
            const windowValue = Math.max(2, span + mode.window + (activeBoosters.length ? -1 : 0));

            const focusParts = [mode.focus || outcome.focus, outcome.focus]
                .concat(activeBoosters.map((key) => reactorBoosters[key]?.focus).filter(Boolean))
                .filter(Boolean);
            const focusText = Array.from(new Set(focusParts)).join(' · ') || outcome.focus;

            const summaryParts = [outcome.summary, mode.summary];
            if (activeBoosters.length) {
                const boosterLabels = activeBoosters.map((key) => reactorBoosters[key]?.label).filter(Boolean);
                summaryParts.push(`Boosters aktiverade: ${boosterLabels.join(', ')}.`);
            } else {
                summaryParts.push('Aktivera en booster för att förstärka effekten ytterligare.');
            }
            const summaryText = summaryParts.filter(Boolean).join(' ');

            const actions = [...new Set([
                ...outcome.actions,
                ...mode.actions,
                ...activeBoosters.map((key) => reactorBoosters[key]?.action)
            ])].filter(Boolean);

            if (reactorActions) {
                reactorActions.innerHTML = '';
                actions.forEach((action) => {
                    const li = document.createElement('li');
                    li.textContent = action;
                    reactorActions.appendChild(li);
                });
            }

            const effectParts = [outcome.effect, mode.effect]
                .concat(activeBoosters.map((key) => reactorBoosters[key]?.effect).filter(Boolean));
            effectParts.push(`Horisont: ${span} veckor. Fönster: ${windowValue} veckor.`);
            const effectText = effectParts.filter(Boolean).join(' ');

            const tagText = `${mode.label} · ${outcome.label}`;
            const titleText = mode.title ? mode.title(outcome.noun) : `Blueprint för ${outcome.label.toLowerCase()}`;

            if (reactorTag) reactorTag.textContent = tagText;
            if (reactorTitle) reactorTitle.textContent = titleText;
            if (reactorSummary) reactorSummary.textContent = summaryText;
            if (reactorScore) reactorScore.textContent = String(score);
            if (reactorWindow) reactorWindow.textContent = `${windowValue} veckor`;
            if (reactorFocus) reactorFocus.textContent = focusText;
            if (reactorEffect) reactorEffect.textContent = effectText;

            const payload = `${tagText}\nImpact score: ${score}\nFönster: ${windowValue} veckor\nFokus: ${focusText}\nÅtgärder:\n${actions
                .map((action) => `- ${action}`)
                .join('\n')}\n\nFörväntad effekt: ${effectText}`;
            reactorCopy?.setAttribute('data-reactor-payload', payload);
            reactorApply?.setAttribute(
                'data-reactor-blueprint',
                JSON.stringify({
                    mode: mode.label,
                    outcome: outcome.label,
                    score,
                    window: windowValue,
                    focus: focusText,
                    actions,
                    effect: effectText,
                    horizon: span
                })
            );
        };

        reactorOutcome?.addEventListener('change', updateReactor);
        reactorSpan?.addEventListener('input', updateReactor);
        reactorBoosts.forEach((input) => input.addEventListener('change', updateReactor));
        reactorModeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                reactorModeButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
                updateReactor();
            });
        });

        reactorCopy?.addEventListener('click', async () => {
            const payload = reactorCopy.getAttribute('data-reactor-payload');
            if (!payload) return;
            try {
                await navigator.clipboard.writeText(payload);
                showReactorStatus('Impact-brief kopierad ✅');
            } catch (error) {
                showReactorStatus('Kunde inte kopiera automatiskt');
            }
        });

        reactorApply?.addEventListener('click', () => {
            const raw = reactorApply.getAttribute('data-reactor-blueprint');
            if (!raw) return;
            try {
                const data = JSON.parse(raw);
                const lines = [
                    `Läge: ${data.mode}`,
                    `Utfall: ${data.outcome}`,
                    `Horisont: ${data.horizon} veckor`,
                    `Impact score: ${data.score}`,
                    `Fönster: ${data.window} veckor`,
                    `Fokus: ${data.focus}`,
                    '',
                    'Åtgärder:'
                ];
                data.actions.forEach((action) => lines.push(`- ${action}`));
                if (data.effect) {
                    lines.push('', `Förväntad effekt: ${data.effect}`);
                }
                openEditor({
                    id: null,
                    title: `Impact · ${data.mode}`,
                    content: lines.join('\n'),
                    visibility: 'private',
                    password: ''
                });
                showReactorStatus('Blueprint sparad i editorn.');
            } catch (error) {
                showReactorStatus('Kunde inte skapa blueprint.');
            }
        });

        updateReactor();
    }

    if (visionLab) {
        const visionPersonas = {
            founder: {
                label: 'Grundare',
                focus: 'Aktivering',
                summary: 'Grundare prioriterar momentum, tydliga KPI:er och proof att produkten redan levererar.',
                effect: 'Bygger investerarförtroende och triggar snabbare beslut.',
                accentColor: '#7C4DFF',
                code: 'GR'
            },
            revops: {
                label: 'Revenue Ops',
                focus: 'Pipeline precision',
                summary: 'Revenue Ops vill se hur varje modul kopplar till pipeline, SLA och automationsflöden.',
                effect: 'Ger en kristallklar koppling mellan design och intäktshälsa.',
                accentColor: '#22D3A5',
                code: 'RO'
            },
            customer: {
                label: 'Customer Success',
                focus: 'Retention loops',
                summary: 'Customer Success kräver tydliga journeys, signals och nästa bästa åtgärd.',
                effect: 'Skapar retentionloopar som håller churn under kontroll.',
                accentColor: '#38BDF8',
                code: 'CS'
            }
        };

        const visionChannels = {
            landing: {
                label: 'Landningssida',
                summary: 'Hero, proofwall och CTA-skena lyfter värdet och konverteringen på första besöket.',
                focus: 'Momentum storytelling',
                effect: 'Accelererar registreringar och demo-bokningar.',
                prefix: 'DS-LP',
                window: 3,
                modules: ['hero', 'proofwall', 'ctaBand']
            },
            product: {
                label: 'Produktdemo',
                summary: 'Demo frames, metrics overlay och playbook-stack visar exakt hur produkten levererar.',
                focus: 'Conversion clarity',
                effect: 'Kortar salescykeln och ökar win rate.',
                prefix: 'DS-PD',
                window: 4,
                modules: ['demo', 'metrics', 'playbook']
            },
            success: {
                label: 'Onboardingflöde',
                summary: 'Guidade journeys, success rituals och insight hub driver adoption efter signering.',
                focus: 'Adoption velocity',
                effect: 'Håller kunderna engagerade och minskar churn.',
                prefix: 'DS-OB',
                window: 5,
                modules: ['journey', 'success', 'insights']
            }
        };

        const visionModuleCatalog = {
            hero: {
                title: 'Hero blueprint',
                description: 'Gradienthero med North Star-kopia, KPI-taggar och primär CTA.'
            },
            proofwall: {
                title: 'Proofwall',
                description: 'Tre kundcase med resultat-taggar och branschikoner.'
            },
            ctaBand: {
                title: 'Dual CTA-skena',
                description: 'Två konverteringsalternativ med social proof och fallback-länk.'
            },
            metrics: {
                title: 'Live KPI-band',
                description: 'Visar DAU/WAU, ARR och konverteringsgrad i realtid.'
            },
            lab: {
                title: 'Profit Lab cards',
                description: 'Modulkort som visar automation, boosters och blueprint-export.'
            },
            demo: {
                title: 'Demo frames',
                description: 'Interaktiv produktdemo med highlight-lager och sekundära CTA.'
            },
            playbook: {
                title: 'Playbook stack',
                description: 'Lista över blueprint-steg kopplade till data och owners.'
            },
            journey: {
                title: 'Onboarding journey',
                description: 'Progresssteg med tydliga mål, owners och signal triggers.'
            },
            success: {
                title: 'Success rituals',
                description: 'Ritualschema som synkar kundteam, QBR och hälsoindikatorer.'
            },
            insights: {
                title: 'Insight hub',
                description: 'Feedbackloopar, NPS och signals som varnar för risk.'
            }
        };

        const visionModuleMap = {
            metrics: 'metrics',
            lab: 'lab',
            cta: 'ctaBand'
        };

        const showVisionStatus = (message) => {
            if (!visionStatus) return;
            visionStatus.textContent = message;
            if (visionStatusTimeout) window.clearTimeout(visionStatusTimeout);
            visionStatusTimeout = window.setTimeout(() => {
                visionStatus.textContent = '';
            }, 2600);
        };

        const renderVisionLab = () => {
            const persona = visionPersonas[visionState.persona] || visionPersonas.founder;
            const channel = visionChannels[visionState.channel] || visionChannels.landing;
            const cadence = visionState.cadence;
            const optionalKeys = Array.from(visionState.modules)
                .map((key) => visionModuleMap[key])
                .filter(Boolean);
            const moduleKeys = Array.from(new Set([...channel.modules, ...optionalKeys]));
            const moduleLabels = moduleKeys
                .map((key) => visionModuleCatalog[key]?.title)
                .filter(Boolean);

            const focusText = `${persona.focus} · ${channel.focus}`;
            const windowWeeks = Math.max(2, channel.window + cadence - 3);
            const blueprintId = `${channel.prefix}-${persona.code}-${String(windowWeeks).padStart(2, '0')}`;

            const summaryParts = [persona.summary, channel.summary];
            if (moduleLabels.length) {
                summaryParts.push(`Moduler: ${moduleLabels.join(', ')}.`);
            }
            summaryParts.push(`Intensitet ${cadence} säkerställer att blueprinten levereras i tid.`);
            const summaryText = summaryParts.filter(Boolean).join(' ');

            const effectParts = [persona.effect, channel.effect, `Sprintfönster: ${windowWeeks} veckor.`];
            const effectText = effectParts.filter(Boolean).join(' ');

            if (visionTag) visionTag.textContent = `${persona.label} · ${channel.label}`;
            if (visionTitle)
                visionTitle.textContent =
                    channel.prefix === 'DS-LP'
                        ? 'Momentum blueprint med plasma-hero'
                        : channel.prefix === 'DS-PD'
                        ? 'Demo blueprint med datadriven precision'
                        : 'Onboarding blueprint med retentionloops';
            if (visionSummary) visionSummary.textContent = summaryText;
            if (visionFocus) visionFocus.textContent = focusText;
            if (visionWindow) visionWindow.textContent = `${windowWeeks} veckor`;
            if (visionScore) visionScore.textContent = blueprintId;
            if (visionEffect) visionEffect.textContent = effectText;
            if (visionLevel) visionLevel.textContent = String(cadence);
            if (visionLab) visionLab.style.setProperty('--vision-accent', persona.accentColor);

            if (visionActions) {
                visionActions.innerHTML = '';
                moduleKeys.forEach((key) => {
                    const module = visionModuleCatalog[key];
                    if (!module) return;
                    const li = document.createElement('li');
                    li.textContent = `${module.title}: ${module.description}`;
                    visionActions.appendChild(li);
                });
            }

            visionCopy?.setAttribute(
                'data-vision-payload',
                `${blueprintId}: ${persona.label} · ${channel.label}\nFokus: ${focusText}\nSprintfönster: ${windowWeeks} veckor\nModuler: ${moduleLabels.join(', ')}`
            );

            visionApply?.setAttribute(
                'data-vision-blueprint',
                JSON.stringify({
                    blueprintId,
                    persona: persona.label,
                    channel: channel.label,
                    focus: focusText,
                    window: windowWeeks,
                    modules: moduleKeys
                })
            );
        };

        visionPersonaButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const key = button.getAttribute('data-vision-persona');
                if (!key) return;
                visionState.persona = key;
                visionPersonaButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
                renderVisionLab();
            });
        });

        visionChannel?.addEventListener('change', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLSelectElement)) return;
            visionState.channel = target.value;
            renderVisionLab();
        });

        visionCadence?.addEventListener('input', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) return;
            visionState.cadence = Number(target.value) || 3;
            if (visionLevel) visionLevel.textContent = String(visionState.cadence);
            renderVisionLab();
        });

        visionModuleInputs.forEach((input) => {
            input.addEventListener('change', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLInputElement)) return;
                const key = target.getAttribute('data-vision-module');
                if (!key) return;
                if (target.checked) {
                    visionState.modules.add(key);
                } else {
                    visionState.modules.delete(key);
                }
                renderVisionLab();
            });
        });

        visionCopy?.addEventListener('click', async () => {
            const payload = visionCopy.getAttribute('data-vision-payload');
            if (!payload) return;
            try {
                await navigator.clipboard.writeText(payload);
                showVisionStatus('Manifest kopierat ✅');
            } catch (error) {
                showVisionStatus('Kunde inte kopiera automatiskt');
            }
        });

        visionApply?.addEventListener('click', () => {
            const raw = visionApply.getAttribute('data-vision-blueprint');
            if (!raw) return;
            try {
                const data = JSON.parse(raw);
                const lines = [`Persona: ${data.persona}`, `Kanal: ${data.channel}`, `Fokus: ${data.focus}`, `Fönster: ${data.window} veckor`, '', 'Moduler:'];
                data.modules
                    .map((key) => visionModuleCatalog[key])
                    .filter(Boolean)
                    .forEach((module, index) => {
                        lines.push(`${index + 1}. ${module.title} – ${module.description}`);
                    });
                openEditor({
                    id: null,
                    title: `Vision · ${data.persona}`,
                    content: lines.join('\n'),
                    visibility: 'private',
                    password: ''
                });
                showVisionStatus('Vision blueprint laddad i editorn.');
            } catch (error) {
                showVisionStatus('Kunde inte skapa blueprint.');
            }
        });

        renderVisionLab();
    }

    if (dominanceConsole && window.computeDominanceProfile) {
        const dominanceData = window.DOMINANCE_DATA || { signals: {} };
        const computeDominanceProfile = window.computeDominanceProfile;

        const showDominanceStatus = (message) => {
            if (!dominanceStatus) return;
            dominanceStatus.textContent = message;
            if (dominanceStatusTimeout) window.clearTimeout(dominanceStatusTimeout);
            dominanceStatusTimeout = window.setTimeout(() => {
                dominanceStatus.textContent = '';
            }, 2600);
        };

        const updateDominanceConsole = () => {
            if (typeof computeDominanceProfile !== 'function') return;
            const profile = computeDominanceProfile({
                mode: dominanceState.scenario,
                focus: dominanceState.focus,
                level: dominanceState.tempo,
                signals: dominanceState.signals
            });
            if (!profile) return;

            const { scenario, focus, tempo } = profile;
            const competitorRow = profile.rows.find((row) => row.key === dominanceState.competitor) || profile.bestCompetitor;
            const localContext = { ...profile.context };

            if (competitorRow) {
                const competitorLabel = competitorRow.competitor?.label || competitorRow.key;
                const gap = competitorRow.competitor?.gaps?.[profile.focusKey] || localContext.gap;
                const competitorScore = Math.round(competitorRow.score);
                const delta = Math.round(localContext.ourScore - competitorScore);
                const safeDelta = Math.max(delta, 0);
                Object.assign(localContext, {
                    competitorLabel,
                    gap,
                    competitorScore,
                    delta,
                    safeDelta,
                    pipelineLift: Math.max(24, safeDelta + 28),
                    expansionLift: Math.max(18, safeDelta + 24),
                    retentionLift: Math.max(16, safeDelta + 20),
                    winRate: Math.min(97, 58 + safeDelta)
                });
            }

            if (dominanceLevel) dominanceLevel.textContent = tempo?.label || String(dominanceState.tempo);
            if (dominanceTag)
                dominanceTag.textContent = `${localContext.scenarioTag} · ${localContext.competitorLabel}`;
            if (dominanceTitle) dominanceTitle.textContent = formatDominanceValue(focus.title, localContext);
            if (dominanceSummary) dominanceSummary.textContent = formatDominanceValue(focus.summary, localContext);
            if (dominanceScore) dominanceScore.textContent = String(localContext.ourScore);
            if (dominanceDelta) {
                const deltaText = localContext.delta >= 0 ? `+${localContext.delta}` : String(localContext.delta);
                dominanceDelta.textContent = deltaText;
            }
            if (dominanceFocus) dominanceFocus.textContent = focus.focus;

            const edgeList = (focus.edges || [])
                .map((entry) => formatDominanceValue(entry, localContext))
                .filter(Boolean);
            if (dominanceEdges) {
                dominanceEdges.innerHTML = '';
                edgeList.forEach((entry) => {
                    const li = document.createElement('li');
                    li.textContent = entry;
                    dominanceEdges.appendChild(li);
                });
            }

            const actionList = (focus.plays || [])
                .map((entry) => formatDominanceValue(entry, localContext))
                .filter(Boolean);
            Array.from(dominanceState.signals)
                .map((key) => dominanceData.signals?.[key]?.action)
                .filter(Boolean)
                .forEach((action) => actionList.push(action));

            if (dominanceActions) {
                dominanceActions.innerHTML = '';
                actionList.forEach((entry) => {
                    const li = document.createElement('li');
                    li.textContent = entry;
                    dominanceActions.appendChild(li);
                });
            }

            const effectText = formatDominanceValue(focus.effect, localContext);
            if (dominanceEffect) dominanceEffect.textContent = effectText;

            const payloadLines = [
                `${scenario.label} · ${localContext.competitorLabel}`,
                `Score: ${localContext.ourScore} (Δ ${localContext.delta >= 0 ? `+${localContext.delta}` : localContext.delta})`,
                `Fokus: ${focus.focus}`,
                formatDominanceValue(focus.summary, localContext),
                '',
                'Bevisade övertag:',
                ...edgeList.map((entry) => `- ${entry}`),
                '',
                'Plan:',
                ...actionList.map((entry) => `- ${entry}`),
                '',
                effectText
            ];
            dominanceCopy?.setAttribute('data-dominance-payload', payloadLines.join('\n'));

            dominanceApply?.setAttribute(
                'data-dominance-blueprint',
                JSON.stringify({
                    scenario: scenario.label,
                    competitor: localContext.competitorLabel,
                    focus: focus.focus,
                    score: localContext.ourScore,
                    delta: localContext.delta,
                    edges: edgeList,
                    actions: actionList,
                    effect: effectText
                })
            );
        };

        dominanceCompetitorButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const key = button.getAttribute('data-dominance-competitor');
                if (!key) return;
                dominanceState.competitor = key;
                dominanceCompetitorButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
                updateDominanceConsole();
            });
        });

        dominanceScenario?.addEventListener('change', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLSelectElement)) return;
            dominanceState.scenario = target.value;
            updateDominanceConsole();
        });

        dominanceStage?.addEventListener('change', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLSelectElement)) return;
            dominanceState.focus = target.value;
            updateDominanceConsole();
        });

        dominanceTempo?.addEventListener('input', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) return;
            dominanceState.tempo = Number(target.value) || 4;
            updateDominanceConsole();
        });

        dominanceSignals.forEach((input) => {
            input.addEventListener('change', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLInputElement)) return;
                const key = target.getAttribute('data-dominance-signal');
                if (!key) return;
                if (target.checked) {
                    dominanceState.signals.add(key);
                } else {
                    dominanceState.signals.delete(key);
                }
                updateDominanceConsole();
            });
        });

        dominanceCopy?.addEventListener('click', async () => {
            const payload = dominanceCopy.getAttribute('data-dominance-payload');
            if (!payload) return;
            try {
                await navigator.clipboard.writeText(payload);
                showDominanceStatus('Dominansbrief kopierad ✅');
            } catch (error) {
                showDominanceStatus('Kunde inte kopiera automatiskt.');
            }
        });

        dominanceApply?.addEventListener('click', () => {
            const raw = dominanceApply.getAttribute('data-dominance-blueprint');
            if (!raw) return;
            try {
                const data = JSON.parse(raw);
                const deltaText = data.delta >= 0 ? `+${data.delta}` : String(data.delta);
                const lines = [
                    `Scenario: ${data.scenario}`,
                    `Konkurrent: ${data.competitor}`,
                    `Score: ${data.score} (Δ ${deltaText})`,
                    `Fokus: ${data.focus}`,
                    '',
                    'Bevisade övertag:'
                ];
                data.edges.forEach((edge) => lines.push(`- ${edge}`));
                lines.push('', 'Plan:');
                data.actions.forEach((action) => lines.push(`- ${action}`));
                if (data.effect) {
                    lines.push('', `Förväntad effekt: ${data.effect}`);
                }
                openEditor({
                    id: null,
                    title: `Dominans · ${data.competitor}`,
                    content: lines.join('\n'),
                    visibility: 'private',
                    password: ''
                });
                showDominanceStatus('Dominansbrief laddad i editorn.');
            } catch (error) {
                showDominanceStatus('Kunde inte skapa dominansbrief.');
            }
        });

        updateDominanceConsole();
    }

    const shareView = root.querySelector('[data-share-view]');
    const sharePasswordForm = shareView?.querySelector('[data-share-password]');
    const shareFeedback = shareView?.querySelector('[data-share-feedback]');
    const shareTitle = shareView?.querySelector('[data-share-title]');
    const shareOwner = shareView?.querySelector('[data-share-owner]');
    const shareContent = shareView?.querySelector('[data-share-content]');
    let sharePasswordHandler = null;

    const STORAGE_USER = 'ao_current_user';
    const STORAGE_ITEMS_PREFIX = 'ao_items_';
    const STORAGE_SHARES = 'ao_shares';

    const qs = new URLSearchParams(window.location.search);
    const shareIdFromUrl = qs.get('share');

    if (shareIdFromUrl) {
        renderShareView(shareIdFromUrl);
        return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
        showDashboard(currentUser);
    } else {
        showAuth();
    }

    const authForm = authPanel?.querySelector('[data-auth-form]');
    authForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(authForm);
        const name = (data.get('name') || '').toString().trim();
        const email = (data.get('email') || '').toString().trim().toLowerCase();
        if (!name || !email) return;
        const user = { name, email };
        localStorage.setItem(STORAGE_USER, JSON.stringify(user));
        showDashboard(user);
        authForm.reset();
    });

    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_USER);
        showAuth();
    });

    createEmptyBtn?.addEventListener('click', () => {
        openEditor({ id: null, title: '', content: '', visibility: 'private', password: '' });
    });

    createTemplateBtn?.addEventListener('click', () => {
        openEditor({
            id: null,
            title: 'Lanseringsplan',
            content: ['Målgrupp', 'Budskap', 'Kanaler', 'Milestones'].map((item) => `• ${item}`).join('\n'),
            visibility: 'private',
            password: ''
        });
    });

    cancelEditBtn?.addEventListener('click', () => {
        editor?.setAttribute('hidden', '');
        itemForm?.reset();
    });

    itemForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const user = getCurrentUser();
        if (!user) return;
        const data = new FormData(itemForm);
        const id = data.get('id') || generateId();
        const title = (data.get('title') || '').toString();
        const content = (data.get('content') || '').toString();
        const visibility = (data.get('visibility') || 'private').toString();
        const password = (data.get('password') || '').toString();
        const now = new Date().toISOString();
        const items = loadItems(user.email);
        const existingIndex = items.findIndex((item) => item.id === id);
        const itemPayload = { id, title, content, visibility, password, updatedAt: now, createdAt: now };
        if (existingIndex >= 0) {
            itemPayload.createdAt = items[existingIndex].createdAt;
            items[existingIndex] = itemPayload;
        } else {
            items.unshift(itemPayload);
        }
        saveItems(user.email, items);
        syncShareStore(user, itemPayload);
        renderDashboard(user);
        editor?.setAttribute('hidden', '');
        itemForm.reset();
    });

    itemForm?.querySelector('#item-visibility')?.addEventListener('change', (event) => {
        const value = event.target.value;
        const passwordLabel = itemForm.querySelector('[data-password-label]');
        const passwordInput = itemForm.querySelector('#item-password');
        if (value === 'password') {
            passwordLabel?.removeAttribute('hidden');
            passwordInput?.removeAttribute('hidden');
            passwordInput?.setAttribute('required', '');
        } else {
            passwordLabel?.setAttribute('hidden', '');
            passwordInput?.setAttribute('hidden', '');
            passwordInput?.removeAttribute('required');
            passwordInput.value = '';
        }
    });

    labForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        generateNarrative();
    });

    labRefreshBtn?.addEventListener('click', () => {
        surpriseFocus();
        generateNarrative();
    });

    labFields.forEach((field) => {
        field.addEventListener('change', () => {
            if (field instanceof HTMLInputElement && field.type === 'text') return;
            generateNarrative();
        });
    });

    initGrowthConsole();
    initApexConsole();
    initCapitalConsole();
    initSupremacyConsole();

    labCopyBtn?.addEventListener('click', async () => {
        const headline = labHeadline?.textContent?.trim();
        const message = labMessage?.textContent?.trim();
        const segment = labSegment?.textContent?.trim();
        if (!headline || !message) return;
        const payload = `${segment ? `${segment}\n` : ''}${headline}\n\n${message}`;
        try {
            await navigator.clipboard.writeText(payload);
            setLabStatus('Pitch kopierad ✅');
        } catch (error) {
            setLabStatus('Kunde inte kopiera automatiskt');
        }
    });

    generateNarrative();

    const segmentLabels = {
        product: 'Produktteam',
        sales: 'Säljledning',
        investor: 'Investorer'
    };

    const focusSuggestions = {
        product: ['onboarding', 'feature-adoption', 'experiment velocity', 'team alignment'],
        sales: ['pipeline visibility', 'deal acceleration', 'demo hits', 'win-back playbooks'],
        investor: ['ARR expansion', 'gross margin lyft', 'moat signaler', 'payback time']
    };

    const toneHeadlines = {
        bold: {
            product: (focus) => `Vi förvandlar ${focus} till lönsamt momentum på två sprintar`,
            sales: (focus) => `Vi låser upp ${focus} med ett styrt intäktsflöde`,
            investor: (focus) => `${focus} blir motorn bakom vår dubbla ARR`
        },
        calm: {
            product: (focus) => `Vi ger teamet trygg kontroll över ${focus}`,
            sales: (focus) => `Vi gör ${focus} förutsägbart med transparent data`,
            investor: (focus) => `Vi visar hur ${focus} levererar stabila kassaflöden`
        },
        analytical: {
            product: (focus) => `Vi bevisar hur ${focus} driver +32 % effektivitet`,
            sales: (focus) => `Vi mäter ${focus} ner till varje touchpoint`,
            investor: (focus) => `Vi kvantifierar ${focus} i en tydlig profitmodell`
        }
    };

    const toneMessages = {
        bold: {
            product: (focus) =>
                `Profitpanelen visualiserar experimenttakt, konvertering och storytelling så att hela teamet ser hur {focus} kopplar direkt till intäkt.`,
            sales: (focus) =>
                `Vi kombinerar delningsboostar och Stripe-data för att visa hur {focus} skapar fler stängda affärer varje vecka.`,
            investor: (focus) =>
                `Vår growth playbook knyter {focus} till återkommande intäkter och visar break-even på under tre kvartal.`
        },
        calm: {
            product: (focus) =>
                `Dashboarden skapar lugn genom att bryta ner {focus} i delmål, uppföljning och rekommenderade nästa steg.`,
            sales: (focus) =>
                `Teamet får en gemensam vy av {focus}, med notifieringar som gör att inget lead halkar efter.`,
            investor: (focus) =>
                `Vi delar framsteg i realtid så att ni tryggt kan följa hur {focus} bidrar till stabil marginal.`
        },
        analytical: {
            product: (focus) =>
                `Vi korskopplar {focus} med cohort-analys, retention och funneltakt för att identifiera vilka features som faktiskt driver resultat.`,
            sales: (focus) =>
                `Varje steg i säljresan loggas och jämförs så att {focus} optimeras med evidens.`,
            investor: (focus) =>
                `Vi presenterar {focus} som en modell med mätpunkter, antaganden och spårbar forecast.`
        }
    };

    function generateNarrative() {
        if (!narrativeLab) return;
        const toneValue = getFieldValue('tone') || 'bold';
        const segmentValue = getFieldValue('segment') || 'product';
        let focusValue = getFieldValue('focus');
        if (!focusValue) {
            focusValue = surpriseFocus(segmentValue);
        }
        focusValue = focusValue.trim();
        if (!focusValue) {
            focusValue = surpriseFocus(segmentValue);
        }
        const formattedFocus = focusValue.charAt(0).toUpperCase() + focusValue.slice(1);
        const safeFocus = escapeHtml(formattedFocus);
        const headlineTemplate = toneHeadlines[toneValue]?.[segmentValue];
        const messageTemplate = toneMessages[toneValue]?.[segmentValue];
        const label = segmentLabels[segmentValue] || 'Scenario';

        if (labSegment) {
            labSegment.textContent = label;
        }
        if (labHeadline && headlineTemplate) {
            labHeadline.textContent = headlineTemplate(formattedFocus);
        }
        if (labMessage && messageTemplate) {
            const rawMessage = messageTemplate(formattedFocus);
            const safeMessage = escapeHtml(rawMessage).replace('{focus}', `<span data-lab-focus>${safeFocus}</span>`);
            labMessage.innerHTML = safeMessage;
            labFocus = narrativeLab?.querySelector('[data-lab-focus]');
        }
        if (labFocus) {
            labFocus.textContent = formattedFocus;
        }
        setLabStatus('Pitch uppdaterad ✨');
    }

    function surpriseFocus(preferredSegment) {
        if (!narrativeLab) return '';
        const segmentValue = preferredSegment || getFieldValue('segment') || 'product';
        const pool = focusSuggestions[segmentValue] || focusSuggestions.product;
        const suggestion = randomElement(pool) || 'profit-loopar';
        const focusField = narrativeLab.querySelector('[data-lab-field="focus"]');
        if (focusField instanceof HTMLInputElement) {
            focusField.value = suggestion;
        }
        return suggestion;
    }

    function getFieldValue(name) {
        const field = narrativeLab?.querySelector(`[data-lab-field="${name}"]`);
        if (!field) return '';
        if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
            return field.value;
        }
        return '';
    }

    function setLabStatus(message) {
        if (!labStatus) return;
        labStatus.textContent = message;
        if (labStatusTimeout) {
            window.clearTimeout(labStatusTimeout);
        }
        labStatusTimeout = window.setTimeout(() => {
            if (labStatus) {
                labStatus.textContent = '';
            }
        }, 2600);
    }

    function randomElement(items) {
        if (!Array.isArray(items) || items.length === 0) {
            return '';
        }
        return items[Math.floor(Math.random() * items.length)];
    }

    function escapeHtml(value) {
        const safe = value || '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return safe.replace(/[&<>"']/g, (char) => map[char]);
    }

    function renderShareView(shareId) {
        if (!shareView) return;
        const shareStore = loadShareStore();
        const share = shareStore[shareId];
        shareView.hidden = false;
        authPanel?.setAttribute('hidden', '');
        dashboard?.setAttribute('hidden', '');
        if (!share) {
            shareTitle.textContent = 'Delning saknas';
            shareOwner.textContent = 'Okänd';
            shareContent.innerHTML = '<p>Den här delningen kunde inte hittas. Be ägaren skapa en ny länk.</p>';
            if (sharePasswordForm && sharePasswordHandler) {
                sharePasswordForm.removeEventListener('submit', sharePasswordHandler);
                sharePasswordHandler = null;
            }
            if (sharePasswordForm) {
                sharePasswordForm.hidden = true;
            }
            return;
        }
        shareTitle.textContent = share.title || 'Delning';
        shareOwner.textContent = share.ownerName || share.ownerEmail;
        const renderContent = () => {
            shareContent.innerHTML = '';
            share.content.split('\n').forEach((line) => {
                const trimmed = line.trim();
                if (!trimmed) return;
                const p = document.createElement('p');
                p.textContent = trimmed;
                shareContent.appendChild(p);
            });
            if (!shareContent.childElementCount) {
                const empty = document.createElement('p');
                empty.textContent = 'Inget innehåll ännu.';
                shareContent.appendChild(empty);
            }
        };
        if (share.visibility === 'password') {
            sharePasswordForm.hidden = false;
            shareFeedback.textContent = '';
            const passwordInput = sharePasswordForm.querySelector('#share-password');
            passwordInput.value = '';
            if (sharePasswordHandler) {
                sharePasswordForm.removeEventListener('submit', sharePasswordHandler);
            }
            sharePasswordHandler = (event) => {
                event.preventDefault();
                if (passwordInput.value === share.password) {
                    sharePasswordForm.hidden = true;
                    shareFeedback.textContent = '';
                    renderContent();
                } else {
                    shareFeedback.textContent = 'Fel lösenord, försök igen.';
                }
            };
            sharePasswordForm.addEventListener('submit', sharePasswordHandler);
        } else {
            if (sharePasswordForm && sharePasswordHandler) {
                sharePasswordForm.removeEventListener('submit', sharePasswordHandler);
                sharePasswordHandler = null;
            }
            sharePasswordForm.hidden = true;
            renderContent();
        }
    }

    function showAuth() {
        authPanel?.removeAttribute('hidden');
        dashboard?.setAttribute('hidden', '');
        editor?.setAttribute('hidden', '');
    }

    function showDashboard(user) {
        authPanel?.setAttribute('hidden', '');
        renderDashboard(user);
        dashboard?.removeAttribute('hidden');
    }

    function renderDashboard(user) {
        greeting.textContent = user.name || user.email;
        const items = loadItems(user.email);
        renderItems(items);
        const shares = renderShares(user) || [];
        updateGrowthMetrics({ user, items, shares });
    }

    function renderItems(items) {
        if (!itemList) return;
        itemList.innerHTML = '';
        if (!items.length) {
            const empty = document.createElement('li');
            empty.className = 'empty-state';
            empty.textContent = 'Inga objekt ännu. Skapa ditt första!';
            itemList.appendChild(empty);
            return;
        }
        items.forEach((item) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${item.title || 'Namnlöst'}</strong>
                    <p>${item.content.split('\n')[0] || ''}</p>
                </div>
                <div class="item-actions">
                    <button type="button" data-action="edit">Öppna</button>
                    <button type="button" data-action="share">Dela</button>
                </div>
            `;
            li.querySelector('[data-action="edit"]').addEventListener('click', () => openEditor(item));
            li.querySelector('[data-action="share"]').addEventListener('click', () => openShareOptions(item));
            itemList.appendChild(li);
        });
    }

    function renderShares(user) {
        if (!shareList) return [];
        const shareStore = loadShareStore();
        const entries = Object.values(shareStore).filter((share) => share.ownerEmail === user.email);
        shareList.innerHTML = '';
        if (!entries.length) {
            const empty = document.createElement('li');
            empty.className = 'empty-state';
            empty.textContent = 'Inga aktiva delningar än.';
            shareList.appendChild(empty);
            return entries;
        }
        entries.forEach((share) => {
            const link = `${window.location.origin}/app/?share=${share.id}`;
            const li = document.createElement('li');
            const views = Number(share.views || 0);
            const signups = Number(share.signups || 0);
            const conversion = views ? Math.round((signups / views) * 1000) / 10 : 0;
            li.innerHTML = `
                <div>
                    <strong>${share.title || 'Delning'}</strong>
                    <p>${share.visibility === 'password' ? 'Lösenordsskyddad' : share.visibility === 'public' ? 'Publik' : 'Länk'} · ${share.updatedAt ? new Date(share.updatedAt).toLocaleDateString('sv-SE') : ''}</p>
                    <p class="share-metrics">Visningar: <strong>${views}</strong> · Registreringar: <strong>${signups}</strong> · Konvertering: ${conversion}%</p>
                    <code>${link}</code>
                </div>
                <div class="item-actions item-actions--stack">
                    <button type="button" data-action="view">+ Visning</button>
                    <button type="button" data-action="convert">+ Registrering</button>
                    <button type="button" data-action="boost">Boost 7 dagar</button>
                    <button type="button" data-action="copy">Kopiera</button>
                    <button type="button" data-action="stop">Avsluta</button>
                </div>
            `;
            li.querySelector('[data-action="view"]').addEventListener('click', () => {
                incrementShareMetric(user, share.id, 'views');
            });
            li.querySelector('[data-action="convert"]').addEventListener('click', () => {
                incrementShareMetric(user, share.id, 'signups');
            });
            li.querySelector('[data-action="boost"]').addEventListener('click', () => {
                boostShare(user, share.id);
            });
            li.querySelector('[data-action="copy"]').addEventListener('click', () => {
                navigator.clipboard?.writeText(link);
                li.classList.add('is-copied');
                setTimeout(() => li.classList.remove('is-copied'), 800);
            });
            li.querySelector('[data-action="stop"]').addEventListener('click', () => {
                removeShare(share.id);
                renderDashboard(user);
            });
            shareList.appendChild(li);
        });
        return entries;
    }

    function openEditor(item) {
        if (!itemForm) return;
        editor?.removeAttribute('hidden');
        itemForm.querySelector('[name="id"]').value = item.id || '';
        itemForm.querySelector('[name="title"]').value = item.title || '';
        itemForm.querySelector('[name="content"]').value = item.content || '';
        itemForm.querySelector('[name="visibility"]').value = item.visibility || 'private';
        const visibilityEvent = new Event('change');
        itemForm.querySelector('#item-visibility').dispatchEvent(visibilityEvent);
        const passwordInput = itemForm.querySelector('[name="password"]');
        if (item.visibility === 'password') {
            passwordInput.value = item.password || '';
        } else {
            passwordInput.value = '';
        }
    }

    function openShareOptions(item) {
        openEditor(item);
    }

    function getCurrentUser() {
        const raw = localStorage.getItem(STORAGE_USER);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (error) {
            return null;
        }
    }

    function loadItems(email) {
        const raw = localStorage.getItem(`${STORAGE_ITEMS_PREFIX}${email}`);
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch (error) {
            return [];
        }
    }

    function saveItems(email, items) {
        localStorage.setItem(`${STORAGE_ITEMS_PREFIX}${email}`, JSON.stringify(items));
    }

    function loadShareStore() {
        const raw = localStorage.getItem(STORAGE_SHARES);
        if (!raw) return {};
        try {
            return JSON.parse(raw);
        } catch (error) {
            return {};
        }
    }

    function saveShareStore(store) {
        localStorage.setItem(STORAGE_SHARES, JSON.stringify(store));
    }

    function syncShareStore(user, item) {
        const store = loadShareStore();
        if (item.visibility === 'private') {
            delete store[item.id];
            saveShareStore(store);
            return;
        }
        const previous = store[item.id] || {};
        store[item.id] = {
            id: item.id,
            title: item.title,
            content: item.content,
            visibility: item.visibility,
            password: item.visibility === 'password' ? item.password : '',
            ownerEmail: user.email,
            ownerName: user.name,
            updatedAt: item.updatedAt,
            views: previous.views || 0,
            signups: previous.signups || 0,
            boostHistory: previous.boostHistory || []
        };
        saveShareStore(store);
    }

    function removeShare(id) {
        const store = loadShareStore();
        if (store[id]) {
            delete store[id];
            saveShareStore(store);
        }
    }

    function generateId() {
        if (window.crypto?.randomUUID) {
            return window.crypto.randomUUID();
        }
        return 'item-' + Math.random().toString(36).slice(2, 10);
    }

    function incrementShareMetric(user, shareId, metric) {
        const store = loadShareStore();
        const share = store[shareId];
        if (!share) return;
        share[metric] = Number(share[metric] || 0) + 1;
        if (metric === 'signups' && (!share.views || share.views < share.signups)) {
            share.views = share.signups;
        }
        share.updatedAt = new Date().toISOString();
        saveShareStore(store);
        renderDashboard(user);
    }

    function boostShare(user, shareId) {
        const store = loadShareStore();
        const share = store[shareId];
        if (!share) return;
        const timestamp = new Date().toISOString();
        share.views = Number(share.views || 0) + 5;
        share.boostHistory = Array.isArray(share.boostHistory) ? share.boostHistory : [];
        share.boostHistory.push(timestamp);
        share.updatedAt = timestamp;
        saveShareStore(store);
        renderDashboard(user);
    }

    function initGrowthConsole() {
        if (!growthConsole) return;

        Array.from(consoleProgramButtons).forEach((button) => {
            button.addEventListener('click', () => {
                const program = button.getAttribute('data-console-program') || 'velocity';
                consoleState.program = program;
                Array.from(consoleProgramButtons).forEach((btn) =>
                    btn.classList.toggle('is-active', btn === button)
                );
                renderGrowthConsole();
            });
        });

        consoleSegment?.addEventListener('change', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLSelectElement)) return;
            consoleState.segment = target.value;
            renderGrowthConsole();
        });

        consoleRange?.addEventListener('input', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) return;
            consoleState.intensity = Number(target.value) || 3;
            if (consoleLevel) consoleLevel.textContent = String(consoleState.intensity);
            renderGrowthConsole();
        });

        Array.from(consoleSwitches).forEach((input) => {
            input.addEventListener('change', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLInputElement)) return;
                const key = target.getAttribute('data-console-switch');
                if (!key) return;
                if (target.checked) {
                    consoleState.boosters.add(key);
                } else {
                    consoleState.boosters.delete(key);
                }
                renderGrowthConsole();
            });
        });

        consoleApply?.addEventListener('click', (event) => {
            event.preventDefault();
            applyConsoleBlueprint();
        });

        renderGrowthConsole();
    }

    function showApexStatus(message) {
        if (!apexStatus) return;
        apexStatus.textContent = message;
        if (apexStatusTimeout) {
            clearTimeout(apexStatusTimeout);
        }
        apexStatusTimeout = setTimeout(() => {
            apexStatus.textContent = '';
        }, 3200);
    }

    function initApexConsole() {
        if (!apexConsole) return;

        apexApply?.addEventListener('click', (event) => {
            event.preventDefault();
            const raw = apexApply.getAttribute('data-apex-blueprint');
            if (!raw) {
                showApexStatus('Välj boosters för att skapa en plan.');
                return;
            }

            const steps = raw
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean);

            if (!steps.length) {
                showApexStatus('Lägg till boosters för att generera blueprint.');
                return;
            }

            const title = apexTitleNode?.textContent?.trim() || 'Apex blueprint';
            const summary = apexSummaryNode?.textContent?.trim() || '';
            const score = apexScoreNode?.textContent?.trim() || '';
            const delta = apexDeltaNode?.textContent?.trim() || '';
            const focus = apexFocusNode?.textContent?.trim() || '';
            const windowValue = apexWindowNode?.textContent?.trim() || '';

            const lines = [
                `Score: ${score}`,
                `Δ vs rival: ${delta}`,
                `Fokus: ${focus}`,
                `Fönster: ${windowValue}`
            ];

            if (summary) {
                lines.push('', summary);
            }

            lines.push('', 'Åtgärder:');
            steps.forEach((step, index) => {
                lines.push(`${index + 1}. ${step}`);
            });

            openEditor({
                id: null,
                title,
                content: lines.join('\n'),
                visibility: 'private',
                password: ''
            });
            showApexStatus('Apex-plan laddad i editorn.');
        });
    }

    function showCapitalStatus(message) {
        if (!capitalStatus) return;
        capitalStatus.textContent = message;
        if (capitalStatusTimeout) {
            clearTimeout(capitalStatusTimeout);
        }
        capitalStatusTimeout = setTimeout(() => {
            capitalStatus.textContent = '';
        }, 3200);
    }

    function initCapitalConsole() {
        if (!capitalConsole) return;

        capitalApply?.addEventListener('click', (event) => {
            event.preventDefault();
            const generator = window.generateCapitalPlan;
            if (typeof generator !== 'function') {
                showCapitalStatus('Aktivera kontroller för att skapa blueprint.');
                return;
            }

            const stageSelect = capitalConsole.querySelector('[data-capital-stage]');
            const runwayInput = capitalConsole.querySelector('[data-capital-runway]');
            const growthInput = capitalConsole.querySelector('[data-capital-growth]');
            const metricInputs = capitalConsole.querySelectorAll('[data-capital-metric]');
            const signalInputs = capitalConsole.querySelectorAll('[data-capital-signal]');

            const state = {
                stage: stageSelect?.value || 'seed',
                runway: Number(runwayInput?.value || 0),
                growth: Number(growthInput?.value || 0),
                metrics: Array.from(metricInputs)
                    .filter((input) => input.checked)
                    .map((input) => input.value || input.getAttribute('data-capital-metric'))
                    .filter(Boolean),
                signals: Array.from(signalInputs)
                    .filter((input) => input.checked)
                    .map((input) => input.value || input.getAttribute('data-capital-signal'))
                    .filter(Boolean)
            };

            const plan = generator(state) || null;
            const blueprint = (capitalApply.getAttribute('data-capital-blueprint') || plan?.blueprint || '').trim();

            if (!blueprint) {
                showCapitalStatus('Justera boosters för att skapa blueprint.');
                return;
            }

            const steps = blueprint
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean);

            if (!steps.length) {
                showCapitalStatus('Lägg till boosters för att fylla blueprinten.');
                return;
            }

            const title = capitalConsole.querySelector('[data-capital-title]')?.textContent?.trim() ||
                'Capital readiness blueprint';
            const summary = plan?.summary || capitalConsole.querySelector('[data-capital-summary]')?.textContent?.trim() || '';
            const score = plan?.score || capitalConsole.querySelector('[data-capital-score]')?.textContent?.trim() || '';
            const delta = plan?.delta || capitalConsole.querySelector('[data-capital-delta]')?.textContent?.trim() || '';
            const valuation = plan?.valuation || capitalConsole.querySelector('[data-capital-valuation]')?.textContent?.trim() || '';
            const focusValues = (plan?.focus || []).filter(Boolean);

            const lines = [];
            if (score) lines.push(`Readiness-score: ${score}`);
            if (delta) lines.push(`Δ vs bas: ${delta}`);
            if (valuation) lines.push(`Värderingsfönster: ${valuation}`);

            if (focusValues.length) {
                lines.push('', 'Investerarfokus:');
                focusValues.forEach((value, index) => {
                    lines.push(`${index + 1}. ${value}`);
                });
            }

            if (summary) {
                lines.push('', summary);
            }

            lines.push('', 'Dealplan:');
            steps.forEach((step, index) => {
                lines.push(`${index + 1}. ${step}`);
            });

            openEditor({
                id: null,
                title,
                content: lines.join('\n'),
                visibility: 'private',
                password: ''
            });
            showCapitalStatus('Capital-plan laddad i editorn.');
        });
    }

    function showSupremacyStatus(message) {
        if (!supremacyStatus) return;
        supremacyStatus.textContent = message;
        if (supremacyStatusTimeout) {
            clearTimeout(supremacyStatusTimeout);
        }
        supremacyStatusTimeout = setTimeout(() => {
            supremacyStatus.textContent = '';
        }, 3200);
    }

    function initSupremacyConsole() {
        if (!supremacyConsole) return;

        supremacyApply?.addEventListener('click', (event) => {
            event.preventDefault();
            const raw = supremacyApply.getAttribute('data-supremacy-blueprint');
            if (!raw) {
                showSupremacyStatus('Aktivera boosters för att skapa blueprint.');
                return;
            }

            const steps = raw
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean);

            if (!steps.length) {
                showSupremacyStatus('Lägg till boosters och uppdatera planen.');
                return;
            }

            const title = supremacyTitleNode?.textContent?.trim() || 'Supremacy blueprint';
            const summary = supremacySummaryNode?.textContent?.trim() || '';
            const score = supremacyScoreNode?.textContent?.trim() || '';
            const delta = supremacyDeltaNode?.textContent?.trim() || '';
            const focus = supremacyFocusNode?.textContent?.trim() || '';
            const windowValue = supremacyWindowNode?.textContent?.trim() || '';
            const effect = supremacyEffectNode?.textContent?.trim() || '';

            const lines = [
                `Supremacy-index: ${score}`,
                `Δ vs rival: ${delta}`,
                `Edge: ${focus}`,
                `Fönster: ${windowValue}`
            ];

            if (summary) {
                lines.push('', summary);
            }

            lines.push('', 'Signaturdrag:');
            steps.forEach((step, index) => {
                lines.push(`${index + 1}. ${step}`);
            });

            if (effect) {
                lines.push('', `Effekt: ${effect}`);
            }

            openEditor({
                id: null,
                title,
                content: lines.join('\n'),
                visibility: 'private',
                password: ''
            });
            showSupremacyStatus('Supremacy-plan laddad i editorn.');
        });
    }

    function applyConsoleBlueprint() {
        if (!growthConsole) return;
        const program = consolePrograms[consoleState.program];
        if (!program) return;
        const segment = consoleState.segment;
        const blueprint = program.blueprint[segment];
        if (!blueprint) return;

        const boosterNotes = Array.from(consoleState.boosters)
            .map((key) => consoleBoosters[key]?.blueprint)
            .filter(Boolean);
        const steps = blueprint.steps.concat(boosterNotes);
        openEditor({
            id: null,
            title: blueprint.title,
            content: steps.map((step, index) => `${index + 1}. ${step}`).join('\n'),
            visibility: 'private',
            password: ''
        });

        if (consoleStatus) {
            consoleStatus.textContent = `${blueprint.title} laddad i editorn.`;
            if (consoleStatusTimeout) {
                clearTimeout(consoleStatusTimeout);
            }
            consoleStatusTimeout = setTimeout(() => {
                consoleStatus.textContent = '';
            }, 3200);
        }
    }

    function renderGrowthConsole() {
        if (!growthConsole) return;
        const program = consolePrograms[consoleState.program] || consolePrograms.velocity;
        const segment = consoleState.segment;
        const intensity = consoleState.intensity;
        const boosters = Array.from(consoleState.boosters);

        const baseBoost = program.baseLift + (intensity - 3) * program.perLevel;
        const boosterLift = boosters.reduce((total, key) => total + (consoleBoosters[key]?.lift || 0), 0);
        const totalBoost = Math.max(12, Math.round(baseBoost + boosterLift));
        const basePipeline = consoleMetrics.signups || Math.round((consoleMetrics.views || 0) * 0.12);
        const pipelineImpact = Math.max(20, basePipeline + Math.round(totalBoost * 4) + (consoleMetrics.boosts || 0) * 9);

        if (consoleTag) consoleTag.textContent = program.label;
        if (consoleTitle) consoleTitle.textContent = program.titles[segment] || program.titles.product;
        if (consoleSummary) consoleSummary.textContent = program.summary[segment] || program.summary.product;
        if (consoleBoost) consoleBoost.textContent = `+${totalBoost} %`;
        if (consoleImpact) consoleImpact.textContent = `+${pipelineImpact} nya registreringar`;
        if (consoleCadence) consoleCadence.textContent = program.cadence[segment] || program.cadence.product;
        if (consoleLevel) consoleLevel.textContent = String(intensity);

        if (consoleNext) {
            consoleNext.innerHTML = '';
            const baseSteps = program.steps[segment] || [];
            const boosterSteps = boosters
                .map((key) => consoleBoosters[key]?.steps?.[segment])
                .filter(Boolean);
            baseSteps.concat(boosterSteps).forEach((step) => {
                const li = document.createElement('li');
                li.textContent = step;
                consoleNext.appendChild(li);
            });
        }
    }

    function updateGrowthConsoleMetrics(metrics) {
        if (!growthConsole) return;
        consoleMetrics = {
            items: metrics.items,
            shares: metrics.shares,
            views: metrics.views,
            signups: metrics.signups,
            boosts: metrics.boosts,
            conversion: metrics.conversion
        };
        renderGrowthConsole();
    }

    function updateGrowthMetrics({ user, items, shares }) {
        if (!user) return;
        const totalItems = items.length;
        const activeShares = shares.length;
        const totalViews = shares.reduce((sum, share) => sum + Number(share.views || 0), 0);
        const totalSignups = shares.reduce((sum, share) => sum + Number(share.signups || 0), 0);
        const totalBoosts = shares.reduce((sum, share) => sum + (Array.isArray(share.boostHistory) ? share.boostHistory.length : 0), 0);
        const conversion = totalViews ? (totalSignups / totalViews) * 100 : 0;
        const annualValue = totalSignups * 149 * 12;
        const avgValue = activeShares ? annualValue / activeShares : 0;
        const latestShare = shares
            .filter((share) => share.updatedAt)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

        if (metricItems) metricItems.textContent = String(totalItems);
        if (metricShares) metricShares.textContent = String(activeShares);
        if (metricConversion) metricConversion.textContent = `${conversion.toFixed(1)}%`;
        if (metricBoosts) metricBoosts.textContent = String(totalBoosts);
        if (metricForecast) metricForecast.textContent = formatCurrency(annualValue);
        if (metricAvgValue) metricAvgValue.textContent = formatCurrency(avgValue);
        if (metricLastShare)
            metricLastShare.textContent = latestShare
                ? `Senast uppdaterad ${formatRelative(new Date(latestShare.updatedAt))}`
                : 'Inga delningar ännu';

        updateGrowthConsoleMetrics({
            items: totalItems,
            shares: activeShares,
            views: totalViews,
            signups: totalSignups,
            boosts: totalBoosts,
            conversion
        });
    }

    function formatCurrency(value) {
        if (!Number.isFinite(value)) return '0 kr';
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            maximumFractionDigits: 0
        }).format(Math.max(0, Math.round(value)));
    }

    function formatRelative(date) {
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
        const now = new Date();
        const diffMs = now - date;
        const diffMinutes = Math.round(diffMs / 60000);
        if (diffMinutes < 1) return 'just nu';
        if (diffMinutes < 60) return `för ${diffMinutes} min sedan`;
        const diffHours = Math.round(diffMinutes / 60);
        if (diffHours < 24) return `för ${diffHours} h sedan`;
        const diffDays = Math.round(diffHours / 24);
        if (diffDays < 7) return `för ${diffDays} dagar sedan`;
        return date.toLocaleDateString('sv-SE');
    }
})();
