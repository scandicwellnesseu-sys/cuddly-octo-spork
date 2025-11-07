const DOMINANCE_DATA = window.DOMINANCE_DATA || {
    tempo: {
        2: { label: 'Sprintläge', mod: -3 },
        3: { label: 'Driftläge', mod: 0 },
        4: { label: 'Hyperdrive', mod: 5 },
        5: { label: 'Dominans', mod: 9 },
        6: { label: 'Singularity', mod: 14 }
    },
    signals: {
        autopilot: {
            label: 'AI Autopilot',
            lift: 6,
            highlight: 'Autopilot playbooks',
            action: 'Rulla ut AI-drivna playbooks mot varje kontosegment.'
        },
        intel: {
            label: 'Edge Radar',
            lift: 5,
            highlight: 'Signals + marknadsradar',
            action: 'Förankra beslut i live-signaler och konkurrentradar.'
        },
        alliances: {
            label: 'Alliance Mesh',
            lift: 4,
            highlight: 'Partner raids',
            action: 'Mobilisera partnerkedjor för gemensamma kampanjer.'
        },
        success: {
            label: 'Success Surge',
            lift: 4,
            highlight: 'Retention loops',
            action: 'Bygg success-loopar som låser retention och expansion.'
        }
    },
    competitors: {
        atlas: {
            label: 'Atlas Cloud',
            gaps: {
                acquisition: 'manuella onboardingsteg',
                expansion: 'tunga projektplaner',
                retention: 'långsam adoptionscykel'
            },
            benchmarks: {
                acquisition: {
                    activation: '4 dagar (manuell onboarding)',
                    automation: 'Segmenterade handoffs',
                    ai: 'Promptbibliotek för copy',
                    revenue: '+19% pipeline-tillväxt',
                    score: { launch: 72, scale: 78, enterprise: 83 }
                },
                expansion: {
                    activation: '6 veckor till full utrullning',
                    automation: 'Partner sync via kalkylblad',
                    ai: 'Analystteam på deltid',
                    revenue: '+14% expansion ARR',
                    score: { launch: 70, scale: 76, enterprise: 82 }
                },
                retention: {
                    activation: 'QBR var 8:e vecka',
                    automation: 'Manuell risklogg',
                    ai: 'Ingen prediktiv modell',
                    revenue: '+9% nettoretention',
                    score: { launch: 68, scale: 74, enterprise: 80 }
                }
            }
        },
        nova: {
            label: 'Nova Stack',
            gaps: {
                acquisition: 'splittrad datasynk',
                expansion: 'saknar automatiserade prisexperiment',
                retention: 'ingen success-automation'
            },
            benchmarks: {
                acquisition: {
                    activation: '3,5 dagar (self-service med manuell uppsättning)',
                    automation: 'API-byggen kräver kod',
                    ai: 'Promptarbetsflöden',
                    revenue: '+16% pipeline-tillväxt',
                    score: { launch: 69, scale: 74, enterprise: 78 }
                },
                expansion: {
                    activation: '2 kvartal för tierade uppgraderingar',
                    automation: 'Upsell-kampanjer via e-post',
                    ai: 'AI-insikter i dashboards',
                    revenue: '+11% expansion ARR',
                    score: { launch: 67, scale: 72, enterprise: 76 }
                },
                retention: {
                    activation: 'Churnvarningar via CSV-export',
                    automation: 'Success-team i silos',
                    ai: 'Ingen health scoring',
                    revenue: '+7% nettoretention',
                    score: { launch: 65, scale: 70, enterprise: 75 }
                }
            }
        },
        zenith: {
            label: 'Zenith Labs',
            gaps: {
                acquisition: 'behov av rådgivningsteam',
                expansion: 'statiska playbooks',
                retention: 'support endast kontorstid'
            },
            benchmarks: {
                acquisition: {
                    activation: '5 dagar (konsultledd setup)',
                    automation: 'Workshops per kund',
                    ai: 'AI-deckar 1 gång/vecka',
                    revenue: '+17% pipeline-tillväxt',
                    score: { launch: 71, scale: 77, enterprise: 81 }
                },
                expansion: {
                    activation: '8 veckor till full adoption',
                    automation: 'Partner approvals manuellt',
                    ai: 'AI-insikter varannan vecka',
                    revenue: '+12% expansion ARR',
                    score: { launch: 69, scale: 75, enterprise: 80 }
                },
                retention: {
                    activation: 'Health score per kvartal',
                    automation: 'Success check-ins i kalkylblad',
                    ai: 'AI dashboards för ledning',
                    revenue: '+8% nettoretention',
                    score: { launch: 67, scale: 72, enterprise: 78 }
                }
            }
        }
    },
    scenarios: {
        launch: {
            label: 'Launch Velocity',
            tag: 'Startups',
            focuses: {
                acquisition: {
                    label: 'Förvärv',
                    focus: 'Top-of-funnel ignition',
                    baseScore: 96,
                    title: ({ competitorLabel, safeDelta }) =>
                        safeDelta > 0
                            ? `Ta ${safeDelta}% mer lanseringsmomentum än ${competitorLabel}`
                            : `Matcha ${competitorLabel} med hypersnabb lansering`,
                    summary: ({ tempoLabel, signalsList, competitorLabel, gap }) =>
                        `${tempoLabel} kombinerar ${signalsList} för att trycka ut aktivering på timmar. ${competitorLabel} fastnar i ${gap}, vilket öppnar hela funneln.`,
                    edges: [
                        ({ signalsLead }) => `${signalsLead} autopiloten guidar leads till aha utan handoff.`,
                        ({ gap, pipelineLift }) => `Neutraliserar ${gap} och ger +${pipelineLift}% pipeline.`,
                        ({ tempoLabel, focusName }) => `${tempoLabel} rytm håller teamen samlade kring ${focusName.toLowerCase()}.`
                    ],
                    metrics: {
                        activation: ({ tempoLabel }) => `${tempoLabel} aktivering på 1,5 dagar`,
                        automation: ({ signalsList }) => `Autopilot blueprint kopplad till ${signalsList}`,
                        ai: () => 'Prediktiv copy + ROI-simulering',
                        revenue: ({ pipelineLift }) => `+${pipelineLift}% pipeline-lyft`
                    },
                    plays: [
                        ({ competitorLabel }) => `Synka Profit Command Center mot ${competitorLabel}-konton.`,
                        ({ signalsLead }) => `Kicka igång ${signalsLead} för att trigga onboarding nudges.`,
                        ({ focusLabel }) => `Publicera dominansproof i Vision Studio för ${focusLabel.toLowerCase()}.`
                    ],
                    story: ({ scenarioLabel, focusLabel, moduleList, competitorLabel }) =>
                        `${scenarioLabel} blueprint för ${focusLabel.toLowerCase()} väver ihop ${moduleList} så ${competitorLabel} inte hinner svara.`,
                    effect: ({ winRate, pipelineLift }) => `Förväntad effekt: ${winRate}% win rate och +${pipelineLift}% pipeline.`
                },
                expansion: {
                    label: 'Expansion',
                    focus: 'Revenue loops',
                    baseScore: 94,
                    title: ({ competitorLabel, safeDelta }) =>
                        safeDelta > 0
                            ? `Skala expansion ${safeDelta}% snabbare än ${competitorLabel}`
                            : `Aktivera expansion mot ${competitorLabel} utan friktion`,
                    summary: ({ tempoLabel, signalsList, competitorLabel, gap }) =>
                        `${tempoLabel} väver ${signalsList} till uppgraderingsloopar. ${competitorLabel} fastnar i ${gap}, vilket ger dig expansionsförsprång.`,
                    edges: [
                        ({ pipelineLift }) => `Pipeline-data kopplas direkt till expansion för +${pipelineLift}% ARR.`,
                        ({ signalsLead }) => `${signalsLead} driver personaliserade uppgraderingsförslag.`,
                        ({ focusName }) => `${focusName} betyder att hela kundresan hänger ihop utan handoffs.`
                    ],
                    metrics: {
                        activation: () => 'Hyperdrive expansion på 10 dagar',
                        automation: ({ signalsList }) => `Intäktsloopar styrda av ${signalsList}`,
                        ai: () => 'AI-prissättning + playbook scoring',
                        revenue: ({ expansionLift }) => `+${expansionLift}% expansion ARR`
                    },
                    plays: [
                        ({ competitorLabel }) => `Kartlägg uppgraderingsgap mot ${competitorLabel} och fyll dem med autopilot.`,
                        ({ moduleList }) => `Planera framgångscase med ${moduleList}.`,
                        ({ focusLabel }) => `Exportera expansion blueprint till sales enablement för ${focusLabel.toLowerCase()}.`
                    ],
                    story: ({ scenarioLabel, focusLabel, moduleList }) =>
                        `${scenarioLabel} expansion blueprint paketerar ${moduleList} till återkommande upsell-cykler.`,
                    effect: ({ winRate, expansionLift }) => `Förväntad effekt: +${expansionLift}% expansion ARR och ${winRate}% uppgraderingsfrekvens.`
                },
                retention: {
                    label: 'Retention',
                    focus: 'Adoption shield',
                    baseScore: 92,
                    title: ({ competitorLabel, safeDelta }) =>
                        safeDelta > 0
                            ? `Bygg ett retention-sköld ${safeDelta}% starkare än ${competitorLabel}`
                            : `Matcha retentionen mot ${competitorLabel} med autopilot`,
                    summary: ({ tempoLabel, signalsList, competitorLabel, gap }) =>
                        `${tempoLabel} kombinerar ${signalsList} till proaktiva varningar. ${competitorLabel} fastnar i ${gap}, vilket gör att du behåller fler konton.`,
                    edges: [
                        ({ signalsLead }) => `${signalsLead} triggar success-teamet innan risk uppstår.`,
                        ({ retentionLift }) => `Retentionprogrammet säkrar +${retentionLift}% nettoretention.`,
                        ({ focusName }) => `${focusName} betyder att produkt, success och revenue delar samma vy.`
                    ],
                    metrics: {
                        activation: () => 'Riskvarningar i realtid',
                        automation: ({ signalsList }) => `Success-loopar byggda på ${signalsList}`,
                        ai: () => 'AI health scoring',
                        revenue: ({ retentionLift }) => `+${retentionLift}% nettoretention`
                    },
                    plays: [
                        ({ competitorLabel }) => `Övervaka ${competitorLabel}-kunder med Edge Radar för att sno expansionsytor.`,
                        ({ moduleList }) => `Automatisera win-back med ${moduleList}.`,
                        ({ focusLabel }) => `Rapportera retentionläge varje vecka med ${focusLabel.toLowerCase()} dashboards.`
                    ],
                    story: ({ scenarioLabel, focusLabel, moduleList }) =>
                        `${scenarioLabel} retention blueprint binder ${moduleList} till proaktiva kundresor.`,
                    effect: ({ retentionLift }) => `Förväntad effekt: +${retentionLift}% nettoretention och noll överraskningar i QBR.`
                }
            }
        },
        scale: {
            label: 'Scale Reactor',
            tag: 'Scaleups',
            focuses: {
                acquisition: {
                    label: 'Förvärv',
                    focus: 'Pipeline acceleration',
                    baseScore: 101,
                    title: ({ competitorLabel, safeDelta }) =>
                        safeDelta > 0
                            ? `Accelerera pipeline ${safeDelta}% snabbare än ${competitorLabel}`
                            : `Tryck pipeline i paritet med ${competitorLabel}`,
                    summary: ({ tempoLabel, signalsList, competitorLabel, gap }) =>
                        `${tempoLabel} kombinerar ${signalsList} så sälj och marketing delar samma seende. ${competitorLabel} fastnar i ${gap}.`,
                    edges: [
                        ({ pipelineLift }) => `Ger +${pipelineLift}% kvalificerade möjligheter i forecasten.`,
                        ({ signalsLead }) => `${signalsLead} delar signaler till varje podd på sekunder.`,
                        ({ focusName }) => `${focusName} gör att revenue-teamet kör på samma blueprint globalt.`
                    ],
                    metrics: {
                        activation: () => 'Gemensam pipelinevy i realtid',
                        automation: ({ signalsList }) => `Orkestrerad routing via ${signalsList}`,
                        ai: () => 'AI-prioritering av konton',
                        revenue: ({ pipelineLift }) => `+${pipelineLift}% pipeline-lyft`
                    },
                    plays: [
                        ({ moduleList }) => `Koppla Signals, Profit Command Center och ${moduleList} för full synk.`,
                        ({ competitorLabel }) => `Bygg kontrastkampanjer mot ${competitorLabel} med autopilot-copy.`,
                        ({ focusLabel }) => `Låt RevOps distribuera ${focusLabel.toLowerCase()} blueprint till alla regioner.`
                    ],
                    story: ({ scenarioLabel, focusLabel, moduleList }) =>
                        `${scenarioLabel} blueprint håller ${focusLabel.toLowerCase()} levande med ${moduleList}.`,
                    effect: ({ winRate, pipelineLift }) => `Förväntad effekt: ${winRate}% win rate och +${pipelineLift}% pipeline velocity.`
                },
                expansion: {
                    label: 'Expansion',
                    focus: 'Expansion harmonics',
                    baseScore: 105,
                    title: ({ competitorLabel, safeDelta }) =>
                        safeDelta > 0
                            ? `Dominera expansion ${safeDelta}% över ${competitorLabel}`
                            : `Synka expansionstakten med ${competitorLabel}`,
                    summary: ({ tempoLabel, signalsList, competitorLabel, gap }) =>
                        `${tempoLabel} väver ${signalsList} till gemensamma uppgraderingsplaner. ${competitorLabel} sitter fast i ${gap}.`,
                    edges: [
                        ({ expansionLift }) => `Ger +${expansionLift}% expansion ARR genom automatiserade boosters.`,
                        ({ signalsLead }) => `${signalsLead} ger sales realtids prompts i varje uppgradering.`,
                        ({ focusName }) => `${focusName} säkerställer att customer success och finance spelar samma spel.`
                    ],
                    metrics: {
                        activation: () => 'Expansionsinsikter på 72 timmar',
                        automation: ({ signalsList }) => `Automatiserade packeteringar byggda på ${signalsList}`,
                        ai: () => 'AI-prisoptimering',
                        revenue: ({ expansionLift }) => `+${expansionLift}% expansion ARR`
                    },
                    plays: [
                        ({ competitorLabel }) => `Identifiera high-fit konton och övertrumfa ${competitorLabel} med erbjudanden.`,
                        ({ moduleList }) => `Schemalägg expansion rituals med ${moduleList}.`,
                        ({ focusLabel }) => `Exportera ${focusLabel.toLowerCase()} playbook till varje segment.`
                    ],
                    story: ({ scenarioLabel, focusLabel, moduleList }) =>
                        `${scenarioLabel} expansion blueprint gör ${moduleList} till en koordinerad maskin.`,
                    effect: ({ winRate, expansionLift }) => `Förväntad effekt: +${expansionLift}% expansion ARR och ${winRate}% uppgraderingsfrekvens.`
                },
                retention: {
                    label: 'Retention',
                    focus: 'Loyalty firewall',
                    baseScore: 100,
                    title: ({ competitorLabel, safeDelta }) =>
                        safeDelta > 0
                            ? `Lyft retention ${safeDelta}% över ${competitorLabel}`
                            : `Skapa en retention-vägg mot ${competitorLabel}`,
                    summary: ({ tempoLabel, signalsList, competitorLabel, gap }) =>
                        `${tempoLabel} binder ${signalsList} till health scores i realtid. ${competitorLabel} fångas av ${gap}.`,
                    edges: [
                        ({ retentionLift }) => `Levererar +${retentionLift}% nettoretention med proaktiv styrning.`,
                        ({ signalsLead }) => `${signalsLead} skickar riskbriefs innan churn-symptom syns.`,
                        ({ focusName }) => `${focusName} betyder att account, product och success delar samma plan.`
                    ],
                    metrics: {
                        activation: () => 'Healthscore var 24:e timme',
                        automation: ({ signalsList }) => `Automatiska playbooks med ${signalsList}`,
                        ai: () => 'AI-riskprognoser',
                        revenue: ({ retentionLift }) => `+${retentionLift}% nettoretention`
                    },
                    plays: [
                        ({ competitorLabel }) => `Isolera risk där ${competitorLabel} brukar vinna och neutralisera med autopilot.`,
                        ({ moduleList }) => `Låt success-teamet köra ${moduleList} som standardritual.`,
                        ({ focusLabel }) => `Rapportera ${focusLabel.toLowerCase()} status i Profit Command Center varje vecka.`
                    ],
                    story: ({ scenarioLabel, focusLabel, moduleList }) =>
                        `${scenarioLabel} retention blueprint låser lojalitet med ${moduleList}.`,
                    effect: ({ retentionLift }) => `Förväntad effekt: +${retentionLift}% nettoretention och noll förlorade flaggskepp.`
                }
            }
        },
        enterprise: {
            label: 'Enterprise Vanguard',
            tag: 'Enterprise',
            focuses: {
                acquisition: {
                    label: 'Förvärv',
                    focus: 'Executive capture',
                    baseScore: 108,
                    title: ({ competitorLabel, safeDelta }) =>
                        safeDelta > 0
                            ? `Vinn enterprise-deals ${safeDelta}% snabbare än ${competitorLabel}`
                            : `Matcha enterprise-takten mot ${competitorLabel}`,
                    summary: ({ tempoLabel, signalsList, competitorLabel, gap }) =>
                        `${tempoLabel} orkestrerar ${signalsList} så executive buying-kommittéer får svar direkt. ${competitorLabel} fastnar i ${gap}.`,
                    edges: [
                        ({ pipelineLift }) => `Ger +${pipelineLift}% i executive pipeline trust.`,
                        ({ signalsLead }) => `${signalsLead} levererar skräddarsydda briefer före varje möte.`,
                        ({ focusName }) => `${focusName} betyder att hela styrgruppen ser samma sanningskälla.`
                    ],
                    metrics: {
                        activation: () => 'Executive readiness på 48 timmar',
                        automation: ({ signalsList }) => `Enterprise workflows byggda på ${signalsList}`,
                        ai: () => 'AI-briefs & beslutssimulering',
                        revenue: ({ pipelineLift }) => `+${pipelineLift}% enterprise pipeline`
                    },
                    plays: [
                        ({ competitorLabel }) => `Skapa executive war-room för att neutralisera ${competitorLabel}.`,
                        ({ moduleList }) => `Distribuera ${moduleList} till varje styrgruppsmöte.`,
                        ({ focusLabel }) => `Knyt ${focusLabel.toLowerCase()} blueprint till legal, finance och produkt.`
                    ],
                    story: ({ scenarioLabel, focusLabel, moduleList }) =>
                        `${scenarioLabel} blueprint för ${focusLabel.toLowerCase()} driver igenom konsensus med ${moduleList}.`,
                    effect: ({ winRate, pipelineLift }) => `Förväntad effekt: ${winRate}% win rate och +${pipelineLift}% enterprise pipeline.`
                },
                expansion: {
                    label: 'Expansion',
                    focus: 'Global renewal engine',
                    baseScore: 112,
                    title: ({ competitorLabel, safeDelta }) =>
                        safeDelta > 0
                            ? `Förnya globala avtal ${safeDelta}% effektivare än ${competitorLabel}`
                            : `Lås globala förnyelser i nivå med ${competitorLabel}`,
                    summary: ({ tempoLabel, signalsList, competitorLabel, gap }) =>
                        `${tempoLabel} förenar ${signalsList} för att låsa multiregionala förnyelser. ${competitorLabel} fastnar i ${gap}.`,
                    edges: [
                        ({ expansionLift }) => `Genererar +${expansionLift}% i globalt expansionsvärde.`,
                        ({ signalsLead }) => `${signalsLead} förbereder varje regionsteam med rätt narrativ.`,
                        ({ focusName }) => `${focusName} betyder att prissättning, legal och success delar samma script.`
                    ],
                    metrics: {
                        activation: () => 'Förnyelsekit på 7 dagar',
                        automation: ({ signalsList }) => `Globala workflows baserat på ${signalsList}`,
                        ai: () => 'AI-avtalsanalys',
                        revenue: ({ expansionLift }) => `+${expansionLift}% global expansion`
                    },
                    plays: [
                        ({ competitorLabel }) => `Konstruera moterbjudanden som gör ${competitorLabel} irrelevanta.`,
                        ({ moduleList }) => `Aktivera regionala squads med ${moduleList}.`,
                        ({ focusLabel }) => `Synka ${focusLabel.toLowerCase()} blueprint med CFO och CS-ledning.`
                    ],
                    story: ({ scenarioLabel, focusLabel, moduleList }) =>
                        `${scenarioLabel} expansion blueprint skalar ${moduleList} över alla regioner.`,
                    effect: ({ expansionLift, winRate }) => `Förväntad effekt: +${expansionLift}% expansion och ${winRate}% förnyelsegrad.`
                },
                retention: {
                    label: 'Retention',
                    focus: 'Continuity shield',
                    baseScore: 110,
                    title: ({ competitorLabel, safeDelta }) =>
                        safeDelta > 0
                            ? `Skydda enterprise-intäkter ${safeDelta}% bättre än ${competitorLabel}`
                            : `Spegla enterprise-retention mot ${competitorLabel}`,
                    summary: ({ tempoLabel, signalsList, competitorLabel, gap }) =>
                        `${tempoLabel} kopplar ${signalsList} till riskstyrning i realtid. ${competitorLabel} brottas med ${gap}.`,
                    edges: [
                        ({ retentionLift }) => `Säkrar +${retentionLift}% nettoretention på enterprise-nivå.`,
                        ({ signalsLead }) => `${signalsLead} triggar proaktiva ledningsrapporter.`,
                        ({ focusName }) => `${focusName} gör att kunderna aldrig känner friktion vid förändringar.`
                    ],
                    metrics: {
                        activation: () => 'Ledningsbriefs varje morgon',
                        automation: ({ signalsList }) => `Kontinuitetsplaner byggda på ${signalsList}`,
                        ai: () => 'AI-risk- & åtgärdskartor',
                        revenue: ({ retentionLift }) => `+${retentionLift}% nettoretention`
                    },
                    plays: [
                        ({ competitorLabel }) => `Mät varje förnyelse mot ${competitorLabel} och stäng luckorna med autopilot.`,
                        ({ moduleList }) => `Distribuera ${moduleList} till CSM-ledare globalt.`,
                        ({ focusLabel }) => `Skapa ledningsdokument för ${focusLabel.toLowerCase()} varje vecka.`
                    ],
                    story: ({ scenarioLabel, focusLabel, moduleList }) =>
                        `${scenarioLabel} retention blueprint håller enterprise-konton under konstant beskydd med ${moduleList}.`,
                    effect: ({ retentionLift }) => `Förväntad effekt: +${retentionLift}% nettoretention och total synlighet.`
                }
            }
        }
    }
};

