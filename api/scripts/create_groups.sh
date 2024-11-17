#!/bin/bash

until python manage.py migrate; do
  echo "Waiting for database to be ready..."
  sleep 2
done

python manage.py shell <<EOF
from django.contrib.auth.models import Group
from air_erp_system.roles import SUPERVISOR, GATE_MANAGER, CHECKIN_MANAGER, CUSTOMER

groups = [SUPERVISOR, GATE_MANAGER, CHECKIN_MANAGER, CUSTOMER]

for group_name in groups:
    group, created = Group.objects.get_or_create(name=group_name)
    if created:
        print(f"Group '{group_name}' created.")
    else:
        print(f"Group '{group_name}' already exists.")
EOF