require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { schema: User } = require('./models/User');
const categoryModel = require('./models/Category');
const subcategoryModel = require('./models/SubCategory');
const courseModel = require('./models/Course');
const sectionModel = require('./models/Section');
const lessonModel = require('./models/Lesson');

async function seedAdmin() {
  const existing = await User.findOne({ email: 'admin@gmail.com' });
  if (existing) {
    console.log('[seed] Admin already exists — skipping');
    return;
  }
  const hashed = await bcrypt.hash('1234567', 10);
  await User.create({
    email: 'admin@gmail.com', password: hashed, name: 'Admin',
    phoneNumber: '', documentUrl: '', role: 'admin',
    is_verified: true, date_created: new Date(), date_updated: new Date(),
  });
  console.log('[seed] Admin created: admin@gmail.com / 1234567');
}

async function seedInstructor() {
  const existing = await User.findOne({ email: 'teacher@gmail.com' });
  if (existing) {
    console.log('[seed] Instructor already exists — skipping');
    return existing;
  }
  const hashed = await bcrypt.hash('1234567', 10);
  const instructor = await User.create({
    email: 'teacher@gmail.com', password: hashed, name: 'Demo Instructor',
    phoneNumber: '', documentUrl: '', role: 'teacher',
    is_verified: true, date_created: new Date(), date_updated: new Date(),
  });
  console.log('[seed] Instructor created: teacher@gmail.com / 1234567');
  return instructor;
}

async function seedCategories() {
  const existing = await categoryModel.get(null);
  if (existing && !existing.error && existing.length > 0) {
    console.log(`[seed] ${existing.length} categories already exist — skipping`);
    return existing;
  }

  const specs = [
    {
      title: 'Programming',
      description: 'Software development, algorithms, and programming languages',
      subs: [
        { title: 'Web Development', description: 'HTML, CSS, JavaScript, and modern web frameworks' },
        { title: 'Mobile Development', description: 'iOS, Android, and cross-platform apps' },
        { title: 'Data Structures & Algorithms', description: 'Core CS concepts and problem solving' },
      ],
    },
    {
      title: 'Design',
      description: 'UI/UX, graphic design, and visual communication',
      subs: [
        { title: 'UI/UX Design', description: 'User interface and experience design principles' },
        { title: 'Graphic Design', description: 'Visual design, typography, and branding' },
      ],
    },
    {
      title: 'Data Science',
      description: 'Data analysis, machine learning, and statistics',
      subs: [
        { title: 'Machine Learning', description: 'Supervised and unsupervised learning algorithms' },
        { title: 'Data Analysis', description: 'Statistical analysis and data visualization' },
      ],
    },
  ];

  const created = [];
  for (const spec of specs) {
    const cat = await categoryModel.create({ title: spec.title, description: spec.description });
    console.log(`[seed] Category: ${cat.title}`);
    for (const sub of spec.subs) {
      await subcategoryModel.create(sub, cat._id);
      console.log(`[seed]   SubCategory: ${sub.title}`);
    }
    created.push(cat);
  }
  return created;
}