window.DOMINANCE_DATA = DOMINANCE_DATA;

function formatDominanceValue(value, context) {
    if (typeof value === 'function') {
        return value(context);
    }
    return value ?? '';
}

function computeDominanceProfile({ mode, focus, level, signals }) {
    const data = DOMINANCE_DATA;
    const scenarios = Object.values(data.scenarios || {});
    const scenario = data.scenarios?.[mode] || scenarios[0];
    const focusKey = scenario?.focuses?.[focus]
        ? focus
        : Object.keys(scenario?.focuses || { acquisition: null })[0];
    const focusConfig = scenario?.focuses?.[focusKey];
    const tempoProfile = data.tempo?.[level] || data.tempo?.[3];
    const signalKeys = Array.from(signals || []).filter((key) => data.signals?.[key]);
    const signalBoost = signalKeys.reduce((sum, key) => sum + (data.signals?.[key]?.lift || 0), 0);
    const baseScore = (focusConfig?.baseScore || 0) + (tempoProfile?.mod || 0);
    const ourScore = baseScore + signalBoost;

    const competitorRows = Object.entries(data.competitors || {}).map(([key, competitor]) => {
        const bench = competitor?.benchmarks?.[focusKey];
        const scoreData = bench?.score;
        const competitorScore =
            typeof scoreData === 'number'
                ? scoreData
                : scoreData?.[mode] ?? scoreData?.launch ?? 0;
        return { key, competitor, bench, score: competitorScore };
    });

    competitorRows.sort((a, b) => b.score - a.score);
    const bestCompetitor = competitorRows[0] || null;
    const deltaValue = ourScore - (bestCompetitor?.score ?? 0);
    const safeDelta = Math.max(Math.round(deltaValue), 0);
    const pipelineLift = Math.max(24, safeDelta + 28);
    const expansionLift = Math.max(18, safeDelta + 24);
    const retentionLift = Math.max(16, safeDelta + 20);
    const winRate = Math.min(97, 58 + safeDelta);
    const signalsList = signalKeys.map((key) => data.signals?.[key]?.label).filter(Boolean);
    const moduleList = signalsList.length ? signalsList.join(' + ') : 'profitautopiloten';

    const context = {
        scenarioLabel: scenario?.label || 'Dominansläge',
        scenarioTag: scenario?.tag || 'Blueprint',
        focusLabel: focusConfig?.label || 'Fas',
        focusName: focusConfig?.focus || 'Fokus',
        tempoLabel: tempoProfile?.label || 'Driftläge',
        signalsList: signalsList.length ? signalsList.join(' + ') : 'profitautopiloten',
        signalsLead: signalsList[0] || 'profitautopiloten',
        competitorLabel: bestCompetitor?.competitor?.label || 'konkurrenten',
        gap: bestCompetitor?.competitor?.gaps?.[focusKey] || 'manuella processer',
        safeDelta,
        delta: Math.round(deltaValue),
        ourScore: Math.round(ourScore),
        competitorScore: Math.round(bestCompetitor?.score ?? 0),
        moduleList,
        pipelineLift,
        expansionLift,
        retentionLift,
        winRate
    };

    return {
        data,
        mode,
        focusKey,
        level,
        signals: signalKeys,
        scenario: scenario || { label: 'Dominansläge', focuses: {} },
        focus: focusConfig || {
            label: 'Fas',
            focus: 'Fokus',
            metrics: {},
            edges: [],
            plays: []
        },
        tempo: tempoProfile || { label: 'Driftläge', mod: 0 },
        rows: competitorRows,
        bestCompetitor,
        context
    };
}

window.computeDominanceProfile = computeDominanceProfile;

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('[data-site-header]');
    const nav = document.querySelector('[data-nav]');
    const navToggle = document.querySelector('[data-nav-toggle]');
    const currentYear = document.querySelectorAll('[data-current-year]');

    currentYear.forEach((node) => {
        node.textContent = new Date().getFullYear();
    });

    navToggle?.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        if (!expanded) {
            nav?.setAttribute('data-open', 'true');
        } else {
            nav?.removeAttribute('data-open');
        }
    });

    nav?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navToggle?.setAttribute('aria-expanded', 'false');
            nav?.removeAttribute('data-open');
        });
    });

    const onScroll = () => {
        if (!header) return;
        const offset = window.scrollY || document.documentElement.scrollTop;
        header.classList.toggle('shell-header--scrolled', offset > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    setupPricingToggle();
    setupBlogFilter();
    setupRoiCalculator();
    setupProfitLab();
    setupCommandCenter();
    setupQuantumLab();
    setupCapabilityMap();
    setupNeuroLab();
    setupIntelRadar();
    setupForgeLab();
    setupDesignStudio();
    setupDesignPreview();
    setupDominanceLab();
    setupBenchmarkLab();
    setupAtlasLab();
    setupApexLabs();
    setupSupremacyLab();
});

function setupPricingToggle() {
    const toggleGroup = document.querySelector('[data-pricing-toggle]');
    if (!toggleGroup) return;
    const toggleButton = toggleGroup.querySelector('[data-toggle]');
    const plans = document.querySelectorAll('[data-pricing-table] [data-plan]');
    let yearly = false;

    const updatePlans = () => {
        plans.forEach((plan) => {
            const monthly = Number(plan.getAttribute('data-monthly'));
            const yearlyValue = Number(plan.getAttribute('data-yearly'));
            const priceNode = plan.querySelector('[data-price]');
            const periodNode = plan.querySelector('[data-period]');
            if (!priceNode || !periodNode) return;
            const value = yearly ? yearlyValue : monthly;
            if (value === 0) {
                priceNode.textContent = '0 kr';
            } else {
                priceNode.textContent = `${value} kr`;
            }
            periodNode.textContent = yearly ? '/ år (debiteras årligen)' : '/ månad';
        });
    };

    toggleButton?.addEventListener('click', () => {
        yearly = !yearly;
        toggleButton.setAttribute('aria-checked', String(yearly));
        updatePlans();
    });

    updatePlans();
}

function setupBlogFilter() {
    const filter = document.querySelector('[data-blog-filter]');
    const list = document.querySelector('[data-blog-list]');
    if (!filter || !list) return;

    const input = filter.querySelector('input[type="search"]');
    const tagButtons = filter.querySelectorAll('[data-tag]');
    const articles = list.querySelectorAll('article');
    let activeTag = '';

    const applyFilter = () => {
        const query = (input?.value || '').toLowerCase();
        articles.forEach((article) => {
            const title = article.querySelector('h2')?.textContent?.toLowerCase() || '';
            const summary = article.querySelector('p')?.textContent?.toLowerCase() || '';
            const tags = (article.getAttribute('data-tags') || '').toLowerCase();
            const matchTag = !activeTag || tags.includes(activeTag);
            const matchText = !query || title.includes(query) || summary.includes(query);
            article.toggleAttribute('hidden', !(matchTag && matchText));
        });
    };

    input?.addEventListener('input', applyFilter);

    tagButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const tag = button.getAttribute('data-tag') || '';
            if (activeTag === tag) {
                activeTag = '';
            } else {
                activeTag = tag;
            }
            tagButtons.forEach((btn) => btn.toggleAttribute('data-active', btn === button && activeTag));
            applyFilter();
        });
    });

    applyFilter();
}

function setupRoiCalculator() {
    const calculator = document.querySelector('[data-roi-form]');
    if (!calculator) return;

    const teamInput = calculator.querySelector('[data-roi-input="team"]');
    const hoursInput = calculator.querySelector('[data-roi-input="hours"]');
    const valueInput = calculator.querySelector('[data-roi-input="value"]');
    const planSelect = calculator.querySelector('[data-roi-plan]');
    const outputSavings = calculator.querySelector('[data-roi-output="savings"]');
    const outputRoi = calculator.querySelector('[data-roi-output="roi"]');
    const outputBreakEven = calculator.querySelector('[data-roi-output="break-even"]');

    const formatCurrency = (value) =>
        new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            maximumFractionDigits: 0
        }).format(Math.round(value));

    const calculate = () => {
        const team = Number(teamInput?.value || 0);
        const hours = Number(hoursInput?.value || 0);
        const hourlyValue = Number(valueInput?.value || 0);
        const planCost = Number(planSelect?.value || 0);

        const annualValue = team * hours * hourlyValue * 52;
        const annualCost = planCost * 12;
        const savings = annualValue - annualCost;
        const roi = annualCost ? (savings / annualCost) * 100 : savings > 0 ? Infinity : 0;
        const breakEvenWeeks = hours > 0 && hourlyValue > 0 && planCost > 0
            ? Math.ceil(planCost / (hours * hourlyValue))
            : planCost > 0 && (hours <= 0 || hourlyValue <= 0)
            ? Infinity
            : 0;

        if (outputSavings) outputSavings.textContent = formatCurrency(savings);
        if (outputRoi)
            outputRoi.textContent = Number.isFinite(roi) ? `${roi.toFixed(1)}%` : '∞%';
        if (outputBreakEven)
            outputBreakEven.textContent = breakEvenWeeks === Infinity
                ? 'Ange tidssparande'
                : breakEvenWeeks > 0
                ? `${breakEvenWeeks} veckor`
                : 'Direkt';
    };

    [teamInput, hoursInput, valueInput, planSelect]
        .filter(Boolean)
        .forEach((input) => input.addEventListener('input', calculate));

    planSelect?.addEventListener('change', calculate);

    calculate();
}

function setupProfitLab() {
    const lab = document.querySelector('[data-profit-lab]');
    if (!lab) return;

    const outputTitle = lab.querySelector('[data-lab-title]');
    const outputBody = lab.querySelector('[data-lab-body]');
    const outputStats = lab.querySelector('[data-lab-stats]');
    const outputCta = lab.querySelector('[data-lab-cta]');
    const outputTag = lab.querySelector('[data-lab-tag]');
    const outputLabel = lab.querySelector('[data-lab-label]');
    const controls = lab.querySelectorAll('[data-lab-control]');
    const archetypeButtons = lab.querySelectorAll('[data-lab-archetype]');
    let activeArchetype = 'launch';
    let tone = 'visionary';
    let kpi = 'activation';
    let intensity = 3;

    const archetypes = {
        launch: {
            tag: 'Early Launch',
            label: 'Scenario',
            colors: ['#4338CA', '#6366F1'],
            stats: [
                ['Time-to-value', '3 dagar'],
                ['Experiment per kvartal', '8'],
                ['Nettoeffekt', '+72 % WAU']
            ]
        },
        scale: {
            tag: 'Scale Engine',
            label: 'Growth play',
            colors: ['#0F766E', '#10B981'],
            stats: [
                ['Expansion ARR', '+1,8 Mkr'],
                ['Crew-effektivitet', '84 %'],
                ['Experiment velocity', '11/månad']
            ]
        },
        premium: {
            tag: 'Premium Boutique',
            label: 'Experience',
            colors: ['#7C3AED', '#F59E0B'],
            stats: [
                ['LTV', '5× basplan'],
                ['Personliga demos', '3/vecka'],
                ['Rek. prisnivå', '1 499 kr']
            ]
        },
        community: {
            tag: 'Community Pulse',
            label: 'Network effect',
            colors: ['#DB2777', '#EC4899'],
            stats: [
                ['Ambassadörer', '120'],
                ['Retention 90 dagar', '87 %'],
                ['Forumkvalitet', '4,8/5']
            ]
        }
    };

    const toneTemplates = {
        visionary: {
            headline: {
                launch: 'Skapa er första profitloop på två sprintar',
                scale: 'Aktivera en skalbar intäktsmotor på veckor',
                premium: 'Levéra en signaturupplevelse som känns handgjord',
                community: 'Låt communityt bli er accelererande moat'
            },
            body: (selectedKpi, speedWord) =>
                `Vi landar en ${selectedKpi} på ${speedWord} genom att kombinera fokus med datadrivna experiment – utan att tappa produktens själ.`,
            actions: {
                activation: 'Lansera ett guidat första objekt och aktivera notiser inom 48 timmar.',
                retention: 'Rulla ut feedbackloopar i appen och dela resultat varannan sprint.',
                expansion: 'Bygg paketerade uppgraderingsbanor för ert toppsegment.'
            }
        },
        tactical: {
            headline: {
                launch: 'Orkestrera lanseringens viktigaste KPI:er i en vy',
                scale: 'Synka growth, sälj och produkt mot samma dashboard',
                premium: 'Öppna premiumintäkter via styrt onboardingprogram',
                community: 'Aktivera retention med medlemsinsikter i realtid'
            },
            body: (selectedKpi, speedWord) =>
                `Modulen justerar copy, mål och automationer för ${selectedKpi} när momentumet ligger på ${speedWord}. Allt sparas som templates.`,
            actions: {
                activation: 'Skapa tre experiment och schemalägg review i profitpanelen.',
                retention: 'Koppla cohort-analys till alerts för att förebygga churn.',
                expansion: 'Synka prissättning med Stripe-planer och PostHog events.'
            }
        },
        playful: {
            headline: {
                launch: 'Få kickoffen att kännas som en produktfestival',
                scale: 'Boost era funnels med gamified growth hacks',
                premium: 'Ge kunderna en concierge-känsla i varje steg',
                community: 'Gör communityt till scenen för nästa lansering'
            },
            body: (selectedKpi, speedWord) =>
                `Vi mixar mikroanimationer och smart copy för att få ${selectedKpi} att sticka ut – ${speedWord} betyder att varje interaktion känns belönande.`,
            actions: {
                activation: 'Lägg till confetti states i onboarding och kör live AMA.',
                retention: 'Starta lojalitetsstreaks och belöna varje återkomst.',
                expansion: 'Skapa överraskande uppgraderingsmoment direkt i appen.'
            }
        }
    };

    const intensityMap = {
        1: 'ett lugnt tempo',
        2: 'ett jämnt tempo',
        3: 'ett snabbt tempo',
        4: 'ett högt tempo',
        5: 'hypertempo'
    };

    const kpiLabels = {
        activation: 'aktivering',
        retention: 'retention',
        expansion: 'expansion'
    };

    const updateOutput = () => {
        const config = archetypes[activeArchetype];
        const template = toneTemplates[tone];
        if (!config || !template || !outputTitle || !outputBody || !outputCta || !outputStats || !outputTag)
            return;

        outputTitle.textContent = template.headline[activeArchetype];
        outputBody.textContent = template.body(kpiLabels[kpi], intensityMap[intensity] || intensityMap[3]);
        outputCta.textContent = `Rekommenderad åtgärd: ${template.actions[kpi]}`;
        outputTag.textContent = config.tag;
        if (outputLabel) {
            outputLabel.textContent = config.label;
        }
        if (outputStats) {
            outputStats.innerHTML = '';
            config.stats.forEach(([label, value]) => {
                const li = document.createElement('li');
                const span = document.createElement('span');
                span.textContent = label;
                const strong = document.createElement('strong');
                strong.textContent = value;
                li.append(span, strong);
                outputStats.appendChild(li);
            });
        }

        lab.style.setProperty('--lab-color-start', config.colors[0]);
        lab.style.setProperty('--lab-color-end', config.colors[1]);
    };

    controls.forEach((control) => {
        control.addEventListener('input', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
            if (target.dataset.labControl === 'tone') {
                tone = target.value;
            }
            if (target.dataset.labControl === 'kpi') {
                kpi = target.value;
            }
            if (target.dataset.labControl === 'intensity') {
                intensity = Number(target.value) || 3;
            }
            updateOutput();
        });
    });

    archetypeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const archetype = button.getAttribute('data-lab-archetype');
            if (!archetype) return;
            activeArchetype = archetype;
            archetypeButtons.forEach((btn) => {
                btn.toggleAttribute('data-active', btn === button);
            });
            updateOutput();
        });
    });

    const defaultButton = lab.querySelector('[data-lab-archetype="launch"]');
    defaultButton?.setAttribute('data-active', '');
    updateOutput();
}

