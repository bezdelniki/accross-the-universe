from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Score
from .serializers import ScoreSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

class LeaderboardView(generics.ListAPIView):
    queryset = Score.objects.all().order_by('-score')
    serializer_class = ScoreSerializer

class UserScoreView(generics.UpdateAPIView):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        try:
            return Score.objects.get(user=user)
        except Score.DoesNotExist:
            return Score.objects.create(user=user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.score = request.data.get('score', instance.score)
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)