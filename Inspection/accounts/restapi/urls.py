from django.urls import path
from .api import *

urlpatterns = [
    path('usersprofilelist/', ListOfProfiles.as_view(), name="profilesList"),
    path('profiledetails/', PersonalProfileDetails.as_view(), name="profile"),
    path('memberdetails/',  MemberProfileDetails.as_view(), name="member-details"),
    path('managerprofile/', GetManagerProfile.as_view(), name="manager-profile"),
    path('usersdetails/', GetUserPersonalDetails.as_view(), name="profile-details")
]