function setupCommandCenter() {
    const center = document.querySelector('[data-command-center]');
    if (!center) return;

    const programButtons = center.querySelectorAll('[data-command-program]');
    const segmentSelect = center.querySelector('[data-command-segment]');
    const levelInput = center.querySelector('[data-command-level]');
    const addonInputs = center.querySelectorAll('[data-command-addon]');
    const runButton = center.querySelector('[data-command-run]');
    const tagNode = center.querySelector('[data-command-tag]');
    const titleNode = center.querySelector('[data-command-title]');
    const summaryNode = center.querySelector('[data-command-summary]');
    const boostNode = center.querySelector('[data-command-boost]');
    const windowNode = center.querySelector('[data-command-window]');
    const mapNode = center.querySelector('[data-command-map]');
    const playbookList = center.querySelector('[data-command-playbook]');

    const programs = {
        launch: {
            label: 'Launch Momentum',
            baseLift: 32,
            perLevel: 6,
            summary: {
                product: 'Produktteamet får ett 14-dagars sprintpaket som driver första aktivering via interaktiva guider.',
                sales: 'Kombinera produktledd demo med säljsekvenser för att skapa pipeline från första klick.',
                ops: 'Ledning får realtids dashboards kring onboarding, kapacitet och riskflaggor.'
            },
            window: {
                product: '14 dagar',
                sales: '21 dagar',
                ops: '30 dagar'
            },
            maps: {
                product: 'Produkt + beteende',
                sales: 'Pipeline + kampanj',
                ops: 'Ledning + risk'
            },
            playbook: {
                product: [
                    'Distribuera guidat onboarding-kit till nya konton.',
                    'Synka aktiveringsmål i Profitpanelen och följ upp dagligen.',
                    'Trigga retentionspuls efter 7 dagar med personaliserade tips.'
                ],
                sales: [
                    'Starta kombinerad demo med AI-genererade decks.',
                    'Aktivera CRM-nudges när leads når 60 % engagemang.',
                    'Schemalägg pipeline-synk med revenue-teamet varje fredag.'
                ],
                ops: [
                    'Skapa ledningsrapport i Profitpanelen varje morgon.',
                    'Knyt support- och driftflaggor till samma signalsystem.',
                    'Planera riskreview när aktivering sjunker under 30 %.'
                ]
            }
        },
        scale: {
            label: 'Revenue Amplifier',
            baseLift: 38,
            perLevel: 7,
            summary: {
                product: 'Utöka experimenttakten och låt AI välja vinnande varianter i realtid.',
                sales: 'Boost partner- och säljinsatser med account-baserade kampanjer.',
                ops: 'Skapa autonoma segmentrapporter som avslöjar dolda intäktsläckor.'
            },
            window: {
                product: '21 dagar',
                sales: '28 dagar',
                ops: '45 dagar'
            },
            maps: {
                product: 'Experiment + signal',
                sales: 'Dealflow + partner',
                ops: 'Finans + styrning'
            },
            playbook: {
                product: [
                    'Sätt upp tre samtidiga experiment i editorn och följ utfall i Profitpanelen.',
                    'Använd AI-labbets storytelling för att skapa release-notiser.',
                    'Driv expansionsmål genom retentionspuls mot lojala konton.'
                ],
                sales: [
                    'Koppla GA4 audiences till personaliserade demo-boards.',
                    'Bjud in partnerteam till gemensamma deal rooms med klara mål.',
                    'Automatisera uppföljningar baserat på PostHog-signaler.'
                ],
                ops: [
                    'Synka Stripe-data till Profitpanelen för att jämföra mot prognos.',
                    'Skapa varningsregler för churn-risk i PostHog och Slack.',
                    'Planera kvartalsvisa review-dagar med ledningen.'
                ]
            }
        },
        enterprise: {
            label: 'Enterprise Signal Mesh',
            baseLift: 44,
            perLevel: 8,
            summary: {
                product: 'Kombinera modulära arbetsytor med compliance och rollstyrning.',
                sales: 'Skala globala kampanjer med lokaliserade playbooks och styrrapporter.',
                ops: 'Centralisera risk-, säkerhets- och intäktsdata i en enda operationsvy.'
            },
            window: {
                product: '30 dagar',
                sales: '35 dagar',
                ops: '60 dagar'
            },
            maps: {
                product: 'Produkt + compliance',
                sales: 'Enterprise + region',
                ops: 'Risk + finans'
            },
            playbook: {
                product: [
                    'Aktivera avancerad åtkomstkontroll för varje modul.',
                    'Planera globala release-checklistor i Profitpanelen.',
                    'Integrera feedback-loopar direkt in i roadmapen.'
                ],
                sales: [
                    'Skapa regionala co-selling squads med partnerportalen.',
                    'Koppla större deals till kontraktsspårning och säkerhetsreview.',
                    'Automatisera executive-summary till varje styrgruppsmöte.'
                ],
                ops: [
                    'Övervaka SLA och risk i en gemensam dashboard.',
                    'Sätt upp multi-team godkännandeflöden för förändringar.',
                    'Simulera kassaflöde kontra pipeline varje vecka.'
                ]
            }
        }
    };

    const addonData = {
        ai: { lift: 10, focus: 'AI-insikter' },
        partner: { lift: 8, focus: 'Partner-collab' },
        retention: { lift: 6, focus: 'Retention pulse' }
    };

    let activeProgram = 'launch';

    programButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeProgram = button.getAttribute('data-command-program') || 'launch';
            programButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
            updateOutput();
        });
    });

    segmentSelect?.addEventListener('change', updateOutput);
    levelInput?.addEventListener('input', updateOutput);
    addonInputs.forEach((input) => input.addEventListener('change', updateOutput));
    runButton?.addEventListener('click', () => {
        runButton.classList.add('is-pulsed');
        updateOutput(true);
        setTimeout(() => runButton.classList.remove('is-pulsed'), 480);
    });

    function updateOutput(applyVariance = false) {
        const program = programs[activeProgram] || programs.launch;
        const segment = segmentSelect?.value || 'product';
        const level = Number(levelInput?.value || 3);
        const activeAddons = Array.from(addonInputs)
            .filter((input) => input.checked)
            .map((input) => input.getAttribute('data-command-addon'));

        const addonLift = activeAddons.reduce((total, key) => total + (addonData[key]?.lift || 0), 0);
        const variance = applyVariance ? Math.round(Math.random() * 4) : 0;
        const boost = Math.max(15, program.baseLift + (level - 3) * program.perLevel + addonLift + variance);
        const focusMap = [program.maps[segment]]
            .concat(
                activeAddons
                    .map((key) => addonData[key]?.focus)
                    .filter(Boolean)
            )
            .join(' + ');

        if (tagNode) tagNode.textContent = program.label;
        if (titleNode)
            titleNode.textContent =
                program.label === 'Launch Momentum'
                    ? 'Profitpod som konverterar var tredje besökare'
                    : program.label === 'Revenue Amplifier'
                    ? 'Träff säker expansionskurva med varje sprint'
                    : 'Enterprise mesh som fångar varje signal';
        if (summaryNode) summaryNode.textContent = program.summary[segment];
        if (boostNode) boostNode.textContent = `+${boost} %`;
        if (windowNode) windowNode.textContent = program.window[segment];
        if (mapNode) mapNode.textContent = focusMap;

        if (playbookList) {
            playbookList.innerHTML = '';
            const actions = program.playbook[segment] || [];
            actions.forEach((action) => {
                const li = document.createElement('li');
                li.textContent = action;
                playbookList.appendChild(li);
            });
        }
    }

    updateOutput();
}

function setupQuantumLab() {
    const lab = document.querySelector('[data-quantum-lab]');
    if (!lab) return;

    const trackButtons = lab.querySelectorAll('[data-quantum-track]');
    const sourceSelect = lab.querySelector('[data-quantum-source]');
    const horizonRange = lab.querySelector('[data-quantum-horizon]');
    const horizonLevel = lab.querySelector('[data-quantum-level]');
    const boosterInputs = lab.querySelectorAll('[data-quantum-switch]');
    const tagNode = lab.querySelector('[data-quantum-tag]');
    const titleNode = lab.querySelector('[data-quantum-title]');
    const summaryNode = lab.querySelector('[data-quantum-summary]');
    const scoreNode = lab.querySelector('[data-quantum-score]');
    const windowNode = lab.querySelector('[data-quantum-window]');
    const focusNode = lab.querySelector('[data-quantum-focus]');
    const actionsList = lab.querySelector('[data-quantum-actions]');
    const effectNode = lab.querySelector('[data-quantum-effect]');
    const copyButton = lab.querySelector('[data-quantum-copy]');
    const statusNode = lab.querySelector('[data-quantum-status]');

    let activeTrack = lab.querySelector('[data-quantum-track].is-active')?.getAttribute('data-quantum-track') || 'ignition';
    let statusTimeout = null;

    const tracks = {
        ignition: {
            label: 'Ignition Wave',
            baseScore: 320,
            focus: 'Activation surge',
            title: (window) => `Tryck ut nya playbooks i ${window} veckors hyperloop`,
            summary:
                'Ignition Wave fångar tidiga produkt- och marknadssignaler för att skapa en aggressiv första våg av konverteringar.',
            actions: [
                'Prioritera MVP-spår i Profit Command Center.',
                'Planera experimentkickoff varje vecka tillsammans med produkt och growth.'
            ],
            effect: 'Skapa en explosiv första våg av registreringar.'
        },
        dominion: {
            label: 'Dominion Mesh',
            baseScore: 344,
            focus: 'Moat expansion',
            title: () => 'Ta total dominans i varje kanal med en synkad signalmesh',
            summary:
                'Dominion Mesh väver samman multi-market offensiv, partnerkedjor och prisstyrning i en koordinerad storm.',
            actions: [
                'Mappa multi-segment taktik i Edge Radar.',
                'Deploy partner boosters för kritiska konton i varje region.'
            ],
            effect: 'Etablera en bestående moat och vinn fler enterprise-lägen.'
        },
        harvest: {
            label: 'Harvest Loop',
            baseScore: 300,
            focus: 'Revenue compounding',
            title: () => 'Förvandla hela kundresan till ett återkommande kassaflöde',
            summary:
                'Harvest Loop pressar ut maximal livstidsintäkt genom smart prissättning, expansionssignaler och success-synk.',
            actions: [
                'Synka uppgraderingscykler med Revenue Resonance.',
                'Automatisera retention nudges efter varje vunnen affär.'
            ],
            effect: 'Lås in marginal och skapa löpande expansionstillfällen.'
        }
    };

    const sources = {
        signals: {
            label: 'Signals + Product',
            lift: 28,
            focus: 'Signal sync',
            summary: 'Signals + Product ger realtidsfeedback på vad som triggar aktivering och retention.',
            action: 'Synka Signals och produktdata i samma scoreboard.',
            effect: 'Ökar precisionen i aktiveringsinsikter.',
            window: 0
        },
        revenue: {
            label: 'Revenue + CRM',
            lift: 32,
            focus: 'Pipeline clarity',
            summary: 'Revenue + CRM knyter intäktsdata till varje experiment så att payback syns direkt.',
            action: 'Knyt CRM och intäktsrapporter till Profit Command Center.',
            effect: 'Ger tydlig payback-prognos och pipelineförutsägelse.',
            window: -1
        },
        intel: {
            label: 'Competitive Intel',
            lift: 26,
            focus: 'Edge radar',
            summary: 'Competitive Intel injicerar konkurrentinsikter i varje spelplan för att blocka motdrag.',
            action: 'Infoga Edge Radar-insikter i varje pitch- och prisuppdatering.',
            effect: 'Neutraliserar konkurrentdrag innan de träffar marknaden.',
            window: 1
        }
    };

    const boosters = {
        copy: {
            label: 'AI copy deployment',
            lift: 18,
            focus: 'Story amplification',
            action: 'Auto-publicera AI-copy i pitch-labbet och delade demos.',
            effect: 'Förstärker konvertering genom hypersnabbt budskap.'
        },
        pricing: {
            label: 'Dynamic pricing sync',
            lift: 16,
            focus: 'Dynamic pricing',
            action: 'Trimma prissättning i realtid baserat på signaler.',
            effect: 'Höjer marginalen med adaptiv prissättning.'
        },
        success: {
            label: 'Customer success surge',
            lift: 14,
            focus: 'Retention loops',
            action: 'Planera success storm-program parallellt med kampanjer.',
            effect: 'Reducerar churn genom proaktiv kundsuccé.'
        },
        alliances: {
            label: 'Alliance catalysts',
            lift: 12,
            focus: 'Partner mesh',
            action: 'Aktivera partner mesh för att öppna nya kanaler.',
            effect: 'Skapar extern hävstång och snabbare expansion.'
        }
    };

    const showStatus = (message) => {
        if (!statusNode) return;
        statusNode.textContent = message;
        if (statusTimeout) window.clearTimeout(statusTimeout);
        statusTimeout = window.setTimeout(() => {
            statusNode.textContent = '';
        }, 2600);
    };

    const update = () => {
        const track = tracks[activeTrack] || tracks.ignition;
        const sourceKey = sourceSelect?.value || 'signals';
        const source = sources[sourceKey] || sources.signals;
        const horizon = Number(horizonRange?.value || 6);
        if (horizonLevel) horizonLevel.textContent = String(horizon);

        const activeBoosters = Array.from(boosterInputs)
            .filter((input) => input.checked)
            .map((input) => input.getAttribute('data-quantum-switch'))
            .filter(Boolean);

        const boosterLift = activeBoosters.reduce((total, key) => total + (boosters[key]?.lift || 0), 0);
        const score = Math.max(180, Math.round(track.baseScore + source.lift + horizon * 12 + boosterLift));
        const windowValue = Math.max(2, horizon + (source.window || 0));

        const focusParts = [track.focus, source.focus]
            .concat(activeBoosters.map((key) => boosters[key]?.focus).filter(Boolean))
            .filter(Boolean);
        const focusText = focusParts.join(' · ') || track.focus;

        const summaryParts = [track.summary, source.summary];
        if (activeBoosters.length) {
            const boosterLabels = activeBoosters
                .map((key) => boosters[key]?.label)
                .filter(Boolean);
            summaryParts.push(`Boosters aktiverade: ${boosterLabels.join(', ')}.`);
        } else {
            summaryParts.push('Låt autopiloten köra basprogrammet tills fler boosters kopplas på.');
        }
        const summaryText = summaryParts.filter(Boolean).join(' ');

        const actions = [...new Set([
            ...track.actions,
            source.action,
            ...activeBoosters.map((key) => boosters[key]?.action)
        ])].filter(Boolean);

        if (actionsList) {
            actionsList.innerHTML = '';
            actions.forEach((action) => {
                const li = document.createElement('li');
                li.textContent = action;
                actionsList.appendChild(li);
            });
        }

        const effectParts = [track.effect, source.effect]
            .concat(activeBoosters.map((key) => boosters[key]?.effect).filter(Boolean));
        effectParts.push(`Prognosfönster: ${windowValue} veckor.`);
        const effectText = effectParts.filter(Boolean).join(' ');

        const tagText = `${track.label} · ${source.label}`;
        const titleText = typeof track.title === 'function' ? track.title(windowValue) : track.title;

        if (tagNode) tagNode.textContent = tagText;
        if (titleNode) titleNode.textContent = titleText;
        if (summaryNode) summaryNode.textContent = summaryText;
        if (scoreNode) scoreNode.textContent = String(score);
        if (windowNode) windowNode.textContent = `${windowValue} veckor`;
        if (focusNode) focusNode.textContent = focusText;
        if (effectNode) effectNode.textContent = effectText;

        const payload = `${tagText}\nQuantum score: ${score}\nFönster: ${windowValue} veckor\nFokus: ${focusText}\nÅtgärder:\n${actions
            .map((action) => `- ${action}`)
            .join('\n')}\n\nEffekt: ${effectText}`;
        copyButton?.setAttribute('data-quantum-payload', payload);
    };

    trackButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const trackKey = button.getAttribute('data-quantum-track');
            if (!trackKey) return;
            activeTrack = trackKey;
            trackButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
            update();
        });
    });

    sourceSelect?.addEventListener('change', update);
    horizonRange?.addEventListener('input', update);
    boosterInputs.forEach((input) => input.addEventListener('change', update));

    copyButton?.addEventListener('click', async () => {
        const payload = copyButton.getAttribute('data-quantum-payload');
        if (!payload) return;
        try {
            await navigator.clipboard.writeText(payload);
            showStatus('Autoplan kopierad ✅');
        } catch (error) {
            showStatus('Kunde inte kopiera automatiskt');
        }
    });

    update();
}

