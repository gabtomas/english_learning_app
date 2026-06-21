export interface UserProgress {
  correctAnswers: number;
  incorrectAnswers: number;
  box: number;
  nextReviewDate: string;
  lastReviewed: string | null;
}

export interface VocabularyWord {
  id: number;
  english: string;
  czech: string;
  category: string;
  definition: string;
  example: string;
  difficulty: string;
  progress: UserProgress | null;
}

export interface QuizQuestion {
  wordId: number;
  english: string;
  czech: string;
  category: string;
  difficulty: string;
  definition: string;
  example: string;
  options: string[];
  direction: 'en_to_cs' | 'cs_to_en';
  correctAnswer: string;
}

export interface QuizAnswerResponse {
  wordId: number;
  correct: boolean;
  correctAnswers: number;
  incorrectAnswers: number;
  box: number;
  nextReviewDate: string;
}

export interface Stats {
  totalWords: number;
  wordsLearned: number;
  reviewProgress: number;
  successRate: number;
  boxDistribution: Record<number, number>;
  categoryDistribution: Record<string, number>;
}

// Static Vocabulary database
const staticWords: Omit<VocabularyWord, 'progress'>[] = [
  // Programming
  {
    id: 1,
    english: 'variable',
    czech: 'proměnná',
    category: 'programming',
    difficulty: 'easy',
    definition: 'A data container that can store different values during execution.',
    example: 'You must declare a variable before you can assign a value to it.',
  },
  {
    id: 2,
    english: 'array',
    czech: 'pole',
    category: 'programming',
    difficulty: 'easy',
    definition: 'A data structure containing an ordered collection of elements.',
    example: 'An array index in JavaScript starts at zero.',
  },
  {
    id: 3,
    english: 'function',
    czech: 'funkce',
    category: 'programming',
    difficulty: 'easy',
    definition: 'A reusable block of code that performs a specific task.',
    example: 'This helper function formats dates into Czech style.',
  },
  {
    id: 4,
    english: 'compiler',
    czech: 'kompilátor',
    category: 'programming',
    difficulty: 'medium',
    definition: 'A program that translates source code into machine code or bytecode.',
    example: 'The TypeScript compiler checks type safety and produces plain JavaScript.',
  },
  {
    id: 5,
    english: 'inheritance',
    czech: 'dědičnost',
    category: 'programming',
    difficulty: 'medium',
    definition: 'A mechanism where a class acquires the properties and methods of another class.',
    example: 'Object-oriented languages support inheritance to promote code reuse.',
  },
  {
    id: 6,
    english: 'polymorphism',
    czech: 'polymorfismus',
    category: 'programming',
    difficulty: 'hard',
    definition: 'The ability of an object or function to take on many forms and behave differently depending on the context.',
    example: 'Method overriding is a classic runtime demonstration of polymorphism.',
  },
  {
    id: 7,
    english: 'recursion',
    czech: 'rekurze',
    category: 'programming',
    difficulty: 'hard',
    definition: 'A programming technique where a function calls itself directly or indirectly.',
    example: 'Calculating factorials or traversing binary trees is commonly done using recursion.',
  },
  {
    id: 8,
    english: 'concurrency',
    czech: 'souběžnost',
    category: 'programming',
    difficulty: 'hard',
    definition: 'The execution of multiple tasks or processes at the same time.',
    example: 'Node.js handles concurrency using a single-threaded event loop and asynchronous callbacks.',
  },
  {
    id: 9,
    english: 'framework',
    czech: 'rámec',
    category: 'programming',
    difficulty: 'medium',
    definition: 'A pre-built set of tools, libraries, and conventions for developing applications.',
    example: 'NestJS is a progressive Node.js framework for building efficient backend systems.',
  },
  {
    id: 10,
    english: 'dependency',
    czech: 'závislost',
    category: 'programming',
    difficulty: 'medium',
    definition: 'An external library, package, or module that an application relies on to function.',
    example: 'We use the package.json file to manage project dependencies.',
  },

  // Database
  {
    id: 11,
    english: 'query',
    czech: 'dotaz',
    category: 'database',
    difficulty: 'easy',
    definition: 'A request for data or information from a database table.',
    example: 'We wrote a query to select all inactive users from the database.',
  },
  {
    id: 12,
    english: 'index',
    czech: 'index',
    category: 'database',
    difficulty: 'medium',
    definition: 'A database structure that improves the speed of data retrieval operations.',
    example: 'Adding an index to the email column speeded up the login queries significantly.',
  },
  {
    id: 13,
    english: 'foreign key',
    czech: 'cizí klíč',
    category: 'database',
    difficulty: 'medium',
    definition: 'A column or group of columns that creates a link between data in two tables.',
    example: 'The foreign key constraint ensures that every order is linked to a valid user.',
  },
  {
    id: 14,
    english: 'transaction',
    czech: 'transakce',
    category: 'database',
    difficulty: 'medium',
    definition: 'A sequence of operations performed as a single logical unit of work that must succeed or fail completely.',
    example: 'A database transaction is crucial when transferring funds between two bank accounts.',
  },
  {
    id: 15,
    english: 'constraint',
    czech: 'omezení',
    category: 'database',
    difficulty: 'hard',
    definition: 'A rule applied to database columns to restrict the types of data allowed.',
    example: 'A unique constraint was placed on the username column.',
  },
  {
    id: 16,
    english: 'migration',
    czech: 'migrace',
    category: 'database',
    difficulty: 'medium',
    definition: 'The process of managing database schema changes over time in a controlled way.',
    example: 'We ran a TypeORM migration to add a new column to the user table.',
  },
  {
    id: 17,
    english: 'redundancy',
    czech: 'redundance',
    category: 'database',
    difficulty: 'hard',
    definition: 'The duplication of data or systems to ensure consistency, reliability, or backup.',
    example: 'Primary-replica database setups introduce database redundancy for high availability.',
  },
  {
    id: 18,
    english: 'normalization',
    czech: 'normalizace',
    category: 'database',
    difficulty: 'hard',
    definition: 'The process of organizing database tables to reduce redundancy and improve data integrity.',
    example: 'Database normalization involves splitting tables to satisfy normal forms.',
  },

  // Networking
  {
    id: 19,
    english: 'bandwidth',
    czech: 'šířka pásma',
    category: 'networking',
    difficulty: 'medium',
    definition: 'The maximum rate of data transfer across a given path or connection.',
    example: 'Streaming high-definition video requires a connection with high bandwidth.',
  },
  {
    id: 20,
    english: 'latency',
    czech: 'latence',
    category: 'networking',
    difficulty: 'medium',
    definition: 'The time delay between a data request and the start of the data transmission.',
    example: 'Online multiplayer gaming requires low network latency.',
  },
  {
    id: 21,
    english: 'gateway',
    czech: 'brána',
    category: 'networking',
    difficulty: 'medium',
    definition: 'A network node that connects two different networks using different protocols.',
    example: 'The home router acts as a gateway connecting local devices to the internet.',
  },
  {
    id: 22,
    english: 'packet',
    czech: 'paket',
    category: 'networking',
    difficulty: 'easy',
    definition: 'A small segment of data sent over a computer network.',
    example: 'Information sent over the internet is split into packets and reassembled at the destination.',
  },
  {
    id: 23,
    english: 'routing',
    czech: 'směrování',
    category: 'networking',
    difficulty: 'medium',
    definition: 'The process of selecting paths in a network along which to send data packets.',
    example: 'Routers use dynamic routing protocols to find the most efficient paths.',
  },
  {
    id: 24,
    english: 'handshake',
    czech: 'navázání spojení',
    category: 'networking',
    difficulty: 'hard',
    definition: 'An automated process by which two devices establish communication protocols.',
    example: 'The TCP three-way handshake is used to establish a reliable connection.',
  },
  {
    id: 25,
    english: 'subnet',
    czech: 'podsíť',
    category: 'networking',
    difficulty: 'hard',
    definition: 'A logically visible subdivision of an IP network.',
    example: 'System administrators divide the company network into subnets for better organization.',
  },

  // Security
  {
    id: 26,
    english: 'encryption',
    czech: 'šifrování',
    category: 'security',
    difficulty: 'easy',
    definition: 'The process of converting information into secret code to prevent unauthorized access.',
    example: 'SSL/TLS provides encryption for data transmitted between a web browser and a server.',
  },
  {
    id: 27,
    english: 'decryption',
    czech: 'dešifrování',
    category: 'security',
    difficulty: 'easy',
    definition: 'The process of converting encrypted data back into its original readable format.',
    example: 'The receiver used a private key for the decryption of the email.',
  },
  {
    id: 28,
    english: 'vulnerability',
    czech: 'zranitelnost',
    category: 'security',
    difficulty: 'medium',
    definition: 'A weakness in a system, network, or software that can be exploited by an attacker.',
    example: 'Updating dependencies regularly helps fix security vulnerabilities.',
  },
  {
    id: 29,
    english: 'threat',
    czech: 'hrozba',
    category: 'security',
    difficulty: 'easy',
    definition: 'A potential negative event or action that can compromise information or system security.',
    example: 'Malware represents a significant threat to corporate networks.',
  },
  {
    id: 30,
    english: 'authentication',
    czech: 'autentizace',
    category: 'security',
    difficulty: 'medium',
    definition: 'The process of verifying the identity of a user, device, or system.',
    example: 'Multi-factor authentication (MFA) requires users to provide two or more verification factors.',
  },
  {
    id: 31,
    english: 'authorization',
    czech: 'autorizace',
    category: 'security',
    difficulty: 'medium',
    definition: 'The process of granting permission to access specific resources or perform actions.',
    example: 'Even after authentication, you need authorization to view administrative pages.',
  },
  {
    id: 32,
    english: 'phishing',
    czech: 'rhybaření',
    category: 'security',
    difficulty: 'medium',
    definition: 'A malicious attempt to obtain sensitive information by disguising as a trustworthy entity.',
    example: 'Be suspicious of emails asking you to click link and re-enter your password to avoid phishing.',
  },
  {
    id: 33,
    english: 'firewall',
    czech: 'firewall',
    category: 'security',
    difficulty: 'easy',
    definition: 'A network security system that monitors and controls traffic based on predetermined rules.',
    example: 'The corporate firewall blocked the unauthorized connection request.',
  },

  // DevOps & System
  {
    id: 34,
    english: 'deployment',
    czech: 'nasazení',
    category: 'devops',
    difficulty: 'medium',
    definition: 'The process of making an application or code update available for use on a server.',
    example: 'Our CI/CD pipeline automates the deployment of the application to AWS.',
  },
  {
    id: 35,
    english: 'repository',
    czech: 'repozitář',
    category: 'devops',
    difficulty: 'easy',
    definition: 'A central file storage location where source code and its history are tracked.',
    example: 'We push all our code changes to a shared GitHub repository.',
  },
  {
    id: 36,
    english: 'pipeline',
    czech: 'pipeline',
    category: 'devops',
    difficulty: 'medium',
    definition: 'A sequence of automated steps to build, test, and release software.',
    example: 'A failing test broke the deployment pipeline.',
  },
  {
    id: 37,
    english: 'middleware',
    czech: 'middleware',
    category: 'devops',
    difficulty: 'medium',
    definition: 'Software that acts as a bridge between an operating system/database and applications.',
    example: 'Express uses middleware to parse incoming JSON request bodies.',
  },
  {
    id: 38,
    english: 'deprecate',
    czech: 'zavrhnout',
    category: 'devops',
    difficulty: 'hard',
    definition: 'To declare a software feature or library obsolete and express disapproval of its use.',
    example: 'The API team decided to deprecate the older version of the login endpoint.',
  },
  {
    id: 39,
    english: 'refactoring',
    czech: 'refaktorování',
    category: 'devops',
    difficulty: 'medium',
    definition: 'The process of restructuring existing computer code without changing its external behavior.',
    example: 'We spent the morning refactoring the vocabulary service to make it cleaner.',
  },
  {
    id: 40,
    english: 'legacy',
    czech: 'zastaralý',
    category: 'devops',
    difficulty: 'medium',
    definition: 'An old software system, code library, or technology that remains in use.',
    example: 'Maintaining legacy codebases can be time-consuming but necessary.',
  },
  {
    id: 41,
    english: 'scalability',
    czech: 'škálovatelnost',
    category: 'devops',
    difficulty: 'hard',
    definition: 'The capability of a system to handle a growing amount of work or to be enlarged.',
    example: 'Horizontal scaling is an excellent pattern for cloud application scalability.',
  },
  {
    id: 42,
    english: 'endpoint',
    czech: 'koncový bod',
    category: 'devops',
    difficulty: 'easy',
    definition: 'A specific destination connection point on a network or API where communication occurs.',
    example: 'The backend exposes an HTTP GET endpoint at /api/vocabulary/quiz.',
  },
];

