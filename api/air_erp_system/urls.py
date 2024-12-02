from django.conf.urls.static import static
from django.urls import include, path

from app import settings

from .views import (
    AuthSignInViewAPI,
    AuthLogoutViewAPI,
    AuthSignUpViewAPI,
    AuthRefreshTokenView,
    FlightSearchAPI,
    UserView,
    FlightDetailsAPIView,
    FlightDeparturesAPI,
    FlightDestinationsAPI,
    FlightDatesAPI
)

auth_patterns = [
    path('sign-up/', AuthSignUpViewAPI.as_view(), name='sign_up'),
    path('sign-in/', AuthSignInViewAPI.as_view(), name='sign_in'),
    path('logout/', AuthLogoutViewAPI.as_view(), name='logout'),
    path('refresh/', AuthRefreshTokenView.as_view(), name='refresh_token'),
]

flight_patterns = [
    path('departures/', FlightDeparturesAPI.as_view(), name='departures'),
    path('destinations/', FlightDestinationsAPI.as_view(), name='destinations'),
    path('dates/', FlightDatesAPI.as_view(), name='dates'),
    path('search/', FlightSearchAPI.as_view(), name='search'),
    path('details/', FlightDatesAPI.as_view(), name='details'),
    # path('booking/', AuthLogoutViewAPI.as_view(), name='logout'),
    # path('check_in/', AuthRefreshTokenView.as_view(), name='refresh_token'),
]

urlpatterns = [
    path('auth/', include((auth_patterns, 'auth_api'), namespace='auth')),
    path('flight/', include((flight_patterns, 'flight_api'), namespace='flight')),
    path('user/', UserView.as_view(), name='user'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
