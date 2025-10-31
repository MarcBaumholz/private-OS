import type { Goal, LifeAreaCategory } from '../types';

export interface VisionBoardTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  goals: Omit<Goal, 'id' | 'imageUrl' | 'createdAt'>[];
}

export const VISION_BOARD_TEMPLATES: VisionBoardTemplate[] = [
  {
    id: 'balanced-life',
    name: 'Balanced Life',
    description: 'One goal for each life area - perfect foundation',
    emoji: '⚖️',
    goals: [
      {
        title: 'Run 3x Per Week',
        category: 'health',
        why: 'To build endurance, boost energy, and maintain physical health',
        progress: 0,
        status: 'active',
        imagePrompt: 'Person running in nature at sunrise, energetic and vibrant',
        tags: ['fitness', 'routine'],
        relatedHabits: [2] // Workout
      },
      {
        title: 'Get Promoted This Year',
        category: 'career',
        why: 'To grow professionally and take on more leadership responsibilities',
        progress: 0,
        status: 'active',
        imagePrompt: 'Professional office environment, modern workspace, success',
        tags: ['career-growth', 'leadership'],
        relatedHabits: [5] // Plan
      },
      {
        title: 'Save $10,000',
        category: 'finance',
        why: 'To build financial security and reach my savings goals',
        progress: 0,
        status: 'active',
        imagePrompt: 'Piggy bank with growing coins, financial freedom concept',
        tags: ['savings', 'financial-freedom'],
        relatedHabits: []
      },
      {
        title: 'Read 24 Books',
        category: 'mind',
        why: 'To expand knowledge, improve focus, and enjoy great stories',
        progress: 0,
        status: 'active',
        imagePrompt: 'Cozy reading nook with books, warm lighting, peaceful',
        tags: ['reading', 'learning'],
        relatedHabits: [4] // Read
      },
      {
        title: 'Weekly Date Nights',
        category: 'relationships',
        why: 'To strengthen my relationship and prioritize quality time together',
        progress: 0,
        status: 'active',
        imagePrompt: 'Romantic dinner setting, couple enjoying time together',
        tags: ['relationship', 'quality-time'],
        relatedHabits: []
      },
      {
        title: 'Volunteer Monthly',
        category: 'contribution',
        why: 'To give back to my community and make a positive difference',
        progress: 0,
        status: 'active',
        imagePrompt: 'People volunteering together, community service, helping others',
        tags: ['volunteering', 'impact'],
        relatedHabits: []
      }
    ]
  },
  {
    id: 'health-transformation',
    name: 'Health Transformation',
    description: 'Complete wellness journey - body, mind, and nutrition',
    emoji: '💪',
    goals: [
      {
        title: 'Lose 20 Pounds',
        category: 'health',
        why: 'To feel confident, energized, and reach my ideal healthy weight',
        progress: 0,
        status: 'active',
        imagePrompt: 'Fit person measuring waist, transformation journey, healthy lifestyle',
        tags: ['weight-loss', 'fitness'],
        relatedHabits: [2, 3] // Workout, Hydrate
      },
      {
        title: 'Meal Prep Every Sunday',
        category: 'health',
        why: 'To eat nutritious meals all week and save time',
        progress: 0,
        status: 'active',
        imagePrompt: 'Organized meal prep containers, healthy food, kitchen scene',
        tags: ['nutrition', 'meal-prep'],
        relatedHabits: []
      },
      {
        title: 'Yoga 4x Per Week',
        category: 'health',
        why: 'To improve flexibility, reduce stress, and strengthen my mind-body connection',
        progress: 0,
        status: 'active',
        imagePrompt: 'Person doing yoga pose outdoors, peaceful morning scene',
        tags: ['yoga', 'mindfulness'],
        relatedHabits: [2] // Workout
      },
      {
        title: 'Sleep 8 Hours Nightly',
        category: 'health',
        why: 'To improve recovery, energy levels, and overall health',
        progress: 0,
        status: 'active',
        imagePrompt: 'Peaceful bedroom, cozy bed, restful sleep environment',
        tags: ['sleep', 'recovery'],
        relatedHabits: [6] // Wind-down
      },
      {
        title: 'Meditate Daily',
        category: 'mind',
        why: 'To reduce anxiety, increase focus, and find inner peace',
        progress: 0,
        status: 'active',
        imagePrompt: 'Person meditating in serene environment, mindfulness practice',
        tags: ['meditation', 'mental-health'],
        relatedHabits: []
      }
    ]
  },
  {
    id: 'career-growth',
    name: 'Career Growth',
    description: 'Professional development and skill advancement',
    emoji: '🚀',
    goals: [
      {
        title: 'Learn New Tech Skill',
        category: 'career',
        why: 'To stay competitive and expand my technical capabilities',
        progress: 0,
        status: 'active',
        imagePrompt: 'Developer coding on laptop, modern tech workspace, learning',
        tags: ['learning', 'technology'],
        relatedHabits: [4] // Read
      },
      {
        title: 'Build Portfolio Project',
        category: 'career',
        why: 'To showcase my skills and attract better opportunities',
        progress: 0,
        status: 'active',
        imagePrompt: 'Portfolio website on screen, professional design, impressive work',
        tags: ['portfolio', 'project'],
        relatedHabits: [5] // Plan
      },
      {
        title: 'Network with 50 People',
        category: 'career',
        why: 'To expand my professional network and create opportunities',
        progress: 0,
        status: 'active',
        imagePrompt: 'Professional networking event, people connecting, business cards',
        tags: ['networking', 'connections'],
        relatedHabits: []
      },
      {
        title: 'Get Certified',
        category: 'career',
        why: 'To validate my expertise and increase my market value',
        progress: 0,
        status: 'active',
        imagePrompt: 'Professional certification diploma, achievement, credentials',
        tags: ['certification', 'credentials'],
        relatedHabits: [4] // Read
      }
    ]
  },
  {
    id: 'financial-freedom',
    name: 'Financial Freedom',
    description: 'Build wealth and achieve financial independence',
    emoji: '💰',
    goals: [
      {
        title: 'Pay Off All Debt',
        category: 'finance',
        why: 'To achieve financial freedom and reduce stress',
        progress: 0,
        status: 'active',
        imagePrompt: 'Person cutting credit card, debt freedom, financial relief',
        tags: ['debt-free', 'financial-freedom'],
        relatedHabits: []
      },
      {
        title: 'Build 6-Month Emergency Fund',
        category: 'finance',
        why: 'To have security and peace of mind for unexpected expenses',
        progress: 0,
        status: 'active',
        imagePrompt: 'Growing savings account, financial security, emergency fund',
        tags: ['savings', 'emergency-fund'],
        relatedHabits: []
      },
      {
        title: 'Start Investing',
        category: 'finance',
        why: 'To grow my wealth long-term and secure my financial future',
        progress: 0,
        status: 'active',
        imagePrompt: 'Stock market charts growing, investment growth, financial success',
        tags: ['investing', 'wealth-building'],
        relatedHabits: [4] // Read
      },
      {
        title: 'Create Side Income Stream',
        category: 'finance',
        why: 'To diversify income and accelerate wealth building',
        progress: 0,
        status: 'active',
        imagePrompt: 'Laptop with online business, passive income, digital entrepreneurship',
        tags: ['side-hustle', 'passive-income'],
        relatedHabits: [5] // Plan
      }
    ]
  },
  {
    id: 'creative-pursuits',
    name: 'Creative Pursuits',
    description: 'Explore creativity and artistic expression',
    emoji: '🎨',
    goals: [
      {
        title: 'Learn Guitar',
        category: 'mind',
        why: 'To express myself musically and enjoy playing my favorite songs',
        progress: 0,
        status: 'active',
        imagePrompt: 'Acoustic guitar close-up, musical instrument, creative hobby',
        tags: ['music', 'guitar'],
        relatedHabits: []
      },
      {
        title: 'Write a Book',
        category: 'contribution',
        why: 'To share my story and leave a lasting creative legacy',
        progress: 0,
        status: 'active',
        imagePrompt: 'Writer at desk with manuscript, creative writing, storytelling',
        tags: ['writing', 'creativity'],
        relatedHabits: [4] // Read
      },
      {
        title: 'Take Photography Course',
        category: 'mind',
        why: 'To capture beautiful moments and develop a creative skill',
        progress: 0,
        status: 'active',
        imagePrompt: 'Professional camera capturing sunset, photography, artistic vision',
        tags: ['photography', 'art'],
        relatedHabits: []
      },
      {
        title: 'Create Art Weekly',
        category: 'mind',
        why: 'To express creativity consistently and develop artistic skills',
        progress: 0,
        status: 'active',
        imagePrompt: 'Art supplies and canvas, painting in progress, creative expression',
        tags: ['art', 'creativity'],
        relatedHabits: []
      }
    ]
  }
];
