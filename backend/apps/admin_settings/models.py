from django.db import models


class Setting(models.Model):
    key = models.CharField(max_length=200)
    value = models.TextField(blank=True)