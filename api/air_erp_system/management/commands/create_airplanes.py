import random
from django.core.management.base import BaseCommand
from air_erp_system.models import Airplane, SeatType

class Command(BaseCommand):
    help = "Generate 10 random airplane records"

    def handle(self, *args, **kwargs):
        seat_types = SeatType.objects.all()
        if not seat_types.exists():
            self.stdout.write(self.style.ERROR("No seat types found. Please create seat types first."))
            return

        airplane_models = ["Boeing 747", "Airbus A320", "Embraer E190", "Cessna 208", "Bombardier CRJ900"]

        existing_airplanes = Airplane.objects.filter(model__in=airplane_models)
        if existing_airplanes.exists():
            self.stdout.write(self.style.WARNING("Airplanes with these models already exist. No new records were created."))
            return

        airplanes_created = 0

        for _ in range(10):
            model = random.choice(airplane_models)
            seat_capacity = random.randint(150, 350)

            airplane = Airplane.objects.create(model=model, seat_capacity=seat_capacity)

            # Випадкове додавання типів місць до літака
            for seat_type in seat_types:
                airplane.seat_types.add(seat_type)

            airplanes_created += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully created {airplanes_created} airplane records."))