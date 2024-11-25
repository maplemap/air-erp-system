import os
from django.core.management.base import BaseCommand
from air_erp_system.models import User
from django.contrib.auth.models import Group
from air_erp_system.roles import SUPERVISOR, GATE_MANAGER, CHECKIN_MANAGER, CUSTOMER


class Command(BaseCommand):
    help = "Initialize users with predefined roles and credentials"

    def handle(self, *args, **kwargs):
        roles = {
            SUPERVISOR: {
                "username": os.getenv("SUPERVISOR_USERNAME"),
                "password": os.getenv("SUPERVISOR_PASSWORD"),
                "email": os.getenv("SUPERVISOR_EMAIL"),
            },
            GATE_MANAGER: {
                "username": os.getenv("GATE_MANAGER_USERNAME"),
                "password": os.getenv("GATE_MANAGER_PASSWORD"),
                "email": os.getenv("GATE_MANAGER_EMAIL"),
            },
            CHECKIN_MANAGER: {
                "username": os.getenv("CHECKIN_MANAGER_USERNAME"),
                "password": os.getenv("CHECKIN_MANAGER_PASSWORD"),
                "email": os.getenv("CHECKIN_MANAGER_EMAIL"),
            },
            CUSTOMER: {
                "username": os.getenv("CUSTOMER_USERNAME"),
                "password": os.getenv("CUSTOMER_PASSWORD"),
                "email": os.getenv("CUSTOMER_EMAIL"),
            },
        }

        for role, credentials in roles.items():
            username = credentials["username"]
            password = credentials["password"]
            email = credentials["email"]

            if not username or not password or not email:
                self.stdout.write(
                    self.style.ERROR(f"Environment variables for role '{role}' are not fully set. Skipping...")
                )
                continue

            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(username=username, email=email, password=password)
                user.role = role

                group, _ = Group.objects.get_or_create(name=role)
                user.groups.add(group)
                user.save()

                self.stdout.write(self.style.SUCCESS(f"User '{username}' with role '{role}' created!"))
            else:
                self.stdout.write(self.style.WARNING(f"User '{username}' with role '{role}' already exists."))