// Helper to get progress from localStorage
const LOCAL_STORAGE_KEY = 'devlingua_spaced_progress';

function loadLocalStorageProgress(): Record<number, UserProgress> {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to parse localStorage progress:', e);
    return {};
  }
}

function saveLocalStorageProgress(progress: Record<number, UserProgress>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export const api = {
  async getWords(category?: string, difficulty?: string): Promise<VocabularyWord[]> {
    const progressMap = loadLocalStorageProgress();
    
    let filtered = staticWords.map(word => ({
      ...word,
      progress: progressMap[word.id] || null,
    }));

    if (category && category !== 'all') {
      filtered = filtered.filter(w => w.category === category);
    }
    
    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(w => w.difficulty === difficulty);
    }

    return filtered;
  },

  async getQuiz(limit = 10, category?: string, direction?: string): Promise<QuizQuestion[]> {
    let filtered = [...staticWords];
    
    if (category && category !== 'all') {
      filtered = filtered.filter(w => w.category === category);
    }

    // Shuffle words
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(limit, shuffled.length));

    const quizQuestions: QuizQuestion[] = [];
    const dir = direction || (Math.random() > 0.5 ? 'en_to_cs' : 'cs_to_en');

    for (const word of selected) {
      const correctAnswer = dir === 'en_to_cs' ? word.czech : word.english;

      // Generate distractors
      const distractors = filtered
        .filter(w => w.id !== word.id)
        .map(w => (dir === 'en_to_cs' ? w.czech : w.english));

      const uniqueDistractors = [...new Set(distractors)];
      const pickedDistractors = uniqueDistractors
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [correctAnswer, ...pickedDistractors].sort(() => 0.5 - Math.random());

      quizQuestions.push({
        wordId: word.id,
        english: word.english,
        czech: word.czech,
        category: word.category,
        difficulty: word.difficulty,
        definition: word.definition,
        example: word.example,
        options,
        direction: dir as 'en_to_cs' | 'cs_to_en',
        correctAnswer,
      });
    }

    return quizQuestions;
  },

  async submitAnswer(wordId: number, isCorrect: boolean): Promise<QuizAnswerResponse> {
    const progressMap = loadLocalStorageProgress();
    let record = progressMap[wordId];

    if (!record) {
      record = {
        correctAnswers: 0,
        incorrectAnswers: 0,
        box: 1,
        nextReviewDate: new Date().toISOString(),
        lastReviewed: null,
      };
    }

    const now = new Date();
    record.lastReviewed = now.toISOString();

    if (isCorrect) {
      record.correctAnswers += 1;
      if (record.box < 5) {
        record.box += 1;
      }
    } else {
      record.incorrectAnswers += 1;
      record.box = 1;
    }

    // Leitner intervals in hours
    const intervals = [1, 24, 72, 168, 336];
    const hours = intervals[record.box - 1];
    
    const nextReview = new Date();
    nextReview.setHours(nextReview.getHours() + hours);
    record.nextReviewDate = nextReview.toISOString();

    progressMap[wordId] = record;
    saveLocalStorageProgress(progressMap);

    return {
      wordId,
      correct: isCorrect,
      correctAnswers: record.correctAnswers,
      incorrectAnswers: record.incorrectAnswers,
      box: record.box,
      nextReviewDate: record.nextReviewDate,
    };
  },

  async getStats(): Promise<Stats> {
    const progressMap = loadLocalStorageProgress();
    const progressRecords = Object.values(progressMap);
    const totalWords = staticWords.length;

    const wordsLearned = progressRecords.filter(p => p.box >= 4).length;
    const totalReviews = progressRecords.reduce((acc, curr) => acc + curr.correctAnswers + curr.incorrectAnswers, 0);
    const correctReviews = progressRecords.reduce((acc, curr) => acc + curr.correctAnswers, 0);
    const successRate = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

    // Leitner Box distributions
    const boxCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    progressRecords.forEach(p => {
      if (boxCounts[p.box] !== undefined) {
        boxCounts[p.box]++;
      }
    });
    boxCounts[1] += (totalWords - progressRecords.length);

    // Categories distributions
    const categoryCounts: Record<string, number> = {};
    staticWords.forEach(w => {
      categoryCounts[w.category] = (categoryCounts[w.category] || 0) + 1;
    });

    return {
      totalWords,
      wordsLearned,
      reviewProgress: progressRecords.length,
      successRate,
      boxDistribution: boxCounts,
      categoryDistribution: categoryCounts,
    };
  },
};
