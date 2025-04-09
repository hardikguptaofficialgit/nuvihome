
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
    imageUrl: 'https://res.cloudinary.com/ddx6avza4/image/upload/v1744129312/n_rz5riq.png',
    tags: ['JEE', 'Study Tips', 'Exam Preparation']
  },
  {
    id: '2',
    title: 'JEE Preparation: Balancing PCM',
    excerpt: 'Mastering the right balance between Physics, Chemistry, and Math for JEE preparation.',
    content: `
      <p>JEE (Joint Entrance Examination) is one of the most challenging engineering entrance exams in India. It requires a well-structured and balanced approach to Physics, Chemistry, and Mathematics (PCM) to maximize your score.</p>
      
      <h3>Understanding the JEE Exam Structure</h3>
      <p>JEE Main and Advanced test your conceptual understanding, problem-solving speed, and accuracy across PCM. Each subject carries equal weight, making it essential to balance preparation time effectively.</p>
      
      <h3>Mathematics: Practice is Power</h3>
      <p>Math requires consistent practice and clarity in fundamentals. Focus on mastering NCERT and standard reference books. Daily problem-solving and revising important formulas will help build speed and accuracy.</p>
      
      <h3>Chemistry: The Game Changer</h3>
      <p>Chemistry is often considered scoring if approached right. Physical Chemistry needs conceptual understanding and problem-solving, Organic Chemistry relies on mechanisms and reactions, while Inorganic Chemistry demands strong memory and NCERT focus.</p>
      
      <h3>Physics: Conceptual Clarity is Key</h3>
      <p>Physics requires deep conceptual understanding and regular practice. Focus on derivations, laws, and numerical problem-solving. Prioritize high-weightage topics like Mechanics, Electrostatics, and Modern Physics.</p>
      
      <h3>Creating a Balanced Study Plan</h3>
      <p>Distribute your time wisely based on your strengths. A common effective time allocation could be 4:3:3 for Math, Physics, and Chemistry—but adjust it based on your personal comfort level with each subject.</p>
      
      <h3>Integrated Approach</h3>
      <p>Look for overlaps in topics across subjects. For instance, vectors in Math apply to Physics, and chemical thermodynamics has links to Physics concepts. Connecting dots across subjects improves your conceptual grip.</p>
      
      <p>In the end, consistent effort and smart revision will help you succeed. Focus on quality over quantity, track your progress, and take breaks to recharge. Your goal is not just to study hard, but to study smart. You've got this!</p>
    `,
    author: 'Prof. Sharma',
    date: '2023-04-22',
    imageUrl: 'https://res.cloudinary.com/ddx6avza4/image/upload/v1744129312/n_rz5riq.png',
    tags: ['JEE', 'Physics', 'Chemistry', 'Math']
  }
,  
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
    imageUrl: 'https://res.cloudinary.com/ddx6avza4/image/upload/v1744129312/n_rz5riq.png',
    tags: ['Mental Health', 'Stress Manage', 'Wellness']
  },{
    id: '3',
    title: 'Mastering JEE Advanced: Tips from Toppers',
    excerpt: 'Top strategies and insights from JEE Advanced toppers to help you excel in your preparation.',
    content: `
      <p>Cracking JEE Advanced isn't just about hard work—it's about working smart. We've gathered insights from top rankers and mentors to bring you practical, high-impact tips that can make a real difference in your journey.</p>
  
      <h3>1. Build a Strong Foundation</h3>
      <p>Before diving into complex problems, ensure your NCERT concepts (especially in Physics and Chemistry) are rock-solid. Toppers emphasize that conceptual clarity is key for solving advanced-level questions.</p>
  
      <h3>2. Solve Quality Problems, Not Just Quantity</h3>
      <p>It’s not about how many questions you solve—it’s about how deeply you understand them. Focus on solving a few challenging problems thoroughly rather than rushing through many.</p>
  
      <h3>3. Analyze Your Mistakes Ruthlessly</h3>
      <p>Every mistake is a learning opportunity. Maintain an error log—write down the question, what went wrong, and how you’ll avoid it next time. Review it weekly.</p>
  
      <h3>4. Master Previous Year Papers</h3>
      <p>JEE Advanced has patterns. Solving the last 10–15 years of papers will give you a feel for real exam questions, improve speed, and boost confidence.</p>
  
      <h3>5. Don’t Neglect Revision</h3>
      <p>Toppers revise regularly. Use weekly revision cycles, formula sheets, and flashcards. Don't wait for the syllabus to end—revise alongside your preparation.</p>
  
      <h3>6. Give Mock Tests Like It’s the Real Exam</h3>
      <p>Attempt full-length mock tests under strict exam conditions. Analyze them in detail. Look at your time spent per section, silly errors, and your weak topics.</p>
  
      <h3>7. Stay Consistent, Not Just Motivated</h3>
      <p>JEE Advanced prep is a marathon. Build daily study habits. Even on bad days, sit for at least a short, focused session—it helps maintain momentum.</p>
  
      <h3>8. Don’t Ignore Mental and Physical Health</h3>
      <p>Sleep well, eat right, and take short breaks. A tired brain won’t solve tricky Physics problems. Balance is underrated but crucial.</p>
  
      <p>Remember, success in JEE Advanced comes from smart strategy, discipline, and consistency. Follow what works for YOU, stay patient, and keep showing up every day. You’ve got this!</p>
    `,
    author: 'Team NuviBrainz',
    date: '2023-05-10',
    imageUrl: 'https://res.cloudinary.com/ddx6avza4/image/upload/v1744129312/n_rz5riq.png',
    tags: ['JEE Advanced', 'Toppers Tips', 'Exam Strategy']
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
