import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VocabularyWord } from './vocabulary.entity';
import { UserProgress } from './progress.entity';

@Injectable()
export class VocabularyService implements OnModuleInit {
  constructor(
    @InjectRepository(VocabularyWord)
    private readonly wordRepository: Repository<VocabularyWord>,
    @InjectRepository(UserProgress)
    private readonly progressRepository: Repository<UserProgress>,
  ) {}

  async onModuleInit() {
    const count = await this.wordRepository.count();
    if (count === 0) {
      await this.seedWords();
    }
  }

  private async seedWords() {
    const words = [
      // Programming
      {
        english: 'variable',
        czech: 'proměnná',
        category: 'programming',
        difficulty: 'easy',
        definition: 'A data container that can store different values during execution.',
        example: 'You must declare a variable before you can assign a value to it.',
      },
      {
        english: 'array',
        czech: 'pole',
        category: 'programming',
        difficulty: 'easy',
        definition: 'A data structure containing an ordered collection of elements.',
        example: 'An array index in JavaScript starts at zero.',
      },
      {
        english: 'function',
        czech: 'funkce',
        category: 'programming',
        difficulty: 'easy',
        definition: 'A reusable block of code that performs a specific task.',
        example: 'This helper function formats dates into Czech style.',
      },
      {
        english: 'compiler',
        czech: 'kompilátor',
        category: 'programming',
        difficulty: 'medium',
        definition: 'A program that translates source code into machine code or bytecode.',
        example: 'The TypeScript compiler checks type safety and produces plain JavaScript.',
      },
      {
        english: 'inheritance',
        czech: 'dědičnost',
        category: 'programming',
        difficulty: 'medium',
        definition: 'A mechanism where a class acquires the properties and methods of another class.',
        example: 'Object-oriented languages support inheritance to promote code reuse.',
      },
      {
        english: 'polymorphism',
        czech: 'polymorfismus',
        category: 'programming',
        difficulty: 'hard',
        definition: 'The ability of an object or function to take on many forms and behave differently depending on the context.',
        example: 'Method overriding is a classic runtime demonstration of polymorphism.',
      },
      {
        english: 'recursion',
        czech: 'rekurze',
        category: 'programming',
        difficulty: 'hard',
        definition: 'A programming technique where a function calls itself directly or indirectly.',
        example: 'Calculating factorials or traversing binary trees is commonly done using recursion.',
      },
      {
        english: 'concurrency',
        czech: 'souběžnost',
        category: 'programming',
        difficulty: 'hard',
        definition: 'The execution of multiple tasks or processes at the same time.',
        example: 'Node.js handles concurrency using a single-threaded event loop and asynchronous callbacks.',
      },
      {
        english: 'framework',
        czech: 'rámec',
        category: 'programming',
        difficulty: 'medium',
        definition: 'A pre-built set of tools, libraries, and conventions for developing applications.',
        example: 'NestJS is a progressive Node.js framework for building efficient backend systems.',
      },
      {
        english: 'dependency',
        czech: 'závislost',
        category: 'programming',
        difficulty: 'medium',
        definition: 'An external library, package, or module that an application relies on to function.',
        example: 'We use the package.json file to manage project dependencies.',
      },

      // Database
      {
        english: 'query',
        czech: 'dotaz',
        category: 'database',
        difficulty: 'easy',
        definition: 'A request for data or information from a database table.',
        example: 'We wrote a query to select all inactive users from the database.',
      },
      {
        english: 'index',
        czech: 'index',
        category: 'database',
        difficulty: 'medium',
        definition: 'A database structure that improves the speed of data retrieval operations.',
        example: 'Adding an index to the email column speeded up the login queries significantly.',
      },
      {
        english: 'foreign key',
        czech: 'cizí klíč',
        category: 'database',
        difficulty: 'medium',
        definition: 'A column or group of columns that creates a link between data in two tables.',
        example: 'The foreign key constraint ensures that every order is linked to a valid user.',
      },
      {
        english: 'transaction',
        czech: 'transakce',
        category: 'database',
        difficulty: 'medium',
        definition: 'A sequence of operations performed as a single logical unit of work that must succeed or fail completely.',
        example: 'A database transaction is crucial when transferring funds between two bank accounts.',
      },
      {
        english: 'constraint',
        czech: 'omezení',
        category: 'database',
        difficulty: 'hard',
        definition: 'A rule applied to database columns to restrict the types of data allowed.',
        example: 'A unique constraint was placed on the username column.',
      },
      {
        english: 'migration',
        czech: 'migrace',
        category: 'database',
        difficulty: 'medium',
        definition: 'The process of managing database schema changes over time in a controlled way.',
        example: 'We ran a TypeORM migration to add a new column to the user table.',
      },
      {
        english: 'redundancy',
        czech: 'redundance',
        category: 'database',
        difficulty: 'hard',
        definition: 'The duplication of data or systems to ensure consistency, reliability, or backup.',
        example: 'Primary-replica database setups introduce database redundancy for high availability.',
      },
      {
        english: 'normalization',
        czech: 'normalizace',
        category: 'database',
        difficulty: 'hard',
        definition: 'The process of organizing database tables to reduce redundancy and improve data integrity.',
        example: 'Database normalization involves splitting tables to satisfy normal forms.',
      },

      // Networking
      {
        english: 'bandwidth',
        czech: 'šířka pásma',
        category: 'networking',
        difficulty: 'medium',
        definition: 'The maximum rate of data transfer across a given path or connection.',
        example: 'Streaming high-definition video requires a connection with high bandwidth.',
      },
      {
        english: 'latency',
        czech: 'latence',
        category: 'networking',
        difficulty: 'medium',
        definition: 'The time delay between a data request and the start of the data transmission.',
        example: 'Online multiplayer gaming requires low network latency.',
      },
      {
        english: 'gateway',
        czech: 'brána',
        category: 'networking',
        difficulty: 'medium',
        definition: 'A network node that connects two different networks using different protocols.',
        example: 'The home router acts as a gateway connecting local devices to the internet.',
      },
      {
        english: 'packet',
        czech: 'paket',
        category: 'networking',
        difficulty: 'easy',
        definition: 'A small segment of data sent over a computer network.',
        example: 'Information sent over the internet is split into packets and reassembled at the destination.',
      },
      {
        english: 'routing',
        czech: 'směrování',
        category: 'networking',
        difficulty: 'medium',
        definition: 'The process of selecting paths in a network along which to send data packets.',
        example: 'Routers use dynamic routing protocols to find the most efficient paths.',
      },
      {
        english: 'handshake',
        czech: 'navázání spojení',
        category: 'networking',
        difficulty: 'hard',
        definition: 'An automated process by which two devices establish communication protocols.',
        example: 'The TCP three-way handshake is used to establish a reliable connection.',
      },
      {
        english: 'subnet',
        czech: 'podsíť',
        category: 'networking',
        difficulty: 'hard',
        definition: 'A logically visible subdivision of an IP network.',
        example: 'System administrators divide the company network into subnets for better organization.',
      },

      // Security
      {
        english: 'encryption',
        czech: 'šifrování',
        category: 'security',
        difficulty: 'easy',
        definition: 'The process of converting information into secret code to prevent unauthorized access.',
        example: 'SSL/TLS provides encryption for data transmitted between a web browser and a server.',
      },
      {
        english: 'decryption',
        czech: 'dešifrování',
        category: 'security',
        difficulty: 'easy',
        definition: 'The process of converting encrypted data back into its original readable format.',
        example: 'The receiver used a private key for the decryption of the email.',
      },
      {
        english: 'vulnerability',
        czech: 'zranitelnost',
        category: 'security',
        difficulty: 'medium',
        definition: 'A weakness in a system, network, or software that can be exploited by an attacker.',
        example: 'Updating dependencies regularly helps fix security vulnerabilities.',
      },
      {
        english: 'threat',
        czech: 'hrozba',
        category: 'security',
        difficulty: 'easy',
        definition: 'A potential negative event or action that can compromise information or system security.',
        example: 'Malware represents a significant threat to corporate networks.',
      },
      {
        english: 'authentication',
        czech: 'autentizace',
        category: 'security',
        difficulty: 'medium',
        definition: 'The process of verifying the identity of a user, device, or system.',
        example: 'Multi-factor authentication (MFA) requires users to provide two or more verification factors.',
      },
      {
        english: 'authorization',
        czech: 'autorizace',
        category: 'security',
        difficulty: 'medium',
        definition: 'The process of granting permission to access specific resources or perform actions.',
        example: 'Even after authentication, you need authorization to view administrative pages.',
      },
      {
        english: 'phishing',
        czech: 'rhybaření',
        category: 'security',
        difficulty: 'medium',
        definition: 'A malicious attempt to obtain sensitive information by disguising as a trustworthy entity.',
        example: 'Be suspicious of emails asking you to click link and re-enter your password to avoid phishing.',
      },
      {
        english: 'firewall',
        czech: 'firewall',
        category: 'security',
        difficulty: 'easy',
        definition: 'A network security system that monitors and controls traffic based on predetermined rules.',
        example: 'The corporate firewall blocked the unauthorized connection request.',
      },

      // DevOps & System
      {
        english: 'deployment',
        czech: 'nasazení',
        category: 'devops',
        difficulty: 'medium',
        definition: 'The process of making an application or code update available for use on a server.',
        example: 'Our CI/CD pipeline automates the deployment of the application to AWS.',
      },
      {
        english: 'repository',
        czech: 'repozitář',
        category: 'devops',
        difficulty: 'easy',
        definition: 'A central file storage location where source code and its history are tracked.',
        example: 'We push all our code changes to a shared GitHub repository.',
      },
      {
        english: 'pipeline',
        czech: 'pipeline',
        category: 'devops',
        difficulty: 'medium',
        definition: 'A sequence of automated steps to build, test, and release software.',
        example: 'A failing test broke the deployment pipeline.',
      },
      {
        english: 'middleware',
        czech: 'middleware',
        category: 'devops',
        difficulty: 'medium',
        definition: 'Software that acts as a bridge between an operating system/database and applications.',
        example: 'Express uses middleware to parse incoming JSON request bodies.',
      },
      {
        english: 'deprecate',
        czech: 'zavrhnout',
        category: 'devops',
        difficulty: 'hard',
        definition: 'To declare a software feature or library obsolete and express disapproval of its use.',
        example: 'The API team decided to deprecate the older version of the login endpoint.',
      },
      {
        english: 'refactoring',
        czech: 'refaktorování',
        category: 'devops',
        difficulty: 'medium',
        definition: 'The process of restructuring existing computer code without changing its external behavior.',
        example: 'We spent the morning refactoring the vocabulary service to make it cleaner.',
      },
      {
        english: 'legacy',
        czech: 'zastaralý',
        category: 'devops',
        difficulty: 'medium',
        definition: 'An old software system, code library, or technology that remains in use.',
        example: 'Maintaining legacy codebases can be time-consuming but necessary.',
      },
      {
        english: 'scalability',
        czech: 'škálovatelnost',
        category: 'devops',
        difficulty: 'hard',
        definition: 'The capability of a system to handle a growing amount of work or to be enlarged.',
        example: 'Horizontal scaling is an excellent pattern for cloud application scalability.',
      },
      {
        english: 'endpoint',
        czech: 'koncový bod',
        category: 'devops',
        difficulty: 'easy',
        definition: 'A specific destination connection point on a network or API where communication occurs.',
        example: 'The backend exposes an HTTP GET endpoint at /api/vocabulary/quiz.',
      },
    ];

    for (const w of words) {
      const word = this.wordRepository.create(w);
      await this.wordRepository.save(word);
    }
  }