function setupCapabilityMap() {
    const map = document.querySelector('[data-capability-map]');
    if (!map) return;

    const presetButtons = map.querySelectorAll('[data-matrix-preset]');
    const addonInputs = map.querySelectorAll('[data-matrix-addon]');
    const levelInput = map.querySelector('[data-matrix-level]');
    const badgeNode = map.querySelector('[data-matrix-badge]');
    const titleNode = map.querySelector('[data-matrix-title]');
    const summaryNode = map.querySelector('[data-matrix-summary]');
    const scoreNode = map.querySelector('[data-matrix-score]');
    const windowNode = map.querySelector('[data-matrix-window]');
    const focusNode = map.querySelector('[data-matrix-focus]');
    const actionsList = map.querySelector('[data-matrix-actions]');

    const presets = {
        founder: {
            label: 'Founder Velocity',
            title: 'Lansera en hyperskarp produktresa på 30 dagar',
            summary:
                'Ett laserfokuserat paket med Activation Burst och Revenue Resonance som bygger momentum utan stort team.',
            baseScore: 42,
            perLevel: 5,
            window: 30,
            windowShift: 4,
            focus: 'Aktivering & expansion',
            actions: [
                'Lansera adaptiv onboarding i tre steg.',
                'Synka revenue dashboards med Stripe.',
                'Planera expansionstriggers efter 21 dagar.'
            ]
        },
        scaleup: {
            label: 'ScaleUp Compounder',
            title: 'Multiplicera ARR genom parallella experiment',
            summary:
                'Aktivera flera experimentströmmar som kopplar produkt, marknad och revenue till en gemensam rytm.',
            baseScore: 48,
            perLevel: 6,
            window: 45,
            windowShift: 6,
            focus: 'Experiment & expansion',
            actions: [
                'Köra tre samtidiga experiment med gemensam kontrollgrupp.',
                'Bygga partnerkanaler i Revenue Ops-modulen.',
                'Trimma retentionspuls mot premiumkonton.'
            ]
        },
        enterprise: {
            label: 'Enterprise Nexus',
            title: 'Synka globala team med ett enda control plane',
            summary:
                'Knyt ihop compliance, sälj och produkt i en kontrollerad leverans som håller enterprise-kunder engagerade.',
            baseScore: 55,
            perLevel: 5,
            window: 60,
            windowShift: 5,
            focus: 'Compliance & expansion',
            actions: [
                'Skapa gemensam styrtavla för regionala lanseringar.',
                'Automatisera rapportering till ledning och styrelse.',
                'Aktivera riskmonitorering på varje delning.'
            ]
        }
    };

    const addons = {
        ai: {
            score: 8,
            focus: 'AI-intelligens',
            action: 'Träna AI-copy mot nya personas och auto-uppdatera mallar.'
        },
        revops: {
            score: 10,
            focus: 'RevOps synk',
            action: 'Automatisera MRR- och pipeline-jämförelser varje vecka.'
        },
        community: {
            score: 6,
            focus: 'Communitykraft',
            action: 'Starta referensprogram direkt i delningsflödet.'
        }
    };

    let activePreset = 'founder';

    presetButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activePreset = button.getAttribute('data-matrix-preset') || 'founder';
            presetButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
            updateOutput();
        });
    });

    addonInputs.forEach((input) => input.addEventListener('change', updateOutput));
    levelInput?.addEventListener('input', updateOutput);

    function updateOutput() {
        const preset = presets[activePreset] || presets.founder;
        const level = Number(levelInput?.value || 3);
        const activeAddons = Array.from(addonInputs)
            .filter((input) => input.checked)
            .map((input) => input.getAttribute('data-matrix-addon'));
        const bonus = activeAddons.reduce((total, key) => total + (addons[key]?.score || 0), 0);
        const score = Math.max(20, Math.round(preset.baseScore + (level - 3) * preset.perLevel + bonus));
        const window = Math.max(14, Math.round(preset.window - (level - 3) * preset.windowShift));
        const focusParts = [preset.focus]
            .concat(activeAddons.map((key) => addons[key]?.focus).filter(Boolean));
        const actions = preset.actions.concat(
            activeAddons.map((key) => addons[key]?.action).filter(Boolean)
        );

        if (badgeNode) badgeNode.textContent = preset.label;
        if (titleNode) titleNode.textContent = preset.title;
        if (summaryNode) summaryNode.textContent = preset.summary;
        if (scoreNode) scoreNode.textContent = `+${score} %`;
        if (windowNode) windowNode.textContent = `${window} dagar`;
        if (focusNode) focusNode.textContent = focusParts.join(' · ');

        if (actionsList) {
            actionsList.innerHTML = '';
            actions.forEach((action) => {
                const li = document.createElement('li');
                li.textContent = action;
                actionsList.appendChild(li);
            });
        }
    }

    updateOutput();
}

function setupNeuroLab() {
    const lab = document.querySelector('[data-neuro-lab]');
    if (!lab) return;

    const segmentInput = lab.querySelector('[data-neuro-segment]');
    const postureInput = lab.querySelector('[data-neuro-posture]');
    const ambitionInput = lab.querySelector('[data-neuro-ambition]');
    const levelNode = lab.querySelector('[data-neuro-level]');
    const boosterInputs = lab.querySelectorAll('[data-neuro-switch]');
    const tagNode = lab.querySelector('[data-neuro-tag]');
    const titleNode = lab.querySelector('[data-neuro-title]');
    const summaryNode = lab.querySelector('[data-neuro-summary]');
    const scoreNode = lab.querySelector('[data-neuro-score]');
    const windowNode = lab.querySelector('[data-neuro-window]');
    const focusNode = lab.querySelector('[data-neuro-focus]');
    const stackList = lab.querySelector('[data-neuro-stack]');
    const reportNode = lab.querySelector('[data-neuro-report]');
    const copyBtn = lab.querySelector('[data-neuro-copy]');
    const statusNode = lab.querySelector('[data-neuro-status]');

    const segmentLabels = {
        product: 'Produktledda lanseringar',
        sales: 'Säljdriven expansion',
        enterprise: 'Enterprise dominans'
    };

    const postureLabels = {
        launch: 'Lansera nytt',
        accelerate: 'Accelerera adoption',
        dominate: 'Totalt övertag'
    };

    const blueprint = {
        product: {
            base: 182,
            titles: {
                launch: 'Accelerera aktivering på 30 dagar',
                accelerate: 'Hyperloopa adoptionen mot 10k WAU',
                dominate: 'Äg kategorin med ständig innovationspuls'
            },
            summaries: {
                launch:
                    'Synka produkt- och marknadsteamets signaler för att trigga micro-demo flows och tidiga betalningar.',
                accelerate:
                    'Använd progressiv onboarding och expansion nudges för att driva adoption och sekundära köp.',
                dominate:
                    'Koppla alla touchpoints till en realtidsmotor som låser in kundbasen och blockerar konkurrenter.'
            },
            windows: {
                launch: '6 veckor',
                accelerate: '5 veckor',
                dominate: '4 veckor'
            },
            stacks: [
                'Signals + Nudges orkestrerade i realtid',
                'Delade KPI canvas för produkt & revenue',
                'Auto-export till investerardashboard'
            ]
        },
        sales: {
            base: 196,
            titles: {
                launch: 'Skapa en oemotståndlig pipelinevåg',
                accelerate: 'Fördubbla win-rate med intelligent timing',
                dominate: 'Bygg en oslagbar säljdominans'
            },
            summaries: {
                launch:
                    'Rigga revenue collaboration rooms och låt AI pitch-labb generera personaliserade öppningar.',
                accelerate:
                    'Automatisera uppföljning och kombinerade kanaler så varje nudge känns skräddarsydd.',
                dominate:
                    'Samkör partner co-selling med värmeindex för att låsa avtal innan konkurrenterna får chans.'
            },
            windows: {
                launch: '5 veckor',
                accelerate: '4 veckor',
                dominate: '3 veckor'
            },
            stacks: [
                'Revenue Collaboration med deal rooms',
                'Signalscore i varje CRM-stage',
                'Pitch generator för varje persona'
            ]
        },
        enterprise: {
            base: 208,
            titles: {
                launch: 'Bränn in ett enterprise-avtryck direkt',
                accelerate: 'Skala governance utan att bromsa farten',
                dominate: 'Säkra kategoriägarskap globalt'
            },
            summaries: {
                launch:
                    'Deploya compliance-kit, multi-team dashboards och lösenordsskyddade delningar för första vågen.',
                accelerate:
                    'Använd signalspejare och dynamisk prissättning för att låsa in flerårsavtal snabbare.',
                dominate:
                    'Förvandla kontot till ett kontrolltorn med AI-varningar och investerarklart beslutsunderlag.'
            },
            windows: {
                launch: '8 veckor',
                accelerate: '6 veckor',
                dominate: '5 veckor'
            },
            stacks: [
                'Compliance + Security overlays',
                'Executive Control Center dashboards',
                'Edge API för kundunika integrationer'
            ]
        }
    };

    const postureMultiplier = {
        launch: 1,
        accelerate: 1.14,
        dominate: 1.28
    };

    const boosterData = {
        predict: {
            lift: 34,
            focus: 'Predictive lift',
            stack: 'Signal fusion hub för beteendeprognoser'
        },
        partner: {
            lift: 22,
            focus: 'Deal swarm',
            stack: 'Partner co-selling workspace med revenue split'
        },
        field: {
            lift: 26,
            focus: 'Field intel loops',
            stack: 'Fältbotar som matar tillbaka kundsignaler'
        },
        pricing: {
            lift: 24,
            focus: 'Dynamic ARPU spikes',
            stack: 'Självoptimerande prissättning + offermotor'
        }
    };

    let statusTimeout = null;

    const updateLab = () => {
        const segment = segmentInput?.value || 'product';
        const posture = postureInput?.value || 'launch';
        const ambition = Number(ambitionInput?.value || 3);
        if (levelNode) levelNode.textContent = String(ambition);
        const baseConfig = blueprint[segment];
        if (!baseConfig) return;

        const activeBoosters = Array.from(boosterInputs)
            .filter((input) => input.checked)
            .map((input) => input.getAttribute('data-neuro-switch'))
            .filter(Boolean);

        const boosterLift = activeBoosters.reduce((total, key) => total + (boosterData[key]?.lift || 0), 0);
        const ambitionLift = (ambition - 3) * 18;
        const baseScore = baseConfig.base + ambitionLift + boosterLift;
        const finalScore = Math.round(baseScore * (postureMultiplier[posture] || 1));

        const focusPieces = activeBoosters
            .map((key) => boosterData[key]?.focus)
            .filter(Boolean);
        const focusText = focusPieces.length
            ? focusPieces.join(' + ')
            : posture === 'accelerate'
            ? 'Adoption compounding'
            : posture === 'dominate'
            ? 'Marknadsblockering'
            : 'Activation surge';

        const stacks = [...baseConfig.stacks];
        activeBoosters.forEach((key) => {
            const addition = boosterData[key]?.stack;
            if (addition && !stacks.includes(addition)) stacks.push(addition);
        });

        const tagText = `${segmentLabels[segment]} · ${postureLabels[posture]}`;
        const titleText = baseConfig.titles[posture];
        const summaryText = baseConfig.summaries[posture];
        const windowText = baseConfig.windows[posture];
        const reportText = `Leverera ${focusText.toLowerCase()}-rapport med edge score ${finalScore} och rekommenderade drag varje ${
            posture === 'dominate' ? 'vecka' : 'sprint'
        }.`;

        if (tagNode) tagNode.textContent = tagText;
        if (titleNode) titleNode.textContent = titleText;
        if (summaryNode) summaryNode.textContent = summaryText;
        if (scoreNode) scoreNode.textContent = String(finalScore);
        if (windowNode) windowNode.textContent = windowText;
        if (focusNode) focusNode.textContent = focusText;
        if (reportNode) reportNode.textContent = reportText;

        if (stackList) {
            stackList.innerHTML = '';
            stacks.forEach((item) => {
                const li = document.createElement('li');
                li.textContent = item;
                stackList.appendChild(li);
            });
        }

        copyBtn?.setAttribute(
            'data-neuro-payload',
            `${titleText}\nEdge score: ${finalScore}\nFönster: ${windowText}\nFokus: ${focusText}\nStack: ${stacks.join(
                ', '
            )}`
        );
    };

    const showStatus = (message) => {
        if (!statusNode) return;
        statusNode.textContent = message;
        if (statusTimeout) window.clearTimeout(statusTimeout);
        statusTimeout = window.setTimeout(() => {
            statusNode.textContent = '';
        }, 2600);
    };

    ambitionInput?.addEventListener('input', updateLab);
    segmentInput?.addEventListener('change', updateLab);
    postureInput?.addEventListener('change', updateLab);
    boosterInputs.forEach((input) => input.addEventListener('change', updateLab));

    copyBtn?.addEventListener('click', () => {
        const payload = copyBtn.getAttribute('data-neuro-payload');
        if (!payload) return;
        navigator.clipboard
            ?.writeText(payload)
            .then(() => showStatus('Game plan kopierad.'))
            .catch(() => showStatus('Kunde inte kopiera – markera texten manuellt.'));
    });

    updateLab();
}

function setupIntelRadar() {
    const radar = document.querySelector('[data-intel-radar]');
    if (!radar) return;

    const competitorButtons = radar.querySelectorAll('[data-intel-target]');
    const regionInput = radar.querySelector('[data-intel-region]');
    const agencyInput = radar.querySelector('[data-intel-agency]');
    const levelNode = radar.querySelector('[data-intel-level]');
    const switchInputs = radar.querySelectorAll('[data-intel-switch]');
    const tagNode = radar.querySelector('[data-intel-tag]');
    const titleNode = radar.querySelector('[data-intel-title]');
    const scoreNode = radar.querySelector('[data-intel-score]');
    const windowNode = radar.querySelector('[data-intel-window]');
    const focusNode = radar.querySelector('[data-intel-focus]');
    const summaryNode = radar.querySelector('[data-intel-summary]');
    const actionList = radar.querySelector('[data-intel-actions]');
    const effectNode = radar.querySelector('[data-intel-effect]');
    const copyBtn = radar.querySelector('[data-intel-copy]');
    const statusNode = radar.querySelector('[data-intel-status]');

    const regionLabels = {
        emea: 'EMEA',
        namer: 'Nordamerika',
        apac: 'APAC'
    };

    const regionMultiplier = {
        emea: 1,
        namer: 1.12,
        apac: 0.94
    };

    const agencyBoost = [0, 12, 26, 38, 52];

    const competitors = {
        atlas: {
            name: 'Atlas Cloud',
            base: 228,
            titles: {
                emea: 'Vinn enterprise deals på 42 dagar',
                namer: 'Dominera Fortune 500 procurement',
                apac: 'Ta APAC med regional snabbhet'
            },
            summary:
                'Neutralisera Atlas standardiserade erbjudanden med dynamisk prissättning, signalbaserade pitchar och hyperpersonaliserad styrning.',
            actions: [
                'Injicera live-signaler i varje demo och visa ROI-lyft direkt.',
                'Deploya alliance strike team mot varje buying committee.',
                'Stäm av konkurrerande offerter med adaptiv prissättning i realtid.'
            ],
            effects: {
                emea: 'Konvertera 3 av 4 shortlistade kunder och öka deal size med 26%.',
                namer: 'Stäng 2x fler multi-year avtal och höj ACV med 31%.',
                apac: 'Öka vinnande offerter med 34% och korta cykeln till 35 dagar.'
            },
            windows: {
                emea: '5 veckor',
                namer: '6 veckor',
                apac: '4 veckor'
            },
            focus: 'Signal taps'
        },
        nova: {
            name: 'Nova Stack',
            base: 214,
            titles: {
                emea: 'Överträffa deras produktledda spel',
                namer: 'Accelerera deals innan Nova hinner svara',
                apac: 'Bygg lokal närvaro som slår Nova på marken'
            },
            summary:
                'Nova förlitar sig på automatisering – slå dem med människa + maskin och en aggressiv partnerkedja.',
            actions: [
                'Aktivera signal mirrors för att upptäcka och blockera deras outreach.',
                'Kombinera ops automation med narrativ uppdatering varje dygn.',
                'Använd partner raids för att låsa in referenser innan Nova hinner agera.'
            ],
            effects: {
                emea: 'Höj win-rate mot Nova med 29% och minskar sales cycle med 9 dagar.',
                namer: 'Dubbel pipeline-täckning inom sex veckor.',
                apac: 'Få 40% fler kvalificerade demos genom lokala partners.'
            },
            windows: {
                emea: '4 veckor',
                namer: '5 veckor',
                apac: '6 veckor'
            },
            focus: 'Ops automation'
        },
        zenith: {
            name: 'Zenith Labs',
            base: 236,
            titles: {
                emea: 'Krossa deras konsulttunga upplägg',
                namer: 'Styr Zenits enterprise pitch med egna datakort',
                apac: 'Skapa beslutsunderlag snabbare än Zenith'
            },
            summary:
                'Zenith säljer med tunga workshops – automatisera beslutsunderlag, ge live-ROI och dominera ledningsrummet.',
            actions: [
                'Sätt upp executive brief varje vecka med realtidsdata.',
                'Använd narrative uplink för att skräddarsy beslutspaket.',
                'Implementera dynamic pricing för att slå deras konsultpriser.'
            ],
            effects: {
                emea: 'Öka din andel av enterprise deals med 32%.',
                namer: 'Få sign-off två veckor snabbare med beslutsautomation.',
                apac: 'Stäng 3 av 5 upphandlingar med hybrid team + automation.'
            },
            windows: {
                emea: '6 veckor',
                namer: '7 veckor',
                apac: '5 veckor'
            },
            focus: 'Narrative uplink'
        }
    };

    const switchData = {
        intel: { lift: 28, focus: 'Signal taps' },
        alliances: { lift: 22, focus: 'Alliance strike' },
        pricing: { lift: 24, focus: 'Adaptive pricing' }
    };

    let activeCompetitor = 'atlas';
    let statusTimeout = null;

    const updateRadar = () => {
        const region = regionInput?.value || 'emea';
        const agency = Number(agencyInput?.value || 3);
        if (levelNode) levelNode.textContent = String(agency);
        const data = competitors[activeCompetitor];
        if (!data) return;

        const activeSwitches = Array.from(switchInputs)
            .filter((input) => input.checked)
            .map((input) => input.getAttribute('data-intel-switch'))
            .filter(Boolean);

        const liftFromSwitch = activeSwitches.reduce((total, key) => total + (switchData[key]?.lift || 0), 0);
        const agencyIndex = agencyBoost[Math.max(0, Math.min(agencyBoost.length - 1, agency - 1))] || 0;
        const score = Math.round(
            (data.base + liftFromSwitch + agencyIndex) * (regionMultiplier[region] || 1)
        );

        const focusPieces = activeSwitches
            .map((key) => switchData[key]?.focus)
            .filter(Boolean);
        const focusText = focusPieces.length ? focusPieces.join(' + ') : data.focus;

        const actions = [...data.actions];
        if (activeSwitches.includes('intel')) {
            actions[0] = 'Koppla live signal taps till varje pågående opportunity.';
        }
        if (activeSwitches.includes('alliances')) {
            actions[1] = 'Koordinera alliance strike teams som följer varje konto.';
        }
        if (activeSwitches.includes('pricing')) {
            actions[2] = 'Använd adaptiv offermotor för att låsa avtalet under samtalet.';
        }

        const tagText = `${data.name} · ${regionLabels[region]}`;
        const titleText = data.titles[region] || data.titles.emea;
        const windowText = data.windows[region] || '5 veckor';
        const effectText = data.effects[region];

        if (tagNode) tagNode.textContent = tagText;
        if (titleNode) titleNode.textContent = titleText;
        if (scoreNode) scoreNode.textContent = String(score);
        if (windowNode) windowNode.textContent = windowText;
        if (focusNode) focusNode.textContent = focusText;
        if (summaryNode) summaryNode.textContent = data.summary;
        if (effectNode) effectNode.textContent = effectText;

        if (actionList) {
            actionList.innerHTML = '';
            actions.forEach((action) => {
                const li = document.createElement('li');
                li.textContent = action;
                actionList.appendChild(li);
            });
        }

        copyBtn?.setAttribute(
            'data-intel-payload',
            `${titleText}\nEdge index: ${score}\nFönster: ${windowText}\nFokus: ${focusText}\nÅtgärder: ${actions.join(
                ' | '
            )}`
        );
    };

    const showStatus = (message) => {
        if (!statusNode) return;
        statusNode.textContent = message;
        if (statusTimeout) window.clearTimeout(statusTimeout);
        statusTimeout = window.setTimeout(() => {
            statusNode.textContent = '';
        }, 2600);
    };

    competitorButtons.forEach((button) => {
        button.addEventListener('click', () => {
            competitorButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
            activeCompetitor = button.getAttribute('data-intel-target') || 'atlas';
            updateRadar();
        });
    });

    regionInput?.addEventListener('change', updateRadar);
    agencyInput?.addEventListener('input', updateRadar);
    switchInputs.forEach((input) => input.addEventListener('change', updateRadar));

    copyBtn?.addEventListener('click', () => {
        const payload = copyBtn.getAttribute('data-intel-payload');
        if (!payload) return;
        navigator.clipboard
            ?.writeText(payload)
            .then(() => showStatus('Radarbrief kopierad.'))
            .catch(() => showStatus('Kunde inte kopiera – markera texten manuellt.'));
    });

    updateRadar();
}

