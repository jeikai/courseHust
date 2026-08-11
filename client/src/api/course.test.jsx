import { describe, it, expect, vi, beforeEach } from "vitest";
import dayjs from "dayjs";
import Axios from "axios";
import { handleCreateSchedule } from "./course";

vi.mock("axios");

describe("handleCreateSchedule", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const baseForm = {
    title: "Weekly lecture",
    description: "Intro",
    dayOfWeek: "Monday",
    startTime: dayjs("2026-01-01T09:00:00"),
    endTime: dayjs("2026-01-01T10:00:00"),
    deadline: [dayjs("2026-01-05"), dayjs("2026-06-01")],
    urlMeet: "https://meet.example.com/abc",
    userId: "user-1",
    courseId: "course-1",
  };

  it("returns the created schedule from the server response instead of discarding it", async () => {
    const created = { _id: "cal-1", title: "Weekly lecture" };
    Axios.mockResolvedValue({
      data: { message: "Create schedule successfully", data: created },
    });

    const result = await handleCreateSchedule(baseForm);

    expect(result.error).toBe(false);
    expect(result.data).toEqual(created);
    expect(result.message).toBe("Create schedule successfully");
  });

  it("sends ISO date strings for day_start/day_end (no raw local-timezone toString())", async () => {
    Axios.mockResolvedValue({ data: { message: "ok", data: {} } });

    await handleCreateSchedule(baseForm);

    const payload = Axios.mock.calls[0][0];
    expect(payload.url).toBe("/api/calendar");
    expect(payload.method).toBe("POST");
    expect(() => new Date(payload.data.day_start).toISOString()).not.toThrow();
    expect(payload.data.day_start).toBe(baseForm.deadline[0].toDate().toISOString());
    expect(payload.data.day_end).toBe(baseForm.deadline[1].toDate().toISOString());
  });

  it("surfaces the real backend error message on failure instead of a generic one", async () => {
    Axios.mockRejectedValue({
      response: { data: { message: "An identical schedule already exists for this course" } },
      message: "Request failed with status code 409",
    });

    const result = await handleCreateSchedule(baseForm);

    expect(result.error).toBe(true);
    expect(result.message).toBe("An identical schedule already exists for this course");
  });

  it("maps dayOfWeek labels to the numeric values the backend schema expects", async () => {
    Axios.mockResolvedValue({ data: { message: "ok", data: {} } });

    await handleCreateSchedule({ ...baseForm, dayOfWeek: "Sunday" });
    expect(Axios.mock.calls[0][0].data.dayOfWeek).toBe(0);

    await handleCreateSchedule({ ...baseForm, dayOfWeek: "Saturday" });
    expect(Axios.mock.calls[1][0].data.dayOfWeek).toBe(6);
  });
});
