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

        const allUserIds = Object.keys(favoriteMatrix);
        const allCourseIds = Array.from(new Set([].concat(...Object.values(favoriteMatrix).map(obj => Object.keys(obj)))));

        allUserIds.forEach(userId => {
            let randomCourseId;
            do {
                randomCourseId = allCourseIds[Math.floor(Math.random() * allCourseIds.length)];
            } while (favoriteMatrix[userId][randomCourseId]); 

            favoriteMatrix[userId][randomCourseId] = 1; 

            if (courseRatings[randomCourseId] && courseRatings[randomCourseId].length > 0) {
                const randomRating = courseRatings[randomCourseId][Math.floor(Math.random() * courseRatings[randomCourseId].length)];
                if (!ratingMatrix[userId][randomCourseId]) {
                    ratingMatrix[userId][randomCourseId] = randomRating; 
                } else {
                    let newCourseId;
                    do {
                        newCourseId = allCourseIds[Math.floor(Math.random() * allCourseIds.length)];
                    } while (ratingMatrix[userId][newCourseId]);

                    ratingMatrix[userId][newCourseId] = randomRating; 
                }
            }
        });

        return { favoriteMatrix, ratingMatrix, courseRatings };
    } catch (error) {
        console.error('Error building data:', error);
        throw error;
    }
}

function cosineSimilarity(ratings1, ratings2) {
    let dotProduct = 0;
    let normRatings1 = 0;
    let normRatings2 = 0;

    // Iterate over the ratings of the first user
    for (const courseId in ratings1) {
        if (ratings2[courseId]) {
            // Calculate the dot product
            dotProduct += ratings1[courseId] * ratings2[courseId];
            // Calculate the norm for each user
            normRatings1 += ratings1[courseId] ** 2;
            normRatings2 += ratings2[courseId] ** 2;
        }
    }

    normRatings1 = Math.sqrt(normRatings1);
    normRatings2 = Math.sqrt(normRatings2);

    // Avoid division by zero
    if (normRatings1 > 0 && normRatings2 > 0) {
        return dotProduct / (normRatings1 * normRatings2);
    } else {
        return 0;
    }
}

async function recommendCourses(userId) {
    try {
        const { favorites, feedbacks } = await fetchUserData();
        const { favoriteMatrix, ratingMatrix } = buildSeparateMatrices(favorites, feedbacks);

        const userRatings = ratingMatrix[userId];
        const userFavorites = favoriteMatrix[userId] || {};
        let similarityScores = {};

        // Compute similarity scores between the user and all other users
        Object.keys(ratingMatrix).forEach(otherUserId => {
            if (otherUserId !== userId) {
                const otherUserRatings = ratingMatrix[otherUserId];
                const similarity = cosineSimilarity(userRatings, otherUserRatings);
                similarityScores[otherUserId] = similarity;
            }
        });

        // Sort users by similarity score in descending order
        const sortedSimilarUsers = Object.keys(similarityScores).sort((a, b) => similarityScores[b] - similarityScores[a]);
        let recommendedCourses = {};

        sortedSimilarUsers.forEach(similarUserId => {
            Object.keys(ratingMatrix[similarUserId]).forEach(courseId => {
                if (!(courseId in userRatings)) { // Only recommend courses not already rated by the user
                    if (!recommendedCourses[courseId]) {
                        recommendedCourses[courseId] = { score: 0, count: 0 };
                    }
                    // Weight recommendation by similarity score
                    recommendedCourses[courseId].score += similarityScores[similarUserId] * ratingMatrix[similarUserId][courseId];

                    // Check if the course is a favorite of the similar user
                    const isFavorite = favoriteMatrix[similarUserId] && favoriteMatrix[similarUserId][courseId] ? 1 : 0;
                    recommendedCourses[courseId].count += similarityScores[similarUserId] * (isFavorite ? 1.1 : 1);
                }
            });
        });

        // Normalize the score by the count to get an average weighted score
        Object.keys(recommendedCourses).forEach(courseId => {
            if (recommendedCourses[courseId].count > 0) { // Ensure there is at least one contribution to the score
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