  async getWords(category?: string, difficulty?: string) {
    const query = this.wordRepository
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.progress', 'progress');

    if (category) {
      query.andWhere('word.category = :category', { category });
    }
    if (difficulty) {
      query.andWhere('word.difficulty = :difficulty', { difficulty });
    }

    const words = await query.getMany();

    // Map to include progress info nicely
    return words.map((w) => {
      const prog = w.progress && w.progress.length > 0 ? w.progress[0] : null;
      return {
        id: w.id,
        english: w.english,
        czech: w.czech,
        category: w.category,
        definition: w.definition,
        example: w.example,
        difficulty: w.difficulty,
        progress: prog
          ? {
              correctAnswers: prog.correctAnswers,
              incorrectAnswers: prog.incorrectAnswers,
              box: prog.box,
              nextReviewDate: prog.nextReviewDate,
              lastReviewed: prog.lastReviewed,
            }
          : null,
      };
    });
  }

  async getQuiz(limit: number = 10, category?: string, direction?: 'en_to_cs' | 'cs_to_en') {
    // Fetch candidates
    const query = this.wordRepository.createQueryBuilder('word');
    if (category) {
      query.andWhere('word.category = :category', { category });
    }
    const allWords = await query.getMany();
    if (allWords.length === 0) return [];

    // Shuffle and pick limit
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(limit, shuffled.length));

