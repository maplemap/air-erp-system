# Generated by Django 4.2.16 on 2024-11-25 18:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("air_erp_system", "0004_user_first_name_user_last_name"),
    ]

    operations = [
        migrations.CreateModel(
            name="Airplane",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("model", models.CharField(max_length=100)),
                ("seat_capacity", models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name="Flight",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("code", models.CharField(max_length=10, unique=True)),
                ("departure_place", models.CharField(max_length=100)),
                ("arrival_place", models.CharField(max_length=100)),
                ("departure_time", models.DateTimeField()),
                ("arrival_time", models.DateTimeField()),
                (
                    "airplane",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="flights-table",
                        to="air_erp_system.airplane",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Options",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("price", models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name="Seat",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("is_booked", models.BooleanField(default=False)),
                ("seat_number", models.IntegerField(blank=True, null=True)),
                (
                    "airplane",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="air_erp_system.airplane",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SeatType",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "seat_type",
                    models.CharField(
                        choices=[
                            ("first_class", "First_class"),
                            ("business_class", "Business_class"),
                            ("economy_class", "Economy_class"),
                        ],
                        default="economy_class",
                        max_length=255,
                    ),
                ),
                ("quantity", models.IntegerField(default=0)),
                ("price", models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name="Ticket",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("ticket_number", models.CharField(max_length=10, unique=True)),
                ("first_name", models.CharField(max_length=255)),
                ("last_name", models.CharField(max_length=255)),
                (
                    "gender",
                    models.CharField(
                        choices=[("male", "Male"), ("female", "Female")], max_length=30
                    ),
                ),
                ("passport_number", models.CharField(max_length=25)),
                ("price", models.IntegerField(blank=True, null=True)),
                (
                    "flight",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="air_erp_system.flight",
                    ),
                ),
                (
                    "options",
                    models.ManyToManyField(blank=True, to="air_erp_system.options"),
                ),
                (
                    "seat",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="air_erp_system.seat",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="seat",
            name="seat_type",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="air_erp_system.seattype",
            ),
        ),
        migrations.AddField(
            model_name="airplane",
            name="seat_types",
            field=models.ManyToManyField(
                related_name="airplanes", to="air_erp_system.seattype"
            ),
        ),
    ]
