// Motivational Quotes Data

const quotesData = [
    // Tech & Development Quotes
    {
        id: 1,
        text: "The best way to predict the future is to invent it.",
        author: "Alan Kay",
        category: "innovation"
    },
    {
        id: 2,
        text: "Code is like humor. When you have to explain it, it's bad.",
        author: "Cory House",
        category: "coding"
    },
    {
        id: 3,
        text: "First, solve the problem. Then, write the code.",
        author: "John Johnson",
        category: "problem-solving"
    },
    {
        id: 4,
        text: "Programming isn't about what you know; it's about what you can figure out.",
        author: "Chris Pine",
        category: "learning"
    },
    {
        id: 5,
        text: "The computer was born to solve problems that did not exist before.",
        author: "Bill Gates",
        category: "technology"
    },
    
    // Success & Achievement Quotes
    {
        id: 6,
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: "success"
    },
    {
        id: 7,
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "passion"
    },
    {
        id: 8,
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
        category: "innovation"
    },
    {
        id: 9,
        text: "Your limitation—it's only your imagination.",
        author: "Unknown",
        category: "motivation"
    },
    {
        id: 10,
        text: "Great things never come from comfort zones.",
        author: "Unknown",
        category: "growth"
    },
    
    // Learning & Growth Quotes
    {
        id: 11,
        text: "The more you learn, the more you realize you don't know.",
        author: "Aristotle",
        category: "learning"
    },
    {
        id: 12,
        text: "Learning never exhausts the mind.",
        author: "Leonardo da Vinci",
        category: "learning"
    },
    {
        id: 13,
        text: "The expert in anything was once a beginner.",
        author: "Unknown",
        category: "growth"
    },
    {
        id: 14,
        text: "Continuous improvement is better than delayed perfection.",
        author: "Mark Twain",
        category: "improvement"
    },
    {
        id: 15,
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins",
        category: "motivation"
    },
    
    // AI & Future Tech Quotes
    {
        id: 16,
        text: "Artificial intelligence is the new electricity.",
        author: "Andrew Ng",
        category: "ai"
    },
    {
        id: 17,
        text: "Machine learning is the last invention that humanity will ever need to make.",
        author: "Nick Bostrom",
        category: "ai"
    },
    {
        id: 18,
        text: "The development of full artificial intelligence could spell the end of the human race... but it could also be the greatest event in human history.",
        author: "Stephen Hawking",
        category: "ai"
    },
    {
        id: 19,
        text: "By far, the greatest danger of Artificial Intelligence is that people conclude too early that they understand it.",
        author: "Eliezer Yudkowsky",
        category: "ai"
    },
    {
        id: 20,
        text: "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.",
        author: "Edsger W. Dijkstra",
        category: "ai"
    },
    
    // Programming Philosophy
    {
        id: 21,
        text: "Clean code always looks like it was written by someone who cares.",
        author: "Robert C. Martin",
        category: "coding"
    },
    {
        id: 22,
        text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        author: "Martin Fowler",
        category: "coding"
    },
    {
        id: 23,
        text: "Programs must be written for people to read, and only incidentally for machines to execute.",
        author: "Harold Abelson",
        category: "coding"
    },
    {
        id: 24,
        text: "The best programmers are not marginally better than merely good ones. They are an order-of-magnitude better.",
        author: "Randall E. Stross",
        category: "excellence"
    },
    {
        id: 25,
        text: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
        author: "Bill Gates",
        category: "coding"
    },
    
    // Leadership & Vision
    {
        id: 26,
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
        category: "action"
    },
    {
        id: 27,
        text: "Leadership is not about being in charge. It's about taking care of those in your charge.",
        author: "Simon Sinek",
        category: "leadership"
    },
    {
        id: 28,
        text: "Vision without execution is just hallucination.",
        author: "Thomas Edison",
        category: "execution"
    },
    {
        id: 29,
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb",
        category: "action"
    },
    {
        id: 30,
        text: "Don't be afraid to give up the good to go for the great.",
        author: "John D. Rockefeller",
        category: "excellence"
    },
    
    // Problem Solving & Critical Thinking
    {
        id: 31,
        text: "Every problem is a gift—without problems we would not grow.",
        author: "Anthony Robbins",
        category: "problem-solving"
    },
    {
        id: 32,
        text: "A problem well stated is a problem half solved.",
        author: "Charles Kettering",
        category: "problem-solving"
    },
    {
        id: 33,
        text: "The significant problems we face cannot be solved at the same level of thinking we were at when we created them.",
        author: "Albert Einstein",
        category: "problem-solving"
    },
    {
        id: 34,
        text: "Logic will get you from A to Z; imagination will get you everywhere.",
        author: "Albert Einstein",
        category: "creativity"
    },
    {
        id: 35,
        text: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci",
        category: "simplicity"
    },
    
    // Persistence & Resilience
    {
        id: 36,
        text: "It's not that I'm so smart, it's just that I stay with problems longer.",
        author: "Albert Einstein",
        category: "persistence"
    },
    {
        id: 37,
        text: "Fall seven times, get up eight.",
        author: "Japanese Proverb",
        category: "resilience"
    },
    {
        id: 38,
        text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
        author: "Alan Watts",
        category: "adaptability"
    },
    {
        id: 39,
        text: "Success is walking from failure to failure with no loss of enthusiasm.",
        author: "Winston Churchill",
        category: "resilience"
    },
    {
        id: 40,
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        category: "dreams"
    },
    
    // Personal Development
    {
        id: 41,
        text: "Be yourself; everyone else is already taken.",
        author: "Oscar Wilde",
        category: "authenticity"
    },
    {
        id: 42,
        text: "The only person you are destined to become is the person you decide to be.",
        author: "Ralph Waldo Emerson",
        category: "self-development"
    },
    {
        id: 43,
        text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        author: "Ralph Waldo Emerson",
        category: "inner-strength"
    },
    {
        id: 44,
        text: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky",
        category: "opportunity"
    },
    {
        id: 45,
        text: "The journey of a thousand miles begins with one step.",
        author: "Lao Tzu",
        category: "journey"
    },
    
    // Entrepreneurship & Business
    {
        id: 46,
        text: "Your most unhappy customers are your greatest source of learning.",
        author: "Bill Gates",
        category: "business"
    },
    {
        id: 47,
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
        category: "entrepreneurship"
    },
    {
        id: 48,
        text: "Don't be afraid to give up the good to go for the great.",
        author: "John D. Rockefeller",
        category: "business"
    },
    {
        id: 49,
        text: "The biggest risk is not taking any risk.",
        author: "Mark Zuckerberg",
        category: "risk-taking"
    },
    {
        id: 50,
        text: "Ideas are easy. Implementation is hard.",
        author: "Guy Kawasaki",
        category: "execution"
    },
    
    // Personal Philosophy (Moeed's Own)
    {
        id: 51,
        text: "Code with purpose, build with passion, and always strive to make a difference in people's lives.",
        author: "Moeed ul Hassan",
        category: "personal"
    },
    {
        id: 52,
        text: "Every bug is a learning opportunity, every feature is a chance to improve someone's day.",
        author: "Moeed ul Hassan",
        category: "personal"
    },
    {
        id: 53,
        text: "The best backend is the one users never have to think about - it just works flawlessly.",
        author: "Moeed ul Hassan",
        category: "personal"
    },
    {
        id: 54,
        text: "AI is not about replacing humans; it's about amplifying human potential.",
        author: "Moeed ul Hassan",
        category: "personal"
    },
    {
        id: 55,
        text: "From Gujrat to the world - every great journey starts with a single commit.",
        author: "Moeed ul Hassan",
        category: "personal"
    },
    
    // Additional Wisdom
    {
        id: 56,
        text: "The only constant in technology is change.",
        author: "Unknown",
        category: "technology"
    },
    {
        id: 57,
        text: "Data is the new oil, but algorithms are the new electricity.",
        author: "Unknown",
        category: "data"
    },
    {
        id: 58,
        text: "In the world of software, there are only two kinds of languages: the ones people complain about and the ones nobody uses.",
        author: "Bjarne Stroustrup",
        category: "programming"
    },
    {
        id: 59,
        text: "The internet is becoming the town square for the global village of tomorrow.",
        author: "Bill Gates",
        category: "internet"
    },
    {
        id: 60,
        text: "Software is eating the world, but developers are cooking the future.",
        author: "Unknown",
        category: "future"
    }
];

// Export for global access
window.quotesData = quotesData;
