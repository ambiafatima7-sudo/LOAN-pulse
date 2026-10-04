from django.db import models
from django.contrib.auth.models import User


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, blank=True)
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit_score = models.IntegerField(default=600)

    def __str__(self):
        return self.user.username


class LoanApplication(models.Model):
    STATUS_CHOICES = [
        ("SUBMITTED", "Submitted"),
        ("REVIEW", "Under Review"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("DISBURSED", "Disbursed"),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="applications")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    tenure_months = models.IntegerField()
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=12)
    purpose = models.CharField(max_length=200, blank=True)
    risk_score = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="SUBMITTED")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Loan #{self.id} - {self.customer} - {self.amount}"


class Disbursement(models.Model):
    application = models.OneToOneField(LoanApplication, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    disbursed_on = models.DateField(auto_now_add=True)


class Repayment(models.Model):
    application = models.ForeignKey(LoanApplication, on_delete=models.CASCADE, related_name="repayments")
    due_date = models.DateField()
    emi_amount = models.DecimalField(max_digits=12, decimal_places=2)
    paid = models.BooleanField(default=False)
    paid_on = models.DateField(null=True, blank=True)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)