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
    quantity = models.IntegerField(default=0)
    price = models.IntegerField()

    def __str__(self):
        return self.name


class Airplane(models.Model):
    model = models.CharField(max_length=100)
    seat_capacity = models.IntegerField()
    seat_types = models.ManyToManyField(SeatType, related_name="airplanes")

    def __str__(self):
        return self.model


class Flight(models.Model):
    code = models.CharField(max_length=10, unique=True)
    departure_place = models.CharField(max_length=100)
    arrival_place = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    airplane = models.ForeignKey(Airplane, on_delete=models.CASCADE, related_name="flights")

    def __str__(self):
        return f"{self.code}: {self.departure_place} -> {self.arrival_place}"

class Seat(models.Model):
    airplane = models.ForeignKey(Airplane, on_delete=models.CASCADE)
    seat_type = models.ForeignKey(SeatType, on_delete=models.CASCADE)
    is_booked = models.BooleanField(default=False)
    seat_number = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.seat_type


class Options(models.Model):
    name = models.CharField(max_length=255)
    price = models.IntegerField()

    def __str__(self):
        return self.name


class Ticket(models.Model):
    MALE = 'male'
    FEMALE = 'female'
    GENDER = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    ticket_number = models.CharField(max_length=10, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=30, choices=GENDER)
    passport_number = models.CharField(max_length=25)
    price = models.IntegerField(null=True, blank=True)
    seat = models.OneToOneField(Seat, on_delete=models.CASCADE)
    options = models.ManyToManyField(Options, blank=True)

    def __str__(self):
        return f"Ticket #{self.ticket_number} for {self.first_name} {self.last_name}"