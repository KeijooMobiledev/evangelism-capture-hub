
import { BookOpen, FileText, Headphones, Video, BookMarked, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ResourcesSection = () => {
  const resourceCategories = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Bible Study Materials",
      description: "Access comprehensive Bible study guides, worksheets and commentaries for effective evangelism.",
      count: 124
    },
    {
      icon: <Headphones className="h-6 w-6 text-primary" />,
      title: "Audio Teachings",
      description: "Listen to sermons, podcasts and audio guides on evangelism techniques and theology.",
      count: 87
    },
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: "Training Videos",
      description: "Watch video tutorials and training sessions on evangelism approaches and practices.",
      count: 56
    },
    {
      icon: <BookMarked className="h-6 w-6 text-primary" />,
      title: "Evangelism Books",
      description: "Read digital books and publications on effective evangelism strategies and testimonies.",
      count: 42
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary">
            <BookOpen className="w-4 h-4 mr-2" />
            Spiritual Resources
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Equip your team with powerful resources</h2>
          <p className="text-lg text-muted-foreground">
            Access a comprehensive library of evangelism materials to help your community grow in knowledge and effectiveness.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {resourceCategories.map((category, index) => (
            <div 
              key={index} 
              className="glass-card p-6 rounded-xl transition-all duration-300 transform hover:translate-y-[-5px]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  {category.icon}
                </div>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {category.count} items
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <div className="flex items-center text-primary text-sm">
                <Download className="w-4 h-4 mr-1" />
                <span>Downloadable resources</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Featured Resource Collection</h3>
              <h4 className="text-lg font-medium text-primary mb-2">Effective Door-to-Door Evangelism</h4>
              <p className="text-muted-foreground mb-6">
                A complete toolkit with scripts, training materials, response handling guides, 
                and follow-up templates for successful door-to-door evangelism campaigns.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm">5 training videos</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm">12 printable handouts</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm">3 digital workbooks</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm">Interactive response guide</span>
                </li>
              </ul>
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Access Resource Collection
                </Button>
              </Link>
            </div>
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1000&q=80" 
                alt="Evangelism Resources"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
