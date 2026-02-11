from django.db import models


class WebhookEndpoint(models.Model):
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)