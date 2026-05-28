import React from 'react';
import { Header } from '../../../components';

const Dashboard = () => {
  const user = {
    name: 'Test',
  };
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.name ?? 'Guest'}`}
        description="Track activity, trends and popular destinations in real time"
      />
      Dashboard page contents
    </main>
  );
};
export default Dashboard;
