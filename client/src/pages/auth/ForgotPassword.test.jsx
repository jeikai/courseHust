import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Axios from "axios";
import ForgotPassword from "./ForgotPassword";
import { ViewContext } from "../../context/View";

vi.mock("axios");

function renderPage() {
  const viewContext = { handleSuccess: vi.fn(), handleError: vi.fn() };
  render(
    <MemoryRouter>
      <ViewContext.Provider value={viewContext}>
        <ForgotPassword />
      </ViewContext.Provider>
    </MemoryRouter>
  );
  return viewContext;
}

describe("ForgotPassword", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("submits the email step and advances to the code-entry step", async () => {
    Axios.mockResolvedValue({ data: { message: "sent" } });
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("Enter your email"), "student@example.com");
    await user.click(screen.getByRole("button", { name: /send verification code/i }));

    await waitFor(() => {
      expect(Axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "/api/user/forgot-password",
          method: "POST",
          data: { email: "student@example.com" },
        })
      );
    });

    expect(await screen.findByPlaceholderText("Enter 6-digit code")).toBeInTheDocument();
  });

  it("shows an inline error and stays on the code step when the code is rejected", async () => {
    Axios.mockResolvedValueOnce({ data: { message: "sent" } }); // forgot-password
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("Enter your email"), "student@example.com");
    await user.click(screen.getByRole("button", { name: /send verification code/i }));
    await screen.findByPlaceholderText("Enter 6-digit code");

    Axios.mockRejectedValueOnce({
      response: { data: { message: "Invalid or expired verification code" } },
    });

    await user.type(screen.getByPlaceholderText("Enter 6-digit code"), "000000");
    await user.click(screen.getByRole("button", { name: /verify code/i }));

    expect(
      await screen.findByText("Invalid or expired verification code")
    ).toBeInTheDocument();
    // Still on the code step - password fields must not be reachable yet.
    expect(screen.queryByPlaceholderText("Enter your new password")).not.toBeInTheDocument();
  });

  it("disables the resend button during the cooldown after a code is sent", async () => {
    Axios.mockResolvedValue({ data: { message: "sent" } });
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("Enter your email"), "student@example.com");
    await user.click(screen.getByRole("button", { name: /send verification code/i }));
    await screen.findByPlaceholderText("Enter 6-digit code");

    expect(screen.getByRole("button", { name: /resend code \(60s\)/i })).toBeDisabled();
  });
});
