import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { App } from '../../App';
import { mockSuccessfulFetch } from '../mocks/api-mocks';

const renderAndWaitForApp = async () => {
  await act(async () => {
    render(<App />);
  });

  await waitFor(() => {
    expect(screen.getByText('Azure Web App Showcase')).toBeInTheDocument();
  });
};

describe('Main App Component', () => {
  beforeEach(() => {
    global.fetch = mockSuccessfulFetch();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders app menu without crashing', async () => {
    await renderAndWaitForApp();
    
    // Check if the main menu elements are present
    expect(screen.getByText('Azure Web App Showcase')).toBeInTheDocument();
    expect(screen.getByText('Dangerous Writing')).toBeInTheDocument();
    expect(screen.getByText('Task Prioritizer')).toBeInTheDocument();
  });
});
