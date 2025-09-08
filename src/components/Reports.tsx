import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { BarChart3, Download, Calendar, TrendingUp, Users, Clock, Building2 } from 'lucide-react';
import { Visitor } from '@/types/visitor';

interface ReportsProps {
  visitors: Visitor[];
}

const Reports = ({ visitors }: ReportsProps) => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const filteredVisitors = visitors.filter(visitor => {
    const visitorDate = new Date(visitor.checkInTime);
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);
    
    return visitorDate >= fromDate && visitorDate <= toDate;
  });

  const generateDailyStats = () => {
    const dailyStats: { [key: string]: { total: number; checkedIn: number; checkedOut: number } } = {};
    
    filteredVisitors.forEach(visitor => {
      const date = new Date(visitor.checkInTime).toDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = { total: 0, checkedIn: 0, checkedOut: 0 };
      }
      dailyStats[date].total++;
      if (visitor.status === 'checked-in') {
        dailyStats[date].checkedIn++;
      } else {
        dailyStats[date].checkedOut++;
      }
    });

    return Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      ...stats
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getTopCompanies = () => {
    const companyStats: { [key: string]: number } = {};
    filteredVisitors.forEach(visitor => {
      if (visitor.company) {
        companyStats[visitor.company] = (companyStats[visitor.company] || 0) + 1;
      }
    });

    return Object.entries(companyStats)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const getAverageVisitDuration = () => {
    const completedVisits = filteredVisitors.filter(v => v.checkOutTime);
    if (completedVisits.length === 0) return 0;

    const totalDuration = completedVisits.reduce((sum, visitor) => {
      const duration = new Date(visitor.checkOutTime!).getTime() - new Date(visitor.checkInTime).getTime();
      return sum + duration;
    }, 0);

    return Math.round(totalDuration / completedVisits.length / (1000 * 60)); // in minutes
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Company', 'Email', 'Mobile', 'Person to Meet', 'Department', 'Purpose', 'Check In', 'Check Out', 'Status'],
      ...filteredVisitors.map(visitor => [
        visitor.name,
        visitor.company,
        visitor.email,
        visitor.mobile,
        visitor.personToMeet,
        visitor.department,
        visitor.purpose,
        new Date(visitor.checkInTime).toLocaleString(),
        visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleString() : 'N/A',
        visitor.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `visitor_report_${dateRange.from}_to_${dateRange.to}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const dailyStats = generateDailyStats();
  const topCompanies = getTopCompanies();
  const avgDuration = getAverageVisitDuration();

  return (
    <div className="space-y-6">
      {/* Header with Date Range */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span>Visitor Reports & Analytics</span>
            </div>
            <Button onClick={exportToCSV} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="from-date">From Date</Label>
              <Input
                id="from-date"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-date">To Date</Label>
              <Input
                id="to-date"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Total Visitors</span>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">{filteredVisitors.length}</p>
            </div>
            <div className="bg-success/10 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Currently In</span>
              </div>
              <p className="text-2xl font-bold text-success mt-2">
                {filteredVisitors.filter(v => v.status === 'checked-in').length}
              </p>
            </div>
            <div className="bg-warning/10 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-warning" />
                <span className="text-sm font-medium">Avg Duration</span>
              </div>
              <p className="text-2xl font-bold text-warning mt-2">{avgDuration}m</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Daily Visitor Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Visitors</TableHead>
                  <TableHead>Currently In</TableHead>
                  <TableHead>Checked Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyStats.map((stat, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {new Date(stat.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{stat.total}</TableCell>
                    <TableCell>
                      <span className="text-success font-medium">{stat.checkedIn}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{stat.checkedOut}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Top Visiting Companies</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Number of Visits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCompanies.map((company, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{company.company}</TableCell>
                    <TableCell>{company.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {topCompanies.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No company data available for the selected period.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;