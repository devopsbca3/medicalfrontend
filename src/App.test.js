import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Medical Record Management heading', () => {
  render(<App />);
  const heading = screen.getByText(/Medical Record Management/i);
  expect(heading).toBeInTheDocument();
});
test("basic test", () => {
  expect(true).toBe(true);
});
