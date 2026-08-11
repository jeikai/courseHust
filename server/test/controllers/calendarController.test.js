jest.mock('../../models/Calendar');
jest.mock('../../models/Course');

const calendarModel = require('../../models/Calendar');
const courseModel = require('../../models/Course');
const calendarController = require('../../controllers/calendarController');
const { mockReq, mockRes } = require('../helpers/mockExpress');

describe('calendarController.create', () => {
  const courseId = 'course-1';
  const teacherId = 'teacher-1';

  const validBody = {
    courseId,
    instructorId: teacherId,
    userRole: 'teacher',
    title: 'Weekly lecture',
    description: 'Intro',
    dayOfWeek: 1,
    time_start: '09:00:00',
    time_end: '10:00:00',
    day_start: '2026-01-05T00:00:00.000Z',
    day_end: '2026-06-01T00:00:00.000Z',
  };

  beforeEach(() => {
    courseModel.getRaw.mockResolvedValue({ instructorId: { toString: () => teacherId } });
    calendarModel.findDuplicate.mockResolvedValue(null);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates a schedule and returns 201 with the created object (not null)', async () => {
    const created = { _id: 'cal-1', ...validBody };
    calendarModel.create.mockResolvedValue(created);
    const req = mockReq({ body: { ...validBody } });
    const res = mockRes();

    await calendarController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ data: created })
    );
    expect(res.body.data).not.toBeNull();
  });

  it('rejects a request missing a required field', async () => {
    const req = mockReq({ body: { ...validBody, title: undefined } });
    const res = mockRes();

    await calendarController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(calendarModel.create).not.toHaveBeenCalled();
  });

  it('returns 404 when the course does not exist', async () => {
    courseModel.getRaw.mockResolvedValue(null);
    const req = mockReq({ body: { ...validBody } });
    const res = mockRes();

    await calendarController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 403 when a teacher tries to schedule a course they do not own', async () => {
    courseModel.getRaw.mockResolvedValue({ instructorId: { toString: () => 'someone-else' } });
    const req = mockReq({ body: { ...validBody } });
    const res = mockRes();

    await calendarController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(calendarModel.create).not.toHaveBeenCalled();
  });

  it('allows an admin to schedule any course', async () => {
    courseModel.getRaw.mockResolvedValue({ instructorId: { toString: () => 'someone-else' } });
    calendarModel.create.mockResolvedValue({ _id: 'cal-1', ...validBody });
    const req = mockReq({ body: { ...validBody, instructorId: 'admin-1', userRole: 'admin' } });
    const res = mockRes();

    await calendarController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('rejects when start time is not before end time', async () => {
    const req = mockReq({ body: { ...validBody, time_start: '10:00:00', time_end: '09:00:00' } });
    const res = mockRes();

    await calendarController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(calendarModel.create).not.toHaveBeenCalled();
  });

  it('rejects an invalid date range', async () => {
    const req = mockReq({ body: { ...validBody, day_start: 'not-a-date' } });
    const res = mockRes();

    await calendarController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects when start date is after end date', async () => {
    const req = mockReq({
      body: { ...validBody, day_start: '2026-06-01T00:00:00.000Z', day_end: '2026-01-05T00:00:00.000Z' },
    });
    const res = mockRes();

    await calendarController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects an exact duplicate schedule (same course/day/time)', async () => {
    calendarModel.findDuplicate.mockResolvedValue({ _id: 'existing' });
    const req = mockReq({ body: { ...validBody } });
    const res = mockRes();

    await calendarController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(calendarModel.create).not.toHaveBeenCalled();
  });

  it('surfaces the real model error message instead of an unusable {} body', async () => {
    calendarModel.create.mockResolvedValue({ error: new Error('Cast to date failed') });
    const req = mockReq({ body: { ...validBody } });
    const res = mockRes();

    await calendarController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body.message).toBe('Cast to date failed');
  });
});
