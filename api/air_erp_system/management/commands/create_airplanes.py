import random
from django.core.management.base import BaseCommand
from air_erp_system.models import Airplane, SeatType, Seat


class Command(BaseCommand):
    help = "Generate 10 random airplane records and their seats"

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

            # Генеруємо випадкову місткість
            seat_capacity = random.randint(150, 350)

            # Створення літака
            airplane = Airplane.objects.create(model=model, seat_capacity=seat_capacity)

            # Генерація місць для літака
            self.generate_seats(airplane, seat_types)
            airplanes_created += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully created {airplanes_created} airplane records."))

    def generate_seats(self, airplane, seat_types):
        seat_number = 1
        for seat_type in seat_types:
            for _ in range(seat_type.quantity):
                Seat.objects.create(
                    airplane=airplane,
                    seat_type=seat_type,
                    seat_number=seat_number,
                )
                seat_number += 1
        self.stdout.write(self.style.SUCCESS(f"Generated seats for airplane: {airplane.model}"))