async function seedCourses(instructorId) {
  const existing = await courseModel.get(null);
  if (existing && !existing.error && existing.length > 0) {
    console.log(`[seed] ${existing.length} courses already exist — skipping`);
    return;
  }

  const cats = await categoryModel.get(null);
  const progCat = cats.find((c) => c.title === 'Programming');
  const dsCat = cats.find((c) => c.title === 'Data Science');
  if (!progCat || !dsCat) {
    console.log('[seed] Required categories not found — skipping courses');
    return;
  }

  // --- Course 1 ---
  const c1 = await courseModel.create({
    instructorId, title: 'Introduction to Web Development',
    shortDes: 'Learn the fundamentals of modern web development from scratch.',
    description: 'This course covers HTML, CSS, and JavaScript basics. Build real-world projects and gain skills to create responsive, interactive websites. Perfect for beginners.',
    isStream: false, categoryId: progCat._id, level: 'basic', price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
  });
  console.log(`[seed] Course: ${c1.title}`);

  const s1a = await sectionModel.create({ courseId: c1._id.toString(), title: 'Getting Started with HTML' });
  await lessonModel.create({ sectionId: s1a._id.toString(), title: 'What is HTML?', content: 'HTML stands for HyperText Markup Language. It is the standard language for creating web pages.', videoURL: '', docURL: '', duration: 10 });
  await lessonModel.create({ sectionId: s1a._id.toString(), title: 'HTML Document Structure', content: 'Every HTML page starts with <!DOCTYPE html> followed by <html>, <head>, and <body> tags.', videoURL: '', docURL: '', duration: 15 });
  console.log('[seed]   Section: Getting Started with HTML (2 lessons)');

  const s1b = await sectionModel.create({ courseId: c1._id.toString(), title: 'Styling with CSS' });
  await lessonModel.create({ sectionId: s1b._id.toString(), title: 'Introduction to CSS', content: 'CSS (Cascading Style Sheets) controls the visual presentation of HTML elements.', videoURL: '', docURL: '', duration: 12 });
  await lessonModel.create({ sectionId: s1b._id.toString(), title: 'The CSS Box Model', content: 'Every element in CSS is a box consisting of content, padding, border, and margin.', videoURL: '', docURL: '', duration: 18 });
  console.log('[seed]   Section: Styling with CSS (2 lessons)');

  const s1c = await sectionModel.create({ courseId: c1._id.toString(), title: 'JavaScript Basics' });
  await lessonModel.create({ sectionId: s1c._id.toString(), title: 'Variables and Data Types', content: 'JavaScript supports var, let, and const. Data types: string, number, boolean, object, array.', videoURL: '', docURL: '', duration: 20 });
  await lessonModel.create({ sectionId: s1c._id.toString(), title: 'Functions and Scope', content: 'Functions are reusable code blocks. Scope determines where variables are accessible.', videoURL: '', docURL: '', duration: 22 });
  console.log('[seed]   Section: JavaScript Basics (2 lessons)');

  // --- Course 2 ---
  const c2 = await courseModel.create({
    instructorId, title: 'Python for Data Science',
    shortDes: 'Master Python and essential data science libraries.',
    description: 'Start your data science journey with Python. Covers NumPy, Pandas, Matplotlib, and an introduction to machine learning with scikit-learn. Hands-on exercises with real datasets.',
    isStream: false, categoryId: dsCat._id, level: 'intermediate', price: 199000,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
  });
  console.log(`[seed] Course: ${c2.title}`);

  const s2a = await sectionModel.create({ courseId: c2._id.toString(), title: 'Python Fundamentals' });
  await lessonModel.create({ sectionId: s2a._id.toString(), title: 'Python Setup & Environment', content: 'Install Python 3 and set up a virtual environment. Overview of Jupyter Notebooks.', videoURL: '', docURL: '', duration: 15 });
  await lessonModel.create({ sectionId: s2a._id.toString(), title: 'Python Data Structures', content: 'Lists, dictionaries, tuples, and sets — when to use each.', videoURL: '', docURL: '', duration: 25 });
  console.log('[seed]   Section: Python Fundamentals (2 lessons)');

  const s2b = await sectionModel.create({ courseId: c2._id.toString(), title: 'Data Analysis with Pandas' });
  await lessonModel.create({ sectionId: s2b._id.toString(), title: 'DataFrames and Series', content: 'Core Pandas data structures. Loading CSV files and basic operations.', videoURL: '', docURL: '', duration: 30 });
  await lessonModel.create({ sectionId: s2b._id.toString(), title: 'Data Cleaning', content: 'Handling missing values, removing duplicates, and type conversions.', videoURL: '', docURL: '', duration: 28 });
  console.log('[seed]   Section: Data Analysis with Pandas (2 lessons)');

  const s2c = await sectionModel.create({ courseId: c2._id.toString(), title: 'Data Visualization' });
  await lessonModel.create({ sectionId: s2c._id.toString(), title: 'Matplotlib Basics', content: 'Line plots, bar charts, histograms, and scatter plots with Matplotlib.', videoURL: '', docURL: '', duration: 20 });
  console.log('[seed]   Section: Data Visualization (1 lesson)');
}

async function seed() {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/courseHust';
  await mongoose.connect(mongoUrl);
  console.log('[seed] Connected to MongoDB');

  await seedAdmin();
  const instructor = await seedInstructor();
  await seedCategories();
  await seedCourses(instructor._id);

  console.log('[seed] Seed complete.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[seed] Fatal:', err);
  process.exit(1);
});
