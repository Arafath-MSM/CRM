from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from .models import Ticket
from .serializers import TicketSerializer


class TicketViewSet(ModelViewSet):
    queryset = Ticket.objects.all().order_by("-created_at")
    serializer_class = TicketSerializer
    permission_classes = [AllowAny]
