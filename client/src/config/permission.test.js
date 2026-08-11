import { describe, it, expect } from "vitest";
import permission from "./permission.json";

// Regression test: user.permission (stored from the login response) is the
// raw role string from the backend - 'admin' | 'teacher' | 'student' - not
// 'instructor'. permission.json used to key the teacher row as "instructor",
// which meant permission[user.permission] was always undefined for a real
// teacher account, silently locking every teacher out of any route that
// enabled its permission gate.
describe("permission.json", () => {
  it("has a row for every actual User.role enum value", () => {
    expect(permission).toHaveProperty("admin");
    expect(permission).toHaveProperty("teacher");
    expect(permission).toHaveProperty("student");
  });

  it("does not use the stale 'instructor' role key", () => {
    expect(permission).not.toHaveProperty("instructor");
  });

  it("grants a teacher access to instructor-only pages", () => {
    expect(permission.teacher.instructor).toBe(true);
  });

  it("grants every logged-in role access to student pages", () => {
    expect(permission.admin.student).toBe(true);
    expect(permission.teacher.student).toBe(true);
    expect(permission.student.student).toBe(true);
  });

  it("does not grant a plain student access to instructor-only pages", () => {
    expect(permission.student.instructor).toBe(false);
  });
});
