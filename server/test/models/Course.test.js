const mongoose = require('mongoose');
const { schema: Course } = require('../../models/Course');

describe('Course schema', () => {
  const validData = {
    instructorId: new mongoose.Types.ObjectId(),
    title: 'Intro to JavaScript',
    description: '<p>Learn the basics</p>',
    isStream: false,
    categoryId: new mongoose.Types.ObjectId(),
    level: 'basic',
    price: 0,
    thumbnail: 'https://example.com/thumb.png',
  };

  it('accepts a fully populated course', () => {
    const doc = new Course(validData);
    const err = doc.validateSync();
    expect(err).toBeUndefined();
  });

  it.each(['title', 'description', 'isStream', 'thumbnail'])(
    'rejects a course missing required field "%s"',
    (field) => {
      const data = { ...validData };
      delete data[field];
      const doc = new Course(data);
      const err = doc.validateSync();
      expect(err).toBeDefined();
      expect(err.errors[field]).toBeDefined();
    }
  );

  it('rejects an invalid level enum value', () => {
    const doc = new Course({ ...validData, level: 'beginner' });
    const err = doc.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.level).toBeDefined();
  });

  it.each(['basic', 'intermediate', 'advanced', 'specialized'])(
    'accepts valid level "%s"',
    (level) => {
      const doc = new Course({ ...validData, level });
      const err = doc.validateSync();
      expect(err).toBeUndefined();
    }
  );

  it('defaults level to "basic" when omitted', () => {
    const data = { ...validData };
    delete data.level;
    const doc = new Course(data);
    expect(doc.level).toBe('basic');
  });
});
