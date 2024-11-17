from django.conf.urls.static import static
from django.urls import include, path

from django.shortcuts import redirect

from app import settings

from .views import (
    AuthSignInViewAPI,
    AuthLogoutViewAPI,
    AuthSignUpViewAPI,
    AuthRefreshTokenView
)

auth_patterns = [
    path('sign-up/', AuthSignUpViewAPI.as_view(), name='sign_up'),
    path('sign-in/', AuthSignInViewAPI.as_view(), name='sign_in'),
    path('logout/', AuthLogoutViewAPI.as_view(), name='logout'),
    path('refresh/', AuthRefreshTokenView.as_view(), name='refresh_token'),
]

urlpatterns = [
    path('auth/', include((auth_patterns, 'auth_api'), namespace='auth')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
