import React from 'react';
import { render, screen } from '@testing-library/react';
import SmartDashboard from './SmartDashboard';

// Mock the API module
jest.mock('../api/axiosConfig', () => ({
  get: jest.fn(() => Promise.resolve({ data: { success: true, data: { treatedStats: [], diagnosisStats: [], recentPrescriptions: [] } } })),
}));

// Mock the chart components
jest.mock('react-chartjs-2', () => ({
  Bar: () => <canvas />,
  Pie: () => <canvas />,
}));

describe('SmartDashboard', () => {
  it('renders the dashboard title', async () => {
    render(<SmartDashboard />);
    expect(await screen.findByText('Practice Overview')).toBeInTheDocument();
  });

  it('renders the loading state initially', () => {
    render(<SmartDashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the charts after data fetching', async () => {
    render(<SmartDashboard />);
    expect(await screen.findByText('Patients Treated (Last 7 Days)')).toBeInTheDocument();
    expect(await screen.findByText('Top Diagnoses')).toBeInTheDocument();
  });

  it('renders the recent prescriptions table', async () => {
    render(<SmartDashboard />);
    expect(await screen.findByText('Recent Prescriptions')).toBeInTheDocument();
  });
});