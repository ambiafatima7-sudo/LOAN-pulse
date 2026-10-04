
from django.contrib import admin
from .models import Customer, LoanApplication, Disbursement, Repayment, Notification

admin.site.register(Customer)
admin.site.register(LoanApplication)
admin.site.register(Disbursement)
admin.site.register(Repayment)
admin.site.register(Notification)