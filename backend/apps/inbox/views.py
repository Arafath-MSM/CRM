from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer


class ConversationViewSet(ModelViewSet):
    queryset = Conversation.objects.all().order_by("-created_at")
    serializer_class = ConversationSerializer
    permission_classes = [AllowAny]


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Message.objects.select_related("conversation").all().order_by("created_at")
        conversation_id = self.request.query_params.get("conversation")
        if conversation_id:
            queryset = queryset.filter(conversation_id=conversation_id)
        return queryset
