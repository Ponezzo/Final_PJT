from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=200)
    overview = models.TextField()
    release_date = models.DateField()
    poster_path = models.URLField()
    vote_average = models.FloatField()
    genres = models.ManyToManyField(Genre, related_name='movies')

    def __str__(self):
        return self.title

class Recommendation(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    algorithm = models.CharField(max_length=100)  # 알고리즘 종류
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recommendation for {self.user.username} - {self.movie.title}"
