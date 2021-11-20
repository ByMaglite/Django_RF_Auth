from django.urls import path
from .views import home, StudentList, StudentOperations

urlpatterns = [
    path('', home),
    path('student/', StudentList.as_view()),
    path('student/<int:pk>/', StudentOperations.as_view(), name="detail"),
]