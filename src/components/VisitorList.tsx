import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, UserMinus, Clock, Mail, Phone, Building2 } from 'lucide-react';
import { Visitor } from '@/types/visitor';
import { useToast } from '@/hooks/use-toast';

interface VisitorListProps {
  visitors: Visitor[];
  onCheckOut: (id: string) => void;
}

const VisitorList = ({ visitors, onCheckOut }: VisitorListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked-in' | 'checked-out'>('all');
  const { toast } = useToast();

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.personToMeet.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCheckOut = (visitor: Visitor) => {
    onCheckOut(visitor.id);
    toast({
      title: "Visitor Checked Out",
      description: `${visitor.name} has been checked out successfully.`,
    });
  };

  const formatDuration = (checkIn: Date, checkOut?: Date) => {
    const endTime = checkOut || new Date();
    const duration = Math.floor((endTime.getTime() - checkIn.getTime()) / (1000 * 60));
    return `${duration}m`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span>Visitor Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search visitors by name, company, or person to meet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              {(['all', 'checked-in', 'checked-out'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status)}
                  size="sm"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Visit Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{visitor.name}</p>
                        <p className="text-sm text-muted-foreground">{visitor.company}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                          {visitor.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          {visitor.mobile}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{visitor.personToMeet}</p>
                        <p className="text-sm text-muted-foreground">{visitor.department}</p>
                        <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={visitor.status === 'checked-in' ? 'default' : 'secondary'}
                        className={visitor.status === 'checked-in' ? 'bg-success hover:bg-success/80' : ''}
                      >
                        {visitor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {formatDuration(visitor.checkInTime, visitor.checkOutTime)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        In: {new Date(visitor.checkInTime).toLocaleTimeString()}
                      </p>
                      {visitor.checkOutTime && (
                        <p className="text-xs text-muted-foreground">
                          Out: {new Date(visitor.checkOutTime).toLocaleTimeString()}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {visitor.status === 'checked-in' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckOut(visitor)}
                          className="text-warning hover:text-warning-foreground hover:bg-warning"
                        >
                          <UserMinus className="h-4 w-4 mr-1" />
                          Check Out
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredVisitors.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No visitors found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorList;