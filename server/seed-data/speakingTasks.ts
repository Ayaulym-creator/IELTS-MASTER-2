import { SpeakingTask } from '../../src/types/index.js';

export const SEED_SPEAKING_TASKS: SpeakingTask[] = [
  {
    id: 'sp_task_1',
    title: 'Daily Routines and Time Management',
    part: 1,
    topic: 'Daily Habits & Personal Productivity',
    questions: [
      'What part of the day do you feel most productive, and why?',
      'Has your daily routine changed significantly compared to when you were a child?',
      'Do you prefer planning your schedule meticulously or staying spontaneous?',
      'What is your favorite leisure activity to unwind after a demanding day?'
    ],
    modelAnswer: 'Personally, I hit my peak cognitive bandwidth during the early morning hours, typically between seven and ten o\'clock. The house is tranquil, ambient distractions are minimal, and I find I can tackle intellectually demanding analytical tasks with sharp focus. Compared to my childhood, when my timetable was strictly regimented by school bells and parents, my adult schedule involves far more autonomous prioritization. While I do maintain a digital calendar for professional commitments, I deliberately reserve weekends for unstructured spontaneity so as not to feel overwhelmed by relentless schedules.',
    highBandVocabulary: [
      'peak cognitive bandwidth',
      'ambient distractions',
      'regimented timetable',
      'autonomous prioritization',
      'unstructured spontaneity'
    ],
    idiomaticExpressions: [
      'hit the ground running',
      'burn the candle at both ends',
      'recharge my batteries',
      'take things in my stride'
    ],
    isPublished: true,
    createdAt: '2026-03-01T13:00:00.000Z'
  },
  {
    id: 'sp_task_2',
    title: 'Describe an Inspiring Mentor or Educator',
    part: 2,
    topic: 'Education & Role Models',
    cueCard: {
      mainPrompt: 'Describe a teacher or mentor who had a profound positive influence on your personal or academic development.',
      bulletPoints: [
        'Who this individual was and in what capacity you interacted with them',
        'What specific qualities distinguished their teaching or guidance from others',
        'A memorable incident or project where they offered valuable direction',
        'And explain why their mentorship remains meaningful to you today'
      ],
      prepSeconds: 60,
      speakingSeconds: 120
    },
    modelAnswer: 'I would like to speak about Dr. Kenneth Bailey, who served as my university dissertation supervisor during my undergraduate studies in computer engineering. What set Dr. Bailey apart was not merely his encyclopedic domain expertise, but his extraordinary capacity for empathetic scaffolding. Rather than handing down prescriptive solutions when students hit conceptual bottlenecks, he would pose probing Socratic questions that guided us to discover the underlying logic autonomously.\n\nI vividly recall an instance during my final year when a machine learning algorithm I was designing persistently failed to converge on the validation set. I felt thoroughly demoralized and on the verge of abandoning the research hypothesis. Dr. Bailey sat down with me for over three hours, meticulously deconstructing the gradient descent matrix and demonstrating how the anomaly was actually an unexpected insight rather than a failure.\n\nHis mentorship has had an enduring impact on me because it instilled intellectual resilience. He taught me to perceive technical setbacks not as definitive roadblocks, but as valuable heuristic data points, an attitude that has guided both my professional career and personal outlook.',
    highBandVocabulary: [
      'encyclopedic domain expertise',
      'empathetic scaffolding',
      'prescriptive solutions',
      'Socratic questioning',
      'intellectual resilience',
      'heuristic data points'
    ],
    idiomaticExpressions: [
      'set them apart from the crowd',
      'steer me in the right direction',
      'think outside the box',
      'leave an indelible mark'
    ],
    isPublished: true,
    createdAt: '2026-03-02T13:00:00.000Z'
  },
  {
    id: 'sp_task_3',
    title: 'Technological Transformation of Pedagogy',
    part: 3,
    topic: 'Education & Future Society',
    questions: [
      'How has the introduction of artificial intelligence altered the dynamic between teachers and students?',
      'Do you believe virtual reality will eventually render physical university campuses obsolete?',
      'Should public educational curricula focus primarily on vocational skills or holistic philosophical inquiry?',
      'In what ways can governments bridge the digital divide between metropolitan and rural learners?'
    ],
    modelAnswer: 'In my estimation, artificial intelligence is instigating a fundamental paradigm shift from the traditional "sage on the stage" lecture format toward personalized adaptive learning. Rather than acting as the sole arbiter of facts, educators are increasingly transitioning into pedagogical facilitators who foster critical evaluation, source discernment, and ethical reasoning.\n\nHowever, I do not believe virtual platforms will ever fully supersede brick-and-mortar university campuses. Higher education is fundamentally an apprenticeship in socialization, collaborative debate, and serendipitous peer interactions. While digital simulations excel at delivering factual information asynchronously, the visceral collegiate experience—the spontaneous hallway debates, laboratory camaraderie, and informal mentorship—cannot be replicated inside a VR headset.',
    highBandVocabulary: [
      'fundamental paradigm shift',
      'pedagogical facilitator',
      'source discernment',
      'supersede brick-and-mortar campuses',
      'serendipitous interactions',
      'visceral collegiate experience'
    ],
    idiomaticExpressions: [
      'sage on the stage',
      'stand the test of time',
      'double-edged sword',
      'broaden one’s horizons'
    ],
    isPublished: true,
    createdAt: '2026-03-03T13:00:00.000Z'
  }
];

