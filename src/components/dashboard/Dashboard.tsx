import { useState } from 'react';
import DashboardShell from './DashboardShell';
import OverviewTab from './OverviewTab';
import WebsiteTab from './WebsiteTab';
import ShipmentsTab from './ShipmentsTab';
import ClientsTab from './ClientsTab';
import InvoicesTab from './InvoicesTab';
import CalendarTab from './CalendarTab';
import TeamTab from './TeamTab';
import SettingsTab from './SettingsTab';

interface Props {
  onExit: () => void;
}

export default function Dashboard({ onExit }: Props) {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'website': return <WebsiteTab />;
      case 'shipments': return <ShipmentsTab />;
      case 'clients': return <ClientsTab />;
      case 'invoices': return <InvoicesTab />;
      case 'calendar': return <CalendarTab />;
      case 'team': return <TeamTab />;
      case 'settings': return <SettingsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <DashboardShell activeTab={activeTab} onTabChange={setActiveTab} onExit={onExit}>
      {renderTab()}
    </DashboardShell>
  );
}
