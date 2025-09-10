import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import CheckInForm from '@/components/CheckInForm';
import VisitorList from '@/components/VisitorList';
import Reports from '@/components/Reports';
import { VisitorFormData } from '@/types/visitor';
import { useVisitors } from '@/hooks/useVisitors';

const Index = () => {
  console.log('Index component rendering');
  const [activeTab, setActiveTab] = useState('dashboard');
  const { visitors, isLoading, createVisitor, checkOutVisitor } = useVisitors();
  
  console.log('Visitors data:', { visitors, isLoading, visitorsLength: visitors?.length });

  const handleCheckIn = async (formData: VisitorFormData) => {
    await createVisitor(formData);
  };

  const handleCheckOut = async (id: string) => {
    await checkOutVisitor(id);
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