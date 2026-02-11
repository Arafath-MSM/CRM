from channels.generic.websocket import AsyncJsonWebsocketConsumer


class InboxConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        return

    async def receive_json(self, content, **kwargs):
        # Placeholder for realtime inbox events
        await self.send_json({'ok': True, 'echo': content})