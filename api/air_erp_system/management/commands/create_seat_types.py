from django.core.management.base import BaseCommand
from air_erp_system.models import SeatType

class Command(BaseCommand):
    help = "Generate default seat types"

    def handle(self, *args, **kwargs):
        seat_types = [
            {"seat_type": SeatType.FIRST_CLASS, "quantity": 10, "price": 500},
            {"seat_type": SeatType.BUSINESS_CLASS, "quantity": 20, "price": 300},
            {"seat_type": SeatType.ECONOMY_CLASS, "quantity": 100, "price": 100},
        ]

        created_count = 0
        for seat_type_data in seat_types:
            if not SeatType.objects.filter(seat_type=seat_type_data["seat_type"]).exists():
                SeatType.objects.create(**seat_type_data)
                created_count += 1

        if created_count == 0:
            self.stdout.write(self.style.WARNING("All seat types already exist. No new records were created."))
        else:
            self.stdout.write(self.style.SUCCESS(f"Successfully created {created_count} seat types."))