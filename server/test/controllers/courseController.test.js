jest.mock('../../models/Course');

const courseModel = require('../../models/Course');
const courseController = require('../../controllers/courseController');
const { mockReq, mockRes } = require('../helpers/mockExpress');

describe('courseController.update', () => {
  const courseId = 'course-1';
  const ownerId = 'teacher-1';
  const otherTeacherId = 'teacher-2';

  afterEach(() => jest.clearAllMocks());

  it('returns 404 when the course does not exist', async () => {
    courseModel.getRaw.mockResolvedValue(null);
    const req = mockReq({ params: { courseId }, body: { instructorId: ownerId, userRole: 'teacher' } });
    const res = mockRes();

    await courseController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 403 when a teacher does not own the course', async () => {
    courseModel.getRaw.mockResolvedValue({ instructorId: { toString: () => ownerId } });
    const req = mockReq({
      params: { courseId },
      body: { instructorId: otherTeacherId, userRole: 'teacher', title: 'Hacked title' },
    });
    const res = mockRes();

    await courseController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(courseModel.update).not.toHaveBeenCalled();
  });

  it('allows an admin to update any course', async () => {
    courseModel.getRaw.mockResolvedValue({ instructorId: { toString: () => ownerId } });
    courseModel.update.mockResolvedValue({ _id: courseId, title: 'Updated title' });
    const req = mockReq({
      params: { courseId },
      body: { instructorId: 'admin-1', userRole: 'admin', title: 'Updated title' },
    });
    const res = mockRes();

    await courseController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(courseModel.update).toHaveBeenCalledWith(
      courseId,
      expect.objectContaining({ title: 'Updated title' })
    );
  });

  it('allows the owning teacher to update their own course', async () => {
    courseModel.getRaw.mockResolvedValue({ instructorId: { toString: () => ownerId } });
    courseModel.update.mockResolvedValue({ _id: courseId, title: 'Updated title' });
    const req = mockReq({
      params: { courseId },
      body: { instructorId: ownerId, userRole: 'teacher', title: 'Updated title' },
    });
    const res = mockRes();

    await courseController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('only forwards whitelisted fields to the model, dropping unknown/stray keys', async () => {
    courseModel.getRaw.mockResolvedValue({ instructorId: { toString: () => ownerId } });
    courseModel.update.mockResolvedValue({ _id: courseId });
    const req = mockReq({
      params: { courseId },
      body: {
        instructorId: ownerId,
        userRole: 'teacher',
        title: 'Kept',
        category: 'Should be dropped (wrong field name)',
        userRole_injected: 'nope',
      },
    });
    const res = mockRes();

    await courseController.update(req, res);

    const forwarded = courseModel.update.mock.calls[0][1];
    expect(forwarded.title).toBe('Kept');
    expect(forwarded.category).toBeUndefined();
  });

  it('does not overwrite fields the client omitted (partial update preserves the rest)', async () => {
    courseModel.getRaw.mockResolvedValue({ instructorId: { toString: () => ownerId } });
    courseModel.update.mockResolvedValue({ _id: courseId });
    const req = mockReq({
      params: { courseId },
      body: { instructorId: ownerId, userRole: 'teacher', title: 'Only title changes' },
    });
    const res = mockRes();

    await courseController.update(req, res);

    const forwarded = courseModel.update.mock.calls[0][1];
    expect(forwarded).not.toHaveProperty('description');
    expect(forwarded).not.toHaveProperty('thumbnail');
  });

  it('surfaces a model error as a 400/500 instead of returning null', async () => {
    courseModel.getRaw.mockResolvedValue({ instructorId: { toString: () => ownerId } });
    courseModel.update.mockResolvedValue({ error: new Error('Course not found') });
    const req = mockReq({
      params: { courseId },
      body: { instructorId: ownerId, userRole: 'teacher', title: 'x' },
    });
    const res = mockRes();

    await courseController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });
});
