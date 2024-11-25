from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from air_erp_system.roles import SUPERVISOR, GATE_MANAGER, CHECKIN_MANAGER, CUSTOMER

class Command(BaseCommand):
    help = "Initialize user groups for the application"

    def handle(self, *args, **kwargs):
        groups = [SUPERVISOR, GATE_MANAGER, CHECKIN_MANAGER, CUSTOMER]

        for group_name in groups:
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Group '{group_name}' created."))
            else:
                self.stdout.write(self.style.WARNING(f"Group '{group_name}' already exists."))