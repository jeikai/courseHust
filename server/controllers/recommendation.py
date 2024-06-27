import sys
import json
from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS
from pyspark.sql import Row
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

def load_data(rating_data, course_data):
    spark = SparkSession.builder.appName('RecommendationSystem').getOrCreate()
    ratings = spark.createDataFrame([Row(userId=int(r['userId']), courseId=int(r['courseId']), rating=float(r['rating'])) for r in rating_data])
    courses = [Row(courseId=int(c['courseId']), description=c['description']) for c in course_data]
    return spark, ratings, courses

def train_als_model(ratings):
    als = ALS(maxIter=10, regParam=0.1, userCol="userId", itemCol="courseId", ratingCol="rating")
    model = als.fit(ratings)
    return model

def get_als_recommendations(model, user_id):
    userRecs = model.recommendForAllUsers(10).filter(f'userId = {user_id}').collect()
    return userRecs[0].recommendations if userRecs else []

def build_content_matrix(courses):
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform([c.description for c in courses])
    return tfidf_matrix

def get_content_based_recommendations(user_courses, all_courses, tfidf_matrix):
    user_course_indices = [i for i, c in enumerate(all_courses) if c.courseId in user_courses]
    cosine_similarities = linear_kernel(tfidf_matrix[user_course_indices], tfidf_matrix).flatten()
    related_courses_indices = cosine_similarities.argsort()[:-11:-1]
    return [all_courses[i].courseId for i in related_courses_indices if all_courses[i].courseId not in user_courses]

def main():
    user_id = int(sys.argv[1])
    rating_data = json.loads(sys.argv[2])
    course_data = json.loads(sys.argv[3])
    user_courses = json.loads(sys.argv[4])

    spark, ratings, courses = load_data(rating_data, course_data)
    als_model = train_als_model(ratings)

    als_recommendations = get_als_recommendations(als_model, user_id)
    tfidf_matrix = build_content_matrix(courses)
    content_recommendations = get_content_based_recommendations(user_courses, courses, tfidf_matrix)

    recommendations = list(set([rec.courseId for rec in als_recommendations] + content_recommendations))
    print(json.dumps(recommendations))

if __name__ == "__main__":
    main()
