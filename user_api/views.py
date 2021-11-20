import re
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RegistrationSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password

# Create your views here.
@api_view(['POST'])
def registration_view(request):
    if request.method == 'POST':
        serializer = RegistrationSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            password = serializer.validated_data.get('password')
            serializer.validated_data['password'] = make_password(password)
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            data = serializer.data
            data['token'] = token.key
        else:
            data = serializer.errors
        return Response(data)
            
@api_view(['POST'])
def logout_view(request):
    if request.method == 'POST':
        request.user.auth_token.delete()
        data = {
          'message' : 'logout' 
        }
        return Response(data)