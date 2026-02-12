from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from .models import Contact
from .serializers import ContactSerializer


class ContactViewSet(ModelViewSet):
    queryset = Contact.objects.all().order_by("id")
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]