    // For distractors, we need choices. Let's gather all translations
    const results = [];
    const dir = direction || (Math.random() > 0.5 ? 'en_to_cs' : 'cs_to_en');

    for (const word of selected) {
      // Correct answer translation
      const correctAnswer = dir === 'en_to_cs' ? word.czech : word.english;

      // Select distractors
      const distractors = allWords
        .filter((w) => w.id !== word.id)
        .map((w) => (dir === 'en_to_cs' ? w.czech : w.english));

      // Pick 3 random distractors
      const uniqueDistractors = [...new Set(distractors)];
      const pickedDistractors = uniqueDistractors
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      // Mix option choices and shuffle
      const options = [correctAnswer, ...pickedDistractors].sort(() => 0.5 - Math.random());

      results.push({
        wordId: word.id,
        english: word.english,
        czech: word.czech,
        category: word.category,
        difficulty: word.difficulty,
        definition: word.definition,
        example: word.example,
        options,
        direction: dir,
        correctAnswer,
      });
    }

    return results;
  }

  async submitAnswer(wordId: number, isCorrect: boolean) {
    let progress = await this.progressRepository.findOne({ where: { wordId } });

    if (!progress) {
      progress = this.progressRepository.create({
        wordId,
        correctAnswers: 0,
        incorrectAnswers: 0,
        box: 1,
      });
    }

    const now = new Date();
    progress.lastReviewed = now;

    if (isCorrect) {
      progress.correctAnswers += 1;
      // Leitner system: promotion
      if (progress.box < 5) {
        progress.box += 1;
      }
    } else {
      progress.incorrectAnswers += 1;
      // Leitner system: demotion/reset
      progress.box = 1;
    }

    // Calculate next review intervals:
    // Box 1: 1 hour (immediate/soon)
    // Box 2: 1 day (24 hours)
    // Box 3: 3 days (72 hours)
    // Box 4: 7 days (168 hours)
    // Box 5: 14 days (336 hours)
    const intervals = [1, 24, 72, 168, 336]; // in hours
    const hours = intervals[progress.box - 1];
    const nextReview = new Date();
    nextReview.setHours(nextReview.getHours() + hours);

    progress.nextReviewDate = nextReview;
    await this.progressRepository.save(progress);

    return {
      wordId,
      correct: isCorrect,
      correctAnswers: progress.correctAnswers,
      incorrectAnswers: progress.incorrectAnswers,
      box: progress.box,
      nextReviewDate: progress.nextReviewDate,
    };
  }

  async getStats() {
    const totalWords = await this.wordRepository.count();
    const progressRecords = await this.progressRepository.find();

    const wordsLearned = progressRecords.filter((p) => p.box >= 4).length; // Consider Box 4 & 5 learned
    const totalReviews = progressRecords.reduce((acc, curr) => acc + curr.correctAnswers + curr.incorrectAnswers, 0);
    const correctReviews = progressRecords.reduce((acc, curr) => acc + curr.correctAnswers, 0);
    const successRate = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

    // Count words in each Leitner box
    const boxCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    // Any word without progress is considered in Box 1 equivalent but unreviewed
    progressRecords.forEach((p) => {
      const b = p.box as 1 | 2 | 3 | 4 | 5;
      if (boxCounts[b] !== undefined) {
        boxCounts[b]++;
      }
    });
    boxCounts[1] += (totalWords - progressRecords.length);

    // Distribution by category
    const categories = await this.wordRepository
      .createQueryBuilder('word')
      .select('word.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('word.category')
      .getRawMany();

    return {
      totalWords,
      wordsLearned,
      reviewProgress: progressRecords.length,
      successRate,
      boxDistribution: boxCounts,
      categoryDistribution: categories.reduce((acc, curr) => {
        acc[curr.category] = parseInt(curr.count);
        return acc;
      }, {}),
    };
  }
}
