import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ChevronRight, Wrench, BookOpen, Users, Newspaper } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Hero Section - Redesigned with content over brain icon */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative">
        {/* Brain icon background container */}
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-40 md:opacity-60">
          <div className="w-full h-full max-w-3xl max-h-3xl">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full aspect-square">
                {/* Animated circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-accent/10 animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5/6 h-5/6 rounded-full bg-accent/15 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2/3 h-2/3 rounded-full bg-accent/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                
                {/* Brain image in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 rounded-full bg-accent/30 flex items-center justify-center">
                    <img
                      src="https://res.cloudinary.com/ddx6avza4/image/upload/v1744135435/brainz_c1hymy.png"
                      alt="BrainzImg"
                      className="w-3/4 h-3/4 object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content overlaying the brain icon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="space-y-6 animate-fade-in glass-card p-8 rounded-3xl bg-background/80 backdrop-blur-sm border border-accent/10 shadow-lg max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Master JEE With <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/70">NuviBrainz</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                India's smartest platform built for JEE aspirants
              </p>
              
              {/* Buttons centered */}
              <div className="flex flex-wrap justify-center gap-4 w-full pt-2">
                {isAuthenticated ? (
                  <Link to="/profile" className="w-full sm:w-auto">
                    <Button className="bg-accent text-black hover:bg-accent/90 text-lg px-6 py-6 rounded-xl flex items-center h-12 w-full sm:w-auto justify-center">
                      Go to Dashboard
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button className="bg-accent text-black hover:bg-accent/90 text-lg px-6 py-6 rounded-xl flex items-center h-12 w-full sm:w-auto justify-center">
                      Start Learning
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link to="/blog" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="border-black text-black hover:bg-accent hover:text-black dark:border-accent dark:text-accent dark:hover:text-black text-lg px-6 py-6 rounded-xl h-12 w-full sm:w-auto justify-center"
                  >
                    Explore Resources
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Nuvibrainz is a Game-Changer for <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/70">JEE Prep</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine technology, community, and deep academic insight to help you crack competitive exams with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Users className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aspirant-Mentor Community</h3>
              <p className="text-muted-foreground">
                Connect directly with JEE Rankers & Experienced Faculties.
              </p>
            </div>
            
            <div
              className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <img
                  src="https://res.cloudinary.com/ddx6avza4/image/upload/v1744136242/brainz_-_Copy_kkzrzf.png"
                  alt="BrainzImg"
                  className="w-10 h-10 object-contain"></img>
              </div>
              <h3 className="text-xl font-semibold mb-2">NuviNex AI</h3>
              <p className="text-muted-foreground">
                Get instant answers, concept help & smart doubt-solving with our powerful AI built for JEE prep.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <BookOpen className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Experts - Curated Notes</h3>
              <p className="text-muted-foreground">
                Expert notes and strategies directly by JEE rankers.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Wrench className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tools</h3>
              <p className="text-muted-foreground">
                Access advanced calculators, visualizers, and learning tools to boost your JEE prep efficiency.
              </p>
            </div>
            <div
              className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-fade-in"
              style={{ animationDelay: '300ms' }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Newspaper className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Blogs</h3>
              <p className="text-muted-foreground">
                Explore expert articles topper strategies bite-sized JEE concepts.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Users className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aspirant-Aspirant Community</h3>
              <p className="text-muted-foreground">
                Connect with aspirants like you, share notes, grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 md:p-16 rounded-3xl bg-gradient-to-br from-background via-background to-secondary/50">
            <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Ace JEE the Smarter Way?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join early. Shape JEE prep with us.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {isAuthenticated ? (
                  <Link to="/profile" className="w-full sm:w-auto">
                    <Button className="bg-accent text-black hover:bg-accent/90 text-lg px-6 py-6 rounded-xl flex items-center h-12 w-full sm:w-auto justify-center">
                      Go to Dashboard
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button className="bg-accent text-black hover:bg-accent/90 text-lg px-6 py-6 rounded-xl flex items-center h-12 w-full sm:w-auto justify-center">
                      Sign Up Now
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;