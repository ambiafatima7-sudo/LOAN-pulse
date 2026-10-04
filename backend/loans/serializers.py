from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, LoanApplication, Repayment, Notification


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    phone = serializers.CharField(required=False, allow_blank=True)
    monthly_income = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    credit_score = serializers.IntegerField(required=False)

    class Meta:
        model = User
        fields = ["username", "email", "password", "phone", "monthly_income", "credit_score"]

    def create(self, validated_data):
        phone = validated_data.pop("phone", "")
        income = validated_data.pop("monthly_income", 0)
        score = validated_data.pop("credit_score", 600)
        user = User.objects.create_user(**validated_data)
        Customer.objects.create(user=user, phone=phone, monthly_income=income, credit_score=score)
        return user


class RepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repayment
        fields = "__all__"


class LoanApplicationSerializer(serializers.ModelSerializer):
    repayments = RepaymentSerializer(many=True, read_only=True)

    class Meta:
        model = LoanApplication
        fields = ["id", "amount", "tenure_months", "interest_rate", "purpose",
                  "risk_score", "status", "created_at", "repayments"]
        read_only_fields = ["risk_score", "status", "interest_rate"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"