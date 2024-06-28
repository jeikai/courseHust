const favoriteModel = require('../models/Favorite');
const feedbackModel = require('../models/Feedback');
const courseModel = require('../models/Course');
const natural = require('natural');

async function fetchUserData(userId) {
    try {
        const favorites = await favoriteModel.get(userId);
        const feedbacks = await feedbackModel.get(userId);
        return { favorites, feedbacks };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

async function fetchCourseData() {
    try {
        const courses = await courseModel.get();
        return courses;
    } catch (error) {
        console.error('Error fetching course data:', error);
        throw error;
    }
}

function buildFeatureVectors(courses) {
    const tokenizer = new natural.WordTokenizer();
    const tfidf = new natural.TfIdf();

    courses.forEach(course => {
        const text = course.title + ' ' + course.description + ' ' + (course.tags || []).join(' ');
        tfidf.addDocument(text);
    });

    const courseVectors = courses.map((course, index) => {
        const text = course.title + ' ' + course.description + ' ' + (course.tags || []).join(' ');
        const vector = [];
        tfidf.tfidfs(text, (i, measure) => {
            vector.push(measure);
        });
        return { course, vector };
    });

    return courseVectors;
}

function cosineSimilarity(vector1, vector2) {
    let dotProduct = 0;
    let normVector1 = 0;
    let normVector2 = 0;

    for (let i = 0; i < vector1.length; i++) {
        dotProduct += vector1[i] * vector2[i];
        normVector1 += vector1[i] ** 2;
        normVector2 += vector2[i] ** 2;
    }

    normVector1 = Math.sqrt(normVector1);
    normVector2 = Math.sqrt(normVector2);

    if (normVector1 > 0 && normVector2 > 0) {
        return dotProduct / (normVector1 * normVector2);
    } else {
        return 0;
    }
}

async function recommendCourses(userId) {
    try {
        const { favorites, feedbacks } = await fetchUserData(userId);
        const courses = await fetchCourseData();
        const courseVectors = buildFeatureVectors(courses);

        const userCourses = [...favorites.map(fav => fav.courseId.toString()), ...feedbacks.map(fb => fb.courseId.toString())];
        const userCourseVectors = courseVectors.filter(cv => userCourses.includes(cv.course._id.toString()));

        let recommendedCourses = {};

        courseVectors.forEach(cv => {
            if (!userCourses.includes(cv.course._id.toString())) {
                let totalSimilarity = 0;
                userCourseVectors.forEach(ucv => {
                    totalSimilarity += cosineSimilarity(cv.vector, ucv.vector);
                });
                recommendedCourses[cv.course._id.toString()] = totalSimilarity / userCourseVectors.length;
            }
        });

        return recommendedCourses;
    } catch (error) {
        console.error('Error recommending courses:', error);
        throw error;
    }
}

exports.recommend = async function (req, res) {
    try {
        const userId = req.params.userId;
        const recommendations = await recommendCourses(userId);
        res.status(200).json(recommendations);
    } catch (error) {
        console.error('Error in recommend function:', error);
        res.status(500).json({ message: error.message });
    }
};
