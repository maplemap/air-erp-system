import os

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from air_erp_system.models import Flight
from air_erp_system.serializers import UserSerializer
from air_erp_system.custom_token import CustomRefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import get_user_model
from dateutil.parser import parse as parse_datetime


class AuthSignUpViewAPI(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            custom_refresh_token = CustomRefreshToken(user)
            new_access_token = str(custom_refresh_token.access_token)

            return Response({
                "access": new_access_token,
                "refresh": str(custom_refresh_token),
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthSignInViewAPI(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = CustomRefreshToken(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class AuthLogoutViewAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            response = Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
            return response

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AuthRefreshTokenView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')

        if refresh_token is None:
            return Response({'detail': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            user_id = refresh.payload.get('user_id')

            User = get_user_model()
            user = User.objects.get(id=user_id)

            new_access_token = str(refresh.access_token)
            return Response({'access': new_access_token}, status=status.HTTP_200_OK)

        except TokenError:
            return Response({'detail': 'Invalid or expired refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class FlightSearchAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        destination = request.query_params.get('destination')
        date = request.query_params.get('date')
        passengers = request.query_params.get('passengers')

        if not destination or not date or not passengers:
            return Response(
                {"error": "Missing required parameters: destination, date, passengers"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            date = parse_datetime(date).date()
            if not date:
                raise ValueError("Invalid date format")
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            passengers = int(passengers)
            if passengers <= 0:
                raise ValueError("Passengers must be a positive integer")
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        flights = Flight.objects.filter(
            arrival_place__icontains=destination,
            departure_time__date=date,
            airplane__seat_capacity__gte=passengers,
        ).select_related('airplane')

        print(f"Destination: {destination}")
        print(f"Date: {date}")
        print(f"Passengers: {passengers}")
        print(f"Query: {flights.query}")
        print(f"Data in DB: {Flight.objects.all().values()}")

        results = [
            {
                "code": flight.code,
                "departure_place": flight.departure_place,
                "arrival_place": flight.arrival_place,
                "departure_time": flight.departure_time,
                "arrival_time": flight.arrival_time,
                "airplane_model": flight.airplane.model,
                "available_seats": flight.airplane.seat_capacity,
            }
            for flight in flights
        ]

        return Response(results, status=status.HTTP_200_OK)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }

        return Response(user_data, status=200)