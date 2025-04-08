
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Calendar, Zap } from 'lucide-react';

// Mock data for student
const studentData = {
  courses: ['JEE Advanced', 'NEET Prep'],
  progress: 67,
  joinedOn: '2023-10-15',
  stats: {
    hoursStudied: 120,
    lessonsCompleted: 45,
    quizzesTaken: 32,
    accuracy: 78
  },
  upcomingExams: [
    { id: 1, name: 'Physics Mock Test', date: '2023-12-15' },
    { id: 2, name: 'Chemistry Mid-Term', date: '2023-12-20' },
  ],
  recentActivity: [
    { id: 1, action: 'Completed lesson', subject: 'Organic Chemistry', date: '2023-12-01' },
    { id: 2, action: 'Took quiz', subject: 'Mechanics', score: '8/10', date: '2023-11-29' },
    { id: 3, action: 'Watched video', subject: 'Cell Biology', duration: '45 mins', date: '2023-11-28' }
  ]
};

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // If not logged in, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your learning journey</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-accent" />
                Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{studentData.stats.hoursStudied} hrs</p>
              <p className="text-muted-foreground text-sm">Total study time</p>
            </CardContent>
          </Card>

          <Card className="glass-card animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-accent" />
                Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{studentData.stats.lessonsCompleted}</p>
              <p className="text-muted-foreground text-sm">Lessons completed</p>
            </CardContent>
          </Card>

          <Card className="glass-card animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Zap className="mr-2 h-5 w-5 text-accent" />
                Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{studentData.stats.quizzesTaken}</p>
              <p className="text-muted-foreground text-sm">Quizzes completed</p>
            </CardContent>
          </Card>

          <Card className="glass-card animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-accent" />
                Member Since
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{studentData.joinedOn}</p>
              <p className="text-muted-foreground text-sm">Joined date</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Progress */}
          <Card className="lg:col-span-2 glass-card animate-fade-in">
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Learning Progress</span>
                    <span className="font-medium">{studentData.progress}%</span>
                  </div>
                  <Progress value={studentData.progress} className="h-2 bg-secondary" />
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-3">Enrolled Courses</h4>
                  <div className="space-y-3">
                    {studentData.courses.map((course, index) => (
                      <div key={index} className="flex items-center bg-secondary/30 p-3 rounded-lg">
                        <BookOpen className="h-5 w-5 text-accent mr-3" />
                        <div>
                          <p className="font-medium">{course}</p>
                          <p className="text-sm text-muted-foreground">In progress</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card className="glass-card animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.upcomingExams.map(exam => (
                  <div key={exam.id} className="border border-border rounded-lg p-4">
                    <p className="font-semibold">{exam.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {exam.date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-3 glass-card animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="bg-accent/20 p-2 rounded-full mr-4">
                      <Zap className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}: {activity.subject}</p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
                        <span>{activity.date}</span>
                        {activity.score && <span>Score: {activity.score}</span>}
                        {activity.duration && <span>Duration: {activity.duration}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
