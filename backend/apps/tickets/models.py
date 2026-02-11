from django.db import models


class Ticket(models.Model):
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=50, default='open')
    created_at = models.DateTimeField(auto_now_add=True)