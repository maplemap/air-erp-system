import os

from django.db.models import Count, Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from air_erp_system.models import Flight, Seat, Ticket, SeatType, Options
from air_erp_system.serializers import SignUpSerializer, TicketSerializer, FlightSerializer, UserSerializer, SeatTypeSerializer, OptionsSerializer, SeatSerializer
from air_erp_system.custom_token import CustomRefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model
from django.db import transaction
from datetime import datetime


class AuthSignUpViewAPI(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)

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

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        serializer = UserSerializer(user)

        return Response(serializer.data, status=200)

class FlightSearchAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        departure_place = request.query_params.get('departure_place')
        arrival_place = request.query_params.get('arrival_place')
        date = request.query_params.get('date')
        passengers = request.query_params.get('passengers')

        if not departure_place or not arrival_place:
            return Response(
                {"error": "Parameters 'departure_place' and 'arrival_place' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        filters = Q(departure_place__icontains=departure_place) & Q(arrival_place__icontains=arrival_place)

        if date:
            try:
                date = datetime.strptime(date, "%y/%m/%d").date()
                filters &= Q(departure_time__date=date)
            except ValueError:
                return Response({"error": "Invalid date format. Expected format: DD/MM/YY"},
                                status=status.HTTP_400_BAD_REQUEST)

        if passengers:
            try:
                passengers = int(passengers)
                if passengers <= 0:
                    raise ValueError("Passengers must be a positive integer")
                filters &= Q(airplane__seat_capacity__gte=passengers)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        flights = Flight.objects.filter(filters).select_related('airplane')

        serializer = FlightSerializer(flights, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class FlightDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        flight_id = request.query_params.get('flight_id')

        if not flight_id:
            return Response({"error": "Flight ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            flight = Flight.objects.select_related('airplane').get(id=flight_id)
        except Flight.DoesNotExist:
            return Response({"error": "Flight does not exist."}, status=status.HTTP_404_NOT_FOUND)

        seat_types = (
            SeatType.objects.filter(airplanes=flight.airplane)
            .annotate(
                available_seats=Count(
                    'seats',
                    filter=Q(seats__airplane=flight.airplane, seats__is_booked=False)
                )
            )
            .distinct()
        )

        options = Options.objects.all()

        seat_type_data = [
            {
                "seat_type": seat_type.seat_type,
                "price": seat_type.price,
                "available_seats": seat_type.available_seats,
            }
            for seat_type in seat_types
        ]

        option_data = [
            {
                "name": option.name,
                "price": option.price,
                "description": option.description,
            }
            for option in options
        ]

        data = {
            'seat_types': seat_type_data,
            'options': option_data,
        }

        return Response(data, status=status.HTTP_200_OK)

class FlightBookingAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        flight_id = request.data.get('flight_id')
        user = request.user
        ticket_data = request.data.get('ticket_data')  # first_name, last_name, gender, passport_number, options

        if not flight_id or not ticket_data:
            return Response(
                {"error": "Missing required parameters: flight_id or ticket_data"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            flight = Flight.objects.get(id=flight_id)
        except Flight.DoesNotExist:
            return Response({"error": "Flight not found"}, status=status.HTTP_404_NOT_FOUND)

        available_seats = Seat.objects.filter(airplane=flight.airplane, is_booked=False).first()
        if not available_seats:
            return Response({"error": "No available seats for this flight"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                seat = available_seats
                seat.is_booked = True
                seat.save()

                # Створюємо квиток
                ticket = Ticket.objects.create(
                    user=user,
                    flight=flight,
                    seat=seat,
                    first_name=ticket_data['first_name'],
                    last_name=ticket_data['last_name'],
                    gender=ticket_data['gender'],
                    passport_number=ticket_data['passport_number'],
                    price=ticket_data.get('price', 0),  # Розрахунок ціни може бути окремо
                )

                if 'options' in ticket_data:
                    ticket.options.add(*ticket_data['options'])

                ticket.save()

                serializer = TicketSerializer(ticket)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": f"An error occurred during ticket booking: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class FlightDeparturesAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        departures = (
            Flight.objects.values_list('departure_place', flat=True).distinct()
        )

        return Response(sorted(departures), status=status.HTTP_200_OK)

class FlightDestinationsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        departure_place = request.query_params.get('departure_place')

        if not departure_place:
            return Response(
                {"error": "Parameter 'departure_place' is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        destinations = (
            Flight.objects.filter(departure_place=departure_place)
            .values_list('arrival_place', flat=True)
            .distinct()
        )

        return Response(sorted(destinations), status=status.HTTP_200_OK)

class FlightDatesAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        departure_place = request.query_params.get('departure_place')
        arrival_place = request.query_params.get('arrival_place')

        if not departure_place or not arrival_place:
            return Response(
                {"error": "Parameters 'departure_place' and 'arrival_place' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        dates = (
            Flight.objects.filter(departure_place=departure_place, arrival_place=arrival_place)
            .values_list('departure_time', flat=True)
            .distinct()
        )

        return Response(sorted(dates), status=status.HTTP_200_OK)