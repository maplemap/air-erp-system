from django.conf.urls.static import static
from django.urls import include, path

from app import settings

from .views import (
    LoginViewAPI,
    LogoutViewAPI,
    RegisterViewAPI,
)

api_patterns = [
    path('register/', RegisterViewAPI.as_view(), name='city'),
    path('login/', LoginViewAPI.as_view(), name='subscribe'),
    path('logout/', LogoutViewAPI.as_view(), name='subscription'),
]

urlpatterns = [
    path('api/', include((api_patterns, 'app_api'), namespace='api')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
