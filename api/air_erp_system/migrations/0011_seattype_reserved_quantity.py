# Generated by Django 4.2.16 on 2024-12-07 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("air_erp_system", "0010_passenger_remove_ticket_first_name_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="seattype",
            name="reserved_quantity",
            field=models.IntegerField(default=0),
        ),
    ]