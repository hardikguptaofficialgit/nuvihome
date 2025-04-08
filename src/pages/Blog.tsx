import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '@/contexts/BlogContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, BookOpen, User, Calendar } from 'lucide-react';

const Blog = () => {
  const { posts } = useBlog();

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full mb-4">
            <BookOpen size={16} />
            <span className="font-medium">Knowledge Hub</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            Educational <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/70">Blog</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our articles and resources to help you excel in your studies and prepare for competitive exams.
          </p>
        </div>

        {/* Featured Post - First post shown larger */}
        {posts.length > 0 && (
          <div className="mb-16 animate-fade-in">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 lg:flex">
              <div className="lg:w-1/2 h-64 lg:h-auto bg-gradient-to-br from-accent/10 to-secondary/30 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
                <img
                  src={posts[0].imageUrl || '/placeholder.svg'}
                  alt={posts[0].title}
                  className="w-24 h-24 opacity-60"
                />
              </div>
              
              <div className="lg:w-1/2 p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {posts[0].tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">{posts[0].title}</h2>
                <p className="text-muted-foreground mb-6">{posts[0].excerpt}</p>
                
                <div className="flex items-center text-sm text-muted-foreground mb-6 gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{posts[0].date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{posts[0].author}</span>
                  </div>
                </div>
                
                <Link to={`/blog/${posts[0].id}`}>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm flex items-center gap-2">
                    Read Full Article
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, index) => (
            <Card 
              key={post.id} 
              className="overflow-hidden animate-fade-in hover:shadow-lg transition-all duration-300 group" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-48 bg-gradient-to-br from-accent/5 to-secondary/30 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground/80 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span>{post.date}</span>
                </div>
                <img
                  src={post.imageUrl || '/placeholder.svg'}
                  alt={post.title}
                  className="w-16 h-16 opacity-50 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground line-clamp-3 mb-3">{post.excerpt}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-4">
                  <User className="h-4 w-4 mr-1" />
                  <span>{post.author}</span>
                </div>
              </CardContent>
              
              <CardFooter className="px-6 py-4 bg-secondary/10 border-t border-border">
                <Link to={`/blog/${post.id}`} className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full border-accent/70 text-accent hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-2 transition-all"
                  >
                    Read Article
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination or Load More */}
        {posts.length > 6 && (
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              className="border-accent/50 text-accent hover:bg-accent/10 px-8"
            >
              Load More Articles
            </Button> 
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;