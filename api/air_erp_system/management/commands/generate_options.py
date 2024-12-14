from django.core.management.base import BaseCommand
from air_erp_system.models import Options

class Command(BaseCommand):
    help = "Generate default options for flights-table"

    def handle(self, *args, **kwargs):
        options = [
            {"name": "20kg Baggage", "price": 15, "description": "Additional baggage up to 20kg", "category": "baggage"},
            {"name": "Special Vegetarian Meal", "price": 5, "description": "A full vegetarian meal", "category": "meal"},
            {"name": "Access to VIP Lounge", "price": 10, "description": "Access to the airport VIP lounge", "category": "service"},
        ]

        created_count = 0
        for option_data in options:
            option, created = Options.objects.update_or_create(
                name=option_data["name"],
                defaults=option_data
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully created {created_count} new options."))