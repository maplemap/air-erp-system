import os

from django.db.models import Count, Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from air_erp_system.models import Flight, Seat, Ticket, SeatType, Options, Passenger
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
                return Response({"error": "Invalid date format. Expected format: YY/MM/DD"},
                                status=status.HTTP_400_BAD_REQUEST)

        if passengers:
            try:
                passengers = int(passengers)
                if passengers <= 0:
                    raise ValueError("Passengers must be a positive integer")
                filters &= Q(available_seats_count__gte=passengers)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        flights = Flight.objects.filter(filters).select_related('airplane')

        flight_data = []
        for flight in flights:
            economy_seat = SeatType.objects.filter(Q(airplanes=flight.airplane) & Q(seat_type=SeatType.ECONOMY_CLASS)).first()
            economy_price = economy_seat.price if economy_seat else None

            flight_info = {
                "id": flight.id,
                "code": flight.code,
                "departure_place": flight.departure_place,
                "arrival_place": flight.arrival_place,
                "departure_time": flight.departure_time,
                "arrival_time": flight.arrival_time,
                "airplane_model": flight.airplane.model,
                "available_seats": flight.available_seats_count,  # Використовуємо поле
                "economy_class_price": economy_price,
            }
            flight_data.append(flight_info)

        return Response(flight_data, status=status.HTTP_200_OK)

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

        seat_types = SeatType.objects.filter(airplanes=flight.airplane)

        options = Options.objects.all()

        seat_type_data = [
            {
                "seat_type": seat_type.seat_type,
                "price": seat_type.price,
                "available_seats": seat_type.available_seats(flight=flight),
            }
            for seat_type in seat_types
        ]

        option_data = [
            {
                "id": option.id,
                "name": option.name,
                "price": option.price,
                "description": option.description,
            }
            for option in options
        ]

        flight = FlightSerializer(flight)

        data = {
            'flight': flight.data,
            'seat_types': seat_type_data,
            'options': option_data,
        }

        return Response(data, status=status.HTTP_200_OK)

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

class FlightBookingAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        flight_id = request.data.get('flight_id')
        user = request.user
        passengers_data = request.data.get('passengers')

        if not flight_id or not passengers_data:
            return Response(
                {"error": "Missing required parameters: flight_id or passengers"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            flight = Flight.objects.get(id=flight_id)
        except Flight.DoesNotExist:
            return Response({"error": "Flight not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                passengers = []
                total_price = 0

                for passenger_data in passengers_data:
                    seat_type_str = passenger_data.get('seatType')
                    seat_type = SeatType.objects.get(seat_type=seat_type_str)

                    seat = Seat.objects.filter(
                        flight=flight,
                        seat_type=seat_type,
                        is_booked=False
                    ).first()

                    if not seat:
                        raise ValueError(f"No available seats of type {seat_type_str} for this flight")

                    seat.is_booked = True
                    seat.save()

                    seat_price = seat_type.price
                    option_ids = passenger_data.get('options', [])
                    options = Options.objects.filter(id__in=option_ids)
                    options_price = sum(option.price for option in options)

                    total_passenger_price = seat_price + options_price

                    passenger = Passenger.objects.create(
                        first_name=passenger_data['firstName'],
                        last_name=passenger_data['lastName'],
                        gender=passenger_data['gender'],
                        passport_number=passenger_data['passportNumber'],
                        is_paid=False,
                    )

                    passengers.append({
                        "passenger": passenger,
                        "price": total_passenger_price
                    })

                    total_price += total_passenger_price

                flight.update_available_seats()

                passengers_data = [
                    {
                        "id": passenger_data["passenger"].id,
                        "firstName": passenger_data["passenger"].first_name,
                        "lastName": passenger_data["passenger"].last_name,
                        "gender": passenger_data["passenger"].gender,
                        "passportNumber": passenger_data["passenger"].passport_number,
                        "price": passenger_data["price"],
                        "seat_type": seat_type.seat_type,
                        "options": [
                            option.name
                            for option in options
                        ],
                    }
                    for passenger_data in passengers
                ]

                return Response({
                    "passengers": passengers_data,
                    "total_price": total_price
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": f"An error occurred during booking: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class PaymentPassengersAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        passenger_ids = request.data.get('passenger_ids')

        if not passenger_ids:
            return Response(
                {"error": "Missing required parameter: passenger_ids"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                passengers = Passenger.objects.filter(id__in=passenger_ids, is_paid=False)

                if not passengers.exists():
                    return Response(
                        {"error": "No unpaid passengers found with the provided IDs."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

                passengers.update(is_paid=True)

                return Response(
                    {"message": "Payment successful for selected passengers."},
                    status=status.HTTP_200_OK,
                )

        except Exception as e:
            return Response(
                {"error": f"An error occurred during payment processing: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )