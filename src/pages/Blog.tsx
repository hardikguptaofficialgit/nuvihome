import React from 'react'; 
import { Link } from 'react-router-dom';
import { useBlog } from '@/contexts/BlogContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, BookOpen, User, Calendar } from 'lucide-react';

const Blog = () => {
  const { posts } = useBlog();
  const fallbackLogo = 'https://res.cloudinary.com/ddx6avza4/image/upload/v1744129312/n_rz5riq.png';

  if (!posts || posts.length === 0) {
    return (
      <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold">
          Educational <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/70">Blog</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">No articles available at the moment. Check back soon!</p>
      </div>
    );
  }

  return (
    <section className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full mb-4">
            <BookOpen size={16} aria-hidden="true" />
            <span className="font-medium">NuviKnow Hub</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            Educational <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/70">Blog</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our articles and resources to help you excel in your studies and prepare for competitive exams.
          </p>
        </header>

        {/* Featured Post */}
        <section className="mb-16 animate-fade-in" aria-labelledby="featured-post">
          <h2 id="featured-post" className="sr-only">Featured Article</h2>
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 lg:flex">
            <div className="lg:w-1/2 h-64 lg:h-auto bg-gradient-to-br from-accent/10 to-secondary/30 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
              <img
                src={posts[0].imageUrl || fallbackLogo}
                alt=""
                className="w-24 h-24 opacity-"
                aria-hidden="true"
              />
            </div>
            <div className="lg:w-1/2 p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {posts[0].tags.slice(0, 3).map((tag, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="bg-accent/10 text-black dark:text-accent border-accent/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">{posts[0].title}</h3>
              <p className="text-muted-foreground mb-6">{posts[0].excerpt}</p>
              <div className="flex items-center text-sm text-muted-foreground mb-6 gap-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={new Date(posts[0].date).toISOString()}>{posts[0].date}</time>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span>{posts[0].author}</span>
                </div>
              </div>
              <Link to={`/blog/${posts[0].id}`} className="inline-block">
                <Button className="bg-accent text-black hover:bg-accent/90 shadow-sm flex items-center gap-2">
                  Read Full Article
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        {/* Post Grid */}
        <section aria-labelledby="recent-posts">
          <h2 id="recent-posts" className="sr-only">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post, index) => (
              <article
                key={post.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                  <div className="h-48 bg-gradient-to-br from-accent/5 to-secondary/30 flex items-center justify-center relative">
                    <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
                    <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground/80 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      <time dateTime={new Date(post.date).toISOString()}>{post.date}</time>
                    </div>
                    <img
                      src={post.imageUrl || fallbackLogo}
                      alt=""
                      className="w-16 h-16 opacity-50 transition-transform duration-300 group-hover:scale-110"
                      aria-hidden="true"
                    />
                  </div>
                  <CardContent className="p-6 flex-grow">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-accent/10 text-black dark:text-accent border-accent/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-black transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 mb-3">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-muted-foreground mt-4">
                      <User className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{post.author}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 py-4 bg-secondary/10 border-t border-border mt-auto">
                    <Link to={`/blog/${post.id}`} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full border-accent/70 bg-accent text-black hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-2 transition-all"
                      >
                        Read Article
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </article>
            ))}
          </div>
        </section>

        {/* Pagination */}
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
    </section>
  );
};

export default Blog;
