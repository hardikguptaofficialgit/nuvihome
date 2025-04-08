
import React, { createContext, useContext, useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  tags: string[];
}

interface BlogContextType {
  posts: BlogPost[];
  getPostById: (id: string) => BlogPost | undefined;
}

// Mock data
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Study Effectively for JEE',
    excerpt: 'Learn the best strategies to maximize your study time and ace the JEE exam.',
    content: `
      <p>Preparing for the JEE requires strategy, consistency, and focus. Here are some proven methods that can help you study effectively:</p>
      
      <h3>1. Understand the JEE Pattern</h3>
      <p>Before diving into preparation, take time to understand the exam pattern, syllabus, and marking scheme. This will help you create a targeted study plan.</p>
      
      <h3>2. Create a Realistic Study Schedule</h3>
      <p>Divide your time efficiently among all subjects. Allocate more time to topics you find challenging. Remember to include short breaks to avoid burnout.</p>
      
      <h3>3. Master the Fundamentals</h3>
      <p>JEE questions often test your understanding of basic concepts. Ensure you have a strong grasp of the fundamentals before moving to complex problems.</p>
      
      <h3>4. Practice Previous Years' Papers</h3>
      <p>Solving previous years' question papers helps you understand the exam pattern and the types of questions asked. It also improves your time management skills.</p>
      
      <h3>5. Take Regular Mock Tests</h3>
      <p>Mock tests simulate the actual exam environment. They help you assess your preparation level and identify areas that need improvement.</p>
      
      <h3>6. Revise Regularly</h3>
      <p>Regular revision is key to retaining information. Create concise notes for quick revisions, especially during the final weeks before the exam.</p>
      
      <p>Remember, consistency is more important than intensity. Study regularly, stay focused, and believe in yourself!</p>
    `,
    author: 'Dr. Sharma',
    date: '2023-03-15',
    imageUrl: '/placeholder.svg',
    tags: ['JEE', 'Study Tips', 'Exam Preparation']
  },
  {
    id: '2',
    title: 'NEET Preparation: Balancing PCB',
    excerpt: 'Finding the right balance between Physics, Chemistry, and Biology for NEET preparation.',
    content: `
      <p>NEET (National Eligibility cum Entrance Test) is a competitive exam that tests your knowledge in Physics, Chemistry, and Biology. Balancing these three subjects effectively is crucial for success.</p>
      
      <h3>Understanding the NEET Structure</h3>
      <p>NEET consists of 180 questions (45 each from Physics and Chemistry, and 90 from Biology). With limited preparation time, it's essential to allocate your resources wisely.</p>
      
      <h3>Biology: Your Stronghold</h3>
      <p>Biology carries the maximum weightage in NEET. Focus on NCERT textbooks thoroughly. Create diagrams and flowcharts to visualize complex processes. Memorize important terms, definitions, and classifications.</p>
      
      <h3>Chemistry: The Bridge</h3>
      <p>Chemistry can bridge the gap between your scores in Biology and Physics. Physical Chemistry requires conceptual clarity, while Organic and Inorganic Chemistry need regular revision and practice.</p>
      
      <h3>Physics: The Challenge</h3>
      <p>Many students find Physics challenging. Break down complex topics into smaller, manageable parts. Focus on understanding concepts rather than memorizing formulas. Regular practice of numerical problems is essential.</p>
      
      <h3>Creating a Balanced Study Plan</h3>
      <p>Allocate time based on your strengths and weaknesses. If you're strong in Biology, you might allocate time in a 3:4:5 ratio for Physics, Chemistry, and Biology. Adjust this ratio based on your preparation level.</p>
      
      <h3>Integrated Approach</h3>
      <p>Many topics in PCB are interconnected. For instance, biomolecules in Biology relate to organic chemistry. Thermodynamics applies to both Physics and Chemistry. Recognizing these connections can enhance your understanding.</p>
      
      <p>Remember, consistency and quality of study matter more than quantity. Stay focused, take regular breaks, and believe in yourself!</p>
    `,
    author: 'Dr. Patel',
    date: '2023-04-22',
    imageUrl: '/placeholder.svg',
    tags: ['NEET', 'Biology', 'Chemistry', 'Physics']
  },
  {
    id: '3',
    title: 'Mental Health Tips for Exam Stress',
    excerpt: 'How to stay mentally healthy during intense exam preparation periods.',
    content: `
      <p>Preparing for competitive exams like JEE and NEET can be stressful. Here are some practical tips to maintain your mental health during this challenging period.</p>
      
      <h3>Acknowledge Your Feelings</h3>
      <p>It's normal to feel stressed, anxious, or overwhelmed during exam preparation. Acknowledging these feelings is the first step toward managing them effectively.</p>
      
      <h3>Maintain a Balanced Routine</h3>
      <p>While studying is important, don't neglect other aspects of your life. Ensure you get adequate sleep (7-8 hours), eat nutritious meals, and engage in physical activity regularly.</p>
      
      <h3>Practice Mindfulness</h3>
      <p>Meditation, deep breathing exercises, or simply being present in the moment can significantly reduce stress. Consider dedicating 10-15 minutes daily to mindfulness practices.</p>
      
      <h3>Take Regular Breaks</h3>
      <p>The Pomodoro Technique (studying for 25 minutes followed by a 5-minute break) can enhance productivity and prevent burnout. During breaks, engage in activities that rejuvenate you—stretch, listen to music, or chat with a friend.</p>
      
      <h3>Connect with Others</h3>
      <p>Don't isolate yourself. Regularly connect with friends, family, or peers who understand what you're going through. Sharing your experiences can provide relief and perspective.</p>
      
      <h3>Set Realistic Goals</h3>
      <p>Setting unachievable targets can lead to frustration and demotivation. Break your preparation into small, manageable goals and celebrate your progress.</p>
      
      <h3>Limit Digital Distractions</h3>
      <p>Constant notifications can disrupt your focus and increase anxiety. Consider using apps that block distracting websites or set specific times to check social media.</p>
      
      <h3>Seek Professional Help If Needed</h3>
      <p>If you're feeling consistently overwhelmed or experiencing symptoms like persistent sadness, changes in appetite, or difficulty sleeping, don't hesitate to reach out to a counselor or therapist.</p>
      
      <p>Remember, taking care of your mental health is not a luxury—it's a necessity. A healthy mind is essential for effective learning and exam performance.</p>
    `,
    author: 'Dr. Kapoor',
    date: '2023-05-10',
    imageUrl: '/placeholder.svg',
    tags: ['Mental Health', 'Stress Management', 'Student Wellness']
  }
];

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts] = useState<BlogPost[]>(mockPosts);

  const getPostById = (id: string) => {
    return posts.find(post => post.id === id);
  };

  return (
    <BlogContext.Provider value={{ posts, getPostById }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