function setupForgeLab() {
    const lab = document.querySelector('[data-forge-lab]');
    if (!lab) return;

    const boardSelect = lab.querySelector('[data-forge-board]');
    const domainButtons = lab.querySelectorAll('[data-forge-domain]');
    const clockInput = lab.querySelector('[data-forge-clock]');
    const levelNode = lab.querySelector('[data-forge-level]');
    const sparkInputs = lab.querySelectorAll('[data-forge-spark]');
    const tagNode = lab.querySelector('[data-forge-tag]');
    const titleNode = lab.querySelector('[data-forge-title]');
    const summaryNode = lab.querySelector('[data-forge-summary]');
    const scoreNode = lab.querySelector('[data-forge-score]');
    const windowNode = lab.querySelector('[data-forge-window]');
    const focusNode = lab.querySelector('[data-forge-focus]');
    const actionsList = lab.querySelector('[data-forge-actions]');
    const effectNode = lab.querySelector('[data-forge-effect]');
    const copyButton = lab.querySelector('[data-forge-copy]');
    const statusNode = lab.querySelector('[data-forge-status]');

    let activeDomain = lab.querySelector('[data-forge-domain].is-active')?.getAttribute('data-forge-domain') || 'product';
    let statusTimeout = null;

    const boards = {
        launchpad: {
            label: 'Launchpad Prime',
            base: 240,
            focus: 'Activation prime',
            window: 3,
            summary: 'Launchpad Prime bygger hyperskarp onboarding med tydliga aha-ögonblick.',
            titles: {
                product: 'Leverera hyperskarp onboarding på 21 dagar',
                growth: 'Skala lanseringens growth-loopar utan friktion',
                success: 'Synka customer success innan första vågen slår in'
            },
            actions: [
                'Kartlägg aha-ögonblick och bygg guided flows i editorn.',
                'Planera sprintdemo varje vecka för att visa progression.'
            ],
            effect: {
                product: 'Kickstartar aktivering med +31 % på tre sprintar.',
                growth: 'Ger kampanjteamet 2× fler lanseringar per månad.',
                success: 'Ger customer success försprång på alla nya konton.'
            }
        },
        scalegrid: {
            label: 'Scalegrid Network',
            base: 256,
            focus: 'Expansion velocity',
            window: 4,
            summary: 'Scalegrid Network synkar experiment, partner och revenue i samma cadens.',
            titles: {
                product: 'Bygg ett levande produktnät som lyfter expansion',
                growth: 'Dominerar growth funnel med parallella sprintar',
                success: 'Förvandlar kundresan till en accelererande expansion'
            },
            actions: [
                'Sätt upp parallella experimentbanor med tydlig ägare.',
                'Integrera partnerdata i Revenue Collaboration.'
            ],
            effect: {
                product: 'Ökar feature-adoption med 24 % på två cykler.',
                growth: 'Skapar +19 % ARR genom expansionstakt.',
                success: 'Ger success-teamet färdiga expansionstriggers.'
            }
        },
        fortress: {
            label: 'Fortress Shield',
            base: 232,
            focus: 'Retention armor',
            window: 5,
            summary: 'Fortress Shield låser churnrisker och bygger en obruten kundupplevelse.',
            titles: {
                product: 'Förvandla riskfeatures till lojala moments',
                growth: 'Stabilisera revenue-flöden utan tapp',
                success: 'Skapa ett ogenomträngligt retentionprogram'
            },
            actions: [
                'Identifiera risksegment och larma via Signals.',
                'Implementera win-back flows i Profit Automations.'
            ],
            effect: {
                product: 'Sänker churn riskpoäng med 27 %.',
                growth: 'Håller pipeline intakt med 0 läckage i mid-funnel.',
                success: 'Ökar NRR till 128 % med proaktiva åtgärder.'
            }
        }
    };

    const domains = {
        product: {
            label: 'Produkt',
            lift: 28,
            focus: 'Product leadership',
            summary: 'Produktdomänen översätter strategi till upplevelse och säkerställer snabb leverans.',
            actions: ['Definiera produktmål per sprint tillsammans med design och engineering.'],
            window: 0
        },
        growth: {
            label: 'Tillväxt',
            lift: 34,
            focus: 'Growth strike',
            summary: 'Growth-domänen accelererar funneln och optimerar varje touchpoint för intäkt.',
            actions: ['Samordna kampanjer med ROI-spårning och snabb iteration.'],
            window: -1
        },
        success: {
            label: 'Kundresa',
            lift: 26,
            focus: 'Success halo',
            summary: 'Kundresan fokuserar på att låsa in värde efter köpet och skapa expansion.',
            actions: ['Bygg personliga customer health-planer kopplade till Signals.'],
            window: 1
        }
    };

    const sparks = {
        experiments: {
            label: 'Experiment kedjor',
            lift: 16,
            focus: 'Experiment stack',
            action: 'Koppla experimentkedjor med tydlig beslutslogg.',
            effect: 'Ger +4 testade hypoteser per sprint.'
        },
        intelligence: {
            label: 'Signal intelligence',
            lift: 18,
            focus: 'Signal mirrors',
            action: 'Injicera live-signal mirrors i varje körplan.',
            effect: 'Ger varningssignal 48 timmar innan risk uppstår.'
        },
        alliances: {
            label: 'Alliance cells',
            lift: 14,
            focus: 'Partner raids',
            action: 'Synka partnerceller för att skala distributionen.',
            effect: 'Öppnar tre nya kanaler utan extra headcount.'
        },
        automation: {
            label: 'Automation relays',
            lift: 12,
            focus: 'Automation mesh',
            action: 'Knyt automationer till varje milstolpe i körplanen.',
            effect: 'Sparar 12 timmar per sprint i manuellt arbete.'
        }
    };

    const showStatus = (message) => {
        if (!statusNode) return;
        statusNode.textContent = message;
        if (statusTimeout) window.clearTimeout(statusTimeout);
        statusTimeout = window.setTimeout(() => {
            statusNode.textContent = '';
        }, 2600);
    };

    const update = () => {
        const boardKey = boardSelect?.value || 'launchpad';
        const board = boards[boardKey] || boards.launchpad;
        const domain = domains[activeDomain] || domains.product;
        const clock = Number(clockInput?.value || 3);
        if (levelNode) levelNode.textContent = String(clock);

        const activeSparks = Array.from(sparkInputs)
            .filter((input) => input.checked)
            .map((input) => input.getAttribute('data-forge-spark'))
            .filter(Boolean);

        const sparkLift = activeSparks.reduce((total, key) => total + (sparks[key]?.lift || 0), 0);
        const intensityLift = (clock - 3) * 18;
        const score = Math.max(180, Math.round(board.base + domain.lift + intensityLift + sparkLift));

        const windowValue = Math.max(2, board.window + (domain.window || 0) + (clock >= 4 ? -1 : clock <= 2 ? 1 : 0));

        const focusParts = [board.focus, domain.focus]
            .concat(activeSparks.map((key) => sparks[key]?.focus).filter(Boolean))
            .filter(Boolean);
        const focusText = focusParts.join(' · ') || board.focus;

        const summaryParts = [board.summary, domain.summary];
        if (activeSparks.length) {
            const sparkLabels = activeSparks.map((key) => sparks[key]?.label).filter(Boolean);
            summaryParts.push(`Katalysatorer: ${sparkLabels.join(', ')}.`);
        } else {
            summaryParts.push('Aktivera en katalysator för att accelerera utfallet ytterligare.');
        }
        const summaryText = summaryParts.filter(Boolean).join(' ');

        const actions = [...new Set([
            ...board.actions,
            ...domain.actions,
            ...activeSparks.map((key) => sparks[key]?.action)
        ])].filter(Boolean);

        if (actionsList) {
            actionsList.innerHTML = '';
            actions.forEach((action) => {
                const li = document.createElement('li');
                li.textContent = action;
                actionsList.appendChild(li);
            });
        }

        const effectParts = [board.effect?.[activeDomain]]
            .concat(activeSparks.map((key) => sparks[key]?.effect).filter(Boolean));
        effectParts.push(`Deploymentfönster: ${windowValue} sprintar.`);
        const effectText = effectParts.filter(Boolean).join(' ');

        const tagText = `${board.label} · ${domain.label}`;
        const titleText = board.titles[activeDomain] || board.titles.product;

        if (tagNode) tagNode.textContent = tagText;
        if (titleNode) titleNode.textContent = titleText;
        if (summaryNode) summaryNode.textContent = summaryText;
        if (scoreNode) scoreNode.textContent = String(score);
        if (windowNode) windowNode.textContent = `${windowValue} sprintar`;
        if (focusNode) focusNode.textContent = focusText;
        if (effectNode) effectNode.textContent = effectText;

        const payload = `${titleText}\nExecution score: ${score}\nFönster: ${windowValue} sprintar\nFokus: ${focusText}\nÅtgärder:\n${actions
            .map((action) => `- ${action}`)
            .join('\n')}\n\nPrognos: ${effectText}`;
        copyButton?.setAttribute('data-forge-payload', payload);
    };

    boardSelect?.addEventListener('change', update);
    clockInput?.addEventListener('input', update);
    sparkInputs.forEach((input) => input.addEventListener('change', update));

    domainButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const domainKey = button.getAttribute('data-forge-domain');
            if (!domainKey) return;
            activeDomain = domainKey;
            domainButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
            update();
        });
    });

    copyButton?.addEventListener('click', async () => {
        const payload = copyButton.getAttribute('data-forge-payload');
        if (!payload) return;
        try {
            await navigator.clipboard.writeText(payload);
            showStatus('Körplan kopierad ✅');
        } catch (error) {
            showStatus('Kunde inte kopiera automatiskt');
        }
    });

    update();
}

function setupDesignStudio() {
    const studio = document.querySelector('[data-design-studio]');
    if (!studio) return;

    const personaButtons = studio.querySelectorAll('[data-studio-persona]');
    const flowSelect = studio.querySelector('[data-studio-flow]');
    const paceRange = studio.querySelector('[data-studio-pace]');
    const paceLevel = studio.querySelector('[data-studio-level]');
    const moduleInputs = studio.querySelectorAll('[data-studio-module]');
    const copyButton = studio.querySelector('[data-studio-copy]');
    const exportButton = studio.querySelector('[data-studio-export]');
    const statusNode = studio.querySelector('[data-studio-status]');
    const tagNode = studio.querySelector('[data-studio-tag]');
    const titleNode = studio.querySelector('[data-studio-title]');
    const summaryNode = studio.querySelector('[data-studio-summary]');
    const focusNode = studio.querySelector('[data-studio-focus]');
    const sprintNode = studio.querySelector('[data-studio-sprint]');
    const accentNode = studio.querySelector('[data-studio-accent]');
    const listNode = studio.querySelector('[data-studio-kpis]');

    const personas = {
        founder: {
            label: 'Grundare',
            focus: 'Momentum storytelling',
            accent: 'Neon Plasma',
            accentColor: '#7C4DFF',
            summary: 'Grundare vill se tempo, proof och en tydlig väg till intäkt.',
            title: 'Visuell funnel som visar momentum på varje slide'
        },
        revops: {
            label: 'Revenue Ops',
            focus: 'Pipeline clarity',
            accent: 'Apex Lime',
            accentColor: '#16F2A5',
            summary: 'Revenue Ops kräver datadrivna moduler som bevisar varje steg.',
            title: 'Revenue blueprint med crystal clear pipeline-visning'
        },
        enterprise: {
            label: 'Enterprise-ledning',
            focus: 'Executive confidence',
            accent: 'Celestial Gold',
            accentColor: '#F5B53F',
            summary: 'Ledning behöver risk- och ROI-narrativ som skapar trygghet.',
            title: 'Executive blueprint med riskkontroll och ROI-berättelse'
        }
    };

    const flows = {
        launch: {
            label: 'Lanseringskampanj',
            summary: 'Hero + proofwall + CTA-band för hypersnabb konvertering.',
            focus: 'Aktivering',
            window: 14,
            modules: ['hero', 'proof', 'cta'],
            blueprint: 'DS-LAUNCH'
        },
        sales: {
            label: 'Enterprise-försäljning',
            summary: 'Strategimatrix, ROI-panel och automation som visar skalbarhet.',
            focus: 'Win rate',
            window: 18,
            modules: ['matrix', 'roi', 'automation'],
            blueprint: 'DS-SALES'
        },
        adoption: {
            label: 'Kundsucce & adoption',
            summary: 'Journey maps, success rituals och signalhub för retention.',
            focus: 'Retention',
            window: 16,
            modules: ['journey', 'success', 'signals'],
            blueprint: 'DS-ADOPT'
        }
    };

    const moduleCatalog = {
        hero: 'Hero blueprint med aktiveringsgraf och accentknapp.',
        proof: 'Proofwall med kundcase och KPI-taggar.',
        cta: 'CTA-band med duala handlingsval och social proof.',
        matrix: 'Strategy matrix som visar moduler vs resultat.',
        roi: 'ROI-panel med break-even och payback tidslinje.',
        automation: 'Automationstrådar som visar hur flows uppdateras.',
        journey: 'Onboarding journey med tydlig progress.',
        success: 'Success rituals med cadens och owners.',
        signals: 'Signals hub som lyfter risker och möjligheter.',
        pitchLab: 'Pitch Generator Lab med presets per persona.',
        edgeRadar: 'Edge Radar-modul som mappar konkurrentdrag.',
        quantumForge: 'Quantum Forge visualisering av boosters.',
        commandCenter: 'Profit Command Center dashboards med KPI-taggar.'
    };

    const moduleMap = {
        pitch: 'pitchLab',
        intel: 'edgeRadar',
        forge: 'quantumForge',
        profit: 'commandCenter'
    };

    let statusTimeout = null;

    const state = {
        persona: studio.querySelector('[data-studio-persona].is-active')?.getAttribute('data-studio-persona') || 'founder',
        flow: flowSelect?.value || 'launch',
        pace: Number(paceRange?.value || 3),
        modules: new Set(
            Array.from(moduleInputs)
                .filter((input) => input.checked)
                .map((input) => input.getAttribute('data-studio-module'))
                .filter(Boolean)
        )
    };

    const showStatus = (message) => {
        if (!statusNode) return;
        statusNode.textContent = message;
        if (statusTimeout) window.clearTimeout(statusTimeout);
        statusTimeout = window.setTimeout(() => {
            statusNode.textContent = '';
        }, 2600);
    };

    const update = () => {
        const persona = personas[state.persona] || personas.founder;
        const flow = flows[state.flow] || flows.launch;
        const intensity = state.pace;
        const optionalModules = Array.from(state.modules)
            .map((key) => moduleMap[key])
            .filter(Boolean);
        const moduleKeys = Array.from(new Set([...flow.modules, ...optionalModules]));

        const sprintWindow = Math.max(7, flow.window - intensity * 2);
        const focusText = `${persona.focus} · ${flow.focus}`;
        const accent = persona.accent;

        const summaryParts = [persona.summary, flow.summary];
        if (moduleKeys.length) {
            const modulesText = moduleKeys
                .map((key) => moduleCatalog[key])
                .filter(Boolean)
                .join(' ');
            summaryParts.push(modulesText);
        }
        summaryParts.push(`Intensitet ${intensity} betyder leverans på ${sprintWindow} dagar.`);
        const summary = summaryParts.filter(Boolean).join(' ');

        if (tagNode) tagNode.textContent = `${persona.label} · ${flow.label}`;
        if (titleNode) titleNode.textContent = persona.title;
        if (summaryNode) summaryNode.textContent = summary;
        if (focusNode) focusNode.textContent = focusText;
        if (sprintNode) sprintNode.textContent = `${sprintWindow} dagar`;
        if (accentNode) accentNode.textContent = accent;
        if (paceLevel) paceLevel.textContent = String(intensity);
        studio.style.setProperty('--design-studio-accent', personas[state.persona]?.accentColor || '#7C4DFF');

        if (listNode) {
            listNode.innerHTML = '';
            moduleKeys.forEach((key) => {
                const description = moduleCatalog[key];
                if (!description) return;
                const item = document.createElement('li');
                item.textContent = description;
                listNode.appendChild(item);
            });
        }

        const blueprintId = `${flow.blueprint}-${state.persona.toUpperCase()}-${intensity}`;
        copyButton?.setAttribute(
            'data-studio-payload',
            `${blueprintId}: ${persona.label} för ${flow.label}. Fokus: ${focusText}. Sprintfönster: ${sprintWindow} dagar.`
        );
    };

    personaButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-studio-persona');
            if (!key) return;
            state.persona = key;
            personaButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
            update();
        });
    });

    flowSelect?.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLSelectElement)) return;
        state.flow = target.value;
        update();
    });

    paceRange?.addEventListener('input', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;
        state.pace = Number(target.value) || 3;
        if (paceLevel) paceLevel.textContent = String(state.pace);
        update();
    });

    moduleInputs.forEach((input) => {
        input.addEventListener('change', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) return;
            const key = target.getAttribute('data-studio-module');
            if (!key) return;
            if (target.checked) {
                state.modules.add(key);
            } else {
                state.modules.delete(key);
            }
            update();
        });
    });

    copyButton?.addEventListener('click', async () => {
        const payload = copyButton.getAttribute('data-studio-payload');
        if (!payload) return;
        try {
            await navigator.clipboard.writeText(payload);
            showStatus('Blueprint kopierad ✅');
        } catch (error) {
            showStatus('Kunde inte kopiera automatiskt');
        }
    });

    exportButton?.addEventListener('click', () => {
        const payload = copyButton?.getAttribute('data-studio-payload');
        if (!payload) return;
        showStatus('Export klar – klistra in blueprinten i din pitch.');
    });

    update();
}

