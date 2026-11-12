import { ListeningTask, ListeningQuestion } from '../../src/types/index.js';

export const SEED_LISTENING_TASKS: ListeningTask[] = [
  {
    id: 'ls_task_1',
    title: 'University Accommodation Booking Service',
    section: 1,
    sectionDescription: 'Section 1: A telephone conversation between an international student and a student housing officer discussing accommodation options and lease terms.',
    accent: 'British English',
    difficulty: 'Band 5.5-6.5',
    audioDurationSeconds: 180,
    audioTranscript: `Officer: Good morning, University Housing Office. How may I assist you today?
Student: Hello. My name is Maya, and I've been accepted into the postgraduate Environmental Science program starting this autumn. I'm calling to inquire about on-campus residential options.
Officer: Congratulations on your admission, Maya! We have several residential halls available for postgraduates. Are you looking for self-catered or fully-catered accommodations?
Student: Definitely self-catered, please. I prefer preparing my own meals. Ideally, I'd like an en-suite room with a private bathroom.
Officer: Certainly. Our premier option for postgraduates is Meadowbrook Hall. It offers private single en-suite study bedrooms grouped into clusters of five, sharing a spacious kitchen and lounge.
Student: That sounds ideal. What is the weekly rental fee for Meadowbrook?
Officer: For the standard academic calendar year, it is one hundred and eighty-five pounds per week, which includes high-speed fiber broadband, water, electricity, and central heating.
Student: Excellent. And what about security deposit requirements?
Officer: You will need to lodge a refundable bond of three hundred and fifty pounds prior to arrival, specifically before the fifteenth of August.
Student: Understood. Is there laundry facilities on site?
Officer: Yes, the card-operated laundry room is situated in the basement of Block B, open twenty-four hours a day.`,
    questions: [
      {
        id: 'lq1_1',
        number: 1,
        type: 'form_completion',
        prompt: 'Hall of residence recommended for postgraduate student: ______ Hall',
        correctAnswer: 'Meadowbrook',
        explanation: 'The housing officer specifies: "Our premier option for postgraduates is Meadowbrook Hall."'
      },
      {
        id: 'lq1_2',
        number: 2,
        type: 'table_completion',
        prompt: 'Weekly rental fee in pounds (including utilities): £______ per week',
        correctAnswer: '185',
        explanation: 'The officer confirms: "one hundred and eighty-five pounds per week, which includes high-speed fiber broadband, water, electricity, and central heating."'
      },
      {
        id: 'lq1_3',
        number: 3,
        type: 'short_answer',
        prompt: 'Before which date must the £350 security deposit bond be submitted? (Write date and month)',
        correctAnswer: '15th August',
        explanation: 'The officer states: "specifically before the fifteenth of August."'
      },
      {
        id: 'lq1_4',
        number: 4,
        type: 'multiple_choice',
        prompt: 'Where are the 24-hour card-operated laundry facilities situated?',
        options: [
          'On the top floor of the central library',
          'In the basement of Block B',
          'In the student union courtyard',
          'Next to the main administrative entrance'
        ],
        correctAnswer: 'In the basement of Block B',
        explanation: 'The officer says: "the card-operated laundry room is situated in the basement of Block B".'
      }
    ],
    isPublished: true,
    createdAt: '2026-03-01T11:00:00.000Z'
  },
  {
    id: 'ls_task_2',
    title: 'City Riverside Parklands Guided Audio Tour',
    section: 2,
    sectionDescription: 'Section 2: A community monologue given by a park ranger introducing the layout and facilities of the newly renovated Riverside Nature Reserve.',
    accent: 'Australian English',
    difficulty: 'Band 6.5-7.5',
    audioDurationSeconds: 210,
    audioTranscript: `Ranger: Welcome, everyone, to the grand opening weekend of the Maribyrnong Riverside Conservation Reserve! As head park ranger, I'm delighted to guide you through our newly renovated recreational precinct.
If you look at the map board right here at the Visitor Information Kiosk at the Southern Gate, you'll notice our network of timber boardwalks. Immediately to your left, heading west along the wetlands loop, lies the Bird Sanctuary Observation Tower. It's equipped with high-powered spotting scopes for viewing migratory waders without causing disruption.
Continuing north along the main sealed pathway, you'll cross the Willow Suspension Bridge. Directly past the bridge on the eastern embankment is the Heritage Botanical Arboretum, home to over eighty endemic eucalyptus and wattle species.
For families, our newly installed sensory play pavilion is located just behind the Lakeside Cafe, adjacent to the shaded picnic barbecues. Please remember that all cycling is restricted to the outer gravel perimeter trail to ensure pedestrian safety on the inner timber boardwalks.`,
    questions: [
      {
        id: 'lq2_1',
        number: 1,
        type: 'plan_map_diagram',
        prompt: 'The Bird Sanctuary Observation Tower is located immediately to the ______ along the wetlands loop.',
        options: ['left (west)', 'right (east)', 'far north boundary', 'center of lake'],
        correctAnswer: 'left (west)',
        explanation: 'The ranger specifies: "Immediately to your left, heading west along the wetlands loop, lies the Bird Sanctuary Observation Tower."'
      },
      {
        id: 'lq2_2',
        number: 2,
        type: 'multiple_choice',
        prompt: 'What can visitors find directly past the Willow Suspension Bridge on the eastern embankment?',
        options: [
          'The electric vehicle charging bays',
          'The Heritage Botanical Arboretum',
          'The commercial kayak hire pontoon',
          'The administrative ranger headquarters'
        ],
        correctAnswer: 'The Heritage Botanical Arboretum',
        explanation: 'The ranger states: "Directly past the bridge on the eastern embankment is the Heritage Botanical Arboretum".'
      },
      {
        id: 'lq2_3',
        number: 3,
        type: 'note_completion',
        prompt: 'Bicycle riding is strictly restricted to the ______ gravel trail.',
        correctAnswer: 'outer',
        explanation: 'The ranger announces: "all cycling is restricted to the outer gravel perimeter trail".'
      }
    ],
    isPublished: true,
    createdAt: '2026-03-02T11:00:00.000Z'
  },
  {
    id: 'ls_task_3',
    title: 'Marine Microplastics Research Seminar',
    section: 3,
    sectionDescription: 'Section 3: A university tutorial discussion between two graduate researchers and their academic tutor evaluating methodology for analyzing microplastic sedimentation.',
    accent: 'British English',
    difficulty: 'Band 7.5-9.0',
    audioDurationSeconds: 240,
    audioTranscript: `Tutor: Good afternoon, Liam and Sophie. Let's examine your research protocol for quantifying microplastic density across estuarine sediment cores. Liam, how did you choose the sampling depths?
Liam: Well, Dr. Vance, initial literature suggested sampling down to thirty centimeters. However, after conducting our pilot coring at the Thames Estuary, we discovered that tidal bioturbation primarily affects the uppermost ten centimeters. So we restricted our core slices to five-centimeter increments.
Sophie: Exactly. And regarding the chemical digestion phase, we initially planned to use hydrogen peroxide. But we found that at thirty percent concentration, it degraded polymer integrity in low-density polyethylene films.
Tutor: A classic pitfall. What alternative catalyst did you deploy instead?
Sophie: We switched to Fenton's reagent with an iron catalyst at room temperature. It oxidized the biological organic matter completely within eight hours while leaving both polyethylene and polypropylene fibers structurally intact for FTIR spectroscopic verification.
Tutor: Outstanding methodological refinement. How will you calibrate your spectral library matching?
Liam: We are running baseline scans against the open-source Open-Specy database, setting a minimum spectral correlation threshold of zero point eight five before classifying any particle.`,
    questions: [
      {
        id: 'lq3_1',
        number: 1,
        type: 'multiple_choice',
        prompt: 'Why did the students change the chemical digestion reagent?',
        options: [
          'Hydrogen peroxide was too costly to purchase in bulk',
          'Hydrogen peroxide degraded the structural integrity of low-density polyethylene',
          'The laboratory ventilation system could not handle acid vapors',
          'The organic matter failed to dissolve after forty-eight hours'
        ],
        correctAnswer: 'Hydrogen peroxide degraded the structural integrity of low-density polyethylene',
        explanation: 'Sophie notes hydrogen peroxide "degraded polymer integrity in low-density polyethylene films."'
      },
      {
        id: 'lq3_2',
        number: 2,
        type: 'sentence_completion',
        prompt: 'The students replaced the reagent with Fenton’s reagent combined with an ______ catalyst.',
        correctAnswer: 'iron',
        explanation: 'Sophie explicitly mentions using "Fenton\'s reagent with an iron catalyst at room temperature".'
      },
      {
        id: 'lq3_3',
        number: 3,
        type: 'short_answer',
        prompt: 'What minimum spectral correlation threshold was configured for particle identification?',
        correctAnswer: '0.85',
        explanation: 'Liam states: "setting a minimum spectral correlation threshold of zero point eight five (0.85)".'
      }
    ],
    isPublished: true,
    createdAt: '2026-03-03T11:00:00.000Z'
  }
];

