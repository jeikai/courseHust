const mongoose = require('mongoose');
const { schema: Calendar } = require('../../models/Calendar');

describe('Calendar schema', () => {
  const validData = {
    userId: new mongoose.Types.ObjectId(),
    courseId: new mongoose.Types.ObjectId(),
    title: 'Weekly lecture',
    description: 'Intro to algorithms',
    dayOfWeek: 1,
    time_start: '09:00:00',
    time_end: '10:00:00',
    day_start: new Date('2026-01-05'),
    day_end: new Date('2026-06-01'),
  };

  it('accepts a fully populated schedule', () => {
    const doc = new Calendar(validData);
    const err = doc.validateSync();
    expect(err).toBeUndefined();
  });

  it.each([
    'userId', 'courseId', 'title', 'description', 'dayOfWeek',
    'time_start', 'time_end', 'day_start', 'day_end',
  ])('rejects a schedule missing required field "%s"', (field) => {
    const data = { ...validData };
    delete data[field];
    const doc = new Calendar(data);
    const err = doc.validateSync();
    expect(err).toBeDefined();
    expect(err.errors[field]).toBeDefined();
  });

  it('rejects a dayOfWeek outside 0-6', () => {
    const doc = new Calendar({ ...validData, dayOfWeek: 7 });
    const err = doc.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.dayOfWeek).toBeDefined();
  });

  it('rejects an empty-string day_start (would previously CastError silently)', () => {
    const doc = new Calendar({ ...validData, day_start: '' });
    const err = doc.validateSync();
    expect(err).toBeDefined();
  });
});
