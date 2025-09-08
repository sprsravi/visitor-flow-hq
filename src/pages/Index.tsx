import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import CheckInForm from '@/components/CheckInForm';
import VisitorList from '@/components/VisitorList';
import Reports from '@/components/Reports';
import { Visitor, VisitorFormData } from '@/types/visitor';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [visitors, setVisitors] = useState<Visitor[]>([
    // Sample data for demonstration
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      mobile: '+1 (555) 123-4567',
      company: 'TechCorp Solutions',
      personToMeet: 'Sarah Johnson',
      department: 'IT',
      purpose: 'Business Meeting',
      checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'checked-in',
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily.davis@marketinghub.com',
      mobile: '+1 (555) 987-6543',
      company: 'Marketing Hub',
      personToMeet: 'Michael Brown',
      department: 'Marketing',
      purpose: 'Consultation',
      checkInTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      checkOutTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      status: 'checked-out',
    },
  ]);

  const handleCheckIn = (formData: VisitorFormData) => {
    const newVisitor: Visitor = {
      id: Date.now().toString(),
      ...formData,
      checkInTime: new Date(),
      status: 'checked-in',
    };
    setVisitors(prev => [newVisitor, ...prev]);
  };

  const handleCheckOut = (id: string) => {
    setVisitors(prev =>
      prev.map(visitor =>
        visitor.id === id
          ? { ...visitor, checkOutTime: new Date(), status: 'checked-out' }
          : visitor
      )
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard visitors={visitors} />;
      case 'checkin':
        return <CheckInForm onSubmit={handleCheckIn} />;
      case 'visitors':
        return <VisitorList visitors={visitors} onCheckOut={handleCheckOut} />;
      case 'reports':
        return <Reports visitors={visitors} />;
      default:
        return <Dashboard visitors={visitors} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;