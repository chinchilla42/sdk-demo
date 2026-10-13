import { render, screen, fireEvent } from '@testing-library/react';
import { vi, beforeEach, test, expect } from 'vitest';
import App from './App';

// -- Mock the Kameleoon hooks so the test does not call the Kameleoon servers.
// -- Like the real SDK, each hook returns the same functions on every render. --
const sdk = vi.hoisted(() => ({
  initialize: { initialize: () => Promise.resolve(true) },
  visitorCode: {
    getVisitorCode: () => 'test-visitor',
    setLegalConsent: () => {},
  },
  featureFlag: {
    getVariations: () => new Map([
      ['banner', {
        id: 1,
        variables: new Map([
          ['size', { value: 'medium' }],
          ['background_color', { value: 'red' }],
        ]),
      }],
    ]),
    getEngineTrackingCode: () => '',
  },
  data: {},
}));

const { trackConversion, addData, flush } = Object.assign(sdk.data, {
  trackConversion: vi.fn(),
  addData: vi.fn(),
  flush: vi.fn(),
});

vi.mock('@kameleoon/react-sdk', () => ({
  useInitialize: () => sdk.initialize,
  useVisitorCode: () => sdk.visitorCode,
  useFeatureFlag: () => sdk.featureFlag,
  useData: () => sdk.data,
  CustomData: class CustomData {
    constructor(index, ...values) {
      this.index = index;
      this.values = values;
    }
  },
}));

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

test('renders the visitor code and applies the banner variables', async () => {
  render(<App />);

  expect(await screen.findByText('test-visitor')).toBeInTheDocument();
  const banner = screen.getByText('Banner title').parentElement;
  expect(banner).toHaveStyle({ width: '1000px', backgroundColor: 'rgb(255, 0, 0)' });
  expect(addData).toHaveBeenCalledTimes(1);
  expect(flush).toHaveBeenCalledWith('test-visitor');
});

test('tracks exactly one conversion per banner button click', async () => {
  render(<App />);
  await screen.findByText('test-visitor');

  fireEvent.click(screen.getByRole('button', { name: 'Click me' }));

  expect(trackConversion).toHaveBeenCalledTimes(1);
  expect(trackConversion).toHaveBeenCalledWith(
    expect.objectContaining({ visitorCode: 'test-visitor', goalId: 335149, revenue: 20 }),
  );
});
