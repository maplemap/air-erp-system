from rest_framework_simplejwt.tokens import AccessToken
from django.test import TestCase
from weather_reminder.models import User, Subscription


class CustomUserManagerTest(TestCase):

    def test_create_user(self):
        user = User.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("testpass123"))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_user_no_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(username="testuser", email=None, password="testpass123")

    def test_create_superuser(self):
        superuser = User.objects.create_superuser(username="adminuser", email="admin@example.com", password="adminpass123")
        self.assertEqual(superuser.username, "adminuser")
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)


class UserModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpass123")

    def test_generate_jwt_token(self):
        token = self.user.generate_jwt_token()
        decoded_token = AccessToken(token)
        self.assertEqual(decoded_token['username'], self.user.username)

    def test_str_method(self):
        self.assertEqual(str(self.user), "testuser")


class SubscriptionModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpass123")
        self.subscription = Subscription.objects.create(
            user=self.user,
            city="Kyiv",
            notification_period=Subscription.PERIOD_1_HOUR,
            notification_mode=Subscription.NOTIFICATION_MODE_EMAIL
        )

    def test_subscription_creation(self):
        self.assertEqual(self.subscription.user, self.user)
        self.assertEqual(self.subscription.city, "Kyiv")
        self.assertEqual(self.subscription.notification_period, Subscription.PERIOD_1_HOUR)
        self.assertEqual(self.subscription.notification_mode, Subscription.NOTIFICATION_MODE_EMAIL)
        self.assertTrue(self.subscription.is_scheduled)

    def test_subscription_unique_together(self):
        with self.assertRaises(Exception):
            Subscription.objects.create(user=self.user, city="Kyiv")

    def test_str_method(self):
        self.assertEqual(str(self.subscription), "testuser - Kyiv (1 hour)")

    def test_change_notification_mode(self):
        self.subscription.notification_mode = Subscription.NOTIFICATION_MODE_WEBHOOK
        self.subscription.save()
        self.subscription.refresh_from_db()
        self.assertEqual(self.subscription.notification_mode, Subscription.NOTIFICATION_MODE_WEBHOOK)