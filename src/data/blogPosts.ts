
import { BlogPost } from '@/types/blog';

// Mock data for blog posts - would be replaced with actual data from Supabase
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Effective Evangelism in the Digital Age',
    slug: 'effective-evangelism-digital-age',
    excerpt: 'Discover how to leverage technology and social media to spread the Gospel effectively in today\'s digital world.',
    content: `
      <p>In today's interconnected world, the digital landscape offers unprecedented opportunities for sharing the Gospel. This article explores effective strategies for digital evangelism.</p>
      
      <h2>Leveraging Social Media</h2>
      <p>Social media platforms provide access to billions of people worldwide. Here are some strategies for effective evangelism on these platforms:</p>
      <ul>
        <li>Authentic storytelling that resonates with your audience</li>
        <li>Engaging visual content that captures attention</li>
        <li>Thoughtful responses to comments and messages</li>
        <li>Building genuine relationships through consistent interaction</li>
      </ul>
      
      <h2>Creating Valuable Content</h2>
      <p>The digital space is crowded with content. To stand out, focus on creating resources that address real needs:</p>
      <ul>
        <li>Answering common questions about faith</li>
        <li>Providing biblical perspectives on current issues</li>
        <li>Sharing personal testimonies of transformation</li>
        <li>Offering practical applications of scripture</li>
      </ul>
      
      <h2>Building Digital Communities</h2>
      <p>Online groups and communities can provide spaces for deeper discussion and discipleship:</p>
      <ul>
        <li>Virtual Bible studies and prayer groups</li>
        <li>Discussion forums for exploring faith questions</li>
        <li>Support communities for specific life challenges</li>
        <li>Mentorship connections for spiritual growth</li>
      </ul>
      
      <p>As we navigate the digital age, let's remember that while the methods may change, the message remains the same. Technology is simply a tool—the power of the Gospel itself remains our greatest resource for transformation.</p>
    `,
    author: 'Sarah Johnson',
    authorId: 'user-123',
    featuredImage: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5',
    publishedAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-20'),
    category: 'evangelism',
    tags: ['digital', 'evangelism', 'social media', 'technology'],
    featured: true
  },
  {
    id: '2',
    title: 'The Importance of Community in Evangelism',
    slug: 'importance-community-evangelism',
    excerpt: 'Exploring how building authentic community relationships amplifies our evangelistic efforts and fulfills the Great Commission.',
    content: `
      <p>Evangelism was never meant to be a solo endeavor. This article explores the biblical foundations for community-based outreach and its effectiveness in contemporary ministry contexts.</p>
      
      <h2>Biblical Foundations for Community Evangelism</h2>
      <p>From the earliest days of the church, the gospel spread through community networks:</p>
      <ul>
        <li>Jesus sent disciples out in pairs (Luke 10:1)</li>
        <li>The early church grew through household conversions (Acts 16:31-34)</li>
        <li>Paul always worked with ministry teams (Acts 16:1-5)</li>
      </ul>
      
      <h2>Breaking Down Barriers Together</h2>
      <p>Communities of believers can overcome obstacles that individuals alone cannot:</p>
      <ul>
        <li>Demonstrating authentic Christian love through relationships</li>
        <li>Providing diverse testimonies that resonate with different people</li>
        <li>Creating safe spaces for spiritual exploration</li>
        <li>Offering practical support alongside spiritual guidance</li>
      </ul>
      
      <h2>Practical Applications</h2>
      <p>Here are some ways to leverage community in your evangelistic efforts:</p>
      <ul>
        <li>Host neighborhood gatherings that build relationships</li>
        <li>Organize service projects that demonstrate Christian love in action</li>
        <li>Create discussion groups on topics of interest to seekers</li>
        <li>Develop a culture of invitation within your church community</li>
      </ul>
      
      <p>Remember, when people see a community transformed by the gospel, it provides a powerful witness to the reality of Christ's love and power.</p>
    `,
    author: 'Michael Chen',
    authorId: 'user-456',
    featuredImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18',
    publishedAt: new Date('2023-07-02'),
    updatedAt: new Date('2023-07-10'),
    category: 'outreach',
    tags: ['community', 'evangelism', 'relationships', 'ministry'],
    featured: true
  },
  {
    id: '3',
    title: 'Bible Study Methods for Deeper Understanding',
    slug: 'bible-study-methods-deeper-understanding',
    excerpt: 'Learn practical techniques to enhance your scripture study and gain more meaningful insights from God\'s Word.',
    content: `
      <p>The Bible is a treasure trove of wisdom, guidance, and revelation—but unlocking its depths requires intentional study approaches. This article presents several methods to enrich your engagement with Scripture.</p>
      
      <h2>The SOAP Method</h2>
      <p>This popular approach provides a simple framework for daily study:</p>
      <ul>
        <li><strong>Scripture:</strong> Write out the passage you're studying</li>
        <li><strong>Observation:</strong> Record what you notice in the text</li>
        <li><strong>Application:</strong> Consider how it applies to your life</li>
        <li><strong>Prayer:</strong> Respond to God based on what you've learned</li>
      </ul>
      
      <h2>Inductive Bible Study</h2>
      <p>This three-step process helps you dig deeper into Biblical texts:</p>
      <ul>
        <li><strong>Observation:</strong> What does the passage say?</li>
        <li><strong>Interpretation:</strong> What does the passage mean?</li>
        <li><strong>Application:</strong> How should this change me?</li>
      </ul>
      
      <h2>Word Studies</h2>
      <p>Exploring the original languages can reveal deeper meanings:</p>
      <ul>
        <li>Identifying key words in a passage</li>
        <li>Researching their original Hebrew or Greek meanings</li>
        <li>Comparing how the words are used elsewhere in Scripture</li>
        <li>Discovering nuances lost in translation</li>
      </ul>
      
      <p>Whatever method you choose, approach Scripture with a humble heart and a willingness to be transformed. The goal isn't merely information acquisition but life transformation through encounter with the living God.</p>
    `,
    author: 'David Williams',
    authorId: 'user-789',
    featuredImage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65',
    publishedAt: new Date('2023-08-05'),
    updatedAt: new Date('2023-08-07'),
    category: 'bible-study',
    tags: ['bible study', 'scripture', 'hermeneutics', 'spiritual growth'],
    featured: true
  },
  {
    id: '4',
    title: 'Testimonies of Transformation',
    slug: 'testimonies-transformation',
    excerpt: 'Real-life stories of how the Gospel has radically changed lives in our community and around the world.',
    content: `
      <p>Nothing demonstrates the power of the Gospel more convincingly than transformed lives. This collection of testimonies showcases God's work in diverse circumstances.</p>
      
      <h2>From Addiction to Freedom</h2>
      <p>James struggled with substance abuse for fifteen years before encountering Christ through a street ministry. Today, he leads a recovery program helping others find the same freedom.</p>
      
      <h2>Healing in the Midst of Loss</h2>
      <p>After losing her family in a tragic accident, Maria found herself questioning everything. Through a patient community of believers, she discovered God's presence in suffering and now counsels others through grief.</p>
      
      <h2>Corporate Success to Kingdom Purpose</h2>
      <p>As a high-powered executive, Thomas had everything society values but felt empty inside. A chance conversation with a Christian colleague led to a journey of discovering purpose beyond profit. He now mentors business leaders in integrating faith and work.</p>
      
      <h2>From Skeptic to Believer</h2>
      <p>Lisa was a committed atheist who enjoyed debating Christians. When she decided to read the Bible to find more ammunition for arguments, she was surprised by its wisdom and eventually surrendered to the Christ she had once denied.</p>
      
      <p>These stories remind us that God is still in the business of transformation. No life is beyond His reach, and no situation is beyond His redemptive power.</p>
    `,
    author: 'Rebecca Nguyen',
    authorId: 'user-101',
    featuredImage: 'https://images.unsplash.com/photo-1534008757030-27299c4371b6',
    publishedAt: new Date('2023-08-18'),
    updatedAt: new Date('2023-08-20'),
    category: 'testimony',
    tags: ['testimony', 'transformation', 'conversion', 'redemption'],
    featured: false
  },
  {
    id: '5',
    title: 'Prayer Strategies for Effective Evangelism',
    slug: 'prayer-strategies-effective-evangelism',
    excerpt: 'Discover how strategic prayer can prepare hearts and open doors for sharing the Gospel.',
    content: `
      <p>Prayer is not merely preparation for evangelism—it is the foundation of all effective outreach. This article explores how intentional prayer strategies can transform your evangelistic efforts.</p>
      
      <h2>Prayer Mapping Your Community</h2>
      <p>Strategic prayer often begins with intentional focus:</p>
      <ul>
        <li>Identifying key locations and institutions in your area</li>
        <li>Researching the specific needs and challenges of your community</li>
        <li>Organizing prayer walks through significant neighborhoods</li>
        <li>Praying specifically for local leaders and influencers</li>
      </ul>
      
      <h2>Intercessory Prayer for the Unreached</h2>
      <p>Focused prayer for those who don't know Christ:</p>
      <ul>
        <li>Creating prayer lists of specific individuals</li>
        <li>Praying for divine appointments and open conversations</li>
        <li>Asking for spiritual hunger and receptivity</li>
        <li>Interceding against spiritual blindness and resistance</li>
      </ul>
      
      <h2>Prayer Partnerships</h2>
      <p>Multiplying prayer power through collaboration:</p>
      <ul>
        <li>Forming prayer triads that meet regularly for specific evangelistic goals</li>
        <li>Organizing prayer coverage during outreach events</li>
        <li>Developing prayer networks that cross denominational lines</li>
        <li>Utilizing technology to coordinate prayer efforts</li>
      </ul>
      
      <p>As we prioritize prayer in our evangelism, we acknowledge our dependence on God's power rather than human techniques. Prayer reminds us that conversion is ultimately the work of the Holy Spirit, not our persuasive abilities.</p>
    `,
    author: 'Jonathan Mendez',
    authorId: 'user-202',
    featuredImage: 'https://images.unsplash.com/photo-1545935950-a5a7b96da67f',
    publishedAt: new Date('2023-09-10'),
    updatedAt: new Date('2023-09-15'),
    category: 'evangelism',
    tags: ['prayer', 'evangelism', 'intercession', 'spiritual warfare'],
    featured: false
  }
];

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured).slice(0, 3);
};

export const getRecentPosts = (limit: number = 5): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};

export const searchPosts = (query: string): BlogPost[] => {
  const lowerCaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowerCaseQuery) || 
    post.excerpt.toLowerCase().includes(lowerCaseQuery) || 
    post.content.toLowerCase().includes(lowerCaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );
};