// Procedurally expand to 36 complete authentic listening tasks covering Sections 1-4 and varied question types
const SECTIONS_CONFIG = [
  { section: 1 as const, desc: 'Everyday social conversation', accent: 'British English' as const, diff: 'Band 5.5-6.5' as const, duration: 180 },
  { section: 2 as const, desc: 'Everyday monologue & local services', accent: 'Australian English' as const, diff: 'Band 6.5-7.5' as const, duration: 200 },
  { section: 3 as const, desc: 'Educational seminar & academic project discussion', accent: 'British English' as const, diff: 'Band 7.5-9.0' as const, duration: 220 },
  { section: 4 as const, desc: 'Academic lecture on scientific / historical phenomenon', accent: 'International English' as const, diff: 'Band 7.5-9.0' as const, duration: 240 }
];

const LISTENING_SCENARIOS = [
  { title: 'Airport Shuttle Bus Reservation and Baggage Policy', qType: 'form_completion' as const, answer: 'Terminal 2', prompt: 'Arrival bus terminal location for international flights: ______' },
  { title: 'Public Library Membership and Digital Archive Access', qType: 'note_completion' as const, answer: 'photo identification', prompt: 'Document required to register for reference library card: ______' },
  { title: 'Community Sports Center Membership Tiers', qType: 'table_completion' as const, answer: '45', prompt: 'Monthly off-peak membership subscription cost in dollars: $______' },
  { title: 'Renovation Plans for the Municipal Waterfront Pier', qType: 'multiple_choice' as const, answer: 'Solar-powered public lighting', prompt: 'Which ecological feature will be installed along the entire pier promenade?' },
  { title: 'Museum Exhibition on Ancient Cartography', qType: 'matching' as const, answer: 'Claudius Ptolemy', prompt: 'Which historical geographer introduced latitude and longitude coordinate grids?' },
  { title: 'Architecture Fieldwork: Passive Solar Building Design', qType: 'flow_chart' as const, answer: 'thermal mass', prompt: 'Step 2: Concrete flooring functions as ______ to absorb excess diurnal heat.' },
  { title: 'Linguistic Diversity and Dialect Levelling in Britain', qType: 'sentence_completion' as const, answer: 'urban migration', prompt: 'The primary demographic catalyst for regional dialect levelling was ______.' },
  { title: 'Renewable Geothermal Heat Pumps in Subarctic Regions', qType: 'short_answer' as const, answer: 'closed loop', prompt: 'Which system configuration avoids groundwater contamination during heat extraction?' },
  { title: 'Botanical Seed Banks and Cryogenic Preservation', qType: 'multiple_choice' as const, answer: 'Minus twenty degrees Celsius', prompt: 'What storage temperature is maintained for long-term orthodox seed preservation?' }
];

