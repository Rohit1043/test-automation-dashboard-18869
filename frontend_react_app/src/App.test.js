import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders dashboard branding", () => {
  render(<App />);
  expect(screen.getAllByText(/Test Automation/i)[0]).toBeInTheDocument();
});
