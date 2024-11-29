from django.conf.urls.static import static
from django.urls import include, path

from app import settings

from .views import (
    AuthSignInViewAPI,
    AuthLogoutViewAPI,
    AuthSignUpViewAPI,
    AuthRefreshTokenView,
    FlightSearchAPI,
    UserView
)

auth_patterns = [
    path('sign-up/', AuthSignUpViewAPI.as_view(), name='sign_up'),
    path('sign-in/', AuthSignInViewAPI.as_view(), name='sign_in'),
    path('logout/', AuthLogoutViewAPI.as_view(), name='logout'),
    path('refresh/', AuthRefreshTokenView.as_view(), name='refresh_token'),
]

flight_patterns = [
    path('search/', FlightSearchAPI.as_view(), name='search'),
    # path('details/', AuthSignInViewAPI.as_view(), name='sign_in'),
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
