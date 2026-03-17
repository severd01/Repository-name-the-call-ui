export type ChoiceId = "A" | "B" | "C";

export type Clue = {
  title: string;
  result: string;
};

export type Decision = {
  id: ChoiceId;
  text: string;
};

export type Puzzle = {
  id: number;
  title: string;
  role: string;
  difficulty: string;
  scenario: string;
  image?: string;
  cluesRound1: Clue[];
  cluesRound2: Clue[];
  decisions: Decision[];
  correct: ChoiceId;
  expertAction: string;
  expertExplanation: string;
  lesson: string;
  outcomes: {
    A: string;
    B: string;
    C: string;
  };
};

export const puzzles: Puzzle[] = [
  
  {
    id: 3,
    title: "The Sick Family",
    role: "Emergency Room Doctor",
    difficulty: "Medium",
    scenario:
      "Three members of the same family arrive at the ER with headache, dizziness, nausea, and fatigue. None have fever. Flu is circulating in the community, so at first the symptoms seem routine.",
      image: "/images/sick-family.png",
    cluesRound1: [
      {
        title: "Ask where symptoms started",
        result: "All symptoms began earlier tonight while they were at home.",
      },
      {
        title: "Check flu exposure",
        result: "Coworkers recently had the flu.",
      },
      {
        title: "Check vital signs",
        result: "Vital signs appear mostly normal.",
      },
    ],
    cluesRound2: [
      {
        title: "Give oxygen briefly",
        result: "After oxygen, the patients feel noticeably better.",
      },
      {
        title: "Review symptom timing",
        result: "Symptoms developed gradually over several hours.",
      },
      {
        title: "Check oxygen monitor",
        result: "Pulse oximeter readings appear normal.",
      },
    ],
    decisions: [
      {
        id: "A",
        text: "Treat as food poisoning and discharge.",
      },
      {
        id: "B",
        text: "Treat as flu and discharge.",
      },
      {
        id: "C",
        text: "Investigate possible carbon monoxide exposure.",
      },
    ],
    correct: "C",
    expertAction:
      "Keep the family for evaluation and investigate carbon monoxide exposure.",
    expertExplanation:
      "Multiple people from the same home developing the same symptoms at the same time is a strong environmental pattern. Carbon monoxide poisoning often looks like flu or food poisoning.",
    lesson:
      "When several patients from one location get sick together, think environmental exposure.",
    outcomes: {
      A: "They are sent home, the exposure continues, and their condition may worsen overnight.",
      B: "They are discharged with a flu diagnosis while the real hazard remains active in their home.",
      C: "The environmental cause is identified and the family avoids further exposure.",
    },
  },

  {
    id: 4,
    title: "Eyes on the Pool",
    role: "Lifeguard",
    difficulty: "Medium",
    scenario:
      "You are lifeguarding at a busy public pool. A group of teenagers is splashing loudly in the deep end. At the far side of the pool, one swimmer is upright in the water facing the deck. Their arms are moving slightly at their sides and they are not making progress toward the wall, but they are not calling for help either.",
    cluesRound1: [
      {
        title: "Watch the noisy group",
        result: "The teenagers appear playful and coordinated.",
      },
      {
        title: "Check for calls for help",
        result: "No one is shouting or waving.",
      },
      {
        title: "Watch the quiet swimmer closely",
        result:
          "The swimmer remains upright and does not move toward the wall.",
      },
    ],
    cluesRound2: [
      {
        title: "Observe the swimmer's arm motion",
        result:
          "The swimmer's arms press down against the water in small repeated motions.",
      },
      {
        title: "Watch the group again",
        result: "The splashing continues, but it still looks playful.",
      },
      {
        title: "Recall drowning behavior",
        result:
          "Real drowning is often quiet and vertical rather than loud and dramatic.",
      },
    ],
    decisions: [
      {
        id: "A",
        text: "Go to the splashing teenagers first.",
      },
      {
        id: "B",
        text: "Keep scanning and wait for someone to signal clearly.",
      },
      {
        id: "C",
        text: "Approach the quiet swimmer immediately.",
      },
    ],
    correct: "C",
    expertAction: "Approach the quiet swimmer immediately.",
    expertExplanation:
      "Lifeguards are trained to recognize that real drowning is often silent. Upright body position, lack of forward progress, and subtle downward arm movements are danger signs.",
    lesson:
      "The most dangerous emergency is not always the loudest one.",
    outcomes: {
      A: "The teenagers were only playing while the truly distressed swimmer begins slipping underwater unnoticed.",
      B: "Waiting for a clear signal wastes precious time because drowning victims often cannot call out.",
      C: "The distressed swimmer is reached before disappearing below the surface.",
    },
  },

  {
    id: 5,
    title: "The Triage Decision",
    role: "Emergency Room Triage Nurse",
    difficulty: "Medium-Hard",
    scenario:
      "Three patients arrive at the emergency department at the same time. One elderly man has chest pain and shortness of breath. One adult has heavy bleeding from a cut arm. One child has a high fever and lethargy.",
    cluesRound1: [
      {
        title: "Assess chest pain patient",
        result:
          "Chest pain with shortness of breath may indicate a heart attack.",
      },
      {
        title: "Assess bleeding patient",
        result: "Bleeding is heavy but slowing with pressure.",
      },
      {
        title: "Assess the child",
        result: "The child has a high fever but is still breathing stably.",
      },
    ],
    cluesRound2: [
      {
        title: "Check heart history",
        result: "The elderly patient has a history of heart disease.",
      },
      {
        title: "Check bleeding control",
        result: "The bleeding remains manageable with pressure.",
      },
      {
        title: "Check child's breathing",
        result: "Breathing is elevated but currently stable.",
      },
    ],
    decisions: [
      {
        id: "A",
        text: "Treat the elderly patient with chest pain first.",
      },
      {
        id: "B",
        text: "Treat the bleeding patient first.",
      },
      {
        id: "C",
        text: "Treat the child first.",
      },
    ],
    correct: "A",
    expertAction: "Prioritize the elderly patient with chest pain first.",
    expertExplanation:
      "Triage focuses on who may deteriorate fastest. Possible cardiac events can become fatal within minutes, even if bleeding looks more dramatic.",
    lesson:
      "The most visually alarming patient is not always the most urgent one.",
    outcomes: {
      A: "The patient at highest risk of sudden deterioration is prioritized appropriately.",
      B: "The bleeding patient is helped first while a possible cardiac emergency waits too long.",
      C: "The child is seen first while the chest-pain patient risks a rapidly worsening cardiac event.",
    },
  },

  {
    id: 6,
    title: "The Storm Approach",
    role: "Commercial Airline Pilot",
    difficulty: "Medium-Hard",
    scenario:
      "You are the captain of a commercial flight preparing to land at a busy airport. Thunderstorms are approaching. Air traffic control says several aircraft landed successfully within the past ten minutes. The newest weather report shows increasing wind gusts and falling visibility. You have enough fuel to divert comfortably.",
    cluesRound1: [
      {
        title: "Check weather radar",
        result: "The storm cell is strengthening and moving toward the airport.",
      },
      {
        title: "Check recent landing reports",
        result: "Several flights landed successfully a few minutes ago.",
      },
      {
        title: "Check passenger connection impact",
        result: "A diversion would cause major delays for many passengers.",
      },
    ],
    cluesRound2: [
      {
        title: "Check wind reports",
        result: "Wind gusts near the runway have increased significantly.",
      },
      {
        title: "Check fuel status",
        result: "You have enough fuel to divert safely.",
      },
      {
        title: "Review airline pressure",
        result:
          "Operations would prefer a landing if conditions remain technically within limits.",
      },
    ],
    decisions: [
      {
        id: "A",
        text: "Continue the approach and land before the storm worsens.",
      },
      {
        id: "B",
        text: "Hold and wait for conditions to improve.",
      },
      {
        id: "C",
        text: "Divert to an alternate airport now.",
      },
    ],
    correct: "C",
    expertAction: "Divert before beginning the final approach.",
    expertExplanation:
      "Experienced pilots avoid pressing an approach when conditions are deteriorating quickly and a safe alternative exists. Trend matters more than what planes did ten minutes ago.",
    lesson:
      "Good decision-making often means abandoning the original plan before conditions become dangerous.",
    outcomes: {
      A: "The aircraft risks severe wind shear and an unstable approach.",
      B: "Holding may trap the flight in worsening weather as airport conditions degrade further.",
      C: "The flight diverts safely before the storm closes the window for a safe landing.",
    },
  },

  {
    id: 7,
    title: "The Quiet Breathing Problem",
    role: "Emergency Room Triage Nurse",
    difficulty: "Hard",
    scenario:
      "Three patients arrive together. One middle-aged man has severe rib pain after a fall. One teenager has a deep bleeding cut on the leg. One young woman is sitting quietly but breathing rapidly and speaking only in short sentences. She says she feels like she cannot get enough air.",
    cluesRound1: [
      {
        title: "Check rib injury patient",
        result: "The patient is in significant pain but has stable blood pressure.",
      },
      {
        title: "Check bleeding patient",
        result: "The bleeding is steady but slows with pressure.",
      },
      {
        title: "Check breathing patient",
        result: "Oxygen saturation is below normal.",
      },
    ],
    cluesRound2: [
      {
        title: "Listen to lungs",
        result:
          "Breath sounds are reduced on one side, suggesting possible lung collapse.",
      },
      {
        title: "Check rib patient breathing",
        result: "He is breathing shallowly because of pain.",
      },
      {
        title: "Check bleeding patient pulse",
        result: "Pulse is elevated but currently stable.",
      },
    ],
    decisions: [
      {
        id: "A",
        text: "Treat the man with severe rib pain first.",
      },
      {
        id: "B",
        text: "Treat the bleeding teenager first.",
      },
      {
        id: "C",
        text: "Treat the quietly struggling breathing patient first.",
      },
    ],
    correct: "C",
    expertAction: "Treat the breathing patient first.",
    expertExplanation:
      "Airway and breathing problems can deteriorate rapidly even when the patient looks calm. Quiet respiratory distress is often more urgent than visible pain or controllable bleeding.",
    lesson:
      "The least dramatic presentation can still be the most dangerous.",
    outcomes: {
      A: "Pain is addressed first while a potentially collapsing lung continues to worsen.",
      B: "Bleeding is treated first while the breathing emergency risks sudden decompensation.",
      C: "The respiratory emergency is recognized and managed before the patient crashes.",
    },
  },

  {
    id: 8,
    title: "The Strategic Customer",
    role: "Sales Executive",
    difficulty: "Hard",
    scenario:
      "A large customer representing a meaningful share of revenue asks to extend payment terms again, from Net 60 to Net 120, while promising future growth. Receivables have increased with the account, but the customer is still technically within limits.",
    cluesRound1: [
      {
        title: "Check payment behavior",
        result:
          "Accounting notes the customer now consistently pays near the due date instead of early.",
      },
      {
        title: "Check expansion news",
        result:
          "The company has been announcing acquisitions and aggressive growth plans.",
      },
      {
        title: "Check sales pressure",
        result:
          "Your sales team fears losing volume if you refuse the extension.",
      },
    ],
    cluesRound2: [
      {
        title: "Check credit team assessment",
        result:
          "The customer's credit profile was downgraded slightly last quarter.",
      },
      {
        title: "Check buyer confidence",
        result:
          "The buyer sounds optimistic and expects strong demand next quarter.",
      },
      {
        title: "Check competitive pressure",
        result:
          "Other suppliers may also be getting pressure to extend terms.",
      },
    ],
    decisions: [
      {
        id: "A",
        text: "Approve Net 120 terms to keep the business.",
      },
      {
        id: "B",
        text: "Decline and maintain Net 60 terms.",
      },
      {
        id: "C",
        text: "Offer a compromise at 90 days.",
      },
    ],
    correct: "B",
    expertAction: "Protect cash flow and maintain the existing terms.",
    expertExplanation:
      "Extending payment terms turns you into an unsecured lender. When warning signs grow, preserving financial safety matters more than chasing promised volume.",
    lesson:
      "Growth promises plus longer terms can be a distress signal, not an opportunity.",
    outcomes: {
      A: "Exposure increases significantly and a later bankruptcy creates a much larger loss.",
      B: "Some business may be lost, but financial exposure remains controlled.",
      C: "The compromise softens the risk but still increases exposure materially.",
    },
  },

  {
    id: 9,
    title: "The Bail Hearing",
    role: "Criminal Court Judge",
    difficulty: "Hard",
    scenario:
      "A defendant appears before you after an alleged armed robbery. Police say the suspect was found nearby with cash matching the amount stolen. The defendant has no prior violent convictions, missed one court appearance years ago, has a steady job, and lives locally with family.",
    cluesRound1: [
      {
        title: "Review criminal history",
        result: "The defendant has no prior violent convictions.",
      },
      {
        title: "Check local ties",
        result: "The defendant has stable local residence and employment.",
      },
      {
        title: "Review prosecution argument",
        result:
          "The prosecutor emphasizes the seriousness of the alleged offense.",
      },
    ],
    cluesRound2: [
      {
        title: "Review court appearance history",
        result:
          "The defendant missed one court date years ago but later resolved the case.",
      },
      {
        title: "Check bail practice",
        result:
          "Similar cases sometimes receive supervised release or moderate bail depending on risk.",
      },
      {
        title: "Consider public pressure",
        result:
          "Recent robbery coverage has increased public demand for harsh bail decisions.",
      },
    ],
    decisions: [
      {
        id: "A",
        text: "Deny bail and hold the defendant until trial.",
      },
      {
        id: "B",
        text: "Set a high cash bail.",
      },
      {
        id: "C",
        text: "Release under supervised conditions.",
      },
    ],
    correct: "C",
    expertAction:
      "Release under supervised conditions designed to manage risk.",
    expertExplanation:
      "Bail is meant to manage flight risk and public safety, not to punish before conviction. With local ties and no violent history, supervised release can be the least restrictive appropriate option.",
    lesson:
      "The harshest option is not always the most legally appropriate one.",
    outcomes: {
      A: "The defendant is jailed pretrial even though the risk profile may not justify detention.",
      B: "High bail effectively becomes detention if the defendant cannot afford it.",
      C: "Risk is managed while still respecting the presumption of innocence.",
    },
  },

  {
    id: 10,
    title: "The Charging Decision",
    role: "Prosecutor",
    difficulty: "Hard",
    scenario:
      "Police arrest a suspect for a late-night convenience store robbery. A clerk identified the suspect, and the suspect was found two blocks away ten minutes later. But the surveillance video is blurry, no weapon has been recovered, and the suspect denies involvement.",
    cluesRound1: [
      {
        title: "Review eyewitness identification",
        result:
          "The identification was made shortly after a stressful event, which can affect accuracy.",
      },
      {
        title: "Check video evidence",
        result: "The surveillance footage does not clearly show the face.",
      },
      {
        title: "Review officer confidence",
        result:
          "The arresting officers strongly believe they caught the right person.",
      },
    ],
    cluesRound2: [
      {
        title: "Check physical evidence",
        result:
          "No weapon or clearly traceable stolen property has been recovered.",
      },
      {
        title: "Review charging standard",
        result:
          "Prosecutors must consider whether the case can be proven beyond a reasonable doubt.",
      },
      {
        title: "Consider public pressure",
        result: "There is pressure to charge quickly because of local media attention.",
      },
    ],
    decisions: [
      {
        id: "A",
        text: "File charges immediately.",
      },
      {
        id: "B",
        text: "Delay filing while investigators gather more evidence.",
      },
      {
        id: "C",
        text: "Decline charges completely now.",
      },
    ],
    correct: "B",
    expertAction:
      "Delay filing until the evidence is strong enough to support conviction.",
    expertExplanation:
      "A prosecutor's job is not simply to accuse, but to pursue cases that can be proven fairly and reliably in court. Filing too early with weak evidence can destroy the case.",
    lesson:
      "The right legal decision often turns on proof, not suspicion.",
    outcomes: {
      A: "The weak case may collapse at trial and lead to acquittal.",
      B: "The investigation continues and the case can be strengthened before charges are filed.",
      C: "Potentially valid charges are abandoned before the evidence is fully developed.",
    },
  },

  {
    id: 11,
    title: "The Ash Cloud",
    role: "Airline Captain",
    difficulty: "Hard",
    scenario:
      "A Boeing 747 is cruising at high altitude at night when all four engines begin losing power and fail. The aircraft is now gliding. Outside the cockpit windows the air looks hazy and there is a faint smell of smoke, but the crew does not yet know what caused the failure.",
    cluesRound1: [
      {
        title: "Check engine instruments",
        result:
          "Engine temperatures spiked rapidly before power was lost.",
      },
      {
        title: "Check cabin conditions",
        result: "Passengers report a smoky smell but there is no visible fire.",
      },
      {
        title: "Check weather radar",
        result:
          "Radar does not show a major storm cell in the area.",
      },
    ],
    cluesRound2: [
      {
        title: "Look outside carefully",
        result:
          "A faint glowing haze is visible outside the cockpit windows.",
      },
      {
        title: "Review glide capability",
        result:
          "The aircraft can glide many miles while descending.",
      },
      {
        title: "Review restart assumptions",
        result:
          "Normal restart procedures assume the surrounding air is not contaminated.",
      },
    ],
    decisions: [
      {
        id: "A",
        text: "Climb to try to escape the problem area.",
      },
      {
        id: "B",
        text: "Maintain altitude and attempt restart there.",
      },
      {
        id: "C",
        text: "Descend to lower altitude and attempt restart.",
      },
    ],
    correct: "C",
    expertAction:
      "Descend out of the contaminated air and attempt restart procedures.",
    expertExplanation:
      "Volcanic ash can melt inside jet engines and cause flameout. Restart is more likely once the aircraft descends into cleaner air.",
    lesson:
      "Sometimes the right move is to leave the environment causing the problem before fixing the system.",
    outcomes: {
      A: "Climbing keeps the aircraft in the ash cloud and reduces the chance of engine recovery.",
      B: "Maintaining altitude leaves the aircraft in contaminated air where restarts are less likely to succeed.",
      C: "Descending moves the aircraft into cleaner air, improving the chance of restarting the engines.",
    },
  },

  {
    id: 12,
    title: "Cold War Radar Alarm",
    role: "Early Warning Officer",
    difficulty: "Expert",
    scenario:
      "A Soviet early-warning system reports five nuclear missiles launched from the United States. The computer shows very high confidence, but ground radar has not confirmed anything yet.",
    cluesRound1: [
      {
        title: "Check radar confirmation",
        result: "Ground radar has not detected incoming missiles.",
      },
      {
        title: "Check number of missiles",
        result: "Only five missiles are reported.",
      },
      {
        title: "Review computer confidence",
        result: "The system reports extremely high confidence.",
      },
    ],
    cluesRound2: [
      {
        title: "Review strategic doctrine",
        result:
          "A real first strike would likely involve hundreds of missiles, not five.",
      },
      {
        title: "Check satellite reliability",
        result: "The warning satellite system is relatively new.",
      },
      {
        title: "Review false-alarm history",
        result:
          "Early warning systems have produced erroneous alerts before.",
      },
    ],
    decisions: [
      {
        id: "A",
        text: "Report a confirmed nuclear attack immediately.",
      },
      {
        id: "B",
        text: "Wait for radar confirmation.",
      },
      {
        id: "C",
        text: "Treat the alert as a likely system malfunction.",
      },
    ],
    correct: "C",
    expertAction:
      "Judge the alert as a likely false alarm and avoid escalating it as a confirmed attack.",
    expertExplanation:
      "The number of missiles, lack of radar confirmation, and strategic inconsistency all suggested the data did not match a real first strike. Human judgment mattered more than automated confidence.",
    lesson:
      "Expert decision-making often means recognizing when the system's answer does not fit reality.",
    outcomes: {
      A: "Escalating the warning as real could contribute to catastrophic retaliatory decisions.",
      B: "Waiting for more confirmation is safer than immediate escalation, but still treats the alert as unresolved rather than clearly suspicious.",
      C: "The officer correctly interprets the warning as a malfunction and avoids a disastrous escalation.",
    },
  },
];