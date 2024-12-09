from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager, Permission, Group
from django.db import models
from .roles import CUSTOMER, ROLE_CHOICES


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    first_name = models.CharField(max_length=150, default='')
    last_name = models.CharField(max_length=150, default='')
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=CUSTOMER,
    )
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    groups = models.ManyToManyField(Group, related_name='user_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='user_set', blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return str(self.username) if self.username else ''

class SeatType(models.Model):
    FIRST_CLASS = 'first_class'
    BUSINESS_CLASS = 'business_class'
    ECONOMY_CLASS = 'economy_class'

    SEAT_TYPE = (
        (FIRST_CLASS, 'First_class'),
        (BUSINESS_CLASS, 'Business_class'),
        (ECONOMY_CLASS, 'Economy_class'),
    )

    seat_type = models.CharField(max_length=255, choices=SEAT_TYPE, default=ECONOMY_CLASS)
    quantity = models.IntegerField(default=0)  # Загальна кількість місць
    reserved_quantity = models.IntegerField(default=0)  # Зарезервовані місця
    price = models.IntegerField()

    def available_seats(self, flight=None):
        if flight:
            total_seats = Seat.objects.filter(
                flight=flight,
                seat_type=self
            ).count()

            booked_seats = Seat.objects.filter(
                flight=flight,
                seat_type=self,
                is_booked=True
            ).distinct().count()

            return total_seats - booked_seats
        return self.quantity - self.reserved_quantity

    def reserve_seats(self, count, flight):
        available_seats = self.available_seats(flight)
        print(available_seats)

        if count > available_seats:
            raise ValueError(f"Not enough available seats for flight {flight.id}")

        seats_to_reserve = Seat.objects.filter(
            flight=flight,
            seat_type=self,
            is_booked=False
        )[:count]

        for seat in seats_to_reserve:
            seat.is_booked = True
            seat.save()

    def __str__(self):
        return self.seat_type


class Airplane(models.Model):
    model = models.CharField(max_length=100, unique=True)
    seat_capacity = models.IntegerField()
    seat_types = models.ManyToManyField(SeatType, related_name="airplanes")

    def save(self, *args, **kwargs):
        if self.seat_capacity <= 0:
            raise ValueError("Seat capacity must be greater than 0")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.model


class Flight(models.Model):
    code = models.CharField(max_length=10, unique=True)
    departure_place = models.CharField(max_length=100)
    arrival_place = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    airplane = models.ForeignKey(Airplane, on_delete=models.CASCADE, related_name="flights")
    available_seats_count = models.IntegerField(default=0)  # Нове поле

    def save(self, *args, **kwargs):
        if self.departure_time >= self.arrival_time:
            raise ValueError("Departure time must be earlier than arrival time")

        if not self.pk:
            self.available_seats_count = self.airplane.seat_capacity

        super().save(*args, **kwargs)

    def update_available_seats(self):
        total_seats = self.airplane.seat_capacity
        booked_seats = Seat.objects.filter(airplane=self.airplane, is_booked=True,
                                           flight=self).count()

        self.available_seats_count = total_seats - booked_seats
        self.save()

    def __str__(self):
        return f"{self.code}: {self.departure_place} -> {self.arrival_place}"


class Seat(models.Model):
    airplane = models.ForeignKey(Airplane, on_delete=models.CASCADE, related_name="seats")
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name="seats", null=True, blank=True)
    seat_type = models.ForeignKey(SeatType, on_delete=models.CASCADE, related_name="seats")
    is_booked = models.BooleanField(default=False)
    seat_number = models.IntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.flight:
            self.flight.update_available_seats()

    def __str__(self):
        return f"{self.seat_type.seat_type} - Seat {self.seat_number}"


class Options(models.Model):
    name = models.CharField(max_length=255)
    price = models.IntegerField()  # Вартість
    description = models.TextField(blank=True, null=True)
    category = models.CharField(
        max_length=50,
        choices=[
            ('baggage', 'Baggage'),
            ('meal', 'Meal'),
            ('service', 'Service'),
        ]
    )

    def __str__(self):
        return self.name

class Passenger(models.Model):
    MALE = 'male'
    FEMALE = 'female'
    GENDER_CHOICES = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    ]

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=30, choices=GENDER_CHOICES)
    passport_number = models.CharField(max_length=25, unique=True)
    is_paid = models.BooleanField(default=False)  # Поле для відмічення оплати

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.passport_number})"

class Ticket(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='tickets', null=True, blank=True)
    ticket_number = models.CharField(max_length=10, unique=True)
    price = models.IntegerField(null=True, blank=True)
    seat = models.OneToOneField(Seat, on_delete=models.CASCADE)
    options = models.ManyToManyField('Options', blank=True)

    def save(self, *args, **kwargs):
        if self.price is not None and self.price < 0:
            raise ValueError("Price cannot be negative")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Ticket #{self.ticket_number} for {self.passenger}"
