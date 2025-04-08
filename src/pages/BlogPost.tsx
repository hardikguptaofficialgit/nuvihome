
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '@/contexts/BlogContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById } = useBlog();
  const navigate = useNavigate();
  
  const post = getPostById(id || '');
  
  useEffect(() => {
    if (!post) {
      navigate('/blog');
    }
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [post, navigate]);
  
  if (!post) {
    return null;
  }

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <Link to="/blog">
            <Button variant="ghost" className="flex items-center gap-2 pl-0 hover:pl-2 transition-all">
              <ArrowLeft size={16} />
              Back to Blog
            </Button>
          </Link>
        </div>
        
        <article className="animate-fade-in">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="bg-accent/10 text-accent border-accent/30">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center text-muted-foreground mb-6">
              <div className="flex items-center mr-4">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.date}</span>
              </div>
            </div>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-muted-foreground mb-4">
              Found this article helpful? Explore more resources on our platform.
            </p>
            <div className="flex gap-4">
              <Link to="/blog">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  More Articles
                </Button>
              </Link>
              <Link to="/tools">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Study Tools
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
