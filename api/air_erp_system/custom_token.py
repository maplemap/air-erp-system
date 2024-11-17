from rest_framework_simplejwt.tokens import RefreshToken

class CustomRefreshToken(RefreshToken):
    def __init__(self, user):
        super().__init__()
        self.payload['role'] = user.role
        self.payload['user_id'] = user.id