// Procedurally generate the remaining speaking tasks to reach 36 full tasks across Parts 1, 2, and 3
const SPEAKING_TOPICS = [
  { part: 1 as const, topic: 'Hometown and Urban Living', title: 'Hometown, Architecture, and Community Spaces' },
  { part: 1 as const, topic: 'Travel and Cultural Encounters', title: 'International Travel, Transit, and Cultural Immersion' },
  { part: 1 as const, topic: 'Technology and Social Media', title: 'Digital Devices, Screen Time, and Connectivity' },
  { part: 2 as const, topic: 'Describe an Environmental Project', title: 'Cue Card: Community Ecological Conservation Initiative' },
  { part: 2 as const, topic: 'Describe a Challenging Goal Achieved', title: 'Cue Card: Overcoming a Strenuous Academic or Physical Challenge' },
  { part: 2 as const, topic: 'Describe a Historical Landmark Visited', title: 'Cue Card: An Architectural Monument with Rich Heritage' },
  { part: 3 as const, topic: 'Environmental Policy and Individual Action', title: 'Discussion: Global Climate Action, Legislation, and Citizen Responsibility' },
  { part: 3 as const, topic: 'Urban Planning and Sustainable Megacities', title: 'Discussion: Smart Cities, Public Transit, and Micro-Housing' },
  { part: 3 as const, topic: 'Globalization and Cultural Preservation', title: 'Discussion: Linguistic Homogenization vs Indigenous Heritage' }
];

for (let i = 4; i <= 36; i++) {
  const item = SPEAKING_TOPICS[(i - 4) % SPEAKING_TOPICS.length];
  const isPart2 = item.part === 2;
  const isPart1 = item.part === 1;

  SEED_SPEAKING_TASKS.push({
    id: `sp_task_${i}`,
    title: `${item.title} (Task ${i})`,
    part: item.part,
    topic: item.topic,
    cueCard: isPart2 ? {
      mainPrompt: `Describe a significant aspect of ${item.topic.toLowerCase()} that left a lasting impression on you.`,
      bulletPoints: [
        'When and where this experience took place',
        'What the main objectives and challenges were',
        'How other individuals or teams contributed to the outcome',
        'And explain what insights you gained that continue to guide your decisions'
      ],
      prepSeconds: 60,
      speakingSeconds: 120
    } : undefined,
    questions: !isPart2 ? [
      `How do modern perspectives on ${item.topic.toLowerCase()} influence everyday decisions?`,
      `In what ways has public awareness concerning this issue evolved over the past decade?`,
      `What long-term consequences might arise if societies overlook the significance of this subject?`
    ] : undefined,
    modelAnswer: `In addressing ${item.topic.toLowerCase()}, it is crucial to recognize the interconnected dynamic between institutional frameworks and individual initiative. In modern academic discourse, scholars increasingly emphasize systemic accountability alongside personal engagement. For instance, empirical research corroborates that proactive community involvement yields measurable improvements in social cohesion and sustainable development. By cultivating balanced, forward-looking strategies, individuals and organizations can overcome contemporary obstacles and build lasting resilience.`,
    highBandVocabulary: [
      'interconnected dynamic',
      'systemic accountability',
      'empirical research',
      'social cohesion',
      'forward-looking strategies',
      'sustainable resilience'
    ],
    idiomaticExpressions: [
      'pave the way for progress',
      'strike a delicate balance',
      'at the forefront of change',
      'leave no stone unturned'
    ],
    isPublished: true,
    createdAt: new Date(Date.now() - (37 - i) * 86400000).toISOString()
  });
}
