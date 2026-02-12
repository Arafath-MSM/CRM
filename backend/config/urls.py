from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.contacts.views import ContactViewSet
from apps.inbox.views import ConversationViewSet, MessageViewSet
from apps.tickets.views import TicketViewSet

router = DefaultRouter(trailing_slash=False)
router.register("contacts", ContactViewSet, basename="contact")
router.register("inbox/conversations", ConversationViewSet, basename="conversation")
router.register("inbox/messages", MessageViewSet, basename="message")
router.register("tickets", TicketViewSet, basename="ticket")

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include(router.urls)),
]
