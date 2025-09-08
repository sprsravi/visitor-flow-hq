import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Building2 } from 'lucide-react';
import { VisitorFormData } from '@/types/visitor';
import { useToast } from '@/hooks/use-toast';

interface CheckInFormProps {
  onSubmit: (data: VisitorFormData) => void;
}

const CheckInForm = ({ onSubmit }: CheckInFormProps) => {
  const [formData, setFormData] = useState<VisitorFormData>({
    name: '',
    email: '',
    mobile: '',
    company: '',
    personToMeet: '',
    department: '',
    purpose: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.personToMeet) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      mobile: '',
      company: '',
      personToMeet: '',
      department: '',
      purpose: '',
    });

    toast({
      title: "Visitor Checked In",
      description: `${formData.name} has been successfully checked in.`,
    });
  };

  const handleInputChange = (field: keyof VisitorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const departments = [
    'HR', 'IT', 'Finance', 'Marketing', 'Sales', 'Operations', 'Management', 'Legal', 'R&D'
  ];

  const purposes = [
    'Business Meeting', 'Interview', 'Delivery', 'Maintenance', 'Training', 'Consultation', 'Other'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <UserPlus className="h-8 w-8 text-primary" />
            <span>Visitor Check-In</span>
          </CardTitle>
          <p className="text-muted-foreground">Please fill in your details to check in</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@company.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="personToMeet">Person to Meet *</Label>
                <Input
                  id="personToMeet"
                  value={formData.personToMeet}
                  onChange={(e) => handleInputChange('personToMeet', e.target.value)}
                  placeholder="Employee name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Visit</Label>
              <Select onValueChange={(value) => handleInputChange('purpose', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full md:w-auto px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200"
              >
                <Building2 className="mr-2 h-5 w-5" />
                Check In Visitor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInForm;