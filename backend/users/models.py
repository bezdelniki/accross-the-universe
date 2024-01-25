from django.db import models
from django.contrib.auth.models import User

class Score(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,  related_name='score')
    score = models.IntegerField(default = 0)

    def __str__(self):
        return str(self.score)