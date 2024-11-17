#!/bin/bash

python manage.py shell <<EOF
from air_erp_system.models import User
from django.contrib.auth.models import Group
import os
from air_erp_system.roles import SUPERVISOR

group_name = 'Supervisor'
supervisor_group, created = Group.objects.get_or_create(name=group_name)
if created:
    print(f"Group '{group_name}' created.")
else:
    print(f"Group '{group_name}' already exists.")

username = os.getenv('SUPERVISOR_USERNAME')
password = os.getenv('SUPERVISOR_PASSWORD')
email = os.getenv('SUPERVISOR_EMAIL')
role = SUPERVISOR

if not User.objects.filter(username=username).exists():
    user = User.objects.create_user(username=username, email=email, password=password)
    user.role = role
    user.groups.add(supervisor_group)
    user.save()
    print(f"User '{username}' with role '{role}' created!")
else:
    print(f"User '{username}' already exists.")
EOF

exec "$@"