from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.conf import settings
import requests
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer, RegisterSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)

        user_data = {
            k: v for k, v in request.data.items()
            if k in ['first_name', 'last_name', 'email']
        }
        if user_data:
            user_serializer = UserSerializer(user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()

        profile_data = {
            k: v for k, v in request.data.items()
            if k in [
                'bio', 'avatar', 'weight_kg', 'target_weight_kg',
                'height_cm', 'gender', 'fitness_goal', 'activity_level',
                'preferred_units', 'theme_mode'
            ]
        }
        if profile_data:
            profile_serializer = UserProfileSerializer(profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()

        return Response(UserSerializer(user).data)


class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(current_password):
            return Response({'current_password': 'Wrong current password.'}, status=status.HTTP_400_BAD_REQUEST)

        if not new_password or len(new_password) < 6:
            return Response({'new_password': 'Password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully.'})


class DemoAuthView(APIView):
    """Allows instant login as demo user for testing/showcase"""
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        demo_user, _ = User.objects.get_or_create(
            username='demo',
            defaults={
                'email': 'demo@webryxon.com',
                'first_name': 'Alex',
                'last_name': 'Rivers'
            }
        )
        refresh = RefreshToken.for_user(demo_user)
        return Response({
            'user': UserSerializer(demo_user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class GoogleAuthView(APIView):
    """
    Authenticates or registers a user via Google OAuth (Google Identity Services / credential JWT).
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        credential = request.data.get('credential')
        email = request.data.get('email')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        avatar = request.data.get('avatar', '')

        google_user_info = None

        if credential:
            # If a simulated test credential is provided in DEBUG mode
            if settings.DEBUG and credential.startswith('demo-google-'):
                google_user_info = {
                    'email': email or 'google.athlete@webryxon.com',
                    'given_name': first_name or 'Google',
                    'family_name': last_name or 'Athlete',
                    'picture': avatar or '',
                    'email_verified': True,
                }
            else:
                # Validate live credential with Google tokeninfo endpoint
                try:
                    resp = requests.get(
                        f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}",
                        timeout=8
                    )
                    if resp.status_code == 200:
                        google_user_info = resp.json()
                    else:
                        return Response(
                            {'detail': 'Invalid Google ID token.'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except Exception as e:
                    return Response(
                        {'detail': f'Failed to communicate with Google: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
        elif settings.DEBUG and email:
            # Direct development fallback
            google_user_info = {
                'email': email,
                'given_name': first_name or 'Google',
                'family_name': last_name or 'User',
                'picture': avatar or '',
                'email_verified': True,
            }
        else:
            return Response(
                {'detail': 'Google credential token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not google_user_info or not google_user_info.get('email'):
            return Response(
                {'detail': 'Google account email could not be verified.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_email = google_user_info['email'].lower()
        g_first_name = google_user_info.get('given_name') or google_user_info.get('name', '').split(' ')[0] or 'Google'
        g_last_name = google_user_info.get('family_name') or (' '.join(google_user_info.get('name', '').split(' ')[1:]) if ' ' in google_user_info.get('name', '') else '')
        g_avatar = google_user_info.get('picture', '')

        user = User.objects.filter(email=user_email).first()

        if not user:
            base_username = user_email.split('@')[0].replace('.', '_').replace('-', '_')
            username = base_username
            suffix = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{suffix}"
                suffix += 1

            user = User.objects.create_user(
                username=username,
                email=user_email,
                first_name=g_first_name,
                last_name=g_last_name,
            )
            user.set_unusable_password()
            user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        if g_avatar and not profile.avatar:
            profile.avatar = g_avatar
            profile.save(update_fields=['avatar'])

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
