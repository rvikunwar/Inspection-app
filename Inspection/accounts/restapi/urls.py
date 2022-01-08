from django.urls import path
from .api import *

urlpatterns = [
    path('usersprofilelist/', ListOfProfiles.as_view(), name="profilesList"),
    path('profiledetails/', PersonalProfileDetails.as_view(), name="profile"),
    path('memberdetails/',  MemberProfileDetails.as_view(), name="member-details"),
    path('managerprofile/', GetManagerProfile.as_view(), name="manager-profile"),
    path('usersdetails/', GetUserPersonalDetails.as_view(), name="profile-details"),
    path('expotoken/', AddExpoToken.as_view(), name="expo-token"),
    path('removeExpoToken/', RemoveExpoToken.as_view(), name="remove-expo-token"),
    path('updateUserProfile/<int:pk>/', UserProfileAPI.as_view(), name="user-profile"),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

]
