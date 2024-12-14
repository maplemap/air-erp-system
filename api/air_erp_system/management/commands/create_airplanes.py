import random
from django.core.management.base import BaseCommand
from air_erp_system.models import Airplane, SeatType, Seat, Flight
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = "Generate 10 random airplane records, their flights-table, and seats"

    def handle(self, *args, **kwargs):
        seat_types = SeatType.objects.all()
        if not seat_types.exists():
            self.stdout.write(self.style.ERROR("No seat types found. Please create seat types first."))
            return

        airplane_models = ["Boeing 747", "Airbus A320", "Embraer E190", "Cessna 208", "Bombardier CRJ900"]

        airplanes_created = 0

        for _ in range(10):
            model = random.choice(airplane_models)

            if Airplane.objects.filter(model=model).exists():
                self.stdout.write(self.style.WARNING(f"Airplane with model '{model}' already exists. Skipping."))
                continue

            seat_capacity = random.randint(150, 350)

            airplane = Airplane.objects.create(model=model, seat_capacity=seat_capacity)

            airplane.seat_types.set(seat_types)

            self.generate_flights_and_seats(airplane, seat_types)
            airplanes_created += 1

        self.stdout.write(self.style.SUCCESS(f"Total seats: {Seat.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Flights: {Flight.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Airplanes: {Airplane.objects.count()}"))
        self.stdout.write(self.style.SUCCESS(f"Successfully created {airplanes_created} airplane records."))

    def generate_flights_and_seats(self, airplane, seat_types):
        flight_created = 0
        destinations = [
            ("New York", "Los Angeles"),
            ("London", "Paris"),
            ("Tokyo", "Seoul"),
            ("Sydney", "Melbourne"),
            ("Dubai", "Mumbai"),
        ]

        for i in range(10):
            departure_place, arrival_place = random.choice(destinations)

            departure_time = datetime.now() + timedelta(days=random.randint(1, 30))
            arrival_time = departure_time + timedelta(hours=random.randint(2, 12))

            code = f"FL{airplane.id}{i}{random.randint(0, 99)}"

            flight = Flight.objects.create(
                code=code,
                departure_place=departure_place,
                arrival_place=arrival_place,
                departure_time=departure_time,
                arrival_time=arrival_time,
                airplane=airplane,
            )
            self.generate_seats_for_flight(flight, seat_types)

        self.stdout.write(self.style.SUCCESS(f"Generated {flight_created} flights-table for airplane: {airplane.model}"))

    def generate_seats_for_flight(self, flight, seat_types):
        seat_number = 1
        for seat_type in seat_types:
            for _ in range(seat_type.quantity):
                seat = Seat.objects.create(
                    airplane=flight.airplane,
                    flight=flight,
                    seat_type=seat_type,
                    seat_number=seat_number,
                )
                seat_number += 1
        self.stdout.write(self.style.SUCCESS(f"Generated seats for flight: {flight.code}"))