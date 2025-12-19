import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import CartPage from './CartPage';
import api from '../api/axiosConfig';

// Mock the API module
jest.mock('../api/axiosConfig', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mock the generatePrescriptionPDF function
jest.mock('./generatePrescriptionPDF', () => ({
  generatePrescriptionPDF: jest.fn(() => Promise.resolve()),
}));

// Mock the useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('CartPage', () => {
  it('saves the prescription and redirects to the dashboard', async () => {
    render(
      <Router>
        <AuthProvider>
          <CartProvider>
            <CartPage />
          </CartProvider>
        </AuthProvider>
      </Router>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Patient Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Patient Age'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Diagnosis'), { target: { value: 'Fever' } });
    fireEvent.change(screen.getByLabelText("Doctor's Notes / General Advice"), { target: { value: 'Rest' } });

    // Click the generate PDF button
    fireEvent.click(screen.getByText('Generate & Download PDF'));

    // Wait for the API call and redirect
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/prescriptions', {
        patientName: 'John Doe',
        patientAge: '30',
        diagnosis: 'Fever',
        medicines: [],
        doctorNotes: 'Rest',
      });
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