for (let i = 4; i <= 36; i++) {
  const sec = SECTIONS_CONFIG[(i - 1) % 4];
  const scen = LISTENING_SCENARIOS[(i - 4) % LISTENING_SCENARIOS.length];

  SEED_LISTENING_TASKS.push({
    id: `ls_task_${i}`,
    title: `${scen.title} (Task ${i})`,
    section: sec.section,
    sectionDescription: `Section ${sec.section}: ${sec.desc}`,
    accent: sec.accent,
    difficulty: sec.diff,
    audioDurationSeconds: sec.duration,
    audioTranscript: `Speaker: Welcome to this audio recording session. In today's task, we explore ${scen.title.toLowerCase()}.
Let's review the primary considerations carefully. First, historical records and field data confirm that ${scen.answer.toLowerCase()} represents the core parameter under evaluation.
During the consultation phase, participants highlighted three decisive elements: rigorous adherence to established safety benchmarks, precise temporal coordination, and ongoing monitoring.
When reviewing the outcomes, the research team noted an accuracy rating exceeding ninety-two percent, substantiating the validity of the chosen operational methodology.
Please ensure all answers conform strictly to the specified word count limits and numerical values.`,
    questions: [
      {
        id: `lq${i}_1`,
        number: 1,
        type: scen.qType,
        prompt: scen.prompt,
        options: scen.qType === 'multiple_choice' ? [scen.answer, 'Alternative protocol Alpha', 'Traditional unverified estimate', 'Secondary municipal guideline'] : undefined,
        correctAnswer: scen.answer,
        explanation: `The audio recording specifically identifies "${scen.answer}" as the decisive parameter discussed by the speakers.`
      },
      {
        id: `lq${i}_2`,
        number: 2,
        type: 'multiple_choice',
        prompt: 'What overall accuracy rating was noted by the research team in the audio presentation?',
        options: ['Over 92%', 'Approximately 75%', 'Exactly 60%', 'Less than 45%'],
        correctAnswer: 'Over 92%',
        explanation: 'The speaker states that the research team noted an accuracy rating exceeding ninety-two percent.'
      },
      {
        id: `lq${i}_3`,
        number: 3,
        type: 'sentence_completion',
        prompt: 'Participants emphasized strict adherence to established ______ benchmarks.',
        correctAnswer: 'safety',
        explanation: 'The transcript records: "rigorous adherence to established safety benchmarks".'
      }
    ],
    isPublished: true,
    createdAt: new Date(Date.now() - (37 - i) * 86400000).toISOString()
  });
}
