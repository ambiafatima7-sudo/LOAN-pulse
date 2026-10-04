from datetime import date
from dateutil.relativedelta import relativedelta
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import LoanApplication, Repayment, Notification, Disbursement
from .serializers import (RegisterSerializer, LoanApplicationSerializer,
                          NotificationSerializer)


def calculate_risk_score(customer, amount, tenure):
    """Simple rule-based risk score (0-100, zyada = zyada risky)."""
    score = 50
    if customer.credit_score >= 750:
        score -= 25
    elif customer.credit_score >= 650:
        score -= 10
    else:
        score += 15

    emi_estimate = float(amount) / tenure
    if customer.monthly_income > 0:
        ratio = emi_estimate / float(customer.monthly_income)
        if ratio > 0.5:
            score += 25
        elif ratio > 0.3:
            score += 10
        else:
            score -= 10
    else:
        score += 30
    return max(0, min(100, score))


def calculate_emi(principal, annual_rate, months):
    r = float(annual_rate) / 12 / 100
    p = float(principal)
    if r == 0:
        return round(p / months, 2)
    emi = p * r * (1 + r) ** months / ((1 + r) ** months - 1)
    return round(emi, 2)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ApplyLoanView(generics.ListCreateAPIView):
    serializer_class = LoanApplicationSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return LoanApplication.objects.all().order_by("-created_at")
        return LoanApplication.objects.filter(
            customer__user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        customer = self.request.user.customer
        amount = serializer.validated_data["amount"]
        tenure = serializer.validated_data["tenure_months"]
        risk = calculate_risk_score(customer, amount, tenure)
        serializer.save(customer=customer, risk_score=risk, status="REVIEW")
        Notification.objects.create(
            user=self.request.user,
            message=f"Aapki loan application submit ho gayi (risk score: {risk}).")


class DecideLoanView(APIView):
    """Admin: approve ya reject."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        loan = LoanApplication.objects.get(pk=pk)
        decision = request.data.get("decision")
        if decision == "approve":
            loan.status = "APPROVED"
            msg = f"Aapka loan #{loan.id} approve ho gaya."
        elif decision == "reject":
            loan.status = "REJECTED"
            msg = f"Aapka loan #{loan.id} reject ho gaya."
        else:
            return Response({"error": "decision 'approve' ya 'reject' do"},
                            status=status.HTTP_400_BAD_REQUEST)
        loan.save()
        Notification.objects.create(user=loan.customer.user, message=msg)
        return Response({"status": loan.status})


class DisburseLoanView(APIView):
    """Admin: disburse + EMI schedule banao."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        loan = LoanApplication.objects.get(pk=pk)
        if loan.status != "APPROVED":
            return Response({"error": "Loan approved nahi hai"},
                            status=status.HTTP_400_BAD_REQUEST)
        Disbursement.objects.create(application=loan, amount=loan.amount)
        emi = calculate_emi(loan.amount, loan.interest_rate, loan.tenure_months)
        start = date.today()
        for i in range(1, loan.tenure_months + 1):
            Repayment.objects.create(application=loan,
                                     due_date=start + relativedelta(months=i),
                                     emi_amount=emi)
        loan.status = "DISBURSED"
        loan.save()
        Notification.objects.create(
            user=loan.customer.user,
            message=f"Loan #{loan.id} disburse ho gaya. EMI: {emi}")
        return Response({"status": "DISBURSED", "emi": emi})


class PayEMIView(APIView):
    def post(self, request, pk):
        rep = Repayment.objects.get(pk=pk, application__customer__user=request.user)
        rep.paid = True
        rep.paid_on = date.today()
        rep.save()
        return Response({"paid": True})


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")


class MeView(APIView):
    def get(self, request):
        return Response({
            "username": request.user.username,
            "is_staff": request.user.is_staff,
        })