function setupDesignPreview() {
    const preview = document.querySelector('[data-design-preview]');
    if (!preview) return;

    const themeButtons = preview.querySelectorAll('[data-design-theme]');
    const personaSelect = preview.querySelector('[data-design-persona]');
    const layoutSelect = preview.querySelector('[data-design-layout]');
    const moduleInputs = preview.querySelectorAll('[data-design-module]');
    const copyButton = preview.querySelector('[data-design-copy]');
    const statusNode = preview.querySelector('[data-design-status]');
    const tagNode = preview.querySelector('[data-design-tag]');
    const titleNode = preview.querySelector('[data-design-title]');
    const summaryNode = preview.querySelector('[data-design-summary]');
    const accentNode = preview.querySelector('[data-design-accent]');
    const focusNode = preview.querySelector('[data-design-focus]');
    const blueprintNode = preview.querySelector('[data-design-blueprint]');
    const modulesNode = preview.querySelector('[data-design-kpis]');

    const themes = {
        plasma: { label: 'Neon Plasma', color: '#7C4DFF', code: 'PLASMA', effect: 'maximerar kontrast och energi.' },
        aurora: { label: 'Aurora Mist', color: '#38BDF8', code: 'AURORA', effect: 'skapar mjukt glow och fokus på storytelling.' },
        void: { label: 'Onyx Void', color: '#0F172A', code: 'VOID', effect: 'lyfter datavisning och kontrast i dashboards.' }
    };

    const personas = {
        founder: { label: 'Grundare', focus: 'Aktivering', summary: 'Visar traction, kundbevis och tydlig CTA.', code: 'GR' },
        revops: { label: 'Revenue Ops', focus: 'Pipeline', summary: 'Lyfter ROI, dashboards och signals.', code: 'RO' },
        designer: { label: 'Produktdesigner', focus: 'Designsystem', summary: 'Fokuserar på komponenter, rörelsemönster och tokens.', code: 'DS' }
    };

    const layouts = {
        landing: {
            label: 'Landningssida',
            summary: 'Hero, proofwall och CTA-band för första intrycket.',
            focus: 'Momentum storytelling',
            prefix: 'LP',
            modules: ['hero', 'proofwall', 'ctaBand']
        },
        product: {
            label: 'Produktsida',
            summary: 'Funktioner, arkitektur och strategi-matriser.',
            focus: 'Capability depth',
            prefix: 'PD',
            modules: ['feature', 'matrix', 'command']
        },
        app: {
            label: 'In-app dashboard',
            summary: 'Dashboard, console och blueprint-lab.',
            focus: 'Operational clarity',
            prefix: 'APP',
            modules: ['dashboard', 'console', 'visionLab']
        }
    };

    const moduleCatalog = {
        hero: { title: 'Hero', description: 'Fullbredd med gradient, KPI-taggar och accentknapp.' },
        proofwall: { title: 'Proofwall', description: 'Kundcitat och resultatbrickor i en responsiv grid.' },
        ctaBand: { title: 'CTA-band', description: 'Dual CTA med tydlig konverteringshook.' },
        feature: { title: 'Feature-grid', description: 'Modulära kort som beskriver nyckelfunktioner.' },
        matrix: { title: 'Strategimatris', description: 'Visualiserar scenarier, boosters och outcomes.' },
        command: { title: 'Command Center', description: 'Paneler som kopplar KPI:er till beslut.' },
        dashboard: { title: 'Dashboard', description: 'Tvåkolumnsvy med profitpanel och aktiviteter.' },
        console: { title: 'Growth Console', description: 'Kontroller för program, boosters och blueprint export.' },
        visionLab: { title: 'Vision Lab', description: 'Design blueprints som matar editorn.' },
        metrics: { title: 'KPI-band', description: 'Visar DAU/WAU och ROI i realtid.' },
        lab: { title: 'Lab cards', description: 'Profit Lab-kort för automation och boosters.' }
    };

    const moduleMap = {
        metrics: 'metrics',
        lab: 'lab',
        cta: 'ctaBand'
    };

    let statusTimeout = null;

    const state = {
        theme: preview.querySelector('[data-design-theme].is-active')?.getAttribute('data-design-theme') || 'plasma',
        persona: personaSelect?.value || 'founder',
        layout: layoutSelect?.value || 'landing',
        modules: new Set(
            Array.from(moduleInputs)
                .filter((input) => input.checked)
                .map((input) => input.getAttribute('data-design-module'))
                .filter(Boolean)
        )
    };

    const showStatus = (message) => {
        if (!statusNode) return;
        statusNode.textContent = message;
        if (statusTimeout) window.clearTimeout(statusTimeout);
        statusTimeout = window.setTimeout(() => {
            statusNode.textContent = '';
        }, 2600);
    };

    const update = () => {
        const theme = themes[state.theme] || themes.plasma;
        const persona = personas[state.persona] || personas.founder;
        const layout = layouts[state.layout] || layouts.landing;
        const optionalModules = Array.from(state.modules)
            .map((key) => moduleMap[key])
            .filter(Boolean);
        const moduleKeys = Array.from(new Set([...layout.modules, ...optionalModules]));

        const focusText = `${persona.focus} · ${layout.focus}`;
        const blueprintId = `${layout.prefix}-${theme.code}-${persona.code}`;
        const summaryParts = [layout.summary, persona.summary, `Tema ${theme.label} ${theme.effect}`];
        const modulesText = moduleKeys
            .map((key) => moduleCatalog[key]?.title)
            .filter(Boolean)
            .join(', ');
        if (modulesText) summaryParts.push(`Moduler: ${modulesText}.`);
        const summary = summaryParts.filter(Boolean).join(' ');

        preview.style.setProperty('--design-accent', theme.color);
        preview.setAttribute('data-design-theme', state.theme);

        if (tagNode) tagNode.textContent = `${theme.label} · ${persona.label}`;
        if (titleNode)
            titleNode.textContent =
                state.layout === 'product'
                    ? 'Produktkomposition med edge intelligence'
                    : state.layout === 'app'
                    ? 'Dashboard blueprint med Growth Console'
                    : 'Hero + proofwall för hypersnabb validering';
        if (summaryNode) summaryNode.textContent = summary;
        if (accentNode) accentNode.textContent = theme.label;
        if (focusNode) focusNode.textContent = focusText;
        if (blueprintNode) blueprintNode.textContent = blueprintId;

        if (modulesNode) {
            modulesNode.innerHTML = '';
            moduleKeys.forEach((key) => {
                const module = moduleCatalog[key];
                if (!module) return;
                const article = document.createElement('article');
                const heading = document.createElement('h4');
                heading.textContent = module.title;
                const paragraph = document.createElement('p');
                paragraph.textContent = module.description;
                article.appendChild(heading);
                article.appendChild(paragraph);
                modulesNode.appendChild(article);
            });
        }

        copyButton?.setAttribute(
            'data-design-payload',
            `${blueprintId}: ${layout.label} för ${persona.label} med ${theme.label}. Fokus: ${focusText}. Moduler: ${modulesText}.`
        );
    };

    themeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-design-theme');
            if (!key) return;
            state.theme = key;
            themeButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
            update();
        });
    });

    personaSelect?.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLSelectElement)) return;
        state.persona = target.value;
        update();
    });

    layoutSelect?.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLSelectElement)) return;
        state.layout = target.value;
        update();
    });

    moduleInputs.forEach((input) => {
        input.addEventListener('change', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) return;
            const key = target.getAttribute('data-design-module');
            if (!key) return;
            if (target.checked) {
                state.modules.add(key);
            } else {
                state.modules.delete(key);
            }
            update();
        });
    });

    copyButton?.addEventListener('click', async () => {
        const payload = copyButton.getAttribute('data-design-payload');
        if (!payload) return;
        try {
            await navigator.clipboard.writeText(payload);
            showStatus('Blueprint kopierad ✅');
        } catch (error) {
            showStatus('Kunde inte kopiera automatiskt');
        }
    });

    update();
}

function setupAtlasLab() {
    const lab = document.querySelector('[data-atlas-lab]');
    if (!lab) return;

    const modeButtons = lab.querySelectorAll('[data-atlas-mode]');
    const regionSelect = lab.querySelector('[data-atlas-region]');
    const horizonRange = lab.querySelector('[data-atlas-horizon]');
    const horizonLevel = lab.querySelector('[data-atlas-level]');
    const upgradeInputs = lab.querySelectorAll('[data-atlas-upgrade]');
    const copyButton = lab.querySelector('[data-atlas-copy]');
    const statusNode = lab.querySelector('[data-atlas-status]');
    const tagNode = lab.querySelector('[data-atlas-tag]');
    const titleNode = lab.querySelector('[data-atlas-title]');
    const summaryNode = lab.querySelector('[data-atlas-summary]');
    const focusNode = lab.querySelector('[data-atlas-focus]');
    const windowNode = lab.querySelector('[data-atlas-window]');
    const impactNode = lab.querySelector('[data-atlas-impact]');
    const actionsNode = lab.querySelector('[data-atlas-actions]');

    const modes = {
        launch: {
            label: 'Launch Narrative',
            base: 24,
            summary: 'Bygg momentum genom att synka hero, proof och automation.',
            focus: 'Momentum storytelling',
            actions: ['Skapa plasma-hero med KPI-band.', 'Aktivera proofwall för regionala case.', 'Synka automation till Growth Console.']
        },
        scale: {
            label: 'Scale Alignment',
            base: 28,
            summary: 'Förankra design i RevOps med metrics och partner overlays.',
            focus: 'Expansion velocity',
            actions: ['Lägg in metrics overlay i produktsektionen.', 'Synca partner boosters via Edge Radar.', 'Exportera blueprint till vision labbet.']
        },
        defend: {
            label: 'Retention Shield',
            base: 22,
            summary: 'Skapa trygghet med health dashboards och success rituals.',
            focus: 'Retention confidence',
            actions: ['Bygg onboarding journey cards.', 'Visa churn-signal i insight hub.', 'Planera success rituals i command center.']
        }
    };

    const regions = {
        emea: { label: 'EMEA', lift: 6, summary: 'EMEA svarar bäst på proof + automation combo.' },
        namer: { label: 'Nordamerika', lift: 8, summary: 'NA kräver KPI-hyperfokus och tempo.' },
        apac: { label: 'APAC', lift: 5, summary: 'APAC gillar personalisering och cultural proof.' }
    };

    const upgrades = {
        signals: { label: 'Signals overlay', lift: 4, action: 'Injicera signals data i hero + proof-moduler.' },
        automation: { label: 'Automation mesh', lift: 5, action: 'Visa hur automationen skjuter blueprint till appen.' },
        intel: { label: 'Competitive sweep', lift: 3, action: 'Infoga konkurrenttabeller i strategimatrixen.' },
        success: { label: 'Success rituals', lift: 3, action: 'Lägg in ritualschema i insight hub.' }
    };

    let statusTimeout = null;
    let activeMode = lab.querySelector('[data-atlas-mode].is-active')?.getAttribute('data-atlas-mode') || 'launch';

    const showStatus = (message) => {
        if (!statusNode) return;
        statusNode.textContent = message;
        if (statusTimeout) window.clearTimeout(statusTimeout);
        statusTimeout = window.setTimeout(() => {
            statusNode.textContent = '';
        }, 2600);
    };

    const update = () => {
        const mode = modes[activeMode] || modes.launch;
        const regionKey = regionSelect?.value || 'emea';
        const region = regions[regionKey] || regions.emea;
        const horizon = Number(horizonRange?.value || 4);
        if (horizonLevel) horizonLevel.textContent = String(horizon);
        const activeUpgrades = Array.from(upgradeInputs)
            .filter((input) => input.checked)
            .map((input) => input.getAttribute('data-atlas-upgrade'))
            .filter(Boolean);
        const upgradeLift = activeUpgrades.reduce((total, key) => total + (upgrades[key]?.lift || 0), 0);
        const impact = Math.max(18, mode.base + region.lift + upgradeLift + horizon * 2);
        const window = Math.max(2, horizon + 1);

        const summaryParts = [mode.summary, region.summary];
        if (activeUpgrades.length) {
            const upgradeLabels = activeUpgrades.map((key) => upgrades[key]?.label).filter(Boolean);
            summaryParts.push(`Acceleratorer: ${upgradeLabels.join(', ')}.`);
        }
        const summary = summaryParts.filter(Boolean).join(' ');

        if (tagNode) tagNode.textContent = `${mode.label} · ${region.label}`;
        if (titleNode)
            titleNode.textContent =
                activeMode === 'scale'
                    ? 'Vision blueprint som skalar varje region'
                    : activeMode === 'defend'
                    ? 'Retention blueprint med health overlays'
                    : 'Visuell resa som triggar 30% snabbare adoption';
        if (summaryNode) summaryNode.textContent = summary;
        if (focusNode) focusNode.textContent = `${mode.focus} · ${region.label}`;
        if (windowNode) windowNode.textContent = `${window} sprintar`;
        if (impactNode) impactNode.textContent = `+${impact} %`;

        if (actionsNode) {
            actionsNode.innerHTML = '';
            const steps = [...mode.actions, ...activeUpgrades.map((key) => upgrades[key]?.action).filter(Boolean)];
            steps.forEach((step) => {
                const li = document.createElement('li');
                li.textContent = step;
                actionsNode.appendChild(li);
            });
        }

        copyButton?.setAttribute(
            'data-atlas-payload',
            `${mode.label} · ${region.label}\nImpact: +${impact} %\nFönster: ${window} sprintar\nFokus: ${mode.focus} · ${region.label}`
        );
    };

    modeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-atlas-mode');
            if (!key) return;
            activeMode = key;
            modeButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
            update();
        });
    });

    regionSelect?.addEventListener('change', update);
    horizonRange?.addEventListener('input', update);
    upgradeInputs.forEach((input) => input.addEventListener('change', update));

    copyButton?.addEventListener('click', async () => {
        const payload = copyButton.getAttribute('data-atlas-payload');
        if (!payload) return;
        try {
            await navigator.clipboard.writeText(payload);
            showStatus('Vision kopierad ✅');
        } catch (error) {
            showStatus('Kunde inte kopiera automatiskt');
        }
    });

    update();
}

