const favoriteModel = require('../models/Favorite');
const feedbackModel = require('../models/Feedback');

async function fetchUserData() {
    try {
        const favorites = await favoriteModel.get();
        const feedbacks = await feedbackModel.get();
        return { favorites, feedbacks };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

function buildSeparateMatrices(favorites, feedbacks) {
    try {
        let favoriteMatrix = {};
        let ratingMatrix = {};
        let courseRatings = {};

        feedbacks.forEach(fb => {
            const userId = fb.userId._id.toString();
            const courseId = fb.courseId._id.toString();

            if (!ratingMatrix[userId]) {
                ratingMatrix[userId] = {};
            }
            ratingMatrix[userId][courseId] = fb.rating; 

            if (!courseRatings[courseId]) {
                courseRatings[courseId] = [];
            }
            courseRatings[courseId].push(fb.rating);
        });

        favorites.forEach(fav => {
            const userId = fav.userId._id.toString();
            const courseId = fav.courseId._id.toString();

            if (!favoriteMatrix[userId]) {
                favoriteMatrix[userId] = {};
            }
            favoriteMatrix[userId][courseId] = 1;
        });

        return { favoriteMatrix, ratingMatrix, courseRatings };
    } catch (error) {
        console.error('Error building data:', error);
        throw error;
    }
}

function cosineSimilarity(matrix1, matrix2) {
    let dotProduct = 0;
    let normMatrix1 = 0;
    let normMatrix2 = 0;

    for (const courseId in matrix1) {
        if (matrix2[courseId]) {
            dotProduct += matrix1[courseId] * matrix2[courseId];
            normMatrix1 += matrix1[courseId] ** 2;
            normMatrix2 += matrix2[courseId] ** 2;
        }
    }

    normMatrix1 = Math.sqrt(normMatrix1);
    normMatrix2 = Math.sqrt(normMatrix2);

    if (normMatrix1 > 0 && normMatrix2 > 0) {
        return dotProduct / (normMatrix1 * normMatrix2);
    } else {
        return 0;
    }
}

async function recommendCourses(userId) {
    try {
        const { favorites, feedbacks } = await fetchUserData();
        const { favoriteMatrix, ratingMatrix } = buildSeparateMatrices(favorites, feedbacks);

        const userRatings = ratingMatrix[userId] || {};
        const userFavorites = favoriteMatrix[userId] || {};
        let similarityScores = {};

        // Compute similarity scores between the user and all other users
        Object.keys(ratingMatrix).forEach(otherUserId => {
            if (otherUserId !== userId) {
                const otherUserRatings = ratingMatrix[otherUserId] || {};
                const ratingSimilarity = cosineSimilarity(userRatings, otherUserRatings);

                const otherUserFavorites = favoriteMatrix[otherUserId] || {};
                const favoriteSimilarity = cosineSimilarity(userFavorites, otherUserFavorites);

                const combinedSimilarity = (ratingSimilarity + favoriteSimilarity) / 2;
                similarityScores[otherUserId] = combinedSimilarity;
            }
        });

        const sortedSimilarUsers = Object.keys(similarityScores).sort((a, b) => similarityScores[b] - similarityScores[a]);
        let recommendedCourses = {};

        sortedSimilarUsers.forEach(similarUserId => {
            Object.keys(ratingMatrix[similarUserId] || {}).forEach(courseId => {
                if (!(courseId in userRatings)) {
                    if (!recommendedCourses[courseId]) {
                        recommendedCourses[courseId] = { score: 0, count: 0 };
                    }
                    recommendedCourses[courseId].score += similarityScores[similarUserId] * ratingMatrix[similarUserId][courseId];

                    const isFavorite = favoriteMatrix[similarUserId] && favoriteMatrix[similarUserId][courseId] ? 1 : 0;
                    recommendedCourses[courseId].count += similarityScores[similarUserId] * (isFavorite ? 1.1 : 1);
                }
            });
        });

        Object.keys(recommendedCourses).forEach(courseId => {
            if (recommendedCourses[courseId].count > 0) {
                recommendedCourses[courseId] = recommendedCourses[courseId].score / recommendedCourses[courseId].count;
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
}