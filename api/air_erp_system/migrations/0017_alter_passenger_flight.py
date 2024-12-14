# Generated by Django 4.2.16 on 2024-12-14 14:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("air_erp_system", "0016_passenger_flight"),
    ]

    operations = [
        migrations.AlterField(
            model_name="passenger",
            name="flight",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="passengers",
                to="air_erp_system.flight",
            ),
        ),
    ]