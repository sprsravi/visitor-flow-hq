import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { Visitor } from '@/types/visitor';

interface DashboardProps {
  visitors: Visitor[];
}

const Dashboard = ({ visitors }: DashboardProps) => {
  const checkedInVisitors = visitors.filter(v => v.status === 'checked-in');
  const checkedOutVisitors = visitors.filter(v => v.status === 'checked-out');
  const totalVisitorsToday = visitors.filter(v => {
    const today = new Date();
    const visitorDate = new Date(v.checkInTime);
    return visitorDate.toDateString() === today.toDateString();
  });

  const stats = [
    {
      title: 'Total Visitors Today',
      value: totalVisitorsToday.length,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Currently Checked In',
      value: checkedInVisitors.length,
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Checked Out',
      value: checkedOutVisitors.length,
      icon: UserX,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    {
      title: 'Avg. Visit Duration',
      value: '45m',
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-success" />
              <span>Recently Checked In</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checkedInVisitors.slice(0, 5).map((visitor) => (
                <div key={visitor.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{visitor.name}</p>
                    <p className="text-sm text-muted-foreground">{visitor.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{visitor.personToMeet}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(visitor.checkInTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {checkedInVisitors.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No visitors currently checked in</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Today's Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {totalVisitorsToday.slice(0, 5).map((visitor) => (
                <div key={visitor.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{visitor.name}</p>
                    <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      visitor.status === 'checked-in' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {visitor.status}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(visitor.checkInTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {totalVisitorsToday.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No visitors today</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;