import random
from datetime import datetime, timedelta

from django.core.management.base import BaseCommand
from air_erp_system.models import Flight, Airplane


class Command(BaseCommand):
    help = "Generate up to 50 flight records, avoiding duplicates"

    def handle(self, *args, **kwargs):
        airplanes = Airplane.objects.all()
        if not airplanes.exists():
            self.stdout.write(self.style.ERROR("No airplanes found. Please create airplanes first."))
            return

        destinations = [
            ("New York", "Los Angeles"),
            ("London", "Paris"),
            ("Tokyo", "Seoul"),
            ("Sydney", "Melbourne"),
            ("Dubai", "Mumbai"),
        ]

        existing_flights = Flight.objects.count()
        if existing_flights >= 50:
            self.stdout.write(self.style.WARNING("50 or more flights already exist. No new flights created."))
            return

        flights_to_create = 50 - existing_flights
        flights_created = 0

        for flight_num in range(existing_flights + 1, existing_flights + flights_to_create + 1):
            departure_place, arrival_place = random.choice(destinations)

            airplane = random.choice(airplanes)

            departure_time = datetime.now() + timedelta(days=random.randint(1, 30))
            arrival_time = departure_time + timedelta(hours=random.randint(2, 12))

            flight_code = f"FL-{flight_num:04d}"

            Flight.objects.create(
                code=flight_code,
                departure_place=departure_place,
                arrival_place=arrival_place,
                departure_time=departure_time,
                arrival_time=arrival_time,
                airplane=airplane,
            )
            flights_created += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully created {flights_created} new flight records."))