const APEX_SUITE = {
    vectors: {
        velocity: {
            label: 'Velocity Surge',
            focus: 'Hyperlansering',
            baseScore: 94,
            tag: ({ horizonLabel }) => `${horizonLabel} · Velocity`,
            title: ({ competitorLabel, safeDelta }) =>
                `Överkör ${competitorLabel} med ${safeDelta}% snabbare aktivering`,
            summary: ({ tempoLabel, boostersText, competitorGap }) =>
                `${tempoLabel} kombinerar ${boostersText} för att göra onboarding till en hypersnabb loop. ${competitorGap}
 fastnar konkurrenten i, vilket öppnar hela funneln.`,
            metrics: {
                cadence: ({ tempoLabel, tempoWindow }) => `${tempoLabel} · ${tempoWindow}`,
                automation: ({ boostersText }) => `Automationsstack: ${boostersText}`,
                signal: ({ tempoNote }) => tempoNote,
                revenue: ({ score, delta, competitorLabel, horizonScore }) =>
                    `Score ${score} (${delta >= 0 ? '+' : ''}${delta} vs ${competitorLabel} ${horizonScore})`
            },
            plays: [
                ({ tempoLabel }) => `${tempoLabel} standups låser releasefrekvensen.`,
                ({ boostersList }) =>
                    boostersList.length
                        ? `Koppla ${boostersList.join(' + ')} för att prioritera konton i realtid.`
                        : 'Aktivera minst en booster för att låsa upp automation.',
                ({ competitorGap }) => `Neutralisera ${competitorGap} genom att spegla signaler i Command Center.`
            ],
            effect: ({ windowText, delta }) => `Förväntad effekt: Δ ${delta >= 0 ? '+' : ''}${delta} inom ${windowText}.`,
            blueprint: ({ tempoLabel, boostersList, horizonLabel }) => {
                const steps = [
                    `${tempoLabel} releaseplan kopplad till ${horizonLabel}.`,
                    boostersList.length
                        ? `Boosters: ${boostersList.join(', ')}.`
                        : 'Aktivera boosters för extra acceleration.',
                    'Synka blueprint till Growth Console och exportera deck.'
                ];
                return steps;
            }
        },
        loyalty: {
            label: 'Loyalty Orbit',
            focus: 'Retention shield',
            baseScore: 92,
            tag: ({ horizonLabel }) => `${horizonLabel} · Orbit`,
            title: ({ competitorLabel, safeDelta }) =>
                `Behåll fler kunder än ${competitorLabel} med ${safeDelta}% starkare retention`,
            summary: ({ tempoLabel, boostersText, competitorGap }) =>
                `${tempoLabel} driver proaktiva signals och ${boostersText.toLowerCase()} som håller churn under kontroll. ${
competitorGap} lämnar konkurrenten sårbar.`,
            metrics: {
                cadence: ({ tempoLabel, tempoWindow }) => `${tempoLabel} · ${tempoWindow}`,
                automation: ({ boostersText }) => `Success automation: ${boostersText}`,
                signal: ({ boostersList }) =>
                    boostersList.length
                        ? `Signals: ${boostersList.join(' • ')}`
                        : 'Signals väntar på att aktiveras.',
                revenue: ({ score, delta, competitorLabel }) =>
                    `Retention score ${score} (${delta >= 0 ? '+' : ''}${delta} mot ${competitorLabel})`
            },
            plays: [
                ({ tempoLabel }) => `${tempoLabel} health reviews identifierar risk innan churn uppstår.`,
                ({ boostersList }) =>
                    boostersList.length
                        ? `Bygg loops med ${boostersList.join(' + ')} för att trigga win-back.`
                        : 'Lägg till boosters för att skapa retentionloopar.',
                ({ competitorGap }) => `Övervaka ${competitorGap} och rikta success-nudges därefter.`
            ],
            effect: ({ windowText }) => `Förväntad effekt: Nettoretention säkras inom ${windowText}.`,
            blueprint: ({ horizonLabel, boostersList }) => {
                const steps = [
                    `Etablera retention rituals för ${horizonLabel.toLowerCase()}.`,
                    boostersList.length
                        ? `Integrera boosters: ${boostersList.join(', ')}.`
                        : 'Lägg till boosters för att aktivera success automation.',
                    'Exportera retention blueprint till Vision Lab för uppföljning.'
                ];
                return steps;
            }
        },
        takeover: {
            label: 'Dominance Mesh',
            focus: 'Market takeover',
            baseScore: 96,
            tag: ({ horizonLabel }) => `${horizonLabel} · Mesh`,
            title: ({ competitorLabel, safeDelta }) =>
                `Planera ett takeover-drive ${safeDelta}% över ${competitorLabel}`,
            summary: ({ tempoLabel, boostersText, competitorGap }) =>
                `${tempoLabel} orchestrerar ${boostersText.toLowerCase()} för att täcka varje kanal. ${competitorGap} blir glas
t taket för konkurrenterna.`,
            metrics: {
                cadence: ({ tempoLabel, tempoWindow }) => `${tempoLabel} · ${tempoWindow}`,
                automation: ({ boostersText }) => `Dominerar via ${boostersText}`,
                signal: ({ tempoNote }) => tempoNote,
                revenue: ({ score, delta, competitorLabel }) =>
                    `Dominansscore ${score} (${delta >= 0 ? '+' : ''}${delta} mot ${competitorLabel})`
            },
            plays: [
                ({ tempoLabel }) => `${tempoLabel} war rooms synkar produkt, revenue och success.`,
                ({ boostersList }) =>
                    boostersList.length
                        ? `Deploy ${boostersList.join(' + ')} för simultana kampanjer.`
                        : 'Aktivera boosters för att låsa upp multi-team drive.',
                ({ competitorGap }) => `Tryck på ${competitorGap} med offensiva kampanjer och proof-drops.`
            ],
            effect: ({ windowText, delta }) =>
                `Förväntad effekt: Marknadsdominans initieras inom ${windowText} (Δ ${delta >= 0 ? '+' : ''}${delta}).`,
            blueprint: ({ boostersList, horizonLabel }) => {
                const steps = [
                    `Skapa takeover-canvas för ${horizonLabel.toLowerCase()}.`,
                    boostersList.length
                        ? `Planera simultana raids med ${boostersList.join(', ')}.`
                        : 'Aktivera boosters för att koordinera raids.',
                    'Publicera dominansbrief i Dominansconsole och trigga delningar.'
                ];
                return steps;
            }
        }
    },
    tempos: {
        pulse: {
            label: 'Pulse 24h',
            mod: 4,
            window: '7 dagar',
            note: 'Dagliga releaser och KPI-pulser via Signals.'
        },
        sprint: {
            label: 'Sprint 7d',
            mod: 6,
            window: '14 dagar',
            note: 'Två releasefönster per vecka och gemensamma war rooms.'
        },
        orbit: {
            label: 'Orbit 30d',
            mod: 8,
            window: '30 dagar',
            note: 'Helintegrerad månadscykel med expansionsfokus.'
        }
    },
    boosters: {
        ai: {
            label: 'Neural Co-Pilot',
            lift: 5,
            pitch: 'Autonom scoring och copy-optimering för varje blueprint.',
            play: 'Låt AI autopiloten prioritera leads och copy var 6:e timme.'
        },
        signal: {
            label: 'Signal Radar',
            lift: 4,
            pitch: 'Edge Radar-insikter och live-signalströmmar.',
            play: 'Mata Command Center med signalpaket i realtid.'
        },
        alliance: {
            label: 'Alliance Mesh',
            lift: 3,
            pitch: 'Partner raids och co-selling blueprintar.',
            play: 'Knyt partner payloads till varje fas i planen.'
        },
        success: {
            label: 'Success Autopilot',
            lift: 4,
            pitch: 'Proaktiva retention-loopar och riskvarningar.',
            play: 'Planera risknudges och expansionsritualer för varje cohort.'
        }
    },
    horizons: {
        launch: {
            label: 'Launch runway',
            competitor: 'Nova Stack',
            score: 86,
            gap: 'saknar adaptiv automation',
            window: '14 dagar'
        },
        scale: {
            label: 'Scale engine',
            competitor: 'Zenith Labs',
            score: 88,
            gap: 'silad success-data',
            window: '28 dagar'
        },
        enterprise: {
            label: 'Enterprise grid',
            competitor: 'Atlas Cloud',
            score: 90,
            gap: 'manuell governance',
            window: '45 dagar'
        }
    }
};

function calculateApexProfile(state = {}) {
    const vectorKey = state.vector || 'velocity';
    const tempoKey = state.tempo || 'pulse';
    const horizonKey = state.horizon || 'launch';
    const boosterKeys = Array.from(state.boosters || []);

    const vector = APEX_SUITE.vectors[vectorKey] || APEX_SUITE.vectors.velocity;
    const tempo = APEX_SUITE.tempos[tempoKey] || APEX_SUITE.tempos.pulse;
    const horizon = APEX_SUITE.horizons[horizonKey] || APEX_SUITE.horizons.launch;

    const boosterDetails = boosterKeys
        .map((key) => ({ key, data: APEX_SUITE.boosters[key] }))
        .filter((entry) => Boolean(entry.data));

    const boostersList = boosterDetails.map((entry) => entry.data.label);
    const boostersText = boostersList.length ? boostersList.join(' + ') : 'basprogrammet';
    const totalLift = boosterDetails.reduce((sum, entry) => sum + (entry.data.lift || 0), 0);
    const score = Math.round((vector.baseScore || 0) + (tempo.mod || 0) + totalLift);
    const delta = score - (horizon.score || 0);
    const safeDelta = Math.abs(delta);
    const horizonScore = horizon.score || 0;
    const windowText = tempo.window || horizon.window || '30 dagar';

    const context = {
        vectorLabel: vector.label,
        focusName: vector.focus,
        tempoLabel: tempo.label,
        tempoWindow: windowText,
        tempoNote: tempo.note,
        horizonLabel: horizon.label,
        horizonWindow: horizon.window,
        competitorLabel: horizon.competitor,
        competitorGap: horizon.gap,
        boostersList,
        boostersText,
        score,
        delta,
        safeDelta,
        horizonScore,
        windowText
    };

    const metricsTemplate = {
        cadence: '',
        automation: '',
        signal: '',
        revenue: ''
    };

    Object.entries(vector.metrics || {}).forEach(([key, value]) => {
        if (typeof value === 'function') {
            metricsTemplate[key] = value(context);
        } else {
            metricsTemplate[key] = value;
        }
    });

    const plays = (vector.plays || [])
        .map((entry) => (typeof entry === 'function' ? entry(context) : entry))
        .filter(Boolean);

    const boosterInsights = boosterDetails.length
        ? boosterDetails.map((entry) => `${entry.data.label} – ${entry.data.play}`)
        : ['Lägg till boosters för att låsa upp extra insikter.'];

    const boosterPayloads = boosterDetails.length
        ? boosterDetails.map((entry) => `${entry.data.label}: ${entry.data.pitch}`)
        : ['Aktivera boosters för extra lyft.'];

    const title = typeof vector.title === 'function' ? vector.title(context) : vector.title;
    const summary = typeof vector.summary === 'function' ? vector.summary(context) : vector.summary;
    const effect = typeof vector.effect === 'function' ? vector.effect(context) : vector.effect;
    const tag = typeof vector.tag === 'function' ? vector.tag(context) : vector.tag;

    const blueprintSource = vector.blueprint
        ? vector.blueprint(context)
        : plays.length
        ? plays
        : [];
    const blueprint = Array.isArray(blueprintSource)
        ? blueprintSource.filter(Boolean)
        : [String(blueprintSource)].filter(Boolean);

    const metricLines = Object.entries(metricsTemplate)
        .map(([key, value]) => ({ key, value }))
        .filter((entry) => Boolean(entry.value))
        .map((entry) => {
            const labels = {
                cadence: 'Kadens',
                automation: 'Automation',
                signal: 'Signal',
                revenue: 'Revenue'
            };
            const label = labels[entry.key] || entry.key;
            return `- ${label}: ${entry.value}`;
        });

    const actionLines = plays.length
        ? plays.map((play) => `- ${play}`)
        : ['- Aktivera boosters för att generera åtgärdslistor.'];

    const payloadLines = [
        tag,
        title,
        `Score: ${score} (Δ ${delta >= 0 ? '+' : ''}${delta} vs ${horizon.competitor})`,
        '',
        summary,
        ''
    ];

    if (metricLines.length) {
        payloadLines.push('Nyckeltal:', ...metricLines, '');
    }

    payloadLines.push('Åtgärder:', ...actionLines, '', 'Boosters:');
    payloadLines.push(...boosterPayloads.map((entry) => `- ${entry}`));

    if (effect) {
        payloadLines.push('', effect);
    }

    return {
        tag,
        title,
        summary,
        effect,
        focus: vector.focus,
        window: windowText,
        score,
        delta,
        metrics: metricsTemplate,
        plays,
        boosters: boosterInsights,
        boosterPayloads,
        payload: payloadLines.join('\n'),
        blueprint
    };
}

function setupApexLabs() {
    const labs = document.querySelectorAll('[data-apex-lab]');
    if (!labs.length) return;

    labs.forEach((lab) => {
        const vectorSelect = lab.querySelector('[data-apex-vector]');
        const horizonSelect = lab.querySelector('[data-apex-horizon]');
        const tempoButtons = lab.querySelectorAll('[data-apex-tempo]');
        const boosterInputs = lab.querySelectorAll('[data-apex-booster]');
        const tagNode = lab.querySelector('[data-apex-tag]');
        const titleNode = lab.querySelector('[data-apex-title]');
        const summaryNode = lab.querySelector('[data-apex-summary]');
        const focusNode = lab.querySelector('[data-apex-focus]');
        const windowNode = lab.querySelector('[data-apex-window]');
        const scoreNode = lab.querySelector('[data-apex-score]');
        const deltaNode = lab.querySelector('[data-apex-delta]');
        const metricsNodes = lab.querySelectorAll('[data-apex-metric]');
        const playsNode = lab.querySelector('[data-apex-plays]');
        const boostersNode = lab.querySelector('[data-apex-boosters]');
        const copyButton = lab.querySelector('[data-apex-copy]');
        const statusNode = lab.querySelector('[data-apex-status]');
        const applyButton = lab.querySelector('[data-apex-apply]');

        const state = {
            vector: vectorSelect?.value || lab.getAttribute('data-apex-default-vector') || 'velocity',
            horizon: horizonSelect?.value || lab.getAttribute('data-apex-default-horizon') || 'launch',
            tempo:
                lab.querySelector('[data-apex-tempo].is-active')?.getAttribute('data-apex-tempo') ||
                lab.getAttribute('data-apex-default-tempo') ||
                'pulse',
            boosters: new Set(
                Array.from(boosterInputs)
                    .filter((input) => input instanceof HTMLInputElement && input.checked)
                    .map((input) => input.getAttribute('data-apex-booster'))
                    .filter(Boolean)
            )
        };

        let statusTimeout = null;

        const render = () => {
            const profile = calculateApexProfile(state);
            if (tagNode) tagNode.textContent = profile.tag || '';
            if (titleNode) titleNode.textContent = profile.title || '';
            if (summaryNode) summaryNode.textContent = profile.summary || '';
            if (focusNode) focusNode.textContent = profile.focus || '';
            if (windowNode) windowNode.textContent = profile.window || '';
            if (scoreNode) scoreNode.textContent = String(profile.score || 0);
            if (deltaNode) {
                const deltaValue = profile.delta || 0;
                const deltaText = deltaValue >= 0 ? `+${deltaValue}` : String(deltaValue);
                deltaNode.textContent = deltaText;
            }

            metricsNodes.forEach((node) => {
                const key = node.getAttribute('data-apex-metric');
                if (!key) return;
                const value = profile.metrics?.[key];
                node.textContent = value || '—';
            });

            if (playsNode) {
                playsNode.innerHTML = '';
                const items = profile.plays && profile.plays.length
                    ? profile.plays
                    : ['Lägg till boosters för att generera taktiska steg.'];
                items.forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    playsNode.appendChild(li);
                });
            }

            if (boostersNode) {
                boostersNode.innerHTML = '';
                profile.boosters.forEach((entry) => {
                    const li = document.createElement('li');
                    li.textContent = entry;
                    boostersNode.appendChild(li);
                });
            }

            if (copyButton) {
                copyButton.setAttribute('data-apex-payload', profile.payload || '');
            }

            if (applyButton) {
                applyButton.setAttribute('data-apex-blueprint', (profile.blueprint || []).join('\n'));
            }
        };

        const showStatus = (message) => {
            if (!statusNode) return;
            statusNode.textContent = message;
            if (statusTimeout) {
                clearTimeout(statusTimeout);
            }
            statusTimeout = setTimeout(() => {
                statusNode.textContent = '';
            }, 2800);
        };

        vectorSelect?.addEventListener('change', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLSelectElement)) return;
            state.vector = target.value;
            render();
        });

        horizonSelect?.addEventListener('change', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLSelectElement)) return;
            state.horizon = target.value;
            render();
        });

        tempoButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const tempoKey = button.getAttribute('data-apex-tempo');
                if (!tempoKey) return;
                state.tempo = tempoKey;
                tempoButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
                render();
            });
        });

        boosterInputs.forEach((input) => {
            input.addEventListener('change', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLInputElement)) return;
                const key = target.getAttribute('data-apex-booster');
                if (!key) return;
                if (target.checked) {
                    state.boosters.add(key);
                } else {
                    state.boosters.delete(key);
                }
                render();
            });
        });

        copyButton?.addEventListener('click', async () => {
            const payload = copyButton.getAttribute('data-apex-payload');
            if (!payload) return;
            try {
                await navigator.clipboard.writeText(payload);
                showStatus('Apex-plan kopierad ✅');
            } catch (error) {
                showStatus('Kunde inte kopiera automatiskt');
            }
        });

        render();
    });
}

const SUPREMACY_CONFIG = {
    arenas: {
        acquisition: {
            label: 'Förvärv',
            gapKey: 'acquisition',
            focus: 'Pipeline ignition',
            summary: 'Bygg automatiserade attackvågor som fångar varje lead inom minuter.',
            base: 360,
            window: 4,
            actions: [
                'Synka Profit Command Center med live lead flow.',
                'Auto-personalisera CTA:er med Narrative Lab payloads.',
                'Aktivera blitz-onboarding via Quantum Reactor.'
            ],
            effect: 'Ger en dominansloop i toppen av tratten.'
        },
        expansion: {
            label: 'Expansion',
            gapKey: 'expansion',
            focus: 'Expansion lock',
            summary: 'Skapa uppgraderingsbanor som driver ARR i varje segment.',
            base: 345,
            window: 5,
            actions: [
                'Kartlägg expansion triggers i Apex Mesh.',
                'Lås upp partnerboosters för tvärfunktionella upsells.',
                'Signalera ROI i varje delning genom Dominanslabbet.'
            ],
            effect: 'Håller konkurrenter ute från expansionsfönster.'
        },
        retention: {
            label: 'Retention',
            gapKey: 'retention',
            focus: 'Lojalitets-sköld',
            summary: 'Automatisera success loops och prediktiva varningar.',
            base: 330,
            window: 6,
            actions: [
                'Aktivera success autopilot i Growth Ops Console.',
                'Bygg hälsoinsikter i Vision Lab dashboards.',
                'Planera community rituals med Profit Lab.'
            ],
            effect: 'Stänger churn och förlänger kundlivscykeln.'
        }
    },
    strikes: {
        override: {
            label: 'Override Blitz',
            base: 130,
            focus: 'Shock acceleration',
            window: 0,
            summary: 'Chockstarta kampanjer med 48h intensitet och AI-copy.',
            actions: [
                'Trigga 48h override-sprint mot heta konton.',
                'Lägg AI-copy payloads i varje CTA och outreach-sekvens.'
            ],
            effect: 'Skapar momentumspik inom timmar.',
            title: ({ competitorLabel, arenaLabel }) => `Överkör ${competitorLabel} i ${arenaLabel.toLowerCase()}`
        },
        fortress: {
            label: 'Fortress Orbit',
            base: 140,
            focus: 'Defence orbit',
            window: 2,
            summary: 'Bygg resilienta playbooks som låser in kunder över längre fönster.',
            actions: [
                'Synka retentionsritualer i hela teamet.',
                'Rulla ut skyddsvallar i Vision Studio och Success Console.'
            ],
            effect: 'Ger långsiktigt fäste och högre nettoretention.',
            title: ({ competitorLabel, arenaLabel }) => `Lås ${arenaLabel.toLowerCase()} innan ${competitorLabel} reagerar`
        },
        singularity: {
            label: 'Singularity Flow',
            base: 155,
            focus: 'Self-optimising stream',
            window: 3,
            summary: 'Autonomi som självjusterar beslut i realtid.',
            actions: [
                'Aktivera AI-signaler som omkalibrerar varje timme.',
                'Länka PostHog och Reactor för självoptimering.'
            ],
            effect: 'Accelererar marginalerna automatiskt.',
            title: ({ competitorLabel, arenaLabel }) => `Skapa en singularitetsloop i ${arenaLabel.toLowerCase()} vs ${competitorLabel}`
        }
    },
    boosters: {
        signals: {
            label: 'Signal Storm',
            lift: 24,
            focus: 'Signalsynk',
            action: 'Mata Edge Radar-data direkt in i Supremacy-planen.',
            effect: 'Ger live-insikter att slå konkurrenter med.'
        },
        alliances: {
            label: 'Alliance Overdrive',
            lift: 22,
            focus: 'Partnerkraft',
            action: 'Mobilisera partner mesh för koordinerade kampanjer.',
            effect: 'Öppnar nya kanaler med samlad distribution.'
        },
        automation: {
            label: 'Revenue Automation Grid',
            lift: 20,
            focus: 'Automation',
            action: 'Bygg revenue-automation som låser konvertering i varje fas.',
            effect: 'Tar bort manuella flaskhalsar och ökar marginalerna.'
        },
        success: {
            label: 'Success Pulse',
            lift: 18,
            focus: 'Success loops',
            action: 'Rulla ut proaktiva successritualer för VIP-konton.',
            effect: 'Driver lojalitet och expansion parallellt.'
        }
    }
};

