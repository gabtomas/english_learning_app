import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  BrainCircuit, 
  Search, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  ShieldAlert, 
  Database, 
  Network, 
  Code2, 
  Terminal, 
  Lock, 
  Flame, 
  Award, 
  AlertCircle,
  Volume2,
  Sun,
  Moon,
  PlusCircle
} from 'lucide-react';
import { api } from './api';
import type { VocabularyWord, QuizQuestion } from './api';

type Tab = 'vocabulary' | 'study' | 'grammar';
type StudyMode = 'flashcard' | 'quiz' | 'typing' | 'characters';

interface GrammarTopic {
  id: string;
  title: string;
  czechTitle: string;
  description: string;
  rules: {
    title: string;
    explanation: string;
    examples: { en: string; cs: string }[];
  }[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

const grammarTopics: GrammarTopic[] = [
  {
    id: 'perfect_past',
    title: 'Present Perfect vs Past Simple',
    czechTitle: 'Předpřítomný vs Minulý prostý čas',
    description: 'Master the difference between finished past actions (Past Simple) and past experiences with a link to the present (Present Perfect).',
    rules: [
      {
        title: 'Present Perfect (Předpřítomný čas)',
        explanation: 'Used for actions that happened at an unspecified time, life experiences, or when the time period is still continuing (today, this week). Formed with have/has + 3rd form (past participle).',
        examples: [
          { en: 'I have written three functions today.', cs: 'Dnes jsem napsal tři funkce (a den ještě neskončil).' },
          { en: 'We have updated the dependency twice this month.', cs: 'Tento měsíc jsme závislost aktualizovali dvakrát.' },
        ],
      },
      {
        title: 'Past Simple (Minulý prostý čas)',
        explanation: 'Used for completed actions in the past with a specific time indicator (yesterday, last week, in 2023). Formed with the -ed ending or irregular verb forms.',
        examples: [
          { en: 'I wrote a new script yesterday.', cs: 'Včera jsem napsal nový skript.' },
          { en: 'They launched the server last night.', cs: 'Včera v noci spustili ten server.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'I _______ that security bug last night.',
        options: ['fixed', 'have fixed', 'fix', 'was fixing'],
        correctAnswer: 'fixed',
        explanation: '"Last night" is a specific completed time in the past, which requires the Past Simple.',
      },
      {
        question: 'We _______ this SQL database since 2024.',
        options: ['have used', 'used', 'are using', 'use'],
        correctAnswer: 'have used',
        explanation: '"Since" indicates an action that started in the past and continues into the present, which requires the Present Perfect.',
      },
      {
        question: 'She _______ to the director yesterday.',
        options: ['spoke', 'has spoken', 'speaks', 'had spoken'],
        correctAnswer: 'spoke',
        explanation: '"Yesterday" is a finished past time frame, demanding the Past Simple.',
      },
    ],
  },
  {
    id: 'conditionals',
    title: 'Conditionals (1st & 2nd)',
    czechTitle: 'Podmínkové věty',
    description: 'Learn to write real future possibilities (1st Conditional) and hypothetical or imaginary situations (2nd Conditional).',
    rules: [
      {
        title: 'First Conditional (Reálná podmínka)',
        explanation: 'Used for real or highly probable future events. Structure: If + Present Simple, will + verb.',
        examples: [
          { en: 'If the server crashes, the backup will kick in.', cs: 'Pokud server spadne, záloha se spustí.' },
          { en: 'If you push the code now, it will deploy in minutes.', cs: 'Pokud ten kód pushneš teď, nasadí se za pár minut.' },
        ],
      },
      {
        title: 'Second Conditional (Nereálná podmínka)',
        explanation: 'Used for imaginary, hypothetical, or highly improbable situations in the present or future. Structure: If + Past Simple, would + verb.',
        examples: [
          { en: 'If I had more RAM, I would run five containers.', cs: 'Kdybych měl více RAM, spustil bych pět kontejnerů.' },
          { en: 'If they paid more, he would stay in the company.', cs: 'Kdyby platili víc, zůstal by ve firmě.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'If they _______ the application, the site will go down.',
        options: ['restart', 'will restart', 'restarted', 'would restart'],
        correctAnswer: 'restart',
        explanation: 'This is a First Conditional sentence. The "if" clause takes the Present Simple (restart), and the main clause takes "will".',
      },
      {
        question: 'If I _______ a million dollars, I would buy a server farm.',
        options: ['had', 'have', 'would have', 'had had'],
        correctAnswer: 'had',
        explanation: 'This is a Second Conditional (hypothetical). The "if" clause takes the Past Simple (had), and the main clause takes "would".',
      },
      {
        question: 'If you click that button, the script _______ the logs.',
        options: ['will delete', 'would delete', 'deletes', 'deleted'],
        correctAnswer: 'will delete',
        explanation: 'This is a First Conditional (real possibility). The main clause requires "will + verb".',
      },
    ],
  },
  {
    id: 'gerund_infinitive',
    title: 'Gerunds vs Infinitives',
    czechTitle: 'Gerundium vs Infinitiv',
    description: 'Understand which English verbs are followed by "-ing" (gerund) and which require "to + verb" (infinitive).',
    rules: [
      {
        title: 'Verbs with Gerund (-ing)',
        explanation: 'Common verbs followed by the -ing form: avoid, enjoy, keep, suggest, finish, look forward to.',
        examples: [
          { en: 'Please avoid committing passwords directly.', cs: 'Vyhněte se prosím přímému nahrávání hesel.' },
          { en: 'I look forward to collaborating on this repo.', cs: 'Těším se na spolupráci na tomto repozitáři.' },
        ],
      },
      {
        title: 'Verbs with Infinitive (to + verb)',
        explanation: 'Common verbs followed by the infinitive form: decide, hope, manage, plan, fail, want, agree.',
        examples: [
          { en: 'We decided to upgrade the framework.', cs: 'Rozhodli jsme se aktualizovat framework.' },
          { en: 'He managed to restore the system.', cs: 'Podařilo se mu obnovit systém.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'You should avoid _______ large files directly to GitHub.',
        options: ['pushing', 'to push', 'push', 'pushed'],
        correctAnswer: 'pushing',
        explanation: 'The verb "avoid" is followed by a gerund (-ing form).',
      },
      {
        question: 'We managed _______ the microservice before the product launch.',
        options: ['to debug', 'debugging', 'debug', 'for debugging'],
        correctAnswer: 'to debug',
        explanation: 'The verb "manage" requires an infinitive ("to + verb").',
      },
      {
        question: 'They plan _______ their cloud services next month.',
        options: ['to migrate', 'migrating', 'migrate', 'for migrating'],
        correctAnswer: 'to migrate',
        explanation: '"Plan" is followed by the infinitive structure.',
      },
    ],
  },
  {
    id: 'articles',
    title: 'Articles in IT Context',
    czechTitle: 'Členy v IT angličtině',
    description: 'Master when to use "A", "AN", "THE", or zero article when talking about databases, code classes, and computers.',
    rules: [
      {
        title: 'Indefinite Articles (A / AN)',
        explanation: 'Used for singular, countable, non-specific things mentioned for the first time. Use "AN" before vowel sounds (an object, an API, an hour).',
        examples: [
          { en: 'We need to hire a developer.', cs: 'Potřebujeme najmout (nějakého) vývojáře.' },
          { en: 'I instantiated an object of the class.', cs: 'Vytvořil jsem instanci objektu té třídy.' },
        ],
      },
      {
        title: 'Definite Article (THE)',
        explanation: 'Used when the thing is unique (the internet), specific, or has been mentioned before.',
        examples: [
          { en: 'The developer we hired is very skilled.', cs: 'Ten vývojář, kterého jsme najali, je velmi šikovný.' },
          { en: 'The database is down at the moment.', cs: 'Ta databáze je momentálně mimo provoz.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'We need to write _______ API endpoint for the checkout.',
        options: ['an', 'a', 'the', 'no article'],
        correctAnswer: 'an',
        explanation: '"API" starts with a vowel sound (ay-pee-eye), so it requires the indefinite article "an".',
      },
      {
        question: '_______ server we bought yesterday has 64GB of RAM.',
        options: ['The', 'A', 'An', 'no article'],
        correctAnswer: 'The',
        explanation: 'This is a specific server (the one we bought yesterday), requiring the definite article "The".',
      },
      {
        question: 'Can you show me how to declare _______ array in Python?',
        options: ['an', 'a', 'the', 'no article'],
        correctAnswer: 'an',
        explanation: '"Array" starts with a vowel sound (uh-ray), requiring the indefinite article "an".',
      },
    ],
  },
  {
    id: 'future_tenses',
    title: 'Future Tenses & Release Planning',
    czechTitle: 'Budoucí časy a plánování releasů',
    description: 'Master advanced future aspects (Future Continuous, Future Perfect) to manage deadlines, sprints, and release calendars.',
    rules: [
      {
        title: 'Future Continuous (Průběhový budoucí čas)',
        explanation: 'Used for actions that will be in progress at a specific time in the future. Structure: will be + -ing.',
        examples: [
          { en: 'This time tomorrow, we will be deploying the new build.', cs: 'Zítra touto dobou budeme nasazovat nový build.' },
          { en: 'At 3 PM, our team will be hosting a demo.', cs: 'Ve 3 odpoledne bude náš tým pořádat demo.' },
        ],
      },
      {
        title: 'Future Perfect & Future Perfect Continuous (Předbudoucí časy)',
        explanation: 'Future Perfect (will have + 3rd form) shows an action will be completed before a point in the future. Future Perfect Continuous (will have been + -ing) shows an ongoing action leading up to a future point.',
        examples: [
          { en: 'By Friday, the QA team will have certified the build.', cs: 'Do pátku QA tým certifikuje tento build.' },
          { en: 'By next month, I will have been writing code for 5 years.', cs: 'Příští měsíc to bude 5 let, co píšu kód.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'By the end of the sprint, we _______ all critical security vulnerability fixes.',
        options: ['will have merged', 'will merge', 'will be merging', 'merge'],
        correctAnswer: 'will have merged',
        explanation: 'The deadline marker "By the end of..." indicates that the action will be completed before that time, requiring the Future Perfect.',
      },
      {
        question: 'Don\'t interrupt me between 10 and 11 AM; I _______ a client code audit.',
        options: ['will be conducting', 'will conduct', 'conduct', 'will have conducted'],
        correctAnswer: 'will be conducting',
        explanation: 'At that specific time window in the future, the audit will be in progress, requiring the Future Continuous.',
      },
      {
        question: 'By next Friday, he _______ the servers for three weeks straight.',
        options: ['will have been monitoring', 'will monitor', 'will be monitoring', 'has been monitoring'],
        correctAnswer: 'will have been monitoring',
        explanation: '"By next Friday" combined with duration "for three weeks" requires the Future Perfect Continuous.',
      },
    ],
  },
  {
    id: 'past_perfect',
    title: 'Past Perfect Simple & Continuous',
    czechTitle: 'Předminulý prostý a průběhový čas',
    description: 'Use the Past Perfect to explain the timeline of server crashes, bug origins, and cascading database failures.',
    rules: [
      {
        title: 'Past Perfect Simple (Předminulý prostý čas)',
        explanation: 'Refers to an action that took place before another action in the past. Structure: had + 3rd form.',
        examples: [
          { en: 'The server had already restarted when the logs loaded.', cs: 'Server se již restartoval, když se načetly logy.' },
          { en: 'They had modified the config file before running build.', cs: 'Upravili konfigurační soubor před spuštěním buildu.' },
        ],
      },
      {
        title: 'Past Perfect Continuous (Předminulý průběhový čas)',
        explanation: 'Describes an action that was ongoing in the past until another past event occurred. Structure: had been + -ing.',
        examples: [
          { en: 'We had been debugging for hours when we found the typo.', cs: 'Debugovali jsme celé hodiny, když jsme našli ten překlep.' },
          { en: 'She had been managing the legacy system until it was retired.', cs: 'Spravovala ten starý systém, dokud nebyl vyřazen.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'We realized that the attacker _______ the main router config before the crash.',
        options: ['had altered', 'altered', 'has altered', 'was altering'],
        correctAnswer: 'had altered',
        explanation: 'The alteration of the config occurred prior to the realization and the crash, which calls for the Past Perfect.',
      },
      {
        question: 'The compiler failed because we _______ a syntax error in the export module.',
        options: ['had introduced', 'introduced', 'have introduced', 'were introducing'],
        correctAnswer: 'had introduced',
        explanation: 'The introduction of the syntax error occurred before the compiler failed, demanding the Past Perfect Simple.',
      },
      {
        question: 'Our DevOps team _______ the pipeline stability issues for days when the system crashed.',
        options: ['had been investigating', 'investigated', 'were investigating', 'have been investigating'],
        correctAnswer: 'had been investigating',
        explanation: 'An ongoing past action that occurred before another past event (crashed) requires the Past Perfect Continuous.',
      },
    ],
  },
  {
    id: 'mixed_conditionals',
    title: 'Mixed Conditionals (C1)',
    czechTitle: 'Smíšené podmínky',
    description: 'Link hypothetical past actions to present results (e.g. past tech choices affecting current system speed) or permanent conditions to past outcomes.',
    rules: [
      {
        title: 'Type 1: Past Condition -> Present Result',
        explanation: 'Structure: If + Past Perfect, would + verb. Discusses how a past decision would affect the present state.',
        examples: [
          { en: 'If they had optimized the API, our site would be fast now.', cs: 'Kdyby optimalizovali to API, náš web by byl teď rychlý.' },
          { en: 'If we had written tests, we wouldn\'t have bugs today.', cs: 'Kdybychom napsali testy, neměli bychom dnes chyby.' },
        ],
      },
      {
        title: 'Type 2: Present State -> Past Result',
        explanation: 'Structure: If + Past Simple, would have + 3rd form. Describes how a general present truth would have changed a past event.',
        examples: [
          { en: 'If I were good at database design, I would have set it up.', cs: 'Kdybych uměl navrhovat databáze, nastavil bych to sám.' },
          { en: 'If we weren\'t short-staffed, we would have met the release.', cs: 'Kdybychom neměli málo lidí, stihli bychom ten release.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'If we _______ the microservice architecture last year, we wouldn\'t be refactoring the monolith now.',
        options: ['had adopted', 'adopted', 'would adopt', 'would have adopted'],
        correctAnswer: 'had adopted',
        explanation: 'This connects a hypothetical past action (last year -> Past Perfect) with a present consequence (now -> would not be + -ing).',
      },
      {
        question: 'If the project manager _______ more technical, he would have understood our concerns yesterday.',
        options: ['were', 'had been', 'would be', 'is'],
        correctAnswer: 'were',
        explanation: 'This connects a general present state/quality (were) with a hypothetical past outcome (would have understood).',
      },
      {
        question: 'We _______ this critical security warning today if we had updated the library last week.',
        options: ['wouldn\'t be seeing', 'wouldn\'t see', 'hadn\'t seen', 'didn\'t see'],
        correctAnswer: 'wouldn\'t be seeing',
        explanation: 'An unreal past event (updated last week) affects our present state (seeing the warning today), requiring the mixed conditional pattern.',
      },
    ],
  },
  {
    id: 'unreal_past',
    title: 'Unreal Past & Subjunctive (C1)',
    czechTitle: 'Nereálná minulost a konjunktiv',
    description: 'Express strong developer policy preferences, urgent system upgrades, or technical regrets using "It is high time" and subjunctive constructs.',
    rules: [
      {
        title: 'Urgent Demands (Subjunctive Mood)',
        explanation: 'Verbs like suggest, demand, insist, recommend take the base form of the verb (subjunctive) in the "that" clause (no "-s" or modal verb).',
        examples: [
          { en: 'The tech lead insisted that he deploy the code today.', cs: 'Tech lead trval na tom, aby ten kód nasadil dnes.' },
          { en: 'I suggest she write the database query first.', cs: 'Navrhuji, aby tu databázovou query napsala jako první.' },
        ],
      },
      {
        title: 'Urgent Timing & Preferences (It is high time / Would rather)',
        explanation: 'Use the Past Simple after "It is high time..." or "I would rather you..." to express present urgency or preferences.',
        examples: [
          { en: 'It is high time we updated the security policies.', cs: 'Je nejvyšší čas, abychom aktualizovali bezpečnostní zásady.' },
          { en: 'I would rather you didn\'t execute commands in production.', cs: 'Byl bych radši, kdybys nespouštěl příkazy na produkci.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'It is high time the developer _______ the obsolete dependency.',
        options: ['removed', 'removes', 'remove', 'has removed'],
        correctAnswer: 'removed',
        explanation: '"It is high time..." is followed by the Past Simple to express urgent present or future action.',
      },
      {
        question: 'The security auditor insisted that the server port _______ changed immediately.',
        options: ['be', 'is', 'was', 'were'],
        correctAnswer: 'be',
        explanation: 'Verbs of insistence trigger the Subjunctive mood, requiring the base verb form "be".',
      },
      {
        question: 'I would rather you _______ push code directly to the main branch.',
        options: ['didn\'t', 'don\'t', 'wouldn\'t', 'hadn\'t'],
        correctAnswer: 'didn\'t',
        explanation: '"I would rather you..." requires the Past Simple to show a present/future preference.',
      },
    ],
  },
  {
    id: 'inversion',
    title: 'Inversion & Emphasis (C1)',
    czechTitle: 'Inverze (Obrácený slovosled)',
    description: 'Structure sentences with inversion (auxiliary before subject) to sound highly formal, emphasizing security post-mortems or system benchmarks.',
    rules: [
      {
        title: 'Negative / Restrictive Adverbials (Seldom, Rarely, Never)',
        explanation: 'When starting a sentence with words like Seldom, Rarely, or Never, use a question word order.',
        examples: [
          { en: 'Seldom have we witnessed such a clean codebase.', cs: 'Zřídkakdy jsme zažili tak čistou codebase.' },
          { en: 'Never before had the infrastructure handled this load.', cs: 'Nikdy předtím infrastruktura nezvládla takovou zátěž.' },
        ],
      },
      {
        title: 'Immediate Successions (No sooner / Hardly)',
        explanation: 'Structure: No sooner + had + subject + done + than + past simple. Emphasizes rapid succession.',
        examples: [
          { en: 'No sooner had we deployed the fix than the traffic rose.', cs: 'Sotva jsme nasadili opravu, návštěvnost stoupla.' },
          { en: 'Hardly had they run the script when the server died.', cs: 'Sotva spustili ten skript, server spadl.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'Rarely _______ such an elegant implementation of WebSockets.',
        options: ['have we seen', 'we have seen', 'did we saw', 'we did see'],
        correctAnswer: 'have we seen',
        explanation: 'Starting with the restrictive adverb "Rarely" triggers subject-auxiliary inversion (Rarely have we seen...).',
      },
      {
        question: 'No sooner _______ the server migration than the database locked up.',
        options: ['had they completed', 'they had completed', 'did they completed', 'they completed'],
        correctAnswer: 'had they completed',
        explanation: 'The phrase "No sooner had they [done] than [did]" is a classic C1 inversion construction.',
      },
      {
        question: 'Only after the logs were audited _______ the hacker\'s IP address.',
        options: ['did we identify', 'we identified', 'had we identified', 'we did identify'],
        correctAnswer: 'did we identify',
        explanation: '"Only after..." at the start of a sentence requires inversion in the main clause.',
      },
    ],
  },
  {
    id: 'advanced_passive',
    title: 'Advanced Passive Structures (C1)',
    czechTitle: 'Pokročilý trpný rod',
    description: 'Utilize impersonal passives (it is believed) and passive infinitives/gerunds to write formal tech docs or security reports.',
    rules: [
      {
        title: 'Impersonal Passives (It is said to have been...)',
        explanation: 'Used to attribute general opinions or reports about past states or actions in a highly formal tone.',
        examples: [
          { en: 'The core module is believed to have been compromised.', cs: 'Má se za to, že jádro systému bylo kompromitováno.' },
          { en: 'The vulnerability was reported to have existed since v1.0.', cs: 'Ohlásilo se, že zranitelnost existovala již od verze 1.0.' },
        ],
      },
      {
        title: 'Passive Gerunds & Infinitives',
        explanation: 'Structure: being + 3rd form (gerund) or to be + 3rd form (infinitive). Used when the action happens to the subject.',
        examples: [
          { en: 'Our code demands to be reviewed before publication.', cs: 'Náš kód vyžaduje revizi (vyžaduje být zkontrolován) před vydáním.' },
          { en: 'Nobody in security likes being interrupted by alert storms.', cs: 'Nikdo z bezpečnosti nemá rád, když je přerušován bouří alarmů.' },
        ],
      },
    ],
    quiz: [
      {
        question: 'The root cause of the memory leak is reported _______ by the garbage collector thread.',
        options: ['to have been triggered', 'to be triggering', 'to trigger', 'having been triggered'],
        correctAnswer: 'to have been triggered',
        explanation: 'To report a past action using passive voice, use the perfect passive infinitive ("is reported to have been triggered").',
      },
      {
        question: 'The client-side scripts object to _______ by third-party extensions.',
        options: ['being intercepted', 'be intercepted', 'intercepting', 'to be intercepted'],
        correctAnswer: 'being intercepted',
        explanation: 'The verb phrase "object to" requires a gerund. In the passive voice, it is "being + past participle" (being intercepted).',
      },
      {
        question: 'We need to verify that these environmental parameters cannot _______ during execution.',
        options: ['be modified', 'being modified', 'to be modified', 'be modify'],
        correctAnswer: 'be modified',
        explanation: 'After the modal "cannot", we require a passive infinitive without "to" ("cannot be modified").',
      },
    ],
  },
];

interface KeyboardCharacter {
  symbol: string;
  name: string;
  czechName: string;
  description: string;
  codeExample: string;
}

interface CharQuestion {
  character: KeyboardCharacter;
  questionType: 'find_symbol' | 'find_name';
  correctAnswer: string;
  options: string[];
}

const keyboardCharacters: KeyboardCharacter[] = [
  { symbol: '~', name: 'tilde', czechName: 'vlnovka', description: 'Used in CSS for sibling selectors, in terminal paths for user home folder, or destructors in C++.', codeExample: 'cd ~' },
  { symbol: '#', name: 'hash', czechName: 'mřížka / hash', description: 'Used for comments in Python/Bash, element IDs in CSS, and preprocessor directives in C++.', codeExample: '#root { display: flex; }' },
  { symbol: '*', name: 'asterisk', czechName: 'hvězdička', description: 'Used for multiplication, wildcard selectors in CSS, and pointer dereferencing in C.', codeExample: 'let total = price * quantity;' },
  { symbol: '\\', name: 'backslash', czechName: 'zpětné lomítko', description: 'Used to escape special characters inside string literals or as folder separator in Windows.', codeExample: 'const msg = "Line 1\\nLine 2";' },
  { symbol: '/', name: 'slash', czechName: 'lomítko / dopředné lomítko', description: 'Used for division in math/code, HTML closing tags, and URL/path separator.', codeExample: 'const ratio = total / length;' },
  { symbol: '^', name: 'caret', czechName: 'stříška', description: 'Used to specify string start in regular expressions, or bitwise XOR operations.', codeExample: '/^https/.test(url)' },
  { symbol: '&', name: 'ampersand', czechName: 'ampersand', description: 'Used for logical AND operations (&&) or reference declarations in C++.', codeExample: 'if (isOk && isValid)' },
  { symbol: '@', name: 'at sign', czechName: 'zavináč', description: 'Used in email addresses, decorator syntax in TS/Python, and media query declarations.', codeExample: '@media (min-width: 768px)' },
  { symbol: '_', name: 'underscore', czechName: 'podtržítko', description: 'Used to separate words in variable naming (snake_case) or represent ignored arguments.', codeExample: 'const api_key = "abc123";' },
  { symbol: '|', name: 'pipe', czechName: 'svislá čára / roura', description: 'Used for logical OR operations (||) and piping inputs in terminals.', codeExample: 'cat data.csv | grep "Active"' },
  { symbol: '{', name: 'open curly brace', czechName: 'levá složená závorka', description: 'Used to define code blocks, function bodies, object structures, or JSON dictionaries.', codeExample: 'const config = { active: true };' },
  { symbol: '}', name: 'close curly brace', czechName: 'pravá složená závorka', description: 'Used to close code blocks, function bodies, object structures, or JSON dictionaries.', codeExample: 'if (flag) { run(); }' },
  { symbol: '[', name: 'open bracket', czechName: 'levá hranatá závorka', description: 'Used to initialize array collections or access property key indices.', codeExample: 'const numbers = [10, 20];' },
  { symbol: ']', name: 'close bracket', czechName: 'pravá hranatá závorka', description: 'Used to close array collections or indices access.', codeExample: 'const secondVal = numbers[1];' },
  { symbol: '<', name: 'less than', czechName: 'menší než', description: 'Used for numeric comparison, HTML elements tags, and generic types declarations.', codeExample: 'if (index < maxItems) { }' },
  { symbol: '>', name: 'greater than', czechName: 'větší než', description: 'Used for numeric comparison, HTML elements tags, and arrow parameters mappings.', codeExample: 'const calc = (v) => v * 2;' },
  { symbol: '!', name: 'exclamation mark', czechName: 'vykřičník', description: 'Used as logical NOT operator, inequality indicator (!=), or non-null assertion.', codeExample: 'if (!isLoaded) { load(); }' },
  { symbol: '%', name: 'percent sign', czechName: 'procento / modulo', description: 'Used as modulo operator (remainder of division) or percentage metrics units in CSS.', codeExample: 'const isEven = val % 2 === 0;' },
  { symbol: '$', name: 'dollar sign', czechName: 'dolar', description: 'Used for template string variables interpolation, shell variables, or jQuery selectors.', codeExample: 'const greetings = `Hi ${user}`;' },
  { symbol: ';', name: 'semicolon', czechName: 'středník', description: 'Used to mark statement endings in languages like JS, Java, C++, and C#.', codeExample: 'let active = true;' },
  { symbol: ':', name: 'colon', czechName: 'dvojtečka', description: 'Used in object key-value declarations, type assignments, and ternary conditionals.', codeExample: 'const text: string = "hello";' },
  { symbol: '`', name: 'backtick', czechName: 'zpětný apostrof', description: 'Used to define template literals, multiline string blocks, and string formatting.', codeExample: 'const query = `SELECT * FROM users`;' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('vocabulary');

  // Keyboard Characters State
  const [charTab, setCharTab] = useState<'learn' | 'challenge'>('learn');
  const [charQuestions, setCharQuestions] = useState<CharQuestion[]>([]);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [charSelectedAns, setCharSelectedAns] = useState<string | null>(null);
  const [charHasAns, setCharHasAns] = useState(false);
  const [charScore, setCharScore] = useState(0);
  const [charFinished, setCharFinished] = useState(false);

  // Grammar Lab State
  const [selectedGrammarTopicId, setSelectedGrammarTopicId] = useState<string>('perfect_past');
  const [grammarQuizActive, setGrammarQuizActive] = useState(false);
  const [grammarQuizIndex, setGrammarQuizIndex] = useState(0);
  const [grammarSelectedAns, setGrammarSelectedAns] = useState<string | null>(null);
  const [grammarHasAns, setGrammarHasAns] = useState(false);
  const [grammarScore, setGrammarScore] = useState(0);
  const [grammarFinished, setGrammarFinished] = useState(false);
  const grammarExplanationRef = useRef<HTMLDivElement | null>(null);
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme control: Default to light theme (false)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Import Vocabulary Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [pastedVocab, setPastedVocab] = useState('');
  const [importCategory, setImportCategory] = useState('custom');
  const [importDifficulty, setImportDifficulty] = useState('medium');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Filters for vocabulary list
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedWordId, setExpandedWordId] = useState<number | null>(null);

  // Study Arena State
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcard');
  const [studyCategory, setStudyCategory] = useState('all');
  const [studyDirection, setStudyDirection] = useState<'en_to_cs' | 'cs_to_en' | 'random'>('random');
  
  // Flashcard State
  const [flashcards, setFlashcards] = useState<VocabularyWord[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardFinished, setFlashcardFinished] = useState(false);

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Typing State
  const [typingWords, setTypingWords] = useState<VocabularyWord[]>([]);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [userTypedAnswer, setUserTypedAnswer] = useState('');
  const [typingSubmitted, setTypingSubmitted] = useState(false);
  const [typingIsCorrect, setTypingIsCorrect] = useState(false);
  const [typingFinished, setTypingFinished] = useState(false);
  const [showTypingHint, setShowTypingHint] = useState(false);
  // React refs for auto-scrolling
  const quizExplanationRef = useRef<HTMLDivElement | null>(null);
  const charExplanationRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to quiz explanation when answered
  useEffect(() => {
    if (hasAnswered && quizExplanationRef.current) {
      const timer = setTimeout(() => {
        quizExplanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [hasAnswered]);

  // Auto-scroll to characters explanation when answered
  useEffect(() => {
    if (charHasAns && charExplanationRef.current) {
      const timer = setTimeout(() => {
        charExplanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [charHasAns]);

  // Auto-scroll to grammar explanation when answered
  useEffect(() => {
    if (grammarHasAns && grammarExplanationRef.current) {
      const timer = setTimeout(() => {
        grammarExplanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [grammarHasAns]);


  // Apply dark mode class to body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load initial vocabulary list
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const wordsData = await api.getWords(selectedCategory, selectedDifficulty);
      setWords(wordsData);
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure it is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedDifficulty]);



  // Import custom vocabulary from pasted text
  const handleImportVocab = async () => {
    if (!pastedVocab.trim()) {
      setImportStatus({ success: false, message: 'Please paste some vocabulary first.' });
      return;
    }

    try {
      const lines = pastedVocab.split('\n');
      const wordsToImport: Omit<VocabularyWord, 'id' | 'progress'>[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Try parsing JSON first
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.english && parsed.czech) {
              wordsToImport.push({
                english: parsed.english.trim(),
                czech: parsed.czech.trim(),
                category: parsed.category || importCategory,
                difficulty: parsed.difficulty || importDifficulty,
                definition: parsed.definition || `Custom vocabulary: ${parsed.english}`,
                example: parsed.example || `Example usage for ${parsed.english}`,
              });
              continue;
            }
          } catch (e) {
            // Fallback to line parser
          }
        }

        // Split by typical delimiters: hyphen (-), colon (:), semicolon (;), equal sign (=)
        const parts = trimmed.split(/[-:=;]/).map(p => p.trim());
        if (parts.length >= 2) {
          const english = parts[0];
          const czech = parts[1];
          const definition = parts[2] || `Custom vocabulary: ${english}`;
          const example = parts[3] || `Example usage for ${english}`;

          wordsToImport.push({
            english,
            czech,
            category: importCategory,
            difficulty: importDifficulty,
            definition,
            example,
          });
        }
      }

      // Check if we parsed as an entire JSON array
      if (wordsToImport.length === 0 && (pastedVocab.trim().startsWith('[') && pastedVocab.trim().endsWith(']'))) {
        try {
          const parsedArray = JSON.parse(pastedVocab);
          if (Array.isArray(parsedArray)) {
            for (const item of parsedArray) {
              if (item.english && item.czech) {
                wordsToImport.push({
                  english: item.english.trim(),
                  czech: item.czech.trim(),
                  category: item.category || importCategory,
                  difficulty: item.difficulty || importDifficulty,
                  definition: item.definition || `Custom vocabulary: ${item.english}`,
                  example: item.example || `Example usage for ${item.english}`,
                });
              }
            }
          }
        } catch (e) {
          // Ignore
        }
      }

      if (wordsToImport.length === 0) {
        setImportStatus({
          success: false,
          message: 'Could not recognize any words. Make sure to use: English - Czech - Definition (optional)',
        });
        return;
      }

      const updatedWords = await api.addCustomWords(wordsToImport);
      setWords(updatedWords);

      setImportStatus({
        success: true,
        message: `Successfully imported ${wordsToImport.length} vocabulary words!`,
      });

      setTimeout(() => {
        setIsImportModalOpen(false);
        setPastedVocab('');
        setImportStatus(null);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setImportStatus({ success: false, message: 'Failed to import. Please check format.' });
    }
  };

  // Text-to-Speech function for English words
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // START STUDY SESSIONS
  const startFlashcards = async () => {
    try {
      setLoading(true);
      const data = await api.getWords(studyCategory);
      const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 10);
      setFlashcards(shuffled);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setFlashcardFinished(false);
      setStudyMode('flashcard');
    } catch (err) {
      setError('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    try {
      setLoading(true);
      const data = await api.getQuiz(10, studyCategory, studyDirection === 'random' ? undefined : studyDirection);
      setQuizQuestions(data);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setQuizScore(0);
      setQuizFinished(false);
      setStudyMode('quiz');
    } catch (err) {
      setError('Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const startTypingTest = async () => {
    try {
      setLoading(true);
      const data = await api.getWords(studyCategory);
      const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 10);
      setTypingWords(shuffled);
      setCurrentTypingIndex(0);
      setUserTypedAnswer('');
      setTypingSubmitted(false);
      setTypingFinished(false);
      setShowTypingHint(false);
      setStudyMode('typing');
    } catch (err) {
      setError('Failed to start typing test');
    } finally {
      setLoading(false);
    }
  };

  const startCharactersChallenge = () => {
    const shuffled = [...keyboardCharacters].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    const questions: CharQuestion[] = selected.map((char) => {
      const qType = Math.random() > 0.5 ? 'find_symbol' : 'find_name';
      const correctAns = qType === 'find_symbol' ? char.symbol : char.name;

      const distractors = keyboardCharacters
        .filter((c) => c.symbol !== char.symbol)
        .map((c) => (qType === 'find_symbol' ? c.symbol : c.name));

      const uniqueDistractors = [...new Set(distractors)];
      const pickedDistractors = uniqueDistractors
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [correctAns, ...pickedDistractors].sort(() => 0.5 - Math.random());

      return {
        character: char,
        questionType: qType,
        correctAnswer: correctAns,
        options,
      };
    });

    setCharQuestions(questions);
    setCurrentCharIndex(0);
    setCharSelectedAns(null);
    setCharHasAns(false);
    setCharScore(0);
    setCharFinished(false);
    setCharTab('challenge');
    setStudyMode('characters');
  };

  // HANDLE ANSWERS
  const handleFlashcardAnswer = async (known: boolean) => {
    const word = flashcards[currentCardIndex];
    await api.submitAnswer(word.id, known);

    if (currentCardIndex + 1 < flashcards.length) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev + 1);
      }, 200);
    } else {
      setFlashcardFinished(true);
    }
  };

  const handleQuizAnswer = async (option: string) => {
    if (hasAnswered) return;
    setSelectedAnswer(option);
    setHasAnswered(true);

    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = option === question.correctAnswer;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }

    await api.submitAnswer(question.wordId, isCorrect);
  };

  const handleNextQuizQuestion = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleTypingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typingSubmitted || !userTypedAnswer.trim()) return;

    const word = typingWords[currentTypingIndex];
    const cleanAnswer = userTypedAnswer.trim().toLowerCase();
    const cleanCorrect = word.english.trim().toLowerCase();
    const isCorrect = cleanAnswer === cleanCorrect;

    setTypingIsCorrect(isCorrect);
    setTypingSubmitted(true);

    await api.submitAnswer(word.id, isCorrect);
  };

  const handleNextTypingQuestion = () => {
    if (currentTypingIndex + 1 < typingWords.length) {
      setCurrentTypingIndex((prev) => prev + 1);
      setUserTypedAnswer('');
      setTypingSubmitted(false);
      setShowTypingHint(false);
    } else {
      setTypingFinished(true);
    }
  };

  const handleCharAnswer = (option: string) => {
    if (charHasAns) return;
    setCharSelectedAns(option);
    setCharHasAns(true);

    const question = charQuestions[currentCharIndex];
    if (option === question.correctAnswer) {
      setCharScore((prev) => prev + 1);
    }
  };

  const handleNextCharQuestion = () => {
    if (currentCharIndex + 1 < charQuestions.length) {
      setCurrentCharIndex((prev) => prev + 1);
      setCharSelectedAns(null);
      setCharHasAns(false);
    } else {
      setCharFinished(true);
    }
  };

  // GRAMMAR QUIZ HANDLERS
  const startGrammarQuiz = () => {
    setGrammarQuizIndex(0);
    setGrammarSelectedAns(null);
    setGrammarHasAns(false);
    setGrammarScore(0);
    setGrammarFinished(false);
    setGrammarQuizActive(true);
  };

  const handleGrammarAnswer = (option: string, correctAnswer: string) => {
    if (grammarHasAns) return;
    setGrammarSelectedAns(option);
    setGrammarHasAns(true);
    if (option === correctAnswer) {
      setGrammarScore((prev) => prev + 1);
    }
  };

  const handleNextGrammarQuestion = (totalQuestions: number) => {
    if (grammarQuizIndex + 1 < totalQuestions) {
      setGrammarQuizIndex((prev) => prev + 1);
      setGrammarSelectedAns(null);
      setGrammarHasAns(false);
    } else {
      setGrammarFinished(true);
    }
  };

  // CATEGORY STYLING UTILS
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'programming': return <Code2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />;
      case 'database': return <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'networking': return <Network className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'security': return <Lock className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'devops': return <Terminal className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" />;
      default: return <BookOpen className="w-4 h-4 text-slate-500" />;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const baseClass = "text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase";
    switch (difficulty) {
      case 'easy': return <span className={`${baseClass} bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20`}>Easy</span>;
      case 'medium': return <span className={`${baseClass} bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20`}>Medium</span>;
      case 'hard': return <span className={`${baseClass} bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20`}>Hard</span>;
      default: return null;
    }
  };

  const filteredWords = words.filter(word => {
    const query = searchQuery.toLowerCase();
    return word.english.toLowerCase().includes(query) || 
           word.czech.toLowerCase().includes(query) ||
           word.definition.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-bg-app text-text-app flex flex-col justify-between transition-colors duration-250">
      
      {/* Header Area */}
      <header className="glass-panel sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-xl shadow-md">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-app m-0 py-0 leading-none">
              DevLingua
            </h1>
            <span className="text-[10px] text-text-muted-app tracking-wider uppercase font-semibold">IT English & Leitner Repetition</span>
          </div>
        </div>

        {/* Navigation & Theme Toggle */}
        <div className="flex items-center gap-3">
          <nav className="flex bg-bg-pill p-1 rounded-xl border border-border-pill">
            <button 
              onClick={() => { setActiveTab('vocabulary'); fetchData(); }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'vocabulary' ? 'bg-purple-accent text-white shadow-sm' : 'text-text-muted-app hover:text-text-app'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Vocabulary</span>
            </button>
            <button 
              onClick={() => { setActiveTab('study'); startFlashcards(); }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'study' ? 'bg-purple-accent text-white shadow-sm' : 'text-text-muted-app hover:text-text-app'}`}
            >
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Study Arena</span>
            </button>
            <button 
              onClick={() => { setActiveTab('grammar'); setGrammarQuizActive(false); }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'grammar' ? 'bg-purple-accent text-white shadow-sm' : 'text-text-muted-app hover:text-text-app'}`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span className="hidden sm:inline">Grammar</span>
            </button>

          </nav>

          {/* Import Vocabulary button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="p-2.5 rounded-xl bg-bg-pill border border-border-pill text-text-muted-app hover:text-text-app transition-all flex items-center justify-center cursor-pointer shadow-sm hover:border-purple-500/30 gap-1.5"
            title="Import Vocabulary"
          >
            <PlusCircle className="w-4.5 h-4.5 text-purple-accent" />
            <span className="text-xs font-bold hidden sm:inline">Paste Vocab</span>
          </button>

          {/* Theme switcher button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl bg-bg-pill border border-border-pill text-text-muted-app hover:text-text-app transition-all flex items-center justify-center cursor-pointer shadow-sm hover:border-purple-500/30"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8">
        
        {error && (
          <div className="glass-card border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-300 p-6 rounded-2xl mb-8 flex items-start gap-3 animate-slide-up">
            <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg text-rose-800 dark:text-rose-200">Connection Failure</h3>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={fetchData} 
                className="mt-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-accent"></div>
            <p className="text-text-muted-app mt-4 text-sm">Synchronizing vocabulary database...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: VOCABULARY LIST */}
            {activeTab === 'vocabulary' && (
              <section className="animate-slide-up">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-text-app tracking-tight">Vocabulary Database</h2>
                    <p className="text-text-muted-app text-sm mt-1">Browse, search, and audit your personal IT terms and translations.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-bg-pill px-4 py-2 rounded-xl border border-border-pill text-xs text-text-muted-app font-semibold shadow-sm">
                    <Flame className="text-amber-500 w-4 h-4" />
                    <span>{words.length} IT Words loaded</span>
                  </div>
                </div>

                {/* Filter and Search Panel */}
                <div className="glass-card p-5 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted-app" />
                    <input 
                      type="text"
                      placeholder="Search Czech translation, English term, or definition..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-bg-input border border-border-input rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-app placeholder-text-muted-app focus:outline-none focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/15 transition-all shadow-inner"
                    />
                  </div>

                  {/* Dropdowns */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-3">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-bg-input border border-border-input rounded-xl px-4 py-2.5 text-sm text-text-app focus:outline-none focus:border-purple-accent transition-all cursor-pointer shadow-sm"
                    >
                      <option value="all">📁 All Categories</option>
                      <option value="programming">💻 Programming</option>
                      <option value="database">🗄️ Databases</option>
                      <option value="networking">🌐 Networking</option>
                      <option value="security">🔒 Security</option>
                      <option value="devops">🚀 DevOps & Systems</option>
                    </select>

                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="bg-bg-input border border-border-input rounded-xl px-4 py-2.5 text-sm text-text-app focus:outline-none focus:border-purple-accent transition-all cursor-pointer shadow-sm"
                    >
                      <option value="all">⚡ All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                {/* Words Grid List */}
                {filteredWords.length === 0 ? (
                  <div className="glass-card py-20 text-center rounded-2xl flex flex-col items-center justify-center">
                    <HelpCircle className="w-12 h-12 text-text-muted-app mb-4 opacity-50" />
                    <h3 className="font-bold text-lg text-text-app">No matching words found</h3>
                    <p className="text-text-muted-app text-sm mt-1">Try modifying your category filters or search query.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredWords.map((word) => {
                      const isExpanded = expandedWordId === word.id;
                      const box = word.progress?.box ?? 0;
                      return (
                        <div 
                          key={word.id} 
                          className={`glass-card p-5 rounded-2xl transition-all cursor-pointer select-none relative overflow-hidden ${isExpanded ? 'ring-1.5 ring-purple-accent bg-bg-app/90 shadow-md' : ''}`}
                          onClick={() => setExpandedWordId(isExpanded ? null : word.id)}
                        >
                          {/* Top row */}
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="bg-bg-pill px-2.5 py-0.5 rounded-lg text-xs font-semibold text-text-muted-app flex items-center gap-1.5 border border-border-pill shadow-sm">
                                  {getCategoryIcon(word.category)}
                                  <span className="capitalize">{word.category}</span>
                                </span>
                                {getDifficultyBadge(word.difficulty)}
                              </div>
                              <h3 className="text-xl font-bold text-text-app tracking-tight flex items-center gap-2">
                                {word.english}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); speakWord(word.english); }}
                                  className="text-text-muted-app hover:text-purple-accent p-1 rounded-lg transition-all"
                                  title="Pronounce Word"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </h3>
                            </div>

                            {/* Spaced repetition indicator */}
                            <div className="flex flex-col items-end">
                              {box > 0 ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-text-muted-app font-bold uppercase">Leitner Box</span>
                                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-black text-white ${
                                    box === 5 ? 'bg-emerald-600' :
                                    box === 4 ? 'bg-teal-600' :
                                    box === 3 ? 'bg-cyan-600' :
                                    box === 2 ? 'bg-amber-600' : 'bg-slate-500'
                                  }`}>
                                    {box}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] bg-bg-pill text-text-muted-app px-2 py-0.5 rounded-full font-bold uppercase border border-border-pill">New Term</span>
                              )}
                              {word.progress && (
                                <span className="text-[10px] text-text-muted-app mt-1">
                                  Score: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{word.progress.correctAnswers}</span> / <span className="text-rose-600 dark:text-rose-400 font-bold">{word.progress.incorrectAnswers}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Czech translation */}
                          <div className="mt-3">
                            <span className="text-xs text-text-muted-app font-semibold">Czech translation:</span>
                            <p className="text-purple-accent dark:text-purple-300 font-extrabold text-base mt-0.5">{word.czech}</p>
                          </div>

                          {/* Expandable Details */}
                          {isExpanded && (
                            <div className="mt-5 pt-4 border-t border-border-pill text-sm animate-flip-in">
                              <div className="mb-3">
                                <span className="text-xs text-text-muted-app font-semibold uppercase tracking-wider">Definition:</span>
                                <p className="text-text-app mt-0.5 leading-relaxed bg-bg-stats-sub p-3 rounded-xl border border-border-pill font-medium">{word.definition}</p>
                              </div>
                              {word.example && (
                                <div>
                                  <span className="text-xs text-text-muted-app font-semibold uppercase tracking-wider">Example sentence:</span>
                                  <p className="text-text-muted-app italic mt-0.5 leading-relaxed bg-bg-stats-sub/50 px-3 py-2 rounded-lg border border-dashed border-border-pill font-medium">
                                    "{word.example}"
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Click to expand prompt */}
                          {!isExpanded && (
                            <div className="absolute bottom-2 right-4 flex items-center gap-1 text-[10px] text-text-muted-app font-semibold opacity-0 group-hover:opacity-100 hover:text-purple-accent transition-all">
                              <span>View Definition</span>
                              <ChevronRight className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* TAB 2: STUDY ARENA */}
            {activeTab === 'study' && (
              <section className="animate-slide-up max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-text-app tracking-tight">Study Arena</h2>
                  <p className="text-text-muted-app text-sm mt-1.5">Master IT concepts using flashcards, multiple-choice quiz questions, or typing tests.</p>
                  
                  {/* Select mode buttons */}
                  <div className="flex justify-center gap-3 mt-5">
                    <button 
                      onClick={() => { setStudyMode('flashcard'); startFlashcards(); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${studyMode === 'flashcard' ? 'bg-purple-accent text-white border-purple-accent shadow-md' : 'bg-btn-sec-bg text-btn-sec-text border-border-pill hover:bg-btn-sec-hover hover:text-text-app'}`}
                    >
                      🎴 Flashcards
                    </button>
                    <button 
                      onClick={() => { setStudyMode('quiz'); startQuiz(); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${studyMode === 'quiz' ? 'bg-purple-accent text-white border-purple-accent shadow-md' : 'bg-btn-sec-bg text-btn-sec-text border-border-pill hover:bg-btn-sec-hover hover:text-text-app'}`}
                    >
                      🏆 Quiz Challenge
                    </button>
                    <button 
                      onClick={() => { setStudyMode('typing'); startTypingTest(); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${studyMode === 'typing' ? 'bg-purple-accent text-white border-purple-accent shadow-md' : 'bg-btn-sec-bg text-btn-sec-text border-border-pill hover:bg-btn-sec-hover hover:text-text-app'}`}
                    >
                      ⌨️ Typing Test
                    </button>
                    <button 
                      onClick={() => { setStudyMode('characters'); setCharTab('learn'); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${studyMode === 'characters' ? 'bg-purple-accent text-white border-purple-accent shadow-md' : 'bg-btn-sec-bg text-btn-sec-text border-border-pill hover:bg-btn-sec-hover hover:text-text-app'}`}
                    >
                      ⌨️ Characters
                    </button>
                  </div>
                </div>

                {/* Session Config Options */}
                {!flashcardFinished && !quizFinished && !typingFinished && studyMode !== 'characters' && (
                  <div className="glass-card p-4 rounded-2xl mb-8 flex flex-wrap gap-4 items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted-app font-semibold">Category:</span>
                      <select
                        value={studyCategory}
                        onChange={(e) => setStudyCategory(e.target.value)}
                        className="bg-bg-input border border-border-input rounded-lg px-2.5 py-1.5 text-xs text-text-app font-medium focus:outline-none shadow-sm cursor-pointer"
                      >
                        <option value="all">📁 All</option>
                        <option value="programming">💻 Programming</option>
                        <option value="database">🗄️ Databases</option>
                        <option value="networking">🌐 Networking</option>
                        <option value="security">🔒 Security</option>
                        <option value="devops">🚀 DevOps</option>
                      </select>
                    </div>

                    {studyMode === 'quiz' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted-app font-semibold">Quiz Direction:</span>
                        <select
                          value={studyDirection}
                          onChange={(e) => setStudyDirection(e.target.value as any)}
                          className="bg-bg-input border border-border-input rounded-lg px-2.5 py-1.5 text-xs text-text-app font-medium focus:outline-none shadow-sm cursor-pointer"
                        >
                          <option value="random">🔀 Mix Directions</option>
                          <option value="en_to_cs">English ➔ Czech</option>
                          <option value="cs_to_en">Czech ➔ English</option>
                        </select>
                      </div>
                    )}

                    <button 
                      onClick={() => {
                        if (studyMode === 'flashcard') startFlashcards();
                        else if (studyMode === 'quiz') startQuiz();
                        else startTypingTest();
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-purple-accent hover:opacity-85 transition-all ml-auto cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Session</span>
                    </button>
                  </div>
                )}

                {/* STUDY MODULES */}
                
                {/* 1. FLASHCARDS */}
                {studyMode === 'flashcard' && (
                  <div className="space-y-6">
                    {flashcardFinished ? (
                      <div className="glass-card text-center p-10 rounded-3xl animate-slide-up flex flex-col items-center shadow-md">
                        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white mb-5 shadow-sm">
                          <Award className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-text-app">Study Block Completed!</h3>
                        <p className="text-text-muted-app text-sm mt-2 max-w-sm">
                          Awesome job reviewing terms. All answered scores have been logged to the spaced repetition database.
                        </p>
                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={startFlashcards}
                            className="bg-purple-accent hover:opacity-90 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                          >
                            Study Next 10 Cards
                          </button>
                          <button
                            onClick={() => { setActiveTab('vocabulary'); fetchData(); }}
                            className="bg-btn-sec-bg hover:bg-btn-sec-hover text-btn-sec-text font-bold text-sm px-6 py-2.5 rounded-xl border border-border-pill transition-all cursor-pointer"
                          >
                            Back to Database
                          </button>
                        </div>
                      </div>
                    ) : flashcards.length > 0 ? (
                      <div>
                        <div className="flex justify-between items-center text-xs text-text-muted-app mb-4 px-1 font-bold">
                          <span>Progress: {currentCardIndex + 1} / {flashcards.length}</span>
                          <span className="capitalize">{flashcards[currentCardIndex].category}</span>
                        </div>

                        {/* Interactive Flashcard 3D structure */}
                        <div 
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="h-[320px] bg-bg-input border border-border-input rounded-3xl cursor-pointer shadow-lg relative select-none group transition-all duration-300 hover:border-purple-500/30"
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                            
                            {!isFlipped ? (
                              <div className="animate-flip-in space-y-4">
                                <span className="text-[10px] tracking-widest text-purple-accent font-extrabold uppercase">Czech Term</span>
                                <h3 className="text-3xl font-extrabold text-text-app max-w-md">{flashcards[currentCardIndex].czech}</h3>
                                <p className="text-xs text-text-muted-app italic mt-6">Tap or click to reveal English translation</p>
                              </div>
                            ) : (
                              <div className="animate-flip-in space-y-4 w-full">
                                <span className="text-[10px] tracking-widest text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">English Term</span>
                                <h3 className="text-3xl font-extrabold text-text-app flex items-center justify-center gap-2">
                                  {flashcards[currentCardIndex].english}
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); speakWord(flashcards[currentCardIndex].english); }}
                                    className="text-text-muted-app hover:text-text-app p-1 rounded-lg transition-all"
                                  >
                                    <Volume2 className="w-5 h-5" />
                                  </button>
                                </h3>
                                
                                <div className="bg-bg-stats-sub p-4 rounded-2xl border border-border-pill max-w-md mx-auto">
                                  <span className="text-[10px] text-text-muted-app font-bold uppercase tracking-wider block mb-1">Definition:</span>
                                  <p className="text-xs text-text-app leading-relaxed font-semibold">
                                    {flashcards[currentCardIndex].definition}
                                  </p>
                                </div>

                                {flashcards[currentCardIndex].example && (
                                  <p className="text-xs text-text-muted-app italic max-w-sm mx-auto font-medium">
                                    "{flashcards[currentCardIndex].example}"
                                  </p>
                                )}
                              </div>
                            )}

                          </div>
                        </div>

                        {/* Choice feedback logs */}
                        {isFlipped && (
                          <div className="grid grid-cols-2 gap-4 mt-6 animate-slide-up">
                            <button
                              onClick={() => handleFlashcardAnswer(false)}
                              className="bg-rose-500/10 hover:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20 rounded-2xl py-4 px-6 text-sm font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <XCircle className="w-6 h-6" />
                              <span>Didn't Know It</span>
                              <span className="text-[10px] font-normal text-rose-600 dark:text-rose-500/80">Sends to Box 1</span>
                            </button>
                            <button
                              onClick={() => handleFlashcardAnswer(true)}
                              className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl py-4 px-6 text-sm font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-6 h-6" />
                              <span>I Knew It!</span>
                              <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-500/80">Promotes to next box</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="glass-card py-20 text-center rounded-2xl">
                        <HelpCircle className="w-10 h-10 text-text-muted-app mx-auto mb-3 opacity-50" />
                        <h3 className="font-bold text-text-app">No words available</h3>
                        <p className="text-text-muted-app text-xs mt-1">Try choosing another category.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. QUIZ CHALLENGE */}
                {studyMode === 'quiz' && (
                  <div className="space-y-6">
                    {quizFinished ? (
                      <div className="glass-card text-center p-10 rounded-3xl animate-slide-up flex flex-col items-center shadow-md">
                        <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white mb-5 shadow-md">
                          <Award className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-text-app">Quiz Challenge Finished!</h3>
                        <p className="text-text-muted-app text-sm mt-2 max-w-sm">
                          Excellent session! You got <span className="text-purple-accent font-bold text-lg">{quizScore}</span> out of <span className="text-text-app font-bold">{quizQuestions.length}</span> correct answers.
                        </p>
                        
                        <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-bg-pill border border-border-pill shadow-sm">
                          <Flame className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-text-app font-bold">Accuracy: {Math.round((quizScore / quizQuestions.length) * 100)}%</span>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={startQuiz}
                            className="bg-purple-accent hover:opacity-90 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                          >
                            Retake Quiz
                          </button>
                          <button
                            onClick={() => { setActiveTab('vocabulary'); fetchData(); }}
                            className="bg-btn-sec-bg hover:bg-btn-sec-hover text-btn-sec-text font-bold text-sm px-6 py-2.5 rounded-xl border border-border-pill transition-all cursor-pointer"
                          >
                            Back to Database
                          </button>
                        </div>
                      </div>
                    ) : quizQuestions.length > 0 ? (
                      <div>
                        <div className="flex justify-between items-center text-xs text-text-muted-app mb-2 px-1 font-bold">
                          <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                          <span>Score: {quizScore}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-bg-stats-sub h-1.5 rounded-full overflow-hidden mb-6 border border-border-pill">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex) / quizQuestions.length) * 100}%` }}
                          />
                        </div>

                        {/* Quiz Question Card */}
                        <div className="glass-card p-6 md:p-8 rounded-3xl border border-border-app space-y-6 shadow-md">
                          
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] tracking-widest text-text-muted-app font-black uppercase">
                              {quizQuestions[currentQuestionIndex].direction === 'en_to_cs' ? 'Translate to Czech' : 'Translate to English'}
                            </span>
                            <span className="bg-bg-pill text-[10px] text-text-muted-app px-2.5 py-0.5 rounded-md capitalize font-bold border border-border-pill shadow-sm">
                              {quizQuestions[currentQuestionIndex].category}
                            </span>
                          </div>

                          {/* Question Prompt */}
                          <div className="text-center py-4">
                            <h3 className="text-3xl font-extrabold text-text-app tracking-tight flex items-center justify-center gap-2">
                              {quizQuestions[currentQuestionIndex].direction === 'en_to_cs' 
                                ? quizQuestions[currentQuestionIndex].english 
                                : quizQuestions[currentQuestionIndex].czech
                              }
                              {quizQuestions[currentQuestionIndex].direction === 'en_to_cs' && (
                                <button 
                                  onClick={() => speakWord(quizQuestions[currentQuestionIndex].english)}
                                  className="text-text-muted-app hover:text-purple-accent p-1 rounded-lg transition-all"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              )}
                            </h3>
                            {quizQuestions[currentQuestionIndex].direction === 'en_to_cs' && (
                              <p className="text-xs text-text-muted-app italic mt-2 max-w-md mx-auto font-medium">
                                "{quizQuestions[currentQuestionIndex].definition}"
                              </p>
                            )}
                          </div>

                          {/* Quiz Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {quizQuestions[currentQuestionIndex].options.map((option, idx) => {
                              const isSelected = selectedAnswer === option;
                              const isCorrect = option === quizQuestions[currentQuestionIndex].correctAnswer;
                              
                              let btnClass = "bg-bg-option border border-border-option hover:bg-hover-option text-text-app shadow-sm cursor-pointer";
                              if (hasAnswered) {
                                if (isCorrect) {
                                  btnClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400";
                                } else if (isSelected) {
                                  btnClass = "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-400";
                                } else {
                                  btnClass = "bg-bg-option/40 border-border-option/60 text-text-muted-app opacity-60";
                                }
                              }

                              return (
                                <button
                                  key={idx}
                                  disabled={hasAnswered}
                                  onClick={() => handleQuizAnswer(option)}
                                  className={`w-full py-4 px-6 rounded-2xl text-left text-sm font-bold transition-all flex items-center justify-between ${btnClass}`}
                                >
                                  <span>{option}</span>
                                  {hasAnswered && isCorrect && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />}
                                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation Details */}
                          {hasAnswered && (
                            <div ref={quizExplanationRef} className="bg-bg-stats-sub p-5 rounded-2xl border border-border-pill space-y-2 animate-flip-in text-xs leading-relaxed">
                              <div className="flex items-center gap-1 text-[10px] text-purple-accent font-extrabold uppercase tracking-wider">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Context & usage</span>
                              </div>
                              <p className="text-text-app font-semibold">
                                <span className="font-extrabold text-text-app text-sm capitalize">{quizQuestions[currentQuestionIndex].english}</span> - {quizQuestions[currentQuestionIndex].czech}
                              </p>
                              <p className="text-text-muted-app font-medium">"{quizQuestions[currentQuestionIndex].definition}"</p>
                              {quizQuestions[currentQuestionIndex].example && (
                                <p className="text-text-muted-app border-l-2 border-purple-500/30 pl-2.5 mt-2 font-medium">
                                  Prríklad: "{quizQuestions[currentQuestionIndex].example}"
                                </p>
                              )}
                              
                              <div className="flex justify-end pt-3">
                                <button
                                  onClick={handleNextQuizQuestion}
                                  className="bg-purple-accent hover:opacity-90 text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                                >
                                  <span>Next Question</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    ) : (
                      <div className="glass-card py-20 text-center rounded-2xl">
                        <HelpCircle className="w-10 h-10 text-text-muted-app mx-auto mb-3 opacity-50" />
                        <h3 className="font-bold text-text-app">No words available</h3>
                        <p className="text-text-muted-app text-xs mt-1">Try choosing another category.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TYPING TEST */}
                {studyMode === 'typing' && (
                  <div className="space-y-6">
                    {typingFinished ? (
                      <div className="glass-card text-center p-10 rounded-3xl animate-slide-up flex flex-col items-center shadow-md">
                        <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white mb-5 shadow-sm">
                          <Award className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-text-app">Typing Challenge Completed!</h3>
                        <p className="text-text-muted-app text-sm mt-2 max-w-sm">
                          Awesome typing test! Review stats have been written to the Leitner system.
                        </p>
                        
                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={startTypingTest}
                            className="bg-purple-accent hover:opacity-90 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                          >
                            Restart Test
                          </button>
                          <button
                            onClick={() => { setActiveTab('vocabulary'); fetchData(); }}
                            className="bg-btn-sec-bg hover:bg-btn-sec-hover text-btn-sec-text font-bold text-sm px-6 py-2.5 rounded-xl border border-border-pill transition-all cursor-pointer"
                          >
                            Back to Database
                          </button>
                        </div>
                      </div>
                    ) : typingWords.length > 0 ? (
                      <div>
                        <div className="flex justify-between items-center text-xs text-text-muted-app mb-2 px-1 font-bold">
                          <span>Word {currentTypingIndex + 1} of {typingWords.length}</span>
                          <span className="capitalize">{typingWords[currentTypingIndex].category}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-bg-stats-sub h-1.5 rounded-full overflow-hidden mb-6 border border-border-pill">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
                            style={{ width: `${((currentTypingIndex) / typingWords.length) * 100}%` }}
                          />
                        </div>

                        {/* Typing prompt card */}
                        <div className="glass-card p-6 md:p-8 rounded-3xl border border-border-app space-y-6 shadow-md">
                          
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] tracking-widest text-text-muted-app font-black uppercase">
                              Translate to English
                            </span>
                            {getDifficultyBadge(typingWords[currentTypingIndex].difficulty)}
                          </div>

                          <div className="text-center py-2">
                            <span className="text-[10px] text-purple-accent font-extrabold uppercase tracking-widest">Czech Clue</span>
                            <h3 className="text-3xl font-extrabold text-text-app tracking-tight mt-1">
                              {typingWords[currentTypingIndex].czech}
                            </h3>
                          </div>

                          {/* Typing Form */}
                          <form onSubmit={handleTypingSubmit} className="space-y-4">
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] text-text-muted-app font-bold uppercase tracking-wider">English translation:</label>
                              <input 
                                type="text"
                                disabled={typingSubmitted}
                                value={userTypedAnswer}
                                onChange={(e) => setUserTypedAnswer(e.target.value)}
                                placeholder="Type English translation here..."
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                className="w-full bg-bg-input border border-border-input rounded-2xl py-3.5 px-5 text-base text-text-app placeholder-text-muted-app focus:outline-none focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/15 transition-all text-center font-bold shadow-sm"
                              />
                            </div>

                            {!typingSubmitted && (
                              <div className="flex justify-between items-center pt-2">
                                <button
                                  type="button"
                                  onClick={() => setShowTypingHint(!showTypingHint)}
                                  className="text-xs text-text-muted-app hover:text-text-app font-bold transition-all cursor-pointer"
                                >
                                  {showTypingHint ? 'Hide Hint' : 'Need a hint?'}
                                </button>
                                <button
                                  type="submit"
                                  className="bg-purple-accent hover:opacity-90 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                                >
                                  Check Answer
                                </button>
                              </div>
                            )}
                          </form>

                          {/* Clue hint view */}
                          {showTypingHint && !typingSubmitted && (
                            <div className="bg-bg-stats-sub p-4 rounded-xl border border-border-pill text-xs text-text-app animate-flip-in">
                              <span className="font-extrabold text-text-muted-app block mb-1">Definition Clue:</span>
                              <p className="font-medium italic">"{typingWords[currentTypingIndex].definition}"</p>
                              <p className="mt-2 text-text-muted-app font-medium">
                                Starts with <span className="text-purple-accent font-bold text-sm uppercase">"{typingWords[currentTypingIndex].english[0]}"</span> and has <span className="font-bold">{typingWords[currentTypingIndex].english.length}</span> letters.
                              </p>
                            </div>
                          )}

                          {/* Submit result feedback */}
                          {typingSubmitted && (
                            <div className="space-y-4 animate-flip-in">
                              {typingIsCorrect ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl flex items-center gap-3">
                                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                  <div className="text-xs font-semibold">
                                    <span className="font-bold">Correct!</span> Perfect spelling.
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 p-4 rounded-2xl flex items-start gap-3">
                                  <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                  <div className="text-xs font-semibold">
                                    <span className="font-bold">Incorrect.</span>
                                    <div className="mt-1">
                                      Your answer: <span className="line-through text-slate-500 dark:text-slate-400 mr-2">"{userTypedAnswer}"</span>
                                      Correct translation: <span className="text-purple-accent dark:text-purple-300 font-extrabold text-sm font-mono">"{typingWords[currentTypingIndex].english}"</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Details Card */}
                              <div className="bg-bg-stats-sub p-5 rounded-2xl border border-border-pill space-y-2 text-xs">
                                <span className="text-[10px] text-purple-accent font-extrabold uppercase tracking-wider block">Usage Details</span>
                                <p className="text-text-app font-semibold">
                                  <span className="font-extrabold text-text-app text-sm capitalize">{typingWords[currentTypingIndex].english}</span> - {typingWords[currentTypingIndex].czech}
                                </p>
                                <p className="text-text-muted-app font-medium">"{typingWords[currentTypingIndex].definition}"</p>
                                {typingWords[currentTypingIndex].example && (
                                  <p className="text-text-muted-app border-l-2 border-purple-500/30 pl-2.5 mt-2 font-medium">
                                    Example: "{typingWords[currentTypingIndex].example}"
                                  </p>
                                )}
                                
                                <div className="flex justify-end pt-3">
                                  <button
                                    onClick={handleNextTypingQuestion}
                                    className="bg-purple-accent hover:opacity-90 text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                                  >
                                    <span>Next Word</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    ) : (
                      <div className="glass-card py-20 text-center rounded-2xl">
                        <HelpCircle className="w-10 h-10 text-text-muted-app mx-auto mb-3 opacity-50" />
                        <h3 className="font-bold text-text-app">No words available</h3>
                        <p className="text-text-muted-app text-xs mt-1">Try choosing another category.</p>
                      </div>
                    )}
                  </div>
                )}

                {studyMode === 'characters' && (
                  <div className="space-y-6">
                    {/* Character Mode Subnavigation */}
                    <div className="flex bg-bg-pill p-1 rounded-xl border border-border-pill max-w-sm mx-auto shadow-sm">
                      <button
                        onClick={() => setCharTab('learn')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          charTab === 'learn' ? 'bg-purple-accent text-white shadow-sm' : 'text-text-muted-app hover:text-text-app'
                        }`}
                      >
                        📖 Reference Guide
                      </button>
                      <button
                        onClick={() => startCharactersChallenge()}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          charTab === 'challenge' ? 'bg-purple-accent text-white shadow-sm' : 'text-text-muted-app hover:text-text-app'
                        }`}
                      >
                        🎮 Challenge Mode
                      </button>
                    </div>

                    {/* 1. REFERENCE GUIDE */}
                    {charTab === 'learn' && (
                      <div className="space-y-4 animate-slide-up">
                        <div className="text-center max-w-md mx-auto mb-6">
                          <span className="text-[10px] text-purple-accent font-black uppercase tracking-widest">Guide Book</span>
                          <h3 className="text-xl font-bold text-text-app mt-0.5">Click a symbol to review</h3>
                          <p className="text-xs text-text-muted-app mt-1">Review English pronunciations, Czech meanings, and typical coding usage.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {keyboardCharacters.map((char) => (
                            <div
                              key={char.symbol}
                              onClick={() => {
                                speakWord(char.name);
                              }}
                              className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:-translate-y-0.5 animate-flip-in"
                            >
                              <span className="text-4xl font-extrabold text-purple-accent dark:text-purple-300 font-mono mb-2">
                                {char.symbol}
                              </span>
                              <span className="text-sm font-extrabold text-text-app capitalize flex items-center gap-1">
                                {char.name}
                                <Volume2 className="w-3.5 h-3.5 text-text-muted-app hover:text-purple-accent" />
                              </span>
                              <span className="text-[10px] text-text-muted-app font-semibold mt-1">
                                {char.czechName}
                              </span>

                              <div className="mt-3 pt-2.5 border-t border-border-pill w-full text-[10px] text-text-muted-app font-medium text-left leading-normal space-y-1">
                                <div>
                                  <span className="font-bold text-text-app">Usage:</span> {char.description}
                                </div>
                                <div className="font-mono bg-bg-stats-sub p-1 rounded border border-border-pill text-[9px] text-indigo-600 dark:text-indigo-400 mt-1 truncate">
                                  {char.codeExample}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. CHALLENGE MODE */}
                    {charTab === 'challenge' && (
                      <div className="animate-slide-up">
                        {charFinished ? (
                          <div className="glass-card text-center p-10 rounded-3xl flex flex-col items-center shadow-md max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white mb-5 shadow-sm">
                              <Award className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-text-app">Challenge Completed!</h3>
                            <p className="text-text-muted-app text-sm mt-2">
                              Great job! You identified <span className="text-purple-accent font-bold text-lg">{charScore}</span> out of <span className="text-text-app font-bold">{charQuestions.length}</span> characters correctly.
                            </p>

                            <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-bg-pill border border-border-pill shadow-sm">
                              <Flame className="w-4 h-4 text-amber-500" />
                              <span className="text-xs text-text-app font-bold">Accuracy: {Math.round((charScore / charQuestions.length) * 100)}%</span>
                            </div>

                            <div className="flex gap-4 mt-6 w-full">
                              <button
                                onClick={startCharactersChallenge}
                                className="flex-1 bg-purple-accent hover:opacity-90 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                              >
                                Replay Challenge
                              </button>
                              <button
                                onClick={() => setCharTab('learn')}
                                className="flex-1 bg-btn-sec-bg hover:bg-btn-sec-hover text-btn-sec-text font-bold text-sm py-2.5 rounded-xl border border-border-pill transition-all cursor-pointer"
                              >
                                Back to Guide
                              </button>
                            </div>
                          </div>
                        ) : charQuestions.length > 0 ? (
                          <div className="max-w-xl mx-auto space-y-6">
                            <div className="flex justify-between items-center text-xs text-text-muted-app px-1 font-bold">
                              <span>Question {currentCharIndex + 1} of {charQuestions.length}</span>
                              <span>Score: {charScore}</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-bg-stats-sub h-1.5 rounded-full overflow-hidden border border-border-pill">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
                                style={{ width: `${(currentCharIndex / charQuestions.length) * 100}%` }}
                              />
                            </div>

                            {/* Question Card */}
                            <div className="glass-card p-6 md:p-8 rounded-3xl border border-border-app space-y-6 shadow-md">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] tracking-widest text-text-muted-app font-black uppercase">
                                  {charQuestions[currentCharIndex].questionType === 'find_symbol'
                                    ? 'Identify Symbol'
                                    : 'Identify Character Name'}
                                </span>
                                <span className="bg-bg-pill text-[10px] text-text-muted-app px-2.5 py-0.5 rounded-md font-bold border border-border-pill shadow-sm">
                                  Keyboard Keys
                                </span>
                              </div>

                              {/* Question Prompt */}
                              <div className="text-center py-2">
                                <span className="text-[10px] text-purple-accent font-extrabold uppercase tracking-widest">
                                  {charQuestions[currentCharIndex].questionType === 'find_symbol'
                                    ? 'Select the symbol for:'
                                    : 'Select the name of this symbol:'}
                                </span>
                                <h3 className="text-4xl font-black text-text-app tracking-tight mt-2 flex items-center justify-center gap-2">
                                  {charQuestions[currentCharIndex].questionType === 'find_symbol' ? (
                                    <span className="capitalize">{charQuestions[currentCharIndex].character.name}</span>
                                  ) : (
                                    <span className="font-mono text-5xl text-purple-accent dark:text-purple-300">
                                      {charQuestions[currentCharIndex].character.symbol}
                                    </span>
                                  )}
                                  <button
                                    onClick={() => speakWord(charQuestions[currentCharIndex].character.name)}
                                    className="text-text-muted-app hover:text-text-app p-1 rounded-lg transition-all"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                </h3>
                              </div>

                              {/* Options Grid */}
                              <div className="grid grid-cols-2 gap-3 mt-4">
                                {charQuestions[currentCharIndex].options.map((option, idx) => {
                                  const isSelected = charSelectedAns === option;
                                  const isCorrect = option === charQuestions[currentCharIndex].correctAnswer;

                                  let btnClass = "bg-bg-option border border-border-option hover:bg-hover-option text-text-app shadow-sm cursor-pointer py-4 px-6 rounded-2xl font-bold transition-all text-center";
                                  
                                  const isSymbolOption = option.length === 1;
                                  if (isSymbolOption) {
                                    btnClass += " font-mono text-2xl py-3";
                                  } else {
                                    btnClass += " capitalize text-sm";
                                  }

                                  if (charHasAns) {
                                    if (isCorrect) {
                                      btnClass = isSymbolOption 
                                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-mono text-2xl py-3 shadow-sm"
                                        : "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 capitalize text-sm py-4 px-6 rounded-2xl font-bold text-center";
                                    } else if (isSelected) {
                                      btnClass = isSymbolOption
                                        ? "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-400 font-mono text-2xl py-3 shadow-sm"
                                        : "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-400 capitalize text-sm py-4 px-6 rounded-2xl font-bold text-center";
                                    } else {
                                      btnClass += " opacity-40";
                                    }
                                  }

                                  return (
                                    <button
                                      key={idx}
                                      disabled={charHasAns}
                                      onClick={() => handleCharAnswer(option)}
                                      className={btnClass}
                                    >
                                      {option}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanation Card */}
                              {charHasAns && (
                                <div ref={charExplanationRef} className="bg-bg-stats-sub p-5 rounded-2xl border border-border-pill space-y-2 animate-flip-in text-xs leading-relaxed">
                                  <div className="flex items-center gap-1 text-[10px] text-purple-accent font-extrabold uppercase tracking-wider">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>Keyboard usage context</span>
                                  </div>
                                  <p className="text-text-app font-semibold">
                                    <span className="font-mono text-lg text-purple-accent dark:text-purple-300 mr-2">
                                      {charQuestions[currentCharIndex].character.symbol}
                                    </span>
                                    <span className="font-extrabold text-text-app text-sm capitalize">
                                      {charQuestions[currentCharIndex].character.name}
                                    </span>{' '}
                                    - <span className="italic">{charQuestions[currentCharIndex].character.czechName}</span>
                                  </p>
                                  <p className="text-text-muted-app font-medium">
                                    {charQuestions[currentCharIndex].character.description}
                                  </p>
                                  <p className="font-mono bg-bg-app p-2.5 rounded border border-border-pill text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                                    Example: {charQuestions[currentCharIndex].character.codeExample}
                                  </p>

                                  <div className="flex justify-end pt-3">
                                    <button
                                      onClick={handleNextCharQuestion}
                                      className="bg-purple-accent hover:opacity-90 text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                                    >
                                      <span>Next Question</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}

              </section>
            )}

            {activeTab === 'grammar' && (
              <section className="animate-slide-up space-y-6">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-extrabold text-text-app tracking-tight">Grammar Lab</h2>
                  <p className="text-text-muted-app text-sm mt-1">Review vital English grammar constructs formatted with coding-focused examples.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                  
                  {/* Left Sidebar Menu */}
                  <div className="flex flex-col gap-2 bg-bg-pill p-2 rounded-2xl border border-border-pill shadow-sm md:col-span-1">
                    <span className="text-[10px] text-text-muted-app font-bold uppercase tracking-wider px-3 py-1 block">Grammar Topics</span>
                    {grammarTopics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          setSelectedGrammarTopicId(topic.id);
                          setGrammarQuizActive(false);
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase text-left transition-all cursor-pointer ${
                          selectedGrammarTopicId === topic.id
                            ? 'bg-purple-accent text-white shadow-sm'
                            : 'text-text-muted-app hover:text-text-app hover:bg-bg-stats-sub'
                        }`}
                      >
                        {topic.title}
                      </button>
                    ))}
                  </div>

                  {/* Right Main Details View */}
                  <div className="md:col-span-3 space-y-6">
                    {(() => {
                      const topic = grammarTopics.find((t) => t.id === selectedGrammarTopicId);
                      if (!topic) return null;

                      return (
                        <>
                          {!grammarQuizActive ? (
                            <div className="glass-card p-6 md:p-8 rounded-3xl border border-border-app space-y-6 shadow-md animate-flip-in">
                              <div>
                                <span className="text-[10px] text-purple-accent font-black uppercase tracking-widest">{topic.czechTitle}</span>
                                <h3 className="text-2xl font-extrabold text-text-app mt-0.5">{topic.title}</h3>
                                <p className="text-sm text-text-muted-app mt-1 leading-relaxed">{topic.description}</p>
                              </div>

                              <div className="space-y-6 pt-2">
                                {topic.rules.map((rule, index) => (
                                  <div key={index} className="space-y-3 bg-bg-stats-sub/30 p-5 rounded-2xl border border-border-pill">
                                    <h4 className="font-bold text-base text-text-app flex items-center gap-2">
                                      <span className="w-1.5 h-6 bg-purple-accent rounded-full" />
                                      <span>{rule.title}</span>
                                    </h4>
                                    <p className="text-xs text-text-muted-app leading-relaxed font-semibold">
                                      {rule.explanation}
                                    </p>
                                    
                                    <div className="space-y-2 pt-2">
                                      <span className="text-[9px] text-text-muted-app font-bold uppercase tracking-wider block">Context Examples</span>
                                      <div className="grid grid-cols-1 gap-2">
                                        {rule.examples.map((ex, exIdx) => (
                                          <div key={exIdx} className="bg-bg-input p-3 rounded-xl border border-border-input flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 text-xs font-semibold">
                                            <span className="text-text-app font-mono text-[11px] font-bold">"{ex.en}"</span>
                                            <span className="text-purple-accent dark:text-purple-300 italic text-[11px] font-semibold">{ex.cs}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-end pt-4 border-t border-border-pill">
                                <button
                                  onClick={startGrammarQuiz}
                                  className="bg-purple-accent hover:opacity-90 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                                >
                                  <span>Practice Topic Quiz</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="animate-flip-in">
                              {grammarFinished ? (
                                <div className="glass-card text-center p-10 rounded-3xl flex flex-col items-center shadow-md max-w-md mx-auto">
                                  <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white mb-5 shadow-sm">
                                    <Award className="w-8 h-8" />
                                  </div>
                                  <h3 className="text-2xl font-black text-text-app">Practice Finished!</h3>
                                  <p className="text-text-muted-app text-sm mt-2">
                                    Nice review! You scored <span className="text-purple-accent font-bold text-lg">{grammarScore}</span> out of <span className="text-text-app font-bold">{topic.quiz.length}</span> correct answers.
                                  </p>

                                  <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-bg-pill border border-border-pill shadow-sm">
                                    <Flame className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs text-text-app font-bold">Accuracy: {Math.round((grammarScore / topic.quiz.length) * 100)}%</span>
                                  </div>

                                  <div className="flex gap-4 mt-6 w-full">
                                    <button
                                      onClick={startGrammarQuiz}
                                      className="flex-1 bg-purple-accent hover:opacity-90 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                                    >
                                      Retry Quiz
                                    </button>
                                    <button
                                      onClick={() => setGrammarQuizActive(false)}
                                      className="flex-1 bg-btn-sec-bg hover:bg-btn-sec-hover text-btn-sec-text font-bold text-sm py-2.5 rounded-xl border border-border-pill transition-all cursor-pointer"
                                    >
                                      Review Rules
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  <div className="flex justify-between items-center text-xs text-text-muted-app px-1 font-bold">
                                    <span>Question {grammarQuizIndex + 1} of {topic.quiz.length}</span>
                                    <span>Score: {grammarScore}</span>
                                  </div>

                                  <div className="w-full bg-bg-stats-sub h-1.5 rounded-full overflow-hidden border border-border-pill">
                                    <div
                                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
                                      style={{ width: `${(grammarQuizIndex / topic.quiz.length) * 100}%` }}
                                    />
                                  </div>

                                  <div className="glass-card p-6 md:p-8 rounded-3xl border border-border-app space-y-6 shadow-md">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] tracking-widest text-text-muted-app font-black uppercase">Fill in the blank</span>
                                      <span className="bg-bg-pill text-[10px] text-text-muted-app px-2.5 py-0.5 rounded-md font-bold border border-border-pill shadow-sm">
                                        {topic.title}
                                      </span>
                                    </div>

                                    <div className="text-center py-4">
                                      <h3 className="text-2xl font-extrabold text-text-app tracking-tight mt-2 leading-relaxed font-semibold">
                                        {topic.quiz[grammarQuizIndex].question}
                                      </h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                      {topic.quiz[grammarQuizIndex].options.map((option, idx) => {
                                        const isSelected = grammarSelectedAns === option;
                                        const isCorrect = option === topic.quiz[grammarQuizIndex].correctAnswer;

                                        let btnClass = "bg-bg-option border border-border-option hover:bg-hover-option text-text-app shadow-sm cursor-pointer py-4 px-6 rounded-2xl font-bold transition-all text-center text-sm";
                                        
                                        if (grammarHasAns) {
                                          if (isCorrect) {
                                            btnClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 py-4 px-6 rounded-2xl font-bold text-center text-sm shadow-sm";
                                          } else if (isSelected) {
                                            btnClass = "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-400 py-4 px-6 rounded-2xl font-bold text-center text-sm shadow-sm";
                                          } else {
                                            btnClass += " opacity-40";
                                          }
                                        }

                                        return (
                                          <button
                                            key={idx}
                                            disabled={grammarHasAns}
                                            onClick={() => handleGrammarAnswer(option, topic.quiz[grammarQuizIndex].correctAnswer)}
                                            className={btnClass}
                                          >
                                            {option}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {grammarHasAns && (
                                      <div ref={grammarExplanationRef} className="bg-bg-stats-sub p-5 rounded-2xl border border-border-pill space-y-2 animate-flip-in text-xs leading-relaxed">
                                        <div className="flex items-center gap-1 text-[10px] text-purple-accent font-extrabold uppercase tracking-wider">
                                          <AlertCircle className="w-3.5 h-3.5" />
                                          <span>Grammar Explanation</span>
                                        </div>
                                        <p className="text-text-app font-semibold">
                                          Answer: <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">"{topic.quiz[grammarQuizIndex].correctAnswer}"</span>
                                        </p>
                                        <p className="text-text-muted-app font-semibold">
                                          {topic.quiz[grammarQuizIndex].explanation}
                                        </p>

                                        <div className="flex justify-end pt-3">
                                          <button
                                            onClick={() => handleNextGrammarQuestion(topic.quiz.length)}
                                            className="bg-purple-accent hover:opacity-90 text-white font-bold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                                          >
                                            <span>Next Question</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                </div>
              </section>
            )}


          </>
        )}
      </main>

      {/* IMPORT MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-2xl rounded-3xl border border-border-app p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-flip-in">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black text-text-app">Import Vocabulary</h3>
                <p className="text-xs text-text-muted-app mt-1">Paste your custom vocabulary words to add them to your spaced repetition learning schedule.</p>
              </div>
              <button
                onClick={() => { setIsImportModalOpen(false); setImportStatus(null); }}
                className="text-text-muted-app hover:text-text-app p-1 rounded-lg transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-text-muted-app font-bold uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value)}
                    className="w-full bg-bg-input border border-border-input hover:border-purple-500/30 text-text-app rounded-xl px-4 py-2.5 outline-none transition-all"
                  >
                    <option value="custom">Custom Vocab</option>
                    <option value="programming">Programming</option>
                    <option value="database">Database</option>
                    <option value="networking">Networking</option>
                    <option value="security">Security</option>
                    <option value="devops">DevOps</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-text-muted-app font-bold uppercase tracking-wider mb-1.5">Difficulty</label>
                  <select
                    value={importDifficulty}
                    onChange={(e) => setImportDifficulty(e.target.value)}
                    className="w-full bg-bg-input border border-border-input hover:border-purple-500/30 text-text-app rounded-xl px-4 py-2.5 outline-none transition-all"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-text-muted-app font-bold uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Pasted Vocabulary list</span>
                  <span className="text-[9px] lowercase italic text-purple-accent">format: English - Czech - Definition (optional)</span>
                </label>
                <textarea
                  rows={8}
                  value={pastedVocab}
                  onChange={(e) => setPastedVocab(e.target.value)}
                  placeholder={`Example:\ncompiler - kompilátor - Translates code into machine code\ndeprecation - zavržení - Declaring code obsolete\n\nOr JSON:\n[{"english": "middleware", "czech": "middleware", "definition": "custom definition"}]`}
                  className="w-full font-mono bg-bg-input border border-border-input hover:border-purple-500/30 text-text-app rounded-2xl p-4 outline-none transition-all resize-none text-[11px] leading-relaxed"
                />
              </div>
            </div>

            {/* Status alerts */}
            {importStatus && (
              <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed flex items-center gap-3 animate-flip-in ${
                importStatus.success
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400'
              }`}>
                {importStatus.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
                <span>{importStatus.message}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border-pill">
              <button
                onClick={() => { setIsImportModalOpen(false); setImportStatus(null); }}
                className="bg-btn-sec-bg hover:bg-btn-sec-hover text-btn-sec-text font-bold text-xs py-2.5 px-5 rounded-xl border border-border-pill transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleImportVocab}
                className="bg-purple-accent hover:opacity-90 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Vocabulary
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
