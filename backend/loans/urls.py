from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view()),
    path("login/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("loans/", views.ApplyLoanView.as_view()),
    path("loans/<int:pk>/decide/", views.DecideLoanView.as_view()),
    path("loans/<int:pk>/disburse/", views.DisburseLoanView.as_view()),
    path("repayments/<int:pk>/pay/", views.PayEMIView.as_view()),
    path("notifications/", views.NotificationListView.as_view()),
        path("me/", views.MeView.as_view()),
]