function setupSupremacyLab() {
    const labs = document.querySelectorAll('[data-supremacy-lab]');
    if (!labs.length) return;

    labs.forEach((lab) => {
        const competitorSelect = lab.querySelector('[data-supremacy-competitor]');
        const arenaSelect = lab.querySelector('[data-supremacy-arena]');
        const strikeButtons = lab.querySelectorAll('[data-supremacy-strike]');
        const boosterInputs = lab.querySelectorAll('[data-supremacy-booster]');
        const ambitionRange = lab.querySelector('[data-supremacy-ambition]');
        const levelNode = lab.querySelector('[data-supremacy-level]');
        const tagNode = lab.querySelector('[data-supremacy-tag]');
        const titleNode = lab.querySelector('[data-supremacy-title]');
        const summaryNode = lab.querySelector('[data-supremacy-summary]');
        const scoreNode = lab.querySelector('[data-supremacy-score]');
        const deltaNode = lab.querySelector('[data-supremacy-delta]');
        const windowNode = lab.querySelector('[data-supremacy-window]');
        const focusNode = lab.querySelector('[data-supremacy-focus]');
        const actionsList = lab.querySelector('[data-supremacy-actions]');
        const effectNode = lab.querySelector('[data-supremacy-effect]');
        const copyButton = lab.querySelector('[data-supremacy-copy]');
        const statusNode = lab.querySelector('[data-supremacy-status]');
        const applyButton = lab.querySelector('[data-supremacy-apply]');

        let statusTimeout = null;
        let activeStrike =
            lab.querySelector('[data-supremacy-strike].is-active')?.getAttribute('data-supremacy-strike') || 'override';

        const showStatus = (message) => {
            if (!statusNode) return;
            statusNode.textContent = message;
            if (statusTimeout) {
                clearTimeout(statusTimeout);
            }
            statusTimeout = window.setTimeout(() => {
                statusNode.textContent = '';
            }, 2800);
        };

        const computeCompetitorScore = (competitorKey, arenaKey) => {
            const competitor = DOMINANCE_DATA?.competitors?.[competitorKey];
            const stage = competitor?.benchmarks?.[arenaKey];
            const scores = stage?.score ? Object.values(stage.score) : [];
            if (!scores.length) return 260;
            const average =
                scores.reduce((total, value) => total + (typeof value === 'number' ? value : Number(value) || 0), 0) /
                scores.length;
            return Math.round(average * 4);
        };

        const update = () => {
            const competitorKey = competitorSelect?.value || 'atlas';
            const arenaKey = arenaSelect?.value || 'acquisition';
            const ambition = Number(ambitionRange?.value || 3);
            if (levelNode) levelNode.textContent = String(ambition);

            const arena = SUPREMACY_CONFIG.arenas[arenaKey] || SUPREMACY_CONFIG.arenas.acquisition;
            const strike = SUPREMACY_CONFIG.strikes[activeStrike] || SUPREMACY_CONFIG.strikes.override;

            const activeBoosters = Array.from(boosterInputs)
                .filter((input) => input instanceof HTMLInputElement && input.checked)
                .map((input) => input.getAttribute('data-supremacy-booster'))
                .filter(Boolean);

            const boosterLift = activeBoosters.reduce(
                (total, key) => total + (SUPREMACY_CONFIG.boosters[key]?.lift || 0),
                0
            );

            const competitorLabel =
                DOMINANCE_DATA?.competitors?.[competitorKey]?.label || 'konkurrenten';
            const gap = DOMINANCE_DATA?.competitors?.[competitorKey]?.gaps?.[arena.gapKey] || 'deras svaga punkt';
            const boosterLabels = activeBoosters
                .map((key) => SUPREMACY_CONFIG.boosters[key]?.label)
                .filter(Boolean);

            const score = Math.max(240, Math.round(arena.base + strike.base + ambition * 18 + boosterLift));
            const rivalScore = computeCompetitorScore(competitorKey, arena.gapKey);
            const deltaValue = score - rivalScore;
            const deltaText = deltaValue >= 0 ? `+${deltaValue}` : String(deltaValue);
            const windowValue = Math.max(2, arena.window + strike.window + ambition);
            const windowText = `${windowValue} veckor`;

            const focusParts = [arena.focus, strike.focus]
                .concat(activeBoosters.map((key) => SUPREMACY_CONFIG.boosters[key]?.focus))
                .filter(Boolean);
            const focusText = focusParts.join(' · ') || arena.focus;

            const summaryParts = [
                arena.summary,
                strike.summary,
                boosterLabels.length
                    ? `Boosters aktiverade: ${boosterLabels.join(', ')}.`
                    : 'Lägg till boosters för maximal dominans.',
                `${competitorLabel} fastnar i ${gap}.`
            ];
            const summaryText = summaryParts.filter(Boolean).join(' ');

            const actions = [
                ...arena.actions,
                ...strike.actions,
                ...activeBoosters
                    .map((key) => SUPREMACY_CONFIG.boosters[key]?.action)
                    .filter(Boolean),
                `Neutralisera ${competitorLabel}s ${gap} med Supremacy-planen.`
            ];

            const uniqueActions = [...new Set(actions.filter(Boolean))];

            if (actionsList) {
                actionsList.innerHTML = '';
                (uniqueActions.length ? uniqueActions : ['Aktivera boosters för att generera drag.']).forEach((action) => {
                    const li = document.createElement('li');
                    li.textContent = action;
                    actionsList.appendChild(li);
                });
            }

            const boosterEffects = activeBoosters
                .map((key) => SUPREMACY_CONFIG.boosters[key]?.effect)
                .filter(Boolean);
            const effectParts = [strike.effect, arena.effect, ...boosterEffects, `Prognosfönster: ${windowText}.`].filter(Boolean);
            const effectText = effectParts.join(' ');

            const tagText = `${arena.label} · ${strike.label}`;
            const titleText =
                typeof strike.title === 'function'
                    ? strike.title({ competitorLabel, arenaLabel: arena.label })
                    : strike.label;

            if (tagNode) tagNode.textContent = tagText;
            if (titleNode) titleNode.textContent = titleText;
            if (summaryNode) summaryNode.textContent = summaryText;
            if (scoreNode) scoreNode.textContent = String(score);
            if (deltaNode) deltaNode.textContent = deltaText;
            if (windowNode) windowNode.textContent = windowText;
            if (focusNode) focusNode.textContent = focusText;
            if (effectNode) effectNode.textContent = effectText;

            const payloadLines = [
                `${tagText}`,
                `Supremacy-index: ${score}`,
                `Δ mot ${competitorLabel}: ${deltaText}`,
                `Fönster: ${windowText}`,
                `Edge: ${focusText}`,
                '',
                'Signaturdrag:',
                ...uniqueActions.map((action) => `- ${action}`),
                '',
                `Effekt: ${effectText}`
            ];

            const payload = payloadLines.join('\n');
            if (copyButton) {
                copyButton.setAttribute('data-supremacy-payload', payload);
            }
            if (applyButton) {
                applyButton.setAttribute('data-supremacy-blueprint', uniqueActions.join('\n'));
            }
        };

        competitorSelect?.addEventListener('change', update);
        arenaSelect?.addEventListener('change', update);
        ambitionRange?.addEventListener('input', update);

        strikeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const key = button.getAttribute('data-supremacy-strike');
                if (!key) return;
                activeStrike = key;
                strikeButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
                update();
            });
        });

        boosterInputs.forEach((input) => {
            input.addEventListener('change', update);
        });

        copyButton?.addEventListener('click', async () => {
            const payload = copyButton.getAttribute('data-supremacy-payload');
            if (!payload) return;
            try {
                await navigator.clipboard.writeText(payload);
                showStatus('Supremacy-plan kopierad ✅');
            } catch (error) {
                showStatus('Kunde inte kopiera automatiskt');
            }
        });

        update();
    });
}

function setupDominanceLab() {
    const lab = document.querySelector('[data-dominance-lab]');
    if (!lab) return;

    const modeButtons = lab.querySelectorAll('[data-dominance-mode]');
    const focusSelect = lab.querySelector('[data-dominance-focus]');
    const levelInput = lab.querySelector('[data-dominance-level]');
    const levelValue = lab.querySelector('[data-dominance-level-value]');
    const signalInputs = lab.querySelectorAll('[data-dominance-signal]');
    const titleNode = lab.querySelector('[data-dominance-title]');
    const summaryNode = lab.querySelector('[data-dominance-summary]');
    const tagNode = lab.querySelector('[data-dominance-tag]');
    const scoreNode = lab.querySelector('[data-dominance-score]');
    const deltaNode = lab.querySelector('[data-dominance-delta]');
    const focusNode = lab.querySelector('[data-dominance-focus-output]');
    const edgesNode = lab.querySelector('[data-dominance-edges]');
    const tableBody = lab.querySelector('[data-dominance-table]');
    const copyButton = lab.querySelector('[data-dominance-copy]');
    const statusNode = lab.querySelector('[data-dominance-status]');

    let statusTimeout = null;

    const state = {
        mode:
            Array.from(modeButtons).find((btn) => btn.classList.contains('is-active'))?.getAttribute(
                'data-dominance-mode'
            ) || 'launch',
        focus: focusSelect?.value || 'acquisition',
        level: Number(levelInput?.value || 4),
        signals: new Set(
            Array.from(signalInputs)
                .filter((input) => input.checked)
                .map((input) => input.getAttribute('data-dominance-signal'))
                .filter(Boolean)
        )
    };

    const update = () => {
        const profile = computeDominanceProfile({
            mode: state.mode,
            focus: state.focus,
            level: state.level,
            signals: state.signals
        });
        const { scenario, focus, tempo, rows, context } = profile;

        if (levelValue) levelValue.textContent = tempo?.label || '';
        if (tagNode) tagNode.textContent = `${context.scenarioTag} · ${focus.label}`;
        if (titleNode) titleNode.textContent = formatDominanceValue(focus.title, context);
        if (summaryNode) summaryNode.textContent = formatDominanceValue(focus.summary, context);
        if (scoreNode) scoreNode.textContent = String(context.ourScore);
        if (deltaNode) {
            const deltaText = context.delta >= 0 ? `+${context.delta}` : String(context.delta);
            deltaNode.textContent = deltaText;
        }
        if (focusNode) focusNode.textContent = focus.focus;

        if (edgesNode) {
            edgesNode.innerHTML = '';
            (focus.edges || [])
                .map((entry) => formatDominanceValue(entry, context))
                .filter(Boolean)
                .forEach((entry) => {
                    const li = document.createElement('li');
                    li.textContent = entry;
                    edgesNode.appendChild(li);
                });
        }

        if (tableBody) {
            const metrics = focus.metrics || {};
            const ourRow = {
                name: 'App & Hemsida',
                activation: formatDominanceValue(metrics.activation, context),
                automation: formatDominanceValue(metrics.automation, context),
                ai: formatDominanceValue(metrics.ai, context),
                revenue: formatDominanceValue(metrics.revenue, context),
                score: context.ourScore,
                accent: true
            };
            const competitorRows = rows.map((row) => ({
                name: row.competitor?.label || row.key,
                activation: row.bench?.activation || '–',
                automation: row.bench?.automation || '–',
                ai: row.bench?.ai || '–',
                revenue: row.bench?.revenue || '–',
                score: Math.round(row.score)
            }));

            const renderRow = (row) => `<tr${row.accent ? ' data-dominance-best' : ''}>
                    <th scope="row">${row.name}</th>
                    <td>${row.activation}</td>
                    <td>${row.automation}</td>
                    <td>${row.ai}</td>
                    <td>${row.revenue}</td>
                    <td>${row.score}</td>
                </tr>`;

            tableBody.innerHTML = [ourRow, ...competitorRows].map(renderRow).join('');
        }

        if (copyButton) {
            const edges = (focus.edges || [])
                .map((entry) => formatDominanceValue(entry, context))
                .filter(Boolean)
                .map((entry) => `- ${entry}`);
            const plays = (focus.plays || [])
                .map((entry) => formatDominanceValue(entry, context))
                .filter(Boolean)
                .map((entry) => `- ${entry}`);
            const payloadLines = [
                `${scenario.label} · ${focus.label}`,
                `Score: ${context.ourScore} (Δ ${context.delta >= 0 ? `+${context.delta}` : context.delta})`,
                `Fokus: ${focus.focus}`,
                formatDominanceValue(focus.summary, context),
                '',
                'Edge:',
                ...edges,
                '',
                'Plan:',
                ...plays,
                '',
                formatDominanceValue(focus.effect, context)
            ];
            copyButton.setAttribute('data-dominance-payload', payloadLines.join('\n'));
        }
    };

    modeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-dominance-mode');
            if (!key) return;
            state.mode = key;
            modeButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
            update();
        });
    });

    focusSelect?.addEventListener('change', (event) => {
        state.focus = event.target.value;
        update();
    });

    levelInput?.addEventListener('input', (event) => {
        state.level = Number(event.target.value);
        update();
    });

    signalInputs.forEach((input) => {
        input.addEventListener('change', () => {
            const key = input.getAttribute('data-dominance-signal');
            if (!key) return;
            if (input.checked) {
                state.signals.add(key);
            } else {
                state.signals.delete(key);
            }
            update();
        });
    });

    const showStatus = (message) => {
        if (!statusNode) return;
        statusNode.textContent = message;
        if (statusTimeout) window.clearTimeout(statusTimeout);
        statusTimeout = window.setTimeout(() => {
            statusNode.textContent = '';
        }, 2400);
    };

    copyButton?.addEventListener('click', async () => {
        const payload = copyButton.getAttribute('data-dominance-payload');
        if (!payload) return;
        try {
            await navigator.clipboard.writeText(payload);
            showStatus('Dominansplan kopierad ✅');
        } catch (error) {
            showStatus('Kunde inte kopiera automatiskt');
        }
    });

    update();
}

function setupBenchmarkLab() {
    const lab = document.querySelector('[data-benchmark-lab]');
    if (!lab) return;

    const scenarioSelect = lab.querySelector('[data-benchmark-scenario]');
    const stageButtons = lab.querySelectorAll('[data-benchmark-stage]');
    const moduleInputs = lab.querySelectorAll('[data-benchmark-module]');
    const titleNode = lab.querySelector('[data-benchmark-title]');
    const tagNode = lab.querySelector('[data-benchmark-tag]');
    const scoreNode = lab.querySelector('[data-benchmark-score]');
    const deltaNode = lab.querySelector('[data-benchmark-delta]');
    const edgeNode = lab.querySelector('[data-benchmark-edge]');
    const storyNode = lab.querySelector('[data-benchmark-story]');
    const actionsNode = lab.querySelector('[data-benchmark-actions]');
    const modulesNode = lab.querySelector('[data-benchmark-modules]');
    const copyButton = lab.querySelector('[data-benchmark-copy]');
    const statusNode = lab.querySelector('[data-benchmark-status]');

    let statusTimeout = null;

    const state = {
        scenario: scenarioSelect?.value || 'launch',
        stage:
            Array.from(stageButtons).find((btn) => btn.classList.contains('is-active'))?.getAttribute(
                'data-benchmark-stage'
            ) || 'acquisition',
        modules: new Set(
            Array.from(moduleInputs)
                .filter((input) => input.checked)
                .map((input) => input.getAttribute('data-benchmark-module'))
                .filter(Boolean)
        )
    };

    const update = () => {
        const profile = computeDominanceProfile({
            mode: state.scenario,
            focus: state.stage,
            level: 4,
            signals: state.modules
        });
        const { scenario, focus, context } = profile;

        if (tagNode) tagNode.textContent = `${context.scenarioTag} · ${focus.label}`;
        if (titleNode) titleNode.textContent = formatDominanceValue(focus.title, context);
        if (scoreNode) scoreNode.textContent = String(context.ourScore);
        if (deltaNode) {
            const deltaText = context.delta >= 0 ? `+${context.delta}` : String(context.delta);
            deltaNode.textContent = deltaText;
        }
        if (edgeNode) edgeNode.textContent = focus.focus;
        if (storyNode) storyNode.textContent = formatDominanceValue(focus.story || focus.summary, context);

        if (actionsNode) {
            actionsNode.innerHTML = '';
            (focus.plays || [])
                .map((entry) => formatDominanceValue(entry, context))
                .filter(Boolean)
                .forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    actionsNode.appendChild(li);
                });
        }

        if (modulesNode) {
            modulesNode.innerHTML = '';
            if (state.modules.size === 0) {
                const li = document.createElement('li');
                li.textContent = 'Välj boosters för att se modulrekommendationer.';
                modulesNode.appendChild(li);
            } else {
                state.modules.forEach((key) => {
                    const signal = DOMINANCE_DATA.signals?.[key];
                    if (!signal) return;
                    const li = document.createElement('li');
                    li.textContent = signal.action;
                    modulesNode.appendChild(li);
                });
            }
        }

        if (copyButton) {
            const actions = (focus.plays || [])
                .map((entry) => formatDominanceValue(entry, context))
                .filter(Boolean)
                .map((entry) => `- ${entry}`);
            const boosters = state.modules.size
                ? Array.from(state.modules).map((key) => {
                      const signal = DOMINANCE_DATA.signals?.[key];
                      return `- ${signal?.label || key}: ${signal?.action || ''}`.trim();
                  })
                : ['- Lägg till boosters för fler vinster.'];
            const payloadLines = [
                `${scenario.label} · ${focus.label}`,
                `Score: ${context.ourScore} (Δ ${context.delta >= 0 ? `+${context.delta}` : context.delta})`,
                `Fokus: ${focus.focus}`,
                formatDominanceValue(focus.story || focus.summary, context),
                '',
                'Åtgärder:',
                ...actions,
                '',
                'Boosters:',
                ...boosters,
                '',
                formatDominanceValue(focus.effect, context)
            ];
            copyButton.setAttribute('data-benchmark-payload', payloadLines.join('\n'));
        }
    };

    scenarioSelect?.addEventListener('change', (event) => {
        state.scenario = event.target.value;
        update();
    });

    stageButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-benchmark-stage');
            if (!key) return;
            state.stage = key;
            stageButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
            update();
        });
    });

    moduleInputs.forEach((input) => {
        input.addEventListener('change', () => {
            const key = input.getAttribute('data-benchmark-module');
            if (!key) return;
            if (input.checked) {
                state.modules.add(key);
            } else {
                state.modules.delete(key);
            }
            update();
        });
    });

    const showStatus = (message) => {
        if (!statusNode) return;
        statusNode.textContent = message;
        if (statusTimeout) window.clearTimeout(statusTimeout);
        statusTimeout = window.setTimeout(() => {
            statusNode.textContent = '';
        }, 2400);
    };

    copyButton?.addEventListener('click', async () => {
        const payload = copyButton.getAttribute('data-benchmark-payload');
        if (!payload) return;
        try {
            await navigator.clipboard.writeText(payload);
            showStatus('Benchmark-plan kopierad ✅');
        } catch (error) {
            showStatus('Kunde inte kopiera automatiskt');
        }
    });

    update();
}
