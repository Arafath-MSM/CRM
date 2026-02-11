# Backend (Django)

This folder contains the Django backend for the Freshworks-style CRM.

Key modules:
- apps/: domain apps (accounts, inbox, contacts, campaigns, tickets, ai_studio, etc.)
- realtime/: Django Channels websocket consumers
- tasks/: Celery app and background jobs
- common/: shared utilities
- integrations/: channel integrations (WhatsApp, email, SMS, etc.)

Settings are split under config/settings.