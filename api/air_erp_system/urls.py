from django.conf.urls.static import static
from django.urls import include, path

from app import settings

from .views import (
    AuthSignInViewAPI,
    AuthLogoutViewAPI,
    AuthSignUpViewAPI,
    AuthRefreshTokenViewAPI,
    FlightSearchViewAPI,
    UserView,
    FlightDetailsViewAPI,
    FlightDeparturesViewAPI,
    FlightDestinationsViewAPI,
    FlightDatesViewAPI,
    FlightBookingViewAPI,
    PaymentPassengersViewAPI,
    UserFlightsViewAPI,
    UserPassengersViewAPI,
    FlightCheckInViewAPI
)

auth_patterns = [
    path('sign-up/', AuthSignUpViewAPI.as_view(), name='sign_up'),
    path('sign-in/', AuthSignInViewAPI.as_view(), name='sign_in'),
    path('logout/', AuthLogoutViewAPI.as_view(), name='logout'),
    path('refresh/', AuthRefreshTokenViewAPI.as_view(), name='refresh_token'),
]

flight_patterns = [
    path('departures/', FlightDeparturesViewAPI.as_view(), name='departures'),
    path('destinations/', FlightDestinationsViewAPI.as_view(), name='destinations'),
    path('dates/', FlightDatesViewAPI.as_view(), name='dates'),
    path('search/', FlightSearchViewAPI.as_view(), name='search'),
    path('details/', FlightDetailsViewAPI.as_view(), name='details'),
    path('booking/', FlightBookingViewAPI.as_view(), name='booking'),
    path('check-in/', FlightCheckInViewAPI.as_view(), name='checkin'),
]

payment_patterns = [
    path('passengers/', PaymentPassengersViewAPI.as_view(), name='passengers'),
]

user_patterns = [
    path('', UserView.as_view(), name='data'),
    path('flights/', UserFlightsViewAPI.as_view(), name='flights'),
    path('passengers/', UserPassengersViewAPI.as_view(), name='passengers'),
]

urlpatterns = [
    path('auth/', include((auth_patterns, 'auth_api'), namespace='auth')),
    path('flight/', include((flight_patterns, 'flight_api'), namespace='flight')),
    path('payment/', include((payment_patterns, 'payment_api'), namespace='payment')),
    path('user/', include((user_patterns, 'user_api'), namespace='user')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
