from rest_framework import serializers
from air_erp_system.models import User, Flight, Options, SeatType, Seat
from air_erp_system.models import Ticket


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class FlightSerializer(serializers.ModelSerializer):
    airplane_model = serializers.CharField(source='airplane.model')
    available_seats = serializers.IntegerField(source='airplane.seat_capacity')

    class Meta:
        model = Flight
        fields = [
            'id',
            'code',
            'departure_place',
            'arrival_place',
            'departure_time',
            'arrival_time',
            'airplane_model',
            'available_seats',
        ]

class OptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Options
        fields = '__all__'

class SeatTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatType
        fields = '